import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'

const announcementInput = {
  title: v.string(),
  body: v.string(),
  category: v.string(),
  isPublished: v.boolean(),
}

export const listPublicAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query('announcements')
      .withIndex('by_published', (q) => q.eq('isPublished', true))
      .order('desc')
      .take(12)

    return items
  },
})

export const listPublicPhotos = query({
  args: {},
  handler: async (ctx) => {
    const photos = await ctx.db
      .query('photos')
      .withIndex('by_published', (q) => q.eq('isPublished', true))
      .order('asc')
      .take(60)

    return Promise.all(
      photos.map(async (photo) => ({ ...photo, url: await ctx.storage.getUrl(photo.storageId) })),
    )
  },
})

export const listAdminContent = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const [announcements, photos] = await Promise.all([
      ctx.db.query('announcements').withIndex('by_updated').order('desc').take(100),
      ctx.db.query('photos').withIndex('by_updated').order('desc').take(100),
    ])

    return {
      announcements,
      photos: await Promise.all(
        photos.map(async (photo) => ({ ...photo, url: await ctx.storage.getUrl(photo.storageId) })),
      ),
    }
  },
})

export const createAnnouncement = mutation({
  args: announcementInput,
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx)
    validateText(args.title, 2, 120, 'title')
    validateText(args.body, 2, 4000, 'body')
    validateText(args.category, 2, 40, 'category')
    const now = Date.now()
    return ctx.db.insert('announcements', {
      ...args,
      title: args.title.trim(),
      body: args.body.trim(),
      category: args.category.trim(),
      publishedAt: args.isPublished ? now : undefined,
      createdAt: now,
      updatedAt: now,
      authorEmail: identity.email ?? 'admin',
    })
  },
})

export const updateAnnouncement = mutation({
  args: { id: v.id('announcements'), ...announcementInput },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    validateText(args.title, 2, 120, 'title')
    validateText(args.body, 2, 4000, 'body')
    validateText(args.category, 2, 40, 'category')
    const current = await ctx.db.get(args.id)
    if (!current) throw new ConvexError('Announcement not found.')
    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      body: args.body.trim(),
      category: args.category.trim(),
      isPublished: args.isPublished,
      publishedAt: args.isPublished ? current.publishedAt ?? Date.now() : undefined,
      updatedAt: Date.now(),
    })
  },
})

export const deleteAnnouncement = mutation({
  args: { id: v.id('announcements') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    await ctx.db.delete(args.id)
  },
})

export const generatePhotoUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.storage.generateUploadUrl()
  },
})

export const createPhoto = mutation({
  args: {
    storageId: v.id('_storage'),
    title: v.string(),
    alt: v.string(),
    category: v.string(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    validateText(args.title, 2, 120, 'title')
    validateText(args.alt, 2, 180, 'alt text')
    validateText(args.category, 2, 40, 'category')
    const latest = await ctx.db.query('photos').withIndex('by_updated').order('desc').first()
    const now = Date.now()
    return ctx.db.insert('photos', { ...args, sortOrder: (latest?.sortOrder ?? 0) + 1, createdAt: now, updatedAt: now })
  },
})

export const deletePhoto = mutation({
  args: { id: v.id('photos') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const photo = await ctx.db.get(args.id)
    if (!photo) return
    await ctx.storage.delete(photo.storageId)
    await ctx.db.delete(args.id)
  },
})

async function requireAdmin(ctx: { auth: { getUserIdentity: () => Promise<{ email?: string; subject: string } | null> } }) {
  const identity = await ctx.auth.getUserIdentity()
  const allowedEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean)
  if (!identity || !identity.email || !allowedEmails.includes(identity.email.toLowerCase())) {
    throw new ConvexError('Admin access required.')
  }
  return identity
}

function validateText(value: string, min: number, max: number, label: string) {
  const trimmed = value.trim()
  if (trimmed.length < min || trimmed.length > max) {
    throw new ConvexError(`${label} must be between ${min} and ${max} characters.`)
  }
}

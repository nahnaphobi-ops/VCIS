import { action, internalMutation, internalQuery } from './_generated/server'
import { v } from 'convex/values'

const FACEBOOK_API_VERSION = 'v19.0'
const SYNC_LIMIT = 25

/**
 * Scheduled sync from the school's Facebook page into the gallery's photo store.
 * Activates only when FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN are set in
 * the Convex dashboard. Without them the action returns early and does nothing.
 */
export const syncFacebookPhotos = action({
  args: {},
  handler: async (ctx) => {
    const pageId = process.env.FACEBOOK_PAGE_ID
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN

    if (!pageId || !accessToken) {
      return { synced: 0, note: 'Facebook credentials not configured' }
    }

    const graphUrl =
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${pageId}/photos` +
      `?fields=source,created_time,name&limit=${SYNC_LIMIT}&access_token=${accessToken}`

    const res = await fetch(graphUrl)
    if (!res.ok) {
      throw new Error(`Facebook API error: ${res.status} ${await res.text()}`)
    }

    const payload = (await res.json()) as {
      data?: Array<{ id: string; source?: string; name?: string; created_time?: string }>
    }
    const items = payload.data ?? []

    let synced = 0
    for (const item of items) {
      if (!item.source || !item.id) continue

      const existing = await ctx.runQuery(internal.facebookSync.findPhotoBySource, { sourceId: item.id })
      if (existing) continue

      const imageRes = await fetch(item.source)
      if (!imageRes.ok) continue

      const blob = await imageRes.blob()
      const storageId = await ctx.storage.store(blob)

      const title = (item.name ?? 'Facebook update').slice(0, 120)
      const now = Date.now()
      const latest = await ctx.runQuery(internal.facebookSync.latestSortOrder, {})

      await ctx.runMutation(internal.facebookSync.insertPhoto, {
        storageId,
        title,
        alt: title,
        category: 'Facebook',
        sourceId: item.id,
        sortOrder: (latest ?? 0) + 1,
        createdAt: now,
        updatedAt: now,
      })

      synced += 1
    }

    return { synced }
  },
})

export const findPhotoBySource = internalQuery({
  args: { sourceId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query('photos')
      .filter((q) => q.eq(q.field('sourceId'), args.sourceId))
      .first()
  },
})

export const latestSortOrder = internalQuery({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db.query('photos').withIndex('by_updated').order('desc').first()
    return latest?.sortOrder
  },
})

export const insertPhoto = internalMutation({
  args: {
    storageId: v.id('_storage'),
    title: v.string(),
    alt: v.string(),
    category: v.string(),
    sourceId: v.string(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert('photos', { ...args, isPublished: true })
  },
})

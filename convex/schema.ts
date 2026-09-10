import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  announcements: defineTable({
    title: v.string(),
    body: v.string(),
    category: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
    attachmentType: v.optional(v.string()),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    authorEmail: v.string(),
  })
    .index('by_published', ['isPublished', 'publishedAt'])
    .index('by_updated', ['updatedAt']),
  photos: defineTable({
    storageId: v.id('_storage'),
    title: v.string(),
    alt: v.string(),
    category: v.string(),
    isPublished: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    sourceId: v.optional(v.string()),
  })
    .index('by_published', ['isPublished', 'sortOrder'])
    .index('by_updated', ['updatedAt']),
})

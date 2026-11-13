export type PinnedAnnouncement = {
  _id: string
  title: string
  body: string
  category: string
  imageUrl: string
  attachmentType: string
  /** Hidden from this moment on, so the flyer retires itself after the event. */
  showUntil: string
}

/**
 * Announcements that ship with the site and always appear first, ahead of
 * anything posted through /admin. Remove an entry (or let `showUntil` pass)
 * and the admin-managed announcements take over again.
 */
export const pinnedAnnouncements: PinnedAnnouncement[] = [
  {
    _id: 'pinned-christmas-carol-day-2026',
    title: 'Christmas Carol Day and Annual Thanksgiving',
    category: 'Event',
    body: [
      'Join us at Victoria Crest International School as we celebrate the season with heart-warming carols, beautiful performances, and a festive atmosphere for the whole family!',
      'Date: Thursday, 17th December 2026\nTime: 10:00 AM\nVenue: VCIS Campus',
      'Christmas carols, beautiful performances, fun activities for all ages, food, drinks and snacks, an inflatable playground and face painting. See you there!',
    ].join('\n\n'),
    imageUrl: '/announcements/christmas-carol-day-2026.jpg',
    attachmentType: 'image/jpeg',
    showUntil: '2026-12-18T00:00:00Z',
  },
]

export function getPinnedAnnouncements(now: Date = new Date()): PinnedAnnouncement[] {
  return pinnedAnnouncements.filter((item) => now.getTime() < Date.parse(item.showUntil))
}

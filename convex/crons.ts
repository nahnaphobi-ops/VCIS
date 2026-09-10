import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.interval('sync facebook photos to gallery', { hours: 3 }, internal.facebookSync.syncFacebookPhotos)

export default crons

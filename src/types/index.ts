import { Event, User, RSVP, EventCategory, RSVPStatus } from '@prisma/client'

export type EventWithRelations = Event & {
  creator: User
  rsvps: RSVP[]
  _count?: {
    rsvps: number
  }
}

export type UserWithEvents = User & {
  events: Event[]
  rsvps: RSVP[]
}

export type RSVPWithEvent = RSVP & {
  event: Event
  user: User
}

export type EventFormData = {
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  category: EventCategory
  image?: string
  maxAttendees?: number
  isPrivate: boolean
  isPublished: boolean
}

export type AuthFormData = {
  email: string
  password: string
  name?: string
}

export type RSVPFormData = {
  status: RSVPStatus
}

export type { Event, User, RSVP, EventCategory, RSVPStatus }

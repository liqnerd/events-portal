"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Search, Filter, Plus } from "lucide-react"
import { EventCategory, Event as PrismaEvent } from "@/types"

export default function EventsPage() {
  const [events, setEvents] = useState<PrismaEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<PrismaEvent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "ALL">("ALL")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockEvents = [
      {
        id: "1",
        title: "Summer Music Festival 2025",
        description: "Join us for the biggest music festival of the year featuring top artists from around the world.",
        category: "CONCERT" as EventCategory,
        startDate: new Date("2025-07-15"),
        endDate: new Date("2025-07-17"),
        location: "Central Park, New York",
        maxAttendees: 1500,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrivate: false,
        isPublished: true,
        creatorId: "mock-user-1"
      },
      {
        id: "2",
        title: "Tech Conference 2025",
        description: "Discover the latest innovations in technology with industry leaders and networking opportunities.",
        category: "CONFERENCE" as EventCategory,
        startDate: new Date("2025-08-20"),
        endDate: new Date("2025-08-22"),
        location: "Convention Center, San Francisco",
        maxAttendees: 800,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrivate: false,
        isPublished: true,
        creatorId: "mock-user-2"
      },
      {
        id: "3",
        title: "Corporate Team Building",
        description: "Strengthen your team with exciting outdoor activities and team challenges.",
        category: "TEAMBUILDING" as EventCategory,
        startDate: new Date("2025-09-10"),
        endDate: new Date("2025-09-10"),
        location: "Adventure Park, Austin",
        maxAttendees: 50,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrivate: false,
        isPublished: true,
        creatorId: "mock-user-3"
      },
      {
        id: "4",
        title: "Classical Opera Night",
        description: "Experience the magic of classical opera with world-renowned performers.",
        category: "OPERA" as EventCategory,
        startDate: new Date("2025-10-05"),
        endDate: new Date("2025-10-05"),
        location: "Opera House, Chicago",
        maxAttendees: 300,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrivate: false,
        isPublished: true,
        creatorId: "mock-user-4"
      }
    ]
    
    setEvents(mockEvents)
    setFilteredEvents(mockEvents)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    setFilteredEvents(filtered)
  }, [searchTerm, selectedCategory, events])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date)
  }

  const getCategoryColor = (category: EventCategory) => {
    const colors = {
      CONCERT: "bg-blue-100 text-blue-800",
      SHOW: "bg-purple-100 text-purple-800",
      OPERA: "bg-red-100 text-red-800",
      THEATER: "bg-indigo-100 text-indigo-800",
      CONFERENCE: "bg-green-100 text-green-800",
      WORKSHOP: "bg-yellow-100 text-yellow-800",
      TEAMBUILDING: "bg-orange-100 text-orange-800",
      BIRTHDAY: "bg-pink-100 text-pink-800",
      WEDDING: "bg-rose-100 text-rose-800",
      CORPORATE: "bg-gray-100 text-gray-800",
      OTHER: "bg-slate-100 text-slate-800"
    }
    return colors[category] || colors.OTHER
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
          <p className="text-gray-600 mt-2">
            Discover amazing events happening around you
          </p>
        </div>
        <Link href="/events/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as EventCategory | "ALL")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="CONCERT">Concerts</SelectItem>
              <SelectItem value="SHOW">Shows</SelectItem>
              <SelectItem value="OPERA">Opera</SelectItem>
              <SelectItem value="THEATER">Theater</SelectItem>
              <SelectItem value="CONFERENCE">Conferences</SelectItem>
              <SelectItem value="WORKSHOP">Workshops</SelectItem>
              <SelectItem value="TEAMBUILDING">Team Building</SelectItem>
              <SelectItem value="BIRTHDAY">Birthday Parties</SelectItem>
              <SelectItem value="WEDDING">Weddings</SelectItem>
              <SelectItem value="CORPORATE">Corporate Events</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filters to find more events.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm("")
            setSelectedCategory("ALL")
          }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2" />
                  <p>Event Image</p>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category.toLowerCase().replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.startDate)}
                    {event.startDate.getTime() !== event.endDate.getTime() && (
                      <> - {formatDate(event.endDate)}</>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Max {event.maxAttendees} attendees
                  </div>
                </div>
                <Link href={`/events/${event.id}`}>
                  <Button className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

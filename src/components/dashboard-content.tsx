"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { EventWithRelations, RSVPWithEvent } from "@/types"

export function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [myEvents, setMyEvents] = useState<EventWithRelations[]>([])
  const [myRSVPs, setMyRSVPs] = useState<RSVPWithEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    // Load user's events and RSVPs
    loadDashboardData()
  }, [status, router])

  const loadDashboardData = async () => {
    try {
      const [eventsResponse, rsvpsResponse] = await Promise.all([
        fetch("/api/events/my-events"),
        fetch("/api/rsvps/my-rsvps")
      ])

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setMyEvents(eventsData.events)
      }

      if (rsvpsResponse.ok) {
        const rsvpsData = await rsvpsResponse.json()
        setMyRSVPs(rsvpsData.rsvps)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(date))
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
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

  const getRSVPStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      GOING: "bg-green-100 text-green-800",
      MAYBE: "bg-yellow-100 text-yellow-800",
      NOT_GOING: "bg-red-100 text-red-800"
    }
    return colors[status] || colors.MAYBE
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>
        <Link href="/events/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Events you've created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myRSVPs.length}</div>
            <p className="text-xs text-muted-foreground">
              Events you're attending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myRSVPs.filter(rsvp => new Date(rsvp.event.startDate) > new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Upcoming events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="rsvps">My RSVPs</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Events I've Created</h2>
          </div>

          {myEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't created any events yet. Start by creating your first event!
                </p>
                <Link href="/events/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {myEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category.toLowerCase().replace('_', ' ')}
                          </Badge>
                          {!event.isPublished && (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {event.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.startDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        Max {event.maxAttendees || '∞'} attendees
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/events/${event.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rsvps" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Events I'm Attending</h2>
          </div>

          {myRSVPs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No RSVPs yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't RSVP'd to any events yet. Browse events to get started!
                </p>
                <Link href="/events">
                  <Button>
                    Browse Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {myRSVPs.map((rsvp) => (
                <Card key={rsvp.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(rsvp.event.category)}>
                            {rsvp.event.category.toLowerCase().replace('_', ' ')}
                          </Badge>
                          <Badge className={getRSVPStatusColor(rsvp.status)}>
                            {rsvp.status.toLowerCase().replace('_', ' ')}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{rsvp.event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {rsvp.event.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(rsvp.event.startDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {rsvp.event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        Max {rsvp.event.maxAttendees || '∞'} attendees
                      </div>
                    </div>
                    <Link href={`/events/${rsvp.event.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Event
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

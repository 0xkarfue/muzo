"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, Music, Share2, Play, Users, LayoutDashboard, Plus, Eye, Vote, Crown, TrendingUp } from "lucide-react"
import axios from "axios"
import { useSession } from "next-auth/react"

interface Stream {
  id: string
  title: string
  url: string
  extractedId: string
  smallImg: string
  bigImg: string
  type: string
  userId: string
  createdAt: string
  votes?: number
  isActive?: boolean
  participantCount?: number
}

export default function MusicDemocracyDashboard() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'analytics'>('create')
  const [videoUrl, setVideoUrl] = useState("")
  const [previewVideo, setPreviewVideo] = useState<any>(null)
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch streams when manage tab is active
  useEffect(() => {
    if (activeTab === 'manage' || activeTab === 'analytics') {
      fetchStreams()
    }
  }, [activeTab])

  const fetchStreams = async () => {
    try {
      setLoading(true)
      const userRes = await axios.get("http://localhost:3000/api/my")
      const streamsRes = await axios.get(`http://localhost:3000/api/streams?creatorId=${userRes.data.id}`)
      // Mock some additional data for democracy features
      const streamsWithMockData = (streamsRes.data.streams || []).map((stream: Stream) => ({
        ...stream,
        votes: Math.floor(Math.random() * 500) + 10,
        isActive: Math.random() > 0.3,
        participantCount: Math.floor(Math.random() * 100) + 5
      }))
      setStreams(streamsWithMockData)
    } catch (error) {
      console.error("Error fetching streams:", error)
    } finally {
      setLoading(false)
    }
  }

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const handleUrlChange = (url: string) => {
    setVideoUrl(url)
    const videoId = extractVideoId(url)
    if (videoId) {
      setPreviewVideo({
        id: videoId,
        title: "Preview Video",
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        url: `https://www.youtube.com/embed/${videoId}`,
      })
    } else {
      setPreviewVideo(null)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('copied');
  }

  async function createStream() {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:3000/api/my") 
      const data = {
        creatorId: res.data.id,
        url: videoUrl
      }
      await axios.post("http://localhost:3000/api/streams", data)
      setVideoUrl("")
      setPreviewVideo(null)
      // Refresh streams if we're on manage tab
      if (activeTab === 'manage') {
        fetchStreams()
      }
    } catch (error) {
      console.error("Error creating stream:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStreamStatus = async (streamId: string) => {
    // Mock toggle functionality - replace with actual API call
    setStreams(prev => prev.map(stream => 
      stream.id === streamId 
        ? { ...stream, isActive: !stream.isActive }
        : stream
    ))
  }

  const totalVotes = streams.reduce((sum, stream) => sum + (stream.votes || 0), 0)
  const activeStreams = streams.filter(s => s.isActive).length
  const totalParticipants = streams.reduce((sum, stream) => sum + (stream.participantCount || 0), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <Crown className="h-8 w-8 text-primary" /> */}
            <Music className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Muzo</span>
            <Badge className="bg-primary/10 text-primary border-primary/20">Creator Dashboard</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-secondary/20 text-accent border-secondary/30">
              <Vote className="h-3 w-3 mr-1" />
              {totalVotes} total votes
            </Badge>
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex space-x-4 border-b border-border">
          <Button
            variant={activeTab === 'create' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('create')}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Stream</span>
          </Button>
          <Button
            variant={activeTab === 'manage' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('manage')}
            className="flex items-center space-x-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Manage Streams</span>
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('analytics')}
            className="flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {activeTab === 'create' ? (
          /* Create Stream Tab */
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Create a Music Democracy Stream</h1>
              <p className="text-muted-foreground">Let your audience vote on what plays next. Democracy in action!</p>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Music className="h-5 w-5 text-primary" />
                  <span>New Stream Setup</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      YouTube Video URL
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Paste YouTube video URL here... (e.g., https://youtube.com/watch?v=...)"
                        value={videoUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={createStream} disabled={!previewVideo || loading}>
                        {loading ? "Creating..." : "Create Stream"}
                      </Button>
                    </div>
                  </div>

                  {previewVideo && (
                    <div className="p-6 bg-secondary/10 rounded-lg border border-border/50">
                      <h3 className="font-semibold mb-4">Stream Preview</h3>
                      <div className="flex items-center space-x-4">
                        <img
                          src={previewVideo.thumbnail || "/placeholder.svg"}
                          alt="Video thumbnail"
                          className="w-32 h-20 object-cover rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <p className="font-medium">Ready to create your democracy stream!</p>
                          <p className="text-sm text-muted-foreground">
                            Once created, users will be able to vote on this content and suggest alternatives.
                          </p>
                          <div className="flex space-x-2">
                            <Badge variant="outline">Democratic Voting</Badge>
                            <Badge variant="outline">Real-time Results</Badge>
                            <Badge variant="outline">Community Driven</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                  <div className="text-center space-y-2">
                    <Vote className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-semibold">Democratic Voting</h3>
                    <p className="text-sm text-muted-foreground">Your audience votes on what they want to hear</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Users className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-semibold">Community Engagement</h3>
                    <p className="text-sm text-muted-foreground">Build an active community around your music</p>
                  </div>
                  <div className="text-center space-y-2">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-semibold">Real-time Analytics</h3>
                    <p className="text-sm text-muted-foreground">Track votes, engagement, and trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : activeTab === 'manage' ? (
          /* Manage Streams Tab */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Manage Your Democracy Streams</h2>
                <p className="text-muted-foreground">Control your active streams and monitor voting activity</p>
              </div>
              <Button onClick={() => setActiveTab('create')} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create New Stream</span>
              </Button>
            </div>

            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your streams...</p>
                  </div>
                </CardContent>
              </Card>
            ) : streams.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Crown className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No democracy streams yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first stream to start building your music democracy!</p>
                  <Button onClick={() => setActiveTab('create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Stream
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {streams.map((stream) => (
                  <Card key={stream.id} className="border-border/50 hover:border-primary/20 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-2 mb-2">{stream.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant={stream.isActive ? "default" : "secondary"}>
                              {stream.isActive ? "Live" : "Inactive"}
                            </Badge>
                            <Badge variant="outline" className="bg-secondary/10">
                              {stream.type}
                            </Badge>
                          </div>
                        </div>
                        <img
                          src={stream.smallImg || "/placeholder.svg"}
                          alt={stream.title}
                          className="w-16 h-10 object-cover rounded flex-shrink-0 ml-4"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Voting Stats */}
                      <div className="grid grid-cols-3 gap-4 py-3 bg-secondary/10 rounded-lg px-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{stream.votes}</div>
                          <div className="text-xs text-muted-foreground">Votes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{stream.participantCount}</div>
                          <div className="text-xs text-muted-foreground">Participants</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            {Math.round((stream.votes || 0) / (stream.participantCount || 1) * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Engagement</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(`/stream/${stream.id}`, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => toggleStreamStatus(stream.id)}
                        >
                          {stream.isActive ? "Pause" : "Activate"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/stream/${stream.id}`)}
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(stream.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Analytics Tab */
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Democracy Analytics</h2>
              <p className="text-muted-foreground">Track the performance of your music democracy streams</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Streams</p>
                      <p className="text-3xl font-bold text-primary">{streams.length}</p>
                    </div>
                    <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Streams</p>
                      <p className="text-3xl font-bold text-primary">{activeStreams}</p>
                    </div>
                    <Play className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                      <p className="text-3xl font-bold text-primary">{totalVotes}</p>
                    </div>
                    <ArrowUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                      <p className="text-3xl font-bold text-primary">{totalParticipants}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Streams */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Top Performing Democracy Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {streams
                    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                    .slice(0, 5)
                    .map((stream, index) => (
                      <div key={stream.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary/10">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <img
                          src={stream.smallImg || "/placeholder.svg"}
                          alt={stream.title}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-1">{stream.title}</h4>
                          <p className="text-xs text-muted-foreground">{stream.participantCount} participants</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{stream.votes}</div>
                          <div className="text-xs text-muted-foreground">votes</div>
                        </div>
                        <Badge variant={stream.isActive ? "default" : "secondary"}>
                          {stream.isActive ? "Live" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Engagement Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Votes per Stream</span>
                      <span className="font-medium">
                        {streams.length ? Math.round(totalVotes / streams.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Participants per Stream</span>
                      <span className="font-medium">
                        {streams.length ? Math.round(totalParticipants / streams.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Stream Rate</span>
                      <span className="font-medium">
                        {streams.length ? Math.round((activeStreams / streams.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Democracy Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Community Engagement</span>
                      <Badge variant="default">High</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Voting Activity</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Stream Quality</span>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, Music, Share2, Play, Users } from "lucide-react"
import axios from "axios"
import { useSession } from "next-auth/react"

interface Video {
  id: string
  title: string
  thumbnail: string
  votes: number
  submittedBy: string
  url: string
}

export default function VotePage() {
  const [videoUrl, setVideoUrl] = useState("")
  const [previewVideo, setPreviewVideo] = useState<any>(null)
  const [currentVideo] = useState<Video>({
    id: "current",
    title: "Blinding Lights - The Weeknd",
    thumbnail: "/music-video-thumbnail.png",
    votes: 247,
    submittedBy: "musicfan123",
    url: "https://www.youtube.com/embed/4NRXx6U8ABQ",
  })

  const [queue, setQueue] = useState<Video[]>([
    {
      id: "1",
      title: "Midnight City - M83",
      thumbnail: "/midnight-city-inspired.png",
      votes: 189,
      submittedBy: "synthwave_lover",
      url: "https://www.youtube.com/embed/dX3k_QDnzHE",
    },
    {
      id: "2",
      title: "Good 4 U - Olivia Rodrigo",
      thumbnail: "/good-4-u-inspired.png",
      votes: 156,
      submittedBy: "pop_princess",
      url: "https://www.youtube.com/embed/gNi_6U5Pm_o",
    },
    {
      id: "3",
      title: "Levitating - Dua Lipa",
      thumbnail: "/levitating-music-video.png",
      votes: 134,
      submittedBy: "dance_vibes",
      url: "https://www.youtube.com/embed/TUVcZfQe-Kw",
    },
    {
      id: "4",
      title: "Heat Waves - Glass Animals",
      thumbnail: "/heat-waves-music-video.png",
      votes: 98,
      submittedBy: "indie_fan",
      url: "https://www.youtube.com/embed/mRD0-GxqHVo",
    },
  ])

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

  const handleVote = (videoId: string) => {
    setQueue((prev) =>
      prev
        .map((video) => (video.id === videoId ? { ...video, votes: video.votes + 1 } : video))
        .sort((a, b) => b.votes - a.votes),
    )
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    // You could add a toast notification here
  }

  const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes)

  async function sendReqPost() {
    const res = await axios.get("http://localhost:3000/api/my") 
    // console.log(res.data)
    const data = {
      creatorId: res.data.id,
      url: videoUrl
    }
    axios.post("http://localhost:3000/api/streams", data)
  }

  // const session = useSession()
  // const id = session.data?.user.id
  // function sendReqPost() {
  //   console.log("clicked!")
  //   const data = {
  //     creatorId: id,
  //     url: videoUrl
  //   }
  //   axios.post("http://localhost:3000/api/streams", data)
  // }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Muzo</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-secondary/20 text-accent border-secondary/30">
              <Users className="h-3 w-3 mr-1" />
              24 fans voting
            </Badge>
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Play className="h-5 w-5 text-primary" />
                    <span>Now Playing</span>
                  </span>
                  <Badge className="bg-accent/10 text-accent border-accent/20">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-secondary/10 rounded-lg overflow-hidden mb-4">
                  <iframe
                    src={currentVideo.url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{currentVideo.title}</h3>
                    <p className="text-sm text-muted-foreground">Submitted by {currentVideo.submittedBy}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <ArrowUp className="h-4 w-4" />
                    <span className="font-medium">{currentVideo.votes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit New Video */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Submit a Song</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Paste YouTube video URL here..."
                    value={videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={sendReqPost} disabled={!previewVideo}>Add to Queue</Button>
                </div>

                {previewVideo && (
                  <div className="flex items-center space-x-4 p-4 bg-secondary/10 rounded-lg">
                    <img
                      src={previewVideo.thumbnail || "/placeholder.svg"}
                      alt="Video thumbnail"
                      className="w-20 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Ready to add to queue</p>
                      <p className="text-xs text-muted-foreground">Preview looks good!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Queue Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Up Next</span>
                  <Badge variant="secondary" className="bg-secondary/20 text-accent">
                    {sortedQueue.length} songs
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sortedQueue.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/10 transition-colors"
                  >
                    <div className="flex-shrink-0 relative">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">{video.title}</h4>
                      <p className="text-xs text-muted-foreground">by {video.submittedBy}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(video.id)}
                        className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-medium text-muted-foreground">{video.votes}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Votes</span>
                  <span className="font-medium">
                    {sortedQueue.reduce((sum, video) => sum + video.votes, 0) + currentVideo.votes}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Songs in Queue</span>
                  <span className="font-medium">{sortedQueue.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Fans</span>
                  <span className="font-medium">24</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

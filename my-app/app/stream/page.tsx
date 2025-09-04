"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ArrowUp,
    ArrowDown,
    Music,
    Share2,
    Users,
    Vote,
    Crown,
    Eye,
    Clock,
    Flame,
    TrendingUp,
    ThumbsUp,
    ThumbsDown
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import axios from "axios"

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
    votes: number
    downvotes: number
    isActive: boolean
    participantCount: number
    creator: {
        name: string
        avatar?: string
    }
}

interface VotingStats {
    upvotes: number
    downvotes: number
    totalVotes: number
    userVote: 'up' | 'down' | null
    engagement: number
}

export default function StreamViewerPage() {
    // Mock stream data - replace with actual API calls
    const [stream] = useState<Stream>({
        id: "stream-123",
        title: "Epic Gaming Music Mix - Best Electronic Beats for Focus & Energy",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        extractedId: "dQw4w9WgXcQ",
        smallImg: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
        bigImg: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        type: "YouTube",
        userId: "creator-123",
        createdAt: "2024-12-01T10:00:00Z",
        votes: 342,
        downvotes: 28,
        isActive: true,
        participantCount: 156,
        creator: {
            name: "MusicMaestro",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MusicMaestro"
        }
    })

    const searchParams = useSearchParams()

    async function upvote() {
        const res = await axios.get("http://localhost:3000/api/my")
        const userId = res.data.id;
        const streamId = searchParams.get("id");
        const data = {
            userId,
            streamId
        }
        axios.post("http://localhost:3000/api/streams/upvote", data);
    }

    async function downvote() {
        const res = await axios.get("http://localhost:3000/api/my")
        const userId = res.data.id;
        const streamId = searchParams.get("id");
        const data = {
            userId,
            streamId
        }
        axios.post("http://localhost:3000/api/streams/downvote", data);
    }


    const [votingStats, setVotingStats] = useState<VotingStats>({
        upvotes: 342,
        downvotes: 28,
        totalVotes: 370,
        userVote: null,
        engagement: 92
    })

    const [isLoading, setIsLoading] = useState(false)
    const [viewCount, setViewCount] = useState(1247)

    // Mock related streams
    const [relatedStreams] = useState([
        {
            id: "stream-456",
            title: "Chill Lo-Fi Hip Hop Radio",
            smallImg: "https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg",
            votes: 198,
            participantCount: 89,
            isActive: true
        },
        {
            id: "stream-789",
            title: "Synthwave Retrowave Mix",
            smallImg: "https://img.youtube.com/vi/4xDzrJKXOOY/mqdefault.jpg",
            votes: 156,
            participantCount: 67,
            isActive: true
        },
        {
            id: "stream-101",
            title: "Classical Music for Study",
            smallImg: "https://img.youtube.com/vi/EhO_MrRfftU/mqdefault.jpg",
            votes: 234,
            participantCount: 45,
            isActive: false
        }
    ])

    useEffect(() => {
        // Simulate view count increment
        const timer = setTimeout(() => {
            setViewCount(prev => prev + 1)
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    const handleVote = async (type: 'up' | 'down') => {
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setVotingStats(prev => {
                const newStats = { ...prev }

                // Remove previous vote if exists
                if (prev.userVote === 'up') {
                    newStats.upvotes -= 1
                } else if (prev.userVote === 'down') {
                    newStats.downvotes -= 1
                }

                // Add new vote or toggle off
                if (prev.userVote === type) {
                    newStats.userVote = null
                } else {
                    newStats.userVote = type
                    if (type === 'up') {
                        newStats.upvotes += 1
                    } else {
                        newStats.downvotes += 1
                    }
                }

                newStats.totalVotes = newStats.upvotes + newStats.downvotes
                newStats.engagement = Math.round((newStats.upvotes / newStats.totalVotes) * 100)

                return newStats
            })
            setIsLoading(false)
        }, 500)
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        alert('Stream link copied to clipboard!')
    }

    const votePercentage = votingStats.totalVotes > 0 ? (votingStats.upvotes / votingStats.totalVotes) * 100 : 0

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Music className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold text-foreground">Muzo</span>
                        <Badge className="bg-primary/10 text-primary border-primary/20">Democracy Stream</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Badge className="bg-secondary/20 text-accent border-secondary/30">
                            <Users className="h-3 w-3 mr-1" />
                            {stream.participantCount} watching
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                            <Eye className="h-3 w-3 mr-1" />
                            {viewCount} views
                        </Badge>
                        <Button onClick={handleShare} variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Stream
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <Card className="border-border/50">
                            <CardContent className="p-0">
                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${stream.extractedId}?autoplay=1&rel=0`}
                                        className="w-full h-full"
                                        allowFullScreen
                                        title={stream.title}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stream Info */}
                        <Card className="border-border/50">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-foreground mb-2">{stream.title}</h1>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <span className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>Started {new Date(stream.createdAt).toLocaleDateString()}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <Flame className="h-4 w-4" />
                                                <span>{stream.type}</span>
                                            </span>
                                            <Badge variant={stream.isActive ? "default" : "secondary"}>
                                                {stream.isActive ? "Live Democracy" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Creator Info */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Crown className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{stream.creator.name}</p>
                                            <p className="text-sm text-muted-foreground">Stream Creator</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Democracy Description */}
                                    <div className="bg-secondary/10 rounded-lg p-4 border border-border/50">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Vote className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold text-foreground">Music Democracy in Action</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            This is a community-driven music stream! Vote up if you love what's playing,
                                            or vote down if you'd prefer something different. Your voice shapes the music experience!
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Voting Panel */}
                        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Vote className="h-5 w-5 text-primary" />
                                    <span>Vote on This Stream</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Vote Buttons */}
                                <div className="flex space-x-3">
                                    <Button
                                        // onClick={() => handleVote('up')}
                                        onClick={() => upvote()}
                                        disabled={isLoading}
                                        variant={votingStats.userVote === 'up' ? 'default' : 'outline'}
                                        className="flex-1 flex items-center justify-center space-x-2 h-12"
                                    >
                                        <ThumbsUp className="h-5 w-5" />
                                        <span className="font-semibold">{votingStats.upvotes}</span>
                                    </Button>
                                    <Button
                                        // onClick={() => handleVote('down')}
                                        onClick={() => downvote()}
                                        disabled={isLoading}
                                        variant={votingStats.userVote === 'down' ? 'destructive' : 'outline'}
                                        className="flex-1 flex items-center justify-center space-x-2 h-12"
                                    >
                                        <ThumbsDown className="h-5 w-5" />
                                        <span className="font-semibold">{votingStats.downvotes}</span>
                                    </Button>
                                </div>

                                {/* Voting Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Community Approval</span>
                                        <span className="font-semibold text-primary">{Math.round(votePercentage)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${votePercentage}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-muted-foreground text-center">
                                        {votingStats.totalVotes} total votes from the community
                                    </div>
                                </div>

                                {/* Voting Stats */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-primary">{votingStats.engagement}%</div>
                                        <div className="text-xs text-muted-foreground">Engagement</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-primary">{stream.participantCount}</div>
                                        <div className="text-xs text-muted-foreground">Participants</div>
                                    </div>
                                </div>

                                {votingStats.userVote && (
                                    <div className="text-center text-sm text-muted-foreground bg-secondary/20 rounded-lg py-2 px-3">
                                        {votingStats.userVote === 'up' ? '✓ You voted up!' : '✗ You voted down!'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Live Stats */}
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-base">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    <span>Live Democracy Stats</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Active Voters</span>
                                    <span className="font-semibold text-primary">{Math.floor(stream.participantCount * 0.6)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Avg. Vote Time</span>
                                    <span className="font-semibold">2.3 min</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Democracy Health</span>
                                    <Badge variant="default" className="text-xs">Excellent</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Streams */}
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-base">Other Democracy Streams</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {relatedStreams.map((relatedStream) => (
                                    <div key={relatedStream.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary/10 cursor-pointer transition-colors">
                                        <img
                                            src={relatedStream.smallImg}
                                            alt={relatedStream.title}
                                            className="w-16 h-10 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-foreground line-clamp-2">{relatedStream.title}</h4>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge
                                                    variant={relatedStream.isActive ? "default" : "secondary"}
                                                    className="text-xs"
                                                >
                                                    {relatedStream.isActive ? "Live" : "Inactive"}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {relatedStream.votes} votes
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
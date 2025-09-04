"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Music, 
  Vote, 
  Users, 
  Crown, 
  Play, 
  TrendingUp,
  Shield,
  Zap
} from "lucide-react"
import { signIn, getSession } from "next-auth/react"

export default function CustomAuthPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: true 
      })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock stats for visual appeal
  const stats = {
    activeStreams: 1247,
    totalVotes: 45892,
    onlineUsers: 3456,
    creators: 892
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Muzo</span>
            <Badge className="bg-primary/10 text-primary border-primary/20">Music Democracy</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-secondary/20 text-accent border-secondary/30">
              <Users className="h-3 w-3 mr-1" />
              {stats.onlineUsers} online
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.activeStreams} live streams
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Branding & Features */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                    Welcome to <span className="text-primary">Muzo</span>
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Where music meets democracy
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Join thousands of music lovers in the ultimate democratic music experience. 
                Create streams, vote on tracks, and let the community decide what plays next!
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/10 border border-border/50">
                <Vote className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">Democratic Voting</p>
                  <p className="text-xs text-muted-foreground">Community decides the music</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/10 border border-border/50">
                <Play className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">Live Streaming</p>
                  <p className="text-xs text-muted-foreground">Real-time music sessions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/10 border border-border/50">
                <Users className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">Community Driven</p>
                  <p className="text-xs text-muted-foreground">Connect with music lovers</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/10 border border-border/50">
                <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">Real-time Analytics</p>
                  <p className="text-xs text-muted-foreground">Track engagement & trends</p>
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/50">
                <div className="text-2xl font-bold text-primary">{stats.activeStreams.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Active Streams</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/50">
                <div className="text-2xl font-bold text-primary">{stats.totalVotes.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Votes</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/50">
                <div className="text-2xl font-bold text-primary">{stats.onlineUsers.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Online Now</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/50">
                <div className="text-2xl font-bold text-primary">{stats.creators.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Creators</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md border-border/50 bg-gradient-to-br from-card to-secondary/5">
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">Join the Democracy</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Sign in to start creating and voting on music streams
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Google Sign In Button */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full h-12 text-base font-semibold bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md"
                  variant="outline"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </div>
                  )}
                </Button>

                <Separator className="my-6" />

                {/* Benefits */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground text-center">What you get:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                      <span className="text-muted-foreground">Create unlimited democracy streams</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                      <span className="text-muted-foreground">Vote on community music choices</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                      <span className="text-muted-foreground">Access detailed analytics dashboard</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                      <span className="text-muted-foreground">Join the global music democracy</span>
                    </div>
                  </div>
                </div>

                {/* Quick Start */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Quick Start</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sign in → Create your first stream → Share with friends → Let democracy decide the music!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© 2024 Muzo - Music Democracy Platform</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Vote className="h-3 w-3" />
                <span>Democratic</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>Community</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
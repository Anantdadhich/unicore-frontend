"use client"

import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { Zap, ArrowLeft, BarChart3, Settings, History } from "lucide-react"
import SwapInterface from "@/components/SwapInterface"
import { SwapIntent, SwapRoute } from "@/lib/types"
import Link from "next/link"

export default function SwapPage() {
  const { address, isConnected } = useAccount()
  const [routes, setRoutes] = useState<SwapRoute[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSwapIntent = async (intent: SwapIntent) => {
    setIsLoading(true)
    try {
      const intentResponse = await fetch("/api/swap-intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intent),
      })
      if (intentResponse.ok) {
        const routesResponse = await fetch("/api/routes/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...intent, includePrivacy: true }),
        })
        if (routesResponse.ok) {
          const routesData = await routesResponse.json()
          setRoutes(routesData.routes)
        }
      }
    } catch (error) {
      console.error("Swap intent creation failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UniCore</h1>
                <p className="text-xs text-gray-500">Swap Interface</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-900 text-white rounded-lg">
                <BarChart3 className="w-4 h-4" />
                <span>Swap</span>
              </button>
              <Link href="/app/analytics" className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
              <Link href="/app/history" className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900">
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
            </nav>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Swap Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <SwapInterface
                onSwapIntent={handleSwapIntent}
                routes={routes}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Sidebar with Stats/Info */}
          <div className="space-y-6">
            {/* Portfolio Balance */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Balance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-semibold text-gray-900">$4,350</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">24h Change</span>
                  <span className="font-semibold text-green-600">+2.4%</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Swaps</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">ETH → USDC</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                  <div className="text-sm text-gray-600">0.5 ETH</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">USDT → DAI</div>
                    <div className="text-xs text-gray-500">1 day ago</div>
                  </div>
                  <div className="text-sm text-gray-600">1,000 USDT</div>
                </div>
              </div>
            </div>

            {/* Chain Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ethereum</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Active</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Polygon</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Active</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Arbitrum</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Slow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

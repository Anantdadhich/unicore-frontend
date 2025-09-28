"use client"

import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import {
  Zap,
  Shield,
  TrendingUp,
  Layers,
  Globe,
 
  BarChart3,
  Users,
} from "lucide-react"
import SwapInterface from "@/components/SwapInterface"
import ChatAssistant from "@/components/ChatAssistant"
import SolverDashboard from "@/components/SolverDashboard"
import type { SwapIntent, SwapRoute } from "@/lib/types"
import Link from "next/link"

export default function Home() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<"swap" | "solver">("swap")
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

  const handleChatSwapIntent = (intent: SwapIntent) => {
    handleSwapIntent(intent)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* Clean Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
     
            <div>
              <h1 className="text-xl font-bold text-gray-900">UniCore</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Cross-Chain DeFi</p>
            </div>
          </div>
          
          
<nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
  <Link href="/swap" className="hover:text-gray-900 transition-colors">
    Protocol
  </Link>
  <a href="/docs" className="hover:text-gray-900 transition-colors">
    Documentation
  </a>

</nav>

          
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </header>

      {/* Hero Section - Simplified */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 font-medium">
            AI-Powered Cross-Chain Protocol
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
          Hunt for Digital Liquidity,<br />
          <span className="text-gray-600">Cultivate Your DeFi Portfolio</span>
        </h2>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
          Traders and institutions looking to maximize their earnings through strategic 
          cross-chain swaps with zero-knowledge privacy and AI optimization.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
  

<Link href="/swap">
  <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
    Launch Protocol
  </button>
</Link>

<Link href="/solver">
  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
    Open Swap Interface
  </button>
</Link>

        </div>

        {/* Stats Grid - Clean */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { value: "$2.4B+", label: "Total Volume", icon: BarChart3 },
            { value: "50+", label: "Blockchains", icon: Layers },
            { value: "100K+", label: "Active Users", icon: Users },
            { value: "99.9%", label: "Uptime", icon: Shield },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-gray-700" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards - Minimal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Zero-Knowledge Privacy",
              description: "Military-grade cryptographic protection using zk-SNARKs for complete transaction privacy.",
              highlight: "Private & Secure",
            },
            {
              icon: TrendingUp,
              title: "AI Route Optimization",
              description: "Machine learning algorithms find optimal execution paths with minimal slippage across chains.",
              highlight: "Smart Execution",
            },
            {
              icon: Globe,
              title: "Cross-Chain Network",
              description: "Decentralized solver network providing deep liquidity across all major blockchains.",
              highlight: "Universal Access",
            },
          ].map(({ icon: Icon, title, description, highlight }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {highlight}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Chat Assistant */}
      <ChatAssistant onSwapIntentDetected={handleChatSwapIntent} />

      {/* Clean Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">UniCore</span>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Protocol</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-md mb-6">
                The future of cross-chain DeFi with AI optimization, 
                zero-knowledge privacy, and universal blockchain connectivity.
              </p>
              <div className="flex space-x-3">
                {["Twitter", "Discord", "GitHub"].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    aria-label={platform}
                  >
                    {platform.slice(0, 2)}
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Protocol",
                links: ["Swap Intents", "Route Optimization", "ZK Privacy", "Solver Network"],
              },
              {
                title: "Developers",
                links: ["Documentation", "API Reference", "SDK", "GitHub"],
              },
              {
                title: "Community",
                links: ["Discord", "Twitter", "Telegram", "Blog"],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
                <ul className="space-y-3">
                  {links.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 UniCore Protocol. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="hover:text-gray-900 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

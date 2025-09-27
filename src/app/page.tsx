"use client"

import { useState, useEffect } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { Zap, Shield, Users, ArrowRight } from "lucide-react"
import SwapInterface from "@/components/SwapInterface"
import ChatAssistant from "@/components/ChatAssistant"
import SolverDashboard from "@/components/SolverDashboard"
import { SwapIntent, SwapRoute } from "@/lib/types"

export default function Home() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<"swap" | "solver">("swap")
  const [routes, setRoutes] = useState<SwapRoute[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSwapIntent = async (intent: SwapIntent) => {
    setIsLoading(true)
    try {
      // Create swap intent
      const intentResponse = await fetch("/api/swap-intents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(intent),
      })

      if (intentResponse.ok) {
        // Get optimized routes
        const routesResponse = await fetch("/api/routes/optimize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...intent,
            includePrivacy: true,
          }),
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UniCore</h1>
                <p className="text-xs text-gray-600">Cross-Chain DeFi Protocol</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Cross-Chain{" "}
              </span>
              Swaps
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of DeFi with zero-knowledge privacy, intelligent route optimization, 
              and seamless cross-chain liquidity aggregation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ZK Privacy</h3>
              <p className="text-gray-600 text-sm">
                Protect your trading patterns with zero-knowledge proofs and privacy-preserving swaps.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Optimization</h3>
              <p className="text-gray-600 text-sm">
                Intelligent route finding across multiple chains for optimal execution and minimal slippage.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Solver Network</h3>
              <p className="text-gray-600 text-sm">
                Decentralized solver network providing liquidity and execution across all major chains.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
              <button
                onClick={() => setActiveTab("swap")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "swap"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Swap Interface
              </button>
              <button
                onClick={() => setActiveTab("solver")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "solver"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Solver Dashboard
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "swap" ? (
              <div className="flex justify-center">
                <SwapInterface
                  onSwapIntent={handleSwapIntent}
                  routes={routes}
                  isLoading={isLoading}
                />
              </div>
            ) : (
              <SolverDashboard solverAddress={isConnected ? address : undefined} />
            )}
          </motion.div>
        </div>
      </section>

      {/* Chat Assistant */}
      <ChatAssistant onSwapIntentDetected={handleChatSwapIntent} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">UniCore</span>
              </div>
              <p className="text-gray-400 text-sm">
                The future of cross-chain DeFi with AI-powered optimization and ZK privacy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Protocol</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Swap Intents</li>
                <li>Route Optimization</li>
                <li>ZK Privacy</li>
                <li>Solver Network</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>GitHub</li>
                <li>Discord</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Bug Reports</li>
                <li>Feature Requests</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 UniCore Protocol. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
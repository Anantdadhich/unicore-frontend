"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpDown, Zap, Shield, Clock, TrendingUp } from "lucide-react"
import type { SwapIntent, SwapRoute } from "@/lib/types"
import { formatAmount } from "@/lib/utils"

interface SwapInterfaceProps {
  onSwapIntent: (intent: SwapIntent) => void
  routes?: SwapRoute[]
  isLoading?: boolean
}

export default function SwapInterface({ onSwapIntent, routes = [], isLoading }: SwapInterfaceProps) {
  // Common token addresses for better UX
  const COMMON_TOKENS = {
    ETH: "0x0000000000000000000000000000000000000000", // Native ETH
    USDC: "0xA0b86a33E6441b8C4C8C0E1234567890abcdef12", // USDC on Ethereum
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT on Ethereum
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH on Ethereum
  }

  const [tokenIn, setTokenIn] = useState(COMMON_TOKENS.ETH)
  const [tokenOut, setTokenOut] = useState(COMMON_TOKENS.USDC)
  const [amountIn, setAmountIn] = useState("0.01")
  const [minAmountOut, setMinAmountOut] = useState("")
  const [dstChainId, setDstChainId] = useState(1) // Ethereum mainnet
  const [includePrivacy, setIncludePrivacy] = useState(false)

  const handleSwap = async () => {
    const intent: SwapIntent = {
      tokenIn,
      tokenOut,
      amountIn,
      minAmountOut,
      dstChainId,
    }

    // First get a quote from 1inch
    try {
      const quoteResponse = await fetch(
        `/api/swap?fromTokenAddress=${tokenIn}&toTokenAddress=${tokenOut}&amount=${amountIn}&slippage=0.5`,
      )

      if (quoteResponse.ok) {
        const quoteData = await quoteResponse.json()
        if (quoteData.success) {
          // Update minAmountOut with actual quote
          setMinAmountOut(quoteData.data.toTokenAmount)
        }
      }
    } catch (error) {
      console.error("Failed to get quote:", error)
    }

    onSwapIntent(intent)
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 border border-zinc-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">UniCore Swap</h2>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-zinc-900" />
          <span className="text-sm text-zinc-600">Private</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Token In */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">From</label>
          <div className="flex space-x-2">
            <select
              value={tokenIn}
              onChange={(e) => setTokenIn(e.target.value)}
              className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/30 focus:border-transparent"
            >
              <option value={COMMON_TOKENS.ETH}>ETH</option>
              <option value={COMMON_TOKENS.USDC}>USDC</option>
              <option value={COMMON_TOKENS.USDT}>USDT</option>
              <option value={COMMON_TOKENS.WETH}>WETH</option>
            </select>
            <button
              onClick={() => setTokenIn(COMMON_TOKENS.ETH)}
              className="px-3 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              ETH
            </button>
          </div>
        </div>

        {/* Amount In */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Amount</label>
          <input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/30 focus:border-transparent"
          />
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <button className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
            <ArrowUpDown className="w-5 h-5 text-zinc-600" />
          </button>
        </div>

        {/* Token Out */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">To</label>
          <div className="flex space-x-2">
            <select
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value)}
              className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/30 focus:border-transparent"
            >
              <option value={COMMON_TOKENS.ETH}>ETH</option>
              <option value={COMMON_TOKENS.USDC}>USDC</option>
              <option value={COMMON_TOKENS.USDT}>USDT</option>
              <option value={COMMON_TOKENS.WETH}>WETH</option>
            </select>
            <button
              onClick={() => setTokenOut(COMMON_TOKENS.USDC)}
              className="px-3 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              USDC
            </button>
          </div>
        </div>

        {/* Minimum Amount Out */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Minimum Received</label>
          <input
            type="number"
            placeholder="0.0"
            value={minAmountOut}
            onChange={(e) => setMinAmountOut(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/30 focus:border-transparent"
          />
        </div>

        {/* Destination Chain */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Destination Chain</label>
          <select
            value={dstChainId}
            onChange={(e) => setDstChainId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/30 focus:border-transparent"
          >
            <option value={1}>Ethereum</option>
            <option value={137}>Polygon</option>
            <option value={42161}>Arbitrum</option>
            <option value={10}>Optimism</option>
          </select>
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="privacy"
            checked={includePrivacy}
            onChange={(e) => setIncludePrivacy(e.target.checked)}
            className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900/30"
          />
          <label htmlFor="privacy" className="text-sm text-zinc-700">
            Enable Privacy Protection
          </label>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!tokenIn || !tokenOut || !amountIn || !minAmountOut}
          className="w-full py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Creating Swap Intent..." : "Create Swap Intent"}
        </button>
      </div>

      {/* Routes Display */}
      {routes.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-zinc-900">Optimized Routes</h3>
          {routes.map((route) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-zinc-50 rounded-lg border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-zinc-900" />
                  <span className="text-sm font-medium">Route {route.id}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-zinc-900" />
                  <span className="text-sm text-zinc-700">{route.priceImpact}% impact</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-600">Estimated Output:</span>
                  <div className="font-medium text-zinc-900">{formatAmount(route.estimatedOutput)}</div>
                </div>
                <div>
                  <span className="text-zinc-600">Execution Time:</span>
                  <div className="font-medium flex items-center text-zinc-900">
                    <Clock className="w-4 h-4 mr-1" />
                    {route.executionTime}s
                  </div>
                </div>
                <div>
                  <span className="text-zinc-600">Privacy Level:</span>
                  <div className="font-medium capitalize text-zinc-900">{route.privacyLevel}</div>
                </div>
                <div>
                  <span className="text-zinc-600">Solver Reputation:</span>
                  <div className="font-medium text-zinc-900">{route.solverReputation}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

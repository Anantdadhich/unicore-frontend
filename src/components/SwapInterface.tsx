"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Shield, Clock, TrendingUp, CheckCircle, AlertCircle, Loader2, BarChart3 } from "lucide-react"
import { useAccount } from "wagmi"
import type { SwapIntent, SwapRoute } from "@/lib/types"
import { swapService, SwapParams, SwapResult, RouteInfo } from "@/lib/swap-service"
import { formatAmount } from "@/lib/utils"

interface SwapInterfaceProps {
  onSwapIntent: (intent: SwapIntent) => void
  routes?: SwapRoute[]
  isLoading?: boolean
}

export default function SwapInterface({ onSwapIntent, routes = [], isLoading }: SwapInterfaceProps) {
  const { address } = useAccount()
  
  // Common token addresses for better UX
  const COMMON_TOKENS = {
    ETH: "0x0000000000000000000000000000000000000000",
    USDC: "0xA0b86a33E6441b8C4C8C0E1234567890abcdef12",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  }

  const [tokenIn, setTokenIn] = useState(COMMON_TOKENS.ETH)
  const [tokenOut, setTokenOut] = useState(COMMON_TOKENS.USDC)
  const [amountIn, setAmountIn] = useState("0.01")
  const [minAmountOut, setMinAmountOut] = useState("")
  const [dstChainId, setDstChainId] = useState(1)
  const [includePrivacy, setIncludePrivacy] = useState(false)
  const [swapStatus, setSwapStatus] = useState<'idle' | 'getting-quote' | 'executing' | 'success' | 'error'>('idle')
  const [swapError, setSwapError] = useState<string>("")
  const [swapResult, setSwapResult] = useState<SwapResult | null>(null)
  const [optimizedRoutes, setOptimizedRoutes] = useState<RouteInfo[]>([])
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null)

  // Get quote when parameters change
  useEffect(() => {
    if (tokenIn && tokenOut && amountIn && address) {
      getQuote()
    }
  }, [tokenIn, tokenOut, amountIn, dstChainId, includePrivacy, address])

  const getQuote = async () => {
    if (!address) return
    
    setSwapStatus('getting-quote')
    try {
      const params: SwapParams = {
        tokenIn,
        tokenOut,
        amountIn,
        minAmountOut: minAmountOut || "0",
        dstChainId,
        userAddress: address,
        includePrivacy
      }

      const quoteResult = await swapService.getSwapQuote(params)
      
      if (quoteResult.success && quoteResult.data) {
        setMinAmountOut(quoteResult.data.estimatedOutput)
        setOptimizedRoutes(quoteResult.data.routes)
        setSelectedRoute(quoteResult.data.routes[0])
        setSwapStatus('idle')
      } else {
        setSwapError(quoteResult.error || 'Failed to get quote')
        setSwapStatus('error')
      }
    } catch (error) {
      console.error('Failed to get quote:', error)
      setSwapError('Failed to get quote')
      setSwapStatus('error')
    }
  }

  const handleSwap = async () => {
    if (!address) {
      setSwapError('Please connect your wallet')
      setSwapStatus('error')
      return
    }

    setSwapStatus('executing')
    setSwapError("")
    setSwapResult(null)

    try {
      const params: SwapParams = {
        tokenIn,
        tokenOut,
        amountIn,
        minAmountOut,
        dstChainId,
        userAddress: address,
        includePrivacy
      }

      const result = await swapService.executeSwap(params, selectedRoute || undefined)
      setSwapResult(result)

      if (result.success) {
        setSwapStatus('success')
        const intent: SwapIntent = { 
          tokenIn, 
          tokenOut, 
          amountIn, 
          minAmountOut, 
          dstChainId 
        }
        onSwapIntent(intent)
      } else {
        setSwapError(result.error || 'Swap failed')
        setSwapStatus('error')
      }
    } catch (error) {
      console.error('Swap failed:', error)
      setSwapError('Swap execution failed')
      setSwapStatus('error')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Swap Tokens</h2>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm text-gray-600 font-medium">Private</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Token In */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">From</label>
          <div className="relative">
            <select
              value={tokenIn}
              onChange={(e) => setTokenIn(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 font-medium appearance-none"
            >
              <option value={COMMON_TOKENS.ETH}>Ethereum (ETH)</option>
              <option value={COMMON_TOKENS.USDC}>USD Coin (USDC)</option>
              <option value={COMMON_TOKENS.USDT}>Tether (USDT)</option>
              <option value={COMMON_TOKENS.WETH}>Wrapped Ether (WETH)</option>
            </select>
          </div>
        </div>

        {/* Amount In */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 font-medium"
          />
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center py-2">
          <button 
            onClick={() => {
              const temp = tokenIn
              setTokenIn(tokenOut)
              setTokenOut(temp)
            }}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Token Out */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">To</label>
          <div className="relative">
            <select
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 font-medium appearance-none"
            >
              <option value={COMMON_TOKENS.ETH}>Ethereum (ETH)</option>
              <option value={COMMON_TOKENS.USDC}>USD Coin (USDC)</option>
              <option value={COMMON_TOKENS.USDT}>Tether (USDT)</option>
              <option value={COMMON_TOKENS.WETH}>Wrapped Ether (WETH)</option>
            </select>
          </div>
        </div>

        {/* Minimum Amount Out */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Minimum Received</label>
          <input
            type="number"
            placeholder="0.0"
            value={minAmountOut}
            onChange={(e) => setMinAmountOut(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 font-medium"
            readOnly
          />
        </div>

        {/* Destination Chain */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Destination Chain</label>
          <select
            value={dstChainId}
            onChange={(e) => setDstChainId(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 font-medium appearance-none"
          >
            <option value={1}>Ethereum Mainnet</option>
            <option value={137}>Polygon</option>
            <option value={42161}>Arbitrum One</option>
            <option value={10}>Optimism</option>
          </select>
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center space-x-3 py-2">
          <input
            type="checkbox"
            id="privacy"
            checked={includePrivacy}
            onChange={(e) => setIncludePrivacy(e.target.checked)}
            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
          />
          <label htmlFor="privacy" className="text-sm text-gray-700 font-medium">
            Enable Zero-Knowledge Privacy
          </label>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!tokenIn || !tokenOut || !amountIn || !minAmountOut || swapStatus === 'executing' || swapStatus === 'getting-quote' || !address}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {swapStatus === 'executing' && <Loader2 className="w-4 h-4 animate-spin" />}
          {swapStatus === 'getting-quote' && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>
            {swapStatus === 'executing' ? 'Executing Swap...' : 
             swapStatus === 'getting-quote' ? 'Getting Quote...' :
             swapStatus === 'success' ? 'Swap Successful!' :
             'Execute Swap'}
          </span>
        </button>

        {/* Status Messages */}
        {swapStatus === 'success' && swapResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Swap Completed Successfully!</span>
            </div>
            <div className="mt-2 text-sm text-green-700 space-y-1">
              <div>Transaction Hash: {swapResult.txHash}</div>
              {swapResult.intentId && <div>Intent ID: {swapResult.intentId}</div>}
              {swapResult.proof && <div>ZK Proof: {swapResult.proof.hash}</div>}
            </div>
          </div>
        )}

        {swapStatus === 'error' && swapError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Swap Failed</span>
            </div>
            <div className="mt-2 text-sm text-red-700">{swapError}</div>
          </div>
        )}
      </div>

      {/* Optimized Routes Display */}
      {optimizedRoutes.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Routes</h3>
          <div className="space-y-3">
            {optimizedRoutes.map((route, index) => (
              <div
                key={route.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedRoute?.id === route.id 
                    ? 'bg-gray-50 border-gray-900' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-3 h-3 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{route.source} Route</span>
                    {selectedRoute?.id === route.id && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">{route.priceImpact}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Output:</span>
                    <div className="font-medium text-gray-900">{formatAmount(route.estimatedOutput)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <div className="font-medium text-gray-900 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {route.executionTime}s
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Privacy:</span>
                    <div className="font-medium text-gray-900 capitalize">{route.privacyLevel}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <div className="font-medium text-gray-900">{(route.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wallet Connection Prompt */}
      {!address && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center space-x-2 text-blue-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Wallet Required</span>
          </div>
          <div className="mt-2 text-sm text-blue-700">
            Please connect your wallet to start swapping tokens across chains.
          </div>
        </div>
      )}
    </div>
  )
}

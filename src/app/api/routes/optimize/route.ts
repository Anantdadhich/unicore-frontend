import { NextRequest, NextResponse } from "next/server"
import { RouteOptimizationSchema } from "@/lib/types"
import { getOneInchService } from "@/lib/oneinch"
import { getAIOptimizer } from "@/lib/ai-optimizer"

// AI-powered route optimization with TensorFlow.js
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  try {
    const { tokenIn, tokenOut, amountIn, dstChainId, includePrivacy } = RouteOptimizationSchema.parse(body)

    // Get AI-optimized routes
    const aiOptimizer = getAIOptimizer()
    const aiRoutes = await aiOptimizer.optimizeRoutes(
      tokenIn,
      tokenOut,
      amountIn,
      dstChainId,
      includePrivacy || false
    )

    // Get 1inch quote for comparison
    const oneInchService = getOneInchService()
    const quote = await oneInchService.getQuote(
      tokenIn,
      tokenOut,
      amountIn,
      0.5 // 0.5% slippage
    )

    // Combine AI routes with 1inch data
    const routes = aiRoutes.map(route => ({
      ...route,
      source: "ai-optimized",
      protocols: quote.success ? quote.data?.protocols || [] : [],
      solverReputation: Math.floor(route.aiScore * 100),
    }))

    // Add 1inch route if available
    if (quote.success) {
      routes.unshift({
        id: "1inch-direct",
        path: [tokenIn, tokenOut],
        estimatedOutput: quote.data?.toTokenAmount || "0",
        priceImpact: 0.1,
        gasEstimate: quote.data?.estimatedGas || "50000",
        executionTime: 30,
        privacyLevel: "low" as const,
        solverReputation: 98,
        source: "1inch",
        protocols: quote.data?.protocols || [],
        confidence: 0.95,
        aiScore: 0.9,
      })
    }

    // Filter routes based on privacy requirements
    const filteredRoutes = includePrivacy 
      ? routes.filter(route => route.privacyLevel !== "low")
      : routes

    return NextResponse.json({ 
      routes: filteredRoutes,
      aiOptimized: true,
      totalRoutes: filteredRoutes.length
    })
  } catch (error) {
    console.error("AI route optimization error:", error)
    
    // Fallback to basic optimization
    try {
      const { tokenIn, tokenOut, amountIn, dstChainId, includePrivacy } = RouteOptimizationSchema.parse(body)
      const routes = await optimizeRoutes({
        tokenIn,
        tokenOut,
        amountIn,
        dstChainId,
        includePrivacy: includePrivacy || false,
      })
      
      return NextResponse.json({ 
        routes,
        aiOptimized: false,
        error: "AI optimization failed, using fallback"
      })
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Failed to optimize routes" },
        { status: 500 }
      )
    }
  }
}

async function optimizeRoutes(params: {
  tokenIn: string
  tokenOut: string
  amountIn: string
  dstChainId: number
  includePrivacy: boolean
}) {
  // Fallback simulated routes
  const routes = [
    {
      id: "route-1",
      path: [params.tokenIn, params.tokenOut],
      estimatedOutput: (parseFloat(params.amountIn) * 0.98).toString(),
      priceImpact: 0.5,
      gasEstimate: "50000",
      executionTime: 30,
      privacyLevel: "low" as const,
      solverReputation: 95,
      source: "simulated",
    },
    {
      id: "route-2",
      path: [params.tokenIn, "0x...", params.tokenOut],
      estimatedOutput: (parseFloat(params.amountIn) * 0.985).toString(),
      priceImpact: 0.3,
      gasEstimate: "75000",
      executionTime: 45,
      privacyLevel: "medium" as const,
      solverReputation: 88,
      source: "simulated",
    },
    {
      id: "route-3",
      path: [params.tokenIn, "0x...", "0x...", params.tokenOut],
      estimatedOutput: (parseFloat(params.amountIn) * 0.99).toString(),
      priceImpact: 0.1,
      gasEstimate: "120000",
      executionTime: 60,
      privacyLevel: "high" as const,
      solverReputation: 92,
      source: "simulated",
    },
  ]

  // Filter routes based on privacy requirements
  if (params.includePrivacy) {
    return routes.filter(route => route.privacyLevel !== "low")
  }

  return routes
}

import { NextRequest, NextResponse } from "next/server"
import { getOneInchService } from "@/lib/oneinch"

// Execute swap using 1inch protocol
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      fromTokenAddress, 
      toTokenAddress, 
      amount, 
      fromAddress, 
      slippage = 0.5 
    } = body

    if (!fromTokenAddress || !toTokenAddress || !amount || !fromAddress) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    const oneInchService = getOneInchService()
    
    // Get swap data from 1inch
    const swapData = await oneInchService.getSwapData(
      fromTokenAddress,
      toTokenAddress,
      amount,
      fromAddress,
      slippage
    )

    if (!swapData.success) {
      return NextResponse.json(
        { error: swapData.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        fromToken: swapData.data?.fromToken,
        toToken: swapData.data?.toToken,
        fromTokenAmount: swapData.data?.fromTokenAmount,
        toTokenAmount: swapData.data?.toTokenAmount,
        protocols: swapData.data?.protocols,
        tx: swapData.data?.tx,
        // Add additional fields for frontend
        estimatedGas: swapData.data?.tx?.gas,
        gasPrice: swapData.data?.tx?.gasPrice,
        value: swapData.data?.tx?.value,
        data: swapData.data?.tx?.data,
        to: swapData.data?.tx?.to,
        from: swapData.data?.tx?.from,
      }
    })
  } catch (error) {
    console.error("Swap execution error:", error)
    return NextResponse.json(
      { error: "Failed to execute swap" },
      { status: 500 }
    )
  }
}

// Get quote for swap
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fromTokenAddress = searchParams.get("fromTokenAddress")
    const toTokenAddress = searchParams.get("toTokenAddress")
    const amount = searchParams.get("amount")
    const slippage = searchParams.get("slippage") || "0.5"

    if (!fromTokenAddress || !toTokenAddress || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    const oneInchService = getOneInchService()
    
    const quote = await oneInchService.getQuote(
      fromTokenAddress,
      toTokenAddress,
      amount,
      parseFloat(slippage)
    )

    if (!quote.success) {
      return NextResponse.json(
        { error: quote.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: quote.data
    })
  } catch (error) {
    console.error("Quote error:", error)
    return NextResponse.json(
      { error: "Failed to get quote" },
      { status: 500 }
    )
  }
}

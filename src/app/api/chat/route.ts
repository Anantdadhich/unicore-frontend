import { NextRequest, NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const systemPrompt = `You are UniCore, an AI assistant for a cross-chain DeFi protocol. You help users:
1. Create swap intents across different blockchains
2. Understand route optimization and privacy features
3. Navigate the solver network
4. Answer questions about DeFi and cross-chain swaps

Context: ${context || "No additional context provided"}

When users ask about swaps, extract the following information if mentioned:
- Token to swap from (tokenIn)
- Token to swap to (tokenOut) 
- Amount to swap (amountIn)
- Destination chain (dstChainId)
- Minimum expected output (minAmountOut)

Respond in a helpful, conversational manner. If a swap intent is detected, format it as JSON with the extracted fields.`

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    })

    // Get the full response text
    const response = await result.text
    
    // Try to extract swap intent from the response
    let swapIntent = null
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        swapIntent = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      // No valid JSON found, that's okay
    }

    return NextResponse.json({
      response,
      swapIntent,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    )
  }
}

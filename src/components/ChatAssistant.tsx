"use client"

import { useState } from "react"
import { MessageCircle, Send, Bot, User } from "lucide-react"
import type { ChatMessage, SwapIntent } from "@/lib/types"

interface ChatAssistantProps {
  onSwapIntentDetected: (intent: SwapIntent) => void
}

export default function ChatAssistant({ onSwapIntentDetected }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm UniCore, your AI assistant for cross-chain DeFi swaps. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          context: "User is asking about swaps",
        }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        swapIntent: data.swapIntent,
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (data.swapIntent) {
        onSwapIntentDetected(data.swapIntent)
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Open Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-800 transition"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[370px] h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">UniCore Assistant</div>
                <div className="text-xs text-gray-500">AI-powered DeFi Support</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded bg-gray-100 text-gray-600 w-8 h-8 flex items-center justify-center hover:bg-gray-200 focus:outline-none"
              aria-label="Close chat"
            >
              <span className="text-xl font-bold">&times;</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-xl shadow-sm ${
                    message.role === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-800 border border-gray-100"
                  } flex`}
                >
                  <span className="mr-2 mt-0.5">
                    {message.role === "assistant" && <Bot className="w-4 h-4 text-gray-600" />}
                    {message.role === "user" && <User className="w-4 h-4 text-gray-100" />}
                  </span>
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.swapIntent && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs text-gray-800 border border-blue-100">
                        <span className="block font-medium text-blue-700 mb-1">Swap Intent Detected:</span>
                        <span className="block">
                          From: <strong>{message.swapIntent.amountIn}</strong> → Min Out: <strong>{message.swapIntent.minAmountOut}</strong>
                        </span>
                        <span className="block">Chain: {message.swapIntent.dstChainId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-xl shadow-sm flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-gray-600" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about swaps, routes, privacy…"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                disabled={isLoading}
                aria-label="Chat input"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-3 py-2 bg-gray-900 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
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
        headers: {
          "Content-Type": "application/json",
        },
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

      // If a swap intent was detected, notify the parent component
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
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 hover:bg-black text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">UniCore Assistant</h3>
                <p className="text-xs text-zinc-500">AI-powered DeFi helper</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === "user" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" && <Bot className="w-4 h-4 mt-0.5 text-zinc-500" />}
                    {message.role === "user" && <User className="w-4 h-4 mt-0.5 text-white" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      {message.swapIntent && (
                        <div className="mt-2 p-2 bg-white/70 rounded-lg">
                          <p className="text-xs font-medium">Swap Intent Detected:</p>
                          <p className="text-xs">
                            {message.swapIntent.amountIn} → {message.swapIntent.minAmountOut}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-zinc-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about swaps, routes, or privacy..."
                className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/30 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-3 py-2 bg-zinc-900 text-white rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

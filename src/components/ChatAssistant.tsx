"use client"

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
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#3466F6] hover:bg-[#2753d4] text-white rounded-full shadow-lg transition"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#23262F] rounded-xl shadow-2xl border border-[#22262B] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#22262B]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#3466F6] rounded-full flex items-center justify-center shadow-md shadow-[#3466F6]/50">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">UniCore Assistant</h3>
                <p className="text-xs text-[#C3C3C3]">AI-powered DeFi helper</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#888F9B] hover:text-white transition-colors duration-200 font-bold text-lg leading-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-[#3466F6]/50 scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-[#3466F6] text-white"
                      : "bg-[#2C303A] text-[#C3C3C3]"
                  } shadow-sm`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" && <Bot className="w-4 h-4 mt-0.5 text-[#7EA4F9]" />}
                    {message.role === "user" && <User className="w-4 h-4 mt-0.5 text-white" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.swapIntent && (
                        <div className="mt-2 p-2 bg-[#3A3F57] rounded-lg text-xs font-medium text-[#B3C1FF]">
                          <p>Swap Intent Detected:</p>
                          <p>
                            {message.swapIntent.amountIn} → {message.swapIntent.minAmountOut}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2C303A] px-4 py-3 rounded-2xl shadow-sm flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-[#7EA4F9]" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#7EA4F9] rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-[#7EA4F9] rounded-full animate-pulse delay-150" />
                    <div className="w-2 h-2 bg-[#7EA4F9] rounded-full animate-pulse delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#22262B]">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about swaps, routes, or privacy..."
                className="flex-1 px-3 py-2 rounded-lg border border-[#444B5A] bg-[#2C303A] text-[#C3C3C3] text-sm focus:outline-none focus:ring-2 focus:ring-[#3466F6] focus:border-transparent"
                disabled={isLoading}
                aria-label="Chat input field"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-3 py-2 bg-[#3466F6] rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#2753d4] transition-colors"
                aria-label="Send message"
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

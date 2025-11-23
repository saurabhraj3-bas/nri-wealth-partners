"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, MessageCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface AIChatbotProps {
  className?: string
}

export default function AIChatbotEnhanced({ className }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEmailValidated, setIsEmailValidated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load email from sessionStorage
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("chatbot_user_email")
    if (savedEmail) {
      setUserEmail(savedEmail)
      setIsEmailValidated(true)
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(userEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    // Save email to sessionStorage
    sessionStorage.setItem("chatbot_user_email", userEmail)
    setIsEmailValidated(true)
    setEmailError("")

    // Add welcome message
    setMessages([
      {
        role: "assistant",
        content: `Welcome! I'm your NRI Wealth Assistant. I can help you with questions about:\n\n• Investment planning for NRIs\n• Tax compliance and planning\n• FEMA, FATCA, and CRS regulations\n• GIFT City and alternative investments\n• Moving back to India\n• Retirement and estate planning\n\nHow can I assist you today?`,
        timestamp: new Date().toISOString()
      }
    ])
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: inputMessage,
          userEmail,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: data.timestamp
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again or contact us at support@nriwealthpartners.com",
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleResetEmail = () => {
    sessionStorage.removeItem("chatbot_user_email")
    setIsEmailValidated(false)
    setUserEmail("")
    setMessages([])
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-40 left-6 z-50 bg-gradient-to-r from-navy to-blue-900 hover:from-navy/90 hover:to-blue-800 text-white rounded-2xl px-5 py-3 shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 border-2 border-gold"
          aria-label="Open AI Chat"
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7" />
            <span className="absolute -top-2 -right-2 bg-gold text-navy text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              AI
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">AI Assistant</span>
            <span className="text-xs text-gray-300">Ask me anything</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col",
            "w-[90vw] max-w-md h-[600px] max-h-[80vh]",
            className
          )}
        >
          {/* Header */}
          <div className="bg-navy text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">NRI Wealth Assistant</h3>
              <p className="text-xs text-gray-300">
                {isEmailValidated ? userEmail : "Please verify your email"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Email Validation Form */}
          {!isEmailValidated && (
            <div className="flex-1 p-6 flex flex-col justify-center items-center">
              <MessageCircle className="h-16 w-16 text-navy mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-center">
                Welcome to NRI Wealth Partners
              </h4>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Please enter your email to start the conversation. We'll save your chat history for future reference.
              </p>
              <form onSubmit={handleEmailSubmit} className="w-full max-w-sm">
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value)
                    setEmailError("")
                  }}
                  className={cn(
                    "mb-2",
                    emailError && "border-red-500"
                  )}
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-xs mb-2">{emailError}</p>
                )}
                <Button
                  type="submit"
                  variant="cta"
                  className="w-full"
                >
                  Start Chat
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-4 text-center">
                By continuing, you agree to our Privacy Policy and Terms of Service
              </p>
            </div>
          )}

          {/* Chat Messages */}
          {isEmailValidated && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-wrap",
                        message.role === "user"
                          ? "bg-navy text-white"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.role === "user"
                            ? "text-gray-300"
                            : "text-gray-500"
                        )}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <Loader2 className="h-5 w-5 animate-spin text-navy" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    variant="cta"
                    size="icon"
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={handleResetEmail}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Change email
                  </button>
                  <p className="text-xs text-gray-500">
                    Powered by Google AI
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

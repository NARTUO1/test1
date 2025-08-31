import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatApi } from "@/lib/api-client";
import { ChatMessage } from "@shared/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ChatbotProps {
  className?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session when opened
  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeChatSession();
    }
  }, [isOpen, sessionId]);

  const initializeChatSession = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const guestIdentifier = user ? undefined : `guest_${Date.now()}`;
      const response = await chatApi.startSession(guestIdentifier);

      if (response.success && response.data) {
        setSessionId(response.data.sessionId);

        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: Date.now(),
          sessionId: response.data.sessionId,
          message: response.data.welcomeMessage,
          sender: "bot",
          metadata: {},
          createdAt: new Date().toISOString(),
        };

        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      sessionId,
      message: userMessage,
      sender: "user",
      metadata: {},
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await chatApi.sendMessage(sessionId, userMessage);

      if (response.success && response.data) {
        // Add bot response to chat
        const botMessage: ChatMessage = {
          id: Date.now() + 1,
          sessionId,
          message: response.data.botResponse,
          sender: "bot",
          metadata: {},
          createdAt: response.data.timestamp,
        };

        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sessionId,
        message:
          "I'm sorry, I'm having trouble responding right now. Please try again later.",
        sender: "bot",
        metadata: { error: true },
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = async () => {
    setMessages([]);
    setSessionId(null);
    setHasError(false);
    await initializeChatSession();
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <Card
        className={cn(
          "w-80 h-96 shadow-xl transition-all duration-300",
          isMinimized && "h-14",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
          <CardTitle className="text-sm font-medium">
            Chat Assistant
            {isLoading && (
              <span className="ml-2 inline-block animate-pulse">●</span>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? (
                <Maximize2 className="h-3 w-3" />
              ) : (
                <Minimize2 className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {hasError ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Failed to start chat session
                  </p>
                  <Button variant="outline" size="sm" onClick={resetChat}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                            message.metadata?.error &&
                              "bg-destructive text-destructive-foreground",
                          )}
                        >
                          {message.message}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={isLoading || !sessionId}
                      className="flex-1 text-sm"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading || !sessionId}
                      size="icon"
                      className="h-9 w-9"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Ask me about products, orders, shipping, or anything else!
                  </p>
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Chatbot;

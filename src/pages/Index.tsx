import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleNewChat = () => {
    setActiveConversationId(null);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const streamChat = async (
    messages: Message[],
    onDelta: (text: string) => void,
    onDone: () => void
  ) => {
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to get AI response");
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    onDone();
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    let currentConversationId = activeConversationId;
    let allMessages: Message[] = [];

    if (currentConversationId) {
      setConversations(prev =>
        prev.map(c =>
          c.id === currentConversationId
            ? { ...c, messages: [...c.messages, userMessage] }
            : c
        )
      );
      allMessages = [...(activeConversation?.messages || []), userMessage];
    } else {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [userMessage],
        timestamp: new Date(),
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
      currentConversationId = newConversation.id;
      allMessages = [userMessage];
    }

    setIsLoading(true);
    let assistantContent = "";

    const updateAssistantMessage = (chunk: string) => {
      assistantContent += chunk;
      setConversations(prev =>
        prev.map(c => {
          if (c.id !== currentConversationId) return c;
          const lastMessage = c.messages[c.messages.length - 1];
          if (lastMessage?.role === "assistant") {
            return {
              ...c,
              messages: c.messages.map((m, i) =>
                i === c.messages.length - 1 ? { ...m, content: assistantContent } : m
              ),
            };
          }
          return {
            ...c,
            messages: [
              ...c.messages,
              { id: (Date.now() + 1).toString(), role: "assistant", content: assistantContent },
            ],
          };
        })
      );
    };

    try {
      await streamChat(allMessages, updateAssistantMessage, () => {
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
        />

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {activeConversation ? (
            <div className="pb-32">
              {activeConversation.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {isLoading && activeConversation.messages[activeConversation.messages.length - 1]?.role === "user" && (
                <ChatMessage role="assistant" content="" isLoading />
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          )}
        </div>

        <div className="border-t border-transparent bg-background pt-2">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;

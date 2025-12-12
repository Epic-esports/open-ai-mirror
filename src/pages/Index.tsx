import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { ChatHeader } from "@/components/chat/ChatHeader";

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

// Mock initial conversations
const initialConversations: Conversation[] = [
  {
    id: "1",
    title: "React best practices",
    messages: [
      { id: "1-1", role: "user", content: "What are the best practices for React?" },
      { id: "1-2", role: "assistant", content: "Here are some key React best practices:\n\n1. **Use functional components** with hooks instead of class components\n2. **Keep components small and focused** - each component should do one thing well\n3. **Use proper state management** - useState for local state, context or Redux for global state\n4. **Memoize expensive computations** with useMemo and useCallback\n5. **Follow naming conventions** - PascalCase for components, camelCase for functions" },
    ],
    timestamp: new Date(),
  },
  {
    id: "2",
    title: "Python vs JavaScript",
    messages: [
      { id: "2-1", role: "user", content: "Compare Python and JavaScript" },
      { id: "2-2", role: "assistant", content: "Both are excellent languages with different strengths:\n\n**Python:**\n- Great for data science, ML, and backend\n- Clean, readable syntax\n- Strong scientific computing libraries\n\n**JavaScript:**\n- Essential for web development\n- Runs in browsers and servers (Node.js)\n- Huge ecosystem with npm" },
    ],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    if (activeConversationId) {
      // Add message to existing conversation
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: [...c.messages, userMessage] }
            : c
        )
      );
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [userMessage],
        timestamp: new Date(),
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
    }

    // Simulate AI response
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: generateMockResponse(content),
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === (activeConversationId || prev[0]?.id)
          ? { ...c, messages: [...c.messages, assistantMessage] }
          : c
      )
    );
    setIsLoading(false);
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
        />

        {/* Chat area */}
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
              {isLoading && (
                <ChatMessage role="assistant" content="" isLoading />
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-transparent bg-background pt-2">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
};

function generateMockResponse(input: string): string {
  const responses = [
    `That's a great question! Let me help you with "${input.slice(0, 50)}...".\n\nHere's what I think:\n\n1. **First point**: This is an important consideration\n2. **Second point**: You should also think about this\n3. **Third point**: Don't forget about this aspect\n\nWould you like me to elaborate on any of these points?`,
    `I'd be happy to help with that!\n\nBased on your question about "${input.slice(0, 30)}...", here are some insights:\n\n- Consider starting with the basics\n- Build up your understanding gradually\n- Practice consistently for best results\n\nLet me know if you need more specific guidance!`,
    `Interesting topic! Here's my take on "${input.slice(0, 40)}...":\n\n## Overview\nThis is a fascinating area that involves several key concepts.\n\n## Key Points\n1. Understanding the fundamentals is crucial\n2. Practical application helps reinforce learning\n3. Staying updated with latest developments is important\n\nIs there a specific aspect you'd like to explore further?`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export default Index;

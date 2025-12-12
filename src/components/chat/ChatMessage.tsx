import { cn } from "@/lib/utils";
import { Bot, User, Copy, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export const ChatMessage = ({ role, content, isLoading }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in group py-6">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              isUser ? "bg-primary" : "bg-primary"
            )}
          >
            {isUser ? (
              <User className="h-4 w-4 text-primary-foreground" />
            ) : (
              <Bot className="h-4 w-4 text-primary-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="font-semibold text-foreground">
              {isUser ? "You" : "ChatGPT"}
            </div>
            
            {isLoading ? (
              <div className="flex items-center gap-1">
                <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground"></span>
                <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground"></span>
                <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground"></span>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-foreground">
                <p className="whitespace-pre-wrap leading-7">{content}</p>
              </div>
            )}

            {/* Actions - Only for assistant messages */}
            {!isUser && !isLoading && (
              <div className="flex items-center gap-1 pt-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={handleCopy}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
                  title="Copy"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
                  title="Good response"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
                  title="Bad response"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <button
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
                  title="Regenerate"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

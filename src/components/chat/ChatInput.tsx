import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ArrowUp, Paperclip, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4">
      <div className="relative rounded-2xl border border-border bg-secondary shadow-lg">
        <div className="flex items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT"
            disabled={disabled}
            rows={1}
            className="max-h-52 min-h-[52px] w-full resize-none bg-transparent py-4 pl-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
              title="Search the web"
            >
              <Globe className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              message.trim() && !disabled
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        ChatGPT can make mistakes. Check important info.
      </p>
    </div>
  );
};

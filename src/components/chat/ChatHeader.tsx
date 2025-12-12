import { Menu, ChevronDown, Share, PenSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export const ChatHeader = ({ onToggleSidebar, onNewChat }: ChatHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-transparent bg-background px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <button
          onClick={onToggleSidebar}
          className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground md:block"
        >
          <Menu className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-foreground transition-colors hover:bg-hover">
              <span className="font-semibold">ChatGPT</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">GPT-4o</span>
                <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary">
                  Default
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Great for most tasks
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">GPT-4o mini</span>
              <span className="text-xs text-muted-foreground">
                Faster for simpler tasks
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground">
          <Share className="h-5 w-5" />
        </button>
        <button
          onClick={onNewChat}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
        >
          <PenSquare className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

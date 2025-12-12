import { Plus, MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
}

export const Sidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpen,
}: SidebarProps) => {
  const groupedConversations = groupConversationsByDate(conversations);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-full w-64 bg-sidebar transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* New Chat Button */}
        <div className="p-2">
          <button
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <Plus className="h-4 w-4" />
            <span>New chat</span>
          </button>
        </div>

        {/* Conversations List */}
        <nav className="flex-1 overflow-y-auto px-2 scrollbar-thin">
          {Object.entries(groupedConversations).map(([group, convs]) => (
            <div key={group} className="mb-4">
              <h3 className="mb-1 px-3 text-xs font-medium text-muted-foreground">
                {group}
              </h3>
              <ul className="space-y-0.5">
                {convs.map((conversation) => (
                  <li key={conversation.id}>
                    <div
                      className={cn(
                        "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                        activeConversationId === conversation.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                      onClick={() => onSelectConversation(conversation.id)}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
                      <span className="flex-1 truncate">{conversation.title}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-sidebar-accent rounded"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive"
                            onClick={() => onDeleteConversation(conversation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-2">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              U
            </div>
            <span className="flex-1 text-left">User</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

function groupConversationsByDate(conversations: Conversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
    Older: [],
  };

  conversations.forEach((conv) => {
    const date = new Date(conv.timestamp);
    if (date >= today) {
      groups["Today"].push(conv);
    } else if (date >= yesterday) {
      groups["Yesterday"].push(conv);
    } else if (date >= lastWeek) {
      groups["Previous 7 Days"].push(conv);
    } else if (date >= lastMonth) {
      groups["Previous 30 Days"].push(conv);
    } else {
      groups["Older"].push(conv);
    }
  });

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([_, convs]) => convs.length > 0)
  );
}

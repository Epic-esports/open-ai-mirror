import { Bot } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    title: "Help me write",
    description: "a professional email",
  },
  {
    title: "Explain this code",
    description: "step by step",
  },
  {
    title: "Give me ideas",
    description: "for a weekend project",
  },
  {
    title: "Summarize this",
    description: "article or document",
  },
];

export const WelcomeScreen = ({ onSuggestionClick }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Bot className="h-8 w-8 text-primary-foreground" />
      </div>
      
      <h1 className="mb-8 text-2xl font-semibold text-foreground">
        What can I help with?
      </h1>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(`${suggestion.title} ${suggestion.description}`)}
            className="flex flex-col items-start rounded-xl border border-border bg-secondary p-4 text-left transition-colors hover:bg-hover"
          >
            <span className="text-sm font-medium text-foreground">
              {suggestion.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {suggestion.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

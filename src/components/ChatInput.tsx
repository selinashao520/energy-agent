import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: Props) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass border-t border-border/30 px-4 py-3 shrink-0">
      <div className="flex gap-2 items-end max-w-3xl mx-auto">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的问题..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-secondary/50 text-foreground text-sm rounded-xl px-4 py-3 resize-none outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground disabled:opacity-50 max-h-32"
          style={{ minHeight: "44px" }}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 w-11 shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;

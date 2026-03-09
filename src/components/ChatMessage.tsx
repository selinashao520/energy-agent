import ReactMarkdown from "react-markdown";
import { type ChatMessage as Msg } from "@/lib/stream-chat";
import { Bot, User, ExternalLink } from "lucide-react";

export interface SourceLink {
  title: string;
  url: string;
}

interface Props {
  message: Msg;
  sources?: SourceLink[];
}

const ChatMessage = ({ message, sources }: Props) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "glass rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&>p]:mb-3 [&>ul]:mb-3 [&>ol]:mb-3 [&>h1]:text-foreground [&>h2]:text-foreground [&>h3]:text-foreground [&>p]:text-foreground/90 [&>li]:text-foreground/90 [&_strong]:text-primary [&_a]:text-primary [&_a]:underline">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/30 space-y-1.5">
            <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">来源 / Sources</p>
            {sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary/80 hover:text-primary transition-colors truncate"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{s.title || s.url}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

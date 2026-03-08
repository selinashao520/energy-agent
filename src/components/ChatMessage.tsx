import ReactMarkdown from "react-markdown";
import { type ChatMessage as Msg } from "@/lib/stream-chat";
import { Bot, User } from "lucide-react";

interface Props {
  message: Msg;
}

const ChatMessage = ({ message }: Props) => {
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
        className={`max-w-[85%] rounded-2xl px-5 py-4 text-base leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "glass rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <p className="text-base">{message.content}</p>
        ) : (
          <div className="prose prose-base prose-invert max-w-none [&>p]:mb-3 [&>ul]:mb-3 [&>ol]:mb-3 [&>h1]:text-foreground [&>h2]:text-foreground [&>h3]:text-foreground [&>p]:text-foreground/90 [&>p]:text-base [&>li]:text-foreground/90 [&>li]:text-base [&_strong]:text-primary">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

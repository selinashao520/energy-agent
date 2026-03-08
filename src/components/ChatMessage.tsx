import ReactMarkdown from "react-markdown";
import { type ChatMessage as Msg } from "@/lib/stream-chat";
import { Bot, User } from "lucide-react";

interface Props {
  message: Msg;
}

const ChatMessage = ({ message }: Props) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-6 py-5 text-lg leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "glass rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <p className="text-lg">{message.content}</p>
        ) : (
          <div className="prose prose-lg prose-invert max-w-none [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>h1]:text-foreground [&>h2]:text-foreground [&>h3]:text-foreground [&>p]:text-foreground/90 [&>p]:text-lg [&>li]:text-foreground/90 [&>li]:text-lg [&_strong]:text-primary">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

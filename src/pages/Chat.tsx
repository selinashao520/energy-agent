import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import QuickActions from "@/components/QuickActions";
import LeadForm from "@/components/LeadForm";
import { WELCOME_MESSAGE, QUICK_ACTIONS } from "@/data/knowledge";
import { streamChat, type ChatMessage as Msg } from "@/lib/stream-chat";
import { toast } from "sonner";

const Chat = () => {
  const navigate = useNavigate();
  const visitor = sessionStorage.getItem("visitor");

  useEffect(() => {
    if (!visitor) {
      navigate("/register", { replace: true });
    }
  }, [visitor, navigate]);

  const visitorData = visitor ? JSON.parse(visitor) : null;
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (input: string) => {
    if (isLoading) return;

    // Check for lead form trigger
    if (input === "__LEAD_FORM__") {
      setShowLeadForm(true);
      return;
    }

    setShowQuickActions(false);
    const userMsg: Msg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: [...messages, userMsg],
      onDelta: upsertAssistant,
      onDone: () => {
        setIsLoading(false);
        setShowQuickActions(true);
      },
      onError: (err) => {
        setIsLoading(false);
        setShowQuickActions(true);
        toast.error(err);
      },
    });
  };

  const handleQuickAction = (actionId: string) => {
    const action = QUICK_ACTIONS.find((a) => a.id === actionId);
    if (action) sendMessage(action.prompt);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-main">
      {/* Header */}
      <header className="glass border-b border-border/30 px-4 py-3 flex items-center gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold text-foreground">鲲腾能科 AI 能源顾问</h1>
          <p className="text-xs text-muted-foreground">KunTeng Energy · AI Consultant</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-accent animate-pulse" />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2 items-center text-muted-foreground text-sm pl-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {showQuickActions && !isLoading && (
          <QuickActions onAction={handleQuickAction} />
        )}

        {showLeadForm && (
          <LeadForm
            onClose={() => setShowLeadForm(false)}
            onSuccess={() => {
              setShowLeadForm(false);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content:
                    "感谢您留下联系方式！🎉 我们的专业团队会尽快与您联系。\n\n如果您希望立即沟通，也可以直接联系我们：\n- 📞 +86-15202136096\n- 📧 selinashao@kuntengenergy.com",
                },
              ]);
            }}
          />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

export default Chat;

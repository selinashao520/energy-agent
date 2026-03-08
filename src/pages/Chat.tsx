import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
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
    <div className="flex flex-col h-screen bg-gradient-main relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(192 100% 50% / 0.05), transparent 70%)" }}
      />

      {/* Header */}
      <header className="relative glass-heavy border-b border-primary/10 px-4 py-3 flex items-center gap-3 shrink-0 z-20">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Zap className="w-4 h-4 text-primary/60" />
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            AI 能源顾问
          </h1>
          <p className="text-[10px] text-primary/50 tracking-[0.15em] uppercase">KunTeng Energy · Online</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-accent/60 tracking-wider uppercase">Live</span>
          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_hsl(152_100%_50%/0.6)] animate-pulse" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 z-10">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2 items-center text-muted-foreground text-sm pl-2">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_hsl(192_100%_50%/0.5)] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_hsl(192_100%_50%/0.5)] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_hsl(192_100%_50%/0.5)] animate-bounce" style={{ animationDelay: "300ms" }} />
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
      <div className="relative z-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Chat;

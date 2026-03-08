import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      toast.error("请输入您的姓名");
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 6) {
      toast.error("请输入有效的手机号");
      return;
    }

    sessionStorage.setItem(
      "visitor",
      JSON.stringify({ name: trimmedName, phone: trimmedPhone })
    );
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-8 w-full max-w-sm z-10 border border-border/40"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gradient mb-1">鲲腾能科</h1>
          <p className="text-sm text-muted-foreground">
            请输入您的信息以开始对话
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground/80 text-sm">
              姓名
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入姓名"
                maxLength={50}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground/80 text-sm">
              手机号
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                maxLength={20}
                type="tel"
                className="pl-10 bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary rounded-full font-semibold py-5"
          >
            进入对话 →
          </Button>
        </form>
      </motion.div>

      <motion.p
        className="absolute bottom-6 text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        © 2025 鲲腾能科（上海）技术有限公司
      </motion.p>
    </div>
  );
};

export default Register;

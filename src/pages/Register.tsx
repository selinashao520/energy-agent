import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      toast.error(t("register.nameError"));
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 6) {
      toast.error(t("register.phoneError"));
      return;
    }

    sessionStorage.setItem(
      "visitor",
      JSON.stringify({ name: trimmedName, phone: trimmedPhone })
    );
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center justify-center relative overflow-hidden px-4 scanlines">
      <div className="absolute inset-0 bg-grid opacity-50" />

      <motion.div
        className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(192 100% 50% / 0.07), transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[15%] w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(152 100% 50% / 0.05), transparent 70%)" }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-primary/20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-accent/20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-primary/10 via-transparent to-accent/5 blur-2xl pointer-events-none" />

        <div className="relative glass-heavy rounded-2xl p-8 neon-border overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="text-center mb-7">
            <motion.div
              className="flex items-center justify-center gap-2 mb-3"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/50" />
              <Zap className="w-4 h-4 text-primary/60" />
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/50" />
            </motion.div>
            <h1 className="text-2xl font-black text-gradient-bright tracking-wider mb-2">{t("register.title")}</h1>
            <p className="text-xs text-primary/50 tracking-[0.2em] uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {t("register.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/70 text-xs tracking-wider uppercase">
                {t("register.nameLabel")}
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("register.namePlaceholder")}
                  maxLength={50}
                  className="pl-10 bg-background/40 border-primary/20 focus:border-primary/60 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground/70 text-xs tracking-wider uppercase">
                {t("register.phoneLabel")}
              </Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("register.phonePlaceholder")}
                  maxLength={20}
                  type="tel"
                  className="pl-10 bg-background/40 border-primary/20 focus:border-primary/60 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 glow-primary rounded-full font-bold py-5 tracking-wider text-sm uppercase transition-all duration-300 hover:glow-intense"
            >
              {t("register.submit")}
            </Button>
          </form>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <p className="text-xs text-muted-foreground/40 tracking-wider">{t("index.copyright")}</p>
      </motion.div>
    </div>
  );
};

export default Register;

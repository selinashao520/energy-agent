import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroPoster from "@/assets/hero-poster.jpg";
import energyNetwork from "@/assets/energy-network.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Full-screen hero poster background */}
      <div className="absolute inset-0">
        <img
          src={heroPoster}
          alt="绿色能源科技"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
      </div>

      {/* Animated glow effects */}
      <motion.div
        className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(192 100% 50% / 0.15), transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Main content — centered vertically */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Decorative line */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-5"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/60" />
          <Zap className="w-5 h-5 text-primary" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/60" />
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-black mb-3 tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-gradient-bright">鲲腾能科</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl tracking-[0.3em] uppercase text-primary/80 mb-3 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          KunTeng Energy Tech
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Shield className="w-5 h-5 text-accent/70" />
          <p className="text-xl md:text-3xl text-foreground/90 leading-relaxed font-medium">
            中国绿色能源技术 · 赋能全球碳中和
          </p>
          <Shield className="w-5 h-5 text-accent/70" />
        </motion.div>

        {/* Inline energy-network visual */}
        <motion.div
          className="relative w-48 h-48 md:w-64 md:h-64 mb-8 rounded-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <img
            src={energyNetwork}
            alt="能源网络"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 shadow-[0_0_40px_hsl(192_100%_50%/0.2)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-xl animate-pulse-glow pointer-events-none" />
            <motion.button
              onClick={() => navigate("/register")}
              className="relative glass-heavy rounded-full px-12 py-5 neon-border flex items-center gap-3 text-xl font-bold text-primary tracking-wide hover:bg-primary/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              开始与 AI 能源顾问对话
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="relative z-10 pb-6 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <p className="text-xs text-muted-foreground/50 tracking-wider">
          © 2025 鲲腾能科（上海）技术有限公司
        </p>
      </motion.div>
    </div>
  );
};

export default Index;

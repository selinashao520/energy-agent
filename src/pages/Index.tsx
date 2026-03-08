import { motion } from "framer-motion";
import { Cpu, Rocket, Globe, Database, Zap, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Cpu, label: "模块化技术包", desc: "即插即用解决方案" },
  { icon: Rocket, label: "敏捷试点落地", desc: "快速验证商业模式" },
  { icon: Globe, label: "全球传播矩阵", desc: "多语言国际传播" },
  { icon: Database, label: "碳数据平台", desc: "自主碳核算体系" },
];

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/20"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.2, 0.6, 0.2],
      scale: [1, 1.3, 1],
    }}
    transition={{ duration: 4 + delay, repeat: Infinity, delay }}
  />
);

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center justify-center relative overflow-hidden px-4 scanlines">
      {/* Animated grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Large ambient orbs */}
      <motion.div
        className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(192 100% 50% / 0.08), transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(152 100% 50% / 0.06), transparent 70%)" }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Floating particles */}
      <FloatingParticle delay={0} x="10%" y="20%" size={4} />
      <FloatingParticle delay={1.5} x="85%" y="30%" size={3} />
      <FloatingParticle delay={0.8} x="70%" y="70%" size={5} />
      <FloatingParticle delay={2} x="25%" y="80%" size={3} />
      <FloatingParticle delay={1} x="50%" y="15%" size={4} />
      <FloatingParticle delay={2.5} x="90%" y="60%" size={3} />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-accent/20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-accent/20 pointer-events-none" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-3xl"
      >
        {/* Decorative line */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
          <Zap className="w-4 h-4 text-primary/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-black mb-4 tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-gradient-bright">鲲腾能科</span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg tracking-[0.3em] uppercase text-primary/70 mb-2 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          KunTeng Energy Tech
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Shield className="w-4 h-4 text-accent/60" />
          <p className="text-lg md:text-2xl text-foreground/80 leading-relaxed">
            中国绿色能源技术 · 赋能全球碳中和
          </p>
          <Shield className="w-4 h-4 text-accent/60" />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative group">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-xl animate-pulse-glow pointer-events-none" />
            <motion.button
              onClick={() => navigate("/register")}
              className="relative glass-heavy rounded-full px-10 py-4 neon-border flex items-center gap-3 text-lg font-bold text-primary tracking-wide hover:bg-primary/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              开始与 AI 能源顾问对话
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-14 z-10 w-full max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            className="relative group glass-heavy rounded-xl p-5 text-center neon-border overflow-hidden cursor-default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <f.icon className="w-9 h-9 mx-auto mb-3 text-primary drop-shadow-[0_0_8px_hsl(192_100%_50%/0.4)]" />
            <p className="text-sm font-bold text-foreground tracking-wide">{f.label}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-6 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <p className="text-xs text-muted-foreground/40 tracking-wider">
          © 2025 鲲腾能科（上海）技术有限公司
        </p>
      </motion.div>
    </div>
  );
};

export default Index;

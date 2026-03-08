import { motion } from "framer-motion";
import { Cpu, Rocket, Globe, Database } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const features = [
  { icon: Cpu, label: "模块化技术包", desc: "即插即用解决方案" },
  { icon: Rocket, label: "敏捷试点落地", desc: "快速验证商业模式" },
  { icon: Globe, label: "全球传播矩阵", desc: "多语言国际传播" },
  { icon: Database, label: "碳数据平台", desc: "自主碳核算体系" },
];

const Index = () => {
  const registerUrl = `${window.location.origin}/register`;

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-3xl"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-gradient">鲲腾能科</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          KunTeng Energy Tech
        </motion.p>

        <motion.p
          className="text-xl md:text-2xl text-foreground/80 mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          中国绿色能源技术 · 赋能全球碳中和
        </motion.p>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="glass rounded-2xl p-4 inline-block border border-border/40">
            <QRCodeSVG
              value={registerUrl}
              size={180}
              bgColor="transparent"
              fgColor="hsl(187, 100%, 50%)"
              level="M"
            />
          </div>
          <p className="text-sm text-muted-foreground">扫码开始与 AI 能源顾问对话</p>
        </motion.div>
      </motion.div>

      {/* Feature icons */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 z-10 w-full max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            className="glass rounded-xl p-4 text-center hover:border-primary/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + i * 0.1, duration: 0.4 }}
          >
            <f.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-semibold text-foreground">{f.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.p
        className="absolute bottom-6 text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        © 2025 鲲腾能科（上海）技术有限公司
      </motion.p>
    </div>
  );
};

export default Index;

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <motion.button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-50 glass-heavy rounded-full px-4 py-2 neon-border flex items-center gap-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Globe className="w-4 h-4" />
      <span>{lang === "zh" ? "EN" : "中文"}</span>
    </motion.button>
  );
};

export default LanguageToggle;

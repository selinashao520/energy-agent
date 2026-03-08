import { Building2, Zap, Globe, TrendingUp, Brain, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Zap,
  Globe,
  TrendingUp,
  Brain,
  MessageSquare,
};

interface Props {
  onAction: (actionId: string) => void;
}

const actionKeys = [
  { id: "company", icon: "Building2" },
  { id: "products", icon: "Zap" },
  { id: "cases", icon: "Globe" },
  { id: "trends", icon: "TrendingUp" },
  { id: "ai", icon: "Brain" },
  { id: "contact", icon: "MessageSquare" },
];

const QuickActions = ({ onAction }: Props) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-3 pl-14">
      {actionKeys.map((action, i) => {
        const Icon = iconMap[action.icon];
        const label = t(`action.${action.id}`);
        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction(action.id)}
            className="glass hover:border-primary/50 hover:glow-primary text-foreground/80 hover:text-primary text-base px-5 py-3 rounded-full flex items-center gap-2.5 transition-all duration-200"
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickActions;

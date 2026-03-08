import { Building2, Zap, Globe, TrendingUp, Brain, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

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

const actions = [
  { id: "company", label: "了解公司", icon: "Building2" },
  { id: "products", label: "产品服务", icon: "Zap" },
  { id: "cases", label: "成功案例", icon: "Globe" },
  { id: "trends", label: "行业趋势", icon: "TrendingUp" },
  { id: "ai", label: "鲲腾AI", icon: "Brain" },
  { id: "contact", label: "留下需求", icon: "MessageSquare" },
];

const QuickActions = ({ onAction }: Props) => {
  return (
    <div className="flex flex-wrap gap-3 pl-14">
      {actions.map((action, i) => {
        const Icon = iconMap[action.icon];
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
            {action.label}
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickActions;

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "zh" | "en";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

// --- Translations ---
const translations: Record<Lang, Record<string, string>> = {
  zh: {
    // Index
    "index.subtitle": "中国绿色能源技术 · 赋能全球碳中和",
    "index.cta": "开始与 AI 能源顾问对话",
    "index.copyright": "© 2025 鲲腾能科（上海）技术有限公司",
    "index.heroAlt": "绿色能源科技",
    "index.networkAlt": "能源网络",

    // Register
    "register.title": "鲲腾能科",
    "register.subtitle": "身份验证",
    "register.nameLabel": "姓名",
    "register.phonePlaceholder": "请输入手机号",
    "register.namePlaceholder": "请输入姓名",
    "register.phoneLabel": "手机号",
    "register.submit": "进入对话 · Enter →",
    "register.nameError": "请输入您的姓名",
    "register.phoneError": "请输入有效的手机号",

    // Chat
    "chat.title": "AI 能源顾问",
    "chat.status": "KunTeng Energy · Online",
    "chat.live": "Live",
    "chat.inputPlaceholder": "输入您的问题...",

    // Quick actions
    "action.company": "了解公司",
    "action.products": "产品服务",
    "action.cases": "成功案例",
    "action.trends": "行业趋势",
    "action.esg": "ESG碳资讯",
    "action.carbon": "碳排查",
    "action.ai": "鲲腾AI",
    "action.contact": "留下需求",

    // Quick action prompts
    "prompt.company": "请介绍一下鲲腾能科是一家什么样的公司？",
    "prompt.products": "鲲腾能科有哪些主要产品和服务？",
    "prompt.cases": "能分享一些鲲腾能科的成功案例吗？",
    "prompt.trends": "当前新能源行业有哪些重要趋势？",
    "prompt.esg": "__SEARCH__请搜索最新的ESG和碳排放相关资讯",
    "prompt.carbon": "介绍一下企业碳排查和碳核算的基本流程？",
    "prompt.ai": "鲲腾AI板块包含哪些内容？",

    // Welcome message
    "chat.welcome": `您好！👋 欢迎来到**鲲腾能科**展台！

我是您的AI能源顾问，可以为您介绍：
- 🏢 公司概况与愿景
- ⚡ 产品与解决方案
- 🌍 全球成功案例
- 📈 行业趋势分析
- 🤖 鲲腾AI板块

请点击下方按钮或直接输入您感兴趣的话题，我来为您详细介绍！`,

    // Lead form
    "lead.title": "📋 留下您的需求",
    "lead.contactPerson": "联系人姓名 *",
    "lead.companyName": "公司名称",
    "lead.contactInfo": "手机/微信/邮箱 *",
    "lead.requirements": "您的需求或感兴趣的方向",
    "lead.submit": "提交需求",
    "lead.submitting": "提交中...",
    "lead.submitError": "提交失败，请稍后重试",
    "lead.nameError": "请填写联系人姓名",
    "lead.contactError": "请填写联系方式",
    "lead.success": "感谢您留下联系方式！🎉 我们的专业团队会尽快与您联系。\n\n如果您希望立即沟通，也可以直接联系我们：\n- 📞 +86-15202136096\n- 📧 selinashao@kuntengenergy.com",

    // Errors
    "error.rateLimit": "请求过于频繁，请稍后再试",
    "error.quota": "服务额度已用完，请联系管理员",
    "error.connection": "连接AI服务失败，请稍后重试",
    "error.network": "网络连接失败，请检查网络后重试",
  },
  en: {
    // Index
    "index.subtitle": "China's Green Energy Tech · Powering Global Carbon Neutrality",
    "index.cta": "Chat with AI Energy Consultant",
    "index.copyright": "© 2025 KunTeng Energy Tech (Shanghai) Co., Ltd.",
    "index.heroAlt": "Green Energy Technology",
    "index.networkAlt": "Energy Network",

    // Register
    "register.title": "KunTeng Energy",
    "register.subtitle": "Identity Verification",
    "register.nameLabel": "Name",
    "register.phonePlaceholder": "Enter your phone number",
    "register.namePlaceholder": "Enter your name",
    "register.phoneLabel": "Phone",
    "register.submit": "Enter Chat →",
    "register.nameError": "Please enter your name",
    "register.phoneError": "Please enter a valid phone number",

    // Chat
    "chat.title": "AI Energy Consultant",
    "chat.status": "KunTeng Energy · Online",
    "chat.live": "Live",
    "chat.inputPlaceholder": "Type your question...",

    // Quick actions
    "action.company": "About Us",
    "action.products": "Products",
    "action.cases": "Case Studies",
    "action.trends": "Trends",
    "action.esg": "ESG & Carbon",
    "action.carbon": "Carbon Audit",
    "action.ai": "KunTeng AI",
    "action.contact": "Contact Us",

    // Quick action prompts
    "prompt.company": "Can you introduce KunTeng Energy Tech?",
    "prompt.products": "What are the main products and services?",
    "prompt.cases": "Can you share some success stories?",
    "prompt.trends": "What are the key trends in new energy industry?",
    "prompt.esg": "__SEARCH__Search for the latest ESG and carbon emission news",
    "prompt.carbon": "Explain the basic process of corporate carbon auditing and accounting?",
    "prompt.ai": "What does KunTeng AI cover?",

    // Welcome message
    "chat.welcome": `Hello! 👋 Welcome to the **KunTeng Energy Tech** booth!

I'm your AI Energy Consultant. I can introduce:
- 🏢 Company Overview & Vision
- ⚡ Products & Solutions
- 🌍 Global Success Stories
- 📈 Industry Trend Analysis
- 🤖 KunTeng AI Division

Click a button below or type your question to get started!`,

    // Lead form
    "lead.title": "📋 Leave Your Requirements",
    "lead.contactPerson": "Contact Name *",
    "lead.companyName": "Company Name",
    "lead.contactInfo": "Phone / WeChat / Email *",
    "lead.requirements": "Your needs or areas of interest",
    "lead.submit": "Submit",
    "lead.submitting": "Submitting...",
    "lead.submitError": "Submission failed. Please try again.",
    "lead.nameError": "Please enter contact name",
    "lead.contactError": "Please enter contact info",
    "lead.success": "Thank you for your information! 🎉 Our team will reach out soon.\n\nFor immediate contact:\n- 📞 +86-15202136096\n- 📧 selinashao@kuntengenergy.com",

    // Errors
    "error.rateLimit": "Too many requests. Please try again later.",
    "error.quota": "Service quota exceeded. Please contact support.",
    "error.connection": "Failed to connect to AI service. Please retry.",
    "error.network": "Network error. Please check your connection.",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("zh");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "zh" ? "en" : "zh"));
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};



# 鲲腾能科 · 展会AI助手网站 — 实施计划

## 已获取的公司信息摘要

从 kuntengenergy.com 成功抓取到：
- **公司全称**：鲲腾能科（上海）技术有限公司，成立于2025年
- **定位**：面向新兴市场的新能源与碳资产管理公司
- **愿景**：成为全球最具影响力的中国绿色能源技术与数据解决方案提供商
- **使命**：以"技术+国际传播+数据主权"三核驱动，重塑全球碳市场话语体系
- **核心业务**：模块化技术包、敏捷试点落地、全球传播矩阵、自主碳数据平台
- **产品**：高效光伏技术包、智能储能系统、碳核算数据平台、AI赋能女性领导力课程
- **案例**：东南亚光伏、中东微电网、拉美碳核算
- **鲲腾AI板块**：AI赋能女性领导力、AI原生科创组织、人机流程设计、AI For Energy
- **联系方式**：上海浦东，+86-15202136096，selinashao@kuntengenergy.com

---

## 实施架构

```text
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  React前端       │────▶│ Edge Function    │────▶│ MiniMax API  │
│  欢迎页 + 聊天   │◀────│ supabase/chat    │◀────│ abab6.5s     │
└─────────────────┘     └──────────────────┘     └──────────────┘
                        ┌──────────────────┐
                        │ Supabase DB      │
                        │ leads 表         │
                        └──────────────────┘
```

## 步骤

### Step 1: 基础设施
- 连接 Lovable Cloud / Supabase
- 存储 `MINIMAX_API_KEY` 为 Supabase Secret
- 创建 `leads` 表（id, company_name, contact_person, requirements, contact_info, created_at）
- 创建 Edge Function `chat`：代理 MiniMax API，注入系统提示词（含全部公司知识）

### Step 2: 系统提示词 & 知识库 (`src/data/knowledge.ts`)

将官网全部内容结构化写入系统提示词，包括：
- 公司简介、愿景使命、核心优势
- 四大核心业务详细描述
- 四款产品详情（光伏、储能、碳核算、AI课程）
- 三大成功案例（越南、迪拜、巴西）
- 鲲腾AI板块（女性领导力、AI原生组织、人机流程、AI For Energy）
- 联系方式
- 已抓取的行业趋势数据（2025年风电光伏18亿千瓦等）

AI被定义为"鲲腾能科AI能源顾问"，具备以上全部知识，并能引导访客留下需求。

### Step 3: 前端页面

**欢迎页 (`/`)**
- 深蓝渐变背景 + 粒子/光效动画
- 鲲腾能科品牌标语："中国绿色能源技术 赋能全球碳中和"
- "开始对话" 按钮进入聊天
- 底部四大核心能力图标（模块化技术、敏捷落地、全球传播、碳数据平台）
- 响应式：大屏/平板/手机均适配

**聊天页 (`/chat`)**
- AI主动问候："您好！欢迎来到鲲腾能科展台，我是您的AI能源顾问..."
- 快捷入口卡片按钮：
  - 了解公司 → 发送预设prompt
  - 产品服务 → 发送预设prompt
  - 成功案例 → 发送预设prompt
  - 行业趋势 → 发送预设prompt（含数据图表）
  - 鲲腾AI → 发送预设prompt
  - 留下需求 → 弹出 LeadForm
- 自由文本输入 → 调用 MiniMax 流式回答
- 需求表单提交 → 存入 Supabase leads 表
- 嵌入 Recharts 能源数据图表（风电光伏装机趋势等）

### Step 4: 文件结构

| 文件 | 说明 |
|------|------|
| `src/pages/Index.tsx` | 深色科技风欢迎页 |
| `src/pages/Chat.tsx` | 聊天主界面 |
| `src/components/ChatMessage.tsx` | 消息气泡（支持Markdown） |
| `src/components/ChatInput.tsx` | 输入框 + 发送 |
| `src/components/QuickActions.tsx` | 快捷入口卡片 |
| `src/components/LeadForm.tsx` | 需求收集表单 |
| `src/components/EnergyChart.tsx` | Recharts图表 |
| `src/data/knowledge.ts` | 系统提示词 + 知识库 |
| `supabase/functions/chat/index.ts` | MiniMax代理 |

### 视觉风格
- 背景：深蓝渐变（#0a0e27 → #1a1f4e）
- 高亮色：霓虹蓝绿（#00d4ff, #00ff88）
- 聊天气泡：半透明毛玻璃
- 按钮：渐变发光效果
- 全响应式布局


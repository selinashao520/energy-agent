import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const leadSchema = z.object({
  contact_person: z.string().trim().min(1, "请填写联系人姓名").max(100),
  company_name: z.string().trim().max(200).optional(),
  contact_info: z.string().trim().min(1, "请填写联系方式").max(200),
  requirements: z.string().trim().max(2000).optional(),
});

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const LeadForm = ({ onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({
    contact_person: "",
    company_name: "",
    contact_info: "",
    requirements: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = leadSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      contact_person: form.contact_person.trim(),
      company_name: form.company_name.trim() || null,
      contact_info: form.contact_info.trim(),
      requirements: form.requirements.trim() || null,
    });

    setSubmitting(false);
    if (error) {
      toast.error("提交失败，请稍后重试");
      return;
    }
    onSuccess();
  };

  return (
    <div className="ml-11 glass rounded-2xl p-5 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">📋 留下您的需求</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="联系人姓名 *"
          value={form.contact_person}
          onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
          className="bg-secondary/50 border-border/50 text-sm"
        />
        <Input
          placeholder="公司名称"
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          className="bg-secondary/50 border-border/50 text-sm"
        />
        <Input
          placeholder="手机/微信/邮箱 *"
          value={form.contact_info}
          onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
          className="bg-secondary/50 border-border/50 text-sm"
        />
        <Textarea
          placeholder="您的需求或感兴趣的方向"
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          className="bg-secondary/50 border-border/50 text-sm min-h-[60px]"
          rows={2}
        />
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
        >
          {submitting ? "提交中..." : "提交需求"}
        </Button>
      </form>
    </div>
  );
};

export default LeadForm;

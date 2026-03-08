import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const LeadForm = ({ onClose, onSuccess }: Props) => {
  const { t } = useLanguage();

  const leadSchema = z.object({
    contact_person: z.string().trim().min(1, t("lead.nameError")).max(100),
    company_name: z.string().trim().max(200).optional(),
    contact_info: z.string().trim().min(1, t("lead.contactError")).max(200),
    requirements: z.string().trim().max(2000).optional(),
  });

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
      toast.error(t("lead.submitError"));
      return;
    }
    onSuccess();
  };

  return (
    <div className="ml-14 glass rounded-2xl p-5 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">{t("lead.title")}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder={t("lead.contactPerson")}
          value={form.contact_person}
          onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
          className="bg-secondary/50 border-border/50 text-base"
        />
        <Input
          placeholder={t("lead.companyName")}
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          className="bg-secondary/50 border-border/50 text-base"
        />
        <Input
          placeholder={t("lead.contactInfo")}
          value={form.contact_info}
          onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
          className="bg-secondary/50 border-border/50 text-base"
        />
        <Textarea
          placeholder={t("lead.requirements")}
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          className="bg-secondary/50 border-border/50 text-base min-h-[60px]"
          rows={2}
        />
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
        >
          {submitting ? t("lead.submitting") : t("lead.submit")}
        </Button>
      </form>
    </div>
  );
};

export default LeadForm;

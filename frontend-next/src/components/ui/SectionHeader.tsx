import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({ title, description, className, centered = false }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 max-w-2xl", centered ? "mx-auto text-center" : "", className)}>
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

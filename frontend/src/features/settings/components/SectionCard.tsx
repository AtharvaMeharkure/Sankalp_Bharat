import type { PropsWithChildren, ReactNode } from "react";

type SectionCardProps = PropsWithChildren<{
  title: string;
  description: string;
  action?: ReactNode;
}>;

export function SectionCard({
  title,
  description,
  action,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-steel">
            {description}
          </p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

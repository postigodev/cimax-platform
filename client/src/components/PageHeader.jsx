import { Badge } from "@/components/ui/badge";

export function PageHeader({ eyebrow, title, description, badge }) {
  return (
    <header className="border-b bg-card/40 px-4 py-6 md:px-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:gap-6">
        <div className="flex flex-col gap-2">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-semibold">{title}</h1>
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {badge ? <Badge variant="outline">{badge}</Badge> : null}
      </div>
    </header>
  );
}

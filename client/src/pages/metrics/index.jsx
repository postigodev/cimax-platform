import { useEffect, useMemo, useState } from "react";
import { Activity } from "lucide-react";
import { fetchMetrics } from "../../api";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const parseMetrics = (text) =>
  text
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [left, value] = line.split(" ");
      const name = left.split("{")[0];
      const labels = left.includes("{") ? left.slice(left.indexOf("{") + 1, -1) : "";
      return { name, labels, value };
    });

export function MetricsPage() {
  const [raw, setRaw] = useState("");
  const [error, setError] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    fetchMetrics().then(setRaw).catch((err) => setError(err.message));
  }, []);

  const rows = useMemo(() => parseMetrics(raw), [raw]);

  return (
    <div>
      <PageHeader
        eyebrow={t("metrics.eyebrow")}
        title={t("metrics.title")}
        description={t("metrics.description")}
        badge={`${rows.length} ${t("metrics.series").toLowerCase()}`}
      />
      <section className="grid gap-4 p-8">
        {error ? (
          <Card>
            <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : null}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity />
              {t("metrics.series")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("metrics.metric")}</TableHead>
                  <TableHead>{t("metrics.labels")}</TableHead>
                  <TableHead className="text-right">{t("metrics.value")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={`${row.name}-${index}`}>
                    <TableCell className="font-mono text-xs">{row.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.labels || "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      <Badge variant="outline">{row.value}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

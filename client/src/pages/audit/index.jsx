import { useEffect, useState } from "react";
import { FileClock } from "lucide-react";
import { api } from "../../api";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AuditPage() {
  const [state, setState] = useState({ loading: true, events: [] });
  const { t } = useI18n();

  useEffect(() => {
    api
      .get("/audit/events?limit=25")
      .then(({ data }) => setState({ loading: false, events: data.events, total: data.total }))
      .catch((error) =>
        setState({
          loading: false,
          events: [],
          error: error.response?.data?.message || error.message,
        })
      );
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow={t("audit.eyebrow")}
        title={t("audit.title")}
        description={t("audit.description")}
        badge={state.total === undefined ? "protected" : `${state.total} events`}
      />
      <section className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileClock />
              {t("audit.recent")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {state.error}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("audit.type")}</TableHead>
                    <TableHead>{t("audit.entity")}</TableHead>
                    <TableHead>{t("audit.source")}</TableHead>
                    <TableHead>{t("audit.occurred")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.events.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>
                        <Badge variant="secondary">{event.type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {event.entityType}:{event.entityId}
                      </TableCell>
                      <TableCell>{event.source}</TableCell>
                      <TableCell>{new Date(event.occurredAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

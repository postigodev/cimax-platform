import { useEffect, useState } from "react";
import { Activity, Database, FileClock, Gauge, ShieldCheck, Zap } from "lucide-react";
import { api, fetchHealth, fetchMetrics } from "../../api";
import { getStoredSession } from "../../auth";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const parseMetric = (text, name) => {
  const line = text
    .split("\n")
    .find((entry) => entry.startsWith(name) && !entry.startsWith("#"));
  return line ? line.split(" ").at(-1) : "0";
};

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const [state, setState] = useState({ loading: true });
  const session = getStoredSession();
  const { t } = useI18n();

  useEffect(() => {
    const load = async () => {
      try {
        const [health, metrics, doctors, orders] = await Promise.all([
          fetchHealth(),
          fetchMetrics(),
          api.get("/doctores/all"),
          api.get("/ordenes/get-all/2020-01-01/2030-01-01?limit=10"),
        ]);

        setState({
          loading: false,
          health,
          requestCount: parseMetric(metrics, "cimax_http_requests_total"),
          uptime: parseMetric(metrics, "cimax_process_uptime_seconds"),
          doctors: doctors.data.doctores.length,
          orders: orders.data.total ?? orders.data.ordenes_length,
          doctorsCache: doctors.headers["x-cache"] || "bypass",
          ordersCache: orders.headers["x-cache"] || "bypass",
        });
      } catch (error) {
        setState({
          loading: false,
          error: error.response?.data?.message || error.message,
        });
      }
    };

    load();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow={t("dashboard.eyebrow")}
        title={t("nav.dashboard")}
        description={t("dashboard.description")}
        badge={session?.role || "guest"}
      />
      <section className="grid gap-4 p-8">
        {state.loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-32 rounded-md" />
            ))}
          </div>
        ) : state.error ? (
          <Card>
            <CardContent className="p-6 text-sm text-destructive">{state.error}</CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={ShieldCheck}
                label={t("dashboard.apiHealth")}
                value={state.health.status}
                detail={t("dashboard.service", { service: state.health.service })}
              />
              <StatCard
                icon={Zap}
                label={t("dashboard.queueFailed")}
                value={state.health.queues?.failed ?? 0}
                detail={t("dashboard.waitingActive", {
                  waiting: state.health.queues?.waiting ?? 0,
                  active: state.health.queues?.active ?? 0,
                })}
              />
              <StatCard
                icon={Database}
                label={t("nav.orders")}
                value={state.orders}
                detail={`${t("dashboard.cache")} ${state.ordersCache}`}
              />
              <StatCard
                icon={Activity}
                label={t("dashboard.uptime")}
                value={`${state.uptime}s`}
                detail={t("dashboard.fromMetrics")}
              />
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge />
                    {t("dashboard.backendSignals")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md border p-3">
                    <p className="text-muted-foreground">{t("nav.doctors")}</p>
                    <p className="mt-1 font-semibold">{state.doctors}</p>
                    <Badge variant="outline">
                      {t("dashboard.cache")} {state.doctorsCache}
                    </Badge>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-muted-foreground">{t("dashboard.requestsMetric")}</p>
                    <p className="mt-1 font-semibold">{state.requestCount}</p>
                    <Badge variant="outline">Prometheus</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileClock />
                    {t("dashboard.visibleRobustness")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {[
                    "RBAC",
                    "Idempotency-Key",
                    "Redis cache",
                    "BullMQ worker",
                    "Audit log",
                    "Rate limit",
                    "OpenAPI",
                  ].map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

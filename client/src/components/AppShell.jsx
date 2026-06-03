import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity,
  Database,
  FileClock,
  FilePlus2,
  Gauge,
  LogOut,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { clearSession, getStoredSession } from "../auth";
import { applyApiSession } from "../api";
import { useI18n } from "../i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const links = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: Gauge },
  { to: "/", labelKey: "nav.createOrder", icon: FilePlus2 },
  { to: "/ordenes", labelKey: "nav.orders", icon: Database },
  { to: "/doctores", labelKey: "nav.doctors", icon: Users },
  { to: "/crear-doctor", labelKey: "nav.createDoctor", icon: Stethoscope },
  { to: "/metrics", labelKey: "nav.metrics", icon: Activity },
  { to: "/audit", labelKey: "nav.audit", icon: FileClock },
];

export function AppShell() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const { language, setLanguage, t } = useI18n();

  const logout = () => {
    clearSession();
    applyApiSession(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r bg-card/60">
          <div className="flex h-full flex-col">
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-md border bg-background">
                  <ShieldCheck />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase">{t("common.appName")}</p>
                  <p className="text-xs text-muted-foreground">{t("common.console")}</p>
                </div>
              </div>
            </div>
            <Separator />
            <nav className="flex flex-1 flex-col gap-1 p-3">
              {links.map(({ to, labelKey, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    ].join(" ")
                  }
                >
                  <Icon />
                  {t(labelKey)}
                </NavLink>
              ))}
            </nav>
            <Separator />
            <div className="flex flex-col gap-3 p-4">
              <div className="rounded-md border bg-background p-3">
                <p className="text-xs text-muted-foreground">{t("common.language")}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["en", "es"].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={language === option ? "default" : "outline"}
                      onClick={() => setLanguage(option)}
                    >
                      {option.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="rounded-md border bg-background p-3">
                <p className="text-xs text-muted-foreground">{t("common.activeSession")}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">
                    {session?.name || "No session"}
                  </span>
                  <Badge variant="secondary">{session?.role || "none"}</Badge>
                </div>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut data-icon="inline-start" />
                {t("common.signOut")}
              </Button>
            </div>
          </div>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, ShieldCheck } from "lucide-react";
import { applyApiSession } from "../../api";
import { roles, storeSession } from "../../auth";
import { useI18n } from "../../i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("viewer");
  const [name, setName] = useState("Portfolio reviewer");
  const [apiKey, setApiKey] = useState(roles.viewer.localKey);
  const { language, setLanguage, t } = useI18n();

  const selectRole = (nextRole) => {
    setRole(nextRole);
    setApiKey(roles[nextRole].localKey);
  };

  const submit = (event) => {
    event.preventDefault();
    const session = { role, name, apiKey };
    storeSession(session);
    applyApiSession(session);
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1fr_440px] lg:gap-12">
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-md border bg-card">
                <ShieldCheck />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase">{t("common.appName")}</p>
                <p className="text-sm text-muted-foreground">{t("common.console")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
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
          <div className="flex flex-col gap-4">
            <Badge className="w-fit" variant="secondary">
              {t("login.badge")}
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold md:text-5xl">
              {t("login.title")}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {t("login.description")}
            </p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{t("login.cardTitle")}</CardTitle>
            <CardDescription>{t("login.cardDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-5" onSubmit={submit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">{t("login.name")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(roles).map(([key, value]) => (
                  <Button
                    key={key}
                    type="button"
                    variant={role === key ? "default" : "outline"}
                    onClick={() => selectRole(key)}
                  >
                    {value.label}
                  </Button>
                ))}
              </div>
              <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                {t(`login.roles.${role}`)}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="apiKey">{t("login.apiKey")}</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="cimax_viewer_..."
                />
              </div>
              <Button type="submit">
                <KeyRound data-icon="inline-start" />
                {t("login.enter")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

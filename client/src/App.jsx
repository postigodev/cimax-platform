import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { PostOrden, Ordenes, Doctores, CreateDoctor } from "./pages";
import { Toaster } from "react-hot-toast";
import { AppShell } from "./components/AppShell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoginPage } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
import { MetricsPage } from "./pages/metrics";
import { AuditPage } from "./pages/audit";
import { applyApiSession } from "./api";
import { getStoredSession } from "./auth";
import { I18nProvider } from "./i18n";

const RequireSession = ({ children }) => {
  const session = getStoredSession();

  if (!session?.apiKey) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  React.useEffect(() => {
    applyApiSession();
  }, []);

  return (
    <I18nProvider>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <RequireSession>
                  <AppShell />
                </RequireSession>
              }
            >
              <Route path="/" element={<PostOrden />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/doctores" element={<Doctores />} />
              <Route path="/crear-doctor" element={<CreateDoctor />} />
              <Route path="/ordenes" element={<Ordenes />} />
              <Route path="/metrics" element={<MetricsPage />} />
              <Route path="/audit" element={<AuditPage />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </TooltipProvider>
    </I18nProvider>
  );
}

export default App;

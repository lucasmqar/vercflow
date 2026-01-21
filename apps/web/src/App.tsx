import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { ConfiguracaoInicialObra } from "./pages/ConfiguracaoInicialObra";
import { ObraDetailPage } from "./pages/ObraDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/obras/:id"
                element={isAuthenticated ? <ObraDetailPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/obras/:id/configurar"
                element={isAuthenticated ? <ConfiguracaoInicialObra /> : <Navigate to="/login" />}
              />
              <Route
                path="/"
                element={isAuthenticated ? <Index /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

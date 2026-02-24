import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/senior/Welcome";
import Home from "./pages/senior/Home";
import Medicines from "./pages/senior/Medicines";
import Meals from "./pages/senior/Meals";
import Wellbeing from "./pages/senior/Wellbeing";
import Overview from "./pages/caregiver/Overview";
import Alerts from "./pages/caregiver/Alerts";
import RemoteControls from "./pages/caregiver/RemoteControls";
import Analytics from "./pages/caregiver/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/senior" element={<Welcome />} />
            <Route path="/senior/home" element={<Home />} />
            <Route path="/senior/medicines" element={<Medicines />} />
            <Route path="/senior/meals" element={<Meals />} />
            <Route path="/senior/wellbeing" element={<Wellbeing />} />
            <Route path="/caregiver" element={<Overview />} />
            <Route path="/caregiver/alerts" element={<Alerts />} />
            <Route path="/caregiver/controls" element={<RemoteControls />} />
            <Route path="/caregiver/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;

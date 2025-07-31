import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IncomingMail from "./pages/IncomingMail";
import OutgoingMail from "./pages/OutgoingMail";
import Stats from "./pages/Stats";
import Budget from "./pages/Budget";
import Treasury from "./pages/Treasury";
import Forms from "./pages/Forms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/incoming" element={<IncomingMail />} />
          <Route path="/outgoing" element={<OutgoingMail />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/treasury" element={<Treasury />} />
          <Route path="/forms" element={<Forms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

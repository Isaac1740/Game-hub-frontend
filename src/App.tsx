import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CartPoleResult from "./pages/CartPoleResults";
import FrozenLakeResult from "./pages/FrozenLakeResults";
import GridWorldResult from "./pages/GridWorldResults";
import FourInRow from "./pages/FourInARow";
import Chess from "./pages/Chess";
import NumberGuess from "./pages/NumberGuess";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/results/cartpole" element={<CartPoleResult />} />
          <Route path="/results/frozenlake" element={<FrozenLakeResult />} />
          <Route path="/results/gridworld" element={<GridWorldResult />} />
          <Route path="/four-in-row" element={<FourInRow />} />
          <Route path="/chess" element={<Chess />} />
          <Route path="/number-guess" element={<NumberGuess />} />




          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import Home from './pages/Home';
import Pecas from './pages/Pecas';
import Portfolio from './pages/Portfolio';
import Admin from './pages/Admin';
import DriverControl from './pages/DriverControl';
import PortfolioDetail from './pages/PortfolioDetail';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pecas" element={<Pecas />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/drivercontrol" element={<DriverControl />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import Home from './pages/Home';
import Pecas from './pages/Pecas';
import Admin from './pages/Admin';
import DriverControl from './pages/DriverControl';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pecas" element={<Pecas />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/drivercontrol" element={<DriverControl />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
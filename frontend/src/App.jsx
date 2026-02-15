import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import IncidentListPage from './pages/IncidentListPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import CreateIncidentPage from './pages/CreateIncidentPage';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <div className="app-center">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<IncidentListPage />} />
              <Route path="incidents/new" element={<CreateIncidentPage />} />
              <Route path="incidents/:id" element={<IncidentDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

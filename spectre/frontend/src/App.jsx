import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import ExportGuide from './pages/ExportGuide.jsx';
import Manifesto from './pages/Manifesto.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <div className="grain min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/export" element={<ExportGuide />} />
          <Route path="/export/:platformId" element={<ExportGuide />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

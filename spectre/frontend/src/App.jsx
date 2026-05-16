import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import ExportGuide from './pages/ExportGuide.jsx';
import Import from './pages/Import.jsx';
import Setup from './pages/Setup.jsx';
import AiRouting from './pages/AiRouting.jsx';
import LocalAi from './pages/LocalAi.jsx';
import Faq from './pages/Faq.jsx';
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
          <Route path="/import" element={<Import />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/ai-routing" element={<AiRouting />} />
          <Route path="/local-ai" element={<LocalAi />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AnalyzePage from "./pages/AnalyzePage.jsx";
import Navbar from "./components/Navbar.jsx";
import BlobBackground from "./components/BlobBackground.jsx";
import CursorGlow from "./components/CursorGlow.jsx";
import IntroLoader from "./components/IntroLoader.jsx";
import { ToastProvider } from "./components/Toast.jsx";

// Scroll to top on route change
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

// Page transition wrapper — blur + scale (no more "slide up")
function PageWrapper({ children }) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(8px)",
        transform: visible ? "scale(1)" : "scale(0.985)",
        transition: "opacity 0.55s cubic-bezier(0.4,0,0.2,1), filter 0.5s ease, transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  // Only show intro on very first load (not on route changes)
  const [introShown, setIntroShown] = useState(false);
  const [appReady, setAppReady] = useState(false);

  const handleIntroDone = () => {
    setIntroShown(true);
    setTimeout(() => setAppReady(true), 100);
  };

  return (
    <BrowserRouter>
      <ToastProvider>
        {/* Intro splash — shown only once */}
        {!introShown && <IntroLoader onDone={handleIntroDone} />}

        {/* Fixed layered backgrounds */}
        <BlobBackground />
        <CursorGlow />

        <div
          className="relative min-h-screen text-slate-100"
          style={{
            zIndex: 1,
            opacity: appReady ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <Navbar />
          <ScrollReset />
          <PageWrapper>
            <Routes>
              <Route path="/"          element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analyze"   element={<AnalyzePage />} />
            </Routes>
          </PageWrapper>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

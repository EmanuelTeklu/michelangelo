import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/app-layout";
import { EvalPage } from "@/pages/eval-page";
import { ExtractPage } from "@/pages/extract-page";
import { LibraryPage } from "@/pages/library-page";
import { ProfilePage } from "@/pages/profile-page";
import { HistoryPage } from "@/pages/history-page";
import { SessionsPage } from "@/pages/sessions-page";

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider delayDuration={0}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<EvalPage />} />
            <Route path="/extract" element={<ExtractPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}

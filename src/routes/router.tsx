import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

import { AuthPage } from "../pages/auth/auth";
import { DashboardPage } from "../pages/dashboard";
import { EventsPage } from "../pages/Events";
import { CellsPage } from "../pages/cells";
import { WordsPage } from "../pages/Words";
import { NewsPage } from "../pages/News";
import { UsersPage } from "../pages/users";

export const RouterController = () => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.getToken() !== null;

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated && (
          <Route path="/*" element={<Navigate to="/" replace={true} />} />
        )}
        <Route path="/" element={<AuthPage />} />
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cells" element={<CellsPage />} />
            <Route path="/words" element={<WordsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

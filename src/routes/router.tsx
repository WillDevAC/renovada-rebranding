import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthPage } from "../pages/auth/auth";
import { DashboardPage } from "../pages/dashboard";
import { EventsPage } from "../pages/Events";
import { CellsPage } from "../pages/cells";
import { WordsPage } from "../pages/Words";


export const RouterController = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/cells" element={<CellsPage />} />
        <Route path="/words" element={<WordsPage />} />
        <Route path="/events" element={<EventsPage/>} />
      </Routes>
    </BrowserRouter>
  );
};
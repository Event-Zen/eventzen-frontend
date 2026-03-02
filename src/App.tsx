import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import CreateEventPage from "./pages/CreateEventPage";
import VendorProfilePage from "./pages/VendorProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/create-event"
          element={
            <MainLayout>
              <CreateEventPage />
            </MainLayout>
          }
        />

        <Route
          path="/vendor-profile"
          element={
            <MainLayout>
              <VendorProfilePage />
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
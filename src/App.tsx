import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import CreateEventPage from "./pages/CreateEventPage";
import VendorProfilePage from "./pages/VendorProfilePage";
import AddServicePage from "./pages/AddServicesPage";
import ServicePage from "./pages/ServicePage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import HelpCenterPage from "./pages/HelpCenterPage";

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

        <Route
          path="/vendor/add-service"
          element={
            <MainLayout>
              <AddServicePage />
            </MainLayout>
          }
        />

        <Route
          path="/services"
          element={
            <MainLayout>
              <ServicePage />
            </MainLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <MainLayout>
              <RoleSelectionPage />
            </MainLayout>
          }
        />

        <Route
          path="/help"
          element={
            <MainLayout>
              <HelpCenterPage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import CreateEventPage from "./pages/CreateEventPage";
import VendorProfilePage from "./pages/VendorProfilePage";
import AddServicePage from "./pages/AddServicesPage";
import ServicePage from "./pages/ServicePage";
import HelpCenterPage from "./pages/HelpCenterPage";
import SignUp from "./features/auth/ui/SignUp";
import Login from "./features/auth/ui/Login";
import PlannerProfilePage from "./pages/PlannerProfilePage";
import PaymentPage from "./pages/PaymentPage";



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
          path="/sign-up"
          element={
            <MainLayout>
              <SignUp />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
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

        {/* <Route
          path="/signup"
          element={
            <MainLayout>
              <RoleSelectionPage />
            </MainLayout>
          }
        /> */}

        <Route
          path="/help"
          element={
            <MainLayout>
              <HelpCenterPage />
            </MainLayout>
          }
        />

        <Route
          path="/payment"
          element={
            <MainLayout>
              <PaymentPage />
            </MainLayout>
          }
        />

        <Route
          path="/planner-profile"
          element={
            <MainLayout>
              <PlannerProfilePage />
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

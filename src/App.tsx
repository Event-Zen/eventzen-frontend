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
import UpcomingEventsPage from "./pages/UpcomingEventsPage";
import AttendeeProfilePage from "./pages/AttendeeProfilePage";

import { RoleRoute } from "./features/auth/ui/RoleRoute";
import { ProtectedRoute } from "./features/auth/ui/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
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
          path="/services"
          element={
            <MainLayout>
              <ServicePage />
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

        {/* Planner only */}
        <Route
          path="/create-event"
          element={
            <RoleRoute allow={["PLANNER"]}>
              <MainLayout>
                <CreateEventPage />
              </MainLayout>
            </RoleRoute>
          }
        />

        <Route
          path="/planner-profile"
          element={
            <RoleRoute allow={["PLANNER"]}>
              <MainLayout>
                <PlannerProfilePage />
              </MainLayout>
            </RoleRoute>
          }
        />

        {/* Vendor only */}
        <Route
          path="/vendor-profile"
          element={
            <RoleRoute allow={["VENDOR"]}>
              <MainLayout>
                <VendorProfilePage />
              </MainLayout>
            </RoleRoute>
          }
        />

        <Route
          path="/vendor/add-service"
          element={
            <RoleRoute allow={["VENDOR"]}>
              <MainLayout>
                <AddServicePage />
              </MainLayout>
            </RoleRoute>
          }
        />

        {/*auth-only (any logged in user) */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PaymentPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-events"
          element={
            <MainLayout>
              <UpcomingEventsPage />
            </MainLayout>
          }
        />

        <Route
  path="/attendee-profile"
  element={
    <MainLayout>
      <AttendeeProfilePage />
    </MainLayout>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
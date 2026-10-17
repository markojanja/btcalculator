import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { queryClient } from "./lib/queryClient";
import { STAFF_ROLES, ROLES } from "./constants/domain";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Root from "./components/Root";
import Protected from "./components/Protected";
import IndexPageRedirect from "./components/IndexPageRedirect";
import PipCalculator from "./pages/PipCalculator";
import PnlCalculator from "./pages/PnlCalculator";
import MarginCalculator from "./pages/MarginCalculator";
import SwapCalculator from "./pages/SwapCalculator";
import Converter from "./pages/Converter";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import Users from "./pages/Users";
import UserFormPage from "./pages/UserFormPage";
import NewFeatures from "./pages/NewFeatures";
import FeatureDetails from "./pages/FeatureDetails";
import FeatureFormPage from "./pages/FeatureFormPage";
import Dashboard from "./pages/Dashboard";
import AdminTasks from "./pages/AdminTasks";
import AdminTask from "./pages/AdminTask";
import UserGuides from "./pages/UserGuides";
import GuideDetails from "./pages/GuideDetails";
import GuideFormPage from "./pages/GuideFormPage";
import Clients from "./pages/Clients";
import ClientFormPage from "./pages/ClientFormPage";

// Toasts render inside the router so notification toasts can contain links.
const ToastLayout = () => (
  <>
    <ToastContainer
      position="top-right"
      autoClose={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
    />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <ToastLayout />,
    children: [
      { path: "/login", element: <Login /> },
      {
        path: "/",
        errorElement: <Error />,
        element: <Root />,
        children: [
          {
            element: <Protected roles={["SUPPORT"]} />,
            children: [{ path: "tasks", element: <Tasks /> }],
          },
          {
            element: <Protected roles={ROLES} />,
            children: [
              { index: true, element: <IndexPageRedirect /> },
              { path: "profile", element: <Profile /> },
              { path: "features", element: <NewFeatures /> },
              { path: "features/:id", element: <FeatureDetails /> },
              { path: "guides", element: <UserGuides /> },
              { path: "guides/new", element: <GuideFormPage /> },
              { path: "guides/:id", element: <GuideDetails /> },
              { path: "guides/:id/edit", element: <GuideFormPage /> },
              { path: "clients", element: <Clients /> },
              { path: "calculators/pip", element: <PipCalculator /> },
              { path: "calculators/pnl", element: <PnlCalculator /> },
              { path: "calculators/margin", element: <MarginCalculator /> },
              { path: "calculators/swap", element: <SwapCalculator /> },
              { path: "converter", element: <Converter /> },
            ],
          },
          {
            element: <Protected roles={STAFF_ROLES} />,
            children: [
              { path: "dashboard", element: <Dashboard /> },
              { path: "dashboard/tasks/:type", element: <AdminTasks /> },
              { path: "dashboard/task/:id", element: <AdminTask /> },
              { path: "users", element: <Users /> },
              { path: "users/add", element: <UserFormPage /> },
              { path: "users/edit/:id", element: <UserFormPage /> },
              { path: "features/new", element: <FeatureFormPage /> },
              { path: "features/:id/edit", element: <FeatureFormPage /> },
              { path: "clients/new", element: <ClientFormPage /> },
              { path: "clients/:id/edit", element: <ClientFormPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ThemeContextProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="App">
            <RouterProvider router={router} />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeContextProvider>
  );
}

export default App;

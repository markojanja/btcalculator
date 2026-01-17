import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import Root from "./components/Root";
import PipCalculator from "./pages/PipCalculator";
import PnlCalculator from "./pages/PnlCalculator";
import MarginCalculator from "./pages/MarginCalculator";
import SwapCalculator from "./pages/SwapCalculator";
import Converter from "./pages/Converter";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Protected from "./components/Protected";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import NewFeatures from "./pages/NewFeatures";
import AddFeature from "./pages/AddFeature";
import FeatureDetails from "./pages/FeatureDetails";
import EditFeature from "./pages/EditFeature";
import IndexPageRedirect from "./components/IndexPageRedirect";
import Dashboard from "./pages/Dashboard";
import AdminTasks from "./pages/AdminTasks";
import AdminTask from "./pages/AdminTask";
import UserGuides from "./pages/UserGuides";
import AddGuide from "./pages/AddGuide";
import GuideDetails from "./pages/GuideDetails";
import EditGuide from "./pages/EditGuide";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
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
        element: <Protected roles={["ADMIN", "MANAGER", "SUPPORT"]} />,
        children: [
          { index: true, element: <IndexPageRedirect /> },
          { path: "profile", element: <Profile /> },
          { path: "features/", element: <NewFeatures /> },
          { path: "features/:id", element: <FeatureDetails /> },
          { path: "guides", element: <UserGuides /> },
          { path: "guides/:id", element: <GuideDetails /> },
          { path: "guides/new", element: <AddGuide /> },
          { path: "guides/:id/edit", element: <EditGuide /> },
        ],
      },
      {
        element: <Protected roles={["ADMIN", "MANAGER"]} />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          {
            path: "dashboard/tasks/:type",
            element: <AdminTasks />,
          },
          {
            path: "dashboard/task/:id",
            element: <AdminTask />,
          },
          { path: "users", element: <Users /> },
          { path: "users/add", element: <AddUser /> },
          { path: "users/edit/:id", element: <EditUser /> },
          { path: "features/new", element: <AddFeature /> },
          { path: "features/:id/edit", element: <EditFeature /> },
        ],
      },
      {
        path: "calculators",
        element: <Protected roles={["ADMIN", "MANAGER", "SUPPORT"]} />,
        children: [
          { path: "pip", element: <PipCalculator /> },
          { path: "pnl", element: <PnlCalculator /> },
          { path: "margin", element: <MarginCalculator /> },
          { path: "swap", element: <SwapCalculator /> },
        ],
      },
      {
        path: "converter",
        element: <Protected roles={["ADMIN", "MANAGER", "SUPPORT"]} />,
        children: [{ index: true, element: <Converter /> }],
      },
    ],
  },
]);

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastContainer
            position="top-right"
            autoClose={false}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
          />
          <div className="App">
            <RouterProvider router={router} />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;

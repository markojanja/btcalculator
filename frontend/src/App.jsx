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
        path: "/",
        element: <Protected />,
        children: [
          { index: true, element: <Tasks /> },
          { path: "/profile", element: <Profile /> },
          { path: "/users", element: <Users /> },
          { path: "/users/add", element: <AddUser /> },
          { path: "/users/edit/:id", element: <EditUser /> },
          { path: "/features/", element: <NewFeatures /> },
          { path: "/features/new", element: <AddFeature /> },
          { path: "/features/:id", element: <FeatureDetails /> },
        ],
      },
      {
        path: "/calculators",
        element: <Protected />,
        children: [
          { path: "/calculators/pip", element: <PipCalculator /> },
          { path: "/calculators/pnl", element: <PnlCalculator /> },
          { path: "/calculators/margin", element: <MarginCalculator /> },
          { path: "/calculators/swap", element: <SwapCalculator /> },
        ],
      },
      {
        path: "/converter",
        element: <Protected />,
        children: [{ index: true, element: <Converter /> }],
      },
    ],
  },
]);

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;

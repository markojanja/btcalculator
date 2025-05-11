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

//app
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        index: true,
        element: <PipCalculator />,
      },
      {
        path: "/pnl",
        element: <PnlCalculator />,
      },
      {
        path: "/margin",
        element: <MarginCalculator />,
      },
      {
        path: "/swap",
        element: <SwapCalculator />,
      },
      {
        path: "/converter",
        element: <Converter />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeContextProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </ThemeContextProvider>
  );
}

export default App;

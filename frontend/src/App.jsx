import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PipCalculator from "./components/PipCalculator";
import PnlCalculator from "./components/PnlCalculator";
import Root from "./components/Root";
import MarginCalculator from "./components/MarginCalculator";
import SwapCalculator from "./components/SwapCalculator";
import Converter from "./components/Converter";
//app
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
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
  return <RouterProvider router={router} />;
}

export default App;

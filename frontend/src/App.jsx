import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PipCalculator from "./components/PipCalculator";
import PnlCalculator from "./components/PnlCalculator";
import Root from "./components/Root";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

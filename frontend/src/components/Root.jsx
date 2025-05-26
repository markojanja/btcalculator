import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import { NavContextProvider } from "../contexts/NavContext";
import Sidebar from "./Sidebar";
const Root = () => {
  return (
    <>
      <NavContextProvider>
        <Header />
        <main className="main" style={{ position: "relative" }}>
          <Sidebar />
          <Outlet />
        </main>
        <Footer />
      </NavContextProvider>
    </>
  );
};

export default Root;

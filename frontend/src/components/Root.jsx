import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import { NavContextProvider } from "../contexts/NavContext";
import Sidebar from "./Sidebar";
import { KanbanContextProvider } from "../contexts/KanbanContext";
const Root = () => {
  return (
    <>
      <NavContextProvider>
        <KanbanContextProvider>
          <Header />
          <main className="main">
            <Sidebar />
            <Outlet />
          </main>
          <Footer />
        </KanbanContextProvider>
      </NavContextProvider>
    </>
  );
};

export default Root;

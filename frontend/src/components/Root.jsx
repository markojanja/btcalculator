import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import AppBreadcrumb from "./AppBreadcrumb";
import { NavContextProvider } from "../contexts/NavContext";
import NotificationListener from "./NotificationListener";

const Root = () => {
  return (
    <NavContextProvider>
      <NotificationListener />
      <Header />
      <main className="flex flex-col flex-1">
        <Sidebar />
        <AppBreadcrumb />
        <Outlet />
      </main>
      <Footer />
    </NavContextProvider>
  );
};

export default Root;

import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { NavContextProvider } from "../contexts/NavContext";
import Sidebar from "./Sidebar";
import { KanbanContextProvider } from "../contexts/KanbanContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../contexts/AuthContext";
import AppBreadcrumb from "./AppBreadcrumb";

const Root = () => {
  const location = useLocation();
  const hideBreadcrumb = location.pathname === "/"; // ✅ hide on index/redirect
  console.log("hideBreadcrumb:", hideBreadcrumb, location.pathname);
  return (
    <>
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
          <NavContextProvider>
            <KanbanContextProvider>
              <Header />
              <main className="flex flex-col flex-1">
                <Sidebar />
                <AppBreadcrumb />
                <Outlet />
              </main>
              <Footer />
            </KanbanContextProvider>
          </NavContextProvider>
        </NotificationProvider>
      </AuthProvider>
    </>
  );
};

export default Root;

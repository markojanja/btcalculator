import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { NavContextProvider } from "../contexts/NavContext";
import Sidebar from "./Sidebar";
import { KanbanContextProvider } from "../contexts/KanbanContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../contexts/AuthContext";
import AppBreadcrumb from "./AppBreadcrumb";

const Root = () => {
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
              {/* Sidebar is a slide-in drawer, opened from the topbar */}
              <div className="flex min-h-screen w-full">
                <Sidebar />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Header />
                  <main className="flex flex-1 flex-col pt-4">
                    <AppBreadcrumb />
                    <Outlet />
                  </main>
                  <Footer />
                </div>
              </div>
            </KanbanContextProvider>
          </NavContextProvider>
        </NotificationProvider>
      </AuthProvider>
    </>
  );
};

export default Root;

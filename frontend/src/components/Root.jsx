import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { NavContextProvider } from "../contexts/NavContext";
const Root = () => {
  return (
    <>
      <NavContextProvider>
        <Header />
        <main className="main">
          <MobileNav />
          <Outlet />
        </main>
        <Footer />
      </NavContextProvider>
    </>
  );
};

export default Root;

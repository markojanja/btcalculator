import { createContext, useState } from "react";

const NavContext = createContext(null);

const NavContextProvider = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
    console.log(sidebarActive);
  };

  return (
    <NavContext.Provider value={{ sidebarActive, toggleSidebar }}>{children}</NavContext.Provider>
  );
};

export { NavContext, NavContextProvider };

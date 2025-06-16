import { createContext, useState } from "react";

const NavContext = createContext(null);

const NavContextProvider = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
    console.log(sidebarActive);
  };

  const closeSidebar = () => {
    setSidebarActive(false);
  };

  return (
    <NavContext.Provider value={{ sidebarActive, closeSidebar, toggleSidebar }}>
      {children}
    </NavContext.Provider>
  );
};

export { NavContext, NavContextProvider };

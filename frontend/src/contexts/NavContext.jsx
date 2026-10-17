import { createContext, useState } from "react";

const NavContext = createContext(null);

const NavContextProvider = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive((active) => !active);
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

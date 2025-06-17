import { NavLink } from "react-router-dom";

const Error = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: "1",
      }}
    >
      <h2>Page you are trying to reach do not exists or it is under construction.</h2>
      <NavLink to={"/"}>Go back to the home page</NavLink>
    </div>
  );
};

export default Error;

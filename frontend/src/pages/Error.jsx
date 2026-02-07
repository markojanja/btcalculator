import { NavLink } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h2 className="text-xl font-bold">
        Page you are trying to reach do not exists or it is under construction.
      </h2>
      <NavLink to={"/"}>Go back to the home page</NavLink>
    </div>
  );
};

export default Error;

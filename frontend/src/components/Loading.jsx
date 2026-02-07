import { ImSpinner9 } from "react-icons/im";
const Loading = () => {
  return (
    <div
      className="fixed bg-background inset-0 flex items-center justify-center"
      id="loading"
    >
      <ImSpinner9 className="text-primary" size={36} />
    </div>
  );
};

export default Loading;

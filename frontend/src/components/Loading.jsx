import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div
      className="fixed bg-background inset-0 flex items-center justify-center"
      id="loading"
    >
      <LoaderCircle className="text-primary animate-spin" size={36} />
    </div>
  );
};

export default Loading;

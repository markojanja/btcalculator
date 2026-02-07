import { IoMdInformationCircleOutline } from "react-icons/io";
import { Card, CardContent } from "@/components/ui/card";

const Info = ({ editMode }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {editMode ? (
        <Card className="bg-blue-200 w-1/3 flex-row text-blue-950 border-blue-950 border p-4 justify-center">
          <CardContent className="flex flex-row justify-center items-center font-bold">
            <IoMdInformationCircleOutline size={"24"} />
            <p>Edit mode is on, fill in the required fields.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-blue-200 w-1/3 flex-row text-blue-950 border-blue-950 border p-4 justify-center">
          <CardContent className="flex flex-row justify-center items-center font-bold">
            <IoMdInformationCircleOutline size={"24"} />
            <p>Edit mode is off, prices are fetched online.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Info;

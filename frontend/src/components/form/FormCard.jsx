import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

// Page frame shared by the create/edit forms.
const FormCard = ({ title, backTo, backLabel, children }) => (
  <div className="flex flex-col w-full p-2">
    <Card className="w-full lg:w-187.5 mx-auto">
      <CardTitle className="px-6">
        <h3 className="text-left font-bold">{title}</h3>
      </CardTitle>
      <CardContent>{children}</CardContent>
      {backTo && (
        <Link className="flex justify-end items-center gap-1 mr-6" to={backTo}>
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>
      )}
    </Card>
  </div>
);

export default FormCard;

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";

const DashCard = ({ title, value, linkText, linkHref, Icon, bg, clr }) => {
  return (
    <Card>
      <CardDescription>
        <p className={`${clr} font-bold text-3xl text-left px-6`}>{title}</p>
      </CardDescription>
      <CardContent>
        <div className="flex flex-row-reverse justify-between">
          <div className="flex flex-col mr-3">
            <h3 className="text-6xl font-bold">{value}</h3>
            <Link to={linkHref}>{linkText}</Link>
          </div>
          <div className="flex">
            <div
              className={`${bg} flex items-center justify-center p-6 rounded-sm`}
            >
              <Icon size={32} className={clr} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashCard;

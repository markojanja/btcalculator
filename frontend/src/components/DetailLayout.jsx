import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import HtmlContent from "./HtmlContent";

// Read view for a guide or feature: title bar with actions, the rich-text
// body, and a details card with a back link.
const DetailLayout = ({ title, actions, html, details, backTo, backLabel }) => (
  <div className="flex flex-col w-full lg:w-187.5 mx-auto gap-4 p-2">
    <div className="flex justify-between items-center w-full bg-card shadow-sm p-4 rounded-md">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex gap-2 items-center">{actions}</div>
    </div>
    <Card>
      <HtmlContent
        html={html}
        className="flex flex-col overflow-y-auto max-h-screen text-left p-4 gap-4"
      />
    </Card>
    <Card className="text-left px-2">
      <CardContent className="flex flex-col">
        {details}
        <Link className="self-end" to={backTo}>
          {backLabel}
        </Link>
      </CardContent>
    </Card>
  </div>
);

export default DetailLayout;

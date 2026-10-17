import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const TableCard = ({ title, footerLink, className, children }) => (
  <Card className={cn("overflow-auto", className)}>
    <CardTitle className="text-left px-6">
      <h4>{title}</h4>
    </CardTitle>
    <CardContent>
      <Table>{children}</Table>
    </CardContent>
    <CardFooter className="mb-0 mt-auto">
      <Link to={footerLink.to}>{footerLink.label}</Link>
    </CardFooter>
  </Card>
);

export default TableCard;

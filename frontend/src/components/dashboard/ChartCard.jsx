import { Card, CardContent, CardTitle } from "@/components/ui/card";

const ChartCard = ({ title, isEmpty, children }) => (
  <Card className="col-span-2 min-w-0">
    <CardTitle className="text-left px-6">
      <h3>{title}</h3>
    </CardTitle>
    <CardContent>
      <div className="relative flex p-2 h-75 w-full items-center justify-center">
        {isEmpty ? <h2>No Pending Tasks at the moment</h2> : children}
      </div>
    </CardContent>
  </Card>
);

export default ChartCard;

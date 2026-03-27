import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ClientCard = ({ client }) => {
  return (
    <Card className={"w-full text-left items-start justify-start mx-auto"}>
      <CardContent className={"w-full"}>
        <CardTitle className={"mb-2"}>
          <h3 className="text-lg">{client.name}</h3>
        </CardTitle>
        <Separator className={"w-full mb-2"} />
        <p>Status:</p>
        <Badge variant="secondary">{client.status}</Badge>

        <p>Server:</p>
        <Badge className="bg-blue-300 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {client.server[0]}
        </Badge>
        <p>Platform:</p>

        {client.platform.map((p) => (
          <Badge className={"mr-1.5"} key={p}>
            {p}
          </Badge>
        ))}
        <p>Added: {client.user.username}</p>
      </CardContent>
    </Card>
  );
};

export default ClientCard;

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ClientCard = ({ client }) => {
  return (
    <Card
      className={"w-full lg:w-1/3 text-left items-start justify-start mx-auto"}
    >
      <CardContent className={"w-full"}>
        <CardTitle className={"mb-2"}>
          <h3 className="text-lg">{client.name}</h3>
        </CardTitle>
        <Separator className={"w-full mb-2"} />
        <p>Status:</p>
        <Badge variant="secondary">{client.status}</Badge>

        <p>Server:</p>
        <Badge className="bg-purple-300 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
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

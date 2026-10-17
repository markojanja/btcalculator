import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useHandover } from "../api/tasks";
import useKanban from "../hooks/useKanban";
import FullScreenPanel from "./FullScreenPanel";
import HtmlContent from "./HtmlContent";

const HandoverModal = () => {
  const { closePanel } = useKanban();
  const { data: tickets = [], isLoading } = useHandover();
  const [copiedId, setCopiedId] = useState(null);

  // Copies as HTML so formatting survives when pasted into a ticket.
  const handleCopy = async (task) => {
    try {
      const blob = new Blob([task.description], { type: "text/html" });
      await navigator.clipboard.write([new ClipboardItem({ "text/html": blob })]);
      setCopiedId(task.id);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <FullScreenPanel onClose={closePanel} className="items-start">
      <h2 className="w-full font-bold text-2xl p-6">Handover</h2>
      <div className="flex flex-1 flex-col gap-4 items-center w-full p-2">
        {!isLoading && tickets.length === 0 && (
          <div className="flex items-center justify-center text-2xl">
            There are no CS Tickets for handover
          </div>
        )}
        {tickets.map((task) => (
          <Accordion
            key={task.id}
            type="single"
            collapsible
            className="w-full md:w-3/4 lg:w-1/2 bg-secondary py-2 px-4 rounded-md"
          >
            <AccordionItem value={task.id}>
              <AccordionTrigger className="text-2xl font-bold">
                [{task.client?.name ?? "No client"}] - {task.title}
              </AccordionTrigger>
              <AccordionContent className="text-left">
                <Button variant="outline" onClick={() => handleCopy(task)}>
                  {copiedId === task.id ? "Copied!" : "Copy to clipboard"}
                </Button>
                <HtmlContent
                  html={task.description}
                  className="flex flex-col overflow-y-auto max-h-screen text-left p-4 gap-4"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </FullScreenPanel>
  );
};

export default HandoverModal;

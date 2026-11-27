import { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { Check, ClipboardCopy, Inbox } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import useKanban from "../hooks/useKanban";
import { Dialog, EmptyState, PageLoading } from "./PageUI";

const HandoverModal = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [csTasks, setCsTasks] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const { toggleHandoverModal } = useKanban();

  useEffect(() => {
    const getHandover = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/tasks/handover`, {
          withCredentials: true,
        });
        setCsTasks(res.data);
      } catch {
        setCsTasks([]); // the error toast shows what went wrong
      }
    };
    getHandover();
  }, []);

  // Copies the task as formatted HTML, ready to paste into an email or Jira
  const handleCopy = async (task) => {
    try {
      const blob = new Blob([task.description], { type: "text/html" });
      await navigator.clipboard.write([new ClipboardItem({ "text/html": blob })]);
      setCopiedId(task.id);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <Dialog
      title="Shift handover"
      description="Open CS tickets to hand over to the next shift."
      onClose={toggleHandoverModal}
      size="lg"
    >
      {csTasks === null ? (
        <PageLoading />
      ) : csTasks.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nothing to hand over"
          description="There are no open CS tickets."
        />
      ) : (
        <Accordion type="single" collapsible className="flex flex-col gap-2">
          {csTasks.map((task) => (
            <AccordionItem
              key={task.id}
              value={task.id}
              className="rounded-lg border px-4 last:border-b"
            >
              <AccordionTrigger className="gap-3 text-left hover:no-underline">
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-semibold">{task.title}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {task.client?.name ?? "No client"}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 text-left">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(task)}
                  className="self-end"
                >
                  {copiedId === task.id ? <Check /> : <ClipboardCopy />}
                  {copiedId === task.id ? "Copied" : "Copy to clipboard"}
                </Button>
                <div
                  className="rte flex flex-col gap-4 rounded-lg bg-muted/40 p-4 text-left"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(task.description),
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Dialog>
  );
};

export default HandoverModal;

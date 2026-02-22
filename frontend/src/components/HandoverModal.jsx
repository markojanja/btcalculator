import { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import useKanban from "../hooks/useKanban";
import { IoMdClose } from "react-icons/io";

const HandoverModal = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [csTasks, setCsTasks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const { toggleHandoverModal } = useKanban();
  useEffect(() => {
    const getHandover = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/tasks/handover`, {
          withCredentials: true,
        });
        console.log(res.data);
        setCsTasks(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getHandover();
  }, []);

  const handleCopy = async (task) => {
    try {
      const blob = new Blob([task.description], { type: "text/html" });

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blob,
        }),
      ]);

      setCopiedId(task.id);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background pt-12 pb-12 overflow-y-auto">
      <button
        className="absolute right-8 top-4 text-muted-foreground hover:text-foreground"
        onClick={toggleHandoverModal}
      >
        <IoMdClose size={22} />
      </button>
      <div className="flex flex-1 flex-col gap-4 items-center w-full p-2">
        {csTasks.map((task) => {
          const clean = DOMPurify.sanitize(task.description);
          return (
            <Accordion
              key={task.id}
              type="single"
              collapsible
              className="w-full md:w-3/4 lg:w-1/2 bg-secondary p-4 rounded-md"
            >
              <AccordionItem value={task.id}>
                <AccordionTrigger className={"text-2xl font-bold"}>
                  {task.title}
                </AccordionTrigger>

                <AccordionContent className="text-left">
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(task)}
                    className="self-end"
                  >
                    {copiedId === task.id ? "Copied!" : "Copy to clipboard"}
                  </Button>
                  <div
                    className="flex flex-col overflow-y-scroll max-h-screen text-left p-4 gap-4 rte"
                    dangerouslySetInnerHTML={{ __html: clean }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default HandoverModal;

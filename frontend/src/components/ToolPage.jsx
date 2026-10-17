import { useState } from "react";
import { CircleHelp, Info, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import HelpModal from "./HelpModal";

// Frame for the calculators and the converter: a card with a title, a help
// button that opens `help` (markdown), an optional edit-mode toggle, and
// whatever result is passed in shown below the card.
const ToolPage = ({
  title,
  help,
  editMode,
  onEditModeChange,
  showEditModeInfo = false,
  result,
  children,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const hasEditMode = typeof onEditModeChange === "function";

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full min-h-screen gap-4 p-2">
      {showHelp && (
        <HelpModal content={help} onClose={() => setShowHelp(false)} />
      )}

      {showEditModeInfo && (
        <Card className="bg-blue-200 w-full lg:w-1/3 text-blue-950 border-blue-950 border p-4">
          <CardContent className="flex flex-row justify-center items-center gap-2 font-bold">
            <Info className="h-6 w-6 shrink-0" />
            <p>
              {editMode
                ? "Edit mode is on, fill in the required fields."
                : "Edit mode is off, prices are fetched online."}
            </p>
          </CardContent>
        </Card>
      )}

      <Card
        className={cn("w-full lg:w-1/3 p-4", editMode && "border-primary border")}
      >
        <CardHeader className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <h3 className="text-lg font-bold">{title}</h3>
            <button
              type="button"
              aria-label="How to use"
              onClick={() => setShowHelp(true)}
            >
              <CircleHelp className="h-4 w-4" />
            </button>
          </div>
          {hasEditMode && (
            <button
              type="button"
              aria-label="Toggle edit mode"
              className={editMode ? "text-primary" : "text-foreground"}
              onClick={() => onEditModeChange(!editMode)}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-2">{children}</CardContent>
      </Card>

      {result}
    </div>
  );
};

export default ToolPage;

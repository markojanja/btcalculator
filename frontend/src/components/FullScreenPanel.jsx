import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Full-screen overlay with a close button, used for the task and help dialogs.
const FullScreenPanel = ({ onClose, className, children }) => (
  <div
    className={cn(
      "fixed inset-0 z-50 flex flex-col items-center bg-background pt-12 pb-12 overflow-y-auto p-2",
      className,
    )}
  >
    <button
      type="button"
      aria-label="Close"
      className="absolute right-8 top-4 text-muted-foreground hover:text-foreground z-10"
      onClick={onClose}
    >
      <X size={22} />
    </button>
    {children}
  </div>
);

export default FullScreenPanel;

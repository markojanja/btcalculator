"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

function FileInput({ accept, onChange, fileName }) {
  const inputRef = React.useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-1 w-auto">
      <Button onClick={handleClick} className="w-full justify-center">
        <Upload className="h-4 w-4" />
        {fileName || "Select a file"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}

export default FileInput;

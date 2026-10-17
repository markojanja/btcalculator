import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import help from "../content/help/converter.md?raw";
import { api } from "../lib/api";
import DownloadButton from "../components/DownloadButton";
import FileInput from "../components/FileInput";
import SymbolList from "../components/SymbolList";
import ToolPage from "../components/ToolPage";

const Converter = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [error, setError] = useState("");

  const upload = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("jsonFile", jsonFile);
      formData.append("xlsxFile", excelFile);
      return api.post("/", formData).then((res) => res.data);
    },
  });

  const handleUpload = () => {
    if (!jsonFile || !excelFile) {
      setError("Please select both files before uploading.");
      return;
    }
    setError("");
    upload.mutate();
  };

  const result = upload.data;

  return (
    <ToolPage title="Excel to JSON Swap converter" help={help}>
      <FieldGroup>
        <Field>
          <Label>Upload valid JSON</Label>
          <FileInput
            accept=".json"
            fileName={jsonFile?.name}
            onChange={(e) => setJsonFile(e.target.files[0])}
          />
        </Field>
        <Field>
          <Label>Upload valid Excel</Label>
          <FileInput
            accept=".xlsx"
            fileName={excelFile?.name}
            onChange={(e) => setExcelFile(e.target.files[0])}
          />
        </Field>
        <FieldSeparator />
      </FieldGroup>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleUpload} disabled={upload.isPending}>
        {upload.isPending ? "Loading..." : "Upload and Update"}
      </Button>
      {upload.isPending && (
        <div className="flex justify-center py-4">
          <LoaderCircle className="h-9 w-9 animate-spin text-primary" />
        </div>
      )}
      {result && (
        <>
          <p>{result.message}</p>
          <DownloadButton fileName={jsonFile.name} />
          {result.noMatch.symbols.length > 0 && (
            <>
              <h3 className="list-heading">{result.noMatch.message}</h3>
              <SymbolList symbols={result.noMatch.symbols} />
            </>
          )}
        </>
      )}
    </ToolPage>
  );
};

export default Converter;

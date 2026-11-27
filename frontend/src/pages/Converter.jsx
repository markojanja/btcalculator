import { useRef, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  FileJson,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import DownloadButton from "../components/DownloadButton";
import { converterHowTo } from "../utils/helpers";
import { Button } from "@/components/ui/button";
import {
  CalculatorPage,
  FormCard,
  FormSection,
  HelpDialog,
  ResultCard,
} from "../components/CalculatorUI";
import { cn } from "@/lib/utils";

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** Click or drag a file onto the box. */
const FileDropZone = ({ label, description, accept, icon: Icon, file, onFile }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = (fileList) => {
    const picked = fileList?.[0];
    if (picked) onFile(picked);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-4 transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          dragging
            ? "border-primary bg-primary/5"
            : file
              ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
        )}
      >
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg",
            file
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "bg-muted text-muted-foreground",
          )}
        >
          {file ? <Icon className="size-5" /> : <Upload className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          {file ? (
            <>
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatSize(file.size)} · click to replace
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">
                Drop file here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </>
          )}
        </div>
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label={`Remove ${file.name}`}
          >
            <X />
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => pick(e.target.files)}
        />
      </div>
    </div>
  );
};

const Converter = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [downloadId, setDownloadId] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleUpload = async () => {
    if (!jsonFile || !excelFile) return;

    const formData = new FormData();
    formData.append("jsonFile", jsonFile);
    formData.append("xlsxFile", excelFile);
    try {
      setLoading(true);
      setSuccess("");
      setDownloadId(null);
      setSymbols([]);
      const response = await axios.post(`${BACKEND_URL}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setSuccess(response.data.message);
      setSymbols(response.data.noMatch.symbols);
      setDownloadId(response.data.downloadId);
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setLoading(false);
    }
  };

  const bothSelected = jsonFile && excelFile;

  return (
    <CalculatorPage
      icon={ArrowLeftRight}
      title="Swap converter"
      description="Update the swaps in an MT5 symbols JSON from an Excel swap sheet."
      onHelp={() => setShowModal(true)}
    >
      {showModal && (
        <HelpDialog
          title="Swap converter"
          content={converterHowTo.content}
          onClose={() => setShowModal(false)}
        />
      )}

      <FormCard
        onSubmit={handleUpload}
        submitting={!bothSelected || loading}
        submitLabel={
          loading ? (
            <>
              <Loader2 className="animate-spin" />
              Converting…
            </>
          ) : (
            "Convert"
          )
        }
      >
        <FormSection title="Files" columns={1}>
          <FileDropZone
            label="1. MT5 symbols export"
            description="JSON file exported from MT5 (UTF-16)"
            accept=".json"
            icon={FileJson}
            file={jsonFile}
            onFile={setJsonFile}
          />
          <FileDropZone
            label="2. Swap sheet"
            description="Excel file with Symbol, Long Value and Short Value columns"
            accept=".xlsx"
            icon={FileSpreadsheet}
            file={excelFile}
            onFile={setExcelFile}
          />
        </FormSection>
      </FormCard>

      <ResultCard
        empty={
          loading ? (
            <>
              <Loader2 className="size-6 animate-spin" />
              Converting your files…
            </>
          ) : (
            <>
              <ArrowLeftRight className="size-6" />
              Select both files and press Convert.
            </>
          )
        }
      >
        {success && downloadId && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-medium">{success}</p>
                <p className="text-sm opacity-80">
                  The file is kept for 1 hour.
                </p>
              </div>
            </div>

            <DownloadButton downloadId={downloadId} jsonFile={jsonFile} />

            {symbols.length > 0 ? (
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="size-4" />
                  {symbols.length}{" "}
                  {symbols.length === 1 ? "symbol was" : "symbols were"} not in
                  the swap sheet
                </p>
                <div className="flex max-h-64 flex-wrap gap-1.5 overflow-y-auto rounded-lg bg-muted/50 p-3">
                  {symbols.map((symbol) => (
                    <span
                      key={symbol}
                      className="rounded-md bg-background px-2 py-0.5 font-mono text-xs"
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Every symbol was found in the swap sheet.
              </p>
            )}
          </div>
        )}
      </ResultCard>
    </CalculatorPage>
  );
};

export default Converter;

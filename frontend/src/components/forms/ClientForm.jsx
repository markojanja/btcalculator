import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField, FormSection, SelectInput } from "../CalculatorUI";
import { ChipSelect, FormActions, FormPage, PageLoading } from "../PageUI";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Must match the enums in backend/prisma/schema.prisma
const STATUSES = ["ONBOARDING", "ACTIVE", "SUSPENDED", "INACTIVE"];
const SERVERS = ["live1", "live2", "live5", "live7"];
const PLATFORMS = ["MT4", "MT5", "MT4SA", "MT5SA", "MTT", "cTrader", "ARK"];

const capitalize = (s) => s.charAt(0) + s.slice(1).toLowerCase();

/** Create a client (/clients/new) or edit one (/clients/:id/edit). */
const ClientForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [server, setServer] = useState("live1");
  const [platform, setPlatform] = useState([]);

  useEffect(() => {
    if (!isEdit) return;
    const getClient = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/clients/${id}/edit`, {
          withCredentials: true,
        });
        setName(data.name);
        setStatus(data.status);
        // Stored as an array; the form edits a single server
        setServer(data.server?.[0] ?? "live1");
        setPlatform(data.platform ?? []);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      } finally {
        setLoading(false);
      }
    };
    getClient();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { name: name.trim(), status, server, platform };
    try {
      setSubmitting(true);
      if (isEdit) {
        await axios.put(`${BACKEND_URL}/clients/${id}/edit`, body, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${BACKEND_URL}/clients/new`, body, {
          withCredentials: true,
        });
      }
      navigate("/clients");
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoading />;

  return (
    <FormPage
      backTo="/clients"
      backLabel="Back to clients"
      icon={Building2}
      title={isEdit ? `Edit ${name}` : "New client"}
      description={
        isEdit
          ? "Update the client's status, server and platforms."
          : "Add a broker to the client list."
      }
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <FormSection title="Client">
          <FormField label="Name" className="sm:col-span-2">
            {(fieldId) => (
              <Input
                id={fieldId}
                className="h-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Markets Ltd"
              />
            )}
          </FormField>
          <FormField label="Status">
            {(fieldId) => (
              <SelectInput
                id={fieldId}
                value={status}
                onChange={setStatus}
                options={STATUSES}
                format={capitalize}
              />
            )}
          </FormField>
          <FormField label="Server">
            {(fieldId) => (
              <SelectInput
                id={fieldId}
                value={server}
                onChange={setServer}
                options={SERVERS}
              />
            )}
          </FormField>
        </FormSection>

        <FormSection title="Platforms" columns={1}>
          <FormField label="Platforms they use" hint="Select all that apply.">
            <ChipSelect options={PLATFORMS} value={platform} onChange={setPlatform} />
          </FormField>
        </FormSection>

        <FormActions
          cancelTo="/clients"
          submitLabel={isEdit ? "Save changes" : "Create client"}
          submitting={submitting}
          disabled={!name.trim()}
        />
      </form>
    </FormPage>
  );
};

export default ClientForm;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import SelectReact from "react-select";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditClient = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [server, setServer] = useState("");
  const [platform, setPlatform] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const STATUS = ["ONBOARDING", "ACTIVE", "SUSPENDED", "INACTIVE"];
  const SERVERS = ["live1", "live2", "live5", "live7"];
  const PLATFORMS = ["MT4", "MT5", "MT4SA", "MT5SA", "MTT", "cTrader", "ARK"];

  const platformOptions = PLATFORMS.map((p) => ({
    value: p,
    label: p,
  }));

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
      backgroundColor: "var(--secondary)",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "var(--secondary)",
      marginTop: 0,
      borderRadius: 0,
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "var(--secondary)",
      boxShadow: "none",
      borderColor: "var(--text-color)",
      minHeight: "40px",
      "&:hover": {
        borderColor: "var(--accent-color)",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "var(--primary)",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: "var(--secondary)",
      color: "var(--primary)",
      "&:hover": {
        backgroundColor: "var(--primary)",
        color: "#fff",
      },
    }),
  };

  const { id } = useParams();

  useEffect(() => {
    const getClient = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/clients/${id}/edit`, {
          withCredentials: true,
        });
        console.log(res.data);
        setName(res.data.name);
        setStatus(res.data.status);
        setServer(res.data.server);
        setPlatform(res.data.platform);
      } catch (error) {
        console.log(error);
      }
    };

    getClient();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedClient = {
      name,
      status,
      server,
      platform: platform,
    };
    console.log(updatedClient);
    try {
      await axios.put(`${BACKEND_URL}/clients/${id}/edit`, updatedClient, {
        withCredentials: true,
      });
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-full p-2">
      <Card className="w-full lg:w-187.5 mx-auto">
        <CardTitle className="px-6">
          <h3 className="text-left font-bold">Edit Client</h3>
        </CardTitle>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>

              <Field>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label>Server</Label>
                <Select value={server} onValueChange={setServer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select server" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVERS.map((srv) => (
                      <SelectItem key={srv} value={srv}>
                        {srv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label>Platforms</Label>
                <SelectReact
                  isMulti
                  options={platformOptions}
                  value={platform.map((p) => ({ value: p, label: p }))}
                  onChange={(selected) =>
                    setPlatform(selected.map((s) => s.value))
                  }
                  styles={customStyles}
                />
              </Field>
            </FieldGroup>

            <Button type="submit">Save</Button>

            <Link className="flex self-end mr-4 items-center" to="/clients">
              <IoMdArrowRoundBack /> Back to clients
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditClient;

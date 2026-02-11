import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddUser = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [activeUser, setActiveUser] = useState(true);
  const [centroid, setCentroid] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const matchPwd = password === repeatPassword && repeatPassword.length > 3;

  useEffect(() => {
    if (firstname || lastname) {
      setUsername(`${firstname.toLowerCase()}.${lastname.toLowerCase()}`);
    } else {
      setUsername("");
    }
  }, [firstname, lastname]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      firstname,
      lastname,
      username,
      email,
      password,
      repeatPassword,
      role,
      active: activeUser,
      centroid,
    };

    try {
      await axios.post(`${BACKEND_URL}/users/new`, newUser, {
        withCredentials: true,
      });

      setErrorPopup("");
      navigate("/users");
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorPopup(err.response.data.message);
      } else {
        setErrorPopup("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Card className="w-187.5 mx-auto">
        <CardTitle className="px-6">
          <h3 className="text-left font-bold">New User</h3>
        </CardTitle>

        <CardContent>
          {errorPopup && (
            <p className="text-sm text-red-500 mb-4">{errorPopup}</p>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <Label>Firstname</Label>
                <Input
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </Field>

              <Field>
                <Label>Lastname</Label>
                <Input
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </Field>

              <Field>
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>

              <Field>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              <Field>
                <Label>Repeat Password</Label>
                <Input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                {!matchPwd && repeatPassword.length > 3 && (
                  <p className="text-sm text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
              </Field>

              <Field>
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="SUPPORT">Support</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field orientation="horizontal">
                <Checkbox
                  checked={activeUser}
                  onCheckedChange={(checked) => setActiveUser(!!checked)}
                />
                <Label>Active</Label>
              </Field>

              <Field orientation="horizontal">
                <Checkbox
                  checked={centroid}
                  onCheckedChange={(checked) => setCentroid(!!checked)}
                />
                <Label>Centroid</Label>
              </Field>

              <Button className="w-full" type="submit" disabled={!matchPwd}>
                Create
              </Button>
            </FieldGroup>

            <Link className="flex self-end mr-4 items-center" to={"/users"}>
              <IoMdArrowRoundBack /> Back to users
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUser;

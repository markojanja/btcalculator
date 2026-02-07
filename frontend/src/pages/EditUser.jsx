import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const EditUser = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [activeUser, setActiveUser] = useState(false);
  const [centroid, setCentroid] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users/${id}/edit`, {
          withCredentials: true,
        });

        const user = response.data;
        console.log(user);
        setFirstname(user.firstname);
        setLastname(user.lastname);
        setUsername(user.username);
        setEmail(user.email);
        setRole(user.role);
        setActiveUser(user.active);
        setCentroid(user.centroid);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editedUser = {
      firstname,
      lastname,
      username,
      email,
      role,
      active: activeUser,
      centroid,
    };

    try {
      const res = await axios.put(
        `${BACKEND_URL}/users/${id}/edit`,
        { ...editedUser },
        { withCredentials: true },
      );
      console.log(res.data);

      navigate("/users");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        console.log(err.response.data.message);
      } else {
        console.log("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Card className="w-187.5 mx-auto">
        <CardTitle className="px-6">
          <h3 className="text-left font-bold">Edit User</h3>
        </CardTitle>
        <CardContent>
          <form
            action="post"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <FieldGroup>
              <Field>
                <Label>Firstname</Label>
                <Input
                  type="text"
                  value={firstname}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                />
              </Field>

              <Field>
                <Label>Lastname</Label>
                <Input
                  type="text"
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                />
              </Field>

              <Field>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </Field>

              <Field>
                <Label>Email</Label>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
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
              <Button className="w-full" type="submit">
                Edit
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

export default EditUser;

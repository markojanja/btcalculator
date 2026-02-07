import useAuth from "../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { GrStatusGoodSmall } from "react-icons/gr";
import PasswordModal from "../components/PasswordModal";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user } = useAuth();
  const [modal, setModal] = useState(false);

  const role = user.role;

  const handleToggleModal = () => {
    setModal(!modal);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className={"w-[60%] mx-auto flex"}>
        <CardContent
          className={"flex flex-row items-center justify-center p-6 gap-4"}
        >
          <div className="flex items-center justify-center w-[30%]">
            <FaUserCircle className="w-60 h-60 p-6 shrink-0" />
          </div>
          <FieldGroup className={"w-[60%] text-left"}>
            <Field>
              <h3 className="font-bold text-2xl">
                {user?.firstname} {user?.lastname}
              </h3>
            </Field>
            <Field>
              <div className="flex flex-row items-center gap-2">
                <MdOutlineEmail />
                <h3>{user?.email}</h3>
              </div>
            </Field>

            <Field className={"flex flex-row text-left"}>
              <div className="flex flex-row items-center gap-2">
                <FaUserCircle />
                <h3>{user?.username}</h3>
              </div>
            </Field>
            <Field className={"flex flex-row text-left"}>
              <div className="flex flex-row items-center gap-2">
                <IoBriefcase />
                <h3>
                  {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                </h3>
              </div>
            </Field>
            <Field className={"flex flex-row text-left"}>
              <div className="flex flex-row items-center gap-2">
                {user?.active ? (
                  <GrStatusGoodSmall className="text-lime-400" />
                ) : (
                  <GrStatusGoodSmall className="text-red-400" />
                )}

                <h3>{user?.active === true ? "Active" : "Inactive"}</h3>
              </div>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card className={"w-[60%] mx-auto"}>
        <CardContent
          className={"flex flex-row items-center justify-between gap-2"}
        >
          <h3>Change password</h3>
          <Button onClick={handleToggleModal}>Change Password</Button>
        </CardContent>
      </Card>
      {modal && <PasswordModal handleToggleModal={handleToggleModal} />}
    </div>
  );
};

export default Profile;

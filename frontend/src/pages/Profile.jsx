import useAuth from "../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { GrStatusGoodSmall } from "react-icons/gr";
import PasswordModal from "../components/PasswordModal";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import axios from "axios";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
  const { user } = useAuth();
  const [modal, setModal] = useState(false);
  const [stats, setStats] = useState([]);

  const role = user.role;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/stats/users/${user.id}`,
          { withCredentials: true },
        );
        console.log("data", response.data);
        setStats(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getStats();
  }, []);

  const handleToggleModal = () => {
    setModal(!modal);
  };

  const chartData = {
    labels: ["Completed", "CS Ticket", "IT Ticket"],
    datasets: [
      {
        data: [
          stats?.completed || 0,
          stats?.csTicket || 0,
          stats?.itTicket || 0,
        ],
        backgroundColor: ["#22C55E", "#F97316", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <Card className={"w-full lg:w-[60%] mx-auto flex"}>
        <CardContent
          className={"flex flex-row items-center justify-center p-6 gap-4"}
        >
          <div className="flex items-center justify-center w-[50%] lg:w-[30%] p-2">
            <FaUserCircle className="w-30 h-30 p-3 lg:w-60 lg:h-60 lg:p-6 shrink-0" />
          </div>
          <FieldGroup className={"w-full text-left"}>
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
        <CardContent className={"flex flex-row items-center justify-end gap-2"}>
          <Button onClick={handleToggleModal}>Change Password</Button>
        </CardContent>
      </Card>
      {modal && <PasswordModal handleToggleModal={handleToggleModal} />}
      {user.role === "SUPPORT" && (
        <Card className="w-full lg:w-[60%] mx-auto">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-6 text-left">
              Task Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <Doughnut data={chartData} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-xl border p-4 bg-background">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{stats.totalTasks}</p>
                </div>
                <div className="rounded-xl border p-4 bg-background">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{stats.completed}</p>
                </div>

                <div className="rounded-xl border p-4 bg-background">
                  <p className="text-sm text-muted-foreground">CS Tickets</p>
                  <p className="text-xl font-bold">{stats.csTicket}</p>
                </div>

                <div className="rounded-xl border p-4 bg-background">
                  <p className="text-sm text-muted-foreground">IT Tickets</p>
                  <p className="text-xl font-bold">{stats.itTicket}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;

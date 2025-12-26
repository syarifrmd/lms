import { useApp } from "@/context/AppContext";
import { AdminDashboard } from "../../components/admin/AdminDashboard";
import { TrainerDashboard } from "../../components/trainer/TrainerDashboard";
import { DSEDashboard } from "../../components/dse/DSEDashboard";

export default function Dashboard() {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'trainer':
      return <TrainerDashboard />;
    case 'dse':
    default:
      return <DSEDashboard />;
  }
}

import { Redirect } from "expo-router";
import { useApp } from "@/context/AppContext";
import { LandingPage } from "../components/LandingPage";

export default function Index() {
  const { currentUser, showLanding, setShowLanding } = useApp();

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!currentUser) {
    return <Redirect href={"/login" as any} />;
  }

  return <Redirect href={"/dashboard" as any} />;
}

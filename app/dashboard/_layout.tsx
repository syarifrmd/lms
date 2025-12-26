import { Slot } from "expo-router";
import { Sidebar } from "../../components/Sidebar";
import { View } from "react-native";
import { useState } from "react";

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </View>
  );
}

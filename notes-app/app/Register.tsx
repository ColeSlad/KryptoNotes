import React from "react";
import { SafeAreaView, Text } from "react-native";

const colors = {
  background: "#0D1117",
  primary: "#1F6FEB",
  text: "#C9D1D9",
};

export default function RegisterScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text }}>Register</Text>
      {/* TODO: Add stuff here */}
    </SafeAreaView>
  );
}

import React from "react";
import { SafeAreaView, View, Text, StatusBar } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";

const colors = {
  background: "#0D1117",
  primary: "#1F6FEB",
  secondary: "#58A6FF",
  text: "#C9D1D9",
};

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />
      <Navbar onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
        <View
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            borderWidth: 3,
            borderColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <Ionicons name="lock-closed" size={64} color={colors.primary} />
        </View>
        <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text, textAlign: "center" }}>
          Fortress for Your Private Notes
        </Text>
        <Text style={{ fontSize: 16, marginTop: 12, textAlign: "center", color: colors.secondary }}>
          End-to-end encrypted. Yours only. KryptoNotes shields your ideas behind a digital vault.
        </Text>
      </View>
    </SafeAreaView>
  );
}

import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link, Href } from "expo-router";

const colors = { background: "#0D1117", primary: "#1F6FEB", text: "#C9D1D9" };

export default function Navbar({ onMenuPress }: { onMenuPress: () => void }) {
  const router = useRouter();

  return (
    <View
      style={{
        height: 60,
        backgroundColor: colors.background,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
      }}
    >
      {/* Hamburger menu */}
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu" size={28} color={colors.primary} />
      </TouchableOpacity>

      <Link href={"/Login" as Href} asChild>
        <TouchableOpacity
            style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 8,
            }}
        >
            <Text style={{ color: colors.text, fontWeight: "600" }}>
            Login / Register
            </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

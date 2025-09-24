// App.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Color system (Ironveil palette)
const colors = {
  background: "#0D1117",
  primary: "#1F6FEB",
  secondary: "#58A6FF",
  text: "#C9D1D9",
  success: "#238636",
  error: "#F85149",
};

// Typography scale
const typography = {
  heading: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
    color: colors.text,
  },
};

// Main App
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];

  const toggleMenu = () => {
    const toValue = menuOpen ? -250 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setMenuOpen(!menuOpen);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      {/* Navbar */}
      <View
        style={{
          height: 60,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#161B22",
        }}
      >
        <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 20 }}>
          KryptoNotes
        </Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
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
        <Text style={[typography.heading, { textAlign: "center" }]}>
          Fortress for Your Private Notes
        </Text>
        <Text
          style={[
            typography.body,
            { textAlign: "center", marginTop: 12, color: colors.secondary },
          ]}
        >
          End-to-end encrypted. Yours only. KryptoNotes shields your ideas behind a
          digital vault.
        </Text>
      </View>

      {/* Drawer Menu */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: slideAnim,
          width: 250,
          backgroundColor: "#161B22",
          paddingTop: 80,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
        }}
      >
        <Text
          style={{ color: colors.text, fontSize: 20, fontWeight: "600", marginBottom: 30 }}
        >
          Menu
        </Text>
        <TouchableOpacity style={{ marginBottom: 20 }}>
          <Text style={[typography.body, { color: colors.primary }]}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[typography.body, { color: colors.primary }]}>
            Register
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

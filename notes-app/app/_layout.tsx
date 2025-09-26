import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "react-native-get-random-values";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#04041dff",
          },
          drawerLabelStyle: {
            color: "#F5F7FA", 
            fontSize: 16,
            fontWeight: "500",
          },
          drawerActiveTintColor: "#4DA8DA", 
          drawerInactiveTintColor: "#6B7A8F",
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        {user && (
          <>
            <Drawer.Screen
            name="notes"
            options={{
              drawerLabel: "Notes",
            }}
            />
            <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: "Settings",
            }}
        />
          </>
          
        )}
        <Drawer.Screen
          name="login"
          options={{
            drawerLabel: "Login",
          }}
        />
         <Drawer.Screen
          name="register"
          options={{
            drawerLabel: "Register",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
  },
});

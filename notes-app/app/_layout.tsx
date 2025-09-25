import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export default function Layout() {
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

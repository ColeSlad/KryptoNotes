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
      console.log("Auth state changed. User:", firebaseUser ? firebaseUser.email : "None");
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
        <Drawer.Screen
          name="(public)"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(protected)"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="Note"
          options={{ drawerItemStyle: { display: "none" } }}
        />

        {/* I know the following code sucks, but I've tried to use fragments to bring everything 
        together but it won't work so I got fed up and this is what I'm working with. I'll fix it later*/}
        {user ? 
        (
            <Drawer.Screen
              name="public/Login"
              options={{ title: "Login", drawerItemStyle: { display: "none"} }}
            />
          
        ) : 
        (
            <Drawer.Screen
              name="public/Login"
              options={{ title: "Login"}}
            />
        )
        }
        {user ? 
        (
            <Drawer.Screen
              name="public/Register"
              options={{ title: "Register", drawerItemStyle: { display: "none"} }}
            />
          
        ) : 
        (
            <Drawer.Screen
              name="public/Register"
              options={{ title: "Register"}}
            />
        )
        }
        {user ? 
        (
            <Drawer.Screen
              name="protected/Notes"
              options={{ title: "Notes"}}
            />
          
        ) : 
        (
            <Drawer.Screen
              name="protected/Notes"
              options={{ title: "Notes", drawerItemStyle: { display: "none"} }}
            />
        )
        }
        {user ? 
        (
            <Drawer.Screen
              name="protected/Settings"
              options={{ title: "Settings"}}
            />
          
        ) : 
        (
            <Drawer.Screen
              name="protected/Settings"
              options={{ title: "Settings", drawerItemStyle: { display: "none"} }}
            />
        )
        }
        
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

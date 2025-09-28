import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { signOut, deleteUser, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";
import { useNavigation, useRouter } from "expo-router";
import Navbar from "@/components/Navbar";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      alert("Logged out successfully.");
      console.log("✅ User signed out");
    } catch (error) {
      console.error("❌ Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      Alert.alert("Error", "Weird, no user is currently signed in.");
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(user);
              console.log("🗑️ User account deleted");
              router.push("/");
              Alert.alert("Account Deleted", "Your account has been removed.");
            } catch (error: any) {
              console.error("❌ Error deleting account:", error);
              if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                  "Re-authentication Required",
                  "Please log in again before deleting your account."
                );
              } else {
                Alert.alert("Error", "Could not delete account.");
              }
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#1E293B", flex: 1 }}>
      <Navbar onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {user ? (
        <>
          <Button title="Logout" onPress={handleLogout} />
          <View style={{ height: 12 }} />
          <Button
            title="Delete Account"
            color="red"
            onPress={handleDeleteAccount}
          />
        </>
      ) : (
        <Text style={{ marginTop: 20 }}>No user signed in</Text>
      )}
    </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Href, Link, useNavigation } from "expo-router";
import Navbar from "../components/Navbar";
import { DrawerActions } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogin = () => {
    // TODO: Hook up authentication logic here
    console.log("Logging in with:", email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />

      <KeyboardAwareScrollView 
          contentContainerStyle={[styles.scrollContent]}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={50}
          extraHeight={150}
          keyboardShouldPersistTaps="never">
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your KryptoNotes account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={{ color: "#F5F7FA" }}>Don’t have an account?</Text>
          <Link href={"/Register" as Href} asChild>
            <TouchableOpacity>
              <Text style={styles.registerText}> Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117", 
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    alignSelf: "center",
    width: "100%",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F5F7FA",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7A8F", 
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2E2E33",
    color: "#F5F7FA",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1F6FEB",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: "#F5F7FA",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#1a60c9ff",
    fontWeight: "600",
  },
});

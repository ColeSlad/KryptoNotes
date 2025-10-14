import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Href, Link, useNavigation, useRouter } from "expo-router";
import Navbar from "../components/Navbar";
import { DrawerActions } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

import { register } from "@/auth/register";

export default function Register() {
  global.Buffer = require('buffer').Buffer;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();
  const router = useRouter();

  const handleRegister = async (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert("Email and password are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }
    if (password.length < 8 || password.length > 64) {
      Alert.alert("Password must be between 8 and 64 characters.");
      return;
    }

    try {
        await register(email, password);
        alert("Account created! Please log in.");
        router.replace("/Login");
    }
    catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Email already in use. Please login or use a different email.");
        } else {
          Alert.alert("Registration error: " + error.message);
        }
        return;
    }
  };

  /*
  function generateSalt(length = 16): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Buffer.from(array).toString("hex"); 
  }
  */  

  const passwordsMatch = password && confirmPassword && password === confirmPassword;


  const checkPasswordStrength = (pass : string) => {
    let passwordStrength = 0;
    if(pass.length >= 8) {
      passwordStrength++;
    }
    if(/[A-Z]/.test(pass)) {
      passwordStrength++;
    }
    if(/[0-9]/.test(pass)) {
      passwordStrength++;
    }
    if(/[a-z]+/.test(pass)) {
      passwordStrength++;
    }
    if(/[$@#&!]+/.test(pass)) {
      passwordStrength++;
    }
    return passwordStrength;
  }

  const strength = checkPasswordStrength(password);

  return (
    <SafeAreaView style={styles.container}>
      {/*<Navbar onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} /> */}
      <KeyboardAwareScrollView
          contentContainerStyle={[styles.scrollContent]}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={50}
          extraHeight={150}
          keyboardShouldPersistTaps="never"
        >
            <Text style={styles.title}>Welcome to KryptoNotes!</Text>
            <Text style={styles.subtitle}>Create your secure account</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8B949E"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8B949E"
                />
              </TouchableOpacity>
            </View>
            {password.length > 0 && (
              <Text style={strength >= 5 ? styles.matchText : strength >= 3 ? styles.mediumText : styles.mismatchText}>
                Password Strength: {strength >= 5 ? "Strong 💪" : strength >= 3 ? "Weak 🙅‍♀️" : "Very Weak 👎"}
              </Text>
            )}
            {confirmPassword.length > 0 && (
              <Text style={passwordsMatch ? styles.matchText : styles.mismatchText}>
                {passwordsMatch ? "Passwords match ✅" : "Passwords do not match ❌"}
              </Text>
            )}

            <TouchableOpacity style={styles.button} onPress={() => handleRegister(email, password)}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={{ color: "#F5F7FA" }}>Have an account?</Text>
              <Link href={"/Login" as Href} asChild>
                <TouchableOpacity>
                  <Text style={styles.registerText}> Login</Text>
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
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    backgroundColor: "#2E2E33",
    color: "#F5F7FA",
    padding: 14,
    paddingRight: 48,
    borderRadius: 10,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{ translateY: -14 }],
    padding: 4,
  },
  matchText: {
    color: "#22c55e",
    marginBottom: 16,
    textAlign: "left",
  },
  mismatchText: {
    color: "#ef4444",
    marginBottom: 16,
    textAlign: "left",
  },
  mediumText: {
    color: "#c5aa22ff",
    marginBottom: 16,
    textAlign: "left",
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

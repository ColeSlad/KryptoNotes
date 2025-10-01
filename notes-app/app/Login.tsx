import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import { Href, Link, useRouter } from "expo-router";
import Navbar from "../components/Navbar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/utils/authContext";
import { Ionicons } from "@expo/vector-icons";
import { biometricAuth } from "@/utils/biometricAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');

  const router = useRouter();
  const { signIn, isAuthenticated } = useAuth();

  useEffect(() => {
    checkBiometricAvailability();
    loadSavedCredentials();
    checkForBiometricLogin();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(auth)/Home');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }
    try {
      await signIn(email, password, rememberMe);
      if (biometricAvailable) {
        Alert.alert(
          `Enable ${biometricType}?`,
          `Would you like to use ${biometricType} for faster login next time?`,
          [
            {
              text: 'Not Now',
              style: 'cancel',
              onPress: () => {
                router.replace('/(auth)/Home');
              },
            },
            {
              text: 'Enable',
              onPress: async () => {
                await biometricAuth.setBiometricLogin(true);
                await biometricAuth.storeCredentials(email, password);
                router.replace('/(auth)/Home');
              },
            },
          ]
        );
      } else {
        router.replace('/(auth)/Home');
      }
      alert("Login successful!");
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email. Please register first.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email.";
      }else if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        errorMessage =  "Incorrect password. Please try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert('Login Failed', errorMessage);
    };
  }

  const handleBiometricLogin = async () => {
    const result = await biometricAuth.authenticate('Access your account with ' + biometricType);
    
    if (result.success) {
      const credentials = await biometricAuth.getStoredCredentials();
      
      if (credentials) {
        
        try {
          await signIn(credentials.email, credentials.password, true);
          router.replace('/(auth)/Home');
        } catch (error) {
          Alert.alert('Login Failed', 'Stored credentials are invalid. Please login manually.');
          await biometricAuth.clearBiometricData();
        }
      }
    } else if (result.error) {
      console.log('Biometric authentication failed:', result.error);
    }
  };

  const checkBiometricAvailability = async () => {
    const available = await biometricAuth.isAvailable();
    setBiometricAvailable(available);
    
    if (available) {
      const type = await biometricAuth.getBiometricType();
      setBiometricType(type);
    }
  };

  const checkForBiometricLogin = async () => {
    const biometricEnabled = await biometricAuth.isBiometricLoginEnabled();
    const hasStoredCredentials = await biometricAuth.getStoredCredentials();
    
    if (biometricEnabled && hasStoredCredentials && biometricAvailable) {
      // Auto-prompt for biometric login
      setTimeout(() => {
        handleBiometricLogin();
      }, 500);
    }
  };

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('userEmail');
      const savedRememberMe = await AsyncStorage.getItem('rememberMe');
      
      if (savedEmail && savedRememberMe === 'true') {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*<Navbar onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />*/}

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
          autoComplete="email"
        />
        <View style={styles.passwordContainer}>
          <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="password"
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
        
        <View style={styles.rememberContainer}>
          <Text style={styles.rememberText}>Remember me</Text>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: "30363D", true: "#1F6FEB" }}
            thumbColor={rememberMe ? "#58A6FF" : "#8B949E"}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {biometricAvailable && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
              activeOpacity={0.8}
            >
              <Ionicons
                name={biometricType === 'Face ID' ? 'scan' : 'finger-print'}
                size={24}
                color="#1F6FEB"
              />
            </TouchableOpacity>
          )}
        </View>

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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: "#1F6FEB",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: "#F5F7FA",
    fontSize: 18,
    fontWeight: "600",
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
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  rememberText: {
    color: "#C9D1D9",
    fontSize: 14,
  },
  biometricButton: {
    backgroundColor: `#1F6FEB15`,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "#1F6FEB",
  },
})

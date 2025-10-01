import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../utils/authContext';
import { biometricAuth } from '../../utils/biometricAuth';
import { useRouter } from 'expo-router';
import { deleteUser } from 'firebase/auth';

const colors = {
  background: '#0D1117',
  cardBg: '#161B22',
  accent: '#1F6FEB',
  secondaryAccent: '#58A6FF',
  success: '#238636',
  error: '#F85149',
  text: '#C9D1D9',
  textDim: '#8B949E',
  border: '#30363D',
};

export default function Settings() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkBiometricSettings();
  }, []);

  const checkBiometricSettings = async () => {
    const available = await biometricAuth.isAvailable();
    setBiometricAvailable(available);
    
    if (available) {
      const type = await biometricAuth.getBiometricType();
      setBiometricType(type);
      
      const enabled = await biometricAuth.isBiometricLoginEnabled();
      setBiometricEnabled(enabled);
    }
  };

  const toggleBiometric = async (value: boolean) => {
    if (value) {
      const result = await biometricAuth.authenticate(`Enable ${biometricType} for login`);
      
      if (result.success) {
        Alert.alert(
          'Store Credentials',
          'Your login credentials will be securely stored on this device for biometric login.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Enable',
              onPress: async () => {
                await biometricAuth.setBiometricLogin(true);
                setBiometricEnabled(true);
                Alert.alert('Success', `${biometricType} login enabled`);
              },
            },
          ]
        );
      }
    } else {
      Alert.alert(
        'Disable Biometric Login',
        'This will remove stored credentials from this device.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await biometricAuth.clearBiometricData();
              setBiometricEnabled(false);
              Alert.alert('Success', 'Biometric login disabled');
            },
          },
        ]
      );
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/');
          },
        },
      ]
    );
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SETTINGS</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle" size={48} color={colors.accent} />
            <View style={styles.userDetails}>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userStatus}>Authenticated</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SECURITY</Text>
        
        {biometricAvailable && (
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons 
                  name={biometricType === 'Face ID' ? 'scan' : 'finger-print'} 
                  size={24} 
                  color={colors.accent} 
                />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{biometricType} Login</Text>
                  <Text style={styles.settingDescription}>
                    Use {biometricType} to access your vault
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={toggleBiometric}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={biometricEnabled ? colors.secondaryAccent : colors.textDim}
              />
            </View>
          </View>
        )}

        <View style={styles.card}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="key" size={24} color={colors.accent} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Change Password</Text>
                <Text style={styles.settingDescription}>Update your vault password</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark" size={24} color={colors.accent} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>Add extra security layer</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DANGER ZONE</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={styles.dangerButtonText}>SIGN OUT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.5,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDim,
    letterSpacing: 1,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 16,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textDim,
  },
  dangerButton: {
    flexDirection: 'row',
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 12,
  },
});

import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: string;
}

class BiometricAuthService {
  // check biometric is available
  async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  async getBiometricType(): Promise<string> {
    try {
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'Face ID';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return 'Touch ID';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return 'Iris';
      }
      
      return 'Biometric';
    } catch (error) {
      console.error('Error getting biometric type:', error);
      return 'Biometric';
    }
  }

  async authenticate(reason?: string): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isAvailable();
      
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device',
        };
      }

      const biometricType = await this.getBiometricType();
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason || `Authenticate with ${biometricType}`,
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return {
          success: true,
          biometricType,
        };
      } else { // stupid discriminated union typing from expo
        return {
          success: false,
          error: (result as any).error || 'Authentication failed',
          biometricType,
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }

  async isBiometricLoginEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric setting:', error);
      return false;
    }
  }

  async setBiometricLogin(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem('biometricEnabled', enabled ? 'true' : 'false');
    } catch (error) {
      console.error('Error setting biometric preference:', error);
      throw error;
    }
  }

  async storeCredentials(email: string, password: string): Promise<void> {
    try {
      const credentials = JSON.stringify({ email, password }); // I should probably add more security here (encryption)
      await AsyncStorage.setItem('biometricCredentials', credentials);
    } catch (error) {
      console.error('Error storing credentials:', error);
      throw error;
    }
  }

  async getStoredCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const credentials = await AsyncStorage.getItem('biometricCredentials');
      if (credentials) {
        return JSON.parse(credentials);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  }

  async clearBiometricData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['biometricEnabled', 'biometricCredentials']);
    } catch (error) {
      console.error('Error clearing biometric data:', error);
    }
  }
}

export const biometricAuth = new BiometricAuthService();
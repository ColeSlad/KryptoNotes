import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../utils/auth';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  background: '#0D1117',
  cardBg: '#161B22',
  accent: '#1F6FEB',
  secondaryAccent: '#58A6FF',
  success: '#238636',
  text: '#C9D1D9',
  textDim: '#8B949E',
  border: '#30363D',
};

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleButtonPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.vaultIcon}>
            <Ionicons name="shield-checkmark" size={48} color={colors.accent} />
          </View>
          <Text style={styles.title}>KryptoNotes</Text>
          <Text style={styles.subtitle}>Military-grade encryption</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="lock-closed" size={20} color={colors.success} />
            <Text style={styles.statText}>256-BIT AES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="shield" size={20} color={colors.success} />
            <Text style={styles.statText}>ZERO-KNOWLEDGE</Text>
          </View>
        </View>
        
        {!user ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => handleButtonPress('/Login')}
              activeOpacity={0.8}
            >
              <Ionicons name="lock-open" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>ACCESS VAULT</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => handleButtonPress('/Register')}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add" size={20} color={colors.accent} />
              <Text style={styles.secondaryButtonText}>CREATE VAULT</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => handleButtonPress('/(auth)/notes')}
              activeOpacity={0.8}
            >
              <Ionicons name="document-lock" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>OPEN NOTES</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.securityBadges}>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.badgeText}>E2E ENCRYPTED</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="time" size={16} color={colors.success} />
            <Text style={styles.badgeText}>AUTO-LOCK</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  vaultIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textDim,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}10`,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 12,
  },
  securityBadges: {
    flexDirection: 'row',
    marginTop: 32,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${colors.success}15`,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
});
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';

const colors = {
  background: '#0D1117',
  cardBg: '#161B22',
  accent: '#1F6FEB',
  secondaryAccent: '#58A6FF',
  success: '#238636',
  error: '#F85149',
  warning: '#D29922',
  text: '#C9D1D9',
  textDim: '#8B949E',
  border: '#30363D',
};

const StatsCard: React.FC<{
  icon: string;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}> = ({ icon, label, value, color, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statsCard,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={[styles.statsIconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </Animated.View>
  );
};

const QuickAction: React.FC<{
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
  delay: number;
}> = ({ icon, label, onPress, color = colors.accent, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { scale: pressAnim }],
        opacity: fadeAnim,
      }}
    >
      <TouchableOpacity
        style={styles.quickAction}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon as any} size={28} color={color} />
        </View>
        <Text style={styles.quickActionLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ActivityItem: React.FC<{
  type: 'create' | 'edit' | 'delete' | 'login';
  title: string;
  time: string;
  delay: number;
}> = ({ type, title, time, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getActivityIcon = () => {
    switch (type) {
      case 'create':
        return { name: 'add-circle', color: colors.success };
      case 'edit':
        return { name: 'create', color: colors.accent };
      case 'delete':
        return { name: 'trash', color: colors.error };
      case 'login':
        return { name: 'log-in', color: colors.secondaryAccent };
      default:
        return { name: 'time', color: colors.textDim };
    }
  };

  const icon = getActivityIcon();

  return (
    <Animated.View
      style={[
        styles.activityItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.activityIcon, { backgroundColor: `${icon.color}15` }]}>
        <Ionicons name={icon.name as any} size={20} color={icon.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </Animated.View>
  );
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const welcomeScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(welcomeScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // TODO: Replace with actual note count fetching logic with firebase query
    setTimeout(() => setNoteCount(7), 500);

    return () => unsubscribe();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Add actual refresh logic 
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create':
        router.push('/(auth)/notes/Create');
        break;
      case 'notes':
        router.push('/(auth)/notes/index');
        break;
      case 'settings':
        router.push('/(auth)/Settings');
        break;
      case 'security':
        // TODO: Add security check route or something
        break;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getLastLogin = () => {
    const now = new Date();
    return `Last login: ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
    >
      <Animated.View
        style={[
          styles.welcomeSection,
          { transform: [{ scale: welcomeScale }] },
        ]}
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeGradientOverlay} />
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeHeader}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>
                  {user?.email?.split('@')[0] || 'User'}
                </Text>
              </View>
              <View style={styles.securityStatus}>
                <View style={styles.securityDot} />
                <Text style={styles.securityText}>SECURED</Text>
              </View>
            </View>
            <Text style={styles.lastLogin}>{getLastLogin()}</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>VAULT STATUS</Text>
        <View style={styles.statsGrid}>
          <StatsCard
            icon="document-lock"
            label="NOTES"
            value={noteCount}
            color={colors.accent}
            delay={100}
          />
          <StatsCard
            icon="shield-checkmark"
            label="ENCRYPTED"
            value="100%"
            color={colors.success}
            delay={150}
          />
          <StatsCard
            icon="time"
            label="AUTO-LOCK"
            value="5 MIN"
            color={colors.warning}
            delay={200}
          />
          <StatsCard
            icon="key"
            label="2FA"
            value="ON"
            color={colors.secondaryAccent}
            delay={250}
          />
        </View>
      </View>

      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            icon="add-circle"
            label="NEW NOTE"
            onPress={() => handleQuickAction('create')}
            color={colors.success}
            delay={300}
          />
          <QuickAction
            icon="folder-open"
            label="ALL NOTES"
            onPress={() => handleQuickAction('notes')}
            delay={350}
          />
          <QuickAction
            icon="shield"
            label="SECURITY"
            onPress={() => handleQuickAction('security')}
            color={colors.warning}
            delay={400}
          />
          <QuickAction
            icon="settings"
            label="SETTINGS"
            onPress={() => handleQuickAction('settings')}
            color={colors.textDim}
            delay={450}
          />
        </View>
      </View>

      <View style={styles.activitySection}>
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activityList}>
          <ActivityItem
            type="login"
            title="Successful login"
            time="Just now"
            delay={500}
          />
          <ActivityItem
            type="create"
            title="Created new note"
            time="2 hours ago"
            delay={550}
          />
          <ActivityItem
            type="edit"
            title="Modified secure note"
            time="5 hours ago"
            delay={600}
          />
          <ActivityItem
            type="delete"
            title="Deleted old note"
            time="Yesterday"
            delay={650}
          />
        </View>
      </View>

      <View style={styles.tipsSection}>
        <View style={styles.tipCard}>
          <Ionicons name="information-circle" size={20} color={colors.accent} />
          <Text style={styles.tipText}>
            Enable biometric authentication for additional security
          </Text>
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  welcomeSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  welcomeCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    overflow: 'hidden',
    position: 'relative',
  },
  welcomeGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.accent,
    opacity: 0.08,
  },
  welcomeContent: {
    padding: 24,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: colors.textDim,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  securityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  securityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  securityText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lastLogin: {
    fontSize: 12,
    color: colors.textDim,
    fontWeight: '400',
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    color: colors.textDim,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  quickActionLabel: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  activitySection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  activityList: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textDim,
    fontWeight: '400',
  },
  tipsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent}10`,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.accent}30`,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 18,
  },
});
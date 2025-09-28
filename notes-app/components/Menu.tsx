import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

// Design System Colors
const colors = {
  background: '#0D1117',
  accent: '#1F6FEB',
  secondaryAccent: '#58A6FF',
  success: '#238636',
  error: '#F85149',
  text: '#C9D1D9',
  textDim: '#8B949E',
  border: '#30363D',
  cardBg: '#161B22',
};

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Vault Ring Animation Component
const VaultRing: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isAnimating]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.vaultRing, { transform: [{ rotate: spin }] }]}>
      <View style={styles.vaultRingInner} />
      <View style={styles.vaultRingDot} />
      <View style={[styles.vaultRingDot, { top: 'auto', bottom: -3 }]} />
      <View style={[styles.vaultRingDot, { left: -3, top: '50%' }]} />
      <View style={[styles.vaultRingDot, { right: -3, left: 'auto', top: '50%' }]} />
    </Animated.View>
  );
};

export const HamburgerMenu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  
  // Initialize animations with stable values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      // First show the modal
      setIsModalVisible(true);
      // Then animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out first
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Then hide the modal after animation completes
        setIsModalVisible(false);
      });
    }
  }, [isOpen, slideAnim, fadeAnim]);

  // Calculate the actual translation value
  const screenWidth = Dimensions.get('window').width;
  const menuWidth = screenWidth * 0.8;
  
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-menuWidth, 0],
  });

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 250);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      setTimeout(() => {
        router.replace('/');
      }, 250);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Menu items when user is not logged in
  const guestMenuItems = [
    { 
      label: 'HOME', 
      route: '/', 
      icon: 'shield-outline',
      description: 'Welcome screen'
    },
    { 
      label: 'LOGIN', 
      route: '/Login', 
      icon: 'lock-closed-outline',
      description: 'Access your vault'
    },
    { 
      label: 'REGISTER', 
      route: '/Register', 
      icon: 'person-add-outline',
      description: 'Create secure account'
    },
  ];

  // Menu items when user is logged in
  const authenticatedMenuItems = [
    { 
      label: 'HOME', 
      route: '/(tabs)/Home', 
      icon: 'shield-outline',
      description: 'Dashboard'
    },
    { 
      label: 'NOTES', 
      route: '/(tabs)/notes', 
      icon: 'document-lock-outline',
      description: 'Encrypted notes'
    },
    { 
      label: 'SETTINGS', 
      route: '/(tabs)/Settings', 
      icon: 'settings-outline',
      description: 'Security settings'
    },
  ];

  const menuItems = user ? authenticatedMenuItems : guestMenuItems;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.overlayBackground, 
            { opacity: fadeAnim }
          ]}
        >
          <Pressable style={styles.overlayPressable} onPress={onClose} />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.menuContainer,
            { 
              transform: [{ translateX: translateX }]
            }
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.menuHeader}>
              <View style={styles.logoContainer}>
                <VaultRing isAnimating={isOpen} />
                <Ionicons name="lock-closed" size={20} color={colors.accent} />
              </View>
              <Text style={styles.menuTitle}>Krypto Notes</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={colors.textDim} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.userIconContainer}>
                <Ionicons 
                  name={user ? "shield-checkmark" : "shield-outline"} 
                  size={32} 
                  color={user ? colors.success : colors.textDim} 
                />
              </View>
              {user ? (
                <>
                  <Text style={styles.userStatus}>AUTHENTICATED</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.userStatus}>GUEST ACCESS</Text>
                  <Text style={styles.userEmail}>Limited permissions</Text>
                </>
              )}
            </View>
            
            <View style={styles.menuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleNavigation(item.route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemIcon}>
                    <Ionicons 
                      name={item.icon as any} 
                      size={24} 
                      color={colors.accent}
                    />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemText}>
                      {item.label}
                    </Text>
                    <Text style={styles.menuItemDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={colors.textDim}
                  />
                </TouchableOpacity>
              ))}
              
              {user && (
                <View style={styles.logoutContainer}>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name="lock-open-outline" 
                      size={24} 
                      color="#fff"
                    />
                    <Text style={styles.logoutButtonText}>
                      LOGOUT
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>END-TO-END ENCRYPTED</Text>
              <View style={styles.securityBadge}>
                <Ionicons name="shield-checkmark" size={12} color={colors.success} />
                <Text style={styles.securityBadgeText}>256-BIT</Text>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayPressable: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 320,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vaultRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaultRingInner: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: colors.secondaryAccent,
    borderRadius: 16,
    opacity: 0.5,
  },
  vaultRingDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: colors.accent,
    borderRadius: 3,
    top: -3,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.2,
  },
  closeButton: {
    padding: 8,
  },
  userInfo: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  userIconContainer: {
    marginBottom: 16,
  },
  userStatus: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textDim,
    fontWeight: '400',
  },
  menuItems: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: `${colors.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: colors.textDim,
    fontWeight: '400',
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 12,
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 10,
    color: colors.textDim,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: `${colors.success}20`,
    borderRadius: 4,
  },
  securityBadgeText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
});

export default HamburgerMenu;
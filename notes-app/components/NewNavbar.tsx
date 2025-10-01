import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HamburgerMenu from './Menu';

const colors = {
  background: '#0D1117',
  accent: '#1F6FEB',
  secondaryAccent: '#58A6FF',
  success: '#238636',
  error: '#F85149',
  text: '#C9D1D9',
  textDim: '#8B949E',
  border: '#30363D',
};

interface NavbarProps {
  title?: string;
}

const AnimatedLock: React.FC<{ isLocked: boolean }> = ({ isLocked }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLocked) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        rotateAnim.setValue(0);
      });
    }
  }, [isLocked]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-5deg', '0deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { rotate: rotation },
        ],
      }}
    >
      <Ionicons 
        name={isLocked ? "lock-closed" : "lock-open"} 
        size={20} 
        color={colors.accent} 
      />
    </Animated.View>
  );
};

export const NewNavbar: React.FC<NavbarProps> = ({ title = 'KryptoNotes' }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setIsLocked(!isLocked);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setIsLocked(true);
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View style={styles.navbar}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            onPress={toggleMenu} 
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.menuButton}
            activeOpacity={0.8}
          >
            <View style={styles.menuIconContainer}>
              <View style={styles.menuIconLines}>
                <View style={[styles.menuLine, menuOpen && styles.menuLineTop]} />
                <View style={[styles.menuLine, styles.menuLineMiddle, menuOpen && styles.menuLineMiddleHidden]} />
                <View style={[styles.menuLine, menuOpen && styles.menuLineBottom]} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.titleContainer}>
          <AnimatedLock isLocked={isLocked} />
          <Text style={styles.navbarTitle}>{title}</Text>
        </View>
        
        <View style={styles.navbarRight}>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
          </View>
        </View>
      </View>
      
      <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 110,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 58,
  },
  menuButton: {
    padding: 8,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconLines: {
    width: 24,
    height: 16,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: '100%',
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  menuLineMiddle: {
    width: '75%',
  },
  menuLineTop: {
    transform: [
      { rotate: '45deg' },
      { translateY: 7 },
    ],
  },
  menuLineMiddleHidden: {
    opacity: 0,
  },
  menuLineBottom: {
    transform: [
      { rotate: '-45deg' },
      { translateY: -7 },
    ],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.2,
    marginLeft: 12,
  },
  navbarRight: {
    width: 48,
    alignItems: 'flex-end',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.success}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
});

export default NewNavbar;
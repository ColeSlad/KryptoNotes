import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { AuthProvider } from '../utils/authContext';
import { useAppFonts } from '../utils/font';
import * as SplashScreen from 'expo-splash-screen';
import NewNavbar from '@/components/NewNavbar';

SplashScreen.preventAutoHideAsync();

const colors = {
  background: '#0D1117',
  accent: '#1F6FEB',
};

function RootLayoutNav() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <NewNavbar />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
            gestureEnabled: false,
            fullScreenGestureEnabled: false,
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Login" 
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Register" 
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false,
              gestureEnabled: false,
            }} 
          />
        </Stack>
      </View>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
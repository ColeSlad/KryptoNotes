import { Stack, Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../utils/authContext';

const colors = {
  background: '#0D1117',
  accent: '#1F6FEB',
};

export default function AuthenticatedLayout() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/Login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Home" />
      <Stack.Screen name="Settings" />
      <Stack.Screen name="notes" />
    </Stack>
  );
}
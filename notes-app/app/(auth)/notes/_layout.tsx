import { Stack } from 'expo-router';

const colors = {
  background: '#0D1117',
};

export default function NotesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen 
        name="Create" 
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
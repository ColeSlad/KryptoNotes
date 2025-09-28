// src/types/routes.ts
// Create a custom type for your app's specific routes
export type AppRoute = 
  | '/'
  | '/login' 
  | '/register'
  | '/(tabs)/home'
  | '/(tabs)/notes' 
  | '/(tabs)/settings'
  | '/(tabs)/notes/create'
  | `/Note` // If you have a Note screen
  | string; // Allow other routes

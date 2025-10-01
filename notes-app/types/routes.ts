export type AppRoute = 
  | '/'
  | '/login' 
  | '/register'
  | '/(tabs)/home'
  | '/(tabs)/notes' 
  | '/(tabs)/settings'
  | '/(tabs)/notes/create'
  | `/Note`
  | string; // Allow other routes

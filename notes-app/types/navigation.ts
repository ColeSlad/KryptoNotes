import { NavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Notes: undefined;
  Note: { noteId: string }; // parameters to Note screen
  Settings: undefined;
};

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

// const navigation = useNavigation<RootStackNavigationProp>();
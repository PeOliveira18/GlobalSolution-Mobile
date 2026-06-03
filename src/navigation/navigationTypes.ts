import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Home: undefined;
  Areas: undefined;
  Alerts: undefined;
  Reports: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList> | undefined;
  Settings: undefined;
  AreaDetail: {
    areaId: string;
    originTitle?: string;
  };
};

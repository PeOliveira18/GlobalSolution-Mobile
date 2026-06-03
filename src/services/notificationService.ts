import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AgricultureArea } from '../types/agricultureArea';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const currentPermission = await Notifications.getPermissionsAsync();

  if (currentPermission.granted) {
    return true;
  }

  const requestedPermission = await Notifications.requestPermissionsAsync();
  return requestedPermission.granted;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('saved-regions', {
    name: 'Regioes salvas',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 180],
    lightColor: '#1D7A46',
  });
}

export const notificationService = {
  async notifySavedRegion(area: AgricultureArea): Promise<void> {
    try {
      const hasPermission = await ensureNotificationPermission();

      if (!hasPermission) {
        return;
      }

      await ensureAndroidChannel();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Regiao salva',
          body: `${area.name} foi adicionada aos favoritos.`,
          data: {
            areaId: area.id,
            city: area.city,
            state: area.state,
          },
        },
        trigger: null,
      });
    } catch {
      return;
    }
  },
};

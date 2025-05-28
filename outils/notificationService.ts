import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { obtenirParametresApplication } from '@/bdd/bddParametresApplication';
import {ParametresApplication} from '@/types/typesBDD';
import { BddError } from '@/classes/BddError';

// Configurer la notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  /**
   * Initilizer la configuration des notifications
   * @returns {Promise<boolean>} - true si les notifications sont activées, false sinon
   * @throws {Error} - Si une erreur se produit lors de la demande de permission
   */
  static async initialize() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Requete la permission de notification
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Envoie une notification si les notifications sont activées dans les paramètres de l'application
   */
  static async sendNotificationIfEnabled(title: string, body: string, data?: object) {
    try {
      // Obtenir les paramètres de l'application
      const ParametresApplication = await obtenirParametresApplication();
      
      // Vérifier si les notifications sont activées
      if (!(ParametresApplication instanceof BddError) && ParametresApplication.notifications === true) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Vous avez une nouvelle réponse',
            body: `La requête est terminée`,
            sound: 'default',
          },
          trigger: null, 
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Échec de l'envoi de la notification:", error);
      return false;
    }
  }
}

NotificationService.initialize().catch(console.error);
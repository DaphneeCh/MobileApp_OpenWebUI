import { RequetesServeurEtCache } from "./requetesServeurEtCache";

import { ChatInfos, RequeteFeatures, ReponseLLM } from "@/types/dataTypes";
import { FetchError, TypesFetchError } from "@/classes/FetchError";

import { AppState } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { NotificationService } from '@/outils/notificationService';

export class RequetesServeurEtNotifications extends RequetesServeurEtCache {

    public static async envoyerRequete(adresseWeb: string, cleAPI: string, idModele: string, texteRequete: string, chatInfos: ChatInfos, features?: RequeteFeatures): Promise<ReponseLLM | FetchError>{

        // Verifier la state de l'application
        const initialAppState = AppState.currentState;
        
        // Démarrer BackgroundTimer
        BackgroundTimer.start();

        try {
            const reponseLLM = await super.envoyerRequete(adresseWeb, cleAPI, idModele, texteRequete, chatInfos, features); // appelle la méthode  héritée

            if (FetchError.isInstance(reponseLLM)) {
                BackgroundTimer.stop();
                return reponseLLM; // propage l'erreur
            }

             // Vérifiez si l'application était en arrière-plan lorsque la demande a démarré ou si elle est en arrière-plan maintenant
             const currentAppState = AppState.currentState;
             if ((currentAppState === 'background') && reponseLLM) {
                 // Envoyer une notification si l'application était en arrière-plan
                 await NotificationService.sendNotificationIfEnabled(
                     'Requête complétée', 
                     `La requête au modèle ${idModele} est terminée`,
                     { modelId: idModele }
                 );
             }
             
             BackgroundTimer.stop();
             return reponseLLM;

        }
        catch(error) {
            BackgroundTimer.stop();
            return new FetchError(TypesFetchError.Developpement, "Une erreur s'est produite pendant la requête: " + error);
        }
    }
}
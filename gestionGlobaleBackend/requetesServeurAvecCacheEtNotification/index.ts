import { RequetesServeurEtCache } from "./requetesServeurEtCache";
import { RequetesServeurEtNotifications } from "./requetesServeurEtNotifications";

export default RequetesServeurEtNotifications;
// Pour faire fonctionner la fonctionnalité 'Notifications', il faut remplacer l'export par défaut par RequetesServeurEtNotifications
//      Cependant, cela peut entraîner l'impossibilité d'envoyer des requêtes aux LLM sur Expo Go (phase de test), donc on garde l'export par défaut RequetesServeurEtCache
// Ainsi, vous pouvez alterner l'export par défaut avec l'autre valeur, si vous voulez activer / désactiver le système de Notifications (et que vous pouvez tester autre part que Expo Go)

// Comme cet export est par défaut, on peut le renommer quand on l'importe dans un autre fichier (par exemple, simplement RequetesServeur)
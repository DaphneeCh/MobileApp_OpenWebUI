import { RequetesAnnexes } from "./requetesAnnexes";
import { RequetesBasiques } from "./requetesBasiques";
import { RequetesGestionConversation } from "./requetesGestionConversation";

/** Classe qui regroupe toutes les fonctions de : RequetesBasiques + RequetesGestionConversation + RequetesAnnexes
 * @extends RequetesBasiques
 * @extends RequetesGestionConversation
 * @extends RequetesAnnexes
 */
export default class RequetesServeur extends RequetesAnnexes { }
import BddListeServeurs from "@/bdd/bddListeServeurs";
import { BddError } from "@/classes/BddError";
import { cache } from "@/bdd/cache";

/**
 * Combine les requêtes sur la BDD liste des serveurs, avec des opérations sur le cache.
 * Cela concerne les listes de conversation ici.
 * La seule opération est :
 *    - supprimer une liste de conversations du cache (lorsqu'on supprime un serveur de la liste des serveurs)
 * @extends BddListeServeurs
 */
export default class BddListeServeursEtCache extends BddListeServeurs {

    /**
     * @override
     * @inheritdoc
     */
    public static async supprimerServeur(idNomServeur: string): Promise<true | BddError> {
        const result = await super.supprimerServeur(idNomServeur);
        if (BddError.isInstance(result))
            return result; // propage l'erreur

        await cache.supprimerListeConversationsDansCache(idNomServeur);
        return result;
    }

}
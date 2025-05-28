import { CacheApp } from "@/bdd/cache/cacheApp";
import { Parsers } from "@/requetesServeur/outils/serverObjectParsers";
import { MemoryStore } from "react-native-cache";

import { objetTestListeConversationsTitresUniquement, objetParsedConversation } from "@/test/requetesServeur/outils/objetsParsers";
import { objetConvBrutePourTestAjoutEtModification } from "@/test/requetesServeur/outils/objetsModifConvBrute";

const objetListeConversations = objetTestListeConversationsTitresUniquement;
const tailleObjListeConv = JSON.stringify(objetListeConversations).length; // nb de caractères de l'objet liste de conversation

const objetConversation = objetParsedConversation;
const tailleObjConversation = JSON.stringify(objetConversation).length; // nb de caractères de l'objet conversation

// Le cache pour les tests
const cache = new CacheApp(tailleObjListeConv + 1, tailleObjConversation + 1, MemoryStore);

describe("cache liste conversation", () => {

    beforeEach( async () => {
        await cache.viderCache();
    });

    it("can add elements", async () => {
        var objetRetourne = await cache.getListeConversationsDansCache("test");
        expect(objetRetourne).toBe(null);

        const objListeConversations = { data: objetListeConversations}
        await cache.ajouterListeConversationsDansCache("test", objListeConversations);

        objetRetourne = await cache.getListeConversationsDansCache("test");
        expect(objetRetourne).toEqual(objListeConversations);
    });

    it("can delete elements", async () => {
        var objetRetourne = await cache.getListeConversationsDansCache("test");
        expect(objetRetourne).toBe(null);
        
        const objListeConversations = { data: objetListeConversations}
        await cache.ajouterListeConversationsDansCache("test", objListeConversations);

        objetRetourne = await cache.getListeConversationsDansCache("test");
        expect(objetRetourne).not.toBe(null);

        await cache.supprimerListeConversationsDansCache("test");
        
        objetRetourne = await cache.getListeConversationsDansCache("test");
        expect(objetRetourne).toBe(null);
    });

    it("cannot exceed max size", async() => {
        // On a mis une valeur max size du cache, de sorte qu'on ne peut ajouter qu'une seule liste de conversations
        const objListeConversations = { data: objetListeConversations}
        await cache.ajouterListeConversationsDansCache("test", objListeConversations);

        var objetRetourne = await cache.getListeConversationsDansCache("test");
        expect(objetRetourne).toEqual(objListeConversations);

        await cache.ajouterListeConversationsDansCache("test2", objListeConversations);

        objetRetourne = await cache.getListeConversationsDansCache("test");
        expect(objetRetourne).toBe(null); // le premier élément a été supprimé par manque de place dans le cache
    
        objetRetourne = await cache.getListeConversationsDansCache("test2");
        expect(objetRetourne).not.toBe(null); // le deuxième élément est toujours dans le cache
    });
});

describe("cache contenu conversations", () => {

    beforeEach(() => {
        cache.viderCache();
    });

    it("can add elements", async() => {
        var objetRetourne = await cache.getConversationDansCache("testServeur", objetConversation.id);
        expect(objetRetourne).toBe(null);

        await cache.ajouterConversationDansCache("testServeur", objetConversation);

        objetRetourne = await cache.getConversationDansCache("testServeur", objetConversation.id);
        expect(objetRetourne).toEqual(objetConversation);
    });

    it("can delete elements", async () => {
        await cache.ajouterConversationDansCache("testServeur", objetConversation);

        var objetRetourne = await cache.getConversationDansCache("testServeur", objetConversation.id);
        expect(objetRetourne).not.toBe(null);

        await cache.supprimerConversationDansCache("testServeur", objetConversation.id);

        objetRetourne = await cache.getConversationDansCache("testServeur", objetConversation.id);
        expect(objetRetourne).toBe(null);
    });

    it("cannot exceed max size", async () => {
        // On a mis une valeur max size du cache, de sorte qu'on ne peut ajouter qu'une seule conversation
        await cache.ajouterConversationDansCache("testServeur", objetConversation);

        var objetRetourne = await cache.getConversationDansCache("testServeur", objetConversation.id);
        expect(objetRetourne).not.toBe(null);

        await cache.ajouterConversationDansCache("testServeur2", objetConversation);

        objetRetourne = await cache.getConversationDansCache("testServeur", objetConversation.id);
        expect(objetRetourne).toBe(null); // le premier élément a été supprimé par manque de place
    
        objetRetourne = await cache.getConversationDansCache("testServeur2", objetConversation.id);
        expect(objetRetourne).not.toBe(null); // le deuxième élément est toujours dans le cache
    });
});

test("Fonction 'minimiserConversation()' retourne bien une conversation réduite ", () => {
    var objetConversation = structuredClone( objetConvBrutePourTestAjoutEtModification );
    objetConversation = Parsers.parseConversation(objetConversation, true);
    expect(objetConversation).not.toBe(null);

    const objetResultat = CacheApp.minimiserConversation(objetConversation);

    delete objetConversation.chat.history.messages["demande3"];
    delete objetConversation.chat.history.messages["reponse2"];
    const idSuppr = objetConversation.chat.history.messages["demande2"].childrenIds.indexOf("reponse2");
    objetConversation.chat.history.messages["demande2"].childrenIds.splice(idSuppr, 1);

    expect(objetResultat).toEqual(objetConversation);
});
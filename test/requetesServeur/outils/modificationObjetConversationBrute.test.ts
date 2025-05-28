/**
 * Teste les fonctions du fichier 'requetesServeur/modificationObjetConversationBrute.ts'
 */

import { ModifierConversationBrute } from "@/requetesServeur/outils/modificationObjetConversationBrute";
import * as objetModifConvTest from "./objetsModifConvBrute";
import { FetchError, TypesFetchError } from "@/classes/FetchError";

/**
 * Teste la fonction 'obtenirIdentifiantsDesMessagesDeConversation()'
 */
test("Fonction 'obtenirIdentifiantsDesMessagesDeConversation()' retourne le bon objet ", () => {
    const objetTest = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutEtModification);
    const listeIds = ["demande1", "reponse1", "demande2", "reponse2", "demande3", "reponse3"];

    const objetRetourne = ModifierConversationBrute.obtenirIdentifiantsDesMessagesDeConversation(objetTest);

    expect( objetRetourne ).toEqual( expect.arrayContaining(listeIds) ); // pour comparer deux arrays, peu importe l'emplacement des éléments similaires
});

test("Fonction 'obtenirIdentifiantsDesMessagesDeConversation()' prend en paramètre un objet incompatible ", () => {
    const objetIncompatible = { title: "objet incompatible" };

    const objetRetourne = ModifierConversationBrute.obtenirIdentifiantsDesMessagesDeConversation(objetIncompatible);

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.ObjetIncompatible) ).toBe( true );
});

/**
 * Teste la fonction 'obtenirIdentifiantDuDernierMessage()'
 */
test("Fonction 'obtenirIdentifiantDuDernierMessage()' retourne le bon objet ", () => {
    const objetTest = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutEtModification);
    const idDernierMessage = objetTest.chat.history.currentId;

    const objetRetourne = ModifierConversationBrute.obtenirIdentifiantDuDernierMessage(objetTest);

    expect( objetRetourne ).toBe( idDernierMessage );
});

test("Fonction 'obtenirIdentifiantDuDernierMessage()' prend en paramètre un objet incompatible ", () => {
    const objetIncompatible = { title: "objet incompatible" };

    const objetRetourne = ModifierConversationBrute.obtenirIdentifiantDuDernierMessage(objetIncompatible);

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.ObjetIncompatible) ).toBe( true );
});

/**
 * Teste la fonction 'ajouterMessageDansObjetConversationBrute()'
 */

test("Fonction 'ajouterMessageDansObjetConversationBrute()' retourne le bon objet, après ajout en fin de conversation ", () => {
    const messageDemande = structuredClone(objetModifConvTest.messageDemande);
    const messageReponse = structuredClone(objetModifConvTest.messageReponse);
    const objetTestAjout = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutEtModification);

    const objetRetourne = ModifierConversationBrute.ajouterMessagesDansObjetConversationBrute(objetTestAjout, messageDemande, messageReponse);
    
    expect( objetRetourne ).toEqual( objetModifConvTest.objetConvBrutePourTestAjoutApresAjoutMessagesDemandeEtReponse );
});

test("Fonction 'ajouterMessageDansObjetConversationBrute()' retourne le bon objet, après ajout en fin de conversation, et sans l'attribut 'chat.messages' ", () => {
    // On vérifie que l'attribut 'chat.messages' est optionnel ici, donc s'il n'y a pas cet attribut dans l'objet de départ, alors l'objet retourné ne le contient pas non plus
    const messageDemande = structuredClone(objetModifConvTest.messageDemande);
    const messageReponse = structuredClone(objetModifConvTest.messageReponse);
    const objetTestAjout = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutEtModification);
    delete objetTestAjout.chat.messages; // suppression de l'attribut 'chat.messages'

    const objetRetourne = ModifierConversationBrute.ajouterMessagesDansObjetConversationBrute(objetTestAjout, messageDemande, messageReponse);

    const objetPrevuApresAjout = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutApresAjoutMessagesDemandeEtReponse);
    delete objetPrevuApresAjout.chat.messages;

    expect( objetRetourne ).toEqual( objetPrevuApresAjout );
});

test("Fonction 'ajouterMessageDansObjetConversationBrute()' reçoit un objet incompatible ", () => {
    // On vérifie que si on donne en paramètre un objet incompatible, la fonction retourne l'erreur souhaitée
    const messageDemande = structuredClone(objetModifConvTest.messageDemande);
    const messageReponse = structuredClone(objetModifConvTest.messageReponse);
    const objetIncompatible = { title: "objet incompatible" };

    const objetRetourne = ModifierConversationBrute.ajouterMessagesDansObjetConversationBrute(objetIncompatible, messageDemande, messageReponse);

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.ObjetIncompatible) ).toBe( true );
});

test("Fonction 'ajouterMessageDansConversationBrute()' ne trouve pas le message de fin de conversation ", () => {
    const messageDemande = structuredClone(objetModifConvTest.messageDemande);
    const messageReponse = structuredClone(objetModifConvTest.messageReponse);
    const objetTestAjout = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutEtModification);
    objetTestAjout.chat.history.currentId = "reponse4623";

    const objetRetourne = ModifierConversationBrute.ajouterMessagesDansObjetConversationBrute(objetTestAjout, messageDemande, messageReponse);

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.ObjetIncompatible) ).toBe( true );
});

test("Fonction 'ajouterMessageDansObjetConversationBrute()' reçoit des messages qui ont le même identifiant ", () => {
    const messageDemande = structuredClone(objetModifConvTest.messageDemande);
    const messageReponse = structuredClone(objetModifConvTest.messageReponse);
    const objetTestAjout = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutEtModification);
    messageDemande.id = messageReponse.id;

    const objetRetourne = ModifierConversationBrute.ajouterMessagesDansObjetConversationBrute(objetTestAjout, messageDemande, messageReponse);

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.IdInvalide) ).toBe( true );
});



/**
 * Teste la fonction 'modifierMessageDansObjetConversationBrute()'
 */

test("Fonction 'modifierMessageDansObjetConversationBrute()' retourne le bon objet, après modification de 'reponse2' ", () => {
    // On modifie le texte du message 'reponse2'
    const objetTestModification = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutEtModification);
    const copieModifie = structuredClone(objetTestModification);
    const nouveauTexte = "nouveau texte de message";
    const objetRetourne = ModifierConversationBrute.modifierMessageDansObjetConversationBrute(objetTestModification, "reponse2", nouveauTexte);

    // On modifie le texte du message 'reponse2' directement dans la copie (pour le test), à la fois dans 'chat.history.messages' et 'chat.messages'
    copieModifie.chat.history.messages.reponse2.content = nouveauTexte; 
    Object.values(copieModifie.chat.messages).some( element => {
        if (element && typeof element === "object" && "id" in element && element.id === "reponse2" && "content" in element) {
            element.content = nouveauTexte;
            return true;
        }
    });

    expect(objetRetourne).toEqual(copieModifie);
});

test("Fonction 'modifierMessageDansObjetConversationBrute()' retourne le bon objet, sans l'attribut 'chat.messages' ", () => {
    // On modifie le texte du message 'reponse2' (et on considère que l'attribut 'chat.messages' est vide)
    const objetTestModification = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutEtModification);
    delete objetTestModification.chat.messages;
    
    const copieModifie = structuredClone(objetTestModification);
    const nouveauTexte = "texte modifié sans l'attribut 'chat.messages' "

    const objetRetourne = ModifierConversationBrute.modifierMessageDansObjetConversationBrute(objetTestModification, "reponse2", nouveauTexte);

    copieModifie.chat.history.messages.reponse2.content = nouveauTexte;

    expect(objetRetourne).toEqual(copieModifie);
});

test("Fonction 'modifierMessageDansObjetConversationBrute()' reçoit un objet incompatible ", () => {
    // On passe en paramètre de la fonction un objet incompatible
    const objetIncompatible = { title: "objet incompatible" };
    const objetRetourne = ModifierConversationBrute.modifierMessageDansObjetConversationBrute(objetIncompatible, "reponse2", "test echec car objet incompatible");

    expect( FetchError.isInstance(objetRetourne) 
        && objetRetourne.isType(TypesFetchError.ObjetIncompatible) ).toBe( true );
});

test("Fonction 'modifierMessageDansObjetConversationBrute()' mais l'ID donné en paramètre correpond à un objet inexistant ", () => {
    // On passe en paramètre de la fonction, un ID de message à modifier, mais cet ID n'existe pas dans l'objet à modifier
    const objetTestModification = structuredClone(objetModifConvTest.objetConvBrutePourTestAjoutEtModification);
    const objetRetourne = ModifierConversationBrute.modifierMessageDansObjetConversationBrute(objetTestModification, "demande548", "test echec car ID de message inexistant");

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.ObjetInexistant) ).toBe( true );
});


/**
 * Teste la fonction 'supprimerMessageDansObjetConversationBrute()'
 */
test("Fonction 'supprimerMessageDansObjetConversationBrute()' retourne le bon objet, après suppression du message 'demande5' ", () => {
    const objetTestSuppression = structuredClone(objetModifConvTest.objetConvBrutePourTestSuppression);
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetTestSuppression, "demande5");

    expect( objetRetourne ).toEqual( objetModifConvTest.objetConvBrutePourTestSuppressionDemande5 );
});

test("Fonction 'supprimerMessageDansObjetConversationBrute()' retourne le bon objet, après suppression du message 'demande2' ", () => {
    const objetTestSuppression = structuredClone(objetModifConvTest.objetConvBrutePourTestSuppression);
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetTestSuppression, "demande2");

    expect( objetRetourne ).toEqual( objetModifConvTest.objetConvBrutePourTestSuppressionDemande2 );
});

test("Fonction 'supprimerMessageDansObjetConversationBrute()' reçoit un objet incompatible ", () => {
    const objetIncompatible = { title: "objetIncompatible" };
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetIncompatible, "demande2");

    expect( FetchError.isInstance(objetRetourne) 
            && objetRetourne.isType(TypesFetchError.ObjetIncompatible) ).toBe( true );
   
});

test("Fonction 'supprimerMessageDansObjetConversationBrute()' tente de supprimer un message en tête de conversation ", () => {
    const objetTestSuppression = structuredClone(objetModifConvTest.objetConvBrutePourTestSuppression);
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetTestSuppression, "demande1"); // 'demande1' est le message de tête de conversation

    expect( FetchError.isInstance(objetRetourne) 
            && objetRetourne.isType(TypesFetchError.IdInvalide) ).toBe( true )
});

test("Fonction 'supprimerMessageDansObjetConversationBrute()' tente de supprimer un message de réponse, au lieu d'un message de demande ", () => {
    const objetTestSuppression = structuredClone(objetModifConvTest.objetConvBrutePourTestSuppression);
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetTestSuppression, "reponse1"); 

    expect( FetchError.isInstance(objetRetourne) 
            && objetRetourne.isType(TypesFetchError.IdInvalide) ).toBe( true )
});

test("Fonction 'supprimerMessageDansObjetConversationBrute()' tente de supprimer un message qui n'existe pas dans la conversation ", () => {
    const objetTestSuppression = structuredClone(objetModifConvTest.objetConvBrutePourTestSuppression);
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetTestSuppression, "idInexistant"); 

    expect( FetchError.isInstance(objetRetourne) 
            && objetRetourne.isType(TypesFetchError.ObjetInexistant) ).toBe( true )
});

test("Fonction 'supprimerMessageDansObjetConversationBrute()' avec le message père qui a un attribut incorrect ", () => {
    // Dans le cas où on essaie de supprimer 'demande2', son parent (ici 'reponse1') doit avoir certains attributs prédéterminés, sinon il y a erreur
    const objetTestSuppression = structuredClone(objetModifConvTest.objetConvBrutePourTestSuppression);

    objetTestSuppression.chat.history.messages.reponse1.id = "";
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetTestSuppression, "demande2");

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.ObjetIncompatible) ).toBe( true );
});

test("Fonction 'supprimerMessageDansObjetConversationBrute()' avec un message de tête de conversation introuvable ", () => {
    // On a besoin de savoir qui est le message de tête de conversation. On teste dans le cas où il est introuvable (il n'y a pas de message avec un attribut 'parentId' qui vaut null)
    const objetTestSuppression = structuredClone(objetModifConvTest.objetConvBrutePourTestSuppression);

    objetTestSuppression.chat.history.messages.demande1.parentId = "";
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetTestSuppression, "demande2");

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.ObjetIncompatible) ).toBe( true );
});

test("Fonction 'supprimerMessageDansObjetConversationBrute()' mais l'algorithme ne trouve pas un message de fin de conversation ", () => {
    // Dans le cas où on essaie de supprimer 'demande5', le nouveau message de fin de conversation est censé être 'reponse4'
    const objetTestSuppression = structuredClone(objetModifConvTest.objetConvBrutePourTestSuppression);

    objetTestSuppression.chat.history.messages.reponse4.id = ""; // Le message de fin de conversation 'reponse4' a son attribut 'id' incompatible
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetTestSuppression, "demande5");

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.ObjetIncompatible) ).toBe( true );
});

test("Fonction 'supprimerMessageDansObjetConversationBrute()' mais l'algorithme boucle en cherchant le message de fin de conversation ", () => {
    // Dans le cas où on essaie de supprimer 'demande5', le nouveau message de fin de conversation est censé être 'reponse4'
    const objetTestSuppression = structuredClone(objetModifConvTest.objetConvBrutePourTestSuppression);

    objetTestSuppression.chat.history.messages.reponse4.childrenIds = ["demande1"]; // Le message de fin de conversation 'reponse4' a comme enfant 'demande1', qui est la tête de conversation
    const objetRetourne = ModifierConversationBrute.supprimerMessageDansObjetConversationBrute( objetTestSuppression, "demande5");

    expect( FetchError.isInstance(objetRetourne)
            && objetRetourne.isType(TypesFetchError.Boucle) ).toBe( true );
});

import { Parsers } from "@/requetesServeur/outils/serverObjectParsers"
import * as objetsTestParsers from "./objetsParsers";

/** Teste les fonctions du fichier 'requetesServeurs/serverObjectParsers' */


/**
 * Test de la fonction 'parseListeModeles()'
 */

test("Fonction 'parseListeModeles()', retourne le bon objet ", () => {
    const objetServeur = objetsTestParsers.objetTestListeModeles;

    const resultat = Parsers.parseListeModeles(objetServeur);
    const objetParsedListeModeles = objetsTestParsers.objetParsedListeModeles;

    expect( resultat ).toEqual( objetParsedListeModeles );
});

test("Fonction 'parseListeModeles()', retourne null pour un objet incompatible ", () => {
  const objetIncompatible = { title: "objet incompatible" };

  const resultat = Parsers.parseListeModeles(objetIncompatible);

  expect(resultat).toBe(null);
});

/**
 * Test de la fonction 'parseListeConversations()'
 */

test("Fonction 'parseListeConversations(), retourne le bon objet ", () => {
    const objetServeur = objetsTestParsers.objetTestListeConversationsTitresUniquement;

    const resultat = Parsers.parseListeConversations(objetServeur);

    const objetResultat = { data: objetServeur};

    expect( resultat ).toEqual( objetResultat );
});

test("Fonction 'parseListeConversations()', retourne null pour un objet incompatible ", () => {
  const objetIncompatible = { title: "objet incompatible" };

  const resultat = Parsers.parseListeConversations(objetIncompatible);

  expect( resultat ).toBe( null );
});


/**
 * Test de la fonction 'parseConversation()'
 */

test("Fonction 'parseConversation()', retourne le bon objet (avec attribut 'chat' inclus)", () => {
  const objetServeur = objetsTestParsers.objetTestConversation;

  const resultat = Parsers.parseConversation(objetServeur, true);

  const objetResultat = objetsTestParsers.objetParsedConversation;

  expect( resultat ).toEqual( objetResultat );
});

test("Fonction 'parseConversation()', retourne le bon objet (sans attribut 'chat') ", () => {
  const objetServeur = objetsTestParsers.objetTestConversation;

  // La fonction ne parse pas le 'chat' ici
  const resultat = Parsers.parseConversation(objetServeur);

  const objetResultat = structuredClone( objetsTestParsers.objetParsedConversation ) as any;
  delete objetResultat.chat;

  expect( resultat ).toEqual( objetResultat );
}); 

test("Fonction 'parseConversation()', retourne null pour un objet incompatible ", () => {
  const objetIncompatible = { title: "objet incompatible" };

  const resultat = Parsers.parseConversation(objetIncompatible);

  expect( resultat ).toBe( null );
});


/**
 * Test de la fonction 'parseChat()'
 */

test("Fonction 'parseChat()', retourne le bon objet ", () => {
  const objetServeur = objetsTestParsers.objetTestChat;

  const resultat = Parsers.parseChat(objetServeur);

  const objetResultat = objetsTestParsers.objetParsedChat;

  expect( resultat ).toEqual( objetResultat );
});

test("Fonction 'parseChat()', retourne null pour un objet incompatible ", () => {
  const objetIncompatible = { title: "objet incompatible" };

  const resultat = Parsers.parseChat(objetIncompatible);

  expect( resultat ).toBe( null );
});


/**
 * Test de la fonction 'parseParams()'
 */

test("Fonction 'parseParams()', retourne le bon objet (exemple n°1, 4 attributs correct) ", () => {
  const objetServeur = {
    system: "hey",
    stop: ["cordialement"],
    temperature: 0.1,
    max_tokens: 78
  };

  const resultat = Parsers.parseParams(objetServeur);

  expect( resultat ).toEqual( objetServeur );
});

test("Fonction 'parseParams()', retourne le bon objet (exemple n°2, mélange d'attributs corrects et incorrects) ", () => {
  const objetServeur: any = {
    system: "You talk like a pirate",
    test: "whatever",
    temperature: 3.8,
    whatisit: 48
  };

  const resultat = Parsers.parseParams(objetServeur);

  delete objetServeur.test;
  delete objetServeur.whatisit;

  expect( resultat ).toEqual( objetServeur );
});

test("Fonction 'parseParams(), retourne un objet vide pour un objet incompatible ", () => {
  const objetIncompatible = { title: "objet incompatible" };

  const resultat = Parsers.parseParams(objetIncompatible);

  expect( resultat ).toEqual( {} );
})



/**
 * Test de la fonction 'parseReponseLLM()'
 */

test("Fonction 'parseReponseLLM', retourne le bon objet ", () => {
  const objetServeur = objetsTestParsers.objetTestReponseLLM;

  const resultat = Parsers.parseReponseLLM(objetServeur, 1743428133);

  const objetResultat = objetsTestParsers.objetParsedReponseLLM;

	expect( resultat ).toEqual( objetResultat );
});

test("Fonction 'parseReponseLLM', retourne null pour un objet incompatible ", () => {
  const objetIncompatible = { title: "objet incompatible" };

  const resultat = Parsers.parseReponseLLM(objetIncompatible, 0);

  expect( resultat ).toBe( null );
});
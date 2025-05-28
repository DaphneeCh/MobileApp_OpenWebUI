import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Alert, Modal } from "react-native";
import { router } from "expo-router";

import { styles } from "./styles/index.styles";
import { DonneesServeur } from "@/types/typesBDD";
import { BddError } from "@/classes/BddError";

import BddListeServeurs from "@/gestionGlobaleBackend/bddListeServeursEtCache";
import ModalAjouterServeur from "./ModalAjouterServeur";
import ModalModifierServeur from "./ModalModifierServeur";
import { Ionicons } from '@expo/vector-icons';




/**
 * Écran principal de l'application
 * Permet à l'utilisateur de gérer ses serveurs (ajouter, modifier, supprimer)
 * et de se connecter à un serveur pour accéder à l'interface de conversation
 * @returns {TSX.Element} L'écran de sélection du serveur
 */
export default function Serveur() {
  /**
   * Les variables d'état de l'écran
   */
  const listeServeurs: DonneesServeur[] = [];
  const [serveurs, setListeServeurs] = useState(listeServeurs);
  const [estModalOptionsVisible, setEstModalOptionsVisible] = useState(false);
  const [estModalAjouterVisible, setEstModalAjouterVisible] = useState(false);
  const [estModalModifierVisible, setEstModalModifierVisible] = useState(false);
  const [serveurAModifier, setServeurAModifier] = useState<DonneesServeur | null>(null);
  
  /**
   * Navigue vers l'écran de conversation avec les détails du serveur sélectionné
   * @param {string} adresseServeur - L'adresse du serveur
   * @param {string} cleAPI - La clé API pour l'authentification
   */
  const gererServeur = (adresseServeur: string, cleAPI: string, idServeur?: string) => {
    // Naviguer vers l'écran de conversation avec les détails du serveur
    router.push({
      pathname: "/conversation",
      params: { 
        serverAddress: adresseServeur,
        apiKey: cleAPI,
        serverId: idServeur
      }
    });
  };
  const ouvrirParametres = () => {
    router.push("/parametres");
  };

  /**
   * Récupère la liste des serveurs depuis la base de données et met à jour l'état
   */
  const rafraichirListeServeurs = async () => {
    const listeServeurs = await BddListeServeurs.obtenirListeServeursDepuisTableServeurs();
    if (BddError.isInstance(listeServeurs))
      return;
    setListeServeurs(listeServeurs);
  };

  /**
   * Initialise la table des serveurs et récupère la liste au chargement du composant
   */
  useEffect(() => {
    async function recupererListeServeurs() {
      const creationTableServeurs = await BddListeServeurs.creerTableServeurs();
      if (BddError.isInstance(creationTableServeurs))
        return;

      await rafraichirListeServeurs();
    };
    recupererListeServeurs();
  }, []);

  /**
   * Affiche le menu d'options pour un serveur spécifique
   * @param {DonneesServeur} serveur - Le serveur pour lequel afficher les options
   */
  const afficherMenuServeur = (serveur: DonneesServeur) => {
    setServeurAModifier(serveur);
    setEstModalOptionsVisible(true);
  };

  /**
   * Affiche une boîte de dialogue de confirmation pour la suppression d'un serveur
   * @param {DonneesServeur} serveur - Le serveur à supprimer
   */
  const confirmerSuppressionServeur = (serveur: DonneesServeur) => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer "${serveur.nom_serveur_affiche}" ?`,
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Oui, supprimer",
          style: "destructive",
          onPress: async () => {
            const resultat = await BddListeServeurs.supprimerServeur(serveur.id_nom_serveur);
            if (BddError.isInstance(resultat)) {
              Alert.alert("Erreur", resultat.getMessage());
              return;
            }
            await rafraichirListeServeurs();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenue</Text>
        <Text style={styles.welcomeText}>sur</Text>
        <Text style={styles.title}>OpenMobileUI</Text>
      </View>
      <View style={styles.serverSection}>
        <Text style={styles.serverTitle}>Choisissez un serveur:</Text>

        {serveurs.length > 0 ? (
          // Affichage de la liste des serveurs si elle n'est pas vide
          <View style={styles.serverList}>
            {serveurs.map((serveur, index) => (
              <View key={index} style={styles.serverButton}>
                <TouchableOpacity style={styles.serverNameButton} 
                  onPress={ async () => {
                    const getCleAPI = await BddListeServeurs.obtenirObjetSecurise(serveur.id_nom_serveur);
                    if (BddError.isInstance(getCleAPI)) {
                      Alert.alert("Erreur", getCleAPI.getMessage());
                      return;
                    }
                    gererServeur(serveur.adresse, getCleAPI, serveur.id_nom_serveur);
                  } }>
                  <Text style={styles.serverText}>{serveur.nom_serveur_affiche}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => afficherMenuServeur(serveur)}>
                  <Text style={styles.ellipsis}>...</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          // Message affiché lorsqu'aucun serveur n'est disponible
          <View style={[styles.serverList, styles.emptyServerList]}>
            <Text style={styles.emptyText}>Aucun serveur</Text>
            <Text style={styles.emptySubText}>Commencez par ajouter un serveur</Text>
          </View>
        )}
        {/* Le bouton pour ajouter un serveur */}
          <TouchableOpacity 
            style={styles.addServerButton}
            onPress={() => setEstModalAjouterVisible(true)}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
      </View>

      {/* 
       * Modal pour les options du serveur
       * Ce modal s'affiche lorsque l'utilisateur clique sur les points de suspension (...)
       * Il permet de modifier ou supprimer un serveur, ou d'annuler l'action
       */}
      {estModalOptionsVisible && (
      <Modal
        visible={estModalOptionsVisible && serveurAModifier !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setEstModalOptionsVisible(false);
          setServeurAModifier(null);
        }}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setServeurAModifier(null)}
        >
          {serveurAModifier && (
            <View style={styles.serverOptionsContainer}>
              <Text style={styles.serverOptionsTitle}>
                Options pour "{serveurAModifier.nom_serveur_affiche}"
              </Text>
              
              <TouchableOpacity 
                style={styles.serverOptionButton}
                onPress={() => {
                  setEstModalOptionsVisible(false);
                  setTimeout(() => {
                  setEstModalModifierVisible(true);
                  }, 500);
                }}
              >
                <Text style={styles.serverOptionText}>Modifier</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.serverOptionButton, styles.serverOptionButtonDanger]}
                onPress={() => {
                  setServeurAModifier(null);
                  confirmerSuppressionServeur(serveurAModifier);
                }}
              >
                <Text style={styles.serverOptionTextDanger}>Supprimer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.serverOptionButton, styles.serverOptionButtonCancel]}
                onPress={() => setServeurAModifier(null)}
              >
                <Text style={styles.serverOptionText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
      )}

      {/* 
       * Modal pour ajouter un nouveau serveur
       * Permet à l'utilisateur de saisir les informations d'un nouveau serveur
       */}
      <ModalAjouterServeur
        visible={estModalAjouterVisible}
        onClose={() => setEstModalAjouterVisible(false)}
        onSubmit={(adresseServeur: string, cleAPI: string) => {
          gererServeur(adresseServeur, cleAPI);
          rafraichirListeServeurs().catch(error => {
            console.error('Erreur lors du rafraîchissement de la liste des serveurs :', error);
          });
        }}
      />
      
      {/* 
       * Modal pour modifier un serveur existant
       * Permet à l'utilisateur de modifier les informations d'un serveur
       */}
      {estModalModifierVisible && (
      <ModalModifierServeur
        visible={estModalModifierVisible}
        serveur={serveurAModifier}
        onClose={() => {
          setEstModalModifierVisible(false);
          setServeurAModifier(null);
        }}
        onSubmit={async () => {
          await rafraichirListeServeurs();
          setEstModalModifierVisible(false);
          setServeurAModifier(null);
        }}  
      />
      )}
      {/*
       * Bouton pour accéder aux paramètres de l'application
       * Il ouvre l'écran des paramètres lorsque l'utilisateur clique dessus
       */}
     <TouchableOpacity 
        style={styles.settingsButton}
        onPress={ouvrirParametres}
      >
        <Ionicons name="settings-outline" size={24} color="#555" />
      </TouchableOpacity>
    </View>
  );
}
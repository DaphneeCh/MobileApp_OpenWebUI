import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import {styles} from './styles/ModalModifierServeurs.styles';
import { DonneesServeur } from '@/types/typesBDD';
import { BddError } from '@/classes/BddError';

import BddListeServeurs from '@/gestionGlobaleBackend/bddListeServeursEtCache';

/**
 * Interface définissant les propriétés du composant ModalModifierServeur
 * @interface ModalModifierServeurProps
 * @property {boolean} visible - Détermine si le modal est visible ou non
 * @property {DonneesServeur | null} serveur - Les données du serveur à modifier
 * @property {() => void} onClose - Fonction appelée lors de la fermeture du modal
 * @property {() => void} onSubmit - Fonction appelée après une modification réussie
 */
interface ModalModifierServeurProps {
  visible: boolean;
  serveur: DonneesServeur | null;
  onClose: () => void;
  onSubmit: () => void;
}

/**
 * Composant Modal pour modifier les informations d'un serveur existant
 * Permet à l'utilisateur de modifier le nom, l'adresse et la clé API d'un serveur
 * @param {ModalModifierServeurProps} props - Les propriétés du composant
 * @returns {JSX.Element} Le composant Modal pour modifier un serveur
 */
export default function ModalModifierServeur({ visible, serveur, onClose, onSubmit }: ModalModifierServeurProps) {
  const [nomServeur, setNomServeur] = useState('');
  const [adresseServeur, setAdresseServeur] = useState('');
  const [cleAPI, setCleAPI] = useState('');
  const [estEnChargement, setEstEnChargement] = useState(false);

  /**
   * Effet qui s'exécute lorsque le serveur à modifier change
   * Initialise les champs du formulaire avec les valeurs actuelles du serveur
   */
  useEffect(() => {
    if (serveur) {
      setNomServeur(serveur.nom_serveur_affiche);
      setAdresseServeur(serveur.adresse);
      
      // Récupérer la clé API stockée de manière sécurisée
      const recupererCleAPI = async () => {
        const cle = await BddListeServeurs.obtenirObjetSecurise(serveur.id_nom_serveur);
        if (!BddError.isInstance(cle)) {
          setCleAPI(cle);
        }
      };
      
      recupererCleAPI();
    }
  }, [serveur]);

  /**
   * Valide et enregistre les modifications apportées au serveur
   * Vérifie que tous les champs sont remplis avant de procéder à la mise à jour
   */
  const validerModifications = async () => {
    if (!serveur) return;
    
    if (!nomServeur.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un nom pour le serveur");
      return;
    }
    
    if (!adresseServeur.trim()) {
      Alert.alert("Erreur", "Veuillez saisir l'adresse du serveur");
      return;
    }
    
    if (!cleAPI.trim()) {
      Alert.alert("Erreur", "Veuillez saisir une clé API");
      return;
    }
    
    setEstEnChargement(true);
    
    try {
      // Mettre à jour le nom du serveur dans la BDD
      const resultatModificationNom = await BddListeServeurs.modifierNomServeur(
        serveur.id_nom_serveur,
        nomServeur
      );
      
      if (BddError.isInstance(resultatModificationNom)) {
        Alert.alert("Erreur", resultatModificationNom.getMessage());
        setEstEnChargement(false);
        return;
      }
      
      // Mettre à jour l'adresse du serveur dans la BDD
      const resultatModificationAdresse = await BddListeServeurs.modifierAdresseServeur(
        serveur.id_nom_serveur,
        adresseServeur
      );
      
      if (BddError.isInstance(resultatModificationAdresse)) {
        Alert.alert("Erreur", resultatModificationAdresse.getMessage());
        setEstEnChargement(false);
        return;
      }
      
      // Mettre à jour la clé API dans le stockage sécurisé
      const resultatCleAPI = await BddListeServeurs.modifierObjetSecurise(
        serveur.id_nom_serveur,
        cleAPI
      );
      
      if (BddError.isInstance(resultatCleAPI)) {
        Alert.alert("Erreur", resultatCleAPI.getMessage());
        setEstEnChargement(false);
        return;
      }
      
      onSubmit();
    } catch (erreur) {
      console.error("Erreur lors de la modification du serveur:", erreur);
      Alert.alert("Erreur", "Une erreur est survenue lors de la modification du serveur");
    } finally {
      setEstEnChargement(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Modifier le serveur</Text>
          
          <Text style={styles.label}>Nom du serveur</Text>
          <TextInput
            style={styles.input}
            value={nomServeur}
            onChangeText={setNomServeur}
            placeholder="Nom du serveur"
            placeholderTextColor="#999"
          />
          
          <Text style={styles.label}>Adresse du serveur</Text>
          <TextInput
            style={styles.input}
            value={adresseServeur}
            onChangeText={setAdresseServeur}
            placeholder="https://api.example.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="url"
          />
          
          <Text style={styles.label}>Clé API</Text>
          <TextInput
            style={styles.input}
            value={cleAPI}
            onChangeText={setCleAPI}
            placeholder="Votre clé API"
            placeholderTextColor="#999"
            autoCapitalize="none"
            secureTextEntry={true}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
              disabled={estEnChargement}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit, estEnChargement && styles.buttonDisabled]}
              onPress={validerModifications}
              disabled={estEnChargement}
            >
              <Text style={styles.buttonText}>
                {estEnChargement ? "Modification..." : "Valider les modifications"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

  
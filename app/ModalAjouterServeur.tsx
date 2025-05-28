import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator, TouchableWithoutFeedback, Alert } from 'react-native';
import { useState } from 'react';

import { styles } from './styles/modalajouterserveur.styles';
import { FetchError, TypesFetchError } from '@/classes/FetchError';
import { BddError, TypesBddError } from '@/classes/BddError';

import BddListeServeurs from '@/gestionGlobaleBackend/bddListeServeursEtCache';
import RequetesServeur from '@/gestionGlobaleBackend/requetesServeurAvecCacheEtNotification';

/**
  * PropsModalAjouterServeur
  * @interface
  * @property {boolean} visible - Si le modal est visible
  * @property {() => void} onClose - Fonction à appeler pour fermer le modal
  * @property {(adresseServeur: string, cleAPI: string) => void} onSubmit - Fonction à appeler pour soumettre le formulaire
 */
interface PropsModalAjouterServeur {
  visible: boolean;
  onClose: () => void;
  onSubmit: (adresseServeur: string, cleAPI: string) => void;
}
/**
 * ModalAjouterServeur
 * @param {PropsModalAjouterServeur} props - Les propriétés du composant
 * @returns {TSX.Element} Le composant du modal d'ajout de serveur
 */
export default function ModalAjouterServeur({ visible, onClose, onSubmit }: PropsModalAjouterServeur) {
  const [adresseServeur, setAdresseServeur] = useState('');
  const [choixTypeConnexionCleAPI, setChoixTypeConnexionCleAPI] = useState(true);
  const [cleAPI, setCleAPI] = useState('');
  const [identifiant, setIdentifiant] = useState('');
  const [mdp, setMdp] = useState('');
  const [erreur, setErreur] = useState('');
  const [estEnTest, setEstEnTest] = useState(false);

  /**
   * Teste la connexion au serveur avant de soumettre le formulaire
   * @returns {Promise<void>} Soumettre le formulaire si la connexion est réussie
   */
  const soumettreFormulaire = async () => {
    if (!adresseServeur 
      || (choixTypeConnexionCleAPI && !cleAPI)
      || (!choixTypeConnexionCleAPI && (!identifiant || !mdp) ) ) {
      setErreur('Tous les champs sont obligatoires');
      return;
    }

    setAdresseServeur(adresseServeur.trim());
    setIdentifiant(identifiant.trim());
    setMdp(mdp.trim());

    try {
      setEstEnTest(true);
      setErreur('');

      // On utilise ici une variable pour stocker la clé d'API
      //  car on ne peut pas dépendre des hooks, qui ne sont pas mis à jour suffisamment rapidement
      var valeurCleAPI = cleAPI;

      if (!choixTypeConnexionCleAPI) {
        // On se connecte avec identifiant et mot de passe
        const getCleApiDepuisServeur = await RequetesServeur.seConnecterEtObtenirCleAPI(adresseServeur, identifiant, mdp); 
        if (FetchError.isInstance(getCleApiDepuisServeur)) {
          if (getCleApiDepuisServeur.isType(TypesFetchError.Utilisateur)) {
            setErreur("L'identifiant et/ou le mot de passe sont invalides.");
            return;
          }
          setErreur("Erreur de connexion");
          return;
        }
        valeurCleAPI = getCleApiDepuisServeur;
      }
      
      // Tester la connexion au serveur
      const resultat = await RequetesServeur.obtenirListeModeles(adresseServeur, valeurCleAPI);
      
      if (resultat instanceof FetchError) {
        Alert.alert('Erreur de connexion', 'Veuillez vérifier votre adresse de serveur et votre clé d\'API.');
        setErreur('Erreur de connexion');
        return;
      }

      const ajoutServeur = await BddListeServeurs.ajouterServeurDansTableServeurs(adresseServeur, adresseServeur, valeurCleAPI);
      if (BddError.isInstance(ajoutServeur)) {
        if (ajoutServeur.isType(TypesBddError.NombreMaxServeursAtteint))
          Alert.alert("Erreur d'ajout", ajoutServeur.getMessage());
        else
          Alert.alert("Erreur d'ajout", "L'ajout du serveur n'a pas pu se faire.");
        return;
      }
      
      // Si la connexion est réussie, soumettre le formulaire
      onSubmit(adresseServeur, valeurCleAPI);
      setAdresseServeur('');
      setCleAPI('');
      setIdentifiant('');
      setMdp('');
      setErreur('');
      setChoixTypeConnexionCleAPI(true);
      onClose();
    } catch (error) {
      setErreur('Erreur lors de la connexion au serveur');
      console.error('Erreur de connexion:', error);
    } finally {
      setEstEnTest(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ajouter un serveur</Text>
              
              <Text style={styles.label}>Adresse du serveur</Text>
              <TextInput
                style={styles.input}
                value={adresseServeur}
                onChangeText={setAdresseServeur}
                placeholder="Entrez l'adresse du serveur"
                placeholderTextColor="#666"
                editable={!estEnTest}
                inputMode="url" 
              />

              <View>

                <View style={styles.ligneChoixTypeConnexion}>
                  <TouchableOpacity onPress={() => setChoixTypeConnexionCleAPI(true)}>
                    <Text style={choixTypeConnexionCleAPI ? styles.boutonChoixTypeConnexionAppuye : styles.boutonChoixTypeConnexion}>
                      Clé d'API
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setChoixTypeConnexionCleAPI(false)}>
                    <Text style={choixTypeConnexionCleAPI ? styles.boutonChoixTypeConnexion : styles.boutonChoixTypeConnexionAppuye}>
                      Identifiants
                      </Text>
                  </TouchableOpacity>
                </View>

                <View style={{display: choixTypeConnexionCleAPI? 'flex' : 'none'}}>
                  <Text style={styles.label}>Clé d'API</Text>
                  <TextInput
                    style={styles.input}
                    value={cleAPI}
                    onChangeText={setCleAPI}
                    placeholder="Entrez la clé d'API"
                    placeholderTextColor="#666"
                    secureTextEntry
                    editable={!estEnTest}
                  />
                </View>

                <View style={{display: choixTypeConnexionCleAPI? 'none' : 'flex'}}>
                  <Text style={styles.label}>Identifiant</Text>
                  <TextInput
                    style={styles.input}
                    value={identifiant}
                    onChangeText={setIdentifiant}
                    placeholder="Entrez l'identifiant"
                    placeholderTextColor="#666"
                    editable={!estEnTest}
                    inputMode="email"
                  />
                  <Text style={styles.label}>Mot de passe</Text>
                  <TextInput
                    style={styles.input}
                    value={mdp}
                    onChangeText={setMdp}
                    placeholder="Entrez le mot de passe"
                    placeholderTextColor="#666"
                    secureTextEntry
                    editable={!estEnTest} 
                  />
                </View>

              </View>

              {erreur ? <Text style={styles.errorText}>Erreur: {erreur}</Text> : null}

              <TouchableOpacity 
                style={[styles.validateButton, estEnTest && styles.validateButtonDisabled]} 
                onPress={soumettreFormulaire}
                disabled={estEnTest}
              >
                {estEnTest ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.validateButtonText}>Valider</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}


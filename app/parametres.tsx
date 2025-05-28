import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/parametres.styles';
import { cacheStyles } from './styles/cacheStyles.styles';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { obtenirParametresApplication, modifierParametresApplication, initialiserParametresApplication } from '@/bdd/bddParametresApplication';
import { BddError } from '@/classes/BddError';
import { cache } from "@/bdd/cache/index";

/**
 * Composant de configuration
 * @param onClose - Fonction de rappel pour fermer le composant
 * @returns JSX.Element
 */
interface ConfigurationProps {
  onClose?: () => void;
}

const handledClose = () => {
  router.back();
};

/**
 * Formate la taille en octets en une chaîne lisible (Ko, Mo)
 * @param caracteres - Nombre de caractères
 * @returns Chaîne formatée
 */
const formatTailleCache = (caracteres: number): string => {
  // On multiplie par 2 car un caractère UTF-16 fait généralement 2 octets
  const bytes = caracteres * 2;

  if (bytes === 0) return "0 Ko";

  if (bytes < 1024) {
    return `${bytes} octets`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} Ko`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }
};

export default function Parametres({ onClose }: ConfigurationProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [cacheTaille, setCacheTaille] = useState<string>("Calcul en cours...");
  const [cacheListeTaille, setCacheListeTaille] = useState<string>("...");
  const [cacheContenuTaille, setCacheContenuTaille] = useState<string>("...");
  const [cacheListePourcentage, setCacheListePourcentage] = useState<number>(0);
  const [cacheContenuPourcentage, setCacheContenuPourcentage] = useState<number>(0);

  useEffect(() => {
    const chargerParametres = async () => {
      // Initialisation des paramètres
      const init = await initialiserParametresApplication();
      if (BddError.isInstance(init)) {
        Alert.alert("Erreur", "Impossible d'initialiser les paramètres");
        return;
      }

      // Récupération des paramètres
      const resultat = await obtenirParametresApplication();
      if (BddError.isInstance(resultat)) {
        Alert.alert("Erreur", "Impossible de charger les paramètres.");
      } else {
        setNotificationsEnabled(resultat.notifications);
      }

      // Calcul détaillé de la taille du cache
      await calculerDetailsTailleCache();
    };

    chargerParametres();
  }, []);

  /**
   * Calcule et affiche des détails sur la taille actuelle du cache
   */
  const calculerDetailsTailleCache = async () => {
    try {
      // Obtenir les tailles individuelles des caches
      const tailleTotale = await cache.getTailleTotaleActuelle();

      // Accéder aux caches internes via l'instance de CacheApp
      const tailleListeConv = await cache.cacheListeConversations.getCurrentTotalCharacterSize();
      const tailleContenuConv = await cache.cacheContenuConversations.getCurrentTotalCharacterSize();

      // Obtenir les tailles max des caches
      const tailleMaxCacheListeConversations = cache.cacheListeConversations.getMaxCharacterSize();
      const tailleMaxCacheContenuConversations = cache.cacheContenuConversations.getMaxCharacterSize();

      // Mettre à jour l'état avec les tailles formatées
      setCacheTaille(formatTailleCache(tailleTotale));
      setCacheListeTaille(formatTailleCache(tailleListeConv));
      setCacheContenuTaille(formatTailleCache(tailleContenuConv));

      // Calculer les pourcentages d'utilisation
      setCacheListePourcentage(Math.min(100, (tailleListeConv / tailleMaxCacheListeConversations) * 100));
      setCacheContenuPourcentage(Math.min(100, (tailleContenuConv / tailleMaxCacheContenuConversations) * 100));

    } catch (error) {
      console.error("Erreur lors du calcul de la taille du cache:", error);
      setCacheTaille("Erreur de calcul");
      setCacheListeTaille("Erreur");
      setCacheContenuTaille("Erreur");
    }
  };

  /**
   * Active ou désactive les notifications push selon la valeur fournie.
   */
  const modifierNotification = async (valeur: boolean) => {
    setNotificationsEnabled(valeur);

    //Permet de modifier les paramètres de l'application
    const resultat = await modifierParametresApplication(valeur);

    if (BddError.isInstance(resultat)) {
      Alert.alert("Erreur", "Impossible de sauvegarder les paramètres");
      return;
    }
  };

  /**
   * Affiche une boîte de dialogue pour confirmer le vidage du cache
   */
  const confirmerViderCache = () => {
    Alert.alert(
      "Vider le cache",
      "Voulez-vous vraiment vider le cache de l'application ? Cette action ne peut pas être annulée.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Vider",
          style: "destructive",
          onPress: async () => {
            try {
              await cache.viderCache();

              // Mettre à jour tous les détails du cache
              await calculerDetailsTailleCache();

              Alert.alert("Succès", "Le cache a été vidé avec succès.");
            } catch (error) {
              console.error("Erreur lors du vidage du cache:", error);
              Alert.alert("Erreur", "Une erreur est survenue lors du vidage du cache.");
            }
          }
        }
      ]
    );
  };

  // Composant pour afficher une barre de progression
  const ProgressBar = ({ percentage }: { percentage: number }) => {
    return (
      <View style={cacheStyles.progressContainer}>
        <View style={[cacheStyles.progressBar, { width: `${percentage}%` }]} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
        <TouchableOpacity onPress={handledClose} style={styles.closeButton}>
          <Ionicons name="close-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Activer les notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={modifierNotification}
              trackColor={{ false: '#3e3e3e', true: '#4a80f5' }}
              thumbColor={notificationsEnabled ? 'white' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Section Stockage améliorée */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STOCKAGE</Text>

          {/* Taille totale du cache */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Cache de l'application</Text>
              <Text style={styles.settingSubText}>{cacheTaille} au total</Text>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={confirmerViderCache}
            >
              <Text style={styles.actionButtonText}>Vider</Text>
            </TouchableOpacity>
          </View>

          {/* Détails du cache - Liste des conversations */}
          <View style={cacheStyles.detailsContainer}>
            <View style={cacheStyles.detailRow}>
              <Text style={cacheStyles.detailLabel}>Liste des conversations:</Text>
              <Text style={cacheStyles.detailValue}>{cacheListeTaille}</Text>
            </View>
            <ProgressBar percentage={cacheListePourcentage} />
            <Text style={cacheStyles.usageText}>
              {cacheListePourcentage.toFixed(1)}% utilisé
            </Text>
          </View>

          {/* Détails du cache - Contenu des conversations */}
          <View style={cacheStyles.detailsContainer}>
            <View style={cacheStyles.detailRow}>
              <Text style={cacheStyles.detailLabel}>Contenu des conversations:</Text>
              <Text style={cacheStyles.detailValue}>{cacheContenuTaille}</Text>
            </View>
            <ProgressBar percentage={cacheContenuPourcentage} />
            <Text style={cacheStyles.usageText}>
              {cacheContenuPourcentage.toFixed(1)}% utilisé
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

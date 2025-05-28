import { CacheApp } from "./cacheApp";
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Taille max du cache des listes de conversations (en nombre de caractères) */
const tailleMaxCacheListeConversations = 250000; // 250 000 caractères max
/** Taille max du cache des contenus de conversations (en nombre de caractères) */
const tailleMaxCacheContenuConversations = 2000000; // 2 000 000 caractères max

/**
 * Cache tel que :
 *    - 250 000 caractères max pour les liste de conversations
 *    - 2 000 000 caractères max pour les conversations
 *    - utilise 'AsyncStorage' pour la sauvegarde
 */
export const cache = new CacheApp(tailleMaxCacheListeConversations, tailleMaxCacheContenuConversations, AsyncStorage);

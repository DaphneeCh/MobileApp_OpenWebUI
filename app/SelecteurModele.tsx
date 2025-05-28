import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/selecteurModele.styles';

/**
 * PropsSelecteurModele
 * @interface
 * @property {string} modeleSelectionne - Le modèle sélectionné
 * @property {string[]} modelesDisponibles - Les modèles disponibles
 * @property {(modele: string) => void} onSelectionModele - Fonction à appeler lors de la sélection d'un modèle
 */
interface PropsSelecteurModele {
  modeleSelectionne: string;
  modelesDisponibles: string[];
  onSelectionModele: (modele: string) => void;
}
/**
 * SelecteurModele
 * @param {PropsSelecteurModele} props - Les propriétés du composant
 * @returns {TSX.Element} Le composant de sélection de modèle
 */
export default function SelecteurModele({ modeleSelectionne, modelesDisponibles, onSelectionModele }: PropsSelecteurModele) {
  const [estModalVisible, setEstModalVisible] = useState(false);
  /**
   * 
   * @param modele - Le modèle sélectionné
   * @returns {void} Sélectionner le modèle
   */
  const selectionnerModele = (modele: string) => {
    onSelectionModele(modele);
    setEstModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.modelSelectorButton}
        onPress={() => setEstModalVisible(true)}
      >
        <Text style={styles.modelText}>{modeleSelectionne}</Text>
        <Ionicons name="chevron-down" size={20} color="white" />
      </TouchableOpacity>

      <Modal
        visible={estModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEstModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setEstModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner un modèle</Text>
            
            <FlatList
              data={modelesDisponibles}
              keyExtractor={(element) => element}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.modelItem,
                    modeleSelectionne === item && styles.selectedModelItem
                  ]}
                  onPress={() => selectionnerModele(item)}
                >
                  <Text style={styles.modelItemText}>{item}</Text>
                  {modeleSelectionne === item && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Modal, TextInput } from "react-native";

import styles from "./styles/controlChat.styles";
import { ParametresInfos } from "@/types/dataTypes";

import Slider from '@react-native-community/slider';

// L'interface ParametresProps
interface ParametresProps {
  onClose?: () => void;
  parametres?: ParametresInfos;
  onSaveParametres?: (parametres: ParametresInfos) => void;
}

/**
 * Composant qui affiche les paramètres du chat.
 * @param {ParametresProps} props - Les props du composant.
 * @returns {JSX.Element} - L'élément JSX représentant les paramètres du chat.
 */
export default function EcranControleChat({ onClose, parametres = {}, onSaveParametres }: ParametresProps) {
  const [temperature, setTemperature] = useState(parametres.temperature? parametres.temperature : 0.7);
  const [showSystemPromptModal, setShowSystemPromptModal] = useState(false);
  const [showMaxTokensModal, setShowMaxTokensModal] = useState(false);
  const [showStopSequenceModal, setShowStopSequenceModal] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(parametres.system? parametres.system : "");
  const [maxTokens, setMaxTokens] = useState(parametres.max_tokens? parametres.max_tokens?.toString() : "2048");
  const [stopSequence, setStopSequence] = useState(parametres.stop? parametres.stop?.[0] : "");

  // Mise à jour de l'état local lorsque les props changent
  useEffect(() => {
    setTemperature(parametres.temperature? parametres.temperature : 0.7);
    setSystemPrompt(parametres.system? parametres.system : "");
    setMaxTokens(parametres.max_tokens? parametres.max_tokens?.toString() : "1048");
    setStopSequence(parametres.stop? parametres.stop?.[0] : "");
  }, [parametres]);

  /**
   * Fonction pour réinitialiser les paramètres
   * @returns {void}
   */
  const resetParameters = () => {
    setTemperature(0.7);
    setSystemPrompt("");
    setMaxTokens("1048");
    setStopSequence("");
    
    if (onSaveParametres) {
      onSaveParametres({
        system: "",
        temperature: 0.7,
        stop: undefined,
        max_tokens: 1048,
      });
    }
  };

  /**
   * Fonction pour sauvegarder Prompt systeme
   * @returns {void}
   */
  const handleSaveSystemPrompt = () => {
    setShowSystemPromptModal(false);
    if (onSaveParametres) {
      onSaveParametres({
        ...parametres,
        system: systemPrompt,
      });
    }
  };

  /**
   * Fonction pour sauvegarder Nb max de tokens
   * @returns {void}
   */
  const handleSaveMaxTokens = () => {
    setShowMaxTokensModal(false);
    if (onSaveParametres) {
      onSaveParametres({
        ...parametres,
        max_tokens: parseInt(maxTokens) || 2048,
      });
    }
  };

  /**
   * Fonction pour sauvegarder Sequence d'arret
   * @returns {void}
   */
  const handleSaveStopSequence = () => {
    setShowStopSequenceModal(false);
    if (onSaveParametres) {
      onSaveParametres({
        ...parametres,
        stop: stopSequence ? [stopSequence] : undefined,
      });
    }
  };

  /**
   * Fonction pour appliquer le changement de valeur de température
   * @param {number} value La nouvelle valeur de la température
   */
  const handleTemperatureChange = (value: number) => {
    setTemperature(value);
    if (onSaveParametres) {
      onSaveParametres({
        ...parametres,
        temperature: value,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatControlsCard}>
        <Text style={styles.cardTitle}>Contrôles du chat</Text>
        
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Prompt système</Text>
          <TouchableOpacity onPress={() => setShowSystemPromptModal(true)}>
            <Text style={styles.modifyButton}>Modifier</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Nb max de tokens</Text>
          <TouchableOpacity onPress={() => setShowMaxTokensModal(true)}>
            <Text style={styles.modifyButton}>Modifier</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Séquence d'arrêt</Text>
          <TouchableOpacity onPress={() => setShowStopSequenceModal(true)}>
            <Text style={styles.modifyButton}>Modifier</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Température</Text>
        </View>
        
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={2}
            step={0.1}
            value={temperature}
            onValueChange={handleTemperatureChange}
            minimumTrackTintColor="#4a80f5"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#4a80f5"
          />
          <Text style={styles.temperatureValue}>{temperature.toFixed(1)}</Text>
        </View>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetParameters}>
          <Text style={styles.resetButtonText}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour Prompt systeme */}
      <Modal
        visible={showSystemPromptModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Prompt système</Text>
            <TextInput
              style={styles.textInput}
              multiline
              value={systemPrompt}
              onChangeText={setSystemPrompt}
              placeholder="Entrez le prompt système..."
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => setShowSystemPromptModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveSystemPrompt}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal pour Max Tokens */}
      <Modal
        visible={showMaxTokensModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nombre max de tokens</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={maxTokens}
              onChangeText={setMaxTokens}
              placeholder="Entrez le nombre max de tokens..."
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => setShowMaxTokensModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveMaxTokens}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal pour Sequence arret */}
      <Modal
        visible={showStopSequenceModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Séquence d'arrêt</Text>
            <TextInput
              style={styles.textInput}
              value={stopSequence}
              onChangeText={setStopSequence}
              placeholder="Entrez la séquence d'arrêt..."
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => setShowStopSequenceModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveStopSequence}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


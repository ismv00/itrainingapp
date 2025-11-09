import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { useState } from 'react';

type ExerciseDetailModalProps = NativeStackScreenProps<
  RootStackParamList,
  'ExerciseDetailModal'
>;
type ExerciseDetailModalRouteProp = RouteProp<
  RootStackParamList,
  'ExerciseDetailModal'
>;

export default function ExerciseDetailModal() {
  const navigation = useNavigation<ExerciseDetailModalProps['navigation']>();
  const route = useRoute<ExerciseDetailModalRouteProp>();

  //Recebe o nome do exercicio e a funcao de callback
  const { exerciseName, onSave } = route.params;

  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10-12');
  const [initialWeight, setInitialWeight] = useState('');
  const [finalWeight, setFinalWeight] = useState('');

  const handleSave = () => {
    Keyboard.dismiss();

    if (!sets || reps) {
      Alert.alert('Ops!', 'Preencha Séries e Repetições');
      return;
    }

    // Chama o callback na tela anterior (NewWorkoutScreen) com os dados
    onSave({
      sets: Number(sets),
      reps: reps.trim(),
      initialWeight: Number(initialWeight) || 0,
      finalWeight: Number(finalWeight) || 0,
    });

    //Fecha o modal
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Configurar {exerciseName}</Text>

        <TextInput
          placeholder="Series (ex: 3)"
          placeholderTextColor="aaa"
          style={globalStyles.input}
          keyboardType="numeric"
          value={sets}
          onChangeText={setSets}
        />

        <TextInput
          placeholder="Repetições (ex: 10-12)"
          placeholderTextColor="aaa"
          style={globalStyles.input}
          keyboardType="default"
          value={reps}
          onChangeText={setReps}
        />

        <TextInput
          placeholder="Peso Inicial (opcional)"
          placeholderTextColor="aaa"
          style={globalStyles.input}
          keyboardType="numeric"
          value={initialWeight}
          onChangeText={setInitialWeight}
        />

        <TextInput
          placeholder="Peso Final (opcional)"
          placeholderTextColor="aaa"
          style={globalStyles.input}
          keyboardType="numeric"
          value={finalWeight}
          onChangeText={setFinalWeight}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={!sets || !reps}
          >
            <Text style={globalStyles.primaryButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // fundo escuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '90%',
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 20,
    //ajuste o padding inferior para o teclado IOS
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#3a3a3a',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    ...globalStyles.primaryButton, // usa estilos globais para o botao principal
    flex: 1,
    margin: 0, // zera margem para ajuste no layout
  },
});

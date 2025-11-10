import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { globalStyles } from '../../styles/globalStyles';
import { colors } from '../../styles/colors';
import { auth } from '../../services/firebaseConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NewWorkoutHeaderNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewWorkoutHeader'
>;

const DAYS_OF_WEEK = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

export default function NewWorkoutHeaderScreen() {
  const navigation = useNavigation<NewWorkoutHeaderNavigationProp>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const insets = useSafeAreaInsets();

  //Verificar se o usuário está logado
  if (!auth.currentUser) {
    //Direciona para o login caso nao esteja autenticado
    navigation.replace('Login');
    return <View style={globalStyles.container} />;
  }

  const toggleDay = (day: string) => {
    setSelectedDays((prevDays) => {
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      } else {
        return [...prevDays, day].sort(
          (a, b) => DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b)
        );
      }
    });
  };

  const handleNextStep = () => {
    if (name.trim().length < 3) {
      Alert.alert(
        'Atenção',
        'O nome do treino deve ter pelo menos 3 caracteres.'
      );
      return;
    }
    if (description.trim().length < 5) {
      Alert.alert('Atenção', 'A descrição do treino é muito curta.');
      return;
    }
    if (selectedDays.length === 0) {
      Alert.alert(
        'Atenção',
        'Selecione pelo menos um dia da semana para o treino.'
      );
      return;
    }

    navigation.navigate('NewWorkout', {
      name: name.trim(),
      description: description.trim(),
      days: selectedDays,
    });
  };

  const isContinuedDisable =
    !name.trim() || selectedDays.length === 0 || !description.trim();

  return (
    <View style={styles.mainWrapper}>
      <ScrollView
        contentContainerStyle={[
          styles.scroolContent,
          { paddingTop: insets.top + (Platform.OS === 'android' ? 20 : 0) },
        ]}
      >
        <Text style={styles.title}>Novo treino</Text>
        <Text style={styles.subtitle}>Defina o cabeçalho do seu treino.</Text>

        <Text style={styles.label}>Nome do treino</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Treino de força"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          maxLength={50}
        />

        <Text style={styles.label}>Descrição (Foco)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex: Foco em hipertrofia do peitoral e tríceps."
          placeholderTextColor="#666"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={3}
          maxLength={150}
        />

        <Text style={styles.label}>Dias da semana</Text>
        <View style={styles.daysContainer}>
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  isSelected
                    ? styles.dayButtonSelected
                    : styles.dayButtonUnselected,
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    isSelected
                      ? styles.dayButtonTextSelected
                      : styles.dayButtonTextUnselected,
                  ]}
                >
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          globalStyles.primaryButton,
          styles.fixedButton,
          isContinuedDisable && styles.disabledButton,
        ]}
        onPress={handleNextStep}
        disabled={isContinuedDisable}
      >
        <Text style={globalStyles.primaryButtonText}>
          Próximo: Adicionar Exercicios
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  scroolContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  fixedButton: {
    marginBottom: 10,
    marginTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  title: {
    ...globalStyles.title,
    marginBottom: 5,
    marginTop: 20,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    color: colors.greenText,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#333',
    color: colors.text,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  daysContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dayButton: {
    width: '13%', // Aproximadamente 1/7 da largura
    aspectRatio: 1, // Quadrado
    borderRadius: 8,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  dayButtonUnselected: {
    backgroundColor: '#333',
    borderColor: '#444',
  },
  dayButtonSelected: {
    backgroundColor: colors.greenText,
    borderColor: colors.greenText,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayButtonTextUnselected: {
    color: colors.text,
  },
  dayButtonTextSelected: {
    color: colors.blackText,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

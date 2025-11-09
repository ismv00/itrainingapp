import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { globalStyles } from '../../styles/globalStyles';
import { colors } from '../../styles/colors';
import { EXERCISE_DATA, MuscleGroup, Exercise } from '../../data/exerciseData';

import { auth, db } from '../../services/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

type NewWorkoutRouteProp = RouteProp<RootStackParamList, 'NewWorkout'>;
type NewWorkoutNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewWorkout'
>;

interface UserExercise extends Exercise {
  sets: number;
  reps: string;
  initialWeight: number;
  finalWeight: number;
}

export default function NewWorkoutScreen() {
  const navigation = useNavigation<NewWorkoutNavigationProp>();
  const route = useRoute<NewWorkoutRouteProp>();

  //Dados da cabeçalho
  const { name, days } = route.params;

  // Estados
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<UserExercise[]>(
    []
  );

  //Logica do Acordeao
  const toggleGroup = (groupId: string) => {
    setExpandedGroup(groupId === expandedGroup ? null : groupId);
  };

  //Funcao que adiciona o exercicio (chama o modal)
  const handleAddExercise = (exercise: Exercise) => {
    // Abre o modal, passando os dados do exercicio e uma função de callback
    navigation.navigate('ExerciseDetailModal', {
      exerciseName: exercise.name,
      onSave: (details) => {
        const newExercise: UserExercise = {
          ...exercise,
          ...details,
        };
        setSelectedExercises((prev) => [...prev, newExercise]);
        //Fecha o modal se necessário (o modal deve gerenciar seu próprio fechado)
      },
    });
  };

  const handleSaveWorkout = async () => {
    if (selectedExercises.length === 0) {
      Alert.alert('Ops!', 'Adicione pelo menos um exercício ao treino.');
      return;
    }

    const user = auth.currentUser as User;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
      return;
    }

    try {
      const finalWorkoutObject = {
        name: name,
        days: days,
        exercises: selectedExercises,
        userId: user.uid,
        createdAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(
        collection(db, 'users', user.uid, 'workouts'),
        finalWorkoutObject
      );

      Alert.alert('Sucesso', 'Treino salvo com sucesso!');
      navigation.navigate('Workout');
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      Alert.alert('Erro', 'Não foi possível salvar o treino. Tente novamente.');
    }
  };

  // Renderização dos Itens
  const renderExercise = (exercise: Exercise) => (
    <View key={exercise.id} style={styles.exerciseItem}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddExercise(exercise)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMuscleGroup = ({ item }: { item: MuscleGroup }) => (
    <View key={item.id} style={styles.groupContainer}>
      <TouchableOpacity
        style={styles.groupHeader}
        onPress={() => toggleGroup(item.id)}
      >
        <Text style={styles.groupTitle}>{item.name}</Text>
        <Text style={styles.groupArrow}>
          {expandedGroup === item.id ? 'v' : '>'}
        </Text>
      </TouchableOpacity>

      {expandedGroup === item.id && (
        <View style={styles.exerciseList}>
          {item.exercises.map(renderExercise)}
        </View>
      )}
    </View>
  );

  // --- Fim da renderização

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Adicionar Exercícios</Text>
      <Text style={styles.headerSubtitle}>
        Treino: {name} | Dias: {days.join(', ')}
      </Text>

      <Text style={styles.sectionTitle}>
        Adicionados: {selectedExercises.length} exercícios
      </Text>

      <FlatList
        data={EXERCISE_DATA}
        renderItem={renderMuscleGroup}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />

      <TouchableOpacity
        style={globalStyles.primaryButton}
        onPress={handleSaveWorkout}
        disabled={selectedExercises.length === 0}
      >
        <Text style={globalStyles.primaryButtonText}>
          Salvar Treino Completo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSubtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  flatList: {
    width: '100%',
    marginVertical: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  groupContainer: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
  },
  groupTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupArrow: {
    color: colors.text,
    fontSize: 18,
  },
  exerciseList: {
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2c',
  },
  exerciseName: {
    color: colors.text,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: colors.greenText,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.blackText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

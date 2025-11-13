import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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
  const { name, days } = route.params;

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<UserExercise[]>(
    []
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(groupId === expandedGroup ? null : groupId);
  };

  const handleAddExercise = (exercise: Exercise) => {
    navigation.navigate('ExerciseDetailModal', {
      exerciseName: exercise.name,
      onSave: (details) => {
        const newExercise: UserExercise = { ...exercise, ...details };
        setSelectedExercises((prev) => [...prev, newExercise]);
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
        name,
        days,
        exercises: selectedExercises,
        userId: user.uid,
        createdAt: Timestamp.fromDate(new Date()),
      };

      await addDoc(
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
        <Ionicons
          name={expandedGroup === item.id ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.text}
        />
      </TouchableOpacity>

      {expandedGroup === item.id && (
        <View style={styles.exerciseList}>
          {item.exercises.map(renderExercise)}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, { paddingTop: 0 }]}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Adicionar Exercícios</Text>
          <Text style={styles.headerSubtitle}>
            Treino: {name} | Dias: {days.join(', ')}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Adicionados: {selectedExercises.length} exercícios
        </Text>

        <FlatList
          data={EXERCISE_DATA}
          renderItem={renderMuscleGroup}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <TouchableOpacity
          style={[
            globalStyles.primaryButton,
            { opacity: selectedExercises.length === 0 ? 0.7 : 1 },
          ]}
          onPress={handleSaveWorkout}
          disabled={selectedExercises.length === 0}
        >
          <Text style={globalStyles.primaryButtonText}>
            Salvar Treino Completo
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 15,
  },
  headerSubtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
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
  exerciseList: {
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 15,
    paddingVertical: 5,
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

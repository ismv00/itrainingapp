import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

type WorkoutDetailRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;
type WorkoutDetailNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'WorkoutDetail'
>;

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  initialWeight: number;
  finalWeight: number;
}

export default function WorkoutDetailScreen() {
  const navigation = useNavigation<WorkoutDetailNavProp>();
  const route = useRoute<WorkoutDetailRouteProp>();
  const { workoutId, userId } = route.params;

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const workoutRef = doc(db, 'users', userId, 'workouts', workoutId);
        const workoutSnap = await getDoc(workoutRef);

        if (workoutSnap.exists()) {
          setWorkout(workoutSnap.data());
        } else {
          Alert.alert('Erro', 'Treino não encontrado.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Erro ao buscar treino: ', error);
        Alert.alert('Erro', 'Não foi possível carregar o treino.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [workoutId]);

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <ActivityIndicator size="large" color={colors.greenText} />
      </SafeAreaView>
    );
  }
  if (!workout) return null;

  const renderExercise = ({ item }: { item: Exercise }) => (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.exerciseDetail}>
        {item.sets}x {item.reps} | {item.initialWeight}kg →{item.finalWeight}kg
      </Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.safeContainer}>
      <FlatList
        data={workout.exercises || []}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderExercise}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{workout.name}</Text>
            <Text style={styles.subtitle}>
              Dias: {workout.days?.join(', ')}
            </Text>
          </>
        }
        contentContainerStyle={styles.contentContainer}
      />

      <TouchableOpacity
        style={globalStyles.primaryButton}
        onPress={() =>
          navigation.navigate('NewWorkout', {
            name: workout.name,
            description: workout.description,
            days: workout.days,
          })
        }
      >
        <Text style={globalStyles.primaryButtonText}>Editar treino</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  exerciseCard: {
    backgroundColor: '#2c2c2c',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDetail: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
});

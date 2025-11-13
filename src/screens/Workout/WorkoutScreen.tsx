import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import UserProfileHeader from '../../components/UserProfileHeader';
import { auth, db } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

type WorkoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Workout'
>;

interface Workout {
  id: string;
  name: string;
  description: string;
  days: string[];
}

const dummyWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Treino A',
    description: 'Treino de peito',
    days: ['Segunda', 'Quinta'],
  },
  {
    id: '2',
    name: 'Treino B',
    description: 'Treino de pernas',
    days: ['Terça', 'Sexta'],
  },
  {
    id: '3',
    name: 'Treino C',
    description: 'Treimo de costas',
    days: ['Quarta', 'Sábado'],
  },
];

export default function WorkoutScreen() {
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
  // const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser); //Atualiza o estado do usuário

      if (!authUser) {
        setLoading(false);
        navigation.replace('Login');
        return;
      }
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData({
            name: authUser.displayName,
            email: authUser.email,
            photoURL: authUser.photoURL,
          });
        }
        setLoading(false);
      };
      fetchUserData();
    });

    return () => unsubscribe();
  }, [navigation]);

  // ==== LOGOUT ====
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro ao sair: ', error);
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  if (loading || !userData) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color={colors.greenText} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() =>
        navigation.navigate('NewWorkout', {
          name: item.name,
          description: item.description,
          days: item.days,
        })
      }
    >
      <View>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutDescription}>{item.description}</Text>
      </View>

      <Text style={styles.arrowIcon}>&gt;</Text>
    </TouchableOpacity>
  );

  const handleCreateNewWorkout = () => {
    navigation.navigate('NewWorkoutHeader');
  };
  return (
    <View style={globalStyles.container}>
      <View style={styles.headerRow}>
        <UserProfileHeader user={user!} userData={userData} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color={colors.blackText} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateNewWorkout}
      >
        <Text style={styles.createButtonText}>Criar novo</Text>
      </TouchableOpacity>

      <FlatList
        data={dummyWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  logoutButton: {
    padding: 6,
    backgroundColor: colors.greenText,
    borderRadius: 50,
  },

  list: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
  },

  workoutCard: {
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  workoutName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutDescription: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  arrowIcon: {
    color: '#aaa',
    fontSize: 20,
  },
  createButton: {
    backgroundColor: colors.greenText,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'stretch',
    marginHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: colors.blackText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

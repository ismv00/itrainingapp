import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, db } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

export default function WorkoutScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fecthUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('Nenhum dado encontrado para esse usuário');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fecthUserData();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
  if (!userData) {
    return (
      <View>
        <Text>Não foi possível carregar os dados do usuário.</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {userData.photoURL ? (
        <Image
          source={{ uri: userData.photoURL }}
          style={styles.profileImage}
        />
      ) : (
        <View style={styles.placeHolder}>
          <Text style={styles.placeHolderText}>Sem foto</Text>
        </View>
      )}

      <Text style={styles.nameText}>{userData.name}</Text>
      <Text style={styles.emailText}>{userData.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#aaa',
    fontSize: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeHolder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2c2c2c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeHolderText: {
    color: '#aaa',
  },
  nameText: {
    fontSize: 22,
    color: colors.text,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    color: '#aaa',
  },
});

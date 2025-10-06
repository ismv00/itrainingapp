import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  RootStackNavigationProp,
  RootStackParamList,
} from '../../navigation/AppNavigator';
import { colors } from '../../styles/colors';

import { auth, db, storage } from '../../services/firebaseConfig';

//Firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleImageChange = async () => {
    // Solicitar permissão para upload de fotos.
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permissão negada.',
        'Você precisa permitir acesso as fotos.'
      );
      return;
    }

    // abre a galeria de fotos.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!profileImage) {
      Alert.alert('Ops!', 'Selecione uma foto antes de salvar.');
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Erro.', 'Nenhum usuário autenticado.');
        return;
      }

      //upload da foto para o FIRESTORE.
      const response = await fetch(profileImage);
      const blob = await response.blob();

      const storageRef = ref(storage, `profiles/${user.uid}.jpg`);

      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      //Atualiza a URL da foto no FIRESTORE
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: downloadUrl,
      });

      Alert.alert('Sucesso!', 'Foto do perfil salva.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Workout');
          },
        },
      ]);

      navigation.navigate('Workout');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça upload da sua melhor foto aqui.</Text>
      <Text style={styles.subtitle}>
        Escolha uma foto para sua como foto do Perfil
      </Text>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeHolder}>
              <Text style={styles.placeHolderText}>Adicionar Foto.</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={handleImageChange}
        >
          <Image
            source={require('../../assets/camera.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </View>
      {/* ==== Botao de salvar a foto. ==== */}
      <TouchableOpacity style={styles.loginButton} onPress={handleSave}>
        <Text style={styles.loginText}>Salvar Foto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 6,
  },
  loginButton: {
    backgroundColor: colors.greenText,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: colors.blackText,
    fontSize: 16,
  },
  profileContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },

  profileImageContainer: {
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeHolder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeHolderText: {
    color: '#4b5563',
    fontSize: 18,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 50,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#a3e635',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  cameraIcon: {
    width: 24,
    height: 24,
  },
});

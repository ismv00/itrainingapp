import React, { useState } from 'react';
import { auth, db } from '../../services/firebaseConfig';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import LogoWrapper from '../../components/LogoWrapper';

//Integracao com Firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  /** ==== States ==== */
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Ops!', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      // Cria o usuário no firebase auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      //Atualiza o displayName do usuárioo
      await updateProfile(user, { displayName: name });

      // Cria um document no Firestore parar o usuário(sem a foto.)
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        photoURL: null,
        createdAt: new Date(),
      });

      navigation.navigate('About');
    } catch (error: any) {
      console.error(error);
      let message = 'Não foi possível criar a conta.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está em uso';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido';
      } else if (error.code === 'auth/weak-password') {
        message = 'Senha muito fraca.';
      }
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingWrapper>
      <View style={globalStyles.container}>
        <LogoWrapper />
        <Text style={globalStyles.title}>Seja bem vindo!</Text>
        <Text style={globalStyles.subtitle}>
          Use suas credencias abaixo para criar sua conta.
        </Text>
        <TextInput
          placeholder="Seu nome"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="default"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#aaa"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        ==== Botão de criar conta ====
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={globalStyles.primaryButtonText}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Text>
        </TouchableOpacity>
        ==== Rodapé ====
        <View style={styles.footer}>
          <Text style={styles.footerText}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Faça Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    marginBottom: 14,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: colors.text,
    fontSize: 14,
    marginRight: 10,
  },
  footerLink: {
    color: colors.greenText,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

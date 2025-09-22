import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import LogoWrapper from '../../components/LogoWrapper';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;
export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ===== LOGIN EMAIL/SENHA ====
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth!, email, password);
      navigation.navigate('Profile');
    } catch (error: any) {
      console.error(error);
      let message = 'Não foi possível realizar o login';
      if (error.code === 'auth/invalid-credential') {
        message = 'e-mail ou senha incorretos, tente novamente.';
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
        <Text style={globalStyles.title}>Seja bem-vindo de volta!</Text>
        <Text style={globalStyles.subtitle}>
          Use suas credencias e faça login com sua conta.
        </Text>
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
        --- ==== Botão de esqueceu sua senha ====
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
        --- ==== Botao de Login ====
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={globalStyles.primaryButtonText}>
            {loading ? 'Entrando' : 'Entrar'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.divider}>Ou faça login com</Text>
        ==== botão de logar com o Google ====
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require('../../assets/googleLogo.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Continue com Google</Text>
        </TouchableOpacity>
        ==== Botão de Cadastre-se ====
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não possui uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Cadastre-se</Text>
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
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: colors.greenText,
    fontSize: 13,
  },
  divider: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },

  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: colors.greenText,
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  googleText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: 'bold',
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

import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  Keyboard,
  StyleSheet,
} from 'react-native';

import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import { User } from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import LogoWrapper from '../../components/LogoWrapper';

type WeightScreenRouteProp = RouteProp<RootStackParamList, 'Weight'>;

type WeightScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Weight'
>;

export default function WeightScreen() {
  const navigation = useNavigation<WeightScreenNavigationProp>();
  const route = useRoute<WeightScreenRouteProp>();

  const { gender, age, height } = route.params;

  const [weight, setWeight] = useState('');

  const handleCompleteRegistration = async () => {
    Keyboard.dismiss();

    if (!weight) {
      Alert.alert('Ops!', 'Você não informou um peso.');
      return;
    }

    const user = auth.currentUser as User;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        gender: gender,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        onboardingComplete: true,
      });

      Alert.alert('Sucesso', 'Seu perfil foi configurado.');
      navigation.navigate('Workout');
    } catch (error) {
      console.error('Erro ao salvar dados de onboarding:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
    }
  };

  const isContinuedDisable = weight === '';

  return (
    <KeyboardAvoidingWrapper>
      <View style={globalStyles.container}>
        <LogoWrapper />
        <Text style={globalStyles.title}>Qual o seu peso atual?</Text>
        <Text style={globalStyles.subtitle}>
          Peso em KGs. Não se preocupe, você poderá alterar sempre que quiser.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu peso. (Ex.: 65)"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TouchableOpacity
          style={[
            globalStyles.primaryButton,
            isContinuedDisable && styles.disableButton,
          ]}
          onPress={handleCompleteRegistration}
          disabled={isContinuedDisable}
        >
          <Text style={globalStyles.primaryButtonText}>Finalizar Cadastro</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 14,
    fontSize: 20,
    color: colors.text,
    width: '100%',
    textAlign: 'center',
    marginBottom: 20,
  },

  disableButton: {
    backgroundColor: '#3a3a3a',
  },
});

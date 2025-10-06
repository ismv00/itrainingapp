import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import { colors } from '../../styles/colors';
import {
  useNavigation,
  useRoute,
  RouteProp,
  Route,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { globalStyles } from '../../styles/globalStyles';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import LogoWrapper from '../../components/LogoWrapper';

type AgeScreenRouteProp = RouteProp<RootStackParamList, 'Age'>;
type AgeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Age'
>;

export default function AgeScreen() {
  const navigation = useNavigation<AgeScreenNavigationProp>();
  const route = useRoute<AgeScreenRouteProp>();
  const { gender } = route.params;

  const [age, setAge] = useState('');

  const handleContinue = () => {
    Keyboard.dismiss();
    if (!age) {
      Alert.alert('Ops!', 'Por favor, informe sua idade.');
      return;
    }

    navigation.navigate('Height', { gender, age });
  };

  const isContinuedDisable = age === '';

  return (
    <KeyboardAvoidingWrapper>
      <View style={globalStyles.container}>
        <LogoWrapper />
        <Text style={globalStyles.title}>Quantos anos você tem?</Text>
        <Text style={globalStyles.subtitle}>
          Essa informação nos ajuda a personalizar seu plano de treino.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite a sua idade."
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <TouchableOpacity
          style={[
            globalStyles.primaryButton,
            isContinuedDisable && styles.disableButton,
          ]}
          onPress={handleContinue}
          disabled={isContinuedDisable}
        >
          <Text style={globalStyles.primaryButtonText}>Continue</Text>
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

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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import LogoWrapper from '../../components/LogoWrapper';

type WeightScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Weight'
>;

export default function WeightScreen() {
  const navigation = useNavigation<WeightScreenNavigationProp>();
  const [weight, setWeight] = useState('');

  const handleContinue = () => {
    if (!weight) {
      Alert.alert('Ops!', 'Você não informou um peso.');
      return;
    }

    console.log('Peso informado', weight);

    navigation.navigate('Profile');
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

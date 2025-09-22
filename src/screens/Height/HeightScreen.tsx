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

type HeightScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Height'
>;

export default function HeightScreen() {
  const navigation = useNavigation<HeightScreenNavigationProp>();

  const [height, setHeight] = useState('');

  const handleContinue = () => {
    if (!height) {
      Alert.alert('Ops!', 'Por favor, informe sua altura.');
      return;
    }

    console.log('Altura informada.', height);

    navigation.navigate('Weight');
  };

  const isContinuedDisable = height === '';
  return (
    <KeyboardAvoidingWrapper>
      <View style={globalStyles.container}>
        <LogoWrapper />
        <Text style={globalStyles.title}>Qual a sua altura?</Text>
        <Text style={globalStyles.subtitle}>
          Altura em cm. Não se preocupe, você poderá alterar sempre que quiser.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua altura. (Ex.: 180)"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
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

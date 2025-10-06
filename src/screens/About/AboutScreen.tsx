import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type AboutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'About'
>;

export default function AboutScreen() {
  const navigation = useNavigation<AboutScreenNavigationProp>();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleGenderSelection = (gender: 'man' | 'woman' | 'noGender') => {
    setSelectedGender(gender);
  };

  const handleContinue = () => {
    if (!selectedGender) return;

    navigation.navigate('Age', { gender: selectedGender });
  };

  const isContinuedDisable = selectedGender === null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fale mais sobre você</Text>
      <Text style={styles.subtitle}>
        Para lhe proporcionar uma melhor experiência precisamos saber algumas
        informações
      </Text>

      <View style={styles.optionsContainer}>
        ==== Escolhe de genero
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'man' && styles.selectedButton,
          ]}
          onPress={() => handleGenderSelection('man')}
        >
          <Image
            source={require('../../assets/man.png')}
            style={styles.genderImage}
            resizeMode="contain"
          />
          <Text style={styles.genderText}>Homem</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'woman' && styles.selectedButton,
          ]}
          onPress={() => handleGenderSelection('woman')}
        >
          <Image
            source={require('../../assets/woman.png')}
            style={styles.genderImage}
            resizeMode="contain"
          />
          <Text style={styles.genderText}>Mulher</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'noGender' && styles.selectedButton,
          ]}
          onPress={() => handleGenderSelection('noGender')}
        >
          <Image
            source={require('../../assets/noGender.png')}
            style={styles.genderImage}
            resizeMode="contain"
          />
          <Text style={styles.genderText}>Não quero informar</Text>
        </TouchableOpacity>
        ==== botao de continuar
        <TouchableOpacity
          style={[
            styles.continueButton,
            isContinuedDisable && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={isContinuedDisable}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    width: '80%',
    marginBottom: 30,
  },

  genderButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedButton: {
    borderColor: colors.greenText,
  },
  genderImage: {
    width: 60,
    height: 80,
    marginBottom: 10,
  },

  genderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: colors.greenText,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: {
    color: colors.blackText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#3a3a3a',
  },
});

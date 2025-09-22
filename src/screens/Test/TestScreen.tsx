import { Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Test'
>;

export default function TestScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 20 }}>
        🚀 iTraining Funcionando!!
      </Text>
    </View>
  );
}

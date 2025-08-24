import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { Image, Pressable, Text, View, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();

  // Troque pelo seu Ad Unit ID real em produção!
 const { isLoaded, isClosed, load, show } = useInterstitialAd(
  TestIds.INTERSTITIAL, // <-- ANÚNCIO DE TESTE!
  { requestNonPersonalizedAdsOnly: true }
);

  // Carrega o anúncio assim que o componente monta
  useEffect(() => {
    load();
  }, [load]);

  // Mostra o anúncio ao pressionar o botão
  async function handleVerQR() {
    if (isLoaded) {
      show();
    } else {
      navigation.navigate('QRCode');
    }
  }

  // Quando o anúncio for fechado, navega para a tela QR
  useEffect(() => {
    if (isClosed) {
      navigation.navigate('QRCode');
      load(); // recarrega para o próximo uso
    }
  }, [isClosed]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleVerQR}
      >
        <Text style={styles.buttonText}>VER QR</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.buttonText}>EDITAR DADOS</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('About')}
      >
        <Text style={styles.buttonText}>SOBRE</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonPressed: {
    backgroundColor: '#357ABD',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
});

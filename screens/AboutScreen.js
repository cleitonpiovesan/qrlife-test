import { Linking, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o QR Life ❤️</Text>

      <Text style={styles.text}>
        Este aplicativo foi criado para ajudar em situações de emergência.
        Ele permite gerar um QR Code contendo informações médicas importantes como
        tipo sanguíneo, alergias, doenças, medicamentos e contatos de emergência.
      </Text>

      <Text style={styles.text}>
        O QR pode ser impresso e colocado em pulseiras, colares ou chaveiros.
        Assim, qualquer pessoa pode acessar seus dados médicos rapidamente.
      </Text>

  <Text style={styles.footer}>
  Desenvolvido por Cleiton Piovesan — {new Date().getFullYear()} | Versão 1.2
</Text>

      <Text
        style={styles.link}
        onPress={() => Linking.openURL('https://www.instagram.com/cleitonpiovesan/')}>
        Instagram
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
    textAlign: 'justify',
  },
  footer: {
    marginTop: 30,
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
  },
  link: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#2a6fd9',
    textDecorationLine: 'underline',
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRCodeScreen() {
  const [dados, setDados] = useState(null);
  const [uploading, setUploading] = useState(false);
  const qrRef = useRef();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const saved = await AsyncStorage.getItem('dadosMedicos');
      if (saved) setDados(JSON.parse(saved));
      else Alert.alert('Atenção', 'Nenhum dado encontrado. Preencha seus dados primeiro.');
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      Alert.alert('Erro', 'Falha ao carregar os dados.');
    }
  }

  const textoLegivel = dados
    ? `
Nome: ${dados.nome}
Data de Nascimento: ${dados.dataNascimento || 'Não informado'}
Tipo Sanguíneo: ${dados.tipoSanguineo}
Peso: ${dados.peso || 'Não informado'} kg
Altura: ${dados.altura || 'Não informado'} cm
Convênio/Plano de Saúde: ${dados.convenio || 'Não informado'}
Alergias: ${dados.alergias || 'Nenhuma'}
Doenças Pré-existentes: ${dados.doencas || 'Nenhuma'}
Medicações: ${dados.medicacoes || 'Nenhuma'}
Contato Emergência 1: ${dados.contatoEmergencia1 || 'Não informado'}
Contato Emergência 2: ${dados.contatoEmergencia2 || 'Não informado'}
Contato Médico de Confiança - Nome: ${dados.contatoMedicoNome || 'Não informado'}
Contato Médico de Confiança - Telefone: ${dados.contatoMedicoTelefone || 'Não informado'}
Observações Gerais: ${dados.observacoes || 'Nenhuma'}
    `.trim()
    : '';

  async function sharePDF() {
    if (!qrRef.current) {
      Alert.alert('Erro', 'QR Code não está pronto para captura.');
      return;
    }

    setUploading(true);
    try {
      qrRef.current.toDataURL(async (base64) => {
        // Monta HTML para o PDF
        const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="text-align:center;">QR Code Médico de Emergência</h2>
          <div style="display: flex; flex-direction: row; align-items: flex-start; justify-content:center; margin-bottom:20px;">
            <img src="data:image/png;base64,${base64}" width="180" height="180" style="border:1px solid #ddd; margin-right: 24px;"/>
            <div style="font-size: 14px; line-height:1.7;">
              <pre style="font-family: inherit; margin:0;">${textoLegivel}</pre>
            </div>
          </div>
          <div style="text-align: center; font-size: 12px; color:#888; margin-top:30px;">
            Gerado por QR Life • Em caso de emergência, escaneie o QR Code ou leia os dados ao lado.
          </div>
        </div>
        `;

        // Gera o PDF
        const { uri } = await Print.printToFileAsync({ html });

        // Compartilha o PDF
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      });
    } catch (e) {
      Alert.alert('Erro', 'Falha ao gerar ou compartilhar o PDF.');
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu QR Code Médico</Text>

      {dados ? (
        <>
          <QRCode
            value={textoLegivel}
            size={220}
            getRef={(c) => (qrRef.current = c)}
          />

          <TouchableOpacity
            style={[styles.shareButton, uploading && { opacity: 0.6 }]}
            onPress={sharePDF}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.shareButtonText}>Compartilhar PDF</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color="#333" />
      )}

      <Text style={styles.info}>
        Escaneie para ver os dados médicos em caso de emergência.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#444',
  },
  info: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: '#2a6fd9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

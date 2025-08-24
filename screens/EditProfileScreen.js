import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';

// Função simples para máscara de telefone brasileiro
function formatPhone(value) {
  if (!value) return '';
  let v = value.replace(/\D/g, '');
  v = v.slice(0, 11);
  if (v.length > 10) {
    return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (v.length > 5) {
    return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (v.length > 2) {
    return v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else {
    return v.replace(/^(\d*)/, '($1');
  }
}

const tiposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function EditProfileScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    tipoSanguineo: '',
    alergias: '',
    doencas: '',
    medicacoes: '',
    contatoEmergencia1: '',
    contatoEmergencia2: '',
    dataNascimento: '',
    peso: '',
    altura: '',
    convenio: '',
    observacoes: '',
    contatoMedicoNome: '',
    contatoMedicoTelefone: '',
  });

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const savedData = await AsyncStorage.getItem('dadosMedicos');
      if (savedData) {
        const data = JSON.parse(savedData);
        setForm(data);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  }

  async function saveData() {
    try {
      await AsyncStorage.setItem('dadosMedicos', JSON.stringify(form));
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
      navigation.goBack();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  }

  function onChangeContato(field, value) {
    const masked = formatPhone(value);
    setForm({ ...form, [field]: masked });
  }

  function selecionarTipo(tipo) {
    setForm({ ...form, tipoSanguineo: tipo });
    setModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
             <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={form.nome}
            onChangeText={(t) => setForm({ ...form, nome: t })}
          />

          <Text style={styles.label}>Tipo Sanguíneo</Text>
          <TouchableOpacity
            style={styles.dropdownFake}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ fontSize: 16, color: form.tipoSanguineo ? '#000' : '#888' }}>
              {form.tipoSanguineo || 'Selecione o tipo sanguíneo'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Data de Nascimento</Text>
          <MaskedTextInput
            style={styles.input}
            keyboardType="numeric"
            mask="99/99/9999"
            placeholder="DD/MM/AAAA"
            value={form.dataNascimento}
            onChangeText={(text) => setForm({ ...form, dataNascimento: text })}
          />

          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={form.peso}
            onChangeText={(t) => setForm({ ...form, peso: t })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            value={form.altura}
            onChangeText={(t) => setForm({ ...form, altura: t })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Convênio / Plano de Saúde</Text>
          <TextInput
            style={styles.input}
            value={form.convenio}
            onChangeText={(t) => setForm({ ...form, convenio: t })}
          />

          <Text style={styles.label}>Alergias</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={form.alergias}
            onChangeText={(t) => setForm({ ...form, alergias: t })}
            multiline
          />

          <Text style={styles.label}>Doenças Pré-existentes</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={form.doencas}
            onChangeText={(t) => setForm({ ...form, doencas: t })}
            multiline
          />

          <Text style={styles.label}>Medicações em Uso</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={form.medicacoes}
            onChangeText={(t) => setForm({ ...form, medicacoes: t })}
            multiline
          />

          <Text style={styles.label}>Contato de Emergência 1</Text>
          <MaskedTextInput
            style={styles.input}
            keyboardType="phone-pad"
            mask="(99) 99999-9999"
            value={form.contatoEmergencia1}
            onChangeText={(text) => onChangeContato('contatoEmergencia1', text)}
          />

          <Text style={styles.label}>Contato de Emergência 2</Text>
          <MaskedTextInput
            style={styles.input}
            keyboardType="phone-pad"
            mask="(99) 99999-9999"
            value={form.contatoEmergencia2}
            onChangeText={(text) => onChangeContato('contatoEmergencia2', text)}
          />

          <Text style={styles.label}>Contato Médico de Confiança - Nome</Text>
          <TextInput
            style={styles.input}
            value={form.contatoMedicoNome}
            onChangeText={(t) => setForm({ ...form, contatoMedicoNome: t })}
          />

          <Text style={styles.label}>Contato Médico de Confiança - Telefone</Text>
          <MaskedTextInput
            style={styles.input}
            keyboardType="phone-pad"
            mask="(99) 99999-9999"
            value={form.contatoMedicoTelefone}
            onChangeText={(text) => onChangeContato('contatoMedicoTelefone', text)}
          />

          <Text style={styles.label}>Observações Gerais</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={form.observacoes}
            onChangeText={(t) => setForm({ ...form, observacoes: t })}
            multiline
          />

          <TouchableOpacity style={styles.btnSalvar} onPress={saveData}>
            <Text style={styles.btnText}>Salvar</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione o Tipo Sanguíneo</Text>
              <FlatList
                data={tiposSanguineos}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => selecionarTipo(item)}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 100 },
  label: { marginTop: 15, marginBottom: 5, fontWeight: 'bold', fontSize: 16, color: '#444' },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  multiline: { minHeight: 60, textAlignVertical: 'top' },
  dropdownFake: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  btnSalvar: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // fundo escuro mais forte
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#222',
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: '#222',
  marginBottom: 15,
  marginTop: 40,
   textAlign: 'center',
},
  modalItemText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
});

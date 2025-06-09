import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DonationForm() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [moneda, setMoneda] = useState('USD');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const validarRol = async () => {
      const token = await AsyncStorage.getItem('auth-token');
      const rol = await AsyncStorage.getItem('rol');

      if (!token || rol !== 'usuario') {
        router.replace('/login'); // Redirige si no tiene permisos
      }
    };
    validarRol();
  }, []);

  const handleSubmit = () => {
    Alert.alert("Gracias por tu donación", `Nombre: ${nombre}\nCorreo: ${email}\nCantidad: ${cantidad} ${moneda}`);
    // Aquí puedes enviar los datos al backend
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('@/assets/images/indigena5.jpg')}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>Formulario de Donaciones</Text>
      <Text style={styles.subtitle}>Puedes contribuir con nuestra causa dejando una donación:</Text>

      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Tu nombre"
      />

      <Text style={styles.label}>Correo electrónico:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="correo@ejemplo.com"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Cantidad a donar:</Text>
      <TextInput
        style={styles.input}
        value={cantidad}
        onChangeText={setCantidad}
        placeholder="0"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Moneda:</Text>
      <Picker
        selectedValue={moneda}
        onValueChange={(itemValue) => setMoneda(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="USD" value="USD" />
        <Picker.Item label="EUR" value="EUR" />
        <Picker.Item label="COP" value="COP" />
      </Picker>

      <Text style={styles.label}>Un mensaje para CDMI:</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={mensaje}
        onChangeText={setMensaje}
        placeholder="Tu mensaje..."
        multiline
        numberOfLines={4}
      />

      <Button title="Donar" onPress={handleSubmit} color="#6c757d" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 180,
    marginBottom: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#555',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  picker: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

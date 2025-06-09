// app/catalogo.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Catalogo() {

  interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string; // 🖼️ ahora incluimos la imagen
  }

  const [productos, setProductos] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = await AsyncStorage.getItem('auth-token');
        const res = await axios.get('http://192.168.132.114:8000/api/inventarios', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(res.data);
      } catch (err) {
        console.error('Error al obtener productos:', err);
      }
    };

    fetchProductos();
  }, []);

  const agregarAlCarrito = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('auth-token');
      await axios.post(`http://192.168.132.114:8000/api/cartshop/${id}/add`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("✅ Producto agregado");
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Catálogo de Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: `http://192.168.132.114:8000/storage/${item.imagen}` }}
              style={styles.image}
            />
            <Text style={styles.name}>{item.nombre}</Text>
            <Text>{item.descripcion}</Text>
            <Text style={styles.price}>${item.precio}</Text>
            <TouchableOpacity style={styles.button} onPress={() => agregarAlCarrito(item.id)}>
              <Text style={styles.buttonText}>Agregar al carrito +</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  price: { marginTop: 5, fontWeight: 'bold' },
  button: {
    backgroundColor: '#007bff',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: { color: 'white', textAlign: 'center' },
});

{/*import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Catalogo() {

  interface Product{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
  }
  const [productos, setProductos] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try{
        const token = await AsyncStorage.getItem('auth-token');
        const res = await axios.get('http://192.168.11.3:8000/api/inventarios', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProductos(res.data);
      } catch (err) {
        console.error('Error al obtener productos:', err);
      }
    };
    
    fetchProductos();
  }, []);

  const agregarAlCarrito = async (id: number) => {
    try{
      const token = await AsyncStorage.getItem('auth-token');
      await axios.post(`http://192.168.11.3:8000/api/cartshop/${id}/add`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    Alert.alert("✅ Producto agregado")
  } catch (err){
    console.error('Error al agregar al carrito:', err);
  }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Catálogo de Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text>{item.descripcion}</Text>
            <Text style={styles.price}>${item.precio}</Text>
            <TouchableOpacity style={styles.button} onPress={() => agregarAlCarrito(item.id)}>
              <Text style={styles.buttonText}>Agregar al carrito +</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#f2f2f2', padding: 15, borderRadius: 10, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 16 },
  price: { marginTop: 5, fontWeight: 'bold' },
  button: { backgroundColor: '#007bff', marginTop: 10, padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', textAlign: 'center' },
});*/}

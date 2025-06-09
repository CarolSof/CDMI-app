import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Item = {
  id: number;
  inventario_id: number;
  quantity: number;
  price: number | null;
   inventario?: {
    precio: number;
  };
};

type Compra = {
  id: number;
  total: number;
  status: string;
  items: Item[];
};

const HistorialCompras = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCompras = async () => {
      try {

        const token = await AsyncStorage.getItem('auth-token');

         const res = await axios.get('http://192.168.132.114:8000/api/historial', {
          headers: { Authorization: `Bearer ${token}` }
        });

          setCompras(res.data);
      } catch (error) {
        console.error('Error al obtener historial:', error);
      } finally {
        setLoading(false);
      }
    };


      fetchCompras();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  if (compras.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No hay compras realizadas aún.</Text>
      </View>
    );
  }

     // En React Native esto no funciona, usamos AsyncStorage

    // En React Native se usa AsyncStorage para guardar tokens, así que:
    // Importar AsyncStorage de '@react-native-async-storage/async-storage'
    // y usar AsyncStorage.getItem('auth-token') para obtener el token.

    
        // Obtener token con AsyncStorage
        // Reemplaza localStorage.getItem por AsyncStorage

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <Text>🧾 Producto #{item.inventario_id}</Text>
      <Text>🛒 Cantidad: {item.quantity}</Text>
      <Text>💵 Precio: ${Number(item.inventario?.precio || 0).toFixed(2)}</Text>
      <Text>🔢 Subtotal: ${(Number(item.inventario?.precio || 0) * item.quantity).toFixed(2)}</Text>
    </View>
  );

  const renderCompra = ({ item }: { item: Compra }) => (
    <View style={styles.compraCard}>
      <Text style={styles.compraHeader}>Compra #{item.id}</Text>
      <Text style={styles.compraTotal}>
        💰 Total: ${Number(item.total || 0).toFixed(2)}</Text>
      <Text style={styles.compraEstado}>
        📦 Estado: <Text style={{ fontWeight: 'bold' }}>{item.status}</Text>
      </Text>
      <FlatList
        data={item.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={compras}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderCompra}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  compraCard: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  compraHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  compraTotal: {
    marginBottom: 5,
  },
  compraEstado: {
    marginBottom: 10,
  },
  item: {
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HistorialCompras;

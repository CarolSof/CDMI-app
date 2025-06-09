import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Item {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export default function CartShop() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await AsyncStorage.getItem('auth-token');
        const res = await axios.get('http://192.168.132.114:8000/api/cartshop', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(res.data.items ?? []);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
    };

    fetchCart();
  }, []);

  const eliminar = async (itemId: number) => {
    try {
      const token = await AsyncStorage.getItem('auth-token');
      await axios.delete(`http://192.168.132.114:8000/api/cartshop/${itemId}/remove`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  const cambiarCantidad = async (itemId: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    try {
      const token = await AsyncStorage.getItem('auth-token');
      await axios.put(`http://192.168.132.114:8000/api/cartshop/${itemId}/update-quantity`, {
        quantity: nuevaCantidad
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity: nuevaCantidad } : item
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const finalizarCompra = async () => {
    try {
      const token = await AsyncStorage.getItem('auth-token');
      await axios.post('http://192.168.132.114:8000/api/cartshop/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("✅ Compra finalizada");
      setItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Mi Carrito</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>Tu carrito está vacío.</Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.product_name}</Text>
                  <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
                </View>

                <View style={styles.quantity}>
                  <TouchableOpacity onPress={() => cambiarCantidad(item.id, item.quantity - 1)}>
                    <Text style={styles.btnQty}>➖</Text>
                  </TouchableOpacity>
                  <Text>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => cambiarCantidad(item.id, item.quantity + 1)}>
                    <Text style={styles.btnQty}>➕</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => eliminar(item.id)}>
                  <Text style={styles.remove}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutBtn} onPress={finalizarCompra}>
              <Text style={styles.checkoutText}>Finalizar compra</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  empty: { fontSize: 16, textAlign: 'center', marginTop: 50 },
  item: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 10 },
  info: { marginBottom: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14 },
  quantity: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  btnQty: { fontSize: 20, paddingHorizontal: 10 },
  remove: { fontSize: 18, color: 'red' },
  footer: { marginTop: 20 },
  total: { fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
  checkoutBtn: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },
  checkoutText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

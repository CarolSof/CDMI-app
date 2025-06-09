import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Ayuda = {
  id: number;
  nombre: string;
  fecha: string;
  monto: string;
  causa: string;
  lugar: string;
};

export default function AyudasUsuario() {
  const [ayudas, setAyudas] = useState<Ayuda[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ayudaSeleccionado, setAyudaSeleccionado] = useState<Ayuda | null>(null);
  const [registrandoAyudaId, setRegistrandoAyudaId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAyudas = async () => {
      try {
        const token = await AsyncStorage.getItem('auth-token');
        const res = await axios.get('http://192.168.132.114:8000/api/ayudas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAyudas(res.data);
      } catch (err) {
        console.error('Error al obtener ayudas:', err);
      } finally {
        setCargando(false);
      }
    };

    fetchAyudas();
  }, []);

  const registrarse = async (ayudaId: number) => {
    setRegistrandoAyudaId(ayudaId);

    try {
      const token = await AsyncStorage.getItem('auth-token');
      await axios.post(`http://192.168.132.114:8000/api/ayudas/${ayudaId}/registrarse`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('✅ Donaste exitosamente, mil gracias.');
    } catch (err: any) {
      if (err.response?.status === 409) {
        return Alert.alert('⚠️ Ya donaste aquí.');
      }
      if (err.response?.status === 401) {
        return Alert.alert('🔒 Debes iniciar sesión para donar.');
      }

      Alert.alert('❌ Error al realizar la donación.');
    } finally {
      setRegistrandoAyudaId(null);
    }
  };

  const renderAyuda = ({ item }: { item: Ayuda }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nombre}</Text>
      <Text>📅 Vence: {item.fecha}</Text>
      <Text>💰 Monto objetivo: {item.monto}</Text>
      <Text>🎯 Causa: {item.causa}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btnVer} onPress={() => setAyudaSeleccionado(item)}>
          <Text style={styles.btnText}>Ver más detalles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDonar}
          onPress={() => registrarse(item.id)}
          disabled={registrandoAyudaId === item.id}
        >
          <Text style={styles.btnText}>
            {registrandoAyudaId === item.id ? 'En curso...' : 'Donar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Causas para apoyar y donaciones en curso</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#000" />
      ) : ayudas.length === 0 ? (
        <Text>No hay opciones disponibles.</Text>
      ) : (
        <FlatList
          data={ayudas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAyuda}
        />
      )}

      <Modal visible={!!ayudaSeleccionado} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {ayudaSeleccionado && (
              <>
                <Text style={styles.modalTitle}>{ayudaSeleccionado.nombre}</Text>
                <Text>📅 Fecha: {ayudaSeleccionado.fecha}</Text>
                <Text>📍 Lugar: {ayudaSeleccionado.lugar}</Text>
                <Text>💰 Monto: {ayudaSeleccionado.monto}</Text>
                <Text>🎯 Causa: {ayudaSeleccionado.causa}</Text>
              </>
            )}
            <Pressable style={styles.closeBtn} onPress={() => setAyudaSeleccionado(null)}>
              <Text style={styles.closeText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnVer: { backgroundColor: '#6c757d', padding: 10, borderRadius: 5 },
  btnDonar: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  closeText: { color: '#fff', textAlign: 'center' },
});

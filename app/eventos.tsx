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

type Evento = {
  id: number;
  nombre: string;
  fecha: string;
  lugar: string;
};

export default function EventosUsuario() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [registrandoEventoId, setRegistrandoEventoId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = await AsyncStorage.getItem('auth-token');
        const res = await axios.get('http://192.168.132.114:8000/api/eventos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEventos(res.data);
      } catch (err) {
        console.error('Error al obtener eventos:', err);
      } finally {
        setCargando(false);
      }
    };

    fetchEventos();
  }, []);

  const registrarse = async (eventoId: number) => {
    setRegistrandoEventoId(eventoId);

    try {
      const token = await AsyncStorage.getItem('auth-token');
      await axios.post(`http://192.168.132.114:8000/api/eventos/${eventoId}/registrarse`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('✅ Te registraste exitosamente al evento.');
    } catch (err: any) {
      if (err.response?.status === 409) {
        return Alert.alert('⚠️ Ya estás registrado en este evento.');
      }
      if (err.response?.status === 401) {
        return Alert.alert('🔒 Debes iniciar sesión para registrarte.');
      }

      Alert.alert('❌ Error al registrarte.');
    } finally {
      setRegistrandoEventoId(null);
    }
  };

  const renderEvento = ({ item }: { item: Evento }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nombre}</Text>
      <Text>📅 Fecha: {item.fecha}</Text>
      <Text>📍 Lugar: {item.lugar}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btnVer} onPress={() => setEventoSeleccionado(item)}>
          <Text style={styles.btnText}>Ver más detalles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDonar}
          onPress={() => registrarse(item.id)}
          disabled={registrandoEventoId === item.id}
        >
          <Text style={styles.btnText}>
            {registrandoEventoId === item.id ? 'Registrando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Disponibles</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#000" />
      ) : eventos.length === 0 ? (
        <Text>No hay eventos disponibles.</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvento}
        />
      )}

      <Modal visible={!!eventoSeleccionado} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {eventoSeleccionado && (
              <>
                <Text style={styles.modalTitle}>{eventoSeleccionado.nombre}</Text>
                <Text>📅 Fecha: {eventoSeleccionado.fecha}</Text>
                <Text>📍 Lugar: {eventoSeleccionado.lugar}</Text>
              </>
            )}
            <Pressable style={styles.closeBtn} onPress={() => setEventoSeleccionado(null)}>
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
  btnDonar: { backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
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

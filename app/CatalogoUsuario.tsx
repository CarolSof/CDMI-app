// app/catalogo.jsx (o .tsx si usas TypeScript)
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator } from "react-native";
import axios, { AxiosError } from "axios";
import { Card, Button, Modal, Portal, Provider } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';


type Mercancia = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
};

const CatalogoUsuario = () => {
  const [mercancias, setMercancias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [automovilSeleccionado, setAutomovilSeleccionado] = useState<Mercancia | null>(null);
  const [registrando, setRegistrando] = useState(false);

  axios.defaults.baseURL = "http://192.168.132.114:8000"; // ⚠️ Usa tu IP local si pruebas en celular real
  

  // 👇 Usa SecureStore o AsyncStorage en lugar de localStorage
  useEffect(() => {
    const fetchData = async () => {
        const token = await AsyncStorage.getItem("auth-token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
      try {
        const res = await axios.get("/api/mercancias");
        setMercancias(res.data);
      } catch (error) {
        console.error("Error al obtener mercancías:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  const registrarse = async (automovilId: number) => {
    setRegistrando(true);

    try {
      await axios.post(`/api/mercancias/${automovilId}/registrarse`);
      Alert.alert("Éxito", "✅ Agregaste exitosamente, bien.");
    } catch (err: unknown) {
        const error = err as AxiosError;

      if (error.response?.status === 409) {
        return Alert.alert("Advertencia", "⚠️ Ya lo agregaste.");
      }
      if (error.response?.status === 401) {
        return Alert.alert("Inicia sesión", "🔒 Debes iniciar sesión para donar.");
      }

      Alert.alert("Error", "❌ Error al agregar.");
    } finally {
      setRegistrando(false);
    }
  };

  const renderItem = ({ item } : { item: Mercancia }) => (
    <Card style={{ marginBottom: 12, marginHorizontal: 10 }}>
      <Card.Title title={item.nombre} />
      <Card.Content>
        <Text>📍 {item.descripcion}</Text>
        <Text>💰 {typeof item.precio === 'number' ? item.precio.toFixed(2) : 'Precio no disponible' }</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => setAutomovilSeleccionado(item)}>Ver más</Button>
        <Button
          onPress={() => registrarse(item.id)}
          disabled={registrando}
          mode="contained"
          buttonColor="#7b1c1c"
          textColor="white"
        >
          {registrando ? "Registrando..." : "Comprar"}
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <Provider>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
          Opciones mercancia disponible
        </Text>

        {cargando ? (
          <ActivityIndicator size="large" />
        ) : mercancias.length === 0 ? (
          <Text style={{ textAlign: "center", color: "gray" }}>No hay opciones disponibles.</Text>
        ) : (
          <FlatList
            data={mercancias}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        <Portal>
          <Modal
            visible={!!automovilSeleccionado}
            onDismiss={() => setAutomovilSeleccionado(null)}
            contentContainerStyle={{
              backgroundColor: "white",
              padding: 20,
              margin: 20,
              borderRadius: 10,
            }}
          >
            {automovilSeleccionado && (
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {automovilSeleccionado.nombre}
                </Text>
                <Text>📍 Descripción: {automovilSeleccionado.descripcion}</Text>
                <Text>💰 Precio: {automovilSeleccionado.precio}</Text>
              </View>
            )}
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

export default CatalogoUsuario;

import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("usuario");

  const router = useRouter();

  const handleSubmit = async () => {
    try {
        console.log("Intentando conectar a: http://192.168.132.114:8000/api/login");

      const response = await fetch("http://192.168.132.114:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          correo,
          contraseña,
          rol,
        }),
      });

      const result = await response.json();
      console.log("Resultado del backend:", result);


      if (!response.ok) {
        Alert.alert("Error al iniciar sesión", result.error || "Credenciales incorrectas");
        return;
      }

      // Guardamos el token y rol
      await AsyncStorage.setItem("auth-token", result.token);
      await AsyncStorage.setItem("rol", result.rol);

      Alert.alert("Éxito", "Usuario autenticado exitosamente");

      // Redireccionamos según el rol
      if (result.rol === "administrador") {
        router.replace("/administrador"); // Asegúrate de tener esta ruta en tu app
      } else {
        router.replace("/"); // Ruta principal para usuarios
      }

    } catch (error) {
      console.error("Error de red:", error);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>

      <Text>Correo electrónico:</Text>
      <TextInput
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        style={styles.input}
        autoCapitalize="none"
      />

      <Text>Contraseña:</Text>
      <TextInput
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
        style={styles.input}
      />

      <Text>Rol:</Text>
      <Picker
        selectedValue={rol}
        onValueChange={(value) => setRol(value)}
        style={{fontFamily: "Merriweather",}}
      >
        <Picker.Item label="Usuario" value="usuario" />
        <Picker.Item label="Administrador" value="administrador" />
      </Picker>

      <Button title="Iniciar Sesión" onPress={handleSubmit} color={"#a2231d"}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Merriweather",
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  input: {
    fontFamily: "Merriweather",
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontFamily: "Merriweather",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
});

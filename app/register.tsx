import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    //fecha_nacimiento: "",
    correo: "",
    telefono: "",
    contraseña: "",
    rol: "usuario",
    clave_admin: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {

    const payload: any = { ...form };

    // 👇 Eliminar campo clave_admin si no aplica
    if (payload.rol !== "administrador") {
      delete payload.clave_admin;
    }

      const response = await fetch("http://192.168.132.114:8000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 201) {
        Alert.alert("Éxito", "Usuario creado exitosamente", [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]);
      } else if (response.status === 400 || response.status === 422) {
        let mensaje = "Error en los datos:\n";
        const errores = result.errors || {};
        for (const campo in errores) {
          mensaje += `- ${campo}: ${errores[campo].join(", ")}\n`;
        }
        Alert.alert("Datos inválidos", mensaje);
      } else {
        Alert.alert(
          "Error",
          "No se pudo crear el usuario. Inténtalo nuevamente."
        );
        console.error("Respuesta inesperada:", result);
      }
    } catch (error) {
      Alert.alert("Error de conexión", "No se pudo contactar con el servidor");
      console.error("Error del servidor:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={form.nombre}
        onChangeText={(text) => handleChange("nombre", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={form.apellido}
        onChangeText={(text) => handleChange("apellido", text)}
      />
      {/*<TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        value={form.fecha_nacimiento}
        onChangeText={(text) => handleChange("fecha_nacimiento", text)}
      />*/}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={form.correo}
        onChangeText={(text) => handleChange("correo", text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={form.telefono}
        onChangeText={(text) => handleChange("telefono", text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={form.contraseña}
        onChangeText={(text) => handleChange("contraseña", text)}
      />

      <Text style={styles.label}>Rol:</Text>
      <Picker
        selectedValue={form.rol}
        onValueChange={(itemValue) => handleChange("rol", itemValue)}
        style={[styles.picker, styles.pickerText]}
      >
        <Picker.Item label="Usuario" value="usuario" />
        <Picker.Item label="Administrador" value="administrador" />
      </Picker>

      {/* Mostrar clave solo si es administrador */}
      {form.rol === "administrador" && (
        <TextInput
          style={styles.input}
          placeholder="Clave para administrador"
          secureTextEntry
          value={form.clave_admin}
          onChangeText={(text) => handleChange("clave_admin", text)}
        />
      )}

      <View style={{backgroundColor:"#a2231d"}}>
        <Button title="Registrarse" color="#a2231d" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    fontFamily: "Merriweather",
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Merriweather",
    fontSize: 26,
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    fontFamily: "Merriweather",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  picker: {
    fontFamily: "Merriweather",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    marginBottom: 20,
  },
  pickerText: {
  fontFamily: "Merriweather",
  fontSize: 16,
  },
  label: {
    fontFamily: "Merriweather",
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    backgroundColor: "#a2231d",
    fontFamily: "Merriweather",
    marginTop: 10,
  },
});

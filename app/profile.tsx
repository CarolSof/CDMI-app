import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, Alert, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import useGetSession from "../hooks/useGetSession";

interface UserSession {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: string;
  imagen_perfil?: string;
}

interface FormDataType {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  nuevaContraseña?: string;
  imagen_perfil?: { uri: string; name: string; type: string };
}

export default function Profile() {
  const { userSession, refreshSession, loading } = useGetSession();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  });
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (userSession && !editMode) {
      setFormData({
        nombre: userSession.nombre,
        apellido: userSession.apellido,
        correo: userSession.correo,
        telefono: userSession.telefono,
      });
      setPreviewImage(userSession.imagen_perfil || null);
    }
  }, [userSession, editMode]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#666" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!userSession) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>No hay sesión activa o datos incompletos.</Text>
      </View>
    );
  }

  const user = userSession as UserSession;

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      telefono: user.telefono,
    });
    setPreviewImage(user.imagen_perfil || null);
  };

  const pickImage = async () => {
    // Pide permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitas dar permisos para acceder a las imágenes.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPreviewImage(asset.uri);
      // Para enviar archivo en React Native, crea un objeto similar a File:
      setFormData((prev) => ({
        ...prev,
        imagen_perfil: {
          uri: asset.uri,
          name: asset.fileName || "profile.jpg",
          type: asset.type || "image/jpeg",
        },
      }));
    }
  };

  const handleSave = async () => {
    if (formData.nuevaContraseña && formData.nuevaContraseña.length < 6) {
      Alert.alert("Error", "La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setSaving(true);
    try {
      const formPayload = new FormData();
      formPayload.append("nombre", formData.nombre);
      formPayload.append("apellido", formData.apellido);
      formPayload.append("correo", formData.correo);
      formPayload.append("telefono", formData.telefono);
      if (formData.nuevaContraseña) {
        formPayload.append("contraseña", formData.nuevaContraseña);
      }
      if (formData.imagen_perfil) {
        formPayload.append("imagen_perfil", {
          uri: formData.imagen_perfil.uri,
          name: formData.imagen_perfil.name,
          type: formData.imagen_perfil.type,
        } as any);
      }

      const response = await fetch(`http://192.168.132.114:8000/api/usuarios/${user.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userSession?.token}`, // si usas token
          "Content-Type": "multipart/form-data",
        },
        body: formPayload,
      });

      const result = await response.json();
      console.log("Respuesta backend actualización perfil:", result);


      if (!response.ok) {
        let errores = "Errores en la actualización:\n";
        for (const campo in result.errors) {
          errores += `- ${campo}: ${result.errors[campo].join(", ")}\n`;
        }
        alert(errores);
        return;
      }

      Alert.alert("Éxito", "Perfil actualizado exitosamente.");
      setEditMode(false);
      await refreshSession();
    } catch (error) {
      console.error("Error inesperado:", error);
      Alert.alert("Error", "Ocurrió un error inesperado al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {previewImage ? (
          <Image source={{ uri: previewImage }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text>No hay imagen</Text>
          </View>
        )}
        {editMode && (
          <Button title="Seleccionar imagen" onPress={pickImage} />
        )}
      </View>

      <View style={styles.field}>
        <Text>Nombre:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
          />
        ) : (
          <Text style={styles.text}>{user.nombre}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text>Apellido:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={formData.apellido}
            onChangeText={(text) => setFormData({ ...formData, apellido: text })}
          />
        ) : (
          <Text style={styles.text}>{user.apellido}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text>Correo:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.correo}
            onChangeText={(text) => setFormData({ ...formData, correo: text })}
          />
        ) : (
          <Text style={styles.text}>{user.correo}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text>Teléfono:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={formData.telefono}
            onChangeText={(text) => setFormData({ ...formData, telefono: text })}
          />
        ) : (
          <Text style={styles.text}>{user.telefono}</Text>
        )}
      </View>

      {editMode && (
        <View style={styles.field}>
          <Text>Nueva Contraseña:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={formData.nuevaContraseña || ""}
            onChangeText={(text) => setFormData({ ...formData, nuevaContraseña: text })}
          />
        </View>
      )}

      <View style={styles.buttons}>
        {editMode ? (
          <>
            <Button title={saving ? "Guardando..." : "Guardar"} onPress={handleSave} disabled={saving} />
            <Button title="Cancelar" onPress={handleCancel} disabled={saving} />
          </>
        ) : (
          <Button title="Editar Perfil" onPress={handleEdit} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  field: {
    width: "100%",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  text: {
    marginTop: 4,
    fontSize: 16,
  },
  buttons: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

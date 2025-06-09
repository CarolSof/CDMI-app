import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";

// Importa tus componentes convertidos a React Native
import Sidebar from "@/components/Sidebar";
import DonationForm from "@/components/DonationForm";

const HomePage = () => {
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const rol = localStorage.getItem("rol");

    // Validación de acceso
    if (!token || rol !== "usuario") {
      router.replace("/login"); // Redirigir si no es usuario autorizado
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* <Navbar /> si ya lo tienes en el layout global, puedes omitirlo */}
      <Sidebar />
      <DonationForm />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    position: "relative",
  },
});

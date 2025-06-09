import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

const HomeCDMI = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido a CDMI</Text>
        <Text style={styles.subtitle}>
          Descubre nuestras iniciativas y proyectos para apoyar a las comunidades indígenas
        </Text>
      </View>

      <View style={styles.section}>
        <Image
          source={require("@/assets/images/logocdmiN.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Conoce más sobre nuestros proyectos</Text>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae
            velit faucibus, a congue eros posuere...
          </Text>
          <Text style={styles.paragraph}>
            Nam condimentum, orci et tincidunt dictum, odio velit condimentum justo, a vehicula sem
            lorem et nunc. Aliquam erat volutpat...
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Más información</Text>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae
            velit faucibus, a congue eros posuere...
          </Text>
        </View>
        <Image
          source={require("@/assets/images/indigena4.jpg")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
};

export default HomeCDMI;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    color: "#333",
  },
  section: {
    marginBottom: 32,
    flexDirection: "column",
  },
  textContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
});

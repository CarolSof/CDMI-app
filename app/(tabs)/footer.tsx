// app/(tabs)/footer.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { Link } from 'expo-router';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>&copy; 2024 CDMI. Todos los derechos reservados.</Text>
      <View style={styles.linkRow}>
        <Link href="/Contacto" style={styles.link}>
          Contáctanos
        </Link>
        <Text style={styles.separator}> | </Text>
        <Link href="/Privacidad" style={styles.link}>
          Política de Privacidad
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#a2231d',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'android' ? 20 : 40, 
  },
  text: {
    fontFamily: 'Merriweather',
    color: '#fff',
    marginBottom: 4,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    fontFamily: 'Merriweather',
    color: '#fff',
    textDecorationLine: 'underline',
  },
  separator: {
    fontFamily: 'Merriweather',
    color: '#fff',
    marginHorizontal: 8,
  },
});

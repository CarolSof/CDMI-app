import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import useGetSession from '@/hooks/useGetSession';
import { Ionicons } from '@expo/vector-icons'; // íconos nativos
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Header() {
  
  const router = useRouter();
  const { userSession, handleLogout } = useGetSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const rol = userSession?.rol; // Asume que tu hook devuelve esto
  const token = userSession?.token;

  return (
     <>
      <StatusBar
        barStyle="light-content" // íconos blancos
        backgroundColor="#000" // mismo color que tu header, para Android
      />
    <View style={styles.header}>
      {/* Menú hamburguesa a la izquierda */}
        <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.menuButton}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
      {/* Logo + Botón menú */}
      {/* Logo centrado absolutamente */}
        <TouchableOpacity onPress={() => router.push('/')} style={styles.logoWrapper}>
          <Image source={require('../../assets/images/logocdmi.png')} style={styles.logo} />
        </TouchableOpacity>
      </View>
      
      {/* Menú Desplegable */}
      <Modal visible={isMenuOpen} animationType="fade" transparent>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        >
          <View style={styles.menuWrapper}>
            <View style={styles.menu}>
            <MenuItem label="Home" to="/" />
           
      {/*<ScrollView horizontal contentContainerStyle={styles.nav}>
        <NavItem label="Home" to="/" />*/}

        {token && (
          <>
            {rol === 'administrador' && (
              <>
                <MenuItem label="Inicio" to="/" />
                <MenuItem label="Gestión del carrito" to="/AdminCatalogo" />
                <MenuItem label="Eventos" to="/EventosAdmin" />
                <MenuItem label="Donaciones" to="/AyudasAdmin" />
              </>
            )}
            {rol === 'usuario' && (
              <>
                <MenuItem label="Carrito" to="/cartshop" />
                <MenuItem label="Catálogo" to="/catalogo" />
                <MenuItem label="Mis compras" to="/HistorialCompras" />
                <MenuItem label="Donaciones" to="/ayudas" />
                <MenuItem label="Eventos" to="/eventos" />
              </>
            )}
          </>
        )}

        {userSession ? (
          <>
            <MenuItem label="Cuenta" to="/profile" />
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Text style={styles.menuText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <MenuItem label="Inicio de sesión" to="/login" />
            <MenuItem label="Registro" to="/register" />
          </>
        )}

        <MenuItem label="Nosotros" to="/HomeCDMI" />
      </View>
      </View>
      </TouchableOpacity>
      </Modal>
    </>
  );
}

// Reutilizable para cada botón de navegación
function MenuItem({ label, to }: { label: string; to: string }) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(to as any)} style={styles.menuItem}>
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 50;


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#a2231d',
    paddingTop: statusBarHeight, 
    paddingBottom: 10,
    paddingHorizontal: 15,
    height: statusBarHeight + 40,
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    paddingTop: statusBarHeight - 32,
    zIndex: 2,
  },
  logoWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    paddingTop: statusBarHeight - 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  // Menú desplegable
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuWrapper: {
  flex: 1,
  justifyContent: 'center', // ✅ ahora sí se centra verticalmente
  alignItems: 'center',
},
  menu: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    borderRadius: 8,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  brand: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    marginHorizontal: 10,
  },
  navText: {
    color: '#fff',
    fontSize: 16,
  },
});

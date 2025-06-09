import { useEffect, useState } from 'react';
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const carouselImages = [
  { src: require('@/assets/images/indigena1.jpg'), title: 'First slide label', desc: 'Contenido de la primera diapositiva.' },
  { src: require('@/assets/images/indigena2.jpg'), title: 'Second slide label', desc: 'Contenido de la segunda diapositiva.' },
  { src: require('@/assets/images/indigena3.jpg'), title: 'Third slide label', desc: 'Contenido de la tercera diapositiva.' },
];

export default function Home() {

  
  const [message, setMessage] = useState('Cargando...');

  useEffect(() => {
    const fetchApi = async () =>{
      try {
        const res = await fetch('http://192.168.122.114:8000/api/test');
      const data = await res.json();
      setMessage(data.message);
      } catch (error) {
        setMessage('Error al conectar con la Api');
      }
    };

    fetchApi();

    {/*fetch('http://192.168.11.7:8000/api/test') // Tu IP local y endpoint Laravel
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error al conectar con la API'));*/}
  }, []);

  {/*return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  );*/}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


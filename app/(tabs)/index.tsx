// app/(tabs)/home.tsx
import { useFonts } from 'expo-font';
import { SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const carouselImages = [
  { src: require('@/assets/images/firstlabel.jpg'), title: '', desc: '' },
  { src: require('@/assets/images/jaguar.jpg'), title: '', desc: '' },
  { src: require('@/assets/images/sol.jpg'), title: '', desc: '' },
];

export default function Home() {

  const [fontsLoaded] = useFonts({
    Merriweather: require('@/assets/fonts/Merriweather.ttf'),
  });

  const [message, setMessage] = useState('Cargando...');
  const router = useRouter();

  useEffect(() => {
    if (!fontsLoaded) SplashScreen.preventAutoHideAsync();
    else SplashScreen.hideAsync();
    const fetchApi = async () =>{
      try {
        const res = await fetch('http://192.168.132.114/api/test');
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
  }, [fontsLoaded]);

   if (!fontsLoaded) return null;
   

  return (
    <View style={{ flex: 1, paddingTop: 0, backgroundColor: '#fff' }}>
    <StatusBar style="dark" translucent backgroundColor="transparent" />
    <ScrollView>
      {/* Carrusel */}
      
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.carousel}>
        {carouselImages.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image source={item.src} style={styles.image} resizeMode="cover" />
            <View style={styles.caption}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Hilamos saberes, tejemos resistencia</Text>
        <TouchableOpacity onPress={() => router.push('/register')} style={styles.button}>
          <Text style={styles.buttonText}>¡Únete Ahora!</Text>
        </TouchableOpacity>
      </View>

      {/* Sección ¿Quiénes Somos? */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Quiénes Somos?</Text>
        <Text style={styles.sectionText}>
          En CDMI, nos dedicamos a preservar y promover las tradiciones culturales a través de productos únicos y eventos comunitarios.
        </Text>
        <Image source={require('@/assets/images/sentada.jpeg')} style={styles.sectionImage} resizeMode="cover" />
        <Image source={require('@/assets/images/indio.jpeg')} style={styles.sectionImage} resizeMode="cover" />
        <Image source={require('@/assets/images/tradicion.jpeg')} style={styles.sectionImage} resizeMode="cover" />
      </View>

      {/* Sección Eventos Destacados */}
      <View style={styles.section1}>
        <Text style={styles.sectionTitle1}>Eventos Destacados</Text>
        <Text style={styles.sectionText1}>
          Participa en nuestros eventos y celebra con nosotros la riqueza de nuestra cultura.
        </Text>
        <Image source={require('@/assets/images/calendario.jpg')} style={styles.sectionImage1} resizeMode="cover" />
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    height: 250,
  },
  slide: {
    width,
    alignItems: 'center',
  },
  image: {
    width: width,
    height: 250,
  },
  caption: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  slideTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  slideDesc: {
    fontSize: 14,
    color: '#fff',
  },
  heroSection: {
    padding: 20,
    backgroundColor: '#ffff',
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: "Merriweather",
    fontSize: 22,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e1c699',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Merriweather',
    color: '#000',
  },
  section: {
    backgroundColor: '#e1c699',
    padding: 20,
  },
  sectionTitle: {
    color: '#ffff',
    fontFamily: 'Merriweather',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionText: {
    fontFamily: 'Merriweather',
    color: '#ffff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 26,
  },
  sectionImage: {
    backgroundColor: '#000',
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  section1: {
    backgroundColor: '#ffff',
    padding: 20,
  },
  sectionTitle1: {
    color: '#000',
    fontFamily: 'Merriweather',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionText1: {
    fontFamily: 'Merriweather',
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 26,
  },
  sectionImage1: {
    backgroundColor: '#000',
    width: '100%',
    height: 291,
    borderRadius: 10,
    marginBottom: 15,
  },
});

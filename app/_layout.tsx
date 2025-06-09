import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { useFonts } from 'expo-font';
import { Stack, Slot } from 'expo-router';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import Header from '@/app/(tabs)/header'; // Asegúrate que estén adaptados a RN
import Footer from '@/app/(tabs)/footer';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    /*<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>*/

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
            <Header />
            <View style={styles.mainContent}>
                <Slot /> {/* O sustituye por children si usas stack/tab screen */}
            </View>
            <Footer />
        </View>
        </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
    },
});

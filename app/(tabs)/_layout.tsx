import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import Header from './header'; // Asegúrate que estén adaptados a RN
import Footer from './footer';
import { SafeAreaView } from 'react-native-safe-area-context';
 // Si estás usando Expo Router

export default function AppLayout() {
    return (
      <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
           {/*<Header />*/}
            <View style={styles.mainContent}>
                <Slot /> {/* O sustituye por children si usas stack/tab screen */}
            </View>
            {/*<Footer />*/}
        </View>
       </SafeAreaView>
       </>
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
{/*import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}*/}

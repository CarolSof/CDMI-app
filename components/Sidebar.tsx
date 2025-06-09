import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleCollapse = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.sidebar}>
      <Text style={styles.title}>CDMI</Text>

      {/* Acordeón 1 */}
      <View style={styles.accordionItem}>
        <TouchableOpacity onPress={() => toggleCollapse(0)}>
          <Text style={styles.accordionHeader}>Datos 1</Text>
        </TouchableOpacity>
        <Collapsible collapsed={activeIndex !== 0}>
          <Text style={styles.accordionBody}>
            ¿Sabías que la población indígena cubre el 6.2% de la población a nivel mundial?
          </Text>
        </Collapsible>
      </View>

      {/* Acordeón 2 */}
      <View style={styles.accordionItem}>
        <TouchableOpacity onPress={() => toggleCollapse(1)}>
          <Text style={styles.accordionHeader}>Datos 2</Text>
        </TouchableOpacity>
        <Collapsible collapsed={activeIndex !== 1}>
          <Text style={styles.accordionBody}>
            De los 7.000 idiomas que existen, la mayoría son lenguas indígenas.
          </Text>
        </Collapsible>
      </View>

      {/* Acordeón 3 */}
      <View style={styles.accordionItem}>
        <TouchableOpacity onPress={() => toggleCollapse(2)}>
          <Text style={styles.accordionHeader}>Datos 3</Text>
        </TouchableOpacity>
        <Collapsible collapsed={activeIndex !== 2}>
          <Text style={styles.accordionBody}>
            Es vital reducir la pobreza, estigmatización y exclusión social, resaltando la importancia de su cultura, su cosmovisión y saberes ancestrales.
          </Text>
        </Collapsible>
      </View>

      <Image
        source={require('@/assets/images/indigena6.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  accordionItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  accordionHeader: {
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 8,
    color: '#333',
  },
  accordionBody: {
    paddingVertical: 8,
    color: '#555',
  },
  image: {
    marginTop: 20,
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});

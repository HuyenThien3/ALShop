// 📂 app/(tabs)/explore.tsx
import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function ExploreScreen() {
  const router = useRouter();

  // 🛒 Danh sách sản phẩm demo
  const products = [
    {
      id: 1,
      name: 'Nike Air Max',
      price: '$120',
      image: 'https://i.imgur.com/eY9Kp3F.png',
    },
    {
      id: 2,
      name: 'Adidas UltraBoost',
      price: '$140',
      image: 'https://i.imgur.com/6M5jvEw.png',
    },
    {
      id: 3,
      name: 'Puma Suede',
      price: '$100',
      image: 'https://i.imgur.com/d3Zf9yC.png',
    },
    {
      id: 4,
      name: 'New Balance 550',
      price: '$130',
      image: 'https://i.imgur.com/WcZt4Lz.png',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Explore Products
      </ThemedText>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/app/product/${item.id}` as any)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

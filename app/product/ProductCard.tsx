// ProductCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
  };
  onPress: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // Styles here...
  },
  image: {
    // Styles here...
  },
  name: {
    // Styles here...
  },
  price: {
    // Styles here...
  },
});

export default ProductCard;

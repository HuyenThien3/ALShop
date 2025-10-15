import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

export default function CartScreen({ navigation }: any) {
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Cà phê sữa đá', price: 25000, quantity: 1, image: require('@/assets/images/sample_product.png') },
    { id: '2', name: 'Trà đào cam sả', price: 30000, quantity: 2, image: require('@/assets/images/sample_product.png') },
  ]);

  const increaseQuantity = (id: string) => {
    setCartItems(items =>
      items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống.');
    } else {
      navigation.navigate('PaymentScreen', { total: getTotal() });
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.quantityBtn} onPress={() => decreaseQuantity(item.id)}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityBtn} onPress={() => increaseQuantity(item.id)}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => deleteItem(item.id)}>
        <Image source={require('@/assets/icons/delete.png')} style={styles.deleteIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('@/assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Giỏ hàng trống</Text>}
      />

      {/* Tổng tiền + Thanh toán */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalPrice}>{getTotal().toLocaleString()} đ</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>THANH TOÁN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    elevation: 3,
  },
  backIcon: { width: 24, height: 24, tintColor: '#333' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#000', marginRight: 24 },

  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  image: { width: 90, height: 90, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  price: { color: '#E53935', fontSize: 15, marginTop: 3 },

  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  quantityBtn: {
    backgroundColor: '#E0E0E0',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  quantityValue: { marginHorizontal: 10, fontSize: 16, fontWeight: 'bold' },

  deleteIcon: { width: 24, height: 24, tintColor: '#E53935', marginLeft: 6, alignSelf: 'flex-start' },

  emptyText: { textAlign: 'center', color: '#888', marginTop: 50, fontSize: 16 },

  footer: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#E53935' },

  checkoutBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

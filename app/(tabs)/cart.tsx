import { IconSymbol } from '@/components/ui/icon-symbol';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Sơ Mi Lv',
    price: 300000,
    quantity: 1,
    image: 'https://via.placeholder.com/80x100/333333/FFFFFF?text=Shirt',
  },
  {
    id: '2',
    name: 'Áo sơ mi bbr',
    price: 450000,
    quantity: 1,
    image: 'https://via.placeholder.com/80x100/8B4513/FFFFFF?text=BBR',
  },
];

const SwipeableCartItem: React.FC<{
  item: CartItem;
  onDelete: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}> = ({ item, onDelete, onQuantityChange }) => {
  const translateX = new Animated.Value(0);
  const itemOpacity = new Animated.Value(1);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderGrant: () => {
      translateX.setOffset((translateX as any)._value);
      translateX.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      const maxSwipe = -80;
      const newValue = Math.max(maxSwipe, Math.min(0, gestureState.dx));
      translateX.setValue(newValue);
    },
    onPanResponderRelease: (_, gestureState) => {
      translateX.flattenOffset();
      
      const shouldShowDelete = gestureState.dx < -40;
      
      if (shouldShowDelete) {
        Animated.spring(translateX, {
          toValue: -80,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  const handleDeletePress = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -80,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(itemOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDelete(item.id);
    });
  };

  return (
    <View style={styles.itemContainer}>
      {/* Delete Button Background */}
      <Animated.View 
        style={[
          styles.deleteButton, 
          {
            opacity: translateX.interpolate({
              inputRange: [-100, -20],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            })
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.deleteButtonTouchable}
          onPress={handleDeletePress}
          activeOpacity={0.7}
        >
          <IconSymbol name="trash" size={24} color="#FF4444" />
        </TouchableOpacity>
      </Animated.View>

      {/* Cart Item */}
      <Animated.View 
        style={[
          styles.cartItem, 
          {
            transform: [{ translateX }],
            opacity: itemOpacity,
          }
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>x{item.quantity}</Text>
        </View>

        <View style={styles.itemActions}>
          <View style={styles.priceContainer}>
            <Text style={styles.buyText}>Mua</Text>
            <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);

  const handleDeleteItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handleContinue = () => {
    Alert.alert('Thông báo', 'Chức năng thanh toán sẽ được phát triển!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ Hàng Của Bạn</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40x40/007AFF/FFFFFF?text=U' }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.cartItemsContainer} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <SwipeableCartItem
            key={item.id}
            item={item}
            onDelete={handleDeleteItem}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </ScrollView>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.summaryItem}>
            <Text style={styles.summaryItemName}>{item.name}</Text>
            <Text style={styles.summaryItemPrice}>{formatPrice(item.price * item.quantity)}</Text>
          </View>
        ))}
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tất Cả</Text>
          <Text style={styles.totalPrice}>{formatPrice(calculateTotal())}</Text>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Tiếp Tục</Text>
        <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cartItemsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#FFE6E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 1,
  },
  deleteButtonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#687076',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  buyText: {
    fontSize: 12,
    color: '#687076',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181C',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
    borderStyle: 'dashed',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#11181C',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
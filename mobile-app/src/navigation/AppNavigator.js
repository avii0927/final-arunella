import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Typography, Radii, Shadows } from '../theme';

// Auth screens
import SplashScreen from '../screens/auth/SplashScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// Farmer screens
import FarmerHomeScreen from '../screens/farmer/FarmerHomeScreen';
import AddCropScreen from '../screens/farmer/AddCropScreen';
import MyCropsScreen from '../screens/farmer/MyCropsScreen';
import FarmerOrdersScreen from '../screens/farmer/FarmerOrdersScreen';
import CropDetailScreen from '../screens/farmer/CropDetailScreen';

// Buyer screens
import BuyerMarketplaceScreen from '../screens/buyer/BuyerMarketplaceScreen';
import PlaceOrderScreen from '../screens/buyer/PlaceOrderScreen';
import BuyerOrdersScreen from '../screens/buyer/BuyerOrdersScreen';

// Transporter screens
import TransporterHomeScreen from '../screens/transporter/TransporterHomeScreen';
import TransporterPendingOrdersScreen from '../screens/transporter/TransporterPendingOrdersScreen';
import TransporterHistoryScreen from '../screens/transporter/TransporterHistoryScreen';
import DeliveryDetailScreen from '../screens/transporter/DeliveryDetailScreen';

// Shared screens
import ProfileScreen from '../screens/shared/ProfileScreen';
import EditProfileScreen from '../screens/shared/EditProfileScreen';
import RatingScreen from '../screens/shared/RatingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Placeholder screens for demo ────────────────────────────────────
const PlaceholderScreen = ({ title, emoji, color }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
    <Text style={{ fontSize: 64, marginBottom: 16 }}>{emoji}</Text>
    <Text style={[Typography.h3, { color: color || Colors.textPrimary }]}>{title}</Text>
    <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 8 }]}>
      Coming soon in full implementation
    </Text>
  </View>
);

// ─── Stable Top-Level Screen Components ──────────────────────────────
const HistoryScreen = (props) => <PlaceholderScreen {...props} title="History" emoji="📋" color={Colors.transporter} />;
const TermsScreen = (props) => <PlaceholderScreen {...props} title="Terms & Privacy" emoji="📄" color={Colors.primary} />;
const ProductDetailScreen = (props) => <PlaceholderScreen {...props} title="Product Detail" emoji="🛒" color={Colors.buyer} />;
const OrderTrackingScreen = (props) => <PlaceholderScreen {...props} title="Track Order" emoji="🗺️" color={Colors.buyer} />;
const OrderSuccessScreen = (props) => <PlaceholderScreen {...props} title="Order Placed! 🎉" emoji="✅" color={Colors.success} />;
const UpdateDeliveryScreen = (props) => <PlaceholderScreen {...props} title="Update Delivery" emoji="📍" color={Colors.transporter} />;


// ─── Farmer Tab Navigator ─────────────────────────────────────────────
const FarmerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.farmer,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
      tabBarItemStyle: styles.tabItem,
    }}
  >
    <Tab.Screen
      name="FarmerHome"
      component={FarmerHomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, focused }) => (
          <TabIcon emoji="🏠" color={color} focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="MyCrops"
      component={MyCropsScreen}
      options={{
        tabBarLabel: 'Crops',
        tabBarIcon: ({ color, focused }) => (
          <TabIcon emoji="🌾" color={color} focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="AddCropTab"
      component={AddCropScreen}
      options={{
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => (
          <View style={[styles.addButton, { backgroundColor: Colors.farmer }]}>
            <Text style={{ color: Colors.white, fontSize: 28 }}>+</Text>
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="FarmerOrders"
      component={FarmerOrdersScreen}
      options={{
        tabBarLabel: 'Orders',
        tabBarIcon: ({ color, focused }) => (
          <TabIcon emoji="📦" color={color} focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="FarmerProfile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, focused }) => (
          <TabIcon emoji="👤" color={color} focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// ─── Buyer Tab Navigator ──────────────────────────────────────────────
const BuyerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.buyer,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
      tabBarItemStyle: styles.tabItem,
    }}
  >
    <Tab.Screen
      name="Marketplace"
      component={BuyerMarketplaceScreen}
      options={{
        tabBarLabel: 'Explore',
        tabBarIcon: ({ color, focused }) => <TabIcon emoji="🌿" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="BuyerOrdersTab"
      component={BuyerOrdersScreen}
      options={{
        tabBarLabel: 'Orders',
        tabBarIcon: ({ color, focused }) => <TabIcon emoji="📦" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="BuyerRatingTab"
      component={RatingScreen}
      options={{
        tabBarLabel: 'Rate',
        tabBarIcon: ({ color, focused }) => <TabIcon emoji="⭐" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="BuyerProfile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, focused }) => <TabIcon emoji="👤" color={color} focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

// ─── Transporter Tab Navigator ────────────────────────────────────────
const TransporterTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.transporter,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
      tabBarItemStyle: styles.tabItem,
    }}
  >
    <Tab.Screen
      name="TransporterHome"
      component={TransporterHomeScreen}
      options={{
        tabBarLabel: 'Deliveries',
        tabBarIcon: ({ color, focused }) => <TabIcon emoji="🚛" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="PendingOrders"
      component={TransporterPendingOrdersScreen}
      options={{
        tabBarLabel: 'Pending',
        tabBarIcon: ({ color, focused }) => <TabIcon emoji="📋" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="TransporterHistory"
      component={TransporterHistoryScreen}
      options={{
        tabBarLabel: 'History',
        tabBarIcon: ({ color, focused }) => <TabIcon emoji="📜" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="TransporterProfile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, focused }) => <TabIcon emoji="👤" color={color} focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

// ─── Tab Icon Component ──────────────────────────────────────────────
const TabIcon = ({ emoji, color, focused }) => (
  <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
    <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{emoji}</Text>
  </View>
);

// ─── Root Navigator ───────────────────────────────────────────────────
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      {/* Auth Flow */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* Role Apps */}
      <Stack.Screen name="FarmerApp" component={FarmerTabNavigator} />
      <Stack.Screen name="BuyerApp" component={BuyerTabNavigator} />
      <Stack.Screen name="TransporterApp" component={TransporterTabNavigator} />

      {/* Shared Screens */}
      <Stack.Screen name="Rating" component={RatingScreen} />

      {/* Profile sub-screens */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />

      {/* Farmer sub-screens */}
      <Stack.Screen name="AddCrop" component={AddCropScreen} />
      <Stack.Screen name="CropDetail" component={CropDetailScreen} />

      {/* Buyer sub-screens */}
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />

      {/* Transporter sub-screens */}
      <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
      <Stack.Screen name="UpdateDelivery" component={UpdateDeliveryScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    ...Shadows.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    ...Typography.caption,
    fontWeight: '600',
    marginTop: -2,
  },
  tabItem: {
    paddingVertical: 4,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    ...Shadows.lg,
  },
  tabIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabIconActive: {
    backgroundColor: Colors.farmerLight,
  },
  tabEmoji: {
    fontSize: 20,
  },
  tabEmojiActive: {
    fontSize: 22,
  },
});

export default AppNavigator;

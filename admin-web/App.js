import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { colors } from './src/theme/colors';
import Sidebar from './src/components/Sidebar';
import Header from './src/components/Header';
import LoginScreen from './src/screens/LoginScreen';
import OverviewScreen from './src/screens/OverviewScreen';
import UsersScreen from './src/screens/UsersScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import DeliveriesScreen from './src/screens/DeliveriesScreen';
import FraudDetectionScreen from './src/screens/FraudDetectionScreen';

import AddUserModal from './src/components/AddUserModal';
import AddProductModal from './src/components/AddProductModal';
import AddDeliveryModal from './src/components/AddDeliveryModal';
import ReviewFraudModal from './src/components/ReviewFraudModal';
import { apiService } from './src/services/apiService';

import {
  initialFarmers,
  initialBuyers,
  initialTransporters,
  initialCrops,
  initialDeliveries,
  recentActivityFeed,
  initialFraudIncidents,
  systemRiskRules,
} from './src/mock/mockData';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbConnected, setDbConnected] = useState(false);

  // Active navigation tab state
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Data state
  const [farmers, setFarmers] = useState(initialFarmers);
  const [buyers, setBuyers] = useState(initialBuyers);
  const [transporters, setTransporters] = useState(initialTransporters);
  const [crops, setCrops] = useState(initialCrops);
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [activityFeed, setActivityFeed] = useState(recentActivityFeed);
  const [fraudIncidents, setFraudIncidents] = useState(initialFraudIncidents);
  const [rulesList] = useState(systemRiskRules);

  // Modal visibility state
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [selectedFraudIncident, setSelectedFraudIncident] = useState(null);



  // Fetch live database data on mount
  useEffect(() => {
    async function loadDatabaseData() {
      try {
        const isHealthy = await apiService.checkBackendHealth();
        setDbConnected(isHealthy);
        if (isHealthy) {
          const [fetchedFarmers, fetchedBuyers, fetchedTransporters, fetchedCrops, fetchedDeliveries] =
            await Promise.allSettled([
              apiService.getFarmers(),
              apiService.getBuyers(),
              apiService.getTransporters(),
              apiService.getCrops(),
              apiService.getDeliveries(),
            ]);

          if (fetchedFarmers.status === 'fulfilled' && fetchedFarmers.value.length > 0) {
            setFarmers(fetchedFarmers.value);
          }
          if (fetchedBuyers.status === 'fulfilled' && fetchedBuyers.value.length > 0) {
            setBuyers(fetchedBuyers.value);
          }
          if (fetchedTransporters.status === 'fulfilled' && fetchedTransporters.value.length > 0) {
            setTransporters(fetchedTransporters.value);
          }
          if (fetchedCrops.status === 'fulfilled' && fetchedCrops.value.length > 0) {
            setCrops(fetchedCrops.value);
          }
          if (fetchedDeliveries.status === 'fulfilled' && fetchedDeliveries.value.length > 0) {
            setDeliveries(fetchedDeliveries.value);
          }
        }
      } catch (e) {
        setDbConnected(false);
      }
    }
    loadDatabaseData();
  }, []);

  // Login handler
  const handleLogin = (userCredentials) => {
    setCurrentUser(userCredentials);
    setIsAuthenticated(true);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Add User handler (DB & State)
  const handleAddUser = async (userObj) => {
    const nextId = String(Date.now()).slice(-3);
    if (userObj.role === 'Farmer') {
      const payload = {
        name: userObj.name,
        email: userObj.email,
        nic: userObj.extraField || '990000000V',
        district: userObj.location || 'Colombo',
      };
      if (dbConnected) {
        try {
          const saved = await apiService.createFarmer(payload);
          setFarmers([saved, ...farmers]);
          return;
        } catch (e) {
          // Fall back to state mutation
        }
      }
      setFarmers([{ userId: nextId, ...payload }, ...farmers]);
    } else if (userObj.role === 'Buyer') {
      const payload = {
        name: userObj.name,
        email: userObj.email,
        businessRegNo: userObj.extraField || 'PV-99999',
        marketLocation: userObj.location || 'Colombo',
      };
      if (dbConnected) {
        try {
          const saved = await apiService.createBuyer(payload);
          setBuyers([saved, ...buyers]);
          return;
        } catch (e) {
          // Fall back
        }
      }
      setBuyers([{ userId: nextId, ...payload }, ...buyers]);
    } else if (userObj.role === 'Transporter') {
      const payload = {
        name: userObj.name,
        email: userObj.email,
        vehiclePlateNo: userObj.extraField || 'WP-9999',
        maxCapacity: userObj.location || '5000 kg',
      };
      if (dbConnected) {
        try {
          const saved = await apiService.createTransporter(payload);
          setTransporters([saved, ...transporters]);
          return;
        } catch (e) {
          // Fall back
        }
      }
      setTransporters([{ userId: nextId, ...payload }, ...transporters]);
    }
  };

  // Add Product handler (DB & State)
  const handleAddProduct = async (productObj) => {
    const nextId = String(crops.length + 1);
    const newCropPayload = {
      productName: productObj.productName,
      stock: productObj.stock,
      pricePerKg: productObj.pricePerKg,
      minPrice: productObj.minPrice,
      expDate: productObj.expDate,
      status: productObj.status || 'Active',
    };

    if (dbConnected) {
      try {
        const saved = await apiService.createCrop(newCropPayload);
        setCrops([saved, ...crops]);
      } catch (e) {
        setCrops([{ productId: nextId, ...newCropPayload }, ...crops]);
      }
    } else {
      setCrops([{ productId: nextId, ...newCropPayload }, ...crops]);
    }

    setActivityFeed([
      {
        id: String(Date.now()),
        title: `New listing: ${productObj.productName}`,
        subtitle: `${productObj.stock} listed at ${productObj.pricePerKg}`,
        badgeText: 'New Listing',
        badgeBg: '#FFF9C4',
        badgeColor: '#1a1c1a',
        time: 'Just now',
        icon: 'inventory-2',
        iconBg: '#acf4a4',
        iconColor: '#307231',
      },
      ...activityFeed,
    ]);
  };

  // Add Delivery handler (DB & State)
  const handleAddDelivery = async (deliveryObj) => {
    const nextId = String(1000 + deliveries.length + 1);
    const deliveryPayload = {
      orderId: deliveryObj.orderId,
      pickupLocation: deliveryObj.pickupLocation,
      deliveryLocation: deliveryObj.deliveryLocation,
      status: deliveryObj.status,
    };

    if (dbConnected) {
      try {
        const saved = await apiService.createDelivery(deliveryPayload);
        setDeliveries([saved, ...deliveries]);
        return;
      } catch (e) {
        // Fall back
      }
    }
    setDeliveries([{ deliveryId: nextId, ...deliveryPayload }, ...deliveries]);
  };

  // Fraud incident action handler
  const handleFraudAction = (incidentId, newStatus) => {
    setFraudIncidents(
      fraudIncidents.map((inc) =>
        inc.id === incidentId ? { ...inc, status: newStatus } : inc
      )
    );
  };

  // If user is not authenticated, show Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const getHeaderTitle = () => {
    if (activeTab === 'Overview') return 'Arunella Admin';
    if (activeTab === 'FraudDetection') return 'Fraud Detection & Risk Management';
    return `${activeTab} Management`;
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <OverviewScreen
            farmers={farmers}
            crops={crops}
            deliveries={deliveries}
            recentCrops={crops}
            activityFeed={activityFeed}
            onNavigateTab={setActiveTab}
          />
        );
      case 'Users':
        return (
          <UsersScreen
            farmers={farmers}
            buyers={buyers}
            transporters={transporters}
            searchQuery={searchQuery}
            onOpenAddUser={() => setUserModalVisible(true)}
          />
        );
      case 'Products':
        return (
          <ProductsScreen
            crops={crops}
            onOpenAddProduct={() => setProductModalVisible(true)}
          />
        );
      case 'Deliveries':
        return (
          <DeliveriesScreen
            deliveries={deliveries}
            onOpenAddDelivery={() => setDeliveryModalVisible(true)}
          />
        );
      case 'FraudDetection':
        return (
          <FraudDetectionScreen
            incidents={fraudIncidents}
            systemRules={rulesList}
            onSelectIncident={setSelectedFraudIncident}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main content wrapper */}
      <View style={styles.mainWrapper}>
        <Header
          title={getHeaderTitle()}
          showSearch={activeTab === 'Users'}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onLogout={handleLogout}
          dbConnected={dbConnected}
        />

        <View style={styles.screenContainer}>{renderActiveScreen()}</View>
      </View>

      {/* Creation & Review Modals */}
      <AddUserModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
        onAddUser={handleAddUser}
      />
      <AddProductModal
        visible={productModalVisible}
        onClose={() => setProductModalVisible(false)}
        onAddProduct={handleAddProduct}
      />
      <AddDeliveryModal
        visible={deliveryModalVisible}
        onClose={() => setDeliveryModalVisible(false)}
        onAddDelivery={handleAddDelivery}
      />
      <ReviewFraudModal
        visible={!!selectedFraudIncident}
        incident={selectedFraudIncident}
        onClose={() => setSelectedFraudIncident(null)}
        onAction={handleFraudAction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: 'row',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    ...Platform.select({
      web: {
        marginLeft: 256,
      },
    }),
  },
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 64 : 0,
  },
});

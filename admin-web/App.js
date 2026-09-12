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

import AddUserModal from './src/components/AddUserModal';
import { apiService } from './src/services/apiService';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbConnected, setDbConnected] = useState(false);

  // Active navigation tab state
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Data state
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [crops, setCrops] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);

  // Modal visibility state
  const [userModalVisible, setUserModalVisible] = useState(false);



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
        password: userObj.password || 'pass123',
        nic: userObj.nic || '990000000V',
        contactNo: userObj.contactNo || '0771234567',
        district: userObj.district || 'Colombo',
        location: userObj.location || 'Colombo',
        bankAccountNo: userObj.bankAccountNo || '',
        role: 'FARMER',
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
        password: userObj.password || 'pass123',
        nic: userObj.nic || '990000000V',
        contactNo: userObj.contactNo || '0771234567',
        district: userObj.district || 'Colombo',
        businessRegNo: userObj.businessRegNo || 'PV-99999',
        marketLocation: userObj.marketLocation || 'Colombo',
        role: 'BUYER',
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
        password: userObj.password || 'pass123',
        nic: userObj.nic || '990000000V',
        contactNo: userObj.contactNo || '0771234567',
        district: userObj.district || 'Colombo',
        vehiclePlateNo: userObj.vehiclePlateNo || 'WP-9999',
        maxCapacity: parseFloat(userObj.maxCapacity) || 5000,
        role: 'TRANSPORTER',
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

  // Delete Farmers, Buyers, Transporters, Crops, Deliveries handlers (DB & State)
  const handleDeleteFarmer = async (id) => {
    if (dbConnected) {
      try { await apiService.deleteFarmer(id); } catch (e) {}
    }
    setFarmers((prev) => prev.filter((f) => f.userId !== id && f.id !== id));
  };

  const handleDeleteBuyer = async (id) => {
    if (dbConnected) {
      try { await apiService.deleteBuyer(id); } catch (e) {}
    }
    setBuyers((prev) => prev.filter((b) => b.userId !== id && b.id !== id));
  };

  const handleDeleteTransporter = async (id) => {
    if (dbConnected) {
      try { await apiService.deleteTransporter(id); } catch (e) {}
    }
    setTransporters((prev) => prev.filter((t) => t.userId !== id && t.id !== id));
  };

  const handleDeleteProduct = async (id) => {
    if (dbConnected) {
      try { await apiService.deleteCrop(id); } catch (e) {}
    }
    setCrops((prev) => prev.filter((c) => c.productId !== id && c.id !== id));
  };

  const handleCancelDelivery = async (id) => {
    if (dbConnected) {
      try { await apiService.deleteDelivery(id); } catch (e) {}
    }
    setDeliveries((prev) => prev.filter((d) => d.deliveryId !== id && d.id !== id));
  };

  // If user is not authenticated, show Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const getHeaderTitle = () => {
    if (activeTab === 'Overview') return 'Arunella Admin';
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
            onDeleteFarmer={handleDeleteFarmer}
            onDeleteBuyer={handleDeleteBuyer}
            onDeleteTransporter={handleDeleteTransporter}
          />
        );
      case 'Products':
        return (
          <ProductsScreen
            crops={crops}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'Deliveries':
        return (
          <DeliveriesScreen
            deliveries={deliveries}
            onCancelDelivery={handleCancelDelivery}
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

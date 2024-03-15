import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as SecureStore from "expo-secure-store"
import { LoginContext } from '../../context/loginContext';

const LogoutButton = ({ onLogout }) => {

  const {setIsLogin} = useContext(LoginContext)

  const handleLogout = async () => {

    await SecureStore.deleteItemAsync("accessToken")
    await setIsLogin("")
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: 'red', // Ganti dengan warna yang diinginkan
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight:10
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LogoutButton;
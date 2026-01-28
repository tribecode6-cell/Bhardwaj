import { View, Text, SafeAreaView, StatusBar, TextInput, StyleSheet,TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Otp = () => {

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const navigation = useNavigation()
  const route = useRoute()
   console.log(route)

  // Email is coming from previous screen
  const email = route.params?.email
  const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('Data successfully saved');
  } catch (e) {
    console.error('Failed to save the data to the storage', e);
  }
};

  const handleVerify = async () => {

    if (otp.length !== 6) {
      setError("⚠️ Please enter valid 6-digit OTP")
      return;
    }
   

    try {
      const response = await axios.post(
        "https://argosmob.uk/bhardwaj-hospital/public/api/auth/verify-otp",
        {
          email: email,
          otp: otp
        }
      );
      console.log(response)

      if (response.data.status) {
        Alert.alert("Success", "OTP Verified Successfully!");
       storeData ("access_token",response.data.access_token)
        navigation.navigate("TabNavigation");
      } else {
        Alert.alert("Failed", response.data.message);
      }

    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Verification failed"
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'}/>

      <View style={{ alignContent:'center', marginTop:150, padding:15 }} >
        
        <Text style={styles.title2}>OTP</Text>

        <TextInput
          placeholder="Enter OTP"
          style={styles.input}
          keyboardType="number-pad"
          value={otp}
          maxLength={6}
          onChangeText={(text) => {
            setOtp(text)
            setError('')
          }}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.butview}>
          <TouchableOpacity onPress={handleVerify} style={styles.btn}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  )
}

export default Otp

const styles = StyleSheet.create({
  title2: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
        fontFamily: 'Poppins-Regular',

  },
  input: {
    borderWidth: 1,
    borderColor: '#E8F0F2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#E8F0F2',
    height: 50,
    fontSize: 16,
    color: '#000',
        fontFamily: 'Poppins-Regular',

  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
            fontFamily: 'Poppins-Regular',

  },
  butview: {
    height: 60,
    marginTop: 20,
  },
  btn: {
    backgroundColor: '#FF3D00',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
        fontFamily: 'Poppins-SemiBold',

  },
});

import { View, Text, SafeAreaView, StatusBar, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("access_token");

    setTimeout(() => {
      if (token) {
        navigation.replace('TabNavigation'); // Direct home
      } else {
        navigation.replace('Login'); // Go to login
      }
    }, 3000);
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#FF3D00'}}>
      <StatusBar barStyle={'light-content'} backgroundColor="#FF3D00"/>

      <View style={{
        alignItems:'center',
        justifyContent:'center',
        flex:1
      }}>
        <Image 
          source={require('../assets/Images/Splash.png')}
          style={{width: 200, height: 200, resizeMode: 'contain'}}
        />
      </View>
    </SafeAreaView>
  )
}

export default Splash;

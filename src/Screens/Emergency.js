import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from "@react-native-community/geolocation";


const Emergency = () => {
  const navigation = useNavigation();

  const [message, setMessage] = useState("");
  const [age, setAge] = useState("");
  const [BloodType, setBloodType] = useState("");
  const [location, setLocation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // -------------------------------------------------
  // REQUEST PERMISSIONS (Camera + Gallery)
  // -------------------------------------------------
  const requestPermissions = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        const cameraOK =
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
          PermissionsAndroid.RESULTS.GRANTED;

        const galleryOK =
          granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
            PermissionsAndroid.RESULTS.GRANTED;

        // if (!cameraOK || !galleryOK) {
        //   // Alert.alert(
        //   //   "Permission Required",
        //   //   "Please allow camera and gallery access to use this feature."
        //   // );
        //   return false;
        // }
      }

      return true;
    } catch (error) {
      console.log("Permission Error:", error);
      return false;
    }
  };
  // ASK LOCATION PERMISSION
const requestLocationPermission = async () => {
  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        
          {
          title: "Location Permission",
          message: "App needs access to your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
        
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

// GET LIVE LOCATION
const pickLocation = async () => {
  const allowed = await requestLocationPermission();
  if (!allowed)
     {
    Alert.alert("Permission denied", "Please allow location access.");
    return;
  }

  Geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      const loc = `${latitude}, ${longitude}`;

     console.log( setLocation(loc)); // <-- Save to state
      

      Alert.alert("Location Picked", `Lat: ${latitude}\nLng: ${longitude}`);
    },
    (error) => {
      console.log("Location Error:", error);
      Alert.alert("Error", "Unable to fetch location.");
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};


  // -------------------------------------------------
  // IMAGE PICKER FUNCTION
  // -------------------------------------------------
  const handleMediaPick = async () => {
    const allowed = await requestPermissions();
    if (!allowed) return;

    Alert.alert(
      "Select Option",
      "Choose a media source",
      [
        {
          text: "Camera",
          onPress: () => {
            launchCamera({ mediaType: "photo", quality: 1 }, (res) => {
              if (res.didCancel) return;
              if (res.errorCode) {
                Alert.alert("Error", res.errorMessage);
                return;
              }
              setSelectedImage(res.assets[0]);
            });
          },
        },
        {
          text: "Gallery",
          onPress: () => {
            launchImageLibrary({ mediaType: "photo", quality: 1 }, (res) => {
              if (res.didCancel) return;
              if (res.errorCode) {
                Alert.alert("Error", res.errorMessage);
                return;
              }
              setSelectedImage(res.assets[0]);
            });
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  // -------------------------------------------------
  // API FUNCTION
  // -------------------------------------------------
  const EmergencyRequest = async () => {
    if (!message || !age || !BloodType) {
      Alert.alert("Please fill all required fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token)

      const response = await axios.post(
        "https://argosmob.uk/bhardwaj-hospital/public/api/emergency/save",
        {
          symptoms: message,
          age,
          BloodType,
          location: location || "Not Shared",
          image: selectedImage ? selectedImage.uri : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Emergency Response:", response?.data?.data);
      Alert.alert("Success!", "Emergency request sent successfully");

      navigation.navigate("EmergencyStatus");
    } catch (error) {
      console.log("API ERROR:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ paddingHorizontal: 20 }}>

        <Text style={styles.sectionTitle}>Triage Chat</Text>
        <Text style={styles.doctorName}>Dr. Amelia</Text>

        <View style={styles.chatRow}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/47.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.chatBubble}>
            <Text style={styles.chatText}>
              Please describe your symptoms in detail.
            </Text>
          </View>
        </View>

        {/* Symptoms */}
        <TextInput
          style={styles.textArea}
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {/* Age */}
        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#777"
          value={age}
          keyboardType="numeric"
          onChangeText={setAge}
        />

        {/* Blood Type */}
        <TextInput
          style={styles.input}
          placeholder="Blood Type"
          placeholderTextColor="#777"
          value={BloodType}
          onChangeText={setBloodType}
        />

        {/* Attachments */}
        <Text style={styles.sectionTitle}>Attachments</Text>

        <TouchableOpacity style={styles.btnOutline} onPress={handleMediaPick}>
          <Icon name="camera" size={18} color="#ff5722" />
          <Text style={styles.btnOutlineText}>Add Photo/Video</Text>
        </TouchableOpacity>

        {/* Preview */}
        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
          />
        )}

        {/* Location */}
        <Text style={styles.sectionTitle}>Location</Text>

        <TouchableOpacity onPress={pickLocation} style={styles.btnOutline}>
          <Icon name="map-marker" size={18} color="#ff5722" />
          <Text style={styles.btnOutlineText}>{location?"Location Selected ":"Share Location"}</Text>
        </TouchableOpacity>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneBtn} onPress={EmergencyRequest}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Emergency;

// -------------------------------------------------
// STYLES (same as your original code)
// -------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
  },

  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 25 },

  doctorName: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    marginBottom: 5,
  },

  chatRow: { flexDirection: 'row', marginBottom: 15 },

  avatar: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },

  chatBubble: {
    backgroundColor: '#e8f4ff',
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },

  chatText: { fontSize: 14 },

  textArea: {
    height: 120,
    backgroundColor: '#f0f4f7',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    textAlignVertical: 'top',
  },

  input: {
    backgroundColor: '#f0f4f7',
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    fontSize: 15,
  },

  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff5722',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },

  btnOutlineText: {
    marginLeft: 8,
    color: '#ff5722',
    fontSize: 15,
    fontWeight: '600',
  },

  doneBtn: {
    backgroundColor: '#ff5722',
    padding: 15,
    marginTop: 25,
    borderRadius: 10,
    alignItems: 'center',
  },

  doneText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

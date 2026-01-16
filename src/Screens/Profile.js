import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const fileName = user?.profile_picture?.split('/').pop();

  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(user)

  // 👉 Fetch User Profile
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      console.log( "token",token)

      const res = await axios.get(
        "https://argosmob.uk/bhardwaj-hospital/public/api/profile/get",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("res",res)

      setUser(res.data?.user);
      
    } catch (error) {
      console.log(" Profile API Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 👉 Logout Function
  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    navigation.replace("Login");
  };
  console.log(`https://argosmob.uk/bhardwaj-hospital/storage/app/public/${user?.profile_picture}`)

  // 👉 Show Loader While Fetching Data
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#FF3D00" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient Profile</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Profile Image + Name */}
        <View style={styles.profileSection}>

          <Image
            source={{uri:`https://argosmob.uk/bhardwaj-hospital/storage/app/public/profiles/${user?.profile_picture}`}}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {user?.name || "Unknown"}
          </Text>
          <Text style={styles.profileRole}>Patient</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.info}>{user?.email}</Text>

          <Text style={styles.label}>Phone</Text>
          <Text style={styles.info}>{user?.phone || "Not Provided"}</Text>

          <Text style={styles.label}>Address</Text>
          <Text style={styles.info}>{user?.address || "No Address Added"}</Text>

          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatText}>Chat For More Details</Text>
            <Icon name="message-text-outline" size={22} color="#ff5500" />
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity  
            onPress={() => navigation.navigate('UpdateProfile', { user })}
            style={styles.settingRow}
          >
            <Text style={styles.settingText}>Edit Profile</Text>
            <Icon name="pencil-outline" size={22} color="#ff5500" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.settingRow}>
            <Text style={styles.settingText}>Logout</Text>
            <Icon name="arrow-right" size={22} color="#ff5500" />
          </TouchableOpacity>
        </View>

        {/* Social Icons */}
        <View style={styles.socialRow}>
          <TouchableOpacity>
            <Icon name="instagram" size={28} color="#d62976" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="facebook" size={28} color="#1877f2" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    // padding:15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    color: '#000',
  },
  profileRole: {
    color: '#888',
    fontSize: 14,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  label: {
    color: '#777',
    fontSize: 14,
  },
  info: {
    fontSize: 15,
    color: '#000',
    marginBottom: 10,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  chatText: {
    fontSize: 15,
    color: '#000',
    marginRight:205,
    // justifyContent:'space-between'
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.4,
    borderColor: '#ddd',
  },
  settingText: {
    fontSize: 15,
    color: '#000',
  },
  socialRow: {
    flexDirection: 'row',
    // justifyContent: 'center',
    marginTop: 100,
    marginBottom: 40,
    left:320,
  },
});

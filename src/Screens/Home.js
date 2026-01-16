import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Home = () => {
  const navigation = useNavigation();
  const [doctor, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDoctors = async () => {
    try {
      const response = await axios.get(
        'https://argosmob.uk/bhardwaj-hospital/public/api/doctors/get-doctor',
      );
      setDoctors(response?.data?.data);
      console.log('DOCTOR DATA', response?.data?.data);
    } catch (error) {
      console.log('API ERROR', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDoctors();
  }, []);

  const doctors = [
    {
      id: '1',
      name: 'Dr. Ayesha Rahman',
      specialization: 'Cardiologist',
      price: 'Rs500/hr',
      rating: '⭐ 5.0 (166 Reviews)',
      image: require('../assets/Images/Doctor.png'),
      color: 'red',
    },
    {
      id: '2',
      name: 'Dr. Amit Khanna',
      specialization: 'Cardiologist',
      price: 'Rs499/hr',
      rating: '⭐ 5.0 (166 Reviews)',
      image: require('../assets/Images/Doctormen.png'),
      color: '#000',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.username}>Manoj</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellIcon}>
              <Icon name="bell-outline" size={24} color="#ff5500" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                source={require('../assets/Images/profile.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={22} color="#999" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* Hospital Image */}
        <Image
          source={require('../assets/Images/Hospital.png')}
          style={styles.hospitalImage}
        />

        {/* Quick Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://bhardwajhospitals.in/')}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Services</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => navigation.navigate('BookBed')}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Evants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Emergency')}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Emergency</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ReportsScreen')}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Top Doctors */}
        <View style={styles.topDoctorsHeader}>
          <Text style={styles.topDoctorsText}>Top Doctors</Text>
          <TouchableOpacity>
            <Icon name="message-text-outline" size={24} color="#ff5500" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 30 }} Loading></Text>
        ) : (
          <FlatList
            data={doctor.data}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DoctorDetails', { doctorId : item.id })
                }
              >
                <View style={styles.doctorCard}>
                  <Image
                    source= { item.image?{ uri:item.
                      profile_image  }:require("../assets/Images/Doctor.png")}
                    // defaultSource={require('../assets/Images/Doctor.png')}
                    style={styles.doctorImage}
                  />

                  <View style={styles.doctorInfo}>
                    <Text
                      style={styles.doctorName}
                    >{`${item.first_name} ${item.last_name}`}</Text>
                    <Text style={styles.specialization}>
                      {item.specialty?.name}
                    </Text>

                    <Text style={styles.price}>{item.consultation_fee}</Text>
                    <Text style={styles.rating}>
                      {item.qualifications.length >= 20
                        ? item.qualifications.slice(0, 20) + "..."
                        : item.qualifications}
                    </Text>
                  </View>

                  <TouchableOpacity>
                    <Icon name="heart-outline" size={24} color={item.color} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  /* SAFE AREA FIX */
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20, // FIXED (was 50)
  },

  greeting: {
    fontSize: 16,
    color: '#555',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  /* Search Bar */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 10,
    height: 45,
    borderColor: '#000',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 5,
    color: '#000',
  },

  /* Hospital Image */
  hospitalImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginTop: 20,
  },

  /* BUTTON ROW FIXED FOR ANDROID */
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    // showsVerticalScrollIndicator:true
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ff5500',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* Top Doctors */
  topDoctorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  topDoctorsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  /* Doctor Cards */
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    padding: 10,
    marginVertical: 8,
    height: 140, // Adjusted for Android consistency
  },
  doctorImage: {
    width: 70,
    height: 100,
    borderRadius: 10,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialization: {
    color: '#777',
    fontSize: 14,
  },
  price: {
    fontWeight: '600',
    marginTop: 3,
    color: '#000',
  },
  rating: {
    color: '#ff8800',
    fontSize: 13,
  },
});

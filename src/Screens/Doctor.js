import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Doctor = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find a doctor</Text>
          <View style={{ width: 26 }} /> 
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={22} color="#999" />
          <TextInput
            placeholder="Search  by name or specialty"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.deptButton}>
            <Text style={styles.deptButtonText}>Department</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.liveButton}>
            <Text style={styles.liveButtonText}>Live Consultation</Text>
          </TouchableOpacity>
        </View>

        {/* Doctor List */}
        <View style={styles.doctorList}>

          <View style={styles.doctorRow}>
            <View>
              <Text style={styles.availability}>Available today</Text>
              <Text style={styles.doctorName}>Dr. Amelia Chen</Text>
              <Text style={styles.specialty}>Cardiology</Text>
            </View>
            <Image
              source={require('../assets/Images/Doctor.png')}
              style={styles.doctorImage}
            />
          </View>

          <View style={styles.doctorRow}>
            <View>
              <Text style={styles.availability}>Available tomorrow</Text>
              <Text style={styles.doctorName}>Dr. Ethan Ramirez</Text>
              <Text style={styles.specialty}>Dermatology</Text>
            </View>
            <Image
              source={require('../assets/Images/Doctormen.png')}
              style={styles.doctorImage}
            />
          </View>

          <View style={styles.doctorRow}>
            <View>
              <Text style={styles.availability}>Available next week</Text>
              <Text style={styles.doctorName}>Dr. Sophia Patel</Text>
              <Text style={styles.specialty}>Neurology</Text>
            </View>
            <Image
              source={require('../assets/Images/Doctor.png')}
              style={styles.doctorImage}
            />
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Doctor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 10,
    height: 45,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  deptButton: {
    backgroundColor: '#ff5500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  liveButton: {
    backgroundColor: '#ff5500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deptButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  liveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  doctorList: {
    marginTop: 25,
  },
  doctorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  availability: {
    color: '#888',
    fontSize: 13,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 3,
  },
  specialty: {
    fontSize: 14,
    color: '#777',
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const AppointmentDetails = () => {
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
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Doctor Info */}
        <View style={styles.doctorSection}>
          <Image
            source={require('../assets/Images/Doctor.png')}
            style={styles.doctorImage}
          />
          <View>
            <Text style={styles.doctorName}>Dr. Amelia Chen</Text>
            <Text style={styles.specialty}>Internal Medicine</Text>
          </View>
        </View>

        {/* Appointment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="calendar" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Date & Time</Text>
              <Text style={styles.infoText}>Tue, Jul 23 · 10:00 AM</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="map-marker" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Location</Text>
              <Text style={styles.infoText}>123 Main St, Anytown, USA</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="heart-pulse" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Symptoms</Text>
              <Text style={styles.infoText}>Headache, fatigue</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="note-text" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Notes</Text>
              <Text style={styles.infoText}>Discussed medication options</Text>
            </View>
          </View>
        </View>

        {/* Prescription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="pill" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Medication</Text>
              <Text style={styles.infoText}>Ibuprofen 200mg</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="clock-outline" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Dosage</Text>
              <Text style={styles.infoText}>
                Take 1 tablet every 6 hours as needed
              </Text>
            </View>
          </View>
        </View>

        {/* Follow-up Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow-up</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="calendar-clock" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Instructions</Text>
              <Text style={styles.infoText}>
                Schedule a follow-up in 2 weeks
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
          onPress={()=>navigation.navigate('BookAppointment')}
          style={styles.rescheduleButton}>
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentDetails;

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
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 40,
    left:30,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  specialty: {
    fontSize: 14,
    color: '#777',
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: '#ff5500',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 30,
  },
  rescheduleButton: {
    backgroundColor: '#ff5500',
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rescheduleText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ffe4dc',
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#ff5500',
    fontWeight: '700',
    fontSize: 16,
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Appointment = ({ route }) => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);

  const getAppointment = async ()=>{
    try{
      if(!token){
        console.log("No token found");
        return;
      }
      const response = await axios.get(`https://argosmob.uk/bhardwaj-hospital/public/api/appointments`,  
        {
          headers:{
            Authorization:`Bearer ${token}`,
          }
        }
      );
      console.log("APPOINTMENTS:", response.data);
      setAppointments(response.data.data||[]);
    }catch(error){
      console.log("API ERROR", error.response?.data|| error.message);
    }
  };

  useEffect(()=>{
    getAppointment();
  },[]);

  // FIXED: safe destructuring with default empty object
  const { message, date, time, symptoms } = route?.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Upcoming Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>

          {/* Dynamic Appointment from Booking */}
          {date && time ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AppointmentDetails', {
                  date,
                  time,
                  symptoms,
                })
              }>
              <View style={styles.appointmentRow}>
                <Image
                  source={require('../assets/Images/Doctor.png')}
                  style={styles.doctorImage}
                />
                <View style={styles.appointmentInfo}>
                  <Text style={styles.statusConfirmed}>Confirmed</Text>
                  <Text style={styles.doctorText}>
                    Dr. Emily Carter ·{" "}
                    <Text style={styles.timeText}>{time}</Text>
                  </Text>
                  <Text style={{ color: '#777' }}>{date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}

          {/* Static Appointment 2 */}
          <View style={styles.appointmentRow}>
            <Image
              source={require('../assets/Images/Doctormen.png')}
              style={styles.doctorImage}
            />
            <View style={styles.appointmentInfo}>
              <Text style={styles.statusConfirmed}>Confirmed</Text>
              <Text style={styles.doctorText}>
                Dr. Michael Chen · <Text style={styles.timeText}>2:00 PM</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Past Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past</Text>

          {/* Completed */}
          <View style={styles.appointmentRow}>
            <Image
              source={require('../assets/Images/Doctor.png')}
              style={styles.doctorImage}
            />
            <View style={styles.appointmentInfo}>
              <Text style={styles.statusCompleted}>Completed</Text>
              <Text style={styles.doctorText}>
                Dr. Olivia Bennett ·{' '}
                <Text style={styles.timeText}>11:00 AM</Text>
              </Text>
            </View>
          </View>

          {/* Cancelled */}
          <View style={styles.appointmentRow}>
            <Image
              source={require('../assets/Images/Doctormen.png')}
              style={styles.doctorImage}
            />
            <View style={styles.appointmentInfo}>
              <Text style={styles.statusCancelled}>Cancelled</Text>
              <Text style={styles.doctorText}>
                Dr. Ethan Walker ·{' '}
                <Text style={styles.timeText}>3:00 PM</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Appointment;

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
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  doctorImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  statusConfirmed: {
    color: '#248907',
    fontWeight: '600',
  },
  statusCompleted: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  statusCancelled: {
    color: '#d32f2f',
    fontWeight: '600',
  },
  doctorText: {
    fontSize: 15,
    color: '#000',
  },
  timeText: {
    color: '#777',
  },
});

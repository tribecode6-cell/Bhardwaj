import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../utils/api';

const Appointment = ({ route }) => {
  const navigation = useNavigation();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



const getActiveCall = async (appointmentId) => {
  try {
    const token = await AsyncStorage.getItem('access_token');

    if (!token) {
      console.log('No token found');
      return;
    }

    const response = await axios.get(`${BASE_URL}/video-call/active-call?appointment_id=${appointmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    
    });

    console.log('API RESPONSE:', response.data);
    return response.data;

  } catch (error) {
    console.log('API ERROR:', error.response?.data || error.message);
  }
};


useEffect(()=>{
getActiveCall()
},[])


  const getAppointment = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        console.log('No token found');
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'https://argosmob.uk/bhardwaj-hospital/public/api/appointments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('APPOINTMENTS:', response.data.data);

      if (response.data.success && response.data.data) {
        // Categorize appointments based on status
        const upcoming = [];
        const past = [];

        response.data.data.forEach(appointment => {
          if (
            appointment.status === 'scheduled' ||
            appointment.status === 'confirmed'
          ) {
            upcoming.push(appointment);
          } else if (
            appointment.status === 'cancelled' ||
            appointment.status === 'completed'
          ) {
            past.push(appointment);
          }
        });

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      }

      setLoading(false);
    } catch (error) {
      console.log('API ERROR', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to load appointments');
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAppointment();
    }, []),
  );

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusStyle = status => {
    switch (status) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'scheduled':
        return styles.statusConfirmed;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusConfirmed;
    }
  };

  // Function to get status text
  const getStatusText = status => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  const isJoinEnabled = (appointment) => {
  if (!appointment.appointment_date || !appointment.start_time) return false;

  // Combine date + time from API
  const appointmentDateTime = new Date(
    `${appointment.appointment_date}T${appointment.start_time}`
  );

  const now = new Date();

  // Enable only if current time >= appointment time
  return now >= appointmentDateTime;
};


  // Function to render appointment card
  // const renderAppointmentCard = (appointment, index) => {
  //   const doctorName = `${appointment.doctor?.first_name || ''} ${
  //     appointment.doctor?.last_name || ''
  //   }`.trim();

  //   return (
  //     <TouchableOpacity
  //       key={index}
  //       onPress={() => {
  //         console.log('Appointment ID:', appointment?.id); // 👈 log ID here
  //         navigation.navigate('AppointmentDetails', {
  //           appointmentData: appointment,
  //         });
  //       }}
  //     >
  //       <View style={styles.appointmentRow}>
  //         <Image
  //           source={
  //             appointment.doctor?.profile_image
  //               ? {
  //                   uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/${appointment.doctor.profile_image}`,
  //                 }
  //               : require('../assets/Images/Doctor.png')
  //           }
  //           style={styles.doctorImage}
  //         />
  //         <View style={styles.appointmentInfo}>
  //           <Text
  //             style={[
  //               getStatusStyle(appointment.status),
  //               { fontFamily: 'Poppins-SemiBold' },
  //             ]}
  //           >
  //             {getStatusText(appointment.status)}
  //           </Text>
  //           <Text style={styles.doctorText}>
  //             Dr. {doctorName} ·{' '}
  //             <Text style={styles.timeText}>
  //               {appointment.start_time?.substring(0, 5)}
  //             </Text>
  //           </Text>
  //           {/* <Text style={styles.dateText}>
  //             {formatDate(appointment.appointment_date)}
  //           </Text> */}
  //           {/* {appointment.notes && (
  //             <Text style={styles.notesText} numberOfLines={1}>
  //               {appointment.notes}
  //             </Text>
  //           )} */}
  //         </View>
  //       <TouchableOpacity
  //         style={styles.joinButton}
  //         // onPress={() => {
  //         //   console.log('Join Appointment:', appointment.id);
  //         //   // navigation.navigate('VideoCall', { id: appointment.id });
  //         // }}
  //       >
  //         <Text style={styles.joinText}>Join</Text>
  //       </TouchableOpacity>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };
// Function to render appointment card
const renderAppointmentCard = (appointment, index) => {
  const doctorName = `${appointment.doctor?.first_name || ''} ${
    appointment.doctor?.last_name || ''
  }`.trim();

  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        console.log('Appointment ID:', appointment?.id); // 👈 log ID here
        navigation.navigate('AppointmentDetails', {
          appointmentData: appointment,
        });
      }}
    >
      <View style={styles.appointmentRow}>
        <Image
          source={
            appointment.doctor?.profile_image
              ? {
                  uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/${appointment.doctor.profile_image}`,
                }
              : require('../assets/Images/Doctor.png')
          }
          style={styles.doctorImage}
        />
        <View style={styles.appointmentInfo}>
          <Text
            style={[
              getStatusStyle(appointment.status),
              { fontFamily: 'Poppins-SemiBold' },
            ]}
          >
            {getStatusText(appointment.status)}
          </Text>
          <Text style={styles.doctorText}>
            Dr. {doctorName} ·{' '}
            <Text style={styles.timeText}>
              {appointment.start_time?.substring(0, 5)}
            </Text>
          </Text>
        </View>



{appointment.status === 'scheduled' &&
 appointment.type === 'video' && (() => {
   const enabled = isJoinEnabled(appointment);

   return (
     <TouchableOpacity
       disabled={!enabled}
       style={[
         styles.joinButton,
         !enabled && styles.joinButtonDisabled,
       ]}
       onPress={() => {
         if (!enabled) return;

         console.log('Join Appointment:', appointment.id);
         // navigation.navigate('VideoCall', { id: appointment.id });
       }}
     >
       <Text style={styles.joinText}>
         {enabled ? 'Join' : 'Not Started'}
       </Text>
     </TouchableOpacity>
   );
 })()}

       
      </View>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity onPress={getAppointment}>
          <Icon name="refresh" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#248907" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Icon name="alert-circle-outline" size={60} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={getAppointment}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Upcoming Section */}
          {upcomingAppointments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming</Text>
              {upcomingAppointments.map((appointment, index) =>
                renderAppointmentCard(appointment, index),
              )}
            </View>
          )}
          

          {/* Past Section */}
          {pastAppointments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Past</Text>
              {pastAppointments.map((appointment, index) =>
                renderAppointmentCard(appointment, index),
              )}
            </View>
          )}

          {/* Empty State */}
          {upcomingAppointments.length === 0 &&
            pastAppointments.length === 0 && (
              <View style={styles.centerContainer}>
                <Icon name="calendar-blank-outline" size={80} color="#ccc" />
                <Text style={styles.emptyText}>No appointments found</Text>
                <Text style={styles.emptySubText}>
                  You don't have any appointments yet.
                </Text>
              </View>
            )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    fontFamily: 'Poppins-Medium',
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  doctorImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },
  appointmentInfo: {
    flex: 1,
  },
  statusConfirmed: {
    color: '#248907',
    fontWeight: '600',
    fontSize: 14,
  },
  statusCompleted: {
    color: '#1a73e8',
    fontWeight: '600',
    fontSize: 14,
  },
  statusCancelled: {
    color: '#d32f2f',
    fontWeight: '600',
    fontSize: 14,
  },
  doctorText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  timeText: {
    color: '#777',
    fontWeight: 'normal',
  },
  dateText: {
    color: '#777',
    fontSize: 13,
    marginTop: 2,
  },
  notesText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontFamily: 'Poppins-SemiBold',
  },
  errorText: {
    marginTop: 10,
    color: '#d32f2f',
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#248907',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  emptySubText: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  joinButton: {
  backgroundColor: '#248907',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 6,
  justifyContent: 'center',
  alignItems: 'center',
},

joinText: {
  color: '#fff',
  fontSize: 14,
  fontFamily: 'Poppins-SemiBold',
},

joinButtonDisabled: {
  backgroundColor: '#c8e6c9',
},

});

// import React, { useEffect, useState ,Linking} from 'react';
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Linking
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventsDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const getEventDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://argosmob.uk/bhardwaj-hospital/public/api/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
console.log("Events Detail",response.data.data);

      setEvent(response.data.data);
    } catch (error) {
      console.log('Event Detail API Error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventDetail();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff5722" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }
const openSocialUrl = async (url) => {
  if (!url || url.trim() === '') {
    return; // ❌ no log, no open
  }

  console.log('Opening social URL:', url); // ✅ log only valid URL

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch (error) {
    console.log('Failed to open URL:', url);
  }
};

const openFacebook = async (url) => {
  if (!url || url.trim() === '') {
    Alert.alert('Url Not Available', 'Facebook link not provided');
    return;
  }

  const webUrl = url.startsWith('http') ? url : `https://${url}`;
  const fbAppUrl = webUrl.replace(
    'https://www.facebook.com',
    'fb://facewebmodal/f?href='
  );

  try {
    await Linking.openURL(fbAppUrl);
  } catch {
    await Linking.openURL(webUrl);
  }
};


const openSocialLink = async (url, platformName) => {
  if (!url || url.trim() === '') {
    Alert.alert(
      'Url Not Available Geting null',
      `${platformName} link not provided by organizer`
    );
    return;
  }

  const finalUrl = url.startsWith('http') ? url : `https://${url}`;

  try {
    const supported = await Linking.canOpenURL(finalUrl);
    if (supported) {
      await Linking.openURL(finalUrl);
    } else {
      Alert.alert('Error', 'Cannot open this link Getting url is null');
    }
  } catch (error) {
    Alert.alert('Error', 'Something went wrong while opening the link');
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
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Event Image */}
 <Text style={styles.eventOrganizer}>
    {event.organizer || 'Organizer not available'}
  </Text>
        <Image
          source={{
            uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/events/${event.image}`,
          }}
          style={styles.eventImage}
        />

        {/* Title */}
        <Text style={styles.eventTitle}>{event.title}</Text>

        {/* Type */}
        <Text style={styles.eventType}>
          {event.type.replace('_', ' ').toUpperCase()}
        </Text>
 <Text style={styles.info}>
       Contact Person :- {event.contact_person || 'contact person not available'}

  </Text>
  <Text style={styles.info}>
   Contact Number :- {event.contact_number || 'contact number not available'}
  </Text>
  <Text style={[styles.info,{marginBottom:8}]}>
   Email :-  {event.email || 'Organizer not available'}
  </Text>
        {/* Description */}
        <Text style={styles.eventDesc}>{event.description}</Text>

        {/* Date */}
        <View style={styles.row}>
          <Icon name="calendar" size={16} color="#666" />
          <Text style={styles.metaText}>
            {new Date(event.event_date).toDateString()}
          </Text>
        </View>

        {/* Time */}
        <View style={styles.row}>
          <Icon name="clock-outline" size={16} color="#666" />
          <Text style={styles.metaText}>
            {event.start_time} - {event.end_time}
          </Text>
        </View>

        {/* Venue */}
        <View style={styles.row}>
          <Icon name="map-marker" size={16} color="#666" />
          <Text style={styles.metaText}>{event.venue}</Text>
        </View>

       <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
  {/* Facebook */}
  <TouchableOpacity onPress={() => openFacebook(event.facebook_url)}>
  <Image
    source={require('../assets/facebook.png')} // make sure file name is correct
    style={{ width: 50, height: 50 }} // adjust size as needed
    resizeMode="contain"
  />
</TouchableOpacity>

  {/* Instagram */}
<TouchableOpacity onPress={() =>
      openSocialLink(event.instagram_url, 'Instagram')
    }>
  <Image
    source={require('../assets/instagram.png')} // make sure file name is correct
    style={{ width: 50, height: 50 }} // adjust size as needed
    resizeMode="contain"
  />
</TouchableOpacity>

<TouchableOpacity  onPress={() =>
      openSocialLink(event.linkedin_url, 'LinkedIn')
    }>
  <Image
    source={require('../assets/linkedin.png')} // make sure file name is correct
    style={{ width: 50, height: 50 }} // adjust size as needed
    resizeMode="contain"
  />
</TouchableOpacity>
<TouchableOpacity  
    >
  <Image
    source={require('../assets/feedback.png')} // make sure file name is correct
    style={{ width: 50, height: 50 }} // adjust size as needed
    resizeMode="contain"
  />
</TouchableOpacity>

</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#999',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  fontFamily:"Poppins-SemiBold",
      marginRight: 24,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  eventTitle: {
    fontSize: 20,
    color: '#000',
    marginBottom: 6,
      fontFamily:"Poppins-SemiBold",
  },
  eventType: {
    fontSize: 14,
    color: '#ff5722',
    fontWeight: '600',
    marginBottom: 12,
  },
  eventDesc: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
      fontFamily:"Poppins-Regular",

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
          fontFamily:"Poppins-Regular",

  },
eventOrganizer: {
  fontSize: 20,
          fontFamily:"Poppins-Medium",
  color: '#333',
  marginBottom: 8,
  textAlign: "center"  // <-- centers the text
},
info:{
      fontSize: 15,
  color: '#333',
  marginBottom: 2,
          fontFamily:"Poppins-Regular",
}

});

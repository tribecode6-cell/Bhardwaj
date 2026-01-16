import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import{useRoute} from "@react-navigation/native";
import axios from 'axios';

const DoctorDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {doctorId} =route.params;
  const [doctor, setDoctor] = useState(null);
  const [ loading,setLoading] = useState(true);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const [selectedDay, setSelectedDay] = useState(null);



  const getDoctorById = async () => {
    try{
      const response = await axios.get(
        `https://argosmob.uk/bhardwaj-hospital/public/api/doctors/${doctorId}`
      );
      setDoctor(response.data?.data);
      console.log("Doctor ID ", response.data?.data)

      console.log()
    }catch(error){
      console.log("GET BY ID ERROR", error.response?.data|| error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(doctorId){
      getDoctorById ();
    }
  },[doctorId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{doctor? doctor.first_name+" "+ doctor.last_name:"Loading"}</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Doctor Info */}
        <View style={styles.profileSection}>
          <Image
            source={  doctor?.profile_image ?{uri:doctor.profile_image}:require('../assets/Images/Doctor.png')}
            style={styles.profileImage}
          />
          <Text style={styles.doctorName}>{doctor? doctor.first_name+" "+ doctor.last_name:"Loading"} </Text>
          <Text style={styles.specialization}>{doctor?.specialty?.name || "N/A"}</Text>
          <Text style={styles.experience}>{doctor?.experience ? `${doctor.experience} years experience` : "Experience not available"}</Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
           {doctor?.bio}
          </Text>
        </View>

        {/* Specialization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialization</Text>
          <Text style={styles.infoText}>{doctor?.specialty?.name}</Text>
        </View>

       <View style={styles.section}>
  <Text style={styles.sectionTitle}>Available Days</Text>

  <FlatList
    data={days}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item}
    contentContainerStyle={{ paddingVertical: 10 }}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={[
          styles.dayButton,
          selectedDay === item && styles.dayButtonSelected
        ]}
        onPress={() => setSelectedDay(item)}
      >
        <Text
          style={[
            styles.dayText,
            selectedDay === item.working_days && styles.dayTextSelected
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    )}
  />
</View>


        
        {/* <View style={styles.section}> */}
          {/* <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingNumber}>4.8</Text>
            <View style={styles.starRow}>
              <Icon name="star" size={20} color="#ff5500" />
              <Icon name="star" size={20} color="#ff5500" />
              <Icon name="star" size={20} color="#ff5500" />
              <Icon name="star" size={20} color="#ff5500" />
              <Icon name="star-half-full" size={20} color="#ff5500" />
            </View>
          </View>
          <Text style={styles.reviewCount}>125 reviews</Text> */}

          {/* Rating Bars */}
          {/* {[
            { stars: 5, percent: 70 },
            { stars: 4, percent: 20 },
            { stars: 3, percent: 5 },
            { stars: 2, percent: 3 },
            { stars: 1, percent: 2 },
          ].map((item, index) => (
            <View key={index} style={styles.barRow}>
              <Text style={styles.barLabel}>{item.stars}</Text>
              <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${item.percent}%` }]} />
              </View>
              <Text style={styles.barPercent}>{item.percent}%</Text>
            </View>
          ))} */}

        
          {/* <View style={styles.reviewCard}>
            <Image
              source={require('../assets/Images/Doctor.png')}
              style={styles.reviewerImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewerName}>Sophia Bennett</Text>
              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={16} color="#ff5500" />
                ))}
              </View>
              <Text style={styles.reviewText}>
                Dr. Harper was incredibly thorough and explained everything clearly. 
                I felt very comfortable and confident in her care.
              </Text>
              <View style={styles.reactionRow}>
                <Icon name="thumb-up-outline" size={18} color="#888" />
                <Text style={styles.reactionText}>12</Text>
                <Icon name="comment-outline" size={18} color="#888" style={{ marginLeft: 10 }} />
                <Text style={styles.reactionText}>1</Text>
              </View>
            </View>
          </View> */}

          {/* <View style={styles.reviewCard}>
            <Image
              source={require('../assets/Images/Doctor.png')}
              style={styles.reviewerImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewerName}>Olivia Carter</Text>
              <View style={styles.starRow}>
                {[...Array(4)].map((_, i) => (
                  <Icon key={i} name="star" size={16} color="#ff5500" />
                ))}
              </View>
              <Text style={styles.reviewText}>
                Dr. Harper was knowledgeable and helpful, but the wait time was a bit long.
              </Text>
              <View style={styles.reactionRow}>
                <Icon name="thumb-up-outline" size={18} color="#888" />
                <Text style={styles.reactionText}>8</Text>
                <Icon name="comment-outline" size={18} color="#888" style={{ marginLeft: 10 }} />
                <Text style={styles.reactionText}>2</Text>
              </View>
            </View>
          </View> */}
        {/* </View> */}

        {/* Book Button */}
      <View style={{marginTop:60,}}>
          <TouchableOpacity  
        onPress={()=>navigation.navigate('BookAppointment',{doctorId})}
        style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorDetails;

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
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 25,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 10,
  },
  specialization: {
    fontSize: 15,
    color: '#777',
  },
  experience: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  aboutText: {
    color: '#555',
    lineHeight: 20,
  },
  infoText: {
    color: '#444',
    fontSize:12,
    fontWeight:'500',
  },
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slotButton: {
    backgroundColor: '#ff5500',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  slotButtonSecondary: {
    backgroundColor: '#ff5500',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  slotText: {
    color: '#fff',
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginRight: 10,
  },
  starRow: {
    flexDirection: 'row',
  },
  reviewCount: {
    color: '#777',
    marginBottom: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  barLabel: {
    width: 15,
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 8,
  },
  barFill: {
    height: 6,
    backgroundColor: '#ff5500',
    borderRadius: 5,
  },
  barPercent: {
    width: 35,
    textAlign: 'right',
    color: '#555',
    fontSize: 13,
  },
  reviewCard: {
    flexDirection: 'row',
    marginTop: 20,
  },
  reviewerImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  reviewText: {
    color: '#555',
    marginTop: 5,
    lineHeight: 18,
  },
  reactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  reactionText: {
    color: '#666',
    fontSize: 13,
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#ff5500',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 30,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  dayButton: {
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 10,
  backgroundColor: "#f5f5f5",
  marginRight: 10,
  borderWidth: 1,
  borderColor: "#ddd",
},

dayButtonSelected: {
  backgroundColor: "#ff5500",
  borderColor: "#ff5500",
},

dayText: {
  fontSize: 15,
  fontWeight: "600",
  color: "#000",
},

dayTextSelected: {
  color: "#fff",
},

});

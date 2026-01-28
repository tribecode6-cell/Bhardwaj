import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const Form = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '123456',
    gender: '',
    age: '',
    address: '',
    emergencyContact: '',
    alternateContact: '',
    history: '',
  });

  const [photo, setPhoto] = useState(null);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response?.assets?.length > 0) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  const handleRegister = async () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.gender ||
      !form.age ||
      !form.address ||
      !form.emergencyContact ||
      !form.alternateContact
    )
      if (form.phone.length !== 10) {
        // {
        //   Alert.alert("Missing Information", "Please fill all required fields.");
        //   return;
        // }
        Alert.alert('Invalid Number', 'Phone number must be 10 digits.');
        return;
      }

    if (form.emergencyContact.length !== 10) {
      Alert.alert('Invalid Number', 'Phone number must be 10 digits.');
      return;
    }
    if (form.alternateContact.length !== 10) {
      Alert.alert('Invalid Number', 'Phone number must be 10 digits.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('name', form.fullName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('password', '123456');
      formData.append('gender', form.gender);
      formData.append('age', form.age);
      formData.append('address', form.address);
      formData.append('emergency_contact_number', form.emergencyContact);
      formData.append('alternate_contact_number', form.alternateContact);
      formData.append('basic_medical_history', form.history);
      console.log('Form', formData);

      if (photo) {
        formData.append('profile_image', {
          uri: photo,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      const response = await axios.post(
        'https://argosmob.uk/bhardwaj-hospital/public/api/auth/register',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      console.log('API Response:', response.data.status);

      if (response.data?.status == 'true') {
        Alert.alert('Success', 'Registration Complete!');

        navigation.navigate('Login', {
          userData: form,
          photo: photo,
        });
      } else {
        Alert.alert('Error', response.data.error || 'Failed to register.');
      }
    } catch (error) {
      console.log('API Error:', error?.response?.data);
      Alert.alert(
        'Error',
        error?.response?.data?.error || 'Something went wrong, try again.',
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient Registration</Text>
        </View>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          value={form.fullName}
          onChangeText={val => setForm({ ...form, fullName: val })}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={val => setForm({ ...form, email: val })}
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={val => setForm({ ...form, phone: val })}
        />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.gender}
            onValueChange={val => setForm({ ...form, gender: val })}
          >
            <Picker.Item label="Select gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter age"
          keyboardType="numeric"
          value={form.age}
          onChangeText={val => setForm({ ...form, age: val })}
        />

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          multiline
          value={form.address}
          onChangeText={val => setForm({ ...form, address: val })}
        />

        {/* Emergency Contact */}
        <Text style={styles.label}>Emergency Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={form.emergencyContact}
          onChangeText={val => setForm({ ...form, emergencyContact: val })}
        />

        {/* Alternate Contact */}
        <Text style={styles.label}>Alternate Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={form.alternateContact}
          onChangeText={val => setForm({ ...form, alternateContact: val })}
        />

        {/* History */}
        <Text style={styles.label}>Basic Medical History</Text>
        <TextInput
          style={[styles.input, { height: 90 }]}
          multiline
          placeholder="Enter medical history"
          value={form.history}
          onChangeText={val => setForm({ ...form, history: val })}
        />

        {/* Upload */}
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBox} onPress={handleImagePick}>
            <Icon name="image-plus" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.uploadTextRight}>Upload Profile Photo</Text>
        </View>

        {photo && (
          <Image source={{ uri: photo }} style={styles.uploadedImage} />
        )}

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>
            {loading ? 'Please wait...' : 'Register'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: '#000',
    marginLeft: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
    marginTop: 12,
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: '#f1f6f7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  pickerContainer: {
    backgroundColor: '#f1f6f7',
    borderRadius: 8,
  },
  uploadRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  uploadBox: {
    backgroundColor: '#ff5a00',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  uploadTextRight: {
    left: 30,
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  uploadedImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginTop: 15,
    alignSelf: 'center',
  },
  registerButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 30,
    fontFamily: 'Poppins-SemiBold',
  },
  registerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

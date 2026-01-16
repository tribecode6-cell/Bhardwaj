import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BookAppointment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { doctorId } = route.params;

  const [selectedDate, setSelectedDate] = useState("");
  const [appointmentType, setAppointmentType] = useState("in-person");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  // Time slot states
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Backend booked slots
  const [bookedSlots, setBookedSlots] = useState([]);

  // Time slot list
  const slots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM",
  ];

  // Fetch Booked Slots from API
  const fetchBookedSlots = async (date) => {
    try {
      const response = await axios.get(
        "https://argosmob.uk/bhardwaj-hospital/public/api/booked-slots",
        { params: { doctor_id: doctorId, date: selectedDate } }
      );

      setBookedSlots(response.data?.slots || []);
    } catch (err) {
      console.log("❌ Slot Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (selectedDate) fetchBookedSlots();
  }, [selectedDate]);

  // When user selects slot → auto-set start/end time
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStartTime(slot);

    const index = slots.indexOf(slot);
    const nextSlot = slots[index + 1] || null;
    setEndTime(nextSlot || slot); // If last slot, same end-time
  };

  // ---------- RESOURCES ----------
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState("");
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);

  const getResources = async () => {
    try {
      const response = await axios.get(
        "https://argosmob.uk/bhardwaj-hospital/public/api/get-resources"
      );
      setResources(response.data?.data || []);
    } catch (err) {
      console.log("❌ Resource API Error:", err);
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  // ---------- BOOK APPOINTMENT API ----------
  const bookAppointmentAPI = async () => {
    if (!selectedDate || !startTime || !selectedResource) {
      alert("❗ Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const payload = {
        doctor_name: doctorId,
        appointment_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        patient_name: "",
        notes: symptoms,
        resource_name: selectedResource,
        appointment_type: appointmentType,
      };

      const response = await axios.post(
        "https://argosmob.uk/bhardwaj-hospital/public/api/appointments/save",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("🎉 Appointment booked successfully!");
      navigation.navigate("Appointment");
    } catch (error) {
      console.log("❌ Booking API ERROR:", error.response?.data || error.message);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Calendar */}
        <Calendar
          minDate={new Date()}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#ff5500" },
          }}
          theme={{ arrowColor: "#ff5500", todayTextColor: "#ff5500" }}
          style={styles.calendar}
        />

        {/* TIME SLOTS */}
        <Text style={styles.timeTitle}>Select Time</Text>
        <View style={styles.slotContainer}>
          {slots.map((slot, index) => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selectedSlot === slot;

            return (
              <TouchableOpacity
                key={index}
                disabled={isBooked}
                onPress={() => setSelectedSlot(slot)}
                style={[
                  styles.slotBox,
                  isSelected && styles.selectedSlot,   // Orange
                  isBooked && styles.bookedSlot        // Grey
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    (isSelected || isBooked) && { color: "#fff" }
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>


        {/* RESOURCE DROPDOWN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Resource</Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowResourceDropdown(!showResourceDropdown)}
          >
            <Text style={styles.dropdownText}>
              {selectedResource || "Select resource"}
            </Text>
          </TouchableOpacity>

          {showResourceDropdown && (
            <View style={styles.dropdownPanel}>
              <ScrollView style={{ maxHeight: 200 }}>
                {resources.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.option}
                    onPress={() => {
                      setSelectedResource(item.name);
                      setShowResourceDropdown(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Symptoms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe Symptoms</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Type here..."
            multiline
            value={symptoms}
            onChangeText={setSymptoms}
          />
        </View>

        {/* Appointment Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Type</Text>

          {["in-person", "video"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeOption,
                appointmentType === type && styles.typeSelected,
              ]}
              onPress={() => setAppointmentType(type)}
            >
              <Text style={styles.typeTitle}>
                {type === "in-person" ? "In Person" : "Video Call"}
              </Text>
              <Icon
                name={
                  appointmentType === type
                    ? "radiobox-marked"
                    : "radiobox-blank"
                }
                size={22}
                color="#ff5500"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={bookAppointmentAPI}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Confirm Appointment</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default BookAppointment;

// ---------------- STYLES -------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  calendar: { borderRadius: 12, elevation: 2, marginTop: 10 },

  timeTitle: { fontSize: 18, fontWeight: "700", marginTop: 20 },



  selectedSlot: { backgroundColor: "#000" },
  bookedSlot: { backgroundColor: "#000", borderColor: "#000" },

  slotText: { color: "#ff5722", fontWeight: "600" },

  section: { marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },

  dropdownButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  dropdownText: { fontSize: 15 },
  dropdownPanel: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: "#fff",
    elevation: 6,
  },
  option: { padding: 12, borderBottomWidth: 1 },
  optionText: { fontSize: 15 },

  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 90,
    backgroundColor: "#f9f9f9",
  },

  typeOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  typeSelected: { backgroundColor: "#fff7f2", borderColor: "#ff5500" },
  typeTitle: { fontSize: 15 },

  confirmButton: {
    backgroundColor: "#ff5500",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
    marginBottom: '7%'
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  slotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingVertical: 10,
    // marginBottom:10,
  },

  slotBox: {
    width: "30%",
    backgroundColor: "#ff5722", // SAME ORANGE UI
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  selectedSlot: {
    backgroundColor: "#ff5722", 
    borderColor:'#000',
    borderWidth:2,
    // Keep selected same orange
  },

  bookedSlot: {
    backgroundColor: "#bfbfbf", // Booked slot grey (different color)
  },

  slotText: {
    color: "#fff",
    fontWeight: "600",
  },
});

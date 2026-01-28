import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 🔹 Single Report Item (NO API HERE)
const ReportItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.reportRow} onPress={onPress}>
      <View style={styles.iconBox}>
        <Icon name="file-document-outline" size={22} color="#fff" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.reportTitle}>{item.report_title}</Text>
        <Text style={styles.reportSubtitle}>
          {item.report_type} • {item.record_date}
        </Text>

        <Text style={styles.patientName}>Patient: {item.patient?.name}</Text>
      </View>

      <Icon name="chevron-right" size={22} color="#333" />
    </TouchableOpacity>
  );
};

const ReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔹 API CALL
  const getMedicalReports = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      const response = await axios.get(
        'https://argosmob.uk/bhardwaj-hospital/public/api/medical-reports',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      setReports(response.data?.data || []);
    } catch (error) {
      console.log(
        'MEDICAL REPORT API ERROR:',
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMedicalReports();
  }, []);

  // 🔹 SEARCH FILTER
  const filteredReports = reports.filter(item =>
    item.report_title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Icon name="magnify" size={20} color="#666" />
        <TextInput
          placeholder="Search reports"
          placeholderTextColor="#999"
          style={{ flex: 1, marginLeft: 10 ,  fontFamily:"Poppins-Regular"}}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* REPORT LIST */}
      <FlatList
        data={filteredReports}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
        renderItem={({ item }) => (
          <ReportItem
            item={item}
            onPress={() =>
              navigation.navigate('ReportView', { reportId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>No medical reports found</Text>
          )
        }
      />
    </SafeAreaView>
  );
};

export default ReportsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontWeight: '600',
    marginRight: 24,
  fontFamily:"Poppins-Medium",

  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f4f6',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
  },

  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#ff5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
  fontFamily:"Poppins-Medium",

  },

  reportSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  fontFamily:"Poppins-Regular",

  },

  patientName: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
      fontFamily:"Poppins-Regular",

  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
      fontFamily:"Poppins-Regular",

  },
});

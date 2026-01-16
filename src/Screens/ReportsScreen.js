import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const ReportItem = ({ title, subtitle }) => {
  return (
    <View style={styles.reportRow}>
      <View style={styles.iconBox}>
        <Icon name="file-document-outline" size={22} color="#fff" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.reportTitle}>{title}</Text>
        <Text style={styles.reportSubtitle}>{subtitle}</Text>
      </View>

      <TouchableOpacity>
        <Icon name="download-outline" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const ReportsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ paddingHorizontal: 20 }}>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color="#666" />
          <TextInput
            placeholder="Search  reports"
            placeholderTextColor="#999"
            style={{ flex: 1, marginLeft: 10 }}
          />
        </View>

        {/* Recent Reports */}
        <Text style={styles.sectionTitle}>Recent Reports</Text>

        {/* Filter Buttons */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Date</Text>
            <Icon name="chevron-down" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Type</Text>
            <Icon name="chevron-down" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Recent Reports List */}
        <TouchableOpacity onPress={()=>navigation.navigate('ReportView')}>
          <ReportItem title="Blood Test Results" subtitle="Lab Report" />
        </TouchableOpacity>
       <TouchableOpacity>
         <ReportItem title="MRI Scan" subtitle="Radiology Report" />
       </TouchableOpacity>
        <TouchableOpacity>
          <ReportItem title="Hospital Discharge" subtitle="Discharge Summary" />
        </TouchableOpacity>

        {/* Older Reports */}
        <Text style={styles.sectionTitle}>Older Reports</Text>
        <TouchableOpacity>
          <ReportItem title="Urinalysis Results" subtitle="Lab Report" />
        </TouchableOpacity>
       <TouchableOpacity>
         <ReportItem title="X-Ray Scan" subtitle="Radiology Report" />
       </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    padding: 15,
    marginTop:10,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f4f6',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 10,
  },

  filterRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  filterBtn: {
    backgroundColor: '#ff5722',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },

  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
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
  },

  reportSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});

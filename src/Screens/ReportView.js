// Using react-native-print (already installed in your package.json)
// Just install: npm install react-native-share --legacy-peer-deps

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNPrint from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const ReportView = ({ route }) => {
  const navigation = useNavigation();
  const { reportId } = route.params;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Fetch report data
  const getReport = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await axios.get(
        `https://argosmob.uk/bhardwaj-hospital/public/api/medical-reports/${reportId}`,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        }
      );
      setReport(res.data?.data);
    } catch (error) {
      console.log('Report API Error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReport();
  }, []);

  // Generate HTML content for PDF
  const generateHTMLContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.report_title || 'Medical Report'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Helvetica', 'Arial', sans-serif;
      padding: 40px;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 4px solid #ff5722;
    }
    h1 { 
      color: #ff5722; 
      font-size: 32px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .report-type {
      color: #666;
      font-size: 18px;
      font-style: italic;
      margin-top: 8px;
    }
    .section {
      margin: 30px 0;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 10px;
      border-left: 6px solid #ff5722;
      page-break-inside: avoid;
    }
    .section-title {
      color: #ff5722;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field {
      margin: 12px 0;
      padding-left: 10px;
      font-size: 15px;
    }
    .field strong {
      color: #000;
      display: inline-block;
      min-width: 180px;
      font-weight: 600;
    }
    .value {
      color: #555;
      line-height: 1.8;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      color: #999;
      font-size: 13px;
    }
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${report.report_title || 'Medical Report'}</h1>
    <div class="report-type">${report.report_type || 'General Report'}</div>
  </div>

  <div class="section">
    <div class="section-title">Patient Details</div>
    <div class="field"><strong>Name:</strong> <span class="value">${report.patient?.name || 'N/A'}</span></div>
    <div class="field"><strong>Gender:</strong> <span class="value">${report.patient?.gender || 'N/A'}</span></div>
    <div class="field"><strong>Phone:</strong> <span class="value">${report.patient?.phone || 'N/A'}</span></div>
    <div class="field"><strong>Address:</strong> <span class="value">${report.patient?.address || 'N/A'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Doctor Information</div>
    <div class="field"><strong>Doctor:</strong> <span class="value">${report.doctor?.name || 'N/A'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Diagnosis</div>
    <div class="field"><span class="value">${report.diagnosis || 'N/A'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Symptoms</div>
    <div class="field"><span class="value">${report.symptoms || 'N/A'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Treatment Plan</div>
    <div class="field"><span class="value">${report.treatment_plan || 'N/A'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Vitals</div>
    <div class="field"><strong>Blood Pressure:</strong> <span class="value">${report.vitals?.blood_pressure || 'N/A'}</span></div>
    <div class="field"><strong>Temperature:</strong> <span class="value">${report.vitals?.temperature || 'N/A'}</span></div>
    <div class="field"><strong>Height:</strong> <span class="value">${report.vitals?.height || 'N/A'}</span></div>
    <div class="field"><strong>Weight:</strong> <span class="value">${report.vitals?.weight || 'N/A'}</span></div>
  </div>

  ${report.notes ? `
  <div class="section">
    <div class="section-title">Doctor Notes</div>
    <div class="field"><span class="value">${report.notes}</span></div>
  </div>
  ` : ''}

  <div class="footer">
    <p><strong>Bhardwaj Hospital Management System</strong></p>
    <p>Generated on ${new Date().toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })} at ${new Date().toLocaleTimeString('en-IN')}</p>
  </div>
</body>
</html>`;
  };

  // Method 1: Print to PDF (Opens system print dialog)
  const printToPDF = async () => {
    if (!report) {
      Alert.alert('Error', 'No report data available');
      return;
    }

    try {
      setDownloading(true);
      const html = generateHTMLContent();

      await RNPrint.print({
        html: html,
      });

      Alert.alert('Success', 'Report ready to print/save as PDF!');
    } catch (error) {
      console.log('Print error:', error);
      if (error.message !== 'User cancelled print') {
        Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      }
    } finally {
      setDownloading(false);
    }
  };

  // Method 2: Direct PDF Download (if react-native-html-to-pdf works)
  const downloadPDF = async () => {
    if (!report) {
      Alert.alert('Error', 'No report data available');
      return;
    }

    try {
      setDownloading(true);
      const html = generateHTMLContent();

      const options = {
        html: html,
        fileName: `MedicalReport_${report.report_title?.replace(/[^a-z0-9]/gi, '_') || 'Report'}_${Date.now()}`,
        directory: Platform.OS === 'ios' ? 'Documents' : 'Downloads',
      };

      const file = await RNHTMLtoPDF.convert(options);
      
      Alert.alert(
        'PDF Downloaded',
        `Report saved successfully!\n\nLocation: ${file.filePath}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('PDF Download error:', error);
      Alert.alert(
        'Download Failed',
        'Could not save PDF directly. Please use "Print to PDF" option.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Print to PDF', onPress: printToPDF }
        ]
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ff5722" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Report not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Report</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Report Info */}
        <View style={styles.card}>
          <Text style={styles.title}>{report.report_title}</Text>
          <Text style={styles.subTitle}>{report.report_type}</Text>
        </View>

        {/* Patient Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Patient Details</Text>
          <Text style={styles.value}>Name: {report.patient?.name}</Text>
          <Text style={styles.value}>Gender: {report.patient?.gender}</Text>
          <Text style={styles.value}>Phone: {report.patient?.phone}</Text>
          <Text style={styles.value}>Address: {report.patient?.address}</Text>
        </View>

        {/* Doctor */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Doctor</Text>
          <Text style={styles.value}>{report.doctor?.name}</Text>
        </View>

        {/* Diagnosis */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <Text style={styles.value}>{report.diagnosis}</Text>
        </View>

        {/* Symptoms */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Symptoms</Text>
          <Text style={styles.value}>{report.symptoms}</Text>
        </View>

        {/* Treatment Plan */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Treatment Plan</Text>
          <Text style={styles.value}>{report.treatment_plan}</Text>
        </View>

        {/* Vitals */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vitals</Text>
          <Text style={styles.value}>Blood Pressure: {report.vitals?.blood_pressure}</Text>
          <Text style={styles.value}>Temperature: {report.vitals?.temperature}</Text>
          <Text style={styles.value}>Height: {report.vitals?.height}</Text>
          <Text style={styles.value}>Weight: {report.vitals?.weight}</Text>
        </View>

        {/* Notes */}
        {report.notes && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Doctor Notes</Text>
            <Text style={styles.value}>{report.notes}</Text>
          </View>
        )}

        {/* Download Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.downloadButton, downloading && styles.buttonDisabled]} 
            onPress={printToPDF}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon name="file-pdf-box" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.downloadText}>Generate PDF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
          Tap the button above to open print dialog, then select "Save as PDF"
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportView;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: 18, 
    color: '#000',
      fontFamily:"Poppins-SemiBold",

  },
  scrollContent: { 
    paddingBottom: 30 
  },
  card: { 
    backgroundColor: '#f9f9f9', 
    marginHorizontal: 16, 
    marginTop: 12, 
    padding: 16, 
    borderRadius: 12, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: { 
    fontSize: 20, 
    color: '#000' ,
          fontFamily:"Poppins-SemiBold",

  },
  subTitle: { 
    fontSize: 14, 
    color: '#ff5722', 
    marginTop: 6, 
    fontWeight: '600' ,
              fontFamily:"Poppins-SemiBold",

  },
  sectionTitle: { 
    fontSize: 16, 
    marginBottom: 8, 
    color: '#000' ,
              fontFamily:"Poppins-SemiBold",

  },
  value: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 4,
    lineHeight: 20,
          fontFamily:"Poppins-Regular",

  },
  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  downloadButton: { 
    backgroundColor: '#ff5722', 
    padding: 14, 
    borderRadius: 10, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  printButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ff5722',
  },
  downloadText: { 
    color: '#fff', 
    fontSize: 16 ,
      fontFamily:"Poppins-SemiBold",
  },
  printText: {
    color: '#ff5722',
    fontWeight: '700',
    fontSize: 16,
      fontFamily:"Poppins-SemiBold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  infoText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 16,
    marginHorizontal: 16,
    // fontStyle: 'italic',
                  fontFamily:"Poppins-Regular",

  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
      fontFamily:"Poppins-Regular",

  },
});
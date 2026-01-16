import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const ActionButton = ({ icon, label }) => (
  <View style={styles.actionContainer}>
    <View style={styles.actionIconBox}>
      <Icon name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);

const ReportView = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {/* Preview Box */}
        <View style={styles.previewBox}>
          <Icon name="play-circle" size={50} color="#fff" />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity>
          <ActionButton icon="magnify" label="View" />
        </TouchableOpacity>
        <TouchableOpacity>
          {' '}
          <ActionButton icon="download" label="Download" />
        </TouchableOpacity>
        <TouchableOpacity>
          <ActionButton icon="share-variant" label="Share" />
        </TouchableOpacity>
        <TouchableOpacity>
          {' '}
          <ActionButton icon="printer" label="Print" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportView;

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

  previewBox: {
    width: '90%',
    height: 180,
    backgroundColor: '#2f4f4f',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  actionContainer: {
    alignItems: 'center',
    marginTop: 25,
  },

  actionIconBox: {
    width: 55,
    height: 55,
    backgroundColor: '#ff5722',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionLabel: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Notifications = () => {
  const navigation = useNavigation();

  // 🔹 Mock data (replace with API later)
  const notifications = [
    {
      id: 1,
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Sharma is confirmed.',
      time: '10 mins ago',
      read: false,
    },
    {
      id: 2,
      title: 'Appointment Rescheduled',
      message: 'Your appointment has been rescheduled to 21 Jan.',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 3,
      title: 'New Message',
      message: 'Dr. Verma sent you a message.',
      time: 'Yesterday',
      read: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="bell-off-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.notificationCard,
                !item.read && styles.unreadCard,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name={
                    item.title.includes('Message')
                      ? 'message-text'
                      : 'calendar-check'
                  }
                  size={20}
                  color="#fff"
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>

              {!item.read && <View style={styles.dot} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* ---------- HEADER ---------- */
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

  /* ---------- EMPTY STATE ---------- */
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: '#999',
                fontFamily: 'Poppins-Medium',

  },

  /* ---------- NOTIFICATION CARD ---------- */
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  unreadCard: {
    backgroundColor: '#eef5ff',
  },

  /* ---------- ICON ---------- */
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4f8cff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  /* ---------- TEXT ---------- */
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
                fontFamily: 'Poppins-Medium',

  },
  message: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
        fontFamily: 'Poppins-Regular',

  },
  time: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
        fontFamily: 'Poppins-Regular',

  },

  /* ---------- UNREAD DOT ---------- */
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4f8cff',
    marginLeft: 8,
  },
});

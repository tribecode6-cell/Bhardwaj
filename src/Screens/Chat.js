import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://argosmob.uk/bhardwaj-hospital/public/api';

const Chat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId,doctorName,doctorImage } = route.params || {};
  console.log('Appointment ID in Chat:', appointmentId);

  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // 🔹 Fetch messages function
  const fetchMessages = async (convId) => {
    if (!convId) return;

    try {
      const token = await AsyncStorage.getItem('access_token');
      
      const messagesResponse = await axios.get(
        `${baseURL}/chat/${convId}/messages`,
        {
          headers: { 
            Authorization: `Bearer ${token}`, 
            Accept: 'application/json' 
          }
        }
      );

      console.log('Fetched Messages 👉', messagesResponse.data);

      // if (messagesResponse.data?.data?.messages) {
      //   const formattedMessages = messagesResponse.data.data.messages.map(msg => ({
      //     id: msg.id.toString(),
      //     text: msg.message,
      //     time: msg.created_at
      //       ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      //       : '',
      //     sender: msg.sender === 'doctor' ? 'doctor' : 'user',
      //   }));
      //   setMessages(formattedMessages);
      // }
      if (messagesResponse.data?.messages?.data) {
        const formattedMessages = messagesResponse.data.messages.data.map(msg => ({
          id: msg.id.toString(),
          text: msg.message,
          time: msg.created_at
            ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
          sender: msg.sender_type === 'doctor' ? 'doctor' : 'user',
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.log('Fetch Messages Error 👉', error.response?.data || error.message);
    }
  };

  // 🔹 Start conversation & fetch initial messages
  const startConversation = async () => {
    if (!appointmentId) {
      console.warn('⚠️ Missing appointment ID!');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');

      // 1️⃣ Start conversation
      const startResponse = await axios.post(
        `${baseURL}/chat/conversation/start`,
        { appointment_id: appointmentId, type: 'chat' },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );

      console.log('Conversation Start Response 👉', startResponse.data);

      const convId =
        startResponse.data?.conversation_id || startResponse.data?.data?.conversation_id;

      if (!convId) {
        console.warn('⚠️ No conversation_id returned!');
        return;
      }

      setConversationId(convId);

      // 2️⃣ Fetch initial messages
      await fetchMessages(convId);
    } catch (error) {
      console.log('Conversation Error 👉', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial conversation start
  useEffect(() => {
    startConversation();
  }, [appointmentId]);

  // 🔹 Poll for new messages every 5 seconds
  useEffect(() => {
    if (!conversationId) return;

    const interval = setInterval(() => {
      fetchMessages(conversationId);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [conversationId]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

    const userMessageText = input;
    const newMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
    };

    // Update UI immediately
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const token = await AsyncStorage.getItem('access_token');

      const res = await axios.post(
        `${baseURL}/chat/${conversationId}/message/send`,
        {
          message: userMessageText,
          message_type: 'text',
        },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );

      console.log('Message sent successfully ✅', res.data);

      // Fetch updated messages after a short delay to get server response
      setTimeout(() => fetchMessages(conversationId), 1000);
    } catch (error) {
      console.log('Send Message Error 👉', error.response?.data || error.message);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.doctorBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.doctorText]}>
          {item.text}
        </Text>
        <Text style={[styles.timeText, isUser ? styles.userTime : styles.doctorTime]}>
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            {/* <Image source={require('../assets/Images/Doctor.png')} style={styles.avatar} /> */}
          <Image
  source={doctorImage ? { uri: doctorImage } : require('../assets/Images/Doctor.png')}
  style={styles.avatar}
/>
            <View>
              <Text style={styles.doctorName}>{doctorName}</Text>
            </View>
          </View>

          <View />
        </View>

        {/* Chat List */}
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10 },
  headerCenter: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  doctorName: { fontSize: 16, fontWeight: '700', color: '#000' },

  chatContainer: { paddingHorizontal: 16, paddingVertical: 10, flexGrow: 1 },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 12, marginBottom: 10 },
  userBubble: { backgroundColor: '#E66A2C', alignSelf: 'flex-end', borderTopRightRadius: 0 },
  doctorBubble: { backgroundColor: '#f2f2f2', alignSelf: 'flex-start', borderTopLeftRadius: 0 },
  messageText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#fff' },
  doctorText: { color: '#000' },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  userTime: { color: '#ffe1d6' },
  doctorTime: { color: '#777' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 25, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 12 : 8, fontSize: 14, color: '#000' },
  sendButton: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#E66A2C', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
});
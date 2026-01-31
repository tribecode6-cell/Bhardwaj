import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const videos = [
  { id: '9NxeZfHdeFg' },
  { id: 'NnJ50lr1eWE' },
  { id: 'mN-_4ZsF9po' },
];

const Doctors = () => {
  const [search, setSearch] = useState('');

  const openYoutube = (videoId) => {
    const url = `https://youtu.be/${videoId}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.headerTitle}>Explore</Text>

        {/* SEARCH */}
<View style={styles.searchBox}>
  <Image
    source={require('../assets/search.png')} // or use Icon if you want
    style={{ width: 20, height: 20, tintColor: '#999' }}
  />
  <TextInput
    placeholder="Search videos..."
    style={styles.searchInput}
    value={search}
    onChangeText={setSearch}
  />
</View>


        {videos.map((item, index) => (
          <View key={item.id}>
            <TouchableOpacity
              style={styles.videoContainer}
              onPress={() => openYoutube(item.id)}
            >
              {/* Thumbnail */}
              <Image
                source={{ uri: `https://img.youtube.com/vi/${item.id}/0.jpg` }}
                style={styles.thumbnail}
              />

              {/* Center YouTube Icon */}
              <Image
                source={require('../assets/youtube.png')}
                style={styles.playIcon}
              />
            </TouchableOpacity>

            {index < videos.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Doctors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
    color: '#000',
        fontFamily: 'Poppins-SemiBold',

  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  playIcon: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f1f4f6',
  padding: 12,
  borderRadius: 12,
  marginBottom: 20,
},
searchInput: {
  flex: 1,
  marginLeft: 8,
  fontFamily: 'Poppins-Regular',
  color: '#000',
},

});

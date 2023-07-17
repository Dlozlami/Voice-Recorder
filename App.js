import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Modal, TextInput, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function App() {
  const [recording, setRecording] = useState();
  const [lastRecordingURI, setLastRecordingURI] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let intervalId;

    if (timerRunning) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 10);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timerRunning]);

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setTimer(0);
      setTimerRunning(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    setTimerRunning(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setLastRecordingURI(uri);
    console.log('Recording stopped and stored at', uri);

    setModalVisible(true); // Open the modal after stopping recording
  }

  async function playLastRecording() {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: lastRecordingURI });
      await soundObject.playAsync();
    } catch (error) {
      console.error('Failed to play the last recording', error);
    }
  }


  async function handleSave() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: lastRecordingURI });
    } catch (error) {
      console.error('Failed to load the last recording', error);
    }
  
    const recordingDetails = {
      rec_id: generateUniqueID(),
      user_id: 'uxdlozi',
      audio_name: fileName,
      audio_file: soundObject,
      duration: formatTime(timer),
    };
  
    try {
      await axios.post('http://10.255.66.152:8080/api/recordings', recordingDetails);
      console.log('Recording details sent successfully.');
    } catch (error) {
      console.error('Failed to send recording details', error);
    }
  
    setTimer(0);
    setFileName('');
    setModalVisible(false);
  }
  
  

  function formatTime(time) {
    const minutes = Math.floor(time / 6000).toString().padStart(2, '0');
    const seconds = Math.floor((time / 100) % 60).toString().padStart(2, '0');
    const milliseconds = (time % 100).toString().padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  }

  function generateUniqueID() {
    const now = new Date();
    const dateString = now.toISOString().replace(/[-:.TZ]/g, '');
    return `rec${dateString}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
      
        <Pressable
          onPress={recording ? stopRecording : startRecording}>
          <Text>{recording ? <Ionicons name="stop-circle-outline" size={48} color="white" />: <Ionicons name="mic" size={48} color="white" />}</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={playLastRecording} style={styles.playButton}>
          <Text style={styles.buttonText}>Play Last Recording</Text>
        </Pressable>
      </View>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter File Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setFileName}
            value={fileName}
            placeholder="File Name"
          />
          <Pressable onPress={handleSave}>
            <Text>Save</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  playButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

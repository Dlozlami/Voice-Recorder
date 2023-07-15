import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, Modal, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function App() {
  const [recording, setRecording] = useState();
  const [lastRecordingURI, setLastRecordingURI] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');

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
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
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

  function handleSave() {
    // Perform your save logic here using the fileName state variable
    console.log('Saving audio file as:', fileName);

    setFileName('');
    setModalVisible(false); // Close the modal after saving
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? <Ionicons name="stop-circle-outline" size={48} color="black" />: <Ionicons name="mic" size={48} color="white" />}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button
        title="Play Last Recording"
        onPress={playLastRecording}
        disabled={!lastRecordingURI} // Disable the button if there is no last recording URI
      />

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
          <Button title="Save" onPress={handleSave} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
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
});

import { Text, View, StyleSheet, Button, SafeAreaView } from "react-native";
import { useState, useEffect, useRef } from "react";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { Video } from "expo-av";
import { shareAsync } from "expo-sharing";
import { usePermissions } from "expo-media-library";

export default function Index() {
  const [hasCameraPermission, setHasCameraPermission] = useCameraPermissions();
  const [hasMicrophonePermission, setHasMicrophonePermission] =
    useMicrophonePermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    usePermissions({
      mediaLibrary: true,
      accessPrivileges: "all",
      permissions: "granted",
    });
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(undefined);
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState("front");

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      setHasCameraPermission(hasCameraPermission.status === "granted");
      setHasMicrophonePermission(hasMicrophonePermission.status === "granted");
      setHasMediaLibraryPermission(
        hasMediaLibraryPermission.status === "granted"
      );
    })();
  }, []);

  if (hasCameraPermission === null || hasMicrophonePermission === null) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission || !hasMicrophonePermission) {
    return <Text>Camera or Microphone permissions not granted</Text>;
  }

  const recordVideo = async () => {
    if (cameraReady && cameraRef.current) {
      setIsRecording(true);
      let options = {
        quality: "1080p",
        maxDuration: 60,
        mute: false,
      };

      try {
        const recordedVideo = await cameraRef.current.recordAsync(options);
        setVideo(recordedVideo);
      } catch (error) {
        console.error("Error during video recording:", error);
      } finally {
        setIsRecording(false);
      }
    } else {
      console.log("Camera is not ready yet");
    }
  };

  const stopVideoRecording = async () => {
    if (isRecording && cameraRef.current) {
      setIsRecording(false);
      await cameraRef.current.stopRecording();
    }
  };

  if (video) {
    let shareVideo = () => {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
        <Button title="Share" onPress={shareVideo} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={saveVideo} />
        ) : null}
        <Button title="Discard" onPress={() => setVideo(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <CameraView
      style={styles.container}
      type={facing}
      onCameraReady={() => setCameraReady(true)}
      ref={cameraRef}
    >
      <View style={styles.buttonContainer}>
        <Button
          title={isRecording ? "Stop Recording" : "Record Video"}
          onPress={isRecording ? stopVideoRecording : recordVideo}
        />
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  },
});

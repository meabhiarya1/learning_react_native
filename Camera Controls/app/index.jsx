import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function Index() {
  const [facing, setFacing] = useState("back");
  const [hasCameraPermissions, setCameraPermissions] = useCameraPermissions();
  const [hasMediaLibraryPermissions, setMediaLibraryPermissions] = useState();
  const [photo, setPhoto] = useState();
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const mediaLibraryPermissions =
        await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermissions(mediaLibraryPermissions.status === "granted");
    })();
  }, []);

  if (!hasCameraPermissions) {
    return <View />;
  }

  if (!hasCameraPermissions.granted) {
    <View style={styles.container}>
      <Text style={styles.message}>
        We need your permission to show the camera
      </Text>
      <Button onPress={setCameraPermissions} title="grant permission" />
    </View>;
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  let takepic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = async () => {
      try {
        // Create a temporary file path
        const fileUri = FileSystem.cacheDirectory + "shared_image.jpg";

        // Write the base64 data to the file
        await FileSystem.writeAsStringAsync(fileUri, photo.base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Use expo-sharing to share the image
        await Sharing.shareAsync(fileUri);

        // Optionally, delete the file after sharing
        await FileSystem.deleteAsync(fileUri);
      } catch (error) {
        console.error("Error sharing the image:", error.message);
      }
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermissions ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        type={facing}
        facing={facing}
        onCameraReady={() => console.log("camera ready")}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <Button
            title="Take Picture"
            onPress={takepic}
            style={styles.takePic}
          />
        </View>
      </CameraView>
      <View style={styles.buttonContainer}>
        <Button title="Recording On" onPress={takepic} style={styles.takePic} />
        <Button title="Recording Off" onPress={takepic} style={styles.takePic} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    // flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },

  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  takePic: {
    position: "absolute",
    bottom: 0,
    borderRadius: "100%",
  },

  image: {
    alignSelf: "stretch",
    flex: 1,
  },

  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Redirect to the /home tab after a short delay
      router.replace("/(tabs)/profile");
    }, 100); // Delay of 100ms or more
    return () => clearTimeout(timeoutId); // Cleanup
  }, [router]);

  return (
    <View style={styles.container}>
      <Text>Redirecting to Home...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

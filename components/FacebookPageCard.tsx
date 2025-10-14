import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FacebookPageCard() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: "https://via.placeholder.com/48x48.png?text=P" }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.title}>Phê Truyện</Text>
          <Text style={styles.follower}>1 follower</Text>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.fbButton}>
          <Ionicons name="logo-facebook" size={16} color="#1877f2" />
          <Text style={styles.fbButtonText}>Follow Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={16} color="#555" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: "#faf9f6",
    padding: 12,
    width: 250,
    elevation: 2,
    borderColor: "#eee",
    borderWidth: 1,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#f3e5ab",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontWeight: "bold", fontSize: 16, color: "#1a1a1a" },
  follower: { fontSize: 13, color: "#555" },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
    justifyContent: "flex-start",
  },
  fbButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e7f3ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  fbButtonText: {
    color: "#1877f2",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 13,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  shareButtonText: {
    color: "#555",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 13,
  },
});

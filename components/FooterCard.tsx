import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";

export default function FooterCard() {
  return (
    <View style={styles.footer}>
      <Text style={styles.email}>Email: monkeyd.test@gmail.com</Text>
      <Text style={styles.link}>
        Liên hệ hỗ trợ:{" "}
        <Text
          style={styles.linkText}
          onPress={() =>
            Linking.openURL(
              "https://www.facebook.com/profile.php?id=61575049593006"
            )
          }
        >
          https://www.facebook.com/profile.php?id=61575049593006
        </Text>
      </Text>
      <Text style={styles.desc}>
        Mọi thông tin và hình ảnh trên website đều được bên thứ ba đăng tải, Phê
        Truyện miễn trừ mọi trách nhiệm liên quan đến các nội dung trên website
        này. Nếu làm ảnh hưởng đến cá nhân hay tổ chức nào, khi được yêu cầu,
        chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức. Các vấn đề liên quan đến bản
        quyền hoặc thắc mắc khác, vui lòng liên hệ fanpage:{" "}
        <Text style={styles.bold}>Phê Truyện</Text>
      </Text>
      <Text style={styles.policy}>
        <Text style={styles.bold}>Chính sách và quy định chung</Text> -{" "}
        <Text style={styles.bold}>Chính sách bảo mật</Text> -{" "}
        <Text style={styles.bold}>Sitemap</Text>
      </Text>
      <Text style={styles.copyright}>
        Copyright © 2024. All right reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#f3aafc",
    alignItems: "center",
    padding: 16,
  },
  logo: {
    width: 120,
    height: 48,
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "#222",
    marginBottom: 4,
  },
  link: {
    fontSize: 14,
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  linkText: {
    color: "#1877f2",
    textDecorationLine: "underline",
  },
  desc: {
    fontSize: 13,
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#7c3aed",
  },
  policy: {
    fontSize: 14,
    color: "#222",
    marginBottom: 4,
    textAlign: "center",
  },
  copyright: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
});

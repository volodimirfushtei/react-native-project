import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View,} from "react-native";

const PostsScreen = () => {
    return (
        <View style={styles.container}>
            {/* Заголовок */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Публікації</Text>
                <TouchableOpacity style={styles.iconLogOut}>
                    <Image
                        source={require("@/assets/icons/log-out.png")}
                    /></TouchableOpacity>
            </View>

            {/* Картка профілю */}
            <View style={styles.profileCard}>
                <Image
                    source={require("@/assets/images/favicon.png")}
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>Natali Romanova</Text>
                    <Text style={styles.profileEmail}>email@example.com</Text>
                </View>
            </View>

            {/* Нижня навігаційна панель */}
            <View style={styles.footer}>
                <TouchableOpacity>
                    <Image source={require("@/assets/icons/grid.png")} style={styles.iconFooter}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Image source={require("@/assets/icons/user.png")} style={styles.iconUser}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    /** HEADER */
    header: {
        height: 88,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        position: "absolute",
        bottom: 11,
        fontSize: 17,
        fontWeight: "500",
    },
    iconLogOut: {
        position: "absolute",
        right: 16,
        width: 24,
        height: 24,
        bottom: 10,
    },

    /** PROFILE CARD */
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 16,
        marginRight: 15,
    },
    profileInfo: {},
    profileName: {
        fontSize: 13,
        fontWeight: 700,
    },
    profileEmail: {
        fontSize: 11,
        fontWeight: 400,
        color: "#212121",
    },

    /** FOOTER NAVIGATION */
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 83,
        borderTopWidth: 1,
        borderTopColor: "#E8E8E8",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    iconFooter: {
        position: "relative",
        top: -12,
        right: 31,
        width: 24,
        height: 24,
    },
    iconUser: {
        position: "relative",
        top: -12,
        left: 31,
        width: 24,
        height: 24,
    },
    addButton: {
        position: "absolute",
        top: 9,
        backgroundColor: "#FF6C00",
        width: 70,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonText: {
        fontSize: 30,
        color: "#fff",
        lineHeight: 35,
        fontWeight: "300",
    },
});

export default PostsScreen;



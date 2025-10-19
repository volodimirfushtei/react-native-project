import React, {useState} from "react";
import {FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import Toast from 'react-native-toast-message';

export default function CommentsScreen() {
    const navigation = useNavigation();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([
        {
            id: "1",
            user: "John Doe",
            avatar: "https://i.pravatar.cc/50?img=1",
            text: "Really love your most recent photo. I’ve been trying to capture the same thing for a few months and would love some tips!",
            date: "09 червня, 2020 | 08:40",
        },
        {
            id: "2",
            user: "Sarah Smith",
            avatar: "https://i.pravatar.cc/50?img=2",
            text: "A fast 50mm like f1.8 would help with the bokeh. I’ve been using primes as they tend to get a bit sharper images.",
            date: "09 червня, 2020 | 09:14",
        },
        {
            id: "3",
            user: "John Doe",
            avatar: "https://i.pravatar.cc/50?img=1",
            text: "Thank you! That was very helpful!",
            date: "09 червня, 2020 | 09:20",
        },
    ]);

    const handleSend = () => {
        if (!comment.trim()) return;
        const newComment = {
            id: Date.now().toString(),
            user: "You",
            avatar: "https://i.pravatar.cc/50?img=3",
            text: comment,
            date: "Сьогодні | " + new Date().toLocaleTimeString().slice(0, 5),
        };
        setComments([...comments, newComment]);
        setComment("");
        Toast.show({
            type: "success",
            text1: "Успіх",
            text2: "Коментар успішно додано!",
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBack} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#212121"/>
                </TouchableOpacity>
                <Text style={styles.title}>Коментарі</Text>
            </View>

            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <Image
                        source={{uri: "https://picsum.photos/id/1015/400/250"}}
                        style={styles.image}
                    />
                }
                renderItem={({item}) => (
                    <View style={styles.commentContainer}>
                        <Image source={{uri: item.avatar}} style={styles.avatar}/>
                        <View style={styles.commentBox}>
                            <Text style={styles.commentText}>{item.text}</Text>
                            <Text style={styles.commentDate}>{item.date}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={{paddingBottom: 80}}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Коментувати..."
                    placeholderTextColor="#BDBDBD"
                    value={comment}
                    onChangeText={setComment}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="arrow-up" size={20} color="#fff"/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
        height: 88,
    },
    title: {
        position: "absolute",
        bottom: 11,
        right: '45%',
        fontSize: 17,
        fontWeight: "500",
        color: "#212121",
    },
    iconBack: {
        position: "absolute",
        left: 16,
        bottom: 10,
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 8,
        marginVertical: 16,
    },
    commentContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    commentBox: {
        backgroundColor: "#F6F6F6",
        borderRadius: 6,
        padding: 10,
        flex: 1,
    },
    commentText: {
        fontSize: 14,
        color: "#212121",
    },
    commentDate: {
        fontSize: 10,
        color: "#BDBDBD",
        textAlign: "right",
        marginTop: 4,
    },
    inputContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        width: "100%",
        height: 50,
        backgroundColor: "#F6F6F6",
        borderRadius: 20,
        paddingHorizontal: 16,
        color: "#212121",
    },
    sendButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#FF6C00",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
});

import React, {useState} from "react";
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/types/navigation.types"
import {Image} from "expo-image";
import UserAvatar from "@/components/UserAvatar";


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileScreen'>;


const posts = [
    {
        id: "1",
        title: "Ліс",
        image: "https://picsum.photos/id/1015/400/250",
        comments: 8,
        likes: 153,
        location: "Ukraine",
    },
    {
        id: "2",
        title: "Захід на Чорному морі",
        image: "https://picsum.photos/id/1016/400/250",
        comments: 3,
        likes: 200,
        location: "Ukraine",
    },
    {
        id: "3",
        title: "Старий будиночок у Венеції",
        image: "https://picsum.photos/id/1017/400/250",
        comments: 50,
        likes: 200,
        location: "Italy",
    },
];

export default function ProfileScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [likedPosts, setLikedPosts] = useState<string[]>([]);
    const logOut = () => {

        (navigation as any).reset({
            index: 0,
            routes: [{name: "AuthContainer"}],
        });
    }

    const handleLike = (postId: string) => {
        setLikedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    const renderItem = ({item}: any) => {

        const liked = likedPosts.includes(item.id);
        return (
            <View style={styles.postCard}>
                <Image source={item.image} style={styles.postImage}/>
                <Text style={styles.postTitle}>{item.title}</Text>
                <View style={styles.postInfo}>
                    <View style={styles.stats}>
                        <TouchableOpacity onPress={() => navigation.navigate('CommentsScreen')}>
                            <Image
                                style={styles.messageIcon}
                                source={require("@/assets/icons/message-circle.svg")}
                            />
                        </TouchableOpacity>
                        <Text style={styles.textStat}>{item.comments}</Text>
                        <Pressable
                            onPress={() => handleLike(item.id)}
                            style={({pressed}) => ({opacity: pressed ? 0.7 : 1})}
                        >
                            <Image
                                style={[
                                    styles.thumbsupIcon,
                                    {tintColor: liked ? "#FF6C00" : "#222222"},
                                ]}
                                source={require("@/assets/icons/thumbs-up.svg")}
                            />
                        </Pressable>
                        <Text style={styles.textStat}>{item.likes}</Text>
                    </View>
                    <View style={styles.location}>
                        <Image
                            style={styles.locationIcon}
                            source={require("@/assets/icons/map-pin.svg")}
                        />
                        <Text style={styles.textLocation}>{item.location}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {/* Header with background image */}

                <Image source={require("@/assets/images/mountain-bg.jpg")} style={styles.bgImage} contentFit="cover"/>
                <TouchableOpacity style={styles.logOut} onPress={logOut}>
                    <Image source={require("@/assets/icons/log-out.svg")} style={styles.iconLogOut}/>
                </TouchableOpacity>
                <View
                    style={{flex: 1, alignItems: "center", marginTop: 30, position: "absolute", top: 70, left: "35%"}}>
                    <UserAvatar uri="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"/>


                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <View style={styles.card}>

                        <Text style={styles.name}>Natali Romanova</Text>

                        <FlatList
                            data={posts}
                            style={styles.flatList}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{paddingBottom: 80, flexGrow: 1}}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",


    },
    keyboardView: {
        flex: 1,
        justifyContent: "flex-end",
    },
    bgImage: {
        top: 0,
        position: "absolute",
        width: "100%",
        height: "100%",


    },
    card: {
        marginTop: 287,
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        position: "relative",

    },
    avatarContainer: {
        position: "absolute",
        top: 70,
        alignSelf: "center",
        borderRadius: 16,
    },
    avatar: {
        width: 120,
        height: 120,

    },
    iconLogOut: {
        width: 24,
        height: 24,
        color: "#222222",

    },
    logOut: {
        position: "absolute",
        top: 180, // трохи нижче статусбару
        right: 20,
        zIndex: 10,
        width: 24,
        height: 24,
        color: "#222222"
    },

    avatarPlaceholder: {
        position: "relative",
        width: 120,
        height: 120,
        borderRadius: 16,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#e8e8e8",
    },
    avatarPlus: {
        position: "absolute",
        top: "70%",
        transform: [{translateX: 60}],
        borderWidth: 1,
        width: 25,
        height: 25,
        borderRadius: 50,
        borderColor: "#e8e8e8",
        alignItems: "center",
        justifyContent: "center",
    },
    plus: {
        fontSize: 13,
        color: "#e8e8e8",
        transform: [{rotate: "45deg"}],
    },
    name: {
        marginTop: 92,
        textAlign: "center",
        fontSize: 30,
        fontWeight: "500",
        color: "#212121",
    },
    postCard: {
        marginHorizontal: 16,
        marginTop: 24,
        borderRadius: 8,
        borderColor: "#222fff",
    },
    postImage: {
        width: "100%",
        height: 200,
        borderRadius: 8,
    },
    locationIcon: {
        marginRight: 4,
        width: 24,
        height: 24,
        color: "#BDBDBD",
    },
    postTitle: {
        marginTop: 8,
        fontSize: 16,
        color: "#212121",
    },
    postInfo: {
        marginTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    stats: {
        flexDirection: "row",
        alignItems: "center",
    },
    textStat: {
        fontSize: 14,
        color: "#212121",
        marginLeft: 4,
    },
    location: {
        flexDirection: "row",
        alignItems: "center",
    },
    textLocation: {
        marginLeft: 4,
        color: "#212121",
        textDecorationLine: "underline",
    },
    flatList: {
        marginTop: 24,


    },
    messageIcon: {
        marginRight: 6,
        width: 24,
        height: 24,
        color: "#BDBDBD",
    },
    thumbsupIcon: {
        marginRight: 6,
        width: 24,
        height: 24,
        marginLeft: 24,
    },
    activeThumbsupIcon: {
        marginRight: 6,
        width: 24,
        height: 24,
        marginLeft: 24,
        tintColor: "#FF6C00",
    }
});


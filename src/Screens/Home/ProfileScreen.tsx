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
import UserAvatar from "../../components/UserAvatar";
import {Feather} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {selectPosts} from "@/redux/slices/postsSlice";

import {selectUserProfile, uploadAvatar} from "@/redux/slices/userSlice";
import type {RootState} from '@/redux/store';
import {useAppDispatch} from "@/redux/store";
import {logoutDB, selectAuthUser} from "@/redux/slices/authSlice";
import Toast from 'react-native-toast-message';
import {auth, db} from '@/lib/firebase';
import {doc, serverTimestamp, updateDoc} from 'firebase/firestore';


interface Post {
    id: string;
    photo: string;
    title: string;

    comments: number;
    likes: number;
    location: string;
    latitude?: number;
    longitude?: number;
    createdAt?: number;
}

export default function ProfileScreen() {
    const dispatch = useAppDispatch();
    const posts = useSelector(selectPosts);

    const userProfile = useSelector(selectUserProfile);
    // Removed authUser as per instruction to rely on userProfile from userSlice
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [likedPosts, setLikedPosts] = useState<string[]>([]);
    const userAvatar = useSelector((state: RootState) => state.user.avatar);

    // Фільтруємо пости, щоб показувати тільки мої
    const userPosts = posts.filter(post => post.userId === userProfile.id);

    // Діагностика даних
    console.log('[ProfileScreen] --- Render ---');
    console.log('[ProfileScreen] userProfile:', userProfile);
    console.log('[ProfileScreen] Total posts in Redux:', posts.length);
    console.log('[ProfileScreen] My posts count:', userPosts.length);
    if (posts.length > 0) {
        console.log('[ProfileScreen] Sample post photo URL:', posts[0].photo);
    }

    const handleLogout = async () => {
        const user = auth.currentUser;
        if (!auth.currentUser) {
            Toast.show({
                type: 'error',
                text1: 'Потрібно увійти, щоб залишити коментар',
            });
            return;
        }
        if (user) {
            // ✅ будь-які Firestore дії ТУТ
            await updateDoc(doc(db, 'users', user.uid), {
                lastLogoutAt: serverTimestamp(),
            });
        }

        await dispatch(logoutDB()).unwrap();

        navigation.navigate('Auth');
    };


    const handleAvatarChange = async (newUri: string | null) => {
        if (!newUri) return;

        try {
            await dispatch(uploadAvatar(newUri)).unwrap();
            Toast.show({type: 'success', text1: 'Успіх!', text2: 'Аватар оновлено'});
        } catch (error: any) {
            Toast.show({type: 'error', text1: 'Помилка', text2: error.message || 'Не вдалося оновити аватар'});
        }
    };


    const handleLike = (postId: string) => {
        setLikedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    const handleLocationPress = (post: Post) => {
        if (post.latitude && post.longitude) {
            navigation.navigate('MapScreen', {
                location: post.location,
                latitude: post.latitude,
                longitude: post.longitude
            });
        }
    };

    const handleCommentsPress = (post: Post) => {
        console.log('[ProfileScreen] Navigating to Comments for postId:', post.id);

        navigation.navigate('Home', {
            screen: 'HomeStack',
            params: {
                screen: 'CommentsScreen',
                params: {postId: post.id},
            },
        });
    };


    const renderItem = ({item}: { item: Post }) => {
        const isLiked = likedPosts.includes(item.id);

        return (
            <View style={styles.postCard}>
                {/* Виправлено: додано contentFit та перевірку URI */}
                <Image
                    source={{uri: item.photo}}
                    style={styles.postImage}

                    placeholder={require("@/assets/images/mountain-bg.jpg")}
                    transition={300}

                />
                <Text style={styles.postTitle}>{item.title}</Text>
                <View style={styles.postInfo}>
                    <View style={styles.stats}>
                        <Pressable
                            style={styles.messageIcon}
                            onPress={() => handleCommentsPress(item)}
                        >
                            <Feather name="message-circle" size={24} color="#FF6C00"/>
                        </Pressable>
                        <Text style={styles.textStat}>{item.comments}</Text>
                        <Pressable
                            onPress={() => handleLike(item.id)}
                            style={({pressed}) => [
                                styles.thumbsupIcon,
                                {opacity: pressed ? 0.7 : 1},
                            ]}
                        >
                            <Feather
                                name="thumbs-up"
                                size={24}
                                color={isLiked ? "#FF6C00" : "#bdbdbd"}
                            />
                        </Pressable>
                        <Text style={styles.textStat}>
                            {isLiked ? item.likes + 1 : item.likes}
                        </Text>
                    </View>
                    <Pressable
                        style={styles.location}
                        onPress={() => handleLocationPress(item)}
                    >
                        <Feather name="map-pin" size={18} color="#bdbdbd"/>
                        <Text style={styles.textLocation} numberOfLines={1}>
                            {item.location}
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image
                    source={require('@/assets/images/mountain-bg.jpg')}
                    style={styles.bgImage}
                    contentFit="cover"
                />

                <TouchableOpacity style={styles.logOut} onPress={handleLogout}>
                    <Feather name="log-out" size={24} color="#bdbdbd"/>
                </TouchableOpacity>

                <View style={styles.avatarContainer}>
                    <UserAvatar uri={userProfile?.avatar || undefined}
                                editable
                                onAvatarChange={handleAvatarChange}/>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <View style={styles.card}>
                        <Text style={styles.name}>{userProfile?.displayName || 'User'}</Text>

                        <FlatList
                            data={userPosts}
                            style={styles.flatList}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No posts</Text>
                                </View>
                            }
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
    },
    bgImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    card: {
        marginTop: 147,
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flex: 1,
    },
    avatarContainer: {
        position: "absolute",
        top: 85,
        alignSelf: "center",
        zIndex: 10,
    },
    logOut: {
        position: "absolute",
        top: 165,
        right: 16,
        zIndex: 10,
        padding: 8,
    },
    name: {
        marginTop: 92,
        textAlign: "center",
        fontSize: 30,
        fontWeight: "500",
        color: "#212121",
    },
    flatList: {
        marginTop: 33,
        flex: 1,
    },
    listContent: {
        paddingBottom: 80,
    },
    postCard: {
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 8,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postImage: {
        width: "100%",

        height: 240,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },

    postTitle: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "500",
        color: "#212121",
        paddingHorizontal: 12,
    },
    postInfo: {
        marginTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    stats: {
        flexDirection: "row",
        alignItems: "center",
    },
    messageIcon: {
        marginRight: 6,
    },
    thumbsupIcon: {
        marginLeft: 24,
        marginRight: 6,
    },
    textStat: {
        fontSize: 14,
        color: "#212121",
        marginLeft: 4,
    },
    location: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginLeft: 141,
    },
    textLocation: {
        fontSize: 16,
        color: "#212121",
        textDecorationLine: "underline",
        flex: 1,
        fontWeight: "400",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: "#bddbdb",
        fontWeight: "500",
        textAlign: "center",

    },
});


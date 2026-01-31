import React, {useEffect, useState,} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {RootStackParamList} from "@/types/navigation.types";
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Feather} from "@expo/vector-icons";
import {makeSelectCommentsCount} from "@/redux/slices/commentsSlice";
import UserAvatar from "@/components/UserAvatar";
import {useAppDispatch, useAppSelector} from '@/redux/store';
import Toast from 'react-native-toast-message';
import {loadUserData, uploadAvatar} from '@/redux/slices/userSlice';
import {logoutDB, selectAuthUser} from "@/redux/slices/authSlice";
import {fetchPosts, selectPosts} from '@/redux/slices/postsSlice';

interface Post {
    id: string;
    photo: string;
    title: string;
    comments: number;
    likes: number;
    location: string;
    latitude?: number;
    longitude?: number;
}

type CommentsScreenRouteProp = RouteProp<RootStackParamList, 'CommentsScreen'>;
const PostsScreen = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectAuthUser);
    const userData = useAppSelector((state) => state.user);
    const posts = useAppSelector(selectPosts);
    const postsLoading = useAppSelector((state) => state.posts.loading);
    const [tapCount, setTapCount] = useState(0);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<CommentsScreenRouteProp>();

    const postId = route.params?.postId;
    console.log(postId);
    const commentsCount = useAppSelector(makeSelectCommentsCount(postId));
    const handleSecretTap = () => {
        const newCount = tapCount + 1;
        setTapCount(newCount);

        if (newCount >= 2) {
            Alert.alert(
                'Режим розробника',
                'Перейти до тесту Firebase?',
                [
                    {text: 'Скасувати', style: 'cancel'},
                    {
                        text: 'Перейти',
                        onPress: () => navigation.navigate('TestFirebaseScreen')
                    }
                ]
            );
            setTapCount(0);
        }
    };
    // Завантаження даних користувача при монтуванні
    useEffect(() => {
        console.log('📊 Стан постів:', {
            postsCount: posts.length,
            posts: posts.map(p => ({id: p.id, title: p.title})),
            loading: postsLoading,
            user: user ? {id: user.id, name: user.name} : 'No user'
        });
        if (user?.id) dispatch(loadUserData(user.id));
        dispatch(fetchPosts(20)); // <-- Завантаження постів
    }, [dispatch, user?.id]);

    // Обробка зміни аватара
    const handleAvatarChange = async (newUri: string | null) => {
        if (!newUri) return;

        try {
            await dispatch(uploadAvatar(newUri)).unwrap();
            Toast.show({type: 'success', text1: 'Успіх!', text2: 'Аватар оновлено'});
        } catch (error: any) {
            Toast.show({type: 'error', text1: 'Помилка', text2: error.message || 'Не вдалося оновити аватар'});
        }
    };

    const handleLogout = async () => {
        try {
            await dispatch(logoutDB()).unwrap();
            Toast.show({type: "info", text1: "User logout"})
            navigation.reset({
                index: 0,
                routes: [{name: 'Auth'}],
            });
        } catch (e) {
            console.log('Logout error', e);
        }
    };


    const handleCommentsPress = (post: Post) => {
        navigation.navigate('CommentsScreen', {
            postId: post.id,
        });
    };

    const handleLocationPress = (post: Post) => {
        navigation.navigate('MapScreen', {location: post.location});
    };

    const formatLocation = (location?: string) => {
        if (!location) return '';
        return location
            .replace(/\sRegion/i, '')
            .replace(/\sOblast/i, '')
            .replace(/\sProvince/i, '')
            .replace(/\sState/i, '')
            .trim();

    }
    const renderPostItem = ({item}: { item: Post }) => (
        <View style={styles.post}>

            <Image source={{uri: item.photo}} style={styles.postImage}/>
            <Text style={styles.postTitle}>{item.title}</Text>
            <View style={styles.postInfo}>
                <View style={styles.stats}>
                    <Pressable style={styles.messageIcon} onPress={() => handleCommentsPress(item)}>
                        <Feather name="message-circle" size={24} color="#FF6C00"/>
                    </Pressable>
                    <Text style={styles.textStat}>{item.comments}</Text>

                </View>
                <Pressable style={styles.location} onPress={() => handleLocationPress(item)}>
                    <Feather name="map-pin" size={24} color="#bdbdbd"/>
                    <Text style={styles.textLocation}>{formatLocation(item.location || undefined)}</Text>
                </Pressable>
            </View>
        </View>
    );

    if (postsLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#FF6C00"/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Заголовок */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Публікації</Text>
                <Pressable style={styles.iconLogOut} onPress={handleLogout}>
                    <Feather name="log-out" size={24} color="#bdbdbd"/>
                </Pressable>
            </View>

            {/* Картка профілю */}
            <View style={styles.profileCard}>
                <TouchableOpacity style={{borderWidth: 1, borderRadius: 6,}} onPress={handleSecretTap}>
                    <UserAvatar
                        size={60}
                        editable={false}

                        uri={userData.avatar || undefined}
                        onAvatarChange={handleAvatarChange}
                    /></TouchableOpacity>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                    <Text style={styles.profileEmail}>{user?.email || ''}</Text>
                </View>
            </View>

            {/* Список публікацій */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderPostItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
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
        paddingTop: 44,
    },
    headerText: {
        fontSize: 17,
        fontWeight: "500",
    },
    iconLogOut: {
        position: "absolute",
        right: 16,
        bottom: 10,
        width: 24,
        height: 24,
    },

    /** PROFILE CARD */
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginTop: 16,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 16,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
        marginLeft: 8,
    },
    profileName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#212121",
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        fontWeight: "400",
        color: "#666",
    },

    /** POSTS */
    containerPosts: {
        flex: 1,
        backgroundColor: "#fff",
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    post: {
        marginBottom: 32,
        backgroundColor: "#fff",
        borderRadius: 8,
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
        width: '100%',
        height: 240,

        borderRadius: 8,
        marginBottom: 8,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: "#212121",
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    postInfo: {
        flexDirection: "row",

        alignItems: "center",
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    stats: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginRight: 49,
    },
    messageIcon: {
        marginRight: 4,
    },
    thumbsupIcon: {
        marginLeft: 8,
        marginRight: 4,
    },
    textStat: {
        fontSize: 14,
        color: "#666",
    },
    location: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,


    },
    textLocation: {
        fontSize: 16,
        color: "#212121",
        textDecorationLine: "underline",

        overflow: "hidden",

    },
});

export default PostsScreen;



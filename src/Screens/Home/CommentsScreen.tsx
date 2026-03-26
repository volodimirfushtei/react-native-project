import React, {useCallback, useState} from "react";
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Feather, Ionicons} from "@expo/vector-icons";
import {RouteProp, useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import {Comment, RootStackParamList} from "@/types/navigation.types";
import {selectPosts} from "@/redux/slices/postsSlice";
import {useSelector} from 'react-redux';
import {addComment, fetchComments, likeComment, selectCommentsByPostId} from "@/redux/slices/commentsSlice";
import {useAppDispatch, useAppSelector} from '@/redux/store';

type CommentsScreenRouteProp = RouteProp<RootStackParamList, 'CommentsScreen'>;

export default function CommentsScreen() {
    const navigation = useNavigation();
    const route = useRoute<CommentsScreenRouteProp>();
    const postId = route.params?.postId;


    const [comment, setComment] = useState(''); // Виправлено назву змінної

    const comments = useAppSelector(
        selectCommentsByPostId(postId)
    );
    console.log(comments);
    const likes = useAppSelector((state) => state.comments.comments);
    const [likedComments, setLikedComments] = useState<string[]>([]);
    const posts = useSelector(selectPosts);
    const currentUser = useAppSelector((state) => state.auth.user);
    const currentPost = posts.find(post => post.id === postId);
    const dispatch = useAppDispatch();

    console.log('[CommentsScreen] Render with postId:', postId);
    console.log('[CommentsScreen] Current user ID:', currentUser?.id);
    console.log('[CommentsScreen] Comments count for this post:', (comments || []).length);
    console.log('[CommentsScreen] Comments authors:', (comments || []).map(c => c.userName));

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchComments({postId}));
        }, [postId])
    );

    const handleAddComment = async () => {
        if (!currentUser) {
            Toast.show({
                type: 'error',
                text1: 'Помилка',
                text2: 'Користувач не авторизований',
            });
            return;
        }

        if (!comment.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Помилка',
                text2: 'Введіть текст коментаря',
            });
            return;
        }

        try {
            await dispatch(
                addComment({
                    postId,
                    text: comment.trim(),
                    userId: currentUser.id,
                    userName: currentUser.name || 'Unknown',
                    avatar: currentUser.avatar || 'https://i.pravatar.cc/40',

                })
            ).unwrap();

            setComment('');
            Keyboard.dismiss();

            Toast.show({
                type: 'success',
                text1: 'Успіх',
                text2: 'Коментар додано',
            });
        } catch (e: any) {
            Toast.show({
                type: 'error',
                text1: 'Помилка',
                text2: e.message || 'Не вдалося додати коментар',
            });
        }
    };
    const handleCommentsLike = (commentId: string) => {
        if (likedComments.includes(commentId)) return;

        setLikedComments(prev => [...prev, commentId]);
        dispatch(likeComment(commentId));
    };
    const formatTime = (timestamp?: number) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);

        const datePart = date.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        const timePart = date.toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return `${datePart} | ${timePart}`;
    };


    const renderComment = ({item}: { item: Comment }) => {
        const isOwnComment = item.userId === currentUser?.id;
        const isLiked = likedComments.includes(item.id);
        return (
            <View style={[
                styles.commentContainer,
                isOwnComment && styles.ownCommentContainer
            ]}>
                <Image
                    source={{uri: item.avatar || 'https://i.pravatar.cc/40'}}
                    style={styles.avatar}
                />
                <View style={[
                    styles.commentBox,
                    isOwnComment && styles.ownCommentBox
                ]}>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <View style={styles.commentHeader}>

                        <Text style={[
                            styles.commentTime,
                            isOwnComment && styles.ownCommentDate
                        ]}>
                            {formatTime(item.createdAt)}
                        </Text>

                    </View>
                    <View style={styles.statsLike}>
                        <Pressable style={({pressed}) => [
                            styles.likeIcon,
                            {opacity: pressed ? 0.7 : 1},
                        ]} onPress={() => handleCommentsLike(item.id)}>
                            <Feather name="heart" size={24} color={isLiked ? "#FF6C00" : "#bdbdbd"}/>
                        </Pressable>
                        <Text style={styles.textStat}> {isLiked ? item.likes + 1 : item.likes}</Text>

                    </View>
                </View>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={24} color="#212121"/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Коментарі</Text>
                </View>

                {/* Comments List */}
                <FlatList
                    data={comments ?? []}
                    keyExtractor={(item) => item.id}

                    showsVerticalScrollIndicator={false}

                    ListHeaderComponent={
                        <View style={styles.imageContainer}>
                            <Image
                                source={{uri: currentPost?.photo || "https://i.pravatar.cc/50?img=1"}}
                                style={styles.image}
                            />
                        </View>
                    }
                    renderItem={renderComment}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Ще немає коментарів</Text>
                            <Text style={styles.emptySubtext}>Будьте першим, хто залишить коментар!</Text>
                        </View>
                    }
                />

                {/* Input Container */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.inputWrapper}
                >
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Коментувати..."
                            placeholderTextColor="#BDBDBD"
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            maxLength={500}
                            textAlignVertical="center"
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                !comment.trim() && styles.sendButtonDisabled
                            ]}
                            onPress={handleAddComment}
                            disabled={!comment.trim()}
                        >
                            <Ionicons
                                name="arrow-up"
                                size={20}
                                color={comment.trim() ? "#fff" : "#BDBDBD"}
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

                {/* Toast Component */}
                <Toast/>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        height: 88,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 11,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 44 : 0,
    },
    backButton: {
        position: "absolute",
        left: 16,
        bottom: 10,
        padding: 4,
    },
    title: {
        fontSize: 17,
        fontWeight: "500",
        color: "#212121",
        marginBottom: 11,
    },
    imageContainer: {
        paddingHorizontal: 16,
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 8,
        marginVertical: 16,
    },
    listContent: {
        paddingBottom: 20,

    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
    },
    commentContainer: {
        flexDirection: "row-reverse",
        alignItems: "flex-start",
        marginBottom: 24,
        marginTop: 32,
        gap: 16,
        paddingRight: 16,
    },
    ownCommentContainer: {
        flexDirection: "row-reverse",
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,

    },
    commentBox: {
        width: 299,
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        borderRadius: 6,
        padding: 16,
        flex: 1,
        gap: 8,
        marginLeft: 16,
    },
    ownCommentBox: {
        width: 299,
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        marginRight: 16,
        marginLeft: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,

    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
        marginLeft: 0,
    },
    authorName: {
        fontSize: 12,
        fontWeight: "500",
        color: "#212121",
    },
    commentTime: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 10,
        color: "#BDBDBD",
    },
    ownCommentDate: {
        color: "#bdbdbd",
        fontSize: 10,
    },
    commentText: {
        fontFamily: "Roboto",
        fontSize: 13,
        fontWeight: "400",
        color: "#212121",
        lineHeight: 18,
        marginBottom: 4,
    },
    inputWrapper: {
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        backgroundColor: "#F6F6F6",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        paddingRight: 50,
        color: "#212121",
        fontSize: 16,
        fontWeight: "500",
        minHeight: 50,
        textAlignVertical: "center",

    },
    sendButton: {
        position: "absolute",
        right: 24,
        bottom: 16,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#FF6C00",
        justifyContent: "center",
        alignItems: "center",
    },
    sendButtonDisabled: {
        backgroundColor: "#F6F6F6",
    },
    statsLike: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    likeIcon: {},
    textStat: {color: "#111111"}
});

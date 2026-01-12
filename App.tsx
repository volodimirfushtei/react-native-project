// App.tsx
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {UserProvider} from '@/utils/UserContext';
import {store} from '@/redux/store';
import {AuthProvider} from '@/utils/AuthContext';
import RootNavigator from '@/Navigations/RootNavigator';
import {PostsProvider} from '@/utils/PostContext';
import {CommentsProvider} from "@/utils/CommentsProvider";

export default function App() {
    return (
        <Provider store={store}>
            <UserProvider>
                <AuthProvider>
                    <PostsProvider>
                        <CommentsProvider>
                            <NavigationContainer>
                                <RootNavigator/>
                            </NavigationContainer>
                        </CommentsProvider>
                    </PostsProvider>
                </AuthProvider>
            </UserProvider>
        </Provider>
    );
}






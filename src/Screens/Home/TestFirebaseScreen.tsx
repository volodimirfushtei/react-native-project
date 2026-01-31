import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {signInAnonymously,} from 'firebase/auth';
import {doc, getDoc, setDoc,} from 'firebase/firestore';
import {getDownloadURL, ref, uploadString,} from 'firebase/storage';
import {RootStackParamList} from "@/types/navigation.types";
import {useNavigation} from '@react-navigation/native';
import {auth, db, storage} from '@/lib/firebase';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

const TestFirebaseScreen = () => {
    const [status, setStatus] = useState('');
    const [userId, setUserId] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    // 🔐 AUTH
    const testAuth = async (): Promise<boolean> => {
        try {
            console.log('Початок аутентифікації');
            const cred = await signInAnonymously(auth);
            setUserId(cred.user.uid);

            console.log('✅ Auth OK:', cred.user.uid);
            return true;
        } catch (e: any) {
            console.error('❌ Auth error:', e.message);
            return false;
        }
    };

    // 🗄 FIRESTORE
    const testFirestore = async (): Promise<boolean> => {
        try {
            if (!userId) return false;

            const refDoc = doc(db, 'testCollection', 'testDocument');

            await setDoc(refDoc, {
                message: 'Тест Firebase',
                userId,
                createdAt: Date.now(),
            });

            const snap = await getDoc(refDoc);
            console.log('✅ Firestore data:', snap.data());

            return true;
        } catch (e: any) {
            console.error('❌ Firestore error:', e.message);
            return false;
        }
    };

    // ☁️ STORAGE
    const testStorage = async (): Promise<boolean> => {
        try {
            if (!userId) return false;

            const text = 'Тест Firebase Storage працює ✅';

            const fileRef = ref(
                storage,
                `test-files/${userId}/test-${Date.now()}.txt`
            );

            // 👇 КЛЮЧОВА ЗМІНА
            await uploadString(fileRef, text, 'raw', {
                contentType: 'text/plain',
            });

            const url = await getDownloadURL(fileRef);
            console.log('✅ Storage URL:', url);

            return true;
        } catch (e: any) {
            console.error('❌ Storage error:', e.message);
            return false;
        }
    };


    // ▶️ RUN ALL
    const runAllTests = async () => {
        setStatus('Запуск тестів...');

        if (!(await testAuth())) {
            setStatus('❌ Auth error');
            return;
        }

        if (!(await testFirestore())) {
            setStatus('❌ Firestore error');
            return;
        }

        if (!(await testStorage())) {
            setStatus('❌ Storage error');
            return;
        }

        setStatus('✅ Всі тести успішні!');
    };
    const handleOut = () => {
        navigation.goBack();
    };
    return (
        <View style={{flex: 1, justifyContent: 'center', padding: 24}}>
            <Text style={{fontSize: 20, fontWeight: '600', marginBottom: 16}}>
                Firebase Test (Expo)
            </Text>
            <View style={{marginTop: 20, flexDirection: "column", borderRadius: 10, display: "flex", gap: 10}}>
                <Button color="#f194ff" title="Запустити тести" onPress={runAllTests}/>
                <Button title="Вийти" onPress={handleOut}/></View>


            {userId && (
                <Text style={{marginTop: 12, fontSize: 12}}>
                    User: {userId.slice(0, 12)}...
                </Text>
            )}

            {status && (
                <Text
                    style={{
                        marginTop: 20,
                        color: status.includes('❌') ? 'red' : 'green',
                        fontSize: 16,
                    }}
                >
                    {status}
                </Text>
            )}
        </View>
    );
};

export default TestFirebaseScreen;


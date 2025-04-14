import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import { Alert } from "react-native";

export class HandleUser {
    static saveToDatabase = async (user: FirebaseAuthTypes.User) => {
        //save user to firestore
        try {
            await firestore().collection('users').doc(user.uid).set({
                email: user.email,
                createdAt: firestore.FieldValue.serverTimestamp(),
                name: user.displayName ? user.displayName : user.email ? user.email.split('@')[0] : ''
            });
            console.log('User registered and added to Firestore!');
        } catch (e) {
            console.log('Register Error: Uplpad to Firebase errors! ', e);
        }
    }
    static addFriend = async (currentUserId: string, friendUserId: string) => {
        try {
            const batch = firestore().batch();

            // Tham chiếu đến tài liệu friendship của current user
            const currentUserFriendshipRef = firestore()
                .collection('friendships')
                .doc(currentUserId);

            // Tham chiếu đến tài liệu friendship của friend user
            const friendUserFriendshipRef = firestore()
                .collection('friendships')
                .doc(friendUserId);

            // Cập nhật danh sách bạn bè cho cả 2 người
            batch.set(currentUserFriendshipRef, {
                friends: firestore.FieldValue.arrayUnion(friendUserId),
                updatedAt: firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            batch.set(friendUserFriendshipRef, {
                friends: firestore.FieldValue.arrayUnion(currentUserId),
                updatedAt: firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            // Thực hiện batch write
            await batch.commit();

            console.log('Friend added successfully!');
            return true;
        } catch (error) {
            console.error('Error adding friend:', error);
            throw error;
        }
    };

    static getFriendsList = async (userId: string) => {
        try {
            const friendshipDoc = await firestore()
                .collection('friendships')
                .doc(userId)
                .get();

            if (!friendshipDoc.exists) return [];

            const friendsIds = friendshipDoc.data()?.friends || [];

            // Lấy thông tin chi tiết của từng người bạn
            const friendsPromises = friendsIds.map(async (friendId: any) => {
                const userDoc = await firestore()
                    .collection('users')
                    .doc(friendId)
                    .get();
                return { id: friendId, ...userDoc.data() };
            });

            const friendsList = await Promise.all(friendsPromises);
            return friendsList;
        } catch (error) {
            console.error('Error getting friends list:', error);
            throw error;
        }
    };

    static checkFriendship = async (userId1: string, userId2: string) => {
        try {
            const friendshipDoc = await firestore()
                .collection('friendships')
                .doc(userId1)
                .get();

            if (!friendshipDoc.exists) return false;

            const friends = friendshipDoc.data()?.friends || [];
            return friends.includes(userId2);
        } catch (error) {
            console.error('Error checking friendship:', error);
            throw error;
        }
    };
    static handleAddFriend = async (userId1: string, userId2: string) => {
        try {
            const isAlreadyFriend = await HandleUser.checkFriendship(userId1, userId2);

            if (isAlreadyFriend) {
                Alert.alert('Người này đã là bạn của bạn!');
                return;
            }

            await HandleUser.addFriend(userId1, userId2);
            Alert.alert('Đã thêm bạn thành công!');
        } catch (error) {
            Alert.alert('Có lỗi xảy ra khi thêm bạn: ' + error);
        }
    };
}
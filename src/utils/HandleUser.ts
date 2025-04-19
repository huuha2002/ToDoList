import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
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
    //ADD FRIEND
    static sendFriendRequest = async (senderId: string, receiverId: string) => {
        const combinedId = [senderId, receiverId].sort().join('_');

        await firestore().collection('friendships').doc(combinedId).set({
            user1: senderId,
            user2: receiverId,
            status: 'pending',
            createdAt: firestore.FieldValue.serverTimestamp(),
            requestedBy: senderId
        });
    }
    static acceptFriendRequest = async (userA: string, userB: string) => {
        const combinedId = [userA, userB].sort().join('_');

        await firestore().collection('friendships').doc(combinedId).update({
            status: 'accepted',
            acceptedAt: firestore.FieldValue.serverTimestamp()
        });

        // // Cập nhật danh sách bạn bè trong user document (nếu dùng cách 2)
        // await firestore().collection('users').doc(userA).update({
        //   friends: firestore.FieldValue.arrayUnion(userB)
        // });

        // await firestore().collection('users').doc(userB).update({
        //   friends: firestore.FieldValue.arrayUnion(userA)
        // });
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

    //CHECK FRIENDSHIP

    static checkFriendshipStatus = async (currentUserId: string, otherUserId: string) => {
        // Tạo combinedId đã sắp xếp
        const combinedId = [currentUserId, otherUserId]
            .sort()
            .join('_');

        try {
            const docRef = firestore().collection('friendships').doc(combinedId);
            const docSnapshot = await docRef.get();

            if (!docSnapshot.exists) {
                return { exists: false, status: null };
            }

            const friendshipData: FirebaseFirestoreTypes.DocumentData | any = docSnapshot.data();
            return {
                exists: true,
                status: friendshipData.status || 'accepted',
                friendshipId: combinedId,
                createdAt: friendshipData.createdAt?.toDate(),
                // Các thông tin khác nếu cần
            };
        } catch (error) {
            console.error('Lỗi khi kiểm tra bạn bè:', error);
            return { exists: false, status: null };
        }
    }

    static checkFriend = async (userA: string, userB: string) => {
        const friendshipsRef = firestore().collection('friendships');

        // Tạo 2 truy vấn song song
        const query1 = friendshipsRef
            .where('user1', '==', userA)
            .where('user2', '==', userB)
            .limit(1);

        const query2 = friendshipsRef
            .where('user1', '==', userB)
            .where('user2', '==', userA)
            .limit(1);

        const [snapshot1, snapshot2] = await Promise.all([query1.get(), query2.get()]);

        return !snapshot1.empty || !snapshot2.empty;
    }

    static checkFriendWithQuery = async (currentUserId: string, friendUidToCheck: string) => {
        try {
            const querySnapshot = await firestore()
                .collection('friendships')
                .doc(currentUserId)
                .collection('friends') // Nếu bạn dùng subcollection
                .where('uid', '==', friendUidToCheck)
                .limit(1)
                .get();

            return !querySnapshot.empty;
        } catch (error) {
            console.error('Lỗi khi kiểm tra bạn bè:', error);
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
import { monthNames } from "../constants/appInfos";
import firestore, { Timestamp } from '@react-native-firebase/firestore';

export class HandleDateTime {
    /**
     * Chuyển đổi Date hoặc Timestamp thành chuỗi ngày tháng.
     * @param num - Đối tượng Date hoặc Timestamp.
     * @returns Chuỗi ngày tháng định dạng "Tháng, Ngày Năm".
     */
    static DateString = (num: Date | Timestamp) => {
        let date: Date;

        // Kiểm tra nếu num là Timestamp
        if (num instanceof Timestamp) {
            date = num.toDate(); // Chuyển đổi Timestamp thành Date
        } else if (num instanceof Date) {
            date = num; // Sử dụng trực tiếp nếu num là Date
        } else {
            return 'No date'; // Trả về giá trị mặc định nếu num không hợp lệ
        }

        return `${monthNames[date.getMonth()]}, ${date.getDate()} ${date.getFullYear()}`;
    }

    /**
     * Chuyển đổi Date hoặc Timestamp thành chuỗi giờ phút.
     * @param num - Đối tượng Date hoặc Timestamp.
     * @returns Chuỗi thời gian định dạng "Giờ:Phút".
     */
    static GetHour = (num: Date | Timestamp) => {
        let date: Date;

        // Kiểm tra nếu num là Timestamp
        if (num instanceof Timestamp) {
            date = num.toDate(); // Chuyển đổi Timestamp thành Date
        } else if (num instanceof Date) {
            date = num; // Sử dụng trực tiếp nếu num là Date
        } else {
            return 'No time'; // Trả về giá trị mặc định nếu num không hợp lệ
        }

        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
}
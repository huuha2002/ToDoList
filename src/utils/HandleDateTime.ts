import { monthNames } from "../constants/appInfos"

export class HandleDateTime {
    static DateString = (num: number) => {
        const date = new Date(num)
        return `${monthNames[date.getMonth()]},${date.getDate()} ${date.getFullYear()}`
    }
    static GetHour=(num:number)=>{
        const date = new Date(num)
        return `${date.getHours()}`
    }
}
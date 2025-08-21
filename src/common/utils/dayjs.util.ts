import dayjs, { Dayjs } from 'dayjs'
export const dayjsUtil = (date: Date): string => {
    return dayjs(date).format('YYYY-MM-DD')
}
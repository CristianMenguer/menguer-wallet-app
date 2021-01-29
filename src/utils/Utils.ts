// This function replaces all the occurrences of a specific string in another
// and returns it
export const replaceAll = (input: string, search: string, replace: string) => {
    return input.split(search).join(replace)
}

// Function that makes the process wait for a specific time, using primise
export const sleep = (miliseconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
}

// this function receives a Date and returns a string in an API format
export const dateToAPI = (input: Date): string => {
    if (input === null)
        return ''
    //
    return input.getFullYear().toString() + '-' + ('0' + (input.getMonth() + 1)).toString().slice(-2) + '-' + ('0' + input.getDate().toString()).slice(-2)
}

// This function compares the year, Month and day of
// two Dates and return if they are equals
export const datesEqual = (date1: Date, date2: Date): boolean => {
    if (date1 === null || date2 === null)
        return false
    //
    let result = true
    result = result && (date1.getFullYear() === date2.getFullYear())
    result = result && (date1.getMonth() === date2.getMonth())
    result = result && (date1.getDate() === date2.getDate())
    return result
}

// it returns a Date with time zero
export const newDateZero = (): Date => {
    const dateToReturn = new Date()
    dateToReturn.setHours(0)
    dateToReturn.setMinutes(0)
    dateToReturn.setSeconds(0)
    dateToReturn.setMilliseconds(0)
    return dateToReturn
}

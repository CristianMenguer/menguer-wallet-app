export const replaceAll = (input: string, search: string, replace: string) => {
    return input.split(search).join(replace)
}

export const sleep = (miliseconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
}

export const sleep2 = (miliseconds: number): void => {
    const date = Date.now()
    let currentDate = date
    do {
        currentDate = Date.now()
    }
    while (currentDate - date < miliseconds)
}

export const padL = (input: string, strFill: string, length: number): string => {
    return (length <= input.length) ? input : padL((strFill + input), strFill, length)
}

export const padR = (input: string, strFill: string, length: number): string => {
    return (length <= input.length) ? input : padL((input + strFill), strFill, length)
}

export const dateToAPI = (input: Date): string => {
    if (input === null)
        return ''
    //
    return input.getFullYear().toString() + '-' + ('0' + (input.getMonth() + 1)).toString().slice(-2) + '-' + ('0' + input.getDate().toString()).slice(-2)
}

export const pregaoToDate = (input: number): Date | null => {
    if (input === null || input < 20000000)
        return null
    //20210123
    const year = parseInt(input.toString().substr(0, 4))
    const month = parseInt(input.toString().substr(4, 2)) - 1
    const day = parseInt(input.toString().substr(6, 2))
    return new Date(year, month, day)
}

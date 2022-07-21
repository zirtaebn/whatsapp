interface Seconds {

    seconds:number, 
    nanoseconds:number
}

export type messageItemType = {

    author:string
    body: string,
    type: string,
    date: Seconds
}
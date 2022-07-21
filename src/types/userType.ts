interface Seconds {

    seconds:number, 
    nanoseconds:number
}

export interface userType  {

    id: string, 
    name: string | null, 
    avatar: string | null,
    chatId?:string,
    lastMessage?:string,
    lastMessageDate?: Seconds
}
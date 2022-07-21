import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { 
    getFirestore,
    doc,
    setDoc,
    addDoc, 
    getDocs,  
    collection, 
    query, 
    updateDoc, 
    arrayUnion, 
    onSnapshot  
} from 'firebase/firestore';


import firebaseConfig from '../services/firebaseConfig';
import { userType } from "../types/userType";
import { messageItemType } from '../types/messageItemType';


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);


export default {

    googlePoUp: async () => {

        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        const user = result.user;
        
        return {user};
    }, 

    AddUser: async (user:userType) => {

        await setDoc(doc(db, 'users', user.id), {

            name: user.name,
            avatar: user.avatar

        }, { merge: true });
    },

    getContactList: async (userId:string) => {

        let list:userType[] = [];

        const q = query(collection(db, 'users'));
        const queryContacts = await getDocs(q);
        queryContacts.forEach(contact => {

            const data = contact.data();

            if(contact.id !== userId){

                list.push({

                    id:contact.id, 
                    name: data.name, 
                    avatar:data.avatar
                })
            }
        
        });
        
        return list;
    }, 

    AddChat: async (user:userType, user2:userType) => {

        let newChat = await addDoc(collection(db, 'chats'), {

            messages: [], 
            users: [user.id, user2.id]

        });


        await updateDoc(doc(db, 'users', user.id), {
            chats: arrayUnion({
                chatId: newChat.id, 
                name: user2.name,
                avatar: user2.avatar,
                with: user2.id
            })
        });

        await updateDoc(doc(db, 'users', user2.id), {
            chats: arrayUnion({

                chatId: newChat.id, 
                name: user.name,
                avatar: user.avatar,
                with: user.id
            })
        });

    },

    onChatList: (userId: string, setChatList:React.Dispatch<React.SetStateAction<userType[] | undefined>>) => {

        return onSnapshot(doc(db, 'users', userId),{ includeMetadataChanges: true }, (doc) => {

            if(doc.exists()) {

                let data = doc.data();

                if(data.chats) {

                    let chats = [...data.chats];

                    chats.sort((a:userType,b:userType) => {

                        if(!a.lastMessageDate){

                            return -1
                        }

                        if(!b.lastMessageDate) {
                            return -1;
                        }
                        
                        if(a.lastMessageDate && b.lastMessageDate && a.lastMessageDate.seconds < b.lastMessageDate.seconds) {

                            return 1
                        }else {
                            return -1
                        }

                    })

                    setChatList(chats);
                    
                }
            }
        });  
    }, 

    onChatContent: (
        chatId:string, 
        setListMessage: React.Dispatch<React.SetStateAction<messageItemType[] | undefined>>,
        setUsers: React.Dispatch<React.SetStateAction<userType[] | undefined>>
    ) => {

        return onSnapshot(doc(db, 'chats', chatId), (doc) => {


            if(doc.exists()) {

                let data = doc.data();

                if(data.messages) {

                    setListMessage(data.messages);
                    setUsers(data.users);       
                }
            }
        });
    },

    sendMessage: async (
        activeChat:userType, 
        user:userType, 
        type:string, 
        body:string,
        users:userType[] | undefined
    ) => {

       let now = new Date();

       if(activeChat.chatId && users) {
        
        await updateDoc(doc(db, 'chats', activeChat.chatId), {

            messages: arrayUnion({

                author: user.id,
                body,
                type, 
                date: now
            })

        });


        const q = query(collection(db, 'users'))

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach( async (item) => {

            let uData = item.data();

            if(uData.chats) {

                let chats = [...uData.chats];


                for(let e in chats) {

                    if(chats[e].chatId === activeChat.chatId){

                        chats[e].lastMessage = body, 
                        chats[e].lastMessageDate = now
                    }
                }

                await updateDoc(doc(db, 'users', item.id), {

                    chats
                })

            }
        
        });

        
        
       }
    }
}




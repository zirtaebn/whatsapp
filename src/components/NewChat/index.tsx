import React, { useEffect, useState } from 'react';
import './style.css';

import Api from '../../Api/Api';

import { userType } from '../../types/userType';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';



type NewChatProps = {

    user?:userType,
    showNewChat:boolean, 
    setShowNewChat:React.Dispatch<React.SetStateAction<boolean>>,    
}

export default ({ user, showNewChat, setShowNewChat }:NewChatProps) => {

    const [ newChatList, setnewChatList] = useState<userType[] | undefined>([]);

    const addChat = async (user2:userType) => {

        if(user) {

        
            await Api.AddChat(user, user2);

            setShowNewChat(false);    
        }
    }

    useEffect(() => {

        const getList = async () => {

            if(user) {

                const list = await Api.getContactList(user.id);
                setnewChatList(list);
            }
        }

        getList();

    },[user]);

    return (

        <div 
            className='newChat'
            style = {{left: showNewChat ? '0px' : '-100%'}}
        >

            <div className='newChat--head'>

                <div 
                    className='newChat--backbutton'
                    onClick={() => setShowNewChat(false)}
                >
                    <ArrowBackIcon style = {{color: '#FFF'}}/>
                </div>

                <div className='newChat--title'>
                    Nova Conversa
                </div>

            </div>

            <div className='newChat--list'>

                { newChatList ? 

                    newChatList.map((item, key) => (

                        <div 
                            className='newChat--item' 
                            key = {key}
                            onClick = {() => addChat(item)}
                        >
                            <img className='newChat--avatar' src={item ? `${item.avatar}` : ''} alt='foto de perfil' />
                            <div className='newChat--name'>{item.name}</div>
                        </div>


                    ))

                    :

                    null

                }

            </div>

        </div>
    )
}



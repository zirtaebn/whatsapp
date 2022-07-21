import React, { useState, useEffect } from 'react';
import './style.css';


import { userType } from '../../types/userType';

type ChatListItemPropsType = {

    onClick: () => void,
    data: userType,
    active: boolean | null,
}

export default ({ onClick, data, active }:ChatListItemPropsType) => {

    const [ time, setTime ] = useState<string | undefined>('');

    useEffect(() => {

        if(data.lastMessageDate){

            let seconds = data.lastMessageDate.seconds
        
            let date = new Date (seconds * 1000);
            let hours:number | string = date.getHours();
            let minutes:number | string = date.getMinutes();

            hours = hours < 10 ? `0${hours}` : hours;
            minutes = minutes < 10 ? `0${minutes}` : minutes;

            setTime(`${hours}:${minutes}`);

        }

    },[data])

    return (

        <div 
            className= { `chatListItem  ${ active ? 'active': ''}`}
            onClick={ onClick }
        >

            { data.avatar &&
                <img className='chatListItem--avatar' 
                    src= { data.avatar } 
                    alt='foto de perfil' 
                />
            }

            <div className='chatListItem--right'>

                <div className='chatListItem--line'>

                    <div className='chatListItem--name'>{data.name}</div>
                    <div className='chatListItem--date'>{ data.lastMessageDate ? time : null }</div>

                </div>

                <div className='chatListItem--line'>

                    <div className='chatListItem--lastMessage '>
                        <p> { data.lastMessage ? data.lastMessage : null } </p>
                    </div>
                
                </div>

            </div>
            
        </div>
    )
}
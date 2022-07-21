import React, { useState, useEffect } from 'react';
import './style.css'
import { messageItemType } from '../../types/messageItemType';
import { userType } from '../../types/userType';

type MessageItemProps = {

    data:messageItemType, 
    user?:userType
}

export default ({ data, user  }:MessageItemProps) => {

    const [ time, setTime ] = useState<string | undefined>('');

    useEffect(() => {

        if(data.date){

            let seconds = data.date.seconds
        
            let date = new Date (seconds * 1000);
            let hours:number | string = date.getHours();
            let minutes:number | string = date.getMinutes();

            hours = hours < 10 ? `0${hours}` : hours;
            minutes = minutes < 10 ? `0${minutes}` : minutes;

            setTime(`${hours}:${minutes}`);

        }

    },[data])

    return (

       <>
        { user &&
            <div 
            className='messageLine'
            style = {{ justifyContent: user.id === data.author ? 'flex-end' : 'flex-start'}}
            >
                <div 
                    className='messageItem'
                    style={{ backgroundColor: user.id === data.author ? '#DCF8C6' : '#FFF'}}
                >
                    <div className='messageText'>
                        <p>
                            {data.body}
                        </p>
                    </div>
                    <div className='messageDate'>{time}</div>
    
                </div>
             
            </div> 
        }

        
       </>

        
    )


} 
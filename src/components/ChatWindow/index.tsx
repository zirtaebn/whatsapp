import React, { useState, useEffect, useRef } from 'react';
import './style.css';

import Api from '../../Api/Api'

import { messageItemType } from '../../types/messageItemType';
import { userType } from '../../types/userType';

import MessageItem from '../MessageItem';

import EmojiPicker, { IEmojiData } from 'emoji-picker-react';

import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';




type ChatWindowProps = {

    activeChat:userType, 
    onClick: () => void, 
    user?: userType

}


export default ({ activeChat, onClick, user }: ChatWindowProps) => {

    const body = useRef<any>();

    let recognition:any = null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if(SpeechRecognition) {

        recognition = new SpeechRecognition();
    }

    const [ openEmoji, setOpenEmoji ] = useState(false);
    const [ text, setText ] = useState<string>('');
    const [ listening, setListening ] = useState(false);
    const [ listMessage, setListMessage ] = useState<messageItemType[] | undefined>([]);
    const [ users, setUsers ] = useState<userType[] | undefined>([]);



    const handleSendClick = () => {

        if(user) {

            Api.sendMessage(activeChat, user, 'text', text, users);
            setText('');
            setOpenEmoji(false);

            console.log(text);
            console.log(user, 'user');
            console.log(activeChat, 'active chat');
            
            
            
            console.log('mandei');
            
        }        
        
    };

    const handleInputEnter = (e:React.KeyboardEvent<HTMLInputElement>) => {

        if(e.key === 'Enter') {

            handleSendClick();

        }
    };

    useEffect(() => {

        setListMessage([]);

        if(activeChat.chatId){

            let unsub = Api.onChatContent(activeChat.chatId, setListMessage, setUsers);
            return unsub;
        
        }

    },[activeChat.chatId]);


    useEffect(() => {

        if(body.current.scrollHeight > body.current.offsetHeight) {

            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }

    },[listMessage])


    const handleEmojiClick = (e: React.MouseEvent, data: IEmojiData) => {

        setText( text + data.emoji )
    };

    const handleMicClick = () => {

        if(recognition) {

            recognition.onstart = () => {

                setListening(true)
            }

            recognition.onend = () => {

                setListening(false)
            }

            recognition.onresult = (e:any) => {

                setText(e.results[0][0].transcript)
            }

            recognition.start();
        }
    };

    return(
        <div className='chatWindow'>

            <div className='chatWindow--header'>

                <div className='chatWindow--headerinfo'>

                    <ArrowBackIosNewIcon 
                        fontSize = 'small'
                        onClick = { onClick } 
                    />
                    <img className='chatWindow--avatar' src={ activeChat ? `${activeChat.avatar}` : '' } alt='foto de perfil' />
                    <div className='chatWindow--name'>{ activeChat.name }</div>

                </div>

                <div className='chatWindow--headerbuttons'>
                    
                    <div className='chatWindow--headerbutton'>
                        <SearchIcon style = {{color: '#54656F'}}/>
                    </div>

                    <div className='chatWindow--headerbutton'>
                        <MoreVertIcon style = {{color: '#54656F'}}/>
                    </div>

                </div>

            </div>
            

            <div 
                ref={ body }
                className='chatWindow--body'
            >

                { listMessage ?

                    listMessage.map((item, key) => (

                        <MessageItem
    
                            key = {key}
                            data = {item}
                            user = {user}
                        />
                    ))
                    :
                    null
                }

            </div>

            <div className='chatWindow--emojiarea'
                style = {{ height: openEmoji ? '250px' : '0px'}}
            >

                <EmojiPicker

                    onEmojiClick = { handleEmojiClick }
                 />

            </div>

            <div className='chatWindow--footer'>

                <div className='chatWindow--pre'>

                    <div className='chatWindow--headerbutton'
                        onClick = { () => setOpenEmoji(false) }
                        style = {{ width: openEmoji ? '40px' : '0px'}}
                    >
                        <CloseIcon fontSize = 'medium' style = {{color: '#54656F'}}/>
                    </div>

                    <div className='chatWindow--headerbutton'
                        onClick = { () => setOpenEmoji(true) } 
                    >
                        <InsertEmoticonIcon fontSize = 'medium' style = {{color: openEmoji? '#009698' : '#54656F'}}/>
                    </div>

                    <div className='chatWindow--headerbutton'>
                        <AttachFileIcon style = {{color: '#54656F'}}/>
                    </div>

                </div>

                <div className='chatWindow--inputarea'>

                    <input 
                        type='text'
                        placeholder='Mensagem'
                        value = { text }
                        onChange = { (e) => setText(e.target.value) }
                        onKeyPress = { handleInputEnter } 
                     />

                </div>

                <div className='chatWindow--pos'>

                    { !text &&
                        <div 
                            className='chatWindow--headerbutton'
                            onClick = { handleMicClick }
                        >
                            <MicIcon style = {{color: listening ? '#126ECE' : '#54656F'}}/>
                        </div>
                    }

                    { text &&
                        <div 
                            className='chatWindow--headerbutton'
                            onClick = { handleSendClick }
                        >
                            <SendIcon style = {{color: '#54656F'}}/>
                        </div>
                    }

                </div>

            </div>
        </div>
    )
}
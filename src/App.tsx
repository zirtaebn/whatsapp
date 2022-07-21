import React, { useState, useEffect} from 'react';
import './App.css';

import ChatListItem from './components/ChatListItem';
import ChatIntro from './components/ChatIntro';
import ChatWindow from './components/ChatWindow';
import NewChat from './components/NewChat';
import Login from './Login';

import Api from './Api/Api';


import { userType } from './types/userType'

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { User } from 'firebase/auth';

function App() {

  const [ chatList, setChatList] = useState<userType[] | undefined>([]);
  const [ activeChat, setActiveChat ] = useState<userType | undefined>();
  const [ isChatOpen, setIsChatOpen ] = useState(false);
  const [ user, setUser ] = useState<userType | null>(null);
  const [ showNewChat, setShowNewChat ] = useState(false);


  useEffect(() => {

    if (user){

      let unsub = Api.onChatList(user.id, setChatList);
      console.log(chatList);
      
      return unsub;
    }
      
  },[user])


  const handleLoginData = async ( user:User ) => {

    let newUser = 
    {

      id: user.uid,
      name: user.displayName,
      avatar: user.photoURL

    };

    Api.AddUser(newUser);
    setUser(newUser);
  }

  const handleClickChatListItem = (item:userType) => {

    setActiveChat(item);
    setIsChatOpen(true);
  }


  if(!user){

    return (<Login onReceive={handleLoginData}/>)
  }

  return (

    <div className='app-window'>

      <aside>

        <NewChat
          user = {user}
          showNewChat = {showNewChat}
          setShowNewChat = {setShowNewChat}
        />

          <header>
            
            { user.avatar &&
              <img className='header--avatar' 
                src={ user.avatar} 
                alt='foto de perfil' 
              />
            }

            <div className='header--buttons'>

              <div className='header--bttn'>
                <DonutLargeIcon fontSize = 'medium' style = {{color: '#54656F'}}/>             
              </div>
              <div 
                className='header--bttn'
                onClick = {() => setShowNewChat(true)}
              >
                <ChatIcon fontSize = 'medium' style = {{color: '#54656F'}}/>             
              </div>
              <div className='header--bttn'>
                <MoreVertIcon style = {{color: '#54656F'}}/>             
                </div>

            </div>

          </header>

        <div className='search'>

          <div className='search--input'>

            <SearchIcon fontSize = 'small' style = {{color: '#54656F'}}/>

            <input type='search' placeholder ='Pesquisar ou começar uma nova conversa'/>
          
          </div>

        </div>

        <div className='chat-list'>

          { chatList ? 

            chatList.map((item, key) => (

                <ChatListItem 
                  key = { key }
                  onClick = { () => handleClickChatListItem(item)}
                  data = { item }
                  active = { activeChat ? activeChat.chatId === item.chatId : null }
                />
              )
            )
            :

            null
          }

        
        </div>
      </aside>

      <div 
        className='content-area'
        style = {{left: isChatOpen ? '0px' : '100%'}}
      >

        { activeChat  &&

          <ChatWindow

            activeChat = { activeChat }
            onClick = { () => setIsChatOpen(false) }
            user = { user }

          />

        }

        { !activeChat &&

          <ChatIntro />

        }
        
        
        
      </div>
      
    </div>
  );
}

export default App;

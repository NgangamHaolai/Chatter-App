import { useEffect, useRef, useState } from 'react';
import chatStyle from '../styles/chat.module.css';
import contactsStyle from '../styles/contacts.module.css';
import main from '../styles/body.module.css';
import io from 'socket.io-client';
import axios from 'axios';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlinePoweroff } from "react-icons/ai";
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from "react-icons/bs";
import dotenv from 'dotenv';
dotenv.config();

import { useNavigate } from 'react-router-dom';

const socket = io(`${process.env.CHATTER_APP_URL_SERVER}`);

function Chat()
{
    const [ currentUserID, setCurrentUserID ] = useState('');
    const [ message, setMessage ] = useState("");
    const [ chat, setChat ] = useState([]);
    const [ contacts, setContacts ] = useState([]);
    const [ selectedUser, setSelectedUser ] = useState({});
    const [ logoutPopup, setLogoutPopup ] = useState(false);
    const [ showEmoji, setShowEmoji ] = useState(false);

    const [ isSmartphoneView, setIsSmartphoneView ] = useState(window.innerWidth < 700); // by default checks if already a smartphone screen. if so sets to true.
    const [ isDesktopView, setIsDesktopView ] = useState(window.innerWidth > 700);
    const [ showChat, setShowChat ] = useState(false);

    // const [ latestChatTime, setLatestChatTime ] = useState([]);

    const inputRef = useRef(null);
    const chatRef = useRef(null);
    const confirmRef = useRef();

    const navigate = useNavigate();

    useEffect(()=>
    {
        const handleResize = ()=>
        {
            setIsSmartphoneView(window.innerWidth < 700); // is screen is resized to less than 768px then is set to true.
            setIsDesktopView(window.innerWidth > 700);  // when screen width larger than 700px then its desktop size.
        };
        window.addEventListener("resize", handleResize);
        return ()=> window.removeEventListener("resize", handleResize); // return function cleans up the listener when the component unmounts — preventing memory leaks.
    }, []);

    function handleEmojiClick(e)
    {
        setMessage(prev => prev + e.emoji);
        setShowEmoji(false);
    }
    function handleEmojiPicker()
    {
        setShowEmoji(!showEmoji);
    }

    useEffect(()=>
    {
        retrieveContacts();
    }, []);

    useEffect(()=>
    {
        receiveMessage();
    }, []);

    useEffect(()=>  // so that this is called only when contacts size changes...
    {               // basically ensuring only after the retrieveContacts() function executes.
        if(contacts.length > 0) // again it has to do with Sockets being asynchronous
        {
            setUpChatRoom();
        }
    }, [selectedUser]); // this dependency is very very important...without it the messages would be weirdly received.

    // useEffect(()=>
    // {
    //     // handleLatestChatTime();
    // }, [handleSend]);

    useEffect(()=>
    {
        if(selectedUser && inputRef.current)    // automatically focus on the input text box.
        {
            inputRef.current.focus();
        }
    }), [selectedUser];
    
    useEffect(()=>
    {
        if(chatRef.current)     // automatically scroll to the latest text.
        {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chat]);

    async function retrieveContacts()
    {
        try
        {
            const response = await axios.get(`${process.env.CHATTER_APP_URL_SERVER}/api/chat/retrieveContacts`);
            const retrievedContacts = response.data;
            const ID = localStorage.getItem('ID');

            if(!ID)
            {
                return navigate('/login');
            }
            const index = retrievedContacts.findIndex((e)=>
                        {
                            return e._id === ID;
                        });
            const newContacts = [...retrievedContacts.slice(0, index), ...retrievedContacts.slice(index+1)]
            setContacts(newContacts);
            // set the first contact in the array as the default selected Contact.
            handleSelectedUser(newContacts[0]._id, newContacts[0].name, newContacts[0].avatar);
        }
        catch(err)
        {
            console.log(err);
        }
    }
    
    async function retrieveChat(selectedUserID)
    {
        try
        {
            const currentUserID = localStorage.getItem("ID");
            
            const response = await axios.get(`${process.env.CHATTER_APP_URL_SERVER}/api/chat/retrieveMessages?currentUserID=${currentUserID}&selectedUserID=${selectedUserID}`);
            // console.log(response.data);
            setChat(response.data.result);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    const userID = localStorage.getItem('ID');
    const selectedID = selectedUser.userID;
    const roomID = [selectedID, userID].sort().join("_");

    async function setUpChatRoom()
    {   // Chat-room required since connecting to the same socket is not possible
        setCurrentUserID(userID);        
        socket.emit("join_room", roomID);
        // socket.emit('register_user', userID);
    }

    function sendMessage()  // await is not enough in the context of Sockets so I had to use Promise
    {   // Promise ensures messages are retrieved only after they are stored.
        return new Promise((resolve, reject)=>
        {       // string conversion required for emojis to work.
            const cleanMessage = (typeof message === 'string') ? message.trim() : String(message).trim();
            if(cleanMessage)
            {
                socket.emit('send_message', 
                    { toUserID: selectedUser.userID, fromUserID: currentUserID, message: cleanMessage, roomID },
                callback =>
                {
                    if(callback)
                    {
                        resolve();
                    }
                    else
                    {
                        reject();
                        console.log("Error in promise!");
                    }
                });
            }
        });
    }

    function receiveMessage()
    {
        const handler = ({ fromUserID, message })=>
        {
            setChat(((prev)=>[...prev, {senderID: fromUserID, message, localTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toUpperCase()}]));
        }
        socket.on('receive_message', handler);

        return ()=>
        {
            socket.off('receive_message', handler);
        };
    }

    //  commented because messages should be stored from the backend not from the frontend.
    // async function storeMessage()  // not the suitable approach.
    // {
    //     try
    //     {
    //         const response = await axios.post('http://localhost:3000/api/chat/storeMessages', 
    //             { userID: currentUserID, toUser: selectedUser.userID, message });
    //         console.log(response.data);
    //     }
    //     catch(err)
    //     {
    //         console.log(err);
    //     }
    // }

    function handleInput(e)
    {
        setMessage(e.target.value);
    }
    function handleSelectedUser(userID, username, avatar)
    {
        setSelectedUser({userID, username, avatar});
        retrieveChat(userID);
        if(isSmartphoneView)
        {
            setShowChat(true);  // if smartphone view then when contact is clicked chat is shown.
        }
    }
    async function handleSend(e)
    {
        e.preventDefault();
        await sendMessage();  // Promise ensures retrieveChat() is executed only after sendMessage() is over.
        retrieveChat(selectedUser.userID);
        setMessage('');
    }
    function handleBack()
    {
        setShowChat(false);
    }
    function handleLogout()
    {
        setLogoutPopup(true);
    //     // confirmRef.current.focus();
    }
    function handleCancel()
    {
        setLogoutPopup(false);
    }
    function handleConfirm()
    {
        setLogoutPopup(false);
        localStorage.removeItem('ID');
        navigate('/login');
    }
    // function handleLatestChatTime()  // couldn't get it to work...too many complications
    // {
    //     let lastIndex = (chat.forEach(e=>{
    //         // console.log(e);
    //     }));
    //     // let lastTime = lastIndex?.localTime;
    //     // console.log(lastIndex);
    //     setLatestChatTime(lastIndex);
    // }

    return(<>
        <div className={main.body}>
        {(isDesktopView || ((isSmartphoneView && !showChat))) && <div className={contactsStyle.contacts}>
            <div className={contactsStyle.header}>
                <div>
                    <img className={contactsStyle.brand_logo} src='https://static.vecteezy.com/system/resources/previews/013/602/802/original/c-logo-design-template-vector.jpg'></img>
                </div>
                <div className={contactsStyle.brand_name}>CHATTER</div>
                <div className={contactsStyle.settings}>:::</div>
            </div>

            <div className={contactsStyle.contactsContainer}>
            <ul className={contactsStyle.contactlist}>
                {contacts.map((e)=>(
                <li key={e._id}>
                    <div className={contactsStyle.contact} onClick={()=>handleSelectedUser(e._id, e.name, e.avatar)}>
                        <div className={contactsStyle.profile_box}>
                            <img className={contactsStyle.profile_picture} src={e.avatar}></img>
                        </div>
                        <div className={contactsStyle.profile_name}>{e.name}</div>

                    </div> 
                </li>
                ))}
            </ul>
            </div>
        </div>}
                                {/* {latestChatTime.map((t)=> */}
                            {/* <div key={t._id} className={contactsStyle.time}>{t?.at(-1).localTime || null}</div> */}
                        {/* )} */}

        {(isDesktopView || (isSmartphoneView && showChat)) && <div className={chatStyle.container}>
            <div className={chatStyle.container1}>
                {(isSmartphoneView) && <div className={chatStyle.backButton} onClick={handleBack}>
                    <AiOutlineArrowLeft />
                </div>}
                <img className={chatStyle.profile} src={selectedUser.avatar}/>
                <p className={chatStyle.name}>{selectedUser._name || selectedUser.username}</p>
                <button className={chatStyle.logout} onClick={handleLogout}>
                    <AiOutlinePoweroff/>
                </button>
            </div>
            <div ref={chatRef} id='XID' className={chatStyle.container2}>
                <ul className={chatStyle.ulist}>
                    {chat.map((e, index)=>(
                        <li key={index} id='chatBox' className={`${e.senderID === currentUserID ? chatStyle.outgoing : chatStyle.incoming}`}>
                            {e.message}
                            <div className={chatStyle.time}>{e.localTime}</div>
                        </li>
                    ))}
                </ul>
            </div>
            {showEmoji && <EmojiPicker onEmojiClick={handleEmojiClick}/>}
            <form className={chatStyle.container3} onSubmit={handleSend}>
                <div className={chatStyle.sticker} onClick={handleEmojiPicker}>
                    <BsEmojiSmile size={20}/>
                </div>
                <input id='inputValue' className={chatStyle.input} onChange={handleInput} value={message} placeholder='message' autoFocus='true' autoComplete='off' ref={inputRef}></input>
                <button className={chatStyle.send} type='submit'>Send</button>
            </form>
        </div>}

        { logoutPopup && <div className={chatStyle.areYouSure}>
            <div className={chatStyle.popup}>
                Are you sure you want to Logout?
                <div className={chatStyle.buttons}>
                    <button className={chatStyle.button} onClick={handleCancel}>Cancel</button>
                    <button className={chatStyle.button} onClick={handleConfirm} ref={confirmRef}>Confirm</button>
                </div>
            </div>
        </div>}
        </div>
    </>)
}

export default Chat;
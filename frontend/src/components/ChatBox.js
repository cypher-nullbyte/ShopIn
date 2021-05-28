import React, { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT= window.location.host.indexOf('localhost') >=0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

export default function ChatBox(props){
    const {userInfo}=props;
    const [socket,setSocket]=useState(null);
    const uiMessagesRef=useRef(null);
    const [isOpen,setIsOpen]=useState(false);
    const [messageBody,setMessageBody]=useState('');
    const [messages,setMessages]=useState([
        {name:'Admin',body:'Dear Customer, Welcome to Instant Private Chat Helpline. How may we assist you!'},
    ]);
    // const userSignin=useSelector(state=>state.userSignin);
    // const {userInfo}=userSignin;

    useEffect(()=>{
        if(uiMessagesRef.current){
            uiMessagesRef.current.scrollBy({
                top:uiMessagesRef.current.clientHeight,
                left:0,
                behaviour:'smooth'
            })
        }
        if(socket){
            socket.emit('onLogin',{
                _id:userInfo._id,
                name:userInfo.name,
                isAdmin:userInfo.isAdmin,
            });

            socket.on('message',(data)=>{
                setMessages([...messages,{body:data.body,name:data.name}])
            });
        }
    },[messages,isOpen,socket,userInfo]);

    const supportHandler=()=>{
        setIsOpen(true);
        const sk=socketIOClient(ENDPOINT);
        setSocket(sk);
    };

    const submitHandler=(e)=>{
        e.preventDefault();
        if (!messageBody.trim()){
            alert('No message to send!');
        }
        else{
            setMessages([...messages,{body:messageBody,name:userInfo.name}]);
            setMessageBody('');
            setTimeout(()=>{
                socket.emit('onMessage',{
                    body:messageBody,
                    name:userInfo.name,
                    isAdmin:userInfo.isAdmin,
                    _id:userInfo._id,
                });
            },1000);
        }
    };

    const closeHandler=()=>{
        setIsOpen(false);
    };

    return(
        <div className="chatbox">
            {!isOpen ?(
                <button type="button" onClick={supportHandler}>
                    <i className="fa fa-comment" />
                </button>
            ):
            (
                <div className="card card-body">
                    <div className='row'>
                        <strong>Support</strong>
                        <button type="button" onClick={closeHandler} style={{backgroundColor:'#ffcccb'}}>
                            <i className="fa fa-close" />
                        </button>
                    </div>
                    <ul ref={uiMessagesRef}>
                        {messages.map((msg,idx)=>(
                            <li key={idx}>
                                <strong>{`${msg.name}: `}</strong> {msg.body}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <form onSubmit={submitHandler} className="row">
                            <input value={messageBody} onChange={e=>setMessageBody(e.target.value)}
                                type="text" placeholder="Type Message..." />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
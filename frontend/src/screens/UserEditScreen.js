import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_RESET } from '../constants/userConstants';


export default function UserEditScreen(props) {
    
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [isSeller,setIsSeller]=useState(false)
    const [isAdmin,setIsAdmin]=useState(false);

    const userDetails=useSelector(state=>state.userDetails);
    const {loading,error,user}=userDetails;

    const userUpdate=useSelector(state=>state.userUpdate);
    const {loading:loadingUpdate,error:errorUpdate,success:successUpdate}=userUpdate;

    const dispatch=useDispatch();
    const userId=props.match.params.id;
    useEffect(()=>{

        if(successUpdate)
        { 
        props.history.push('/userlist');
        dispatch({type:USER_UPDATE_RESET});
        }

        if(!user)
        {
            dispatch(detailsUser(userId));
        }
        else{
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
            setIsSeller(user.isSeller);
        }
    },[dispatch, userId, user, successUpdate, props.history]);

    const submitHandler=(e)=>{
        dispatch(updateUser({_id:userId,name,isSeller,isAdmin,email}));
    }

    return(
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                <h1>Edit User {name}</h1>
                {loadingUpdate && <LoadingBox />}
                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                {successUpdate && <MessageBox variant="success">SuccessFully Updated!</MessageBox>}
                </div>
                {loading? <LoadingBox />:
                error? <MessageBox variant="danger">{error}</MessageBox>
                :
                <>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" placeholder="Enter Name" value={name} onChange={e=>setName(e.target.value)} />

                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="Enter Email" value={email} onChange={e=>setEmail(e.target.value)} />
                        
                    </div>
                    <div>
                        <label htmlFor="isSeller">IsSeller</label>
                        <input id="isSeller" type="checkbox"  checked={isSeller} onChange={e=>setIsSeller(e.target.checked)} />
                        
                    </div>
                    <div>
                        <label htmlFor="isAdmin">IsAdmin</label>
                        <input id="isAdmin" type="checkbox"  checked={isAdmin} onChange={e=>setIsAdmin(e.target.checked)} />
                        
                    </div>
                    <button type="submit" className="primary">Update</button>
                </>}
            </form>
        </div>
    )
};
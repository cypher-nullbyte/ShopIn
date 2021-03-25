import axios from "axios";
import { USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_LIST_FAIL, USER_LIST_REQUEST, 
    USER_LIST_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, 
    USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNOUT, 
    USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS ,
    USER_DELETE_REQUEST,USER_DELETE_SUCCESS,USER_DELETE_FAIL} from "../constants/userConstants"

export const signin=(email,password)=>async(dispatch)=>{
    dispatch({type:USER_SIGNIN_REQUEST,payload:{email,password}});
    axios.post(`/api/users/signin`,{email,password})
    .then(res=>{
        dispatch({type:USER_SIGNIN_SUCCESS, payload:res.data});
        localStorage.setItem('userInfo',JSON.stringify(res.data));
    })
    .catch(err=>
    {
        dispatch({type:USER_SIGNIN_FAIL,payload:err.response && err.response.data.message 
        ? err.response.data.message
        : err.message});
    });
}


export const signout=()=>async(dispatch)=>{
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    dispatch({type:USER_SIGNOUT});
};


export const register=(name,email,password)=>async(dispatch)=>{
    dispatch({type:USER_REGISTER_REQUEST,payload:{email,password}});
    axios.post(`/api/users/register`,{name,email,password})
    .then(res=>{
        dispatch({type:USER_REGISTER_SUCCESS, payload:res.data});
        dispatch({type:USER_SIGNIN_SUCCESS, payload:res.data});
        localStorage.setItem('userInfo',JSON.stringify(res.data));
    })
    .catch(err=>
    {
        dispatch({type:USER_REGISTER_FAIL,payload:err.response && err.response.data.message 
        ? err.response.data.message
        : err.message});
    });
};

export const detailsUser=(userId)=>async(dispatch,getState)=>{
    dispatch({type: USER_DETAILS_REQUEST,payload:userId});
    const {userSignin:{userInfo}}=getState();
    // console.log(userId);
    axios.get(`/api/users/${userId}`,{
        headers:{
            Authorization:`Bearer ${userInfo.token}`,
        }
    })
    .then(res=>{
        dispatch({type:USER_DETAILS_SUCCESS, payload:res.data});
    })
    .catch(err=>
    {
        // console.log(err);
        dispatch({type:USER_DETAILS_FAIL,payload:err.response && err.response.data.message 
        ? err.response.data.message
        : err.message});
    });
};



export const updateUserProfile=(user)=>async(dispatch,getState)=>{
    dispatch({type:USER_UPDATE_PROFILE_REQUEST,payload:user});
    const {userSignin:{userInfo}}=getState();
    try{
        const {data}=await axios.put(`/api/users/profile`,user,{
            headers:{
                Authorization:`Bearer ${userInfo.token}`
            }
        });
        dispatch({type:USER_UPDATE_PROFILE_SUCCESS,payload:data});
        dispatch({type:USER_SIGNIN_SUCCESS,payload:data});
        localStorage.setItem('userInfo',JSON.stringify('data'));
    }
    catch(err)
    {
        dispatch({type:USER_UPDATE_PROFILE_FAIL,payload:err.response && err.response.data.message 
            ? err.response.data.message
            : err.message});
    }
};

export const listUsers=()=>async(dispatch,getState)=>{
    dispatch({type:USER_LIST_REQUEST});
    const {userSignin:{userInfo}}=getState();
    axios.get('/api/users/',{
        headers:{Authorization:`Bearer ${userInfo.token}`}
    })
    .then(res=>
        {
            dispatch({type:USER_LIST_SUCCESS,payload:res.data});
        })
    .catch(err=>{
        dispatch({type:USER_LIST_FAIL,payload:err.response && err.response.data.message 
            ? err.response.data.message
            : err.message});
    });
};


export const deleteUser=(userId)=>async(dispatch,getState)=>{
    dispatch({type:USER_DELETE_REQUEST});
    const {userSignin:{userInfo}}=getState();
    axios.delete(`/api/users/${userId}`,{
        headers:{Authorization:`Bearer ${userInfo.token}`}
    })
    .then(res=>
        {
            dispatch({type:USER_DELETE_SUCCESS,payload:res.data});
        })
    .catch(err=>{
        dispatch({type:USER_DELETE_FAIL,payload:err.response && err.response.data.message 
            ? err.response.data.message
            : err.message});
    }); 
};
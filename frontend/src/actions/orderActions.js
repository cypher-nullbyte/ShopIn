import axios from "axios";
import { CART_EMPTY } from "../constants/cartConstants";
import { ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SCUCCESS, ORDER_MINE_LIST_FAIL, ORDER_MINE_LIST_REQUEST, ORDER_MINE_LIST_SUCCESS, ORDER_PAY_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS ,
ORDER_LIST_REQUEST,ORDER_LIST_SUCCESS,ORDER_LIST_FAIL, ORDER_DELETE_REQUEST, ORDER_DELETE_FAIL, ORDER_DELETE_SUCCESS, ORDER_DELIVER_REQUEST, ORDER_DELIVER_SUCCESS, ORDER_DELIVER_FAIL} from "../constants/orderConstants"

export const createOrder=(order)=>async(dispatch,getState)=>{
    dispatch({type:ORDER_CREATE_REQUEST,payload:order});
    const {userSignin:{userInfo}}=getState();
    axios.post(`/api/orders`,order,{
        headers:{
            Authorization:`Bearer ${userInfo.token}`,
        }
    })
    .then(res=>{
        dispatch({type:ORDER_CREATE_SUCCESS, payload:res.data.order});
        dispatch({type:CART_EMPTY});
        localStorage.removeItem('cartItems');
    })
    .catch(err=>
    {
        dispatch({type:ORDER_CREATE_FAIL,payload:err.response && err.response.data.message 
        ? err.response.data.message
        : err.message});
    });
};

export const detailsOrder=orderId=>async(dispatch,getState)=>{
    dispatch({type:ORDER_DETAILS_REQUEST,payload:orderId});
    const {userSignin:{userInfo}}=getState();
    try{
        const {data}=await axios.get(`/api/orders/${orderId}`,{
            headers:{Authorization:`Bearer ${userInfo.token}`}
        });
        dispatch({type:ORDER_DETAILS_SCUCCESS,payload:data});
    }
    catch(err){
        dispatch({type:ORDER_DETAILS_FAIL,payload:err.response && err.response.data.message 
            ? err.response.data.message
            : err.message});
    }
};

export const payOrder =(order,paymentResult)=>async(dispatch,getState)=>{
    dispatch({type:ORDER_PAY_REQUEST, payload:{order,paymentResult}});
    const {userSignin:{userInfo}}=getState();
    axios.put(`/api/orders/${order._id}/pay`,paymentResult,{
        headers:{
            Authorization:`Bearer ${userInfo.token}`,
        }
    })
    .then(res=>{
        dispatch({type:ORDER_PAY_SUCCESS, payload:res.data});
    })
    .catch(err=>
    {
        dispatch({type:ORDER_PAY_FAIL,payload:err.response && err.response.data.message 
        ? err.response.data.message
        : err.message});
    });
};


export const listOrderMine=()=>async(dispatch,getState)=>{
    dispatch({type: ORDER_MINE_LIST_REQUEST});

    const {userSignin:{userInfo}}=getState();

    axios.get('/api/orders/mine',{
        headers:{
            Authorization:`Bearer ${userInfo.token}`,
        }
    })
    .then(res=>{
        dispatch({type:ORDER_MINE_LIST_SUCCESS, payload:res.data});
    })
    .catch(err=>
    {
        dispatch({type:ORDER_MINE_LIST_FAIL,payload:err.response && err.response.data.message 
        ? err.response.data.message
        : err.message});
    });
};

export const listOrders=()=>async(dispatch,getState)=>{
    dispatch({type:ORDER_LIST_REQUEST});
    const {userSignin:{userInfo}}=getState();
    axios.get('/api/orders',{
        headers:{
            Authorization:`Bearer ${userInfo.token}`,
        }
    })
    .then(res=>{
        dispatch({type:ORDER_LIST_SUCCESS, payload:res.data});
    })
    .catch(err=>
    {
        dispatch({type:ORDER_LIST_FAIL,payload:err.response && err.response.data.message 
        ? err.response.data.message
        : err.message});
    });
};


export const deleteOrder=(orderId)=>async(dispatch,getState)=>{
    dispatch({type:ORDER_DELETE_REQUEST,payload:orderId});
    const {userSignin:{userInfo}}=getState();

    axios.delete(`/api/orders/${orderId}`,{
        headers:{Authorization:`Bearer ${userInfo.token}`}
    })
    .then(res=>
        {
            dispatch({type:ORDER_DELETE_SUCCESS,payload:res.data});
        })
    .catch(err=>{
        dispatch({type:ORDER_DELETE_FAIL,payload:err.response && err.response.data.message 
            ? err.response.data.message
            : err.message});
    });
};


export const deliverOrder =(orderId)=>async(dispatch,getState)=>{
    dispatch({type:ORDER_DELIVER_REQUEST, payload:{orderId}});
    const {userSignin:{userInfo}}=getState();
    axios.put(`/api/orders/${orderId}/deliver`,{},{
        headers:{
            Authorization:`Bearer ${userInfo.token}`,
        }
    })
    .then(res=>{
        dispatch({type:ORDER_DELIVER_SUCCESS, payload:res.data});
    })
    .catch(err=>
    {
        dispatch({type:ORDER_DELIVER_FAIL,payload:err.response && err.response.data.message 
        ? err.response.data.message
        : err.message});
    });
};

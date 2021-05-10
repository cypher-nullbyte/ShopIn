import axios from "axios"
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_DATA, CART_SAVE_SHIPPING_ADDRESS,CART_ADD_ITEM_FAIL } from "../constants/cartConstants";

export const addToCart=(productId,qty)=> async(dispatch,getState)=>
{
    const {data}=await axios.get(`/api/products/${productId}`);
    const {cart:{cartItems}}=getState();
    if(cartItems.length>0 && data.seller._id!==cartItems[0].seller._id)
    {
        dispatch({type:CART_ADD_ITEM_FAIL,
            payload:"Can't Add to Cart. Buy from one seller in each order!"    
        });
    }
    else
    {
        dispatch({
            type:CART_ADD_ITEM,
            payload:{
                name:data.name,
                image:data.image,
                price:data.price,
                countInStock:data.countInStock,
                product:data._id,
                seller:data.seller,
                qty
            }
        });
        localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems));
    }
}


export const removeFromCart=(productId)=> async(dispatch,getState)=>
{
    dispatch({type: CART_REMOVE_ITEM, payload:productId});
    localStorage.setItem('cartItmes',JSON.stringify(getState().cart.cartItems));
}


export const saveShippingAddress =(data)=>async(dispatch)=>{
    dispatch({type: CART_SAVE_SHIPPING_ADDRESS,payload:data});
    localStorage.setItem('shippingAddress',JSON.stringify(data));
}

export const savePaymentMethod=(data)=>async(dispatch)=>{
    dispatch({type:CART_SAVE_PAYMENT_DATA,payload:data});
};
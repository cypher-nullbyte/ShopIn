import './App.css';
import {BrowserRouter, Link, Route} from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import { useDispatch, useSelector } from 'react-redux';
import SigninScreen from './screens/SigninScreen';
import { signout } from './actions/userActions';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import { useEffect, useState } from 'react';
import { listProductsCategories } from './actions/productActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import SupportScreen from './screens/SupportScreen';
import ChatBox from './components/ChatBox';
function App() {

  const productCategoryList=useSelector(state=>state.productCategoryList);
  const {loading:loadingCategories,error:errorCategories,categories}=productCategoryList;
  const cart=useSelector(state=>state.cart);

  const [sidebarIsOpen,setSidebarIsOpen]=useState(false);

  const {cartItems}=cart;
  const userSignin=useSelector(state=>state.userSignin);
  const {userInfo}=userSignin;
  
  const dispatch=useDispatch();
  const signoutHandler=()=>{
    dispatch(signout());
  };
  useEffect(()=>{
    dispatch(listProductsCategories());
  },[dispatch]);
  

  return (
    <BrowserRouter>
      <div className="grid-container">
      <header className="row">
        <div>
          <button type="button" className="open-sidebar" onClick={setSidebarIsOpen.bind(this,true)}>
            <li className="fa fa-bars" ></li>
          </button>
          <Link className="brand" to="/">ShopIn</Link>
        </div>
        <div>
          <Route render={({history})=><SearchBox history={history}></SearchBox>} />
        </div>
        <div>
          <Link to="/cart">Cart
          {cartItems.length>0 &&(
            <span className="badge">{cartItems.length}</span>
          )}</Link>
          {
            userInfo ? (
              <div className="dropdown">
                 <Link to="#">
                  {userInfo.name} {' '}
                  <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">OrderHistory</Link>
                  </li>
                  <li>
                    <Link to="/" onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </li>
                  </ul>
              </div>
            ):
              <Link to="/signin">Sign In</Link>
          }
          {userInfo && userInfo.isSeller && (
            <div className="dropdown">
              <Link to="#admin">
                Seller <i className="fa fa-caret-down"></i>
              </Link>
              <ul className="dropdown-content">
                <li>
                  <Link to="/productlist/seller">Products</Link>
                </li>
                <li>
                  <Link to="/orderlist/seller">Orders</Link>
                </li>
              </ul>
            </div>)
          }
          {
            userInfo && userInfo.isAdmin &&
              <div className="dropdown">
                <Link to="#admin">Admin <i className="fa fa-caret-down"></i></Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/productlist">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                  <li>
                    <Link to="/support">Support</Link>
                  </li>
                </ul>
              </div>
          }
        </div>
      </header>
      <aside className={sidebarIsOpen? 'open':''}>
        <ul className="categories">
          <li>
            <strong>Categories</strong>
            <button onClick={setSidebarIsOpen.bind(this,false)} className="close-sidebar" type="button">
              <i className="fa fa-close"></i>
            </button>
          </li>
          {loadingCategories? (<LoadingBox/>)
            : errorCategories ? <MessageBox variant="danger">{errorCategories}</MessageBox>
            : (
              categories.map(c=><li key={c}><Link to={`/search/category/${c}`} onClick={setSidebarIsOpen.bind(this,false)}>{c}</Link></li>)
          )}
        </ul>
      </aside>
      <main>
      <PrivateRoute path="/seller/:id" component={SellerScreen}></PrivateRoute>
      <Route path="/cart/:id?" component={CartScreen} /> 
      <Route path="/product/:id" component={ProductScreen} exact />
      <Route path="/product/:id/edit" component={ProductEditScreen} exact />
      <Route path="/signin" component={SigninScreen} />
      <Route path="/register" component={RegisterScreen} />
      <Route path="/shipping" component={ShippingAddressScreen} />
      <Route path="/payment" component={PaymentMethodScreen} />
      <Route path="/placeorder" component={PlaceOrderScreen} />
      <Route path="/order/:id" component={OrderScreen} />
      <Route path="/orderhistory" component={OrderHistoryScreen} />
      <Route path="/" component={HomeScreen} exact />
      <Route path="/search/name/:name?" component={SearchScreen} exact></Route>
      <Route path="/search/category/:category" component={SearchScreen} exact></Route>
      <Route path="/search/category/:category/name/:name" component={SearchScreen} exact></Route>
      <Route path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order" component={SearchScreen} exact></Route>

      <PrivateRoute path="/profile" component={ProfileScreen}/>
      
      <AdminRoute path="/productlist" exact component={ProductListScreen} />
      <AdminRoute path="/orderlist"  exact component={OrderListScreen} />
      <AdminRoute path="/userlist" component={UserListScreen} />
      <AdminRoute path="/user/:id/edit" component={UserEditScreen} />
      <AdminRoute path="/support" component={SupportScreen} />
      
      <SellerRoute path="/productlist/seller" component={ProductListScreen}></SellerRoute>
      <SellerRoute path="/orderlist/seller" component={OrderListScreen}></SellerRoute>
      </main>

      <footer className="row center">
        {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
        <div>
          &copy;ShopIn.Inc
        </div>
      </footer>
    </div>
  </BrowserRouter>
  );
}

export default App;
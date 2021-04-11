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
function App() {

  const cart=useSelector(state=>state.cart);
  const {cartItems}=cart;
  const userSignin=useSelector(state=>state.userSignin);
  const {userInfo}=userSignin;
  
  const dispatch=useDispatch();
  const signoutHandler=()=>{
    dispatch(signout());
    
  };
  

  return (
    <BrowserRouter>
      <div className="grid-container">
      <header className="row">
        <div>
          <Link className="brand" to="/">ShopIn</Link>
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
                </ul>
              </div>
          }
        </div>
      </header>
      <main>
      <Route path="/seller/:id" component={SellerScreen}></Route>
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
      <PrivateRoute path="/profile" component={ProfileScreen}/>
      <AdminRoute path="/productlist" exact component={ProductListScreen} />
      <AdminRoute path="/orderlist"  exact component={OrderListScreen} />
      <AdminRoute path="/userlist" component={UserListScreen} />
      <AdminRoute path="/user/:id/edit" component={UserEditScreen} />
      <Route path="/" component={HomeScreen} exact />
      <SellerRoute path="/productlist/seller" component={ProductListScreen}></SellerRoute>
      <SellerRoute path="/orderlist/seller" component={OrderListScreen}></SellerRoute>
      </main>
      <footer className="row center">&copy;ShopIn.Inc</footer>
    </div>
  </BrowserRouter>
  );
}

export default App;
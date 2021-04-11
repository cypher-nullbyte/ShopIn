import React, { useEffect} from 'react';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {useDispatch, useSelector} from 'react-redux';
import { listProducts } from '../actions/productActions';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Carousel} from 'react-responsive-carousel';
import { listTopSellers } from '../actions/userActions';
import { Link } from 'react-router-dom';


export default function HomeScreen()
{
    // const [products,setProducts]=useState([]);
    // const [error, setError]=useState(false);
    // const [loading, setLoading]=useState(false);
    
    // useEffect(()=>{
    //     const fetchData=async()=>{
    //     try{
    //         setLoading(true);
    //         const {data}=await axios.get('/api/products');
    //         setProducts(data);
    //         setLoading(false);
    //     }
    //     catch(err)
    //     {
    //         setError(err.message);
    //         setLoading(false);
    //     }};
    //     fetchData();
    // },[]);

    const dispatch=useDispatch();
    const productList=useSelector(state=>state.productList);
    const {loading,error,products}=productList;


    const userTopSellersList=useSelector(state=>state.userTopSellersList);
    const {loading:sellerLoading,error:sellerError,users:sellers}=userTopSellersList;

    useEffect(()=>{
        dispatch(listProducts({}));
        dispatch(listTopSellers());
    },[dispatch]);

    return (
        <div>
            <h2>Top Sellers</h2>
            {sellerLoading? <LoadingBox></LoadingBox>
            : sellerError?<MessageBox variant="danger">{sellerError}</MessageBox> 
            :(
                <>
                {sellers.length===0 &&<MessageBox  variant="danger">No Seller Found</MessageBox>}
                <Carousel showArrows autoPlay showThumbs={false}>
                    {sellers.map(seller=>(
                        <div key={seller._id}>
                            <Link to={`/seller/${seller._id}`}>
                                <img src={seller.seller.logo} alt={seller.seller.name} />
                                <p className="legend">{seller.seller.name}</p>
                            </Link>
                        </div>
                    ))}
                </Carousel>
                </>
            )
            }
            <h2>Featured Products</h2>
            {loading? <LoadingBox></LoadingBox>
            : error?<MessageBox variant="danger">{error}</MessageBox> 
            : 
            <>
                {products.length===0 &&<MessageBox  variant="danger">No Product Found</MessageBox>}
                <div className="row center">
                {
                    products.map(product=>(
                    <Product key={product._id} product={product} />
                    ))
                }
                </div>
            </>
            
            }
        </div>
        );
}
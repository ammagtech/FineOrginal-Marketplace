import React, { useEffect, useState, Component } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RingLoader } from "react-spinners";
import heart from "../../../assets/images/heart-icon.png";
import verified from "../../../assets/images/verified-icon.png";
import defaultImg from "../../../assets/images/default.png";
import { useLocation, useHistory } from "react-router-dom";
import GetNftMarketAction from "../../../Redux/Actions/NftActions/GetNftMarketAction";
import { toast, ToastContainer } from "react-toastify";
import GetFavouriteNftAction from "../../../Redux/Actions/NftActions/GetFavouriteNftAction";
import NftItem from "../../shared/NftItem";

const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

class CustomSlide extends Component {
  render() {
    const { index, ...props } = this.props;
    return <div {...props}></div>;
  }
}
function MarketNfts() {
  const Marketplaceprodu = useSelector(
    (state) => state.GetNftMarket?.GetNftMarketResponse?.data
  );
  const location = useLocation();
  const history = useHistory();
 const [loadmorebutton,setLoadmorebutton]=useState(true)
 const [loadmorebutton1,setLoadmorebutton1]=useState(true)
  const [isloading, setIsloading] = useState(true);
  const [allData, setAllData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [pathname, setPathname] = useState();
  const [change, setchange] = useState(false);
  
  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );
  const Token = useSelector((state) => state.Login?.authResponse?.data?.token);
  const isConnected = useSelector((state) => state.Login?.authResponse?.data);

  const dispatch = useDispatch();
  const GetFavouriteNft = useSelector(
    (state) => state.GetFavouriteNft?.GetFavouriteNftResponse?.data
  );
  const [marketNfts, SetMarketNfts] = useState(Marketplaceprodu?.filter((nft)=>nft.isBidOpen!=true).slice(0, 4));
  const [NFTsonBid,setNFTsonBid]=useState(Marketplaceprodu?.filter((nft)=>nft.isBidOpen==true).slice(0,4));
  
  const [NFTsonsale,setNFTsonsale]=useState(Marketplaceprodu?.filter((nft)=>nft.isBidOpen!=true).slice(0,4));
  const loadMore = () => {
    let marketNftstate = NFTsonsale;
    let start = marketNftstate?.length;
    let end = marketNftstate?.length + 4;
    if(loadmorebutton===false)
     {
      setNFTsonsale([
          ...Marketplaceprodu?.filter((nft)=>nft.isBidOpen!=true).slice(0, 4),
        ]);
    
      setLoadmorebutton(true)
      setchange()
      return
     }
   if(Marketplaceprodu?.filter((nft)=>nft.isBidOpen!=true).length<end ) setLoadmorebutton(false);
    if (filterData?.length) {
      setNFTsonsale([...marketNftstate, ...filterData?.slice(start, end)]);
    } 
    else {
      setNFTsonsale([
        ...marketNftstate,
        ...Marketplaceprodu?.filter((nft)=>nft.isBidOpen!=true).slice(start, end),
      ]);
    }

  };
  const loadMore1 = () => {
    let marketNftstate = NFTsonBid;
    let start = marketNftstate?.length;
    let end = marketNftstate?.length + 4;
    if(loadmorebutton1===false)
     {
      setNFTsonBid([
          ...Marketplaceprodu?.filter((nft)=>nft.isBidOpen==true).slice(0, 4),
        ]);
    
      setLoadmorebutton1(true)
      setchange()
      return
     }
   if(Marketplaceprodu?.filter((nft)=>nft.isBidOpen==true).length<end ) setLoadmorebutton1(false);
    if (filterData?.length) {
      setNFTsonBid([...marketNftstate, ...filterData?.slice(start, end)]);
    } 
    else {
      setNFTsonBid([
        ...marketNftstate,
        ...Marketplaceprodu?.filter((nft)=>nft.isBidOpen==true).slice(start, end),
      ]);
    }
  };
  async function callback() 
   {
    var params = window.location.pathname;
    setPathname(params.split("/")[1]);
    setTimeout(async () => {
      await dispatch(GetNftMarketAction())
        .then((res) => {
          setIsloading(false);
        })
        .catch((error) => {
          setIsloading(false);
          toast.error(`${error?.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false, 
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      if (isConnected) {
        await dispatch(GetFavouriteNftAction());
      }
    }, 3000);
  }

  useEffect(() => {
      setchange()

  }, [change]);


  useEffect(async () => {
    var params = window.location.pathname;
    setPathname(params.split("/")[1]);
    setTimeout(async () => {
      await dispatch(GetNftMarketAction())
        .then((res) => {
          setIsloading(false);
        })
        .catch((error) => {
          setIsloading(false);
          toast.error(`${error?.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      if (isConnected) {
        await dispatch(GetFavouriteNftAction());
      }
    }, 3000);
  }, []);

  useEffect(() => {
    setNFTsonsale(Marketplaceprodu?.filter((nft)=>nft.isBidOpen!=true).slice(0, 4));
    setAllData(Marketplaceprodu);
    setNFTsonBid(Marketplaceprodu?.filter((nft)=>nft.isBidOpen==true).slice(0,4))
  }, [Marketplaceprodu]);



  const apisCall=()=>{
    dispatch(GetNftMarketAction());
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      {/* {location.pathname !== "/" && ( */}
      <section className="jumbotron breadcumb no-bg">
        <div className="small-pnl secnd-anime">
          <div className="bg-layer"></div>
          {/* <span className="circle-span anim small yelow position-1"></span>
          <span className="circle-span anim small green position-4"></span>
          <span className="circle-span anim small green position-6"></span>
          <span className="circle-span anim star rotate-anim position-7"></span>
          <span className="circle-span anim star rotate-anim position-8"></span>
          <span className="square-span anim small rotate-anim yelow position-9"></span>
          <span className="square-span anim small rotate-anim green position-10"></span>
          <span className="square-big-span yellow anim translate-anim-1 position-11"></span>
          <span className="square-big-span greeen anim translate-anim-2 position-12"></span> */}
        </div>
        <div className="mainbreadcumb markert-banner">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h1 className="text-center">Marketplace</h1>
                {/* <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/">Home</a></li>
                      <li className="breadcrumb-item active" aria-current="page">Marketplace</li>
                    </ol>
                  </nav> */}
        
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="row">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
          />
         

          {isloading ? (
            <div className="col-sm-12 d-flex justify-content-center">
              <RingLoader color="orange" size="60" />
            </div>
          ) :
    <>
       <div className="col-lg-12 col-xl-12 col-sm-12 col-sm-12 onStep css-keef6k">
                        <h3 className="style-brder">Auctions</h3>
                        <h2>Auction Items</h2>
                    </div>    
    {
       NFTsonBid.length==0?
       <div className="col-sm-12 text-center">
              No NFT Record Found
            </div>:
       NFTsonBid?.map((nft, index) =>
       (
         <div
           key={index}
           className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4"
         >
           <div className="nft market-nft">
             <NftItem nft={nft} key={index} likeAndDisLikeCallback={apisCall}/>
           </div>
         </div>
       )

       )
     }
      {
           
           Marketplaceprodu?.filter((nft)=>nft.isBidOpen==true)?.length>4?
         <div className="col-lg-12">
                        <div className="spacer-single"></div>
                        <span
                          onClick={loadMore1}
                          className="btn-main lead m-auto"
                        >
                          {
                            loadmorebutton1?"Load More":"Load Less"
                          }
                        </span>
                      </div>:<></>
        }
    <div className="col-lg-12 col-xl-12 col-sm-12 col-sm-12 onStep css-keef6k">
                        <h3 className="style-brder">Sell</h3>
                        <h2>Sell Items</h2>
                    </div>    
     {     
      NFTsonsale?.length==0?
      <div className="col-sm-12 text-center">
              No NFT Record Found
            </div>:
        NFTsonsale.map((nft, index) =>
            (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4"
              >
                <div className="nft market-nft">
                  <NftItem nft={nft} key={index} likeAndDisLikeCallback={apisCall}/>
                </div>
              </div>
            )

            )
          
          
          }
          {    
          Marketplaceprodu?.filter((nft)=>nft.isBidOpen!=true)?.length>4?
           <div className="col-lg-12">
                        <div className="spacer-single"></div>
                        <span
                          onClick={loadMore}
                          className="btn-main lead m-auto"
                        >
                          {
                            loadmorebutton?"Load More":"Load Less"
                          }
                        </span>
                      </div>  :<></>
}   
           </>
 
}
</div>
      </section>

    </>
  );
}

export default MarketNfts;

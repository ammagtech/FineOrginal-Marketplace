import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import BuyUserNft from "./BuyUserNft";
import http from "../../../Redux/Api/http";
import { PulseLoader } from "react-spinners";
import bnbimg from "../../../assets/images/bnb.png";
import { useDispatch, useSelector } from "react-redux";
import RemoveFavouriteNftAction from "../../../Redux/Actions/NftActions/RemoveFavouriteNftAction";
import GetFavouriteNftAction from "../../../Redux/Actions/NftActions/GetFavouriteNftAction";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import defaultImg from "../../../assets/images/default.png";
import NftItem from "../../shared/NftItem";


function UserNfts() {
  const dispatch = useDispatch();


  const [userNftData, setUserNftData] = useState();
  const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
  const [loading, setLoading] = useState(true);
  const [numItems, setNumItems] = useState(4)
  const history = useHistory();
  const [favouriteInProgress, setFavouriteInProgress] = useState(false);

  const isConnected = useSelector((state) => state.Login?.authResponse?.data);
  const Token = useSelector((state) => state.Login?.authResponse?.data?.token);
  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );
  
  const GetFavouriteNft = useSelector(
    (state) => state.GetFavouriteNft?.GetFavouriteNftResponse?.data
  );

  useEffect(async ()=>{
    if (isConnected) {
      await dispatch(GetFavouriteNftAction());
    }
  },[])

  useEffect(() => {
    apisCall()
  }, []);

  const apisCall=()=>{
    
    let params = window.location.pathname;
    http
      .get(
        httpUrl +
        `/api/v1/Account/GetUserAccount?address=${params.split("/")[2]}&logedinWalletAddress=${WalletAddress}`
      )
      .then((res) => {
        setUserNftData(res.data.data.nftRequestModelList);
        setLoading(false);
      })
      .catch((error) => {
      });
  }
  
  const [height, Setheight] = useState(270);

  const loadMore = () => {
    if(userNftData?.length > numItems){
        setNumItems( (prev) => prev + 4 )
    }
  };

  
  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      Setheight({
        height: img.offsetHeight,
      });
    }
  };
  return (
    <div className="row">
      {loading ? (
        <PulseLoader color="white" size="11" />
      ) : (
        <>
        
          {userNftData?.slice(0, numItems).map((nft, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4 cursor-pointor"
              >
                
               <NftItem nft={nft} likeAndDisLikeCallback={apisCall}/>
              </div>
            ))}
          
          {userNftData?.length > numItems && (
            <div className="col-lg-12">
              <div className="spacer-single"></div>
              <span onClick={loadMore} className="btn-main lead m-auto">
                Load More
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserNfts;

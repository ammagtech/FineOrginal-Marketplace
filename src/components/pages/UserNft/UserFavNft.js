import React, { useEffect, useState, useRef } from "react";

import { Link, useHistory, useParams } from "react-router-dom";
import { PropagateLoader, RingLoader } from "react-spinners";

import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import GetUserFavouriteNftAction from "../../../Redux/Actions/NftActions/GetUserFavouriteNftAction";
import axios from "axios";
import http from "../../../Redux/Api/http";
import RemoveFavouriteNftAction from "../../../Redux/Actions/NftActions/RemoveFavouriteNftAction";
import GetFavouriteNftAction from "../../../Redux/Actions/NftActions/GetFavouriteNftAction";
import swal from "sweetalert";
import defaultImg from "../../../assets/images/default.png";
import NftItem from "../../shared/NftItem";
const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

function UserFavNft() {
  const history = useHistory();
  const { id } = useParams()
  const [isloading, setIsloading] = useState(true);

  const dispatch = useDispatch();
  const searchRef = useRef();
  const [allData, setAllData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [favData, setFavData] = useState();
  const [favLoader, setFavLoader] = useState(true);
  const [filterTrigger, setFilterTrigger] = useState(false);
  const [numItems, setNumItems] = useState(4)
  const [favouriteInProgress, setFavouriteInProgress] = useState(false);


  const [filter, setfilter] = useState([]);
  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );

  const isConnected = useSelector((state) => state.Login?.authResponse?.data);
  const Token = useSelector((state) => state.Login?.authResponse?.data?.token);

  const GetFavouriteNft = useSelector(
    (state) => state.GetFavouriteNft?.GetFavouriteNftResponse?.data
  );
  const test = useSelector(
    (state) => state
  );

  const [favourites, SetFavourites] = useState(GetFavouriteNft?.slice(0, 5));
  const [height, Setheight] = useState(270);

  useEffect(()=>{
    getFavNfts()
  }, [])

  useEffect(async ()=>{
    if (isConnected) {
      await dispatch(GetFavouriteNftAction());
    }
  },[])


  const getFavNfts = () =>{
    http
        .get(httpUrl + `/api/v1/Nft/GetUserFavouriteNft?Address=${id}`)
        .then((res) => {
          setFavData(res.data.data)
          setFavLoader(false)
        })
  }

  useEffect(() => {
    SetFavourites(GetFavouriteNft?.slice(0, 5));
    setAllData(GetFavouriteNft);
  }, [GetFavouriteNft]);

  useEffect(async () => {
    await dispatch(GetUserFavouriteNftAction())
      .then((res) => {
        setIsloading(false);
      })
      .catch((error) => {
        setIsloading(false);
        toast.success(`${error?.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }, []);

  const loadMore = () => {
    if(favData?.length > numItems){
        setNumItems( (prev) => prev + 4 )
    }
    // // console.log("useer Data", userNftData)
    // let nftState = nfts;
    // let start = nftState.length;
    // let end = nftState.length + 4;
    // Setnfts([...nftState, ...userNftData?.slice(start, end)]);
  };
  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      Setheight({
        height: img?.offsetHeight,
      });
    }
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;

    setfilter(
      allData?.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const resetFilter = () => {
    SetFavourites(allData?.slice(0, 5));
    setfilter([]);
    setFilterTrigger(false);

    searchRef.current.value = "";
  };
  const handlerSearchSubmit = (e) => {
    e.preventDefault();
    setFilterTrigger(true);

    SetFavourites(filter?.slice(0, 5));
    setFilterData(filter);
  };


  return (
    <>
      <div className="row">
        <div className="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-12">
          <div className="items_filter w-100">
            <form
              className="row form-dark w-100"
              id="form_quick_search"
              name="form_quick_search"
              onReset={() => {
                resetFilter();
              }}
              onSubmit={handlerSearchSubmit}
            >
              <div className="col-sm-12 d-flex align-items-start justify-content-center">
      
                {filterTrigger && (
                  <button id="btn-submit" type="reset">
                    <i class="fas fa-sync bg-danger m-l-1"></i>
                  </button>
                )}
                {/* </div> */}
                <div className="clearfix"></div>
              </div>
            </form>
           
          </div>
        </div>
      </div>
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
        {favLoader ? (
          <>
            <div className="col-sm-12 d-flex justify-content-center">
              <RingLoader color="orange" size="60" />
            </div>
          </>
        ) : (
          <>
            {favData?.length == 0 ? (
              <div className="col-sm-12 text-center">No NFT Record Found</div>
            ) : (
              ""
            )}

            {favData?.slice(0, numItems).map((nft, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4 cursor-pointor"
              >
               
               <NftItem nft={nft} likeAndDisLikeCallback={getFavNfts}/>
              </div>
            ))}

            {favData?.length > numItems && (
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
    </>
  );
}

export default UserFavNft;

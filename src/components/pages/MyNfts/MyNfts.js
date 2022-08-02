import React, { useEffect, useState, useRef } from "react";
import SellNftToMarket from "./SellToMarkePlace";
import { Link, useHistory } from "react-router-dom";
import { RingLoader } from "react-spinners";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import GetMyAllNftsAction from "../../../Redux/Actions/NftActions/GetMyAllNftsAction";
import RemoveFavouriteNftAction from "../../../Redux/Actions/NftActions/RemoveFavouriteNftAction";
import GetFavouriteNftAction from "../../../Redux/Actions/NftActions/GetFavouriteNftAction";
import defaultImg from "../../../assets/images/default.png";

import { toast, ToastContainer } from "react-toastify";
import NftItem from "../../shared/NftItem";
const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

function MyNfts() {
  const history = useHistory();
  const [isloading, setIsloading] = useState(true);

  const dispatch = useDispatch();
  const searchRef = useRef();
  const [allData, setAllData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterTrigger, setFilterTrigger] = useState(false);
  const [favouriteInProgress, setFavouriteInProgress] = useState(false);

  const [filter, setfilter] = useState([]);

  const MyNfts = useSelector(
    (state) => state.GetMyAllNfts?.GetMyAllNftsResponse?.data
  );
  const isConnected = useSelector((state) => state.Login?.authResponse?.data);
  const Token = useSelector((state) => state.Login?.authResponse?.data?.token);

  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );

  const GetFavouriteNft = useSelector(
    (state) => state.GetFavouriteNft?.GetFavouriteNftResponse?.data
  );

  const [nfts, Setnfts] = useState(MyNfts?.slice(0, 4));
  const [height, Setheight] = useState(270);

  useEffect(() => {
    Setnfts(MyNfts?.slice(0, 4));
    setAllData(MyNfts);
  }, [MyNfts]);

  useEffect(async () => {
    await dispatch(GetMyAllNftsAction())
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
    let nftState = nfts;
    let start = nftState?.length;
    let end = nftState?.length + 4;
    // Setnfts([...nftState, ...MyNfts?.slice(start, end)]);

    if (filterData?.length) {
      Setnfts([...nftState, ...filterData?.slice(start, end)]);
    } else {
      Setnfts([...nftState, ...MyNfts?.slice(start, end)]);
    }
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
    Setnfts(allData?.slice(0, 4));
    setfilter([]);
    setFilterTrigger(false);

    searchRef.current.value = "";
  };
  const handlerSearchSubmit = (e) => {
    e.preventDefault();
    setFilterTrigger(true);

    Setnfts(filter?.slice(0, 4));
    setFilterData(filter);
  };


const apisCall=()=>{
  dispatch(GetMyAllNftsAction());
}


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
                <input
                  className="form-control"
                  id="name_1"
                  name="name_1"
                  ref={searchRef}
                  placeholder="search item here..."
                  type="text"
                  onChange={(e) => handleSearchChange(e)}
                  style={{ width: "100%" }}
                />
                <button id="btn-submit">
                  <i className="fa fa-search bg-color-secondary"></i>
                </button>
                {/* <div> */}
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
        {isloading ? (
          <>
            <div className="col-sm-12 d-flex justify-content-center">
              <RingLoader color="orange" size="60" />
            </div>
          </>
        ) : (
          <>
            {nfts?.length == 0 ? (
              <div className="col-sm-12 text-center" style={{color:"red"}} >No NFT record found</div>
            ) : (
              ""
            )}

            {nfts?.map((nft, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4 cursor-pointor"
              >
              
          <NftItem nft={nft} likeAndDisLikeCallback={apisCall}/>
              </div>
            ))}

            {filterData?.length && filterTrigger ? (
              <>
                {nfts?.length < filterData?.length && (
                  <div className="col-lg-12">
                    <div className="spacer-single"></div>
                    <span onClick={loadMore} className="btn-main lead m-auto">
                      Load More Filter
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {nfts?.length < MyNfts?.length && !filterTrigger && (
                  <div className="col-lg-12">
                    <div className="spacer-single"></div>
                    <span onClick={loadMore} className="btn-main lead m-auto">
                      Load More
                    </span>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default MyNfts;

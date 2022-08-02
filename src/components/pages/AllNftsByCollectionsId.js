import React, { useEffect, useState, useRef } from "react";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import GetAllNftsByCollectionIdAction, {
  GetAllNftsByCollectionIdRequest,
} from "../../Redux/Actions/NftActions/GetAllNftsByCollectionIdAction";
import axios from "axios";
import defaultImg from "../../assets/images/default.png";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useHistory, useParams } from "react-router";
import heart from "../../assets/images/heart-icon.png";
import { Link } from "react-router-dom";
import GetFavouriteNftAction from "../../Redux/Actions/NftActions/GetFavouriteNftAction";
import RemoveFavouriteNftAction from "../../Redux/Actions/NftActions/RemoveFavouriteNftAction";
import GetNftCollectionByIdWithOutAccountAction from "../../Redux/Actions/NftActions/GetNftCollectionByIdWithOutAccountAction";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { RingLoader } from "react-spinners";
import http from "../../Redux/Api/http";
import GetNftMarketAction from "../../Redux/Actions/NftActions/GetNftMarketAction";
import NftItem from "../shared/NftItem";

import { Modal } from "react-bootstrap";
const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: transparent;
  }
`;

const AllNftsByCollectionsId = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const GetAllNftsByCollectionId = useSelector(
    (state) =>
      state.GetAllNftsByCollectionId?.GetAllNftsByCollectionIdResponse?.data
  );
  const isConnected = useSelector((state) => state.Login?.authResponse?.data);
  const myFouritesNFTs = useSelector(
    (state) => state.GetFavouriteNft?.GetFavouriteNftResponse?.data
  );

  const GetNftCollectionByIdWithOutAccount = useSelector(
    (state) =>
      state?.GetNftCollectionByIdWithOutAccount
        ?.GetNftCollectionByIdWithOutAccountResponse?.data
  );

  const Token = useSelector((state) => state.Login?.authResponse?.data?.token);

  const searchRef = useRef();

  const [isToShowModal, setIsToShowModal] = useState(false);
  const [allData, setAllData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterTrigger, setFilterTrigger] = useState(false);
  const [favcount, setFavCount] = useState();
  const [showMore, setShowMore] = useState(false);
  const [filter, setfilter] = useState([]);
  const [getAllNftsByCollectionIdState, setGetAllNftsByCollectionIdState] =
    useState([]);
  const [height, Setheight] = useState(270);
  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );
  const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
  const [isloading, setIsloading] = useState(true);
  const [favouriteInProgress, setFavouriteInProgress] = useState(false);
  const loadMore = () => {
    let collectionsState = getAllNftsByCollectionIdState;
    let start = collectionsState?.length;
    let end = collectionsState?.length + 4;
    setGetAllNftsByCollectionIdState([
      ...collectionsState,
      ...GetAllNftsByCollectionId?.slice(start, end),
    ]);
  };

  useEffect(() => {
    setGetAllNftsByCollectionIdState(GetAllNftsByCollectionId?.slice(0, 4));
    setAllData(GetAllNftsByCollectionId);
  }, [GetAllNftsByCollectionId]);

  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      Setheight({
        height: img.offsetHeight,
      });
    }
  };
  const deletecollection = async (id) => {
    await http
      .put(httpUrl + "/api/v1/Nft/RemoveNftCollection?collectionId=" + id)
      .then(async (res) => {

        toast.success(
          <p style={{ wordBreak: "break-word" }}>  Collection deleted successfully</p>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setTimeout(() => {
          history.push('/myprofile')
        }, 3000);


      })
      .catch((error) => {
      });
  }
  useEffect(async () => {




    await dispatch(GetNftCollectionByIdWithOutAccountAction(id));
    await dispatch(GetAllNftsByCollectionIdAction(id))
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


    return () => {
      dispatch(GetAllNftsByCollectionIdRequest());
    };
  }, []);


  const apisCall = async () => {
    await dispatch(GetNftCollectionByIdWithOutAccountAction(id));
    await dispatch(GetAllNftsByCollectionIdAction(id))
  }



  const handleSearchChange = (e) => {
    const { value } = e.target;

    setfilter(
      allData?.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  useEffect(() => {
    if (localStorage.getItem("CollectionAdded") === "true") {
      localStorage.setItem("CollectionAdded", "false");
      window.location.reload(false);
    }
  }
    , [])


  const resetFilter = () => {
    setGetAllNftsByCollectionIdState(allData?.slice(0, 5));
    setfilter([]);
    setFilterTrigger(false);

    searchRef.current.value = "";
  };
  const handlerSearchSubmit = (e) => {
    e.preventDefault();
    setFilterTrigger(true);

    setGetAllNftsByCollectionIdState(filter?.slice(0, 5));
    setFilterData(filter);
  };
  const text = GetNftCollectionByIdWithOutAccount?.description ? GetNftCollectionByIdWithOutAccount?.description?.toString() : '';
  return (
    <div>
      <GlobalStyles />
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

      <section className="profile-banner">
        <div className="full-div banner" style={{
          backgroundImage: `url(${httpUrl}/${GetNftCollectionByIdWithOutAccount?.bannerImage?.replaceAll(
            "\\",
            "/"
          )})`,
          display:"inline-block"
        }}></div>
      </section >

      <section className="container d_coll no-top no-bottom">
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="collection_logo_header d_profile cntr">
              <div style={{ float: "right" }} className="my-2">
                <DropdownButton id="dropdown-basic-button" className="social--btn fa fa-caret-down ">
                  {(!GetNftCollectionByIdWithOutAccount?.websiteLink &&
                    !GetNftCollectionByIdWithOutAccount?.kdiscordLink &&
                    !GetNftCollectionByIdWithOutAccount?.twitterLink &&
                    !GetNftCollectionByIdWithOutAccount?.instagramLink &&
                    !GetNftCollectionByIdWithOutAccount?.mediumLink &&
                    !GetNftCollectionByIdWithOutAccount?.tLink) && (
                      <> <span className="text-center collection-social">No links found </span></>
                    )}
                  {GetNftCollectionByIdWithOutAccount?.websiteLink && (
                    <Dropdown.Item title="website" onClick={() => { window.open(GetNftCollectionByIdWithOutAccount?.websiteLink) }}><i class="fa fa-globe web-color"  ></i> Website</Dropdown.Item>
                  )}

                  {GetNftCollectionByIdWithOutAccount?.discordLink && (
                    <Dropdown.Item title="discord" onClick={() => { window.open(GetNftCollectionByIdWithOutAccount?.discordLink) }} > <i class="fab fa-discord discord-color"></i> Discord </Dropdown.Item>
                  )}

                  {GetNftCollectionByIdWithOutAccount?.twitterLink && (
                    <Dropdown.Item title="twitter" onClick={() => { window.open(GetNftCollectionByIdWithOutAccount?.twitterLink) }}> <i className="fa fa-twitter twitter-color"></i> Twitter </Dropdown.Item>
                  )}

                  {GetNftCollectionByIdWithOutAccount?.instagramLink && (
                    <Dropdown.Item title="instagram" onClick={() => { window.open(GetNftCollectionByIdWithOutAccount?.instagramLink) }} ><i className="fa fa-instagram insta-color"></i> Instagram</Dropdown.Item>
                  )}
                  {GetNftCollectionByIdWithOutAccount?.mediumLink && (
                    <Dropdown.Item title="medium" onClick={() => { window.open(GetNftCollectionByIdWithOutAccount?.mediumLink) }}> <i className="fa fa-medium medium-color"></i> Medium </Dropdown.Item>
                  )}
                  {GetNftCollectionByIdWithOutAccount?.tLink && (
                    <Dropdown.Item title="telegram" onClick={() => { window.open(GetNftCollectionByIdWithOutAccount?.tLink) }}> <i className="fa fa-telegram telegram-color"></i> Telegram </Dropdown.Item>
                  )}
                </DropdownButton>

              </div>
              <div className="profile_avatar">
                <div className="d_profile_img">
                  <img
                    src={
                      httpUrl +
                      "/" +
                      GetNftCollectionByIdWithOutAccount?.logoImage
                    }
                    alt=""
                    style={{ height: 150, width: 150 }}
                  />
                </div>

                <div className="profile_name collection-desc">

                  <h4>
                    {GetNftCollectionByIdWithOutAccount?.name}

                  </h4>

                  <div>
                    <p style={{ textAlign: "center" ,wordBreak:"break-all"}}>
                      {showMore ? text : `${text?.substring(0, 45)}`}
                      {text?.length > 45 ? (
                        <span className="btn-more-less" style={{ marginLeft: '5px', color: "orange" }} onClick={() => setShowMore(!showMore)}>
                          {showMore ? " show less" : "...show more"}
                        </span>
                      ) : null
                      }
                    </p>
                    {/* {GetNftCollectionByIdWithOutAccount?.description} */}

                  </div>


                  {GetNftCollectionByIdWithOutAccount?.address ==
                    WalletAddress && (
                      <>
                        <button
                          disabled={GetAllNftsByCollectionId?.length == 0 ? '' : 'true'}
                          className="btn btn-main mx-auto"
                          onClick={() => { setIsToShowModal(true) }}
                        >
                          Delete Collection
                        </button>                     <div className="pt-2"></div>


                        <button
                          onClick={() => {
                            history.push(`/addcollection/${id}`);
                          }}
                          className="btn btn-main mx-auto"
                        >
                          Update Collection
                        </button>

                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container mb-cntr">
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
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="row">
              {isloading ? (
                <>
                  <div className="col-sm-12 d-flex justify-content-center">
                    <RingLoader color="orange" size="60" />
                  </div>
                </>
              ) : (
                <>
                  {getAllNftsByCollectionIdState?.length == 0 ? (
                    <div className="col-sm-12 text-center" style={{ color: "red" }} >
                      No NFT record found
                    </div>
                  ) : (
                    ""
                  )}
                  {getAllNftsByCollectionIdState?.map((item, index) => (
                    <div
                      key={index}
                      className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4">

                      {
                        item?.ownerAddress == WalletAddress ?
                          <NftItem nft={item} likeAndDisLikeCallback={apisCall} />
                          :
                          <>
                            {
                              GetNftCollectionByIdWithOutAccount?.address ==
                                WalletAddress ?
                                <NftItem nft={item} likeAndDisLikeCallback={apisCall} soldstatus={true} />
                                :
                                <NftItem nft={item} likeAndDisLikeCallback={apisCall} />

                            }
                          </>

                      }


                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="dull-div">
            {!isloading && (
              <>
                {filterData?.length && filterTrigger ? (
                  <>
                    {getAllNftsByCollectionIdState?.length <
                      filterData?.length && (
                        <div className="col-lg-12">
                          <div className="spacer-single"></div>
                          <span
                            onClick={loadMore}
                            className="btn-main lead m-auto"
                          >
                            Load More
                          </span>
                        </div>
                      )}
                  </>
                ) : (
                  <>
                    {getAllNftsByCollectionIdState?.length <
                      GetAllNftsByCollectionId?.length &&
                      !filterTrigger && (
                        <div className="col-lg-12">
                          <div className="spacer-single"></div>
                          <span
                            onClick={loadMore}
                            className="btn-main lead m-auto"
                          >
                            Load More
                          </span>
                        </div>
                      )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <Modal centered show={isToShowModal} onHide={() => { setIsToShowModal(false) }}>
        <Modal.Header closeButton>
          <Modal.Title> Warning   </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "red", textAlign: "center" }}>
          <Warnings />
          <p style={{ color: 'red', textAlign: 'center' }} >Collection will be deleted permanently   </p>
          <div className="pt-4" />
          <div className="row">
            <button
              onClick={() => {
                setIsToShowModal(false)
              }}
              className="btn btn-main mx-auto"
            >
              cancel
            </button>       <button
              onClick={() => {
                deletecollection(GetNftCollectionByIdWithOutAccount?.id)
              }}
              className="btn btn-main mx-auto"
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Footer />
    </div>
  );
};
export default AllNftsByCollectionsId;
const Warnings = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="70.000000pt" height="70.000000pt" color="red" viewBox="0 0 612.000000 612.000000" preserveAspectRatio="xMidYMid meet">

      <g transform="translate(0.000000,612.000000) scale(0.100000,-0.100000)" fill="red" stroke="none">
        <path d="M2926 5649 c-84 -20 -170 -71 -241 -143 -61 -61 -93 -111 -239 -366 -94 -162 -215 -374 -271 -470 -110 -189 -553 -956 -670 -1160 -40 -69 -112 -195 -161 -280 -50 -85 -252 -436 -451 -780 -198 -344 -387 -670 -418 -725 -332 -570 -336 -580 -336 -730 -1 -224 126 -414 336 -501 l70 -29 2515 0 c2455 0 2516 0 2565 19 123 47 243 154 300 266 60 118 74 277 36 400 -13 41 -97 198 -231 429 -115 200 -210 366 -210 368 0 3 -8 17 -19 31 -10 15 -71 119 -136 232 -111 194 -162 283 -340 590 -41 71 -167 289 -279 482 -283 492 -422 733 -506 878 -40 69 -124 215 -188 325 -63 110 -161 279 -216 375 -56 96 -154 265 -217 375 -93 164 -127 213 -184 271 -74 74 -141 114 -236 139 -60 16 -212 18 -273 4z m242 -488 c55 -28 69 -48 195 -266 111 -194 274 -476 392 -680 73 -127 216 -374 363 -630 63 -110 145 -252 182 -315 37 -63 79 -135 92 -160 14 -25 48 -83 75 -130 88 -150 240 -414 263 -455 12 -22 53 -92 90 -155 37 -63 145 -250 240 -415 95 -165 234 -405 308 -533 74 -129 141 -250 148 -270 39 -109 -14 -231 -121 -281 l-45 -21 -2281 0 c-1703 0 -2292 3 -2320 12 -94 28 -165 134 -157 234 5 54 19 83 185 369 39 66 129 221 200 345 71 124 173 299 225 390 217 375 516 893 826 1431 72 125 163 283 203 350 40 68 99 171 132 229 32 58 92 161 132 230 40 69 123 213 185 320 183 317 193 334 214 358 22 25 63 49 106 63 37 12 126 1 168 -20z" />
        <path d="M2825 4386 c-55 -25 -110 -81 -131 -132 -20 -48 -19 -88 31 -865 24 -387 53 -855 65 -1039 22 -374 24 -390 50 -440 43 -83 122 -130 220 -130 98 0 177 47 220 130 25 49 28 70 45 355 8 138 38 605 65 1040 55 867 56 901 36 949 -21 51 -76 107 -131 132 -47 22 -62 24 -235 24 -173 0 -188 -2 -235 -24z" />
        <path d="M2965 1657 c-122 -41 -199 -123 -230 -245 -41 -160 50 -335 202 -392 79 -30 196 -25 268 10 141 69 219 231 181 379 -27 104 -99 191 -195 234 -57 25 -170 32 -226 14z" />
      </g>
    </svg>
  );
}
const Warnings1 = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20.000000pt" height="20.000000pt" color="red" viewBox="0 0 612.000000 612.000000" preserveAspectRatio="xMidYMid meet">

      <g transform="translate(0.000000,612.000000) scale(0.100000,-0.100000)" fill="red" stroke="none">
        <path d="M2926 5649 c-84 -20 -170 -71 -241 -143 -61 -61 -93 -111 -239 -366 -94 -162 -215 -374 -271 -470 -110 -189 -553 -956 -670 -1160 -40 -69 -112 -195 -161 -280 -50 -85 -252 -436 -451 -780 -198 -344 -387 -670 -418 -725 -332 -570 -336 -580 -336 -730 -1 -224 126 -414 336 -501 l70 -29 2515 0 c2455 0 2516 0 2565 19 123 47 243 154 300 266 60 118 74 277 36 400 -13 41 -97 198 -231 429 -115 200 -210 366 -210 368 0 3 -8 17 -19 31 -10 15 -71 119 -136 232 -111 194 -162 283 -340 590 -41 71 -167 289 -279 482 -283 492 -422 733 -506 878 -40 69 -124 215 -188 325 -63 110 -161 279 -216 375 -56 96 -154 265 -217 375 -93 164 -127 213 -184 271 -74 74 -141 114 -236 139 -60 16 -212 18 -273 4z m242 -488 c55 -28 69 -48 195 -266 111 -194 274 -476 392 -680 73 -127 216 -374 363 -630 63 -110 145 -252 182 -315 37 -63 79 -135 92 -160 14 -25 48 -83 75 -130 88 -150 240 -414 263 -455 12 -22 53 -92 90 -155 37 -63 145 -250 240 -415 95 -165 234 -405 308 -533 74 -129 141 -250 148 -270 39 -109 -14 -231 -121 -281 l-45 -21 -2281 0 c-1703 0 -2292 3 -2320 12 -94 28 -165 134 -157 234 5 54 19 83 185 369 39 66 129 221 200 345 71 124 173 299 225 390 217 375 516 893 826 1431 72 125 163 283 203 350 40 68 99 171 132 229 32 58 92 161 132 230 40 69 123 213 185 320 183 317 193 334 214 358 22 25 63 49 106 63 37 12 126 1 168 -20z" />
        <path d="M2825 4386 c-55 -25 -110 -81 -131 -132 -20 -48 -19 -88 31 -865 24 -387 53 -855 65 -1039 22 -374 24 -390 50 -440 43 -83 122 -130 220 -130 98 0 177 47 220 130 25 49 28 70 45 355 8 138 38 605 65 1040 55 867 56 901 36 949 -21 51 -76 107 -131 132 -47 22 -62 24 -235 24 -173 0 -188 -2 -235 -24z" />
        <path d="M2965 1657 c-122 -41 -199 -123 -230 -245 -41 -160 50 -335 202 -392 79 -30 196 -25 268 10 141 69 219 231 181 379 -27 104 -99 191 -195 234 -57 25 -170 32 -226 14z" />
      </g>
    </svg>
  );
}
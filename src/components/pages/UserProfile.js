import React, { useEffect, useState } from "react";

import Footer from "../components/footer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import defaultImg from "../../assets/images/default.png";

import UserNfts from "./UserNft/UserNfts";
import OnSaleUserNfts from "./UserNft/OnSaleUserNfts";
import UserFavNft from "./UserNft/UserFavNft";
import http from "../../Redux/Api/http";
import { PulseLoader, RingLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { createGlobalStyle } from "styled-components";
import { useHistory } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import bannerimg from "../../assets/images/banner-img.jpg";
import { HoverMode } from "react-tsparticles";
import Loader from "react-spinners/BarLoader";


const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: transparent;
  }
`;

const UserProfile = function () {
  const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
  const [userData, setUserData] = useState();
  const [itemsCounter, setItemsCounter] = useState();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [showMore, setShowMore] = useState(false);
  const [ProfileData, setprofiledata] = useState(false);
  const [ProfileData1, setprofiledata1] = useState(false);
  const [buttonclicked,setbuttonclicked]=useState(false)
  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );

  const getUserData = () => {
    let params = window.location.pathname;
    setAddress(params.split("/")[2]);
    let wa = "nill"
    if (WalletAddress) {
      wa = WalletAddress

    }

    http
      .get(
        httpUrl +
        `/api/v1/Account/GetUserAccount?address=${params.split("/")[2]}&logedinWalletAddress=${wa}`
      )
      .then((res) => {
        // setItemsCounter(res.data.data.nftRequestModelList.length);
        setprofiledata(res?.data?.data?.accountViewModel);
        setprofiledata1(res?.data?.data?.nftRequestModelList);
        setLoading(false);
      })
      .catch((error) => {
      });

  }


  useEffect(() => {

    getUserData();


  }, []);

  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
    setOpenMenu1(false);
    setOpenMenu2(false);
    document?.getElementById("Mainbtn")?.classList?.add("active");
    document?.getElementById("Mainbtn1")?.classList?.remove("active");
    document?.getElementById("Mainbtn2")?.classList?.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
    setOpenMenu2(false);
    setOpenMenu(false);
    document?.getElementById("Mainbtn1")?.classList?.add("active");
    document?.getElementById("Mainbtn")?.classList?.remove("active");
    document?.getElementById("Mainbtn2")?.classList?.remove("active");
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
    setOpenMenu(false);
    setOpenMenu1(false);
    document.getElementById("Mainbtn2").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn1").classList.remove("active");
  };
  // const copyAddress = async () => {
  //   await navigator.clipboard.writeText(address);
  //   toast.success("Address copied successfully", {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: false,
  //     draggable: true,
  //     progress: undefined,
  //   });
  // };

  return (
    <div>
      {loading ? (
        <>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div className="col-sm-12 d-flex justify-content-center margin-top-150">
            <RingLoader color="orange" size="60" />
          </div></>
      ) : (
        <>
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


          {/* <section
            id="profile_banner"
            className="jumbotron breadcumb no-bg"
            style={{
              backgroundImage: `url(${bannerimg})`,
            }}
          >
            <div style={{ paddingTop: '0px' }} className="mainbreadcumb"></div>
          </section> */}
          <section className="profile-banner">
            <div className="full-div banner" style={{ backgroundImage: `url(${bannerimg})` }}></div>
          </section >
          <section className="container d_coll no-top no-bottom"
            style={{ position: "relative" }}>
            <div className="row">

              <div className="col-md-3"></div>
              <div className="col-md-6 text-center">
                <div className="profile-info-container1">
                  <div className="nft author_list ol-styling justify-content-center">
                    <li >
                      <div className="author_list_pp"
                        style={{
                          width: "200px"
                        }}>
                        <img
                          className="lazy"
                          src={ProfileData?.profileImage ? httpUrl + "/" + ProfileData?.profileImage : defaultImg}
                          style={{ width: 200, height: 200 }}
                          alt=""
                        />
                        {ProfileData?.isVerfiedAccount ?
                          <i className="fa fa-check"></i> : <></>}
                      </div>

                      <div className="author_list_info">
                        {ProfileData?.username ? ProfileData?.username : "Unnamed"}
                        <span className="bot">
                        </span>

                        <span className="email-span" style={{ wordWrap: 'break-word' }} >{ProfileData?.email} </span><br />
                        <span id="wallet" className="profile_wallet hover-blue walletspan"    >
                          {ProfileData?.address?.substring(0, 10)}{"... "}{" "}
                          <CopyToClipboard
                            text={ProfileData?.address}
                            onCopy={() => {
                              toast.success("Address copied successfully", {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                              });
                            }}>
                            <button
                              onClick={async () => {
                                navigator.clipboard.writeText(ProfileData?.address);
                              }}
                              id="btn_copy"
                              title="Copy Address">
                              {" "}
                              <i className="fa fa-files-o"></i>
                            </button>
                          </CopyToClipboard>
                        </span>



                        <ul class="author-social-list">
                          {/* <li>
                            <a target="_blank" href="#"><i className="fa fa-facebook"></i></a>
                          </li> */}



                          <li>
                            {
                              ProfileData?.instagramLink && ProfileData?.instagramLink != "null" ?
                                <a target="_blank" href={ProfileData?.instagramLink}><i className="fa fa-instagram"></i></a>
                                :
                                <></>               }
                          </li>

                          <li>
                            {
                              ProfileData?.twitterLink && ProfileData?.twitterLink != "null" ?
                                <a target="_blank" href={ProfileData?.twitterLink}><i className="fa fa-twitter"></i></a>
                                :
                                <></>          }
                            {/* <a target="_blank" href={ProfileData?.twitterLink==null?"#":ProfileData?.twitterLink}><i className="fa fa-twitter"></i></a> */}
                          </li>

                          <li>
                            {
                              ProfileData?.yourSiteLink && ProfileData?.yourSiteLink != "null" ?
                                <a target="_blank" href={ProfileData?.yourSiteLink}><i className="fa fa-link"></i></a>
                                :
                                <></>          }
                          </li>


                          {/* <li>
                            <a target="_blank" href="#"><i className="fa fa-link"></i></a>
                          </li> */}
                        </ul>
                        <div className="author-folowers-item full-div">
                          <div>
                            <p className="text-center">
                              <b>{ProfileData?.follower}</b>
                              <br />
                              Followers
                            </p>
                          </div>
                          <div>
                            <p className="text-center">
                              <b>{ProfileData1?.length}</b>
                              <br />
                              Items
                            </p>
                          </div>
                        </div>
                        {
                          <div className="full-div">
                            {localStorage.getItem("userblock") === "true" ? <></> :
                              <button className="follow-btn" style={ProfileData?.isFollowed ? { background: 'orange', color: "white" } : {}} onClick={() => {
                                 if(!buttonclicked){
                                             setbuttonclicked(true)
                                  if (WalletAddress) {
                                  if (ProfileData?.isFollowed) {
                                    http
                                      .put(httpUrl + "/api/v1/Account/UnFollowUser", {
                                        "accountFollowerToId": ProfileData?.id
                                      })
                                      .then((res) => {
                                        toast.success(<p style={{wordBreak:"break-word"}}>Account unfollowed successfully </p> , {
                                          position: "top-right",
                                          autoClose:2000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        });
                                        getUserData()
                                        
                                      })
                                      .catch((error) => {
                                        toast.error(`something went wrong`, {
                                          position: "top-right",
                                          autoClose: 2000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        });
                                        
                                      });

                                  }
                                  else {
                                    http
                                      .post(httpUrl + "/api/v1/Account/AddUserFollower", {
                                        "accountFollowerToId": ProfileData?.id
                                      })
                                      .then((res) => {
                                        toast.success(<p style={{wordBreak:"break-word"}}>Account followed successfully </p>  , {
                                          position: "top-right",
                                          autoClose: 2000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        });
                                        getUserData()

                                        
                                      })
                                      .catch((error) => {
                                        toast.error(`something went wrong`, {
                                          position: "top-right",
                                          autoClose: 2000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        });
                                        
                                        
                                      });
                                  }
                                }
                                else {
                                  toast.error("please login to continue", {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                  
                                }
                                setTimeout(() => {  setbuttonclicked(false); }, 2000)
                              }
                              }}>{ProfileData?.isFollowed ? "Following" : "+ Follow"}</button>}
                          </div>
                        }

                      </div>
                    </li>
                  </div>


                </div>
              </div>
            </div>

          </section>







          {/* <div className="profile-text-container">
                    <p>
                      {showMore ? ProfileData?.bio : ProfileData?.bio ? `${ProfileData?.bio?.substring(0, 45)}` : ""}

                      {ProfileData?.bio?.length > 45 ? (
                        <span className="btn-more-less" style={{ cursor: "pointer" }}
                          onClick={() => setShowMore(!showMore)}>
                          {showMore ? " show less" : "...show more"}
                        </span>
                      ) : null
                      }

                    </p>
                    <h5>Follow Me</h5>
                    <ul className="my-social-list">
                      <li>
                        <a target="_blank" href="https://www.twitter.com/"><i className="fa fa-twitter"></i> Twitter.com</a>
                      </li>
                      <li>
                        <a target="_blank" href="https://www.instagram.com/"><i className="fa fa-instagram"></i> Instagram.com</a>
                      </li>
                    </ul>
                  </div> */}






          <section className="container no-top">
            <div className="row">
              <div className="col-lg-12">
                <div className="items_filter">
                  <div className="Topbarsetting">
                    <ul className="d-flex justify-content-center de_nav text-left">
                      <li id="Mainbtn" className="active">
                        <span onClick={handleBtnClick}>On Sale</span>
                      </li>
                      <li id="Mainbtn1" className="">
                        <span onClick={handleBtnClick1}>NFTs</span>
                      </li>
                      {/* <li id="Mainbtn2" className="">
                        <span onClick={handleBtnClick2}>Liked</span>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {openMenu && (
              <div id="zero1" className="onStep fadeIn">
                <OnSaleUserNfts />
              </div>
            )}
            {openMenu1 && (
              <div id="zero2" className="onStep fadeIn">
                <UserNfts />
              </div>
            )}
            {openMenu2 && (
              <div id="zero3" className="onStep fadeIn">
                <UserFavNft />
              </div>
            )}
          </section>





          <Footer />
        </>
      )}
    </div>
  );
};
export default UserProfile;
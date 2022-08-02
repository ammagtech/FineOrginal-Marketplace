import React, { useEffect, useState, useReducer } from "react";
import { useHistory } from "react-router-dom";
import MyNft from "./MyNfts/MyNfts";
import Footer from "../components/footer";
import bannerimg from '../../assets/images/profile-banner.jpg';
import { createGlobalStyle } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Followingslist from "./UserNft/Followings";
import { FaGlobe, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import Followerslist from "./UserNft/Followers";

import defaultImg from '../../assets/images/default.png'
import { Modal } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";
import MyCollections from "./MyCollections";
import GetMyAllCollectionsAction from "../../Redux/Actions/CollectionAction/GetMyAllCollections";
import AllFavourite from "./AllFavorite/AllFavourite";
import { WalletDisconnect } from "../../Redux/Actions/WalletActions/WalletAction";
import { AuthConnectRequest } from "../../Redux/Actions/AuthActions/AuthConnectAction";
import { LogoutAction } from "../../Redux/Actions/AuthActions/LogoutAction";
import { ValidateSignatureRequest } from "../../Redux/Actions/AuthActions/ValidateSignatureAction";
import { Dropdown, DropdownButton } from "react-bootstrap";
import http from "../../Redux/Api/http";
const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
const initialState = { isDisable: false };
const reducer = (state, action) => {
  switch (action.type) {
    case 'clicked':
      return { isDisable: true };
    case 'notClicked':
      return { isDisable: false };
  }
}
const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: transparent;
  }
`;
const changeImage = (event) => {
  var image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
};
const MyProfile = function () {
  const [route, setRoute] = useState("");
  const [showMore, setShowMore] = useState(false);

  const [users, setUsers] = useState([])
  const [users1, setUsers1] = useState([])
  const [called, setcalled] = useState([])
  const [isToShowModal, setIsToShowModal] = useState(false)
  const [ProfileData, setprofiledata] = useState(false);
  const history = useHistory();
  const [state, disableDispatch] = useReducer(reducer, initialState)
  const location = useLocation()
  useEffect(() => {
    if (location.state?.center) {
      handleBtnClick1()
    }
  }, [location.state])
  const dispatch = useDispatch();
  const User = useSelector((state) => state.Login);
  const Logoutt = async () => {
    await dispatch(WalletDisconnect());
    await dispatch(AuthConnectRequest());
    await dispatch(LogoutAction());
    await dispatch(ValidateSignatureRequest());
  };
  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );
  const MyProfile = useSelector(
    (state) => state.MyProfile?.MyProfileResponse?.data
  );
  useEffect(() => {
    setprofiledata(MyProfile)
    handleBtnClick1()
  }, [MyProfile])
  const [openMenu, setOpenMenu] = React.useState(true);
  const numbers = [1, 2, 3, 4, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);
  const [openMenu4, setOpenMenu4] = React.useState(false);
  const [checkfollowers, setcheckfollowers] = React.useState(false);
  const [openMenu5, setOpenMenu5] = React.useState(false);

  const [followers, setfollowers] = useState([])
  const [following, setfollowing] = useState([])

  const [temma, settemma] = useState(5)
  const handleBtnClick = () => {
    setOpenMenu(true);
    setOpenMenu1(false);
    setOpenMenu2(false);
    setOpenMenu3(false);

    setOpenMenu5(false);
    setOpenMenu4(false);
    document?.getElementById("Mainbtn")?.classList?.add("active");
    document?.getElementById("Mainbtn1")?.classList?.remove("active");
    document?.getElementById("Mainbtn2")?.classList?.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(true);
    setOpenMenu2(false);
    setOpenMenu(false);
    setOpenMenu3(false);

    setOpenMenu5(false);
    setOpenMenu4(false);
    document?.getElementById("Mainbtn1")?.classList?.add("active");
    document?.getElementById("Mainbtn")?.classList?.remove("active");
    document?.getElementById("Mainbtn2")?.classList?.remove("active");
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(true);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu3(false);
    setOpenMenu4(false);

    setOpenMenu5(false);
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn2").classList.add("active");
  };

  const handleBtnClick10 = () => { }

  const handleBtnClick5 = async () => {

    await http
      .get(httpUrl + "/api/v1/Account/GetMyAllFollowers")
      .then((res) => {
        setfollowers(res.data.data)
        setUsers(res.data.data)
      })
      .catch((error) => {
        // console.log(error?.message);
      });
    setcheckfollowers(true)
    setIsToShowModal(true)
  };
  const handleBtnClick4 = async () => {
    await http
      .get(httpUrl + "/api/v1/Account/GetMyAllFollowing")
      .then((res) => {
        setfollowing(res.data.data)
        setUsers1(res.data.data)
      })
      .catch((error) => {
        // console.log(error?.message);
      });
    setIsToShowModal(true)
    setcheckfollowers(false)
  };
  useEffect(() => {
    localStorage.getItem("userblock") === "true" ? history.push('/connectwallet') : <></>
  }, [])


  useEffect(async () => {
    await http
      .get(httpUrl + "/api/v1/Account/GetMyAllFollowers")
      .then((res) => {
        // console.log("Follwers", res.data.data)
        setfollowers(res.data.data)
      })
      .catch((error) => {
        // console.log(error?.message);
      });
  }, [])
  useEffect(async () => {
    await http
      .get(httpUrl + "/api/v1/Account/GetMyAllFollowing")
      .then((res) => {
        setfollowing(res.data.data)
        setfollowing(res.data.data)
      })
      .catch((error) => {
        // console.log(error?.message);
      });
  }, [])
  const handleBtnClick3 = () => {
    setOpenMenu2(false);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu3(true);
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
  };
  const text = MyProfile?.bio ? MyProfile?.bio?.toString() : '';
  const Modaloffollowers = (number, index) => {
    return (
      <div  className="follow-list">
        <div  >
          <div className="img-pnl"  onClick={() => history.push(number?.address === WalletAddress ? `/myprofile` : `/profile/${number?.address}`)}>
            <img
              src={number?.profileImage ? httpUrl + "/" + number?.profileImage : defaultImg}
              alt="Author.png"
              style={{ width: "45px", height: "45px", borderRadius: '100%' }}
            />
            {number?.username}
          </div>
          <button className="follow-btn-profile" style={number?.isFollowed ? { backgroundColor: "orange", color: "white" } : checkfollowers ? {} : { backgroundColor: "orange", color: "white" }} onClick={() => {
            if (!WalletAddress) {
              toast.error("please login to continue", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              return
            }
            if (number?.isFollowed) {
              http
                .put(httpUrl + "/api/v1/Account/UnFollowUser", {
                  "accountFollowerToId": number?.id
                })
                .then(async (res) => {  toast.success(<p style={{wordBreak:"break-word"}}>Account unfollowed successfully </p> , {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  await http
                    .get(httpUrl + "/api/v1/Account/GetMyAllFollowing")
                    .then((res) => {
                      setfollowing(res.data.data)
                      setUsers1(res.data.data)
                    })

                    .catch((error) => {
                      // console.log(error?.message);
                    });
                  await http
                    .get(httpUrl + "/api/v1/Account/GetMyAllFollowers")
                    .then((res) => {
                      setfollowers(res.data.data)
                      setUsers(res.data.data)
                    })
                    .catch((error) => {
                      // console.log(error?.message);
                    });
                })
                .catch((error) => {
                  toast.error(`something went wrong`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                });
            }
            else if (!checkfollowers) {
              http
                .put(httpUrl + "/api/v1/Account/UnFollowUser", {
                  "accountFollowerToId": number?.id
                })
                .then(async (res) => {

                  toast.success(<p style={{wordBreak:"break-word"}}>Account unfollowed successfully </p> , {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  await http
                    .get(httpUrl + "/api/v1/Account/GetMyAllFollowing")
                    .then((res) => {
                      setfollowing(res.data.data)
                      setUsers1(res.data.data)
                    })
                    .catch((error) => {
                      // console.log(error?.message);
                    });
                  await http
                    .get(httpUrl + "/api/v1/Account/GetMyAllFollowers")
                    .then((res) => {
                      setfollowers(res.data.data)
                      setUsers(res.data.data)
                    })
                    .catch((error) => {
                      // console.log(error?.message);
                    });
                })
                .catch(async (error) => {

                  toast.error(`something went wrong`, {
                    position: "top-right",
                    autoClose: 5000,
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
                  "accountFollowerToId": number?.id
                })
                .then(async (res) => {
                  toast.success(<p style={{wordBreak:"break-word"}}>Account followed successfully </p> , {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  await http
                    .get(httpUrl + "/api/v1/Account/GetMyAllFollowing")
                    .then((res) => {
                      setfollowing(res.data.data)
                      setUsers1(res.data.data)
                    })
                    .catch((error) => {
                      // console.log(error?.message);
                    });
                  await http
                    .get(httpUrl + "/api/v1/Account/GetMyAllFollowers")
                    .then((res) => {
                      setfollowers(res.data.data)
                      setUsers(res.data.data)
                    })
                    .catch((error) => {
                      // console.log(error?.message);
                    });

                })
                .catch((error) => {
                  toast.error(`something went wrong`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                });
              setcalled()
            }

          }}>{number?.isFollowed ? "Following" : checkfollowers ? "+Follow" : "Following"}</button>
        </div>
      </div>
    )
  }
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
        {/* <div className="full-div banner" style={{ backgroundImage: `url(${bannerimg})` }}></div> */}
      </section >
      <section className="container myprofile-container">
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
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="profile-info-container">
              <div className="d_profile profile-container">
                {/* Profile Picture */}
                <div className="profile-pic-cntnr">
                  {ProfileData?.profileImage ? (
                    <div
                      style={{
                        width: 130,
                        height: "auto",
                        // backgroundColor: "#02AAB0",
                        borderRadius: "100%",
                      }}
                    >
                      <img
                        src={httpUrl + "/" + ProfileData?.profileImage}
                        alt="profile.png"
                        style={{
                          width: 130,
                          height: 130,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 130,
                        height: "auto",
                        borderRadius: "100%",
                      }}>
                      <FaUserCircle size="2x" />
                    </div>
                  )}

                  {/* <div class="profile-pic">
                    <label class="a-label" for="file">
                      <span class="glyphicon glyphicon-camera"></span>
                      <span>Change Image</span>
                    </label>
                    <input
                      type="file"
                      id="fileToUpload"
                      onchange="loadFile(event)"
                    />
                    <img
                      src="https://cdn.pixabay.com/photo/2017/08/06/21/01/louvre-2596278_960_720.jpg"
                      id="output"
                      width="200"
                    />
                  </div> */}
                </div>
                {/* Profile Picture */}
                <div className="Profile-txt">
                  <h4>
                    {ProfileData?.username ? ProfileData?.username : "Unnamed"}
                    <span className="email-span" style={{ wordWrap: 'break-word' }}>{ProfileData?.email}</span>
                    {/* <span className="profile_username">
                      {MyProfile?.username}
                    </span> */}
                    <span id="wallet" className="profile_wallet hover-blue">
                      {WalletAddress}{" "}
                      <CopyToClipboard
                        text={WalletAddress}
                        onCopy={() => {
                          disableDispatch({ type: 'clicked' })
                          toast.success("Address copied successfully", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                          });
                          setTimeout(() => {
                            disableDispatch({ type: 'notClicked' })
                          }, 5000);
                        }}
                      >
                        <button
                          // onClick={
                          // }
                          // onClick={async () => {
                          //   await navigator.clipboard.writeText(WalletAddress);
                          //   toast.success("Address copied successfully", {
                          //     position: "top-right",
                          //     autoClose: 5000,
                          //     hideProgressBar: false,
                          //     closeOnClick: true,
                          //     pauseOnHover: false,
                          //     draggable: true,
                          //     progress: undefined,
                          //   });
                          // }}
                          id="btn_copy"
                          title="Copy Address"
                          disabled={state.isDisable}
                        >
                          <i className="fa fa-files-o"></i>
                        </button>
                      </CopyToClipboard>
                    </span>
                  </h4>

                  {/* <span className="join-span">Joined December 2021</span> */}
                  {/* <>
                    {showMore ? text : `${text?.substring(0, 45)}`}
                    {text?.length > 45 ? (
                      <span className="btn-more-less" onClick={() => setShowMore(!showMore)}>
                        {showMore ? " show less" : "...show more"}
                      </span>
                    ) : null
                    }
                  </> */}
                </div>
                {/* <div className="profile_follow">
                  <div className="settingsbtn my-profile-btn">
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/createNFT"
                      className="btn-main">
                      Create NFT
                    </Link>
                    <button className="firstbtn">
                      {" "}
                      <i className="fa fa-fw" aria-hidden="true" title="Share">
                        
                      </i>
                    </button>
                    <Link to="/settings" className="Secbtn">
                      <i className="fa fa-fw" aria-hidden="true" title="Settings">
                        
                      </i>
                    </Link>
                  </div>
                  <div className="signoutbtn my-profile-btn" onClick={Logoutt}>
                    <span className="Sinoutbtn">
                      <i
                        className="fa fa-sign-out"
                        aria-hidden="true"
                        title="Logout"
                      ></i>
                    </span>
                  </div>

                  <br />

                  {(ProfileData?.yourSiteLink == null ||
                    ProfileData?.yourSiteLink !== "null") && (
                      <div className="signoutbtn my-profile-btn">
                        <span className="Sinoutbtn">
                          <FaGlobe />
                        </span>
                      </div>
                    )}
                  {(ProfileData?.twitterLink == null ||
                    ProfileData?.twitterLink !== "null") && (
                      <div className="signoutbtn my-profile-btn">
                        <span className="Sinoutbtn">
                          <FaTwitter />
                        </span>
                      </div>
                    )}
                  {(ProfileData?.instagramLink == null ||
                    ProfileData?.instagramLink !== "null") && (
                      <div className="signoutbtn my-profile-btn">
                        <span className="Sinoutbtn">
                          <FaInstagram />
                        </span>
                      </div>
                    )}
                </div> */}
                <div >

                  <span style={{ paddingRight: '30px', cursor: "pointer" }} onClick={() => { { following?.length == 0 ? handleBtnClick10() : handleBtnClick4(true) } }}    ><br />{following?.length} Following</span>

                  <span onClick={() => { followers?.length == 0 ? handleBtnClick10() : handleBtnClick5() }} style={{ cursor: "pointer" }}  >{followers?.length} Followers</span>
                </div>
              </div>
              <div className="profile-text-container">
                <p style={{wordBreak:"break-all"  }}>
                  {showMore ? text : `${text?.substring(0, 45)}`}
                  {text?.length > 45 ? (
                    <span className="btn-more-less" style={{ color: "orange", marginLeft: "5px" }} onClick={() => setShowMore(!showMore)}>
                      {showMore ? " show less" : "...show more"}
                    </span>
                  ) : null
                  }
                </p>
                {/* <h5>Follow Me</h5> */}


                <ul className="my-social-list">
                  <li>
                    {
                      ProfileData?.twitterLink && ProfileData?.twitterLink != "null" ?
                        <a target="_blank" href={ProfileData?.twitterLink}><i className="fa fa-twitter"></i>Twitter</a>
                        :
                        <></>        }

                    {/* <a target="_blank" href={ProfileData?.twitterLink == null ? "#" : ProfileData?.twitterLink}> <i className="fa fa-twitter"></i> Twitter</a> */}

                  </li>
                  <li>
                    {
                      ProfileData?.instagramLink && ProfileData?.instagramLink != "null" ?
                        <a target="_blank" href={ProfileData?.instagramLink}><i className="fa fa-instagram"></i>Instagram</a>
                        :
                        <></>      }

                    {/* <a target="_blank" href={ProfileData?.instagramLink == null ? "#" : ProfileData?.instagramLink}><i className="fa fa-instagram"></i> Instagram</a> */}

                  </li>
                  <li>
                    {
                      ProfileData?.yourSiteLink && ProfileData?.yourSiteLink != "null" ?
                        <a target="_blank" href={ProfileData?.yourSiteLink}><i className="fa fa-link"></i>YourSiteLink</a>
                        :
                        <></>      }
                    {/* <a target="_blank" href={ProfileData?.yourSiteLink == null ? "#" : ProfileData?.yourSiteLink}><i className="fa fa-Link"></i> Site Link</a> */}

                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal centered size="md" scrollable={true} show={isToShowModal} onHide={() => { setIsToShowModal(false) }}>
        <Modal.Header closeButton>
          <Modal.Title> {checkfollowers ? "Followers" : "Followings"}     </Modal.Title>
        </Modal.Header>
        <Modal.Body className="following-detail-btn" style={{ minHeight: "300px" }} >
          {
            checkfollowers ? users?.map((number, index) => Modaloffollowers(number, index)) : users1?.map((number, index) => Modaloffollowers(number, index))
          }   </Modal.Body>
      </Modal>
      <section className="container no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <div className="Topbarsetting">
                <ul className="de_nav de_nav">
                  {/* <li id="Mainbtn" className="active">
                    <span onClick={handleBtnClick}>Collection</span>
                  </li> */}
                  <li id="Mainbtn1" className="active">
                    <span onClick={handleBtnClick1}>NFT</span>
                  </li>
                  {/* <li id="Mainbtn2" className="">
                    <span onClick={handleBtnClick2}>Favourites</span>
                  </li> */}
                  {/* <li>
                    <a href="/settings">Edit Profile</a>
                  </li> */}
                  {/* <li id="Mainbtn4" className="">
                    <span onClick={Logoutt}>Logout</span>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {openMenu && (

          <div id="zero1" className="onStep fadeIn">
            <MyCollections />
          </div>
        )}

        {openMenu1 && (
          <div id="zero2" className="onStep fadeIn">
            <MyNft />
          </div>
        )}
        {openMenu2 && (
          <div id="zero3" className="onStep fadeIn">
            <AllFavourite />
          </div>
        )}
        {openMenu3 && (
          <div id="zero3" className="onStep fadeIn">
            <MyNft />{" "}
          </div>
        )}
        {
          openMenu4 && (
            <div id="zero1" className="onStep fadeIn">
              <Followerslist />
            </div>
          )}
        {
          openMenu5 && (
            <div id="zero1" className="onStep fadeIn">
              <Followingslist />
            </div>
          )}
      </section>
      <div className="spacer-single"></div>
      <Footer />
    </div >
  );
};
export default MyProfile;

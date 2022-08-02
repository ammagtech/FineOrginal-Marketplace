import React, { Component, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import http from "../../Redux/Api/http";
import { FaUser } from "react-icons/fa";
import { PropagateLoader, RingLoader } from "react-spinners";
import { useHistory } from "react-router-dom";
import defaultImg from "../../assets/images/default.png";
import bannerimg from "../../assets/images/banner-img.jpg";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
// import {  useSelector } from 'react-redux';

class CustomSlide extends Component {
  render() {
    const { index, ...props } = this.props;
    return <div {...props}></div>;
  }
}
const AuthorList = () => {
  const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

const WalletAddress = useSelector(
  (state) => state.WalletConnction?.WalletResponse?.accounts
);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const profileSelector = useSelector(state => state?.MyProfile?.MyProfileResponse?.data)
  const walletData=useSelector(state=>state?.WalletConnction?.WalletResponse?.accounts)

  useEffect(() => {
  
    getTopSeller()
  }, [walletData]);

  const getTopSeller = () => {
   const wallet=walletData?walletData:"nill"
    http
      .get(httpUrl + `/api/v1/Nft/GetTopSeller?walletAddress=${wallet}`)
      .then(async (res) => {
        setData(res.data.data.accountList);
        setLoading(false);
      })
      .catch((error) => {
     
      });
  }


  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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


      {loading ? (
        <div className="col-sm-12 d-flex justify-content-center">
          <RingLoader color="orange" size="60" />
        </div>
      ) : (
        <>
          <div className="nft author_list ol-styling">
            <Slider {...settings}>
              {data?.map((payload, index) => (
                <>
                  <CustomSlide className="itm" index={1}>
                    <li>
                      <div className="author-banner-img" style={{ backgroundImage: `url(${bannerimg})` }}></div>
                      <div className="author_list_pp" style={{ height: 70 }}>
                    
                        <span onClick={() => history.push(localStorage.getItem("userblock")==="true" && payload?.address === WalletAddress ?'/connectwallet': payload?.address===WalletAddress ?`/myprofile`:`/profile/${payload.address}`              )}>
                          <img className="lazy" src={payload?.profileImage ? httpUrl + "/" + payload?.profileImage : defaultImg} alt="" />
                          {payload?.isVerfiedAccount?<i className="fa fa-check"></i>:""  }            
                        </span>
                      </div>
                      <div className="author_list_info">
                        <span onClick={() => window.open("", "_self")} style={{color:"black"}} >
                          {payload.username}
                        </span>
                        <span className="bot">
                          {payload?.nftSellPrice + " BNB"}
                        </span>
                        <ul class="author-social-list">
                          {/* <li>
                            <a target="_blank" href="#"><i className="fa fa-facebook"></i></a>
                          </li> */}
                          <li>
                          {
                            payload?.instagramLink&&payload?.instagramLink!="null" ?                          
                          <a target="_blank" href={payload?.instagramLink}  style={{cursor:"pointer"}}  ><i className="fa fa-instagram"   ></i></a>
                          :
                            <></> 
                          }
                            {/* <a target="_blank" href="#"><i className="fa fa-instagram"></i></a> */}
                         
                          </li>
                          <li>
                          {
                            payload?.twitterLink&&payload?.twitterLink!="null"?                          
                          <a target="_blank" href={payload?.twitterLink} style={{cursor:"pointer"}}><i className="fa fa-twitter"></i></a>
                          :
                          <></>  }
                            {/* <a target="_blank" href="#"><i className="fa fa-twitter"></i></a> */}
                          </li>
                          <li>
                          {
                          payload?.yourSiteLink&&payload?.yourSiteLink!="null" ?                          
                            <a target="_blank" href={payload?.yourSiteLink}><i className="fa fa-link"></i></a>
                            :
                            <></>  }
                            </li>


                          {/* <li>
                            <a target="_blank" href="#"><i className="fa fa-link"></i></a>
                          </li> */}
                        </ul>
                        <div className="author-folowers-item full-div">
                          <div>
                            <p className="text-center">
                              <b>{payload?.follower}</b>
                              <br />
                              Followers
                            </p>
                          </div>
                          <div>
                            <p className="text-center">
                              <b>{payload?.numberofNft}</b>
                              <br />
                               sold
                            </p>
                          </div>
                        </div>
                        {
                          profileSelector && <div className="full-div">
                          {
                            payload?.address===WalletAddress?<></>:
                            localStorage.getItem("userblock")==="true"?<></>:
                            <button className="follow-btn"   style={payload?.isFollowed?{background:'orange',color:"white"}:{}}      onClick={() => {
                               let tempvar="/api/v1/Account/AddUserFollower";

                               if(payload?.isFollowed)
                               {  
                                 tempvar="/api/v1/Account/UnFollowUser"
                                 http
                                 .put(httpUrl + tempvar, {
                                   "accountFollowerToId": payload?.id
                                 })
                                 .then((res) => {
                                  toast.success(<p style={{wordBreak:"break-word"}}>Account unfollowed successfully </p> , {
                                     position: "top-right",
                                     autoClose: 5000,
                                     hideProgressBar: false,
                                     closeOnClick: true,
                                     pauseOnHover: true,
                                     draggable: true,
                                     progress: undefined,
                                   });
                                   getTopSeller()
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
                               else{
                              http
                                .post(httpUrl + tempvar, {
                                  "accountFollowerToId": payload?.id
                                })
                                .then((res) => {
                                  toast.success(<p style={{wordBreak:"break-word"}}>Account followed successfully </p> , {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                  getTopSeller()
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

                            }}>{payload?.isFollowed? "Following":"+ Follow"}</button>
                          }
                          </div>
                        }

                      </div>
                    </li>
                  </CustomSlide>
                </>
              ))}
            </Slider>
          </div>
        </>
      )}

      <div></div>
    </>
  );
};
export default AuthorList;
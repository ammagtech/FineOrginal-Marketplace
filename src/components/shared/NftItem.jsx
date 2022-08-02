import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import heart from "../../assets/images/heart-icon.png";
import verified from "../../assets/images/orange.png";
import defaultImg from "../../assets/images/default.png";
import { useDispatch, useSelector } from 'react-redux';
import GetFavouriteNftAction from '../../Redux/Actions/NftActions/GetFavouriteNftAction';
import GetNftMarketAction from '../../Redux/Actions/NftActions/GetNftMarketAction';
import { toast } from "react-toastify";
import http from '../../Redux/Api/http';

import moment from "moment";

const NftItem = ({ nft, likeAndDisLikeCallback, soldstatus }) => {
    const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

    const history = useHistory();
    const dispatch = useDispatch()
    const WalletAddress = useSelector(
        (state) => state.WalletConnction?.WalletResponse?.accounts
    );
    const isConnected = useSelector((state) => state.Login?.authResponse?.data);
    const myFouritesNFTs = useSelector(
        (state) => state.GetFavouriteNft?.GetFavouriteNftResponse?.data
    );
    const [days, setDays] = useState();
    const [hours, setHours] = useState();
    const [timer, setTimer] = useState(false);
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();
    const [Rateinusd, setRateinusd] = useState()
    const [isInterval, setIsInterval] = useState(false);
    const [buttonclicked, setbuttonclicked] = useState(false);
    const [countoffav, setcountoffav] = useState(0);
    const [favnft, setfavnft] = useState(false);
    function ParseFloat(str, val) {
        str = str.toString();
        str = str.slice(0, (str.indexOf(".")) + val + 1);
        return Number(str);
    }
    useEffect(async () => {
        await http
            .get(httpUrl + "/api/v1/Nft/GetRateInUSD")
            .then((res) => {
                setRateinusd(res.data.data)
            })
            .catch((error) => {
                // console.log(error?.message);
            })

        if (myFouritesNFTs?.some((data) => data.id === nft?.id)) {
            setfavnft(true);
        }
        else {
            setfavnft(false);
        }
        setcountoffav(nft?.nftFavouritesCount)
        if (nft && !isInterval) {
            console.log("myData.bidEndDate", nft?.bidEndDate);
            const eventTime = moment(nft?.bidEndDate).unix();
            console.log("eventTime", eventTime);
            const currentTime = moment().unix();
            console.log("currentTime", currentTime);


            const diffTime = eventTime - currentTime;
            console.log("difftime", diffTime);
            let duration = moment.duration(diffTime * 1000, "milliseconds");
            console.log("duration", duration);
            const interval = 1000;
            var timerID = setInterval(() => {

                setIsInterval(true);
                if (duration._milliseconds <= 0) {
                    setDays("0");
                    setHours("0");
                    setMinutes("0");
                    setSeconds("0");
                    setTimer(true);
                } else {
                    duration = moment.duration(duration - interval, "milliseconds");
                    // console.log("timestamp", duration);
                    setDays(duration.days());
                    setHours(duration.hours());
                    setMinutes(duration.minutes());
                    setSeconds(duration.seconds());
                    setTimer(true);
                }
            }, interval);
            return () => clearInterval(timerID);
        }
    }, [])
    const removeFromLike = () => {
        setbuttonclicked(true)
        if (!isConnected) {
            toast.error(`Please connect to wallet first`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setbuttonclicked(false)
            return;
        }
        http.put(httpUrl + "/api/v1/Nft/RemoveFavouriteNft", {
            "nftId": nft?.id,
            "nftAddress": nft?.ownerAddress
        }).then(resp => {
            toast.success(`Removed from favourite`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            dispatch(GetFavouriteNftAction()).then(resp => {
                likeAndDisLikeCallback()
                setbuttonclicked(false)
                setfavnft(false)
                setcountoffav(countoffav - 1)
            }).catch(error => {

                setbuttonclicked(false)
            })
        }).catch(error => {

            setbuttonclicked(false)
        })
    }


    const addToLike = () => {

        setbuttonclicked(true)
        if (!isConnected) {
            toast.warn(`Please connect to wallet first`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setbuttonclicked(false)
            return;
        }
        http.post(httpUrl + "/api/v1/Nft/AddFavouriteNft",
            {
                "nftId": nft?.id,
                "nftAddress": nft?.ownerAddress
            }
        ).then(resp => {
            toast.success(`Added to favourite`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            dispatch(GetFavouriteNftAction()).then(resp => {
                likeAndDisLikeCallback()
                setfavnft(true)
                setcountoffav(countoffav + 1)
                setbuttonclicked(false)
            }).catch(error => {

                setbuttonclicked(false)
            })
        }).catch(error => {

            setbuttonclicked(false)
        })

    }
    return (
        <div className="nft_coll">
            <div className="nft_wrap">
                <span
                    className="pic-demo">
                    {/* <span className="heart-span" style={{ cursor: "pointer" }} onClick={buttonclicked?<></>:favnft?removeFromLike:addToLike    } >
                        {
                            myFouritesNFTs?.some((data) => data.id === nft?.id) ? <img src={heart}  /> : <i className='fa fa-heart mr-1'
                                />
                        }
                        {" "}
                        {countoffav}</span>    */}
                    {
                        soldstatus ?
                            <ul className="time-counter">
                                <li style={{ fontSize: '15px' }}>Sold</li>
                            </ul>
                            :

                            <>
                                {

                                    nft.isBidOpen == true ?
                                        <>
                                            {
                                                days == 0 && hours == 0 && minutes == 0 && seconds == 0 ?
                                                    <>
                                                        {
                                                            <ul className="time-counter">

                                                                <li style={{ fontSize: '15px' }}>Auction Ended</li>
                                                            </ul>
                                                        }
                                                    </> :
                                                    <>
                                                        {
                                                            <ul className="time-counter">
                                                                <li>Remaining Time</li>
                                                                <li> {days ? days : days === 0 ? 0 : 0}{" "}D</li>
                                                                <li>:</li>
                                                                <li>{hours ? hours : hours === 0 ? 0 : 0}{" "}H</li>
                                                                <li>:</li>
                                                                <li>{minutes ? minutes : minutes === 0 ? 0 : 0}{" "}M</li>
                                                                <li>:</li>
                                                                <li>{seconds ? seconds : seconds === 0 ? 0 : 0}{" "}S</li>
                                                            </ul>
                                                        }
                                                    </>
                                            }
                                        </>
                                        : <></>
                                }
                            </>

                    }
                    <div className="table-cell">
                        <div className="table-cell-center"
                            onClick={() => {
                                history.push(`/usernftdetail/${nft?.contractAddress}/${nft?.nftTokenId}`);
                            }}
                            style={{ cursor: 'pointer' }}>
                                       {
                           nft?.image?.split(".")[1] === 'mp4' ? <video
                           src={httpUrl + "/" + nft?.image} width="100%"  id="get_file_2"  muted={true}       className="lazy img-fluid" alt="NFT.png" autoPlay={true} loop={true} />
                          :  <img 
                          src={httpUrl + "/" + nft?.image}           className="lazy img-fluid" alt="NFT.png" />
                 
                           }
                           
                 
                        </div>
                    </div>
                </span>
            </div>
            {/* <div className="nft_coll_pp">
                <span
                    onClick={() => {
                        history.push(
                            localStorage.getItem("userblock")==="true" && nft?.ownerAddress === WalletAddress ?'/connectwallet': 
                            nft.ownerAddress === WalletAddress
                                ? `/myprofile`
                                : `/profile/${nft.ownerAddress}`
                        );
                    }}
                >
                    <img
                        className="lazy"
                        src={
                            nft?.ownerImage
                                ? httpUrl + "/" + nft?.ownerImage
                                : defaultImg
                        }
                        alt=""
                    />
                    
                    {nft?.isVerfiedAccount?<i className="fa fa-check"></i>:<></>}       
                </span>
            </div> */}
            <div className="nft_coll_info">
                <span className="color-txt"
                    onClick={() =>
                        history.push(
                            `/nftsbycollections/${nft?.collectionId}`
                        )
                    }>
                    {nft?.collectionName}
                </span>
                <span
                    onClick={() => {
                        history.push(`/usernftdetail/${nft?.contractAddress}/${nft?.nftTokenId}`);
                    }}
                >
                    <h4> { nft?.name.length>19? nft?.name.slice(0,19)+"..":nft.name  
                    
                    }</h4>
                </span>
                <span>
                    Price {" " + nft?.sellPrice == 0 ? nft?.buyPrice : nft?.sellPrice + " "} BNB
                    <span style={{ float: 'right' }}>${nft?.sellPrice == 0 ? ParseFloat(nft?.buyPrice * Rateinusd, 4) : ParseFloat(nft?.sellPrice * Rateinusd, 4)} </span>
                </span>
                {/* <div className="full-div">
                    <a
                        onClick={() => {
                            history.push(`/usernftdetail/${nft?.id}/${nft?.accountId}`);
                        }}
                        className="view-all-btn"
                    >
                        Detail{" "}
                        <i
                            className="fa fa-angle-right"
                            aria-hidden="True"
                        ></i>
                    </a>
                </div> */}
            </div>
        </div>
    )
}

export default NftItem




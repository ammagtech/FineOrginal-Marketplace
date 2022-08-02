import React, { useEffect, useState, useRef } from "react";
import Footer from "../../../components/footer";
import { createGlobalStyle } from "styled-components";
import { Link, useHistory, useParams, Redirect } from "react-router-dom";
import BuyUserNft from "./BuyUserNftdet";


import Error from "../../../../assets/images/close-icon-100-01-01.png";
import { useDispatch, useSelector } from "react-redux";
import GetNftMarketByIdAction from "../../../../Redux/Actions/NftActions/GetNftMarketById";
import clockicon from "../../../../assets/images/clockicon-big.png";
import heart from "../../../../assets/images/heart-icon.png";
import heartBlack from "../../../../assets/images/heart_black.png";
import verified from "../../../../assets/images/verified-icon.png";
import cryptocurrency from "../../../../assets/images/cryptocurrency-icon_2.png";
import placebid from "../../../../assets/images/placebid-icon.png";
import {
  Modal,
  Button,
  InputGroup,
  FormControl,
  Form,
  FormCheck,
  Dropdown,
  Row,
  DropdownButton,
  Col,
} from "react-bootstrap";
import { keyframes } from "@emotion/react";
import { toast, ToastContainer } from "react-toastify";
import { PulseLoader, RingLoader } from "react-spinners";
import swal from "sweetalert";
import axios from "axios";
import { toInteger } from "lodash";
import DatePicker from "react-datepicker";
import BuyNftMarketAction from "../../../../Redux/Actions/NftActions/BuyNftMarketActions";
import MyItemDetails from "../../MyNfts/MyNftDetail/MyItemDetails";
import {
  sendTransection,
  signMessage,
  approveNft,
  buyNftMarket,
  cancelNft,
  openForAuction,
  approveContract,
  acceptBid,
  checkBalance1
} from "../../../../metamask";
import Web3 from "web3";
import moment from "moment";
import GetFavouriteNftAction from "../../../../Redux/Actions/NftActions/GetFavouriteNftAction";
import RemoveFavouriteNftAction from "../../../../Redux/Actions/NftActions/RemoveFavouriteNftAction";
import defaultImg from "../../../../assets/images/default.png";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import http from "../../../../Redux/Api/http";
import Table from "react-bootstrap/Table";
import NftItem from "../../../shared/NftItem";
import { isCommunityResourcable } from "@ethersproject/providers";
const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: transparent;
  }
`;

const UserNftDetails = function () {
  const dispatch = useDispatch();
  const [WBNBBalance, setWBNBBalance] = useState(0)
  const { id, accountId } = useParams();
  const history = useHistory();
  const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

  const GetNftMarketById = useSelector(
    (state) => state.myData?.GetNftMarketByIdResponse?.data
  );

  const AuthConnectState = useSelector(
    (state) => state.AuthConnect.AuthConnectResponse?.data
  );

  const myNftById = useSelector(
    (state) => state.GetMyNftById?.GetMyNftByIdResponse?.data
  );
  const GetFavouriteNft = useSelector(
    (state) => state.GetFavouriteNft?.GetFavouriteNftResponse?.data
  );

  const isConnected = useSelector(
    (state) => state.Login?.authResponse?.data?.token
  );
  const [show, setShow] = useState(false);
  const [NFTID, setNFTID] = useState(0);
  const searchRef = useRef();
  const [NewPrice, SetNewPrice] = useState(false);
  const [inputAmount, setInputAmount] = useState();
  const [maxInputAmount, setMaxInputAmount] = useState();
  // const [nftId, setNftId] = useState();
  const [amountCheck, setAmounCheck] = useState(false);
  const [amountCheck1, setAmounCheck1] = useState(false);
  const [balance, setBalance] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [HistoryofNft, SetHistoryofNft] = useState([]);
  const [biddingLoading, setIsBiddingLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState(false);
  const [emptyBids, setEmptyBids] = useState(false);
  const [filterTrigger, setFilterTrigger] = useState(false);
  const [rating, setRating] = useState(0);
  const [biddings, setBiddings] = useState();
  const [myData, setMyData] = useState();

  const [Makeofferinput, setMakeofferinput] = useState(false)
  const [filterData, setFilterData] = useState([]);
  const [checksaleminus, setchecksaleminus] = useState(false);
  const [checksaleminus1, setchecksaleminus1] = useState(true);
  const [filter, setfilter] = useState([]);
  const [allData, setAllData] = useState([]);
  const [bidTrigger, setBidtrigger] = useState(false);
  const [isInterval, setIsInterval] = useState(false);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [IsAcceptBidisinprocess, setIsAcceptBidisinprocess] = useState(true);
  const [paramsCheck, setParams] = useState();
  const [paramsLoading, setParamsLoading] = useState(true);
  const [imageShow, setImageShow] = useState(false);
  const [timer, setTimer] = useState(false);
  const [bidInProgress, setBidInProgress] = useState(false);
  const [isOfferInProgress, setIsOfferInProgress] = useState(false);
  const [CollectionLogoImage, setCollectionLogoImage] = useState("");
  const [sellnftpriceerror, setSellnftpriceerror] = useState(false);
  const [sellnftpriceerror1, setSellnftpriceerror1] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [bidError, setBidError] = useState(false);
  const [bidError1, setBidError1] = useState(false);
  const [expiryError, setExpiryError] = useState(false);
  const [days, setDays] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [myDataLoader, setmyDataLoader] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [isStacked, setIsStacked] = useState(false);
  const [amountCheck2, setAmounCheck2] = useState(false);
  const [amountCheck3, setAmounCheck3] = useState(false);
  const [amountCheck4, setAmounCheck4] = useState(false);
  const [negetive, setnegetive] = useState(false)

  const [negetive1, setnegetive1] = useState(false)
  const [makeofferbutton, setmakeofferbutton] = useState(false)
  const [stakeLoading, setStakeLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [collectionData, setCollectionData] = useState();
  const [numItems, setNumItems] = useState(4)
  const [amountcheck6, setAmounCheck6] = useState(false)

  const [minbalance, setminbalance] = useState(false)
  const [maxbalance, setmaxbalance] = useState(false)
  const [lower, setlower] = useState(false)

  const [expiryDateplacebid, setexpiryDateplacebid] = useState(new Date());
  const [buttonclicked, setbuttonclicked] = useState(false);
  const [countoffav, setcountoffav] = useState(0);
  const [favnft, setfavnft] = useState(false);
  const [maxpriceofsell, setmaxpriceofsell] = useState(false)
  const [maxpriceofsell1, setmaxpriceofsell1] = useState(false)
  const [equalcheck, setequalcheck] = useState(false)
  const [checkprocessing, setcheckprocessing] = useState(false)
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const [Breakloop, setbreakloop] = useState(false)
  const [height, Setheight] = useState(270);
  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );
  const Token = useSelector((state) => state.Login?.authResponse?.data?.token);
  const WalletBalance = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.balance
  );

  const sellingModal = () => {
    setFilterTrigger(false)
  }





  useEffect(async () => {
    await http
      .get(httpUrl + "/api/v1/Nft/GetWBNBAddress")
      .then(async (response) => {
        checkBalance1(response?.data?.data, WalletAddress).then(resp => {
          setWBNBBalance(Web3.utils.fromWei(resp))
          // isCommunityResourcable.loadMore
          console.log("WBNB", response.data.data)

        }).catch(error => {
          console.log("this is error  ::  ", error)
        })
      })
  }, [])
  const callapiagain = async () => {
    await http
      .get(
        httpUrl +
        `/api/v1/Nft/GetNftMarketByIds?NFTSmartContractAddress=${id}&NFTTokenId=${accountId}`
        // GetNftMarketByIds?NFTSmartContractAddress=${body.nftId}&NFTTokenId=${body.accountId }
      )
      .then(async (res) => {
        console.log("checkprocessing");
        if (res.data.data?.processing && res.data.data?.processing != "Done") {
          callapiagain()

          console.log("checkprocessing 2");
        }
        else {

          console.log("checkprocessing 3");
          window.location.reload();
          setbreakloop(true)
          setcheckprocessing(false)
        }
      }).catch(() => {

      })
  }
  useEffect(async () => {
    if (checkprocessing) {
      do {
        setTimeout(() => {
          callapiagain()
        }, 5000);

      } while (Breakloop == true)
    }
  }, [checkprocessing])



  useEffect(() => {
    if (NewPrice) {

      if (NewPrice == 0) {
        setSellnftpriceerror1(true)
        // alert("zero")
        setchecksaleminus1(true)
        setSellnftpriceerror(false)
      }
      else {

        setSellnftpriceerror1(false)
        if (NewPrice < 0) {
          setchecksaleminus(true)
          setchecksaleminus1(true)
          setSellnftpriceerror(true)

        }
        if (NewPrice > 0) {
          setSellnftpriceerror(false)
          setchecksaleminus1(false)

        }
        else {
          setchecksaleminus1(true)
          setchecksaleminus(false)

        }
        if (NewPrice > 0 && NewPrice < 0.00000001) {
          setmaxpriceofsell(true)
          setchecksaleminus(true)
          setchecksaleminus1(true)
        }
        else {
          setmaxpriceofsell(false)
        }
        if (NewPrice > 0.00000001) {

          setmaxpriceofsell(false)
          setSellnftpriceerror(false)
          setchecksaleminus1(false)
        }
      }
    }
    else {
      setmaxpriceofsell(false)
      setchecksaleminus1(true)
      setSellnftpriceerror(false)
      setSellnftpriceerror1(false)
    }
  }, [NewPrice])

  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);

  const [openMenu4, setOpenMenu4] = React.useState(false);
  const handleBtnClick = () => {
    setOpenMenu(true);
    setOpenMenu1(false);
    setOpenMenu2(false);
    setOpenMenu3(false);

    setOpenMenu4(false);
    document.getElementById("Mainbtn").classList.add("active");
    // document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
    document.getElementById("Mainbtn3").classList.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(true);
    setOpenMenu2(false);
    setOpenMenu(false);
    setOpenMenu4(false);
    // document.getElementById("Mainbtn1").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn4").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(true);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu3(false);
    setOpenMenu4(false);
    document.getElementById("Mainbtn").classList.remove("active");
    // document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn2").classList.add("active");
    document.getElementById("Mainbtn3").classList.remove("active");
    document.getElementById("Mainbtn4").classList.remove("active");
  };
  const handleBtnClick3 = () => {
    setOpenMenu2(false);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu3(true);
    setOpenMenu4(false);
    document.getElementById("Mainbtn").classList.remove("active");
    // document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn3").classList.add("active");
    document.getElementById("Mainbtn2").classList.remove("active");
    document.getElementById("Mainbtn4").classList.remove("active");
  }; const handleBtnClick4 = () => {
    setOpenMenu2(false);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu3(false);
    setOpenMenu4(true);
    document.getElementById("Mainbtn").classList.remove("active");
    // document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn3").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
    document.getElementById("Mainbtn4").classList.add("active");

  };

  const loadMore = () => {
    if (collectionData?.length > numItems) {
      // console.log(numItems);
      // console.log(collectionData?.length);
      setNumItems((prev) => prev + 3)
    }
  };

  const handleClose = () => {
    setShow(false);
    setAmounCheck1(false);
    setAmounCheck(false);
    setInputAmount(null);
  };

  const handleShow = () => {
    if (!isConnected || isConnected === undefined) {
      return history.push("/connectwallet");
    } else {
      setShow(true);
    }
  }
  const [minndate, setminndate] = useState(new Date());

  const [startmax, setstartmax] = useState(new Date())
  const handleImageClose = () => setImageShow(false);
  const handleClose1 = () => setOpenBid(false);
  const [getMasterAddress, setGetMasterAddress] = useState();
  const [loader, setLoader] = useState(true);
  const [openBid, setOpenBid] = useState(false);
  const [isToShowModal, setIsToShowModal] = useState(false);
  const [sellingIsLoading, setSellingIsLoading] = useState(false);
  const [openBidCheck, setOpenBidCheck] = useState(false);
  const [openBidCheck1, setOpenBidCheck1] = useState(false);
  const [zerocheck, setzerocheck] = useState(false)
  const [Rateinusd, setRateinusd] = useState()

  useEffect(() => {
    let date1 = endDate;
    date1.setDate(date1.getDate() + 1);
    setstartmax(date1)
    // date.setDate(date.getDate() + 1);
  }, [])
  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 2000)
  }, [myData])

  useEffect(() => {
    if (openBid == false) {
      setBidError(false)
      setBidError1(false)
      setAmounCheck1(false)
      setAmounCheck2(false)
      setAmounCheck3(false)
      setAmounCheck4(false)
      setInputAmount(false)
      setIsSwitchOn(false)
      setMaxInputAmount(false)

    }

  }, [openBid])
  useEffect(() => {
    if (filterTrigger == false) {

      setSellnftpriceerror(false)
      setmaxpriceofsell(false)
    }
  }, [filterTrigger])



  useEffect(async () => {
    await http
      .get(httpUrl + "/api/v1/Nft/GetRateInUSD")
      .then((res) => {
        setRateinusd(res.data.data)
      })
      .catch((error) => {
        // console.log(error?.message);
      });
  }, [])
  useEffect(() => {
    getMarketByid()
  }, [id, accountId]);
  useEffect(() => {
    getMarketByid()
  }, []);
  useEffect(async () => {
    if (myData && myData?.collectionId) {
      getNftCollection()
    }
  }, [myData]);

  const getNftCollection = async () => {
    setCollectionLoading(true)

    http
      .get(
        httpUrl +
        `/api/v1/Nft/GetAllNftsByCollectionId?collectionId=${myData?.collectionId}&PageSize=9999&CurrentPage=1`
      )
      .then(async (res) => {
        // console.log("object", res.data.data);
        setCollectionData(res.data.data);
        dispatch(GetFavouriteNftAction())
        setCollectionLoading(false)
      })
      .catch((error) => {
        // getNftCollection()
        // console.log(error);
      });
  }

  const apisCall = () => {
    http
      .get(
        httpUrl +
        `/api/v1/Nft/GetAllNftsByCollectionId?collectionId=${myData?.collectionId}&PageSize=9999&CurrentPage=1`
      )
      .then(async (res) => {
        setCollectionData(res.data.data);
        dispatch(GetFavouriteNftAction())
        setCollectionLoading(false)
      })
      .catch((error) => {
        //   getNftCollection()
        // console.log(error);
      });
  }


  useEffect(async () => {

    if (WalletBalance) {
      checkBalance1("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", WalletAddress).then(resp => {
        setWBNBBalance(Web3.utils.fromWei(resp))
      }).catch(error => {
        console.log("this is error  ::  ", error)

      })

      const amount = Web3.utils.fromWei(WalletBalance.toString(), "ether");
      setBalance(amount);
      const payload = {
        nftId: id,
        accountId: accountId,
      };

    } else {
      setBalance("0");
      const payload = {
        nftId: id,
        accountId: accountId,
      };

    }
  }, [id, accountId]);

  useEffect(() => {
    if (myData) {
      // console.log(MyProfile);
      profileData()
    }
  }, [myData])


  useEffect(() => {
    // setTimer(true)
    let params = window.location.pathname;
    setParams(params.split("/")[1]);
    setParamsLoading(false);
    if (myData && !isInterval) {
      // console.log("myData.bidEndDate", myData?.bidEndDate);
      const eventTime = moment(myData?.bidEndDate).unix();
      // console.log("eventTime", eventTime);
      const currentTime = moment().unix();
      // console.log("currentTime", currentTime);


      const diffTime = eventTime - currentTime;
      // console.log("difftime", diffTime);
      let duration = moment.duration(diffTime * 1000, "milliseconds");
      // console.log("duration", duration);
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
          // // console.log("timestamp", duration);
          setDays(duration.days());
          setHours(duration.hours());
          setMinutes(duration.minutes());
          setSeconds(duration.seconds());
          setTimer(true);
        }
      }, interval);
      return () => clearInterval(timerID);
    }
  }, [myData?.bidEndDate]);

  useEffect(() => {

    if (myData) {
      AllBids()
    }
  }, [myData])


  useEffect(async () => {
    if (isConnected) {
      await dispatch(GetFavouriteNftAction());
    }
  }, [])
  function ParseFloat(str, val) {
    str = str.toString();
    str = str.slice(0, (str.indexOf(".")) + val + 1);
    return Number(str);
  }

  const AllBids = async () => {
    let params = window.location.pathname;
    setParams(params.split("/")[1]);
    setParamsLoading(false);
    if (WalletBalance) {
      const amount = await Web3.utils.fromWei(
        WalletBalance.toString(),
        "ether"
      );
      setBalance(amount);
      http
        .get(
          httpUrl + `/api/v1/Nft/GetNftBids?NftId=${myData?.id}`
        )
        .then(async (res) => {
          if (!res.data.data || res.data.data === null) {
            setEmptyBids(true);
            setIsLoading(false);
            //setShow(false);
            setIsBiddingLoading(false);
          }
          else {
            setBiddings(res.data.data);

            // console.log("NFT BIDDING", res.data.data)
            setIsBiddingLoading(false);
            setShow(false);
            setIsLoading(false);
          }
        }).catch(() => {
          //AllBids()
        });
    } else {
      http
        .get(
          httpUrl + `/api/v1/Nft/GetNftBids?NftId=${myData?.id}`
        )
        .then(async (res) => {
          if (!res.data.data || res.data.data === null) {
            setEmptyBids(true);
            setIsLoading(false);
            setShow(false);
            setIsBiddingLoading(false);
          }
          else {
            setBiddings(res.data.data);
            // console.log("NFT BIDDING", res.data.data)
            setIsBiddingLoading(false);
            setShow(false);
            setIsLoading(false);
          }
        }).catch(() => {
          //  AllBids()
        });
    }
  }

  useEffect(() => {
    if (myData) {
      viewsCount()
    }
  }, [myData])

  useEffect(() => {
    if (myData) {
      MasterAddressFunc()
    }
  }, [myData])

  const MasterAddressFunc = async () => {
    http
      .get(httpUrl + "/api/v1/Nft/GetMasterAddress")
      .then(async (res) => {
        // // console.log("GetMasterAddress", res?.data?.data.address);
        if (WalletBalance) {
          const amount = await Web3.utils.fromWei(
            WalletBalance.toString(),
            "ether"
          );
          setBalance(amount);
          setGetMasterAddress(res?.data?.data?.address);
        } else {
          setBalance("0");
          setGetMasterAddress(res?.data?.data?.address);
        }
      })
      .catch((error) => {
        // MasterAddressFunc()
        // console.log("master add");
        // console.log(error?.message);
      });
  }

  const viewsCount = async (e) => {
    await http
      .post(httpUrl + `/api/v1/Nft/AddViewNft?NftId=${myData?.id}`)
      .then((res) => {
        // console.log("view added", res);
      }).catch((e) => {
        // console.log("er", e);
      })
  }
  const profileData = async (e) => {
    if (WalletAddress) {
      // console.log("WalletAddress", WalletAddress);
      await http
        .get(httpUrl + `/api/v1/Account/GetAccount?address=${WalletAddress}`)
        .then((res) => {
          setIsStacked(res.data.data.isStacked)
          setStakeLoading(false)
        }).catch((e) => {
          // profileData()
          // console.log("er stackingggg", e);
        })
    }
    else {
      setStakeLoading(false)

    }
  }













  const sellingHandler = async (e) => {
    e.preventDefault();
    setSellingIsLoading(true);
    const address = {
      address: myData?.ownerAddress,
    };
    await http
      .post(httpUrl + "/api/v1/auth/connect", address)
      .then(async (res) => {
        // console.log("authstate", res?.data.data.message);
        toast.success(
          `Selling in process`,
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        await http
          .get(httpUrl + "/api/v1/Nft/GetMarketNftAddress")
          .then(async (res) => {
            const payload = {
              approved: res?.data,
              tokenId: myData?.nftTokenId,
            };
            const payloadMarket = {
              nftContractId: myData?.contractAddress,
              tokenId: myData?.nftTokenId,
              price: NewPrice,
              plateformFeePercentage: myData?.plateformFeePercentage,
              isUnderOrgnization: false,
              // isUnderOrgnization: myData?.organizationName ? true : false,
              orgnizationAddress: myData?.organizationWalletAddress ? myData?.organizationWalletAddress : '0x0000000000000000000000000000000000000000',
              orgnizationPercentage: myData?.organizationPercentAmount ? (myData?.organizationPercentAmount) : '0',
              // marketAddress: resAddress
            };



            dispatch(
              approveContract(
                payload,
                myData?.contractAddress,
                payloadMarket
              ).then(async (r) => {
                toast.success(
                  <p style={{ wordBreak: "break-word" }} >Contract approved, wait for the last step </p>,
                  {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }
                );

                let body = {
                  nftId: myData?.id,
                  price: NewPrice,
                  approvalTransactionHash: r.res.hash,
                  openOrderTransactionHash: r.response.hash,
                };

                delay(12000).then(async () => {
                  // console.log("I have got 5 sec delay");
                  await http
                    .post(httpUrl + "/api/v1/Nft/SellNftMarket", body)
                    .then(async (res) => {

                      toast.success(
                        <p style={{ wordBreak: "break-word" }} >NFT Selling in process, you will be redirected shortly</p>,
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
                        history.push("/marketplace");
                      }, 3000);
                    });
                });






              }).catch((e) => {
                setFilterTrigger(false)
                setSellingIsLoading(false)
                // console.log("error in approve", e);
              })
            )
            marketFunction();
            setSellingIsLoading(false)
          });

      })
      .catch((error) => {

      });

  };
  const marketFunction = (e) => {
    // console.log("IN IT");
    const payloadMarket = {
      nftContractId: myData?.contractAddress,
      tokenId: myData?.nftTokenId,
      price: NewPrice,
    };
    dispatch(
      approveContract(payloadMarket, myData?.contractAddress).then(
        (ress) => {

        }
      )
    ).catch((e) => {
      // console.log("error in market", e);
    });
  };

  async function getMarketByid() {
    await http
      .get(
        httpUrl +
        `/api/v1/Nft/GetNftMarketByIds?NFTSmartContractAddress=${id}&NFTTokenId=${accountId}`
        // GetNftMarketByIds?NFTSmartContractAddress=${body.nftId}&NFTTokenId=${body.accountId }
      )
      .then(async (res) => {
        // console.log("this is data")
        // console.log("testing    ",res)



        console.log(res.data.message)
        if (res.data.message === "NFTMarket not found") {
          setIsToShowModal(true)
          //   history.push("/myprofile");
        }
        setMyData(res.data.data);
        if (res.data.data?.processing && res.data.data?.processing != "Done") {
          // setcheckprocessing(true)
          callapiagain()
        }
        setNFTID(res?.data?.data?.id)
        if (GetFavouriteNft?.some((data) => data.id === res.data.data?.id)) {
          setfavnft(true);
        }
        else {
          setfavnft(false);
        }
        setcountoffav(res.data.data?.nftFavouritesCount)
        collectionimage(res?.data.data.collectionId)
        // console.log("Collection Image ",res?.data.data.collectionId)

        setmyDataLoader(false)



        await http
          .get(httpUrl + `/api/v1/Nft/GetNftActivityHistory?nftId=${res?.data.data.id}`
          ).then((res) => {
            console.log("history", res?.data.data)
            SetHistoryofNft(res?.data.data)

          }).catch(() => {

          })

      })
      .catch((error) => {
        // console.log(error);
      });
  }

  const acceptBidOffer = async (id1, price, buyerAddress, contractAddress) => {
    // console.log("accept bid");
    // console.log(id);
    // console.log("accept bid");
    setIsAcceptBidisinprocess(false);
    await http
      .get(httpUrl + `/api/v1/Nft/GetMarketNftAddress`)
      .then(async (res) => {
        // console.log("market address", res.data.data);
        const payload = {
          contractAddress: res.data.data,
          tokenId: myData?.nftTokenId,
          price: price,
          buyerAddress: buyerAddress,
          nftContractAddress: contractAddress,
        };
        // console.log("payload",payload);

        dispatch(acceptBid(payload)).then((res) => {
          delay(5000).then(async () => {

            setIsAcceptBidisinprocess(true);
            toast.success(`Bid has been accepted!`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            await http
              .put(httpUrl + `/api/v1/Nft/bidAccepted?bidId=${id1}&TransactionHash=${res.hash}`)
              .then(async (res) => {
                // console.log("added accepted response", res);
                delay(2000).then(async () => {
                  history.push("/marketplace");
                });
              });
          });
        }).catch(() => {

          setIsAcceptBidisinprocess(true);
          toast.error(`Transaction rejected`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
        // console.log("ACCEPT BID PAYLOAD", payload);
      });
  };


  useEffect(() => {
    if (inputAmount) {
      if (inputAmount < 0) {
        setAmounCheck3(false)
        setAmounCheck4(true)
      }
      else {
        setAmounCheck4(false)
        if (maxInputAmount) {
          if (inputAmount === maxInputAmount) {
            setAmounCheck3(false)
            setequalcheck(true)
          }
          else {
            setequalcheck(false)
          }
          if (inputAmount > maxInputAmount) {
            setAmounCheck1(true)
          }
          else {
            setAmounCheck1(false)
          }

          if (inputAmount > 0 && inputAmount < maxInputAmount && maxInputAmount > 0) {
            setAmounCheck3(true)
          }
          else {
            setAmounCheck3(false)
          }
        }
      }
    }
    else {
      setAmounCheck4(false)
      setequalcheck(false)
      setAmounCheck3(false)
      setAmounCheck(false)
    }
  }, [inputAmount])
  useEffect(() => {
    if (openBid == false) {
      setBidError(false)
      setBidError1(false)
      setAmounCheck1(false)
      setAmounCheck2(false)
      setAmounCheck3(false)
      setAmounCheck4(false)
      setInputAmount(false)
      setIsSwitchOn(false)
      setMaxInputAmount(false)

    }

  }, [openBid])
  useEffect(() => {
    if (maxInputAmount) {
      if (maxInputAmount > 0) {
        setAmounCheck6(false)
        if (maxInputAmount < inputAmount) {
          setAmounCheck3(false)
          setAmounCheck1(true)
        }
        else {
          setAmounCheck1(false)
        }
        if (inputAmount === maxInputAmount) {
          setAmounCheck3(false)
          setequalcheck(true)
        }
        else {
          setequalcheck(false)
        }
      }
      else {
        setAmounCheck3(false)
        setAmounCheck6(true)
      }
      if (inputAmount > 0 && inputAmount < maxInputAmount && maxInputAmount > 0) {
        setAmounCheck3(true)
      }
      else {
        setAmounCheck3(false)
      }
    }
    else {
      setAmounCheck1(false)
      setAmounCheck2(false)
      setAmounCheck6(false)
      setAmounCheck3(false)

      setequalcheck(false)
    }
  }, [maxInputAmount])


  const amountStatus = (value) => {
    if (inputAmount > 0) {
      if (inputAmount === maxInputAmount) {
        setequalcheck(true);
        setOpenBidCheck(false)
      }
    }
    if (value === null) {
      setOpenBidCheck(false)
    }
    if (value < 0) {
      setAmounCheck3(true)
      setOpenBidCheck(false)
    }
    else {
      setAmounCheck3(false)
    }
    setzerocheck(false)
    if (value > WBNBBalance) {
      setAmounCheck(true);
      setOpenBidCheck(false)
    }
    else if (value > maxInputAmount) {
      setAmounCheck2(true);
      setOpenBidCheck(false)
    }
    else {
      setequalcheck(false)
      setOpenBidCheck(true)
      setAmounCheck2(false);
      setAmounCheck(false);
      setInputAmount(value);
    }
    if (value === null) {
      setOpenBidCheck(false)
    }
  };


  const openBidding = async () => {
    setBidInProgress(true);
    let params = window.location.pathname;
    // console.log("nftid", params.split("/")[2]);
    // console.log("accountid", params.split("/")[3]);
    await http
      .get(httpUrl + "/api/v1/Nft/GetMarketNftAddress")
      .then(async (res) => {
        // console.log("object", res);
        const contractPayload = {
          nftContractId: myData?.contractAddress,
          tokenId: myData?.nftTokenId,
          price: inputAmount,
          maxPrice: maxInputAmount,
          platform_percentage: myData?.plateformFeePercentage,
          contractAddress: res.data.data,
          isUnderOrgnization: false,
          orgnizationPercentage: myData?.organizationPercentAmount ? (myData?.organizationPercentAmount) : '0',
          // usman's change start
          orgnizationAddress: res.data.data,
          // usman's change end

          //  orgnizationAddress: myData?.organizationWalletAddress,
          //  orgnizationAddress: "0x0a8b0ae65a7062F6BdFD5e4C577E5CC3629971A5",



        };
        dispatch(openForAuction(contractPayload))
          .then(async (approvedHashes) => {
            // console.log("auction response");
            // console.log(res);
            // console.log("auction response");
            let params = window.location.pathname;
            const payload = {
              nftId: myData?.id,
              isBidOpen: true,
              minimumAmount: inputAmount,
              maximumAmount: maxInputAmount,
              bidStartDate: startDate,
              bidEndDate: endDate,
            };
            await http
              .post(httpUrl + "/api/v1/Nft/OpenBid", payload)
              .then(async (res) => {
                let body = {
                  nftId: myData?.id,
                  price: maxInputAmount,
                  approvalTransactionHash: approvedHashes.res.hash,
                  openOrderTransactionHash: approvedHashes.response.hash,
                };
                setShow(false);
                setBidtrigger(true);
                delay(5000).then(async () => {
                  // console.log("I have got 5 sec delay");
                  await http
                    .post(httpUrl + "/api/v1/Nft/SellNftMarket", body)
                    .then(async (res) => {
                      setBidInProgress(false);
                      toast.success(
                        <p style={{ wordBreak: "break-word" }} > NFT Bidding has been opened, you will be redirected shortly </p>,
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
                        history.push("/marketplace");
                      }, 3000);
                    })
                    .catch((err) => {
                      setOpenBid(false)
                      // console.log("SellNftMarket" + err?.message);
                      setBidInProgress(false);
                    });
                });
              })
              .catch((err) => {
                setOpenBid(false)
                // console.log("OpenBid" + err?.message);
                setBidInProgress(false);
              });
          })
          .catch((err) => {
            setOpenBid(false)
            toast.error(
              `Transaction Rejected`,
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
            setBidInProgress(false);
          });
      })
      .catch((err) => {
        // console.log("GetMarketNftAddress" + err?.message);
        setBidInProgress(false);
      });
  };
  useEffect(() => {

    if (Makeofferinput) {
      if (Makeofferinput > 0) {

        setnegetive1(false)
        setnegetive(false)
        if (Makeofferinput > WBNBBalance) {
          setlower(true);
          setmaxbalance(false);
          setnegetive(false);
          setminbalance(false);

        }
        else if (Makeofferinput > myData?.bidInitialMaximumAmount) {
          setlower(false);
          setmaxbalance(true);
          setnegetive(false);
          setminbalance(false);
        }
        else if (Makeofferinput < myData?.bidInitialMinimumAmount) {
          setlower(false);
          setmaxbalance(true);
          setnegetive(false);
          setminbalance(false);
        }
        else {
          setlower(false);
          setmaxbalance(false);
          setnegetive(false);
          setminbalance(false);

          setmakeofferbutton(true)
        }
      }
      else {
        setmakeofferbutton(false)

        setnegetive(false)
        setnegetive1(true)
      }
    }
    else {
      setmakeofferbutton(false)

      setnegetive1(false)
      setlower(false);
      setmaxbalance(false);
      setnegetive(false);
      setminbalance(false);

    }

  }, [Makeofferinput])


  const cancelListing = async () => {
    setCancelLoading(true)
    await http
      .get(httpUrl + "/api/v1/Nft/GetMarketNftAddress")
      .then(async (res) => {
        const contractPayload = {
          contractAddress: res.data.data,
          nftContractId: myData?.contractAddress,
          tokenId: myData?.nftTokenId,
        };
        dispatch(cancelNft(contractPayload))
          .then(async (approvedHash) => {
            const hashPayload = {
              nftId: myData?.id,
              cancelTransactionHash: approvedHash.hash
            }
            delay(8000).then(async () => {
              await http
                .post(httpUrl + "/api/v1/Nft/NftCancelStatus", hashPayload)
                .then(async (res) => {
                  // console.log("back to hold", res);
                  toast.success(
                    <p style={{ wordBreak: "break-word" }} >NFT has been unlisted from marketplace</p>,
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
                  setCancelLoading(false)
                  setTimeout(() => {
                    history.push("/myprofile");
                  }, 3000);
                })
            })
          }).catch(() => {
            toast.error(
              `Transaction Rejected`,
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
            setCancelLoading(false)
          })
      })
  };



  const expiryDateFunc = (date) => {
    let dateNow = new Date();
    dateNow = moment(dateNow).unix();
    let dateEntered = moment(date).unix();
    if (dateEntered <= dateNow) {
      // console.log("errer");
      setExpiryError(true);
    } else {
      setExpiryError(false);
      // console.log(date);
      setExpiryDate(date);
    }
  };
  const startDateFunc = (date) => {
    let dateNow = new Date();
    dateNow = moment(dateNow).unix();
    let dateEntered = moment(date).unix();
    if (dateEntered < dateNow) {

      setStartDate(date);
      console.log("errer");
      setBidError(true);
    } else {
      setBidError(false);
      console.log(date);
      setStartDate(date);
    }

    if (dateEntered > endDate ) {
      console.log("errer");
      setBidError1(true);
    } else {
      setBidError1(false);
      console.log(date);
    }
  };

  const endDateFunc = (date) => {
    let dateNow = new Date();
    dateNow = moment(dateNow).unix();
    let dateEntered = moment(date).unix();
    if (dateEntered <= startDate) {
      console.log("errer");
      setBidError1(true);

      setEndDate(date);
    } else {
      setBidError1(false);
      console.log(date);
      setEndDate(date);
    }
  };

  const switchStatus = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const postBidding = async () => {
  // alert(Makeofferinput)

    setIsOfferInProgress(true);

    if (inputAmount == undefined) {
      setIsOfferInProgress(false);
      return;
    }

    const amount = Web3.utils.fromWei(WalletBalance.toString(), "ether");
    setBalance(amount);

    await http
      .get(httpUrl + "/api/v1/Nft/GetWBNBAddress")
      .then(async (response) => {
        // console.log("WBNB address", response);
        await http
          .get(httpUrl + `/api/v1/Nft/GetMarketNftAddress`)
          .then(async (res) => {
            // console.log("marketplacecontractaddress", res.data);
            const contractPayload = {
              marketPlaceContract: res.data.data,
              ownerAddress: myData?.ownerAddress,
              contractAddress: response?.data?.data,
              id: myData?.nftTokenId,
              price: Makeofferinput,
            };
            // console.log(contractPayload);
            setBidtrigger(false);
            dispatch(approveNft(contractPayload)).then((res) => {
              toast.success(`Bidding is in process!`, {
                position: "top-right",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              delay(15000).then(async () => {
                // console.log("hashhhdqdidnqiudnqwidnw", res);
                biddingPosting(res.hash)

              });
            }).catch(() => {
              // console.log("Rejected")
              setShow(false);
              toast.error(`Transaction rejected`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              setIsOfferInProgress(false);
            });
          });
      });
  };

  const biddingPosting = async (hash) => {
    let params = window.location.pathname;
    let expp = moment(expiryDate).unix()
    let current = moment(expiryDate).unix()
    let diff = expp - current
    let duration = moment.duration(diff * 1000, "milliseconds");

    const payload = {
      nftId: NFTID,
      price: Makeofferinput,
      bidApprovalHash: hash,
      expiryDate: expiryDate
    };
    // console.log("payload bid", payload);
    await http
      .post(httpUrl + "/api/v1/Nft/AddNftBid", payload)
      .then(async (res) => {
        toast.success(`Bid has been added!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.log("ADDED BID", res);
        setIsOfferInProgress(false);
        getBiddings(payload)
      })
      .catch((error) => {

        setIsOfferInProgress(false);
      });
  }

  const getBiddings = async (payload) => {
    await http
      .get(
        httpUrl +
        `/api/v1/Nft/GetNftBids?NftId=${payload.nftId}`
      )
      .then(async (res) => {
        if (!res.data.data || res.data.data === null) {
          setEmptyBids(true);
        }
        setEmptyBids(false);
        setBiddings(res.data.data);
        setIsLoading(false);
        setIsBiddingLoading(false);
        setShow(false);
        setBidtrigger(true);
      }).catch(() => {
        //    getBiddings(payload)
      });
  }

  const buyNft = async () => {
    if (!isConnected || isConnected == undefined) {
      return history.push("/connectwallet");
    } else {
      setBidInProgress(true);
      // console.log("in");
      await http
        .get(httpUrl + `/api/v1/Nft/GetMarketNftAddress`)
        .then(async (res) => {
          const payload = {
            contractAddress: res.data.data,
            nftContractId: myData?.contractAddress,
            tokenId: myData?.nftTokenId,
            price: myData?.sellPrice,
          };
          // console.log("object", payload);
          dispatch(buyNftMarket(payload))
            .then((res) => {
              toast.success
                (<p style={{ wordBreak: "break-word" }} >NFT purchasing in process. Please wait.</p>, {
                  position: "top-right",
                  autoClose: 15000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              delay(22000).then(async () => {
                // console.log("bought nft", res);
                toast.success(`NFT bought!`, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                // console.log("hurrayyyyyyy");
                const payload1 = {
                  address: "",
                  transactionHash: res.hash,
                  nftId: myData?.id,
                };
                // console.log("payload buy nft", payload1);
                buyNftMarketFunc(payload1)

              });
            })
            .catch((err) => {
              toast.error(`Transaction rejected`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              setBidInProgress(false);
            });
        });
    }
  };

  const collectionimage = async (id) => {
    await http
      .get(httpUrl + "/api/v1/Nft/GetNftCollectionByIdWithOutAccount?CollectionId=" + id)
      .then(async (response) => {
        // console.log("COLLECTION DATA ",response?.data.data.logoImage)
        setCollectionLogoImage(response?.data.data.logoImage)
      })
      .catch((err) => {
      });
  }

  const buyNftMarketFunc = async (payload) => {
    await http
      .post(httpUrl + "/api/v1/Nft/BuyNftMarket", payload)
      .then(async (response) => {
        setBidInProgress(false);
        setTimeout(() => {
          history.push("/myprofile");
        }, 1000);
      })
      .catch((err) => {
        //   buyNftMarketFunc(payload)

      });
  }

  const addToFavourite = async (nftID, OwnerAddress) => {
    // console.log("user token ", Token)
    await axios
      .post(
        httpUrl + "/api/v1/Nft/AddFavouriteNft",
        {
          nftId: nftID,
          nftAddress: OwnerAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then(async (resp) => {
        if (resp?.data?.isSuccess === true) {
          if (resp?.data.message == "Data successfully added") {
            toast.success("Removed from favourite", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          else {
            toast.success("Added to favourite", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

          }
          await getMarketByid()
          await dispatch(GetFavouriteNftAction());
        } else if (resp?.data?.isSuccess === false) {
          toast.error(`NFT Already Liked`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        // console.log(error);
        swal({
          icon: "error",
          title: error?.data?.message,
        });
      });
  };

  const modalOpen = () => {
    setModalStatus(true);
  };

  const removeFromLike = (id, owner) => {
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
      "nftId": id,
      "nftAddress": owner
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
        // likeAndDisLikeCallback()
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


  const addToLike = (id, owner) => {

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
        "nftId": id,
        "nftAddress": owner
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
        // likeAndDisLikeCallback()
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
    <div>
      <GlobalStyles />
      {(loader && myDataLoader) ? (
        <>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div className="col-sm-12 d-flex justify-content-center margin-top-150">
            <RingLoader color="orange" size="60" />
          </div>
        </>
      ) : (
        <>
          <section className="container user-nft-head">
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
            <div className="row  pt-md-4">
              <div className="col-md-12">

              </div>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <h1>{myData?.name}</h1>
                <ul className="share-info-list">
                  <li>Share</li>
                  <li> <a> <FacebookShareButton
                    url={window.location.href}
                    quote={"Ckeck out my NFT"}
                    hashtag={"#NFT"}
                  >
                    <i className="fa fa-facebook"></i></FacebookShareButton> </a></li>
                  <li> <a> <TwitterShareButton
                    url={window.location.href}
                    quote={"Ckeck out my NFT"}
                    hashtag={"#NFT #MetaMask"}
                  >
                    <i className="fa fa-twitter"></i></TwitterShareButton> </a></li>
                  <li title="Refresh" onClick={() => { window.location.reload(); }}>
                    <a href="#"><i class="fa fa-refresh"></i></a>
                  </li>
                  <li>
                    <a href="#" onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied successfully", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                      });
                    }}>
                      <i class="fa fa-link"></i>
                    </a>
                  </li>
                  {myData?.externalLink && (
                    <li onClick={() => { window.open(myData?.externalLink); }} title="Open NFT" >
                      <a href="#">
                        <i class="fa fa-external-link"></i>
                      </a>
                    </li>
                  )}
                </ul>
                <div className="spacer-single"></div>
              </div>
              <div className="col-lg-5 col-md-12 col-sm-12">
                <div className="my-profile-Img-pnl full-div" style={{ background: `url(${httpUrl + "/" + myData?.image.replaceAll("\\", "/")}) no-repeat`, }}>

                  {
                    myData?.image?.split(".")[1] === 'mp4' ? <video
                    
                    playsinline={true}
                      controls={true}
                      src={`${httpUrl}/${myData?.image}`} width="100%" height="100%" id="get_file_2" className="lazy nft__item_preview" alt="NFT.png" autoPlay={true} loop={true} />
                      : <img src={`${httpUrl}/${myData?.image}`} className="img-fluid img-rounded mb-sm-30" alt="NFT.png" />

                  }

                  {/* <span className="heart-span hanging">

                    {favnft? 
                       <img
                        src={heart} style={{cursor:"pointer"}} onClick={() => {
                          buttonclicked?<></>:removeFromLike(myData?.id, myData?.ownerAddress);
                         }} /> 
                        :
                       <img
                        src={heartBlack} style={{ width: "15px",cursor:"pointer" }} onClick={() => {
                          buttonclicked?<></>: addToLike(myData?.id, myData?.ownerAddress);
                        }} />
                    }

                    {
                     countoffav  
                    }
                    </span> */}

                  {/* <span className="heart-span1 hanging"  style={{cursor:"pointer",color:"orange",fontSize:'15px'}}  onClick={() =>
                    history.push(
                        `/nftsbycollections/${myData?.collectionId}`
                    )
                }>
                       {myData?.collectionName}                    </span> */}

                </div>
                <div className="spacer-single"></div>

                {
                  myData?.isBidOpen == true ?

                    <div className="time-pnl">
                      {

                        days == 0 && hours == 0 && minutes == 0 && seconds == 0 ?

                          <h6>Auction Ended </h6>
                          :
                          <>
                            <h6>Auction Ends In</h6>
                            <ul className="timer">
                              <>

                                <li>
                                  <img src={clockicon} />
                                </li>
                                <li>
                                  <p>{days ? days : days === 0 ? 0 : <RingLoader color="orange" size="20" width="10" />}</p>
                                  {/* <span>Days</span> */}
                                </li>
                                <li>
                                  <p>:</p>
                                  {/* <span></span> */}
                                </li>
                                <li>
                                  <p>{hours ? hours : hours === 0 ? 0 : <RingLoader color="orange" size="20" width="10" />}</p>
                                  {/* <span>Hours</span> */}
                                </li>
                                <li>
                                  <p>:</p>
                                  {/* <span></span> */}
                                </li>
                                <li>
                                  <p>{minutes ? minutes : minutes === 0 ? 0 : <RingLoader color="orange" size="20" width="10" />}</p>
                                  {/* <span>Min</span> */}
                                </li>
                                <li>
                                  <p>:</p>
                                  {/* <span></span> */}
                                </li>
                                <li>
                                  <p>{seconds ? seconds : seconds === 0 ? 0 : <RingLoader color="orange" size="20" width="10" />}</p>
                                  {/* <span>Sec</span> */}
                                </li>

                              </>

                            </ul>
                          </>
                      }
                    </div>
                    : <></>}


              </div>
              <div className="col-lg-7 col-md-12 col-sm-12">
                <div className="item_info">
                  <div className="item_creator">
                    <div className="pic-post">
                      <div className="newimagehover" style={{ cursor: "pointer" }} onClick={() => history.push(localStorage.getItem("userblock") === "true" && myData?.ownerAddress === WalletAddress ? '/connectwallet' : myData?.creatorAddress === WalletAddress ? `/myprofile` : `/profile/${myData?.creatorAddress} `)}       >
                        <div className="creator_list_pp">
                          <Link
                            style={{ textDecoration: "none" }}
                          >
                            <img
                              src={myData?.creatorImage ? `${httpUrl}/${myData?.creatorImage}` : defaultImg}
                              // src="./images/author/author-1.jpg"
                              alt="Author.png"
                              className="author_sell_Nft_image lazy"
                              style={{ width: 50, objectFit: "cover", height: 50, borderRadius: "100%", }}
                            />
                            {myData?.isVerfiedCreator ? <i className="fa fa-check" style={{
                              right: '7px',
                              bottom: '4px'
                            }} ></i> : <></>}

                          </Link>
                        </div>
                        <div className="creator_list_info">
                          <h6>Creator</h6>
                          <span>
                            {myData?.creatorName
                              ? myData?.creatorName
                              : "Unnamed"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pic-post">

                      <div className="newimagehover" style={{ cursor: "pointer" }} onClick={() => history.push(`/nftsbycollections/${myData?.collectionId}`)}>
                        <div className="creator_list_pp">
                          <Link
                            style={{ textDecoration: "none" }}
                          >
                            <img
                              src={CollectionLogoImage ? `${httpUrl}/${CollectionLogoImage}` : defaultImg}
                              alt="Author.png"
                              className="author_sell_Nft_image lazy"
                              style={{ width: 50, objectFit: "cover", height: 50, borderRadius: "100%", }}
                            />
                          </Link>
                        </div>
                        <div className="creator_list_info">
                          <h6>Collection</h6>
                          <span>
                            {myData?.collectionName
                              ? myData?.collectionName
                              : "Unnamed"}
                          </span>
                        </div>
                      </div></div>
                    <div className="pic-post">
                      <div className="newimagehover" style={{ cursor: "pointer" }} onClick={() => { history.push(localStorage.getItem("userblock") === "true" && myData?.ownerAddress === WalletAddress ? '/connectwallet' : myData?.ownerAddress === WalletAddress ? `/myprofile` : `/profile/${myData?.ownerAddress}`) }}      >
                        <div className="creator_list_pp ">
                          <Link
                            style={{ textDecoration: "none" }}
                          >
                            <img
                              src={myData?.ownerImage ? `${httpUrl}/${myData?.ownerImage}` : defaultImg}
                              alt="Author.png"
                              className="author_sell_Nft_image lazy"
                              style={{ width: 50, objectFit: "cover", height: 50, borderRadius: "100%", }}
                            />
                            {myData?.isVerfiedAccount ? <i className="fa fa-check" style={{
                              right: '7px',
                              bottom: '4px'
                            }} ></i> : <></>}
                          </Link>
                        </div>
                        <div className="creator_list_info right">
                          <h6>Owner</h6>
                          <span>
                            {myData?.ownerName
                              ? myData?.ownerName
                              : "Unnamed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="coin-bid-list">
                  </ul>
                </div>
                <div className="row">
                </div>
                {localStorage.getItem("userblock") === "true" ? <p style={{ color: "red" }}> Blocked user can only view marketplace and Blog </p> : <>
                  <div className="full-div">
                    <Modal
                      centered show={openBid} onHide={handleClose1}>
                      <Modal.Header>
                        <Modal.Title style={{ color: "black" }}>Open bid</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Price
                        <InputGroup className="mb-3">
                          <InputGroup.Text style={{ width: '60px', height: '38px', marginTop: '0px' }}>Min</InputGroup.Text>


                          < FormControl placeholder="Amount" type="number" onChange={(e) => {


                            if (e.target.value && e.target.value > 100000000) {
                                    setInputAmount(toInteger(e.target.value / 10))

                            }
                            else {
                              let numa = e.target.value?.toString().split('.')
                              if (numa[1]?.length > 4) {
                                setInputAmount(ParseFloat(e.target.value, 4))
                              }
                              else {
                                let numa = e.target.value?.toString().split('.')
                                if (numa[1]?.length > 0)
                                setInputAmount(parseFloat(e.target.value))               
                                 else
                                setInputAmount ( toInteger( e.target.value)  )
                              }
                            }
                          }

                          } value={inputAmount} aria-label="Amount (to the nearest dollar)" />
                          <InputGroup.Text style={{ width: '60px', height: '38px', marginTop: '0px' }}>Max</InputGroup.Text>
                          <FormControl placeholder="Amount" type="number" onChange={(e) => {
                            {


                              if (e.target.value && e.target.value > 100000000) {
                                setMaxInputAmount(toInteger(e.target.value / 10))

                              }
                              else {
                                let numa = e.target.value?.toString().split('.')
                                if (numa[1]?.length > 4) {
                                  setMaxInputAmount(ParseFloat(e.target.value, 4))

                                }
                                else {
                                  let numa = e.target.value?.toString().split('.')
                                  if (numa[1]?.length > 0)
                                  setMaxInputAmount(parseFloat(e.target.value))                
                                   else
                                   setMaxInputAmount ( toInteger( e.target.value)  )
                                }
                         
                              }
                            }
                          }
                          } value={maxInputAmount} aria-label="Amount (to the nearest dollar)" />     </InputGroup>
                        <div className='bidDates'>
                          <div className='bidDat'>
                            <h6 style={{ color: '#000' }}>Start Date</h6>
                            <DatePicker className='dateInput' minDate={minndate} dateFormat="dd MMMM yyyy " selected={startDate} onChange={(date) => {    startDateFunc(date) }} format='yyyy-MM-dd' />
                        </div>
                        <div className='bidDat'>
                          <h6 style={{ color: '#000' }}>End Date</h6>
                          <DatePicker className='dateInput' minDate={startmax} dateFormat="dd MMMM yyyy " selected={endDate} onChange={(date) => endDateFunc(date)} />
                          </div>
                    
                          {bidError1 && (
                          <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'right', width: '50%' }}>Start Date Cannot be greater than expiryDate </span>
                        )}
                      </div>
                      {amountCheck && (
                        <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'left', width: '50%' }}>Min value must be lower than available balance</span>
                      )}

                      {amountCheck1 && (
                        <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'left', width: '50%' }}>Max value must be greater than Min value</span>
                      )}
                      {/* {amountCheck2 && (
                        <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'left', width: '50%' }}>Max value must be lower than available balance</span>
                      )} */}

                      {amountCheck4 && (
                        <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'left', width: '50%' }}>Min Values cannot be negative</span>
                      )}
                      {amountcheck6 && (
                        <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'left', width: '50%' }}>Max Values cannot be negative</span>
                      )}
                      {equalcheck && (
                        <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'left', width: '50%' }} > Values cannot be equal  </span>
                      )}
                      </Modal.Body>
                      <Modal.Body className="d-flex justify-content-center">

                        <Form>
                          {["checkbox"].map((type) => (
                            <div key={`inline-${type}`} className="mb-0">
                              <Form.Check
                                inline
                                label="By checking this, I agree Fine Original Terms of Service"
                                name="group1"
                                style={{ marginBottom: '0px' }}
                                type={type}
                                checked={isSwitchOn}
                                id={`inline-${type}-1`}

                                onChange={() => {
                                  switchStatus();
                                }}
                              />
                            </div>
                          ))}
                        </Form>
                      </Modal.Body>

                      <Modal.Footer>
                        {
                          !bidInProgress?
                          <button className="reg-btn-green2" onClick={handleClose1}>
                          Close
                        </button>
                        :
                        <button className="reg-btn-green2">
                        Close
                      </button>
                     
                       }
                    

                        { !bidInProgress ? (
                          <>
                            {amountCheck3 && isSwitchOn  ? (
                              <button
                                // variant="primary"
                                className="reg-btn-green1"
                                onClick={openBidding}
                              >
                                Open bid
                              </button>
                            ) : (
                              <button
                                style={{ opacity: "0.6" }}
                                className="reg-btn-green1"
                                disabled={true}
                              >
                                Open bid
                              </button>
                            )}

                          </>
                        ) : (
                          <button className="reg-btn-green1" disabled>
                            <PulseLoader color="white" size="11" />
                          </button>
                        )}
                      </Modal.Footer>
                    </Modal>
                    {/* myData?.processing && myData?.processing!="Done" */}
                    {
                      myData?.processing && myData?.processing != "Done" ? <p style={{ color: "orange", fontSize: "25px" }}> NFT is in process </p>
                        :
                        <>

                          {isConnected ? (
                            <>
                              {(myData?.ownerAddress != WalletAddress && !myData?.isBidOpen && myData?.staus !== "Hold") && (
                                <>
                                  {!bidInProgress ? (
                                    <button
                                      onClick={buyNft}
                                      id="btnBuy"
                                      type="submit"
                                      class="reg-btn-green"
                                    >
                                      BUY
                                    </button>
                                  ) : (
                                    <button
                                      id="btnBuy"
                                      class="reg-btn-green"
                                      disabled
                                    >
                                      <PulseLoader color="white" size="15" />
                                    </button>
                                  )}
                                </>
                              )}

                            </>
                          ) : (
                            <></>
                          )}
                          {isConnected ? (
                            <>
                              {(myData?.ownerAddress != WalletAddress && myData?.isBidOpen) && (



                                <button
                                  onClick={handleShow}
                                  id="btnBuy"
                                  type="submit"
                                  class="reg-btn-green"
                                >
                                  <i className="fa fa-shopping-cart"></i> Place Bid
                                </button>

                              )}
                            </>
                          ) : (
                            <>
                              <p style={{ color: "orange" }}> Please connect to Wallet </p>
                            </>
                          )}
                        </>
                    }
                  </div> </>
                }
                <div className="description-details-pnl full-div">
                  <div style={{ position: 'relative', paddingBottom: '35px' }} className="description-details-head full-div">
                    <div className="description-details-text w-100">
                      {myData?.isBidOpen && (
                        <>
                          <span>
                            Min price --{" "}
                            {myData?.bidInitialMinimumAmount
                              ? myData?.bidInitialMinimumAmount
                              : "Min price not set."}
                          </span>
                          <span style={{ marginLeft: "10px" }}>
                            Max price --{" "}
                            {myData?.bidInitialMaximumAmount
                              ? myData?.bidInitialMaximumAmount
                              : "Max price not set."}
                          </span>
                        </>
                      )}

                      <p>
                        <i title="BNB" class="fa fa-coins"></i>{" "}
                        {myData?.sellPrice ? myData?.sellPrice : myData?.buyPrice}{" "}
                        <span>
                          [${myData?.sellPrice ? myData?.sellPriceRateInUSD : myData?.buyPriceRateInUSD}]
                        </span>
                      </p>
                    </div>
                    {
                      myData?.processing && myData?.processing != "Done" ? <p style={{ color: "orange" }}> </p> :
                        <>
                          {
                            localStorage.getItem("userblock") === "true" ? <></> :

                              <div className="mobile-center">                    {((myData?.staus === 'ReadyForSell' || myData?.isBidOpen === true) && (myData?.ownerAddress === WalletAddress)) && (
                                cancelLoading ? (
                                  <button
                                    disabled
                                    id="btnBuy"
                                    type="submit"
                                    class="reg-btn-green"
                                  >
                                    <PulseLoader color="white" size="11" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => cancelListing()}
                                    id="btnBuy"
                                    type="submit"
                                    class="reg-btn-green"
                                  >
                                    Cancel listing
                                  </button>
                                )
                              )}
                                {((myData?.staus != "ReadyForSell" &&
                                  myData?.isMinted === true) && (myData?.ownerAddress === WalletAddress)) && (
                                    <>
                                      <button
                                        onClick={() => setFilterTrigger(true)}
                                        id="btnBuy"
                                        type="submit"
                                        class="reg-btn-green"
                                      >
                                        Sell NFT
                                      </button>
                                    </>
                                  )}


                                {myData?.ownerAddress === WalletAddress && !myData?.isBidOpen &&
                                  myData?.freezeData &&
                                  myData?.staus != "ReadyForSell" && (
                                    <button
                                      onClick={() => setOpenBid(true)}
                                      id="btnBuy"
                                      type="submit"
                                      class="reg-btn-green"
                                    >
                                      Open bid
                                    </button>
                                  )}



                                {(!myData?.freezeData) && (myData?.ownerAddress === WalletAddress) && (
                                  <button
                                    onClick={() =>
                                      history.push(
                                        `/createnft/${myData?.ownerAddress}/${myData?.id}/${myData?.accountId}`
                                      )
                                    }
                                    id="btnBuy"
                                    type="submit"
                                    class="reg-btn-green"
                                  >
                                    Update NFT
                                  </button>
                                )}


                              </div>
                          }
                        </>
                    }
                  </div>

                </div>


                <section className="container no-top">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="items_filter">
                        <ul className="de_nav de_nav left-align">
                          <li id="Mainbtn" className="active">
                            <span onClick={handleBtnClick}>Details</span>
                          </li>
                          <li id="Mainbtn2" className="">
                            <span onClick={handleBtnClick2}>Additional Info</span>
                          </li>
                          <li id="Mainbtn3" className="">
                            <span onClick={handleBtnClick3}>Description</span>
                          </li>
                          <li id="Mainbtn4" className="">
                            <span onClick={handleBtnClick4}>Properties</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {openMenu && (

                    <div id="zero1" className="onStep fadeIn">






                      <ul className="user-visitor-list">
                        {emptyBids ? (
                          <>No bids added so far</>
                        ) : (
                          <>
                            {biddings?.map((nft, index) => (
                              <>
                                <li>
                                  <div>
                                    <div className="img-pnl">
                                      <div className="pt-2"></div>
                                      <img

                                        src={nft.accountViewModel.profileImage ? `${httpUrl}/${nft.accountViewModel.profileImage}` : defaultImg}

                                        alt="Author.png"
                                        className="author_sell_Nft_image lazy"
                                        style={{ width: 50, objectFit: "cover", height: 50, borderRadius: "100%", }}
                                      />
                                    </div>
                                    <div className="txt-pnl">
                                      <h5>{nft.accountViewModel.username ? nft.accountViewModel.username : 'Unnamed'}</h5>
                                      <p style={{ marginTop: '4px' }}>
                                        <span style={{ marginLeft: "0px" }} >{nft.expiryDate.split("T")[0]}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="price-eth">
                                    <p>
                                      <img src={cryptocurrency} alt="Eth" />
                                      <b>{nft.price + " " + " BNB"}</b>
                                      ~${(nft.price * Rateinusd)
                                        .toString()
                                        .slice(0, 6)}
                                    </p>
                                  </div>
                                  {myData?.ownerAddress === WalletAddress && (
                                    <div className="col-md-3 col-lg-3 ">
                                      {
                                        IsAcceptBidisinprocess ? (
                                          <button
                                            onClick={() =>
                                              acceptBidOffer(
                                                nft.id,
                                                nft.price,
                                                nft.accountViewModel.address,
                                                nft.nftResponseModel.contractAddress
                                              )
                                            }
                                            id="btnBuy1"
                                            type="submit"
                                            class="reg-btn-green"
                                          >
                                            Accept
                                          </button>
                                        ) : (
                                          <button id="btnBuy1"
                                            type="submit"
                                            class="reg-btn-green" disabled>
                                            <PulseLoader color="white" size="11" />
                                          </button>
                                        )
                                      }
                                    </div>
                                  )}
                                </li>
                              </>
                            ))}

                          </>
                        )}


                      </ul>
                    </div>
                  )}
                  {openMenu1 && (
                    <div id="zero2" className="onStep fadeIn">
                      <ul className="user-visitor-list">
                        <li>
                          <div>
                            <div className="img-pnl">
                              <img src={`${httpUrl}/${myData?.ownerImage}`} alt="Eth" />
                            </div>
                            <div className="txt-pnl">
                              <h5>Richerd Willson SR</h5>
                              <p className="time-p">
                                45 mins ago
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div>
                            <div className="img-pnl">
                              <img src={`${httpUrl}/${myData?.ownerImage}`} alt="Eth" />
                            </div>
                            <div className="txt-pnl">
                              <h5>Richerd Willson SR</h5>
                              <p className="time-p">
                                45 mins ago
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div>
                            <div className="img-pnl">
                              <img src={`${httpUrl}/${myData?.ownerImage}`} alt="Eth" />
                            </div>
                            <div className="txt-pnl">
                              <h5>Richerd Willson SR</h5>
                              <p className="time-p">
                                45 mins ago
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                  {openMenu2 && (
                    <div id="zero3" className="onStep fadeIn">
                      <p className="clrd" style={{ cursor: "pointer" }}>
                        <b style={{ cursor: "initial" }}>Contract Address :</b>
                        <a target="_blank" href={"https://bscscan.com/address/" + myData?.contractAddress} style={{ color: "orange" }}>
                          {myData?.contractAddress}
                        </a>
                      </p>
                      <p>
                        <b>Token ID : </b>
                        {myData?.nftTokenId}
                      </p>
                      <p>
                        <b>Metadata :</b>
                        {myData?.isMinted ? 'Not editable' : 'Editable'}
                      </p>
                      <p>
                        <b>File Size : </b>
                        2048 x 2048 px.IMAGE(1.27MB)
                      </p>
                    </div>
                  )}
                  {openMenu3 && (
                    <div id="zero3" className="onStep fadeIn">
                      <p className="clrd" style={{wordBreak:"break-all"  }}>
                        {myData?.description === "null" || myData?.description === null ? "No Description added" : myData?.description}
                      </p>
                    </div>
                  )}
                  {openMenu4 && (
                    <div className="time-pnl">
                      <Row>
                        {
                          myData?.nftProperties.length > 0 ?
                            <>

                              {
                                myData?.nftProperties.map((data, index) =>
                                  <Col
                                    xs={6}
                                    sm={4}
                                    md={3}
                                    lg={3}
                                    className={
                                      "d-flex justify-content-center flex-column align-items-center mt-3 word-break-breakall"
                                    }
                                    key={index}
                                  >
                                    <div

                                      className="w-100"
                                      style={{
                                        backgroundColor:
                                          "rgba(21, 178, 229, 0.06)",
                                        borderRadius: 6,
                                        border: "1px solid orange",
                                        padding: "5px 5px",
                                        textAlign: "center",
                                        wordBreak: "break",
                                        justifyContent: "center"
                                      }}
                                    >
                                      <p style={{ textAlign: "center" }}>{data.name}</p>
                                      <p style={{ textAlign: "center" }}>{data.rarity + "%"} </p>
                                      <h4 className="text-dark">
                                        <strong>{data.type} </strong>
                                      </h4>
                                    </div>
                                  </Col>
                                )
                              }
                            </> :
                            <> No Properties to show </>
                        }
                      </Row>
                    </div>
                  )}
                </section>
                <Modal centered show={isToShowModal} onHide={() => { history.push("/myprofile"); setIsToShowModal(false) }}>
                  <Modal.Header closeButton>
                    <Modal.Title>Not found</Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ color: "red", textAlign: "center" }}>
                    <img src={Error} style={{ width: "50px", height: "50px" }} />
                    <div className="pt-4" />
                    <div >
                      <p style={{ color: "red", textAlign: "center" }}>
                        NFT market not found
                      </p>
                    </div>
                  </Modal.Body>
                </Modal>
                <Modal className="sellingamount-modal" centered show={filterTrigger} onHide={sellingModal}>
                  <Modal.Header>
                    <Modal.Title style={{ color: "#000000" }}>Selling Amount</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {" "}
                    <div className="row">
                      <div className="col-md-12">
                        <form
                          name="contactForm"
                          id="contact_form"
                          className="form-border"
                        >
                          <div className="row">
                            <div className="col-md-12">
                              <div className="flex-div">
                                <label>Selling Amount:</label>
                                <span style={{ marginTop: "10px" }}>
                                  [${
                                    NewPrice ? (NewPrice * Rateinusd)
                                      .toString()
                                      .slice(0, 9) : (NewPrice * Rateinusd)
                                        .toString()
                                        .slice(0, 9)
                                  }]</span>
                              </div>

                              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

                                < FormControl placeholder="Amount" type="number" onChange={(e) => {


                                  if (e.target.value && e.target.value > 100000000) {
                                    SetNewPrice(toInteger(e.target.value / 10))
                                    // value=
                                  }
                                  else {
                                    let numa = e.target.value?.toString().split('.')
                                    if (numa[1]?.length > 4) {
                                      SetNewPrice(ParseFloat(e.target.value, 4))
                                      //  value=
                                    }
                                    else {
                                      SetNewPrice(e.target.value)
                                    }
                                  }
                                }

                                } value={NewPrice} aria-label="Amount (to the nearest dollar)" />

                              </div>
                              {maxpriceofsell ? <p style={{ color: "red" }}>Price must be greater than 0.00000001</p> : sellnftpriceerror ? <p style={{ color: "red" }}>Price Cannot be negetive</p> : ""}
                              {maxpriceofsell ? <p style={{ color: "red" }}><></></p> : sellnftpriceerror1 ? <p style={{ color: "red" }}>Price Cannot be zero</p> : ""}

                            </div>
                          </div>

                          <div className="col-md-12 p-0">
                            <div id="submit" className="pull-left">
                              {checksaleminus1 ?
                                <button className="btn-main" style={{ opacity: "0.6" }} disabled >
                                  Sell NFT                            </button> :

                                <button className="btn-main" onClick={sellingHandler} >
                                  {
                                    sellingIsLoading ?
                                      <PulseLoader color="white" size="11" />
                                      :
                                      "Sell NFT"
                                  }
                                </button>
                              }
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>

                <Modal centered show={show} onHide={handleClose}>
                  <Modal.Header>
                    <Modal.Title style={{ color: "black" }}>
                      Make an offer
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Price
                    <InputGroup className="mb-3">
                      <InputGroup.Text className="h-100">
                        {" "}BNB
                      </InputGroup.Text>
                      <FormControl
                  placeholder="Amount"
                  type="number"
                  value={Makeofferinput}
                  disabled={WBNBBalance <= myData?.bidInitialMinimumAmount ? true : ''}
                  onChange={(e) => {
                    if (e.target.value && e.target.value > 100000000) {
                      setMakeofferinput(toInteger(e.target.value / 10))
                      // value=
                    }
                    else {
                      let numa = e.target.value?.toString().split('.')
                      if (numa[1]?.length > 4) {
                        setMakeofferinput(ParseFloat(e.target.value, 4))
                        //  value=
                      }
                      else {
                        let numa = e.target.value?.toString().split('.')
                        if (numa[1]?.length > 0)
                        setMakeofferinput(parseFloat(e.target.value))               
                         else
                         setMakeofferinput ( toInteger( e.target.value)  )
                      }
                     
                    }
                  }
                  }
                  aria-label="Amount (to the nearest dollar)"
                />
                    </InputGroup>
                    <div className=''>
                      <h6 style={{ color: '#000' }}>Expiry date</h6>
                      <DatePicker minDate={minndate} selected={expiryDateplacebid} onChange={(date) => setexpiryDateplacebid(date)} />
             </div>
                    {
                myData?.bidInitialMinimumAmount > WBNBBalance ?
                  <span style={{ color: 'red', display: 'inline-block', wordBreak: "break-word", float: 'left', width: '55%' }}>Available balance is lower than the minimun bid</span>
                  : <></>
              }
              {lower && (
                <p style={{ color: "red", wordBreak: "break-word" }}>
                  Input value must be lower than available
                  balance
                </p>
              )}
              {maxbalance && (
                <p style={{ color: "red", wordBreak: "break-word" }}>
                  Input value must be lower or equal than maximum bid
                  price
                </p>
              )}
              {negetive && (
                <p style={{ color: "red", wordBreak: "break-word" }}>
                  Price Cannot be Negative
                </p>
              )}  {negetive1 && (
                <p style={{ color: "red", wordBreak: "break-word" }}>
                  Price Cannot be zero
                </p>
              )}
              {minbalance && (
                <p style={{ color: "red", wordBreak: "break-word" }}>
                  Input value must be greater from minimum bid price
                </p>
              )}
                  </Modal.Body>
                  <Modal.Body>
                    Min bidding price: {myData?.bidInitialMinimumAmount} WBNB
                  </Modal.Body>
                  <Modal.Body>
                    Max bidding price: {myData?.bidInitialMaximumAmount} WBNB
                  </Modal.Body>

                  <Modal.Body>
                    Available balance: {WBNBBalance}{" "} WBNB
                  </Modal.Body>

                  <Modal.Body className="d-flex justify-content-center w-30">
                    <Form>
                      {["checkbox"].map((type) => (
                        <div
                          key={`inline-${type}`}
                          className="mb-3"
                        >
                          <Form.Check
                            inline
                            label="By checking this, I agree Fine Original Terms of Service "
                            name="group1"
                            type={type}
                            id={`inline-${type}-1`}
                            checked={isSwitchOn}
                            onChange={() => {
                              switchStatus();
                            }}
                          />
                        </div>
                      ))}
                    </Form>
                  </Modal.Body>

                  <Modal.Footer>
                    {
                      !isOfferInProgress ?
                      <button
                      className="reg-btn-green2"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    :
                    <button
                    className="reg-btn-green2"
                  >
                    Close
                  </button>
                  
                    }


                    {expiryError ? (
                      <>
                        <button
                          className="reg-btn-green1"
                          disabled={true}
                          style={{ opacity: "0.6" }}
                        >
                          Make Offer
                        </button>
                      </>

                    ) : (
                      <>

{!isOfferInProgress ? (
                    <>
                      {makeofferbutton && isSwitchOn && expiryDateplacebid ? <button
                                className="reg-btn-green1"
                                onClick={postBidding}
                                disabled={!isSwitchOn}
                              >
                              Make Offer
                            </button> : (<button
                              className="reg-btn-green1"
                              disabled={true}
                              style={{ opacity: "0.6" }}
                            >
                              Make Offer
                            </button>)


                            }</>) : (
                          <button className="reg-btn-green1" disabled>
                            <PulseLoader color="white" size="11" />
                          </button>
                        )}
                      </>
                    )}

                  </Modal.Footer>
                </Modal>

                <Modal
                  centered
                  show={imageShow}
                  onHide={handleImageClose}
                >
                  <Modal.Header>
                    <Modal.Title style={{ color: "black" }}>
                      <img
                        src={`${httpUrl}/${myData?.image}`}
                        className="img-fluid img-rounded mb-sm-30"
                        alt="NFT.png"
                      />
                    </Modal.Title>
                  </Modal.Header>
                </Modal>
                <br></br>

              </div>
            </div>
            <div className="table-contaienr">
              <div className="table-contaienr-inner">
                <Table striped bordered hover variant="light">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Price</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  {
                    // "oldOwnerAccountId": 2,
                    // "oldOwnerAccountAddress": "0x2ED9946276c01F4E5E09C10a14d7F22F78d39f2a",
                    // "ownerAccountId": 2,
                    // "oldOwnerAccountAddress": "0x2ED9946276c01F4E5E09C10a14d7F22F78d39f2a",
                    // "nftPrice": 0.9,
                    // "nftHistoryType": "Mint",
                    // "createdAt": "2022-05-18T08:16:26.4029611"
                  }
                  <tbody>
                    {
                      history.length == 0 ? <tr >
                        <td>
                          No History to Show </td>  </tr> :

                        HistoryofNft?.map((value, index) => {
                          return (
                            <>
                              <tr>
                                <td>
                                  {
                                    value?.nftHistoryType
                                  }
                                </td>
                                <td>
                                  {
                                    value?.nftPrice + " BNB"
                                  }
                                </td>
                                <td onClick={() => { return history.push(value?.oldOwnerAccountAddress === WalletAddress ? `/myprofile` : `/profile/${myData?.creatorAddress}`) }} style={{ cursor: "pointer" }}      >
                                  {
                                    value?.oldOwnerAccountAddress
                                  }
                                </td>
                                <td onClick={() => { return history.push(value?.ownerAccountAddress === WalletAddress ? `/myprofile` : `/profile/${myData?.creatorAddress}`) }} style={{ cursor: "pointer" }}     >
                                  {
                                    value?.ownerAccountAddress
                                  }
                                </td>
                                <td>
                                  {
                                    value?.createdAt.split("T")[0]
                                  }{
                                    " "
                                  }
                                  {
                                    value?.createdAt.split("T")[1].slice(0, 8)
                                  }
                                </td>

                              </tr>
                            </>
                          );
                        })

                    }
                  </tbody>
                </Table>
              </div>
            </div>

            <section className="related-item-section">
              <div className="mt-5">
                <div className="row">
                  <div className="col-lg-6 col-xl-6 col-sm-6 col-sm-6 onStep css-keef6k">
                    <h3 class="style-brder">RELATED</h3>
                    <h2>Related Items</h2>
                  </div>
                  {/* <div className="col-lg-6 col-xl-6 col-sm-6 col-sm-6 text-right onStep css-keef6k">
                    {/* <a href="#" role="button" onClick={() => history.push('/marketplace')} className="viewall-btn">
                      {/* <span>View All{" "} </span> }
                    </a> 
                  </div> */}
                </div>

                <div className="spacer-40"></div>
                <div className="row">
                  {collectionLoading ? (
                    <>
                      <div className="col-sm-12 d-flex justify-content-center margin-top-150">
                        <RingLoader color="orange" size="60" />
                      </div>
                    </>
                  ) : (
                    <>

                      {collectionData?.slice(0, numItems).map((nft, index) => {
                        return (
                          <div
                            key={index}
                            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4"
                          >

                            <NftItem nft={nft} likeAndDisLikeCallback={apisCall} />

                          </div>
                        );
                      })}
                      {collectionData?.length > numItems &&
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

                </div>
              </div>
            </section>
          </section>
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

          <Footer />


        </>
      )}
    </div>
  );
};
export default UserNftDetails;

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

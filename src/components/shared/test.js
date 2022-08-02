import React, { useEffect, useState, useRef, useReducer } from "react";
import Footer from "../../../components/footer";
import { createGlobalStyle } from "styled-components";
import bannerimg from '../../../../assets/images/profile-banner.png';
import heartBlack from "../../../../assets/images/heart_black.png";
import { Link, useHistory, useParams, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import heart from "../../../../assets/images/heart-icon.png";
import rlc from "../../../../assets/images/RLF-icon.png";
import {
  Modal,
  Button,
  InputGroup,
  FormControl,
  Form,
  FormCheck,
  Dropdown,
  DropdownButton,
  Row,
  Col,
  OverlayTrigger,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { PulseLoader, BounceLoader } from "react-spinners";
import { toInteger } from "lodash";
import swal from "sweetalert";
import axios from "axios";
import DatePicker from "react-datepicker";
import BuyNftMarketAction from "../../../../Redux/Actions/NftActions/BuyNftMarketActions";
import {
  sendTransection,
  signMessage,
  approveNft,
  buyNftMarket,
  cancelNft,
  openForAuction,
  checkBalance1,
  approveContract,
  acceptBid
} from "../../../../metamask";
import Web3 from "web3";
import moment from "moment";
import GetFavouriteNftAction from "../../../../Redux/Actions/NftActions/GetFavouriteNftAction";
import RemoveFavouriteNftAction from "../../../../Redux/Actions/NftActions/RemoveFavouriteNftAction";
import defaultImg from "../../../../assets/images/default.png";
import http from "../../../../Redux/Api/http";

import CopyToClipboard from "react-copy-to-clipboard";
import API from "../../../../Redux/Api";
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

`;

const UserNftDetails = function () {
  const dispatch = useDispatch();
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
  const MyProfile = useSelector(
    (state) => state.MyProfile?.MyProfileResponse?.data
  );

  const [show, setShow] = useState(false);
  const [value, onChange] = useState(new Date());
  const searchRef = useRef();
  // const GetAllNftsByCollectionId = useSelector(
  //   (state) =>
  //     state.GetAllNftsByCollectionId?.GetAllNftsByCollectionIdResponse.data
  // );
  const [favouriteInProgress, setFavouriteInProgress] = useState(false);
  const [NewPrice, SetNewPrice] = useState();
  const [inputAmount, setInputAmount] = useState();
  const [maxInputAmount, setMaxInputAmount] = useState();
  const [nftId, setNftId] = useState();
  const [amountCheck, setAmounCheck] = useState(false);
  const [amountCheck1, setAmounCheck1] = useState(false);
  const [balance, setBalance] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [biddingLoading, setIsBiddingLoading] = useState(true);
  const [lastindex, setlastindex] = useState(0)
  const [modalStatus, setModalStatus] = useState(false);
  const [emptyBids, setEmptyBids] = useState(false);
  const [filterTrigger, setFilterTrigger] = useState(false);
  const [rating, setRating] = useState(0);
  const [biddings, setBiddings] = useState();
  const [myData, setMyData] = useState();
  const [filterData, setFilterData] = useState([]);
  const [sellnftpriceerror, setSellnftpriceerror] = useState(false);
  const [sellnftpriceerror1, setSellnftpriceerror1] = useState(false);
  const [maxpriceofsell, setmaxpriceofsell] = useState(false)
  const [amountCheck3, setAmounCheck3] = useState(false);
  const [amountcheck6, setAmounCheck6] = useState(false)
  const [amountCheck4, setAmounCheck4] = useState(false);
  const [countoffav, setcountoffav] = useState(0);
  const [buttonclicked, setbuttonclicked] = useState(false);
  const [filter, setfilter] = useState([]);
  const [allData, setAllData] = useState([]);
  const [bidTrigger, setBidtrigger] = useState(false);
  const [isInterval, setIsInterval] = useState(false);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [equalcheck, setequalcheck] = useState(false)
  const [checksaleminus, setchecksaleminus] = useState(false);

  const [checksaleminus1, setchecksaleminus1] = useState(true);
  const [paramsCheck, setParams] = useState();
  const [paramsLoading, setParamsLoading] = useState(true);
  const [imageShow, setImageShow] = useState(false);
  const [timer, setTimer] = useState(false);
  const [bidInProgress, setBidInProgress] = useState(false);
  const [isOfferInProgress, setIsOfferInProgress] = useState(false);

  const [favnft, setfavnft] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());

  const [expiryDateplacebid, setexpiryDateplacebid] = useState(new Date());
  const [minndate, setminndate] = useState(new Date());
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
  const [stakeLoading, setStakeLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [collectionData, setCollectionData] = useState();
  const [numItems, setNumItems] = useState(4)
  const [editmycomment, Seteditmycomment] = useState(false)
  const [editmycommentid, Seteditmycommentid] = useState(0)

  const [lower, setlower] = useState(false)
  const [maxbalance, setmaxbalance] = useState(false)
  const [negetive, setnegetive] = useState(false)

  const [negetive1, setnegetive1] = useState(false)
  const [minbalance, setminbalance] = useState(false)

  const [makeofferbutton, setmakeofferbutton] = useState(false)


  const [state, disableDispatch] = useReducer(reducer, initialState)
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
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


  const [details, setDetails] = React.useState(false);
  const [historymenu, setHistoryMenu] = React.useState(true);
  const [aboutmenu, setAbout] = React.useState(false);

  const [openMenu, setOpenMenu] = React.useState(true);

  const [openMenu3, setOpenMenu3] = React.useState(false);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const handleBtnClick = () => {
    setOpenMenu(true);
    setOpenMenu1(false);
    setOpenMenu3(false);
    setOpenMenu2(false);
    document?.getElementById("Mainbtn").classList.add("active");

    document?.getElementById("Mainbtn3").classList.remove("active");
    document?.getElementById("Mainbtn1").classList.remove("active");
    document?.getElementById("Mainbtn2").classList.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(true);
    setOpenMenu2(false);
    setOpenMenu(false);
    setOpenMenu3(false);
    document?.getElementById("Mainbtn3").classList.remove("active");

    document?.getElementById("Mainbtn1").classList.add("active");
    document?.getElementById("Mainbtn").classList.remove("active");
    document?.getElementById("Mainbtn2").classList.remove("active");
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(true);
    setOpenMenu(false);
    setOpenMenu3(false);
    setOpenMenu1(false);
    document?.getElementById("Mainbtn3").classList.remove("active");
    document?.getElementById("Mainbtn").classList.remove("active");
    document?.getElementById("Mainbtn1").classList.remove("active");
    document?.getElementById("Mainbtn2").classList.add("active");
  };
  const handleBtnClick3 = () => {
    setOpenMenu2(false);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu3(true);
    document?.getElementById("Mainbtn").classList.remove("active");
    document?.getElementById("Mainbtn2").classList.remove("active");
    document?.getElementById("Mainbtn1").classList.remove("active");
    document?.getElementById("Mainbtn3").classList.add("active");
  };

  const loadMore = () => {
    if (collectionData?.length > numItems) {
      console.log(numItems);
      console.log(collectionData?.length);
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


  const handleImageShow = () => setImageShow(true);
  const handleImageClose = () => setImageShow(false);
  const handleClose1 = () => setOpenBid(false);


  const [getMasterAddress, setGetMasterAddress] = useState();
  const [loader, setLoader] = useState(true);
  const [openBid, setOpenBid] = useState(false);
  const [zerocheck, setzerocheck] = useState(false)
  const [Makeofferinput, setMakeofferinput] = useState(false)
  const [WRLCBalance, setWRLCBalance] = useState(12)
  const [comment1, setcommect1] = useState("");
  const [startmax, setstartmax] = useState(new Date())
  const [comments, setcommect] = useState([])
  const [sellingIsLoading, setSellingIsLoading] = useState(false);
  const [openBidCheck, setOpenBidCheck] = useState(false);
  const [openBidCheck1, setOpenBidCheck1] = useState(false);
  const [Allcomments, SetAllcomments] = useState([])
  const [commentloading, setcommentloading] = useState(false)
  const [updatedcomment, setupdatedcomment] = useState("")
  const [nftHistory, setNftHistory] = useState()
  const SUBMIT = async (Blogid, comment) => {
    setcommentloading(true)
    await http
      .post(httpUrl + "/api/v1/Nft/AddComment?nftId=" + Blogid + "&comment=" + comment)
      .then(async (res) => {
        getallcoments()
      })
      .catch((error) => {
        setcommentloading(false)
      });
  }
  const Editcomment = async (Nftid, commentid) => {
    setcommentloading(true)
    await http
      .put(httpUrl + "/api/v1/Nft/UpdateComment?nftId=" + Nftid + "&commentId=" + commentid, { comments: updatedcomment })
      .then(async (res) => {
        getallcoments()
      })
      .catch((error) => {
        setcommentloading(false)
      });
  }
  useEffect(() => {
    checkBalance1("0xE6edc5A015ca6b65338a76a7db91fbC156B94ea5", WalletAddress).then(resp => {
      setWRLCBalance(Web3.utils.fromWei(resp))

    }).catch(error => {
      console.log("this is error  ::  ", error)
    })

  }, [])


  const getallcoments = async () => {

    let params = window.location.pathname;
    setParams(params.split("/")[1]);
    await http
      .get(httpUrl + `/api/v1/Nft/GetAllComment?nftId=${params.split("/")[2]}`)
      .then(async (res) => {
        SetAllcomments(res.data.data)
      })
      .catch((error) => {
        setcommentloading(false)
      });
  }
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
  useEffect(() => {
    let date1 = endDate;
    date1.setDate(date1.getDate() + 1);
    setstartmax(date1)
    // date.setDate(date.getDate() + 1);
    getallcoments()
  }, [])

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
            console.log(inputAmount, maxInputAmount)
            console.log(inputAmount, maxInputAmount)
            console.log(inputAmount, maxInputAmount)
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
  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 2000)
  }, [myData])

  useEffect(() => {
    getMarketByid()
  }, [id, accountId]);

  useEffect(async () => {
    if (myData && myData.collectionId) {
      getNftCollection()
    }
  }, [myData]);

  const getNftCollection = async () => {
    setCollectionLoading(true)
    viewsCount()
    console.log(myData);
    await http
      .get(
        httpUrl +
        `/api/v1/Nft/GetAllNftsByCollectionId?collectionId=${myData.collectionId}&PageSize=9999&CurrentPage=1`
      )
      .then(async (res) => {
        console.log("object", res.data.data);
        setCollectionData(res.data.data);
        setCollectionLoading(false)
      })
      .catch((error) => {
        getNftCollection()
        console.log(error);
      });
  }

  useEffect(async () => {
    //0xE6edc5A015ca6b65338a76a7db91fbC156B94ea5
    if (WalletBalance) {
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
      console.log(MyProfile);
      profileData()
    }
  }, [myData])


  useEffect(() => {
    // setTimer(true)
    let params = window.location.pathname;
    setParams(params.split("/")[1]);
    setParamsLoading(false);
    if (myData && !isInterval) {
      console.log("myData.bidEndDate", myData.bidEndDate);
      const eventTime = moment(myData?.bidEndDate).unix();
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
          httpUrl + `/api/v1/Nft/GetNftBids?NftId=${params.split("/")[2]}`
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
            setIsBiddingLoading(false);
            setShow(false);
            setIsLoading(false);
          }
        }).catch(() => {
          AllBids()
        });
    } else {
      http
        .get(
          httpUrl + `/api/v1/Nft/GetNftBids?NftId=${params.split("/")[2]}`
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
            setIsBiddingLoading(false);
            setShow(false);
            setIsLoading(false);
          }
        }).catch(() => {
          AllBids()
        });
    }
  }

  useEffect(() => {
    API.GetNftHistoryByNftId.GetNftHistoryByNftIdApi(id).then((response) => {
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
      // console.log(response.data.data)
      setNftHistory(response.data.data)
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    })
  }, [id])
  useEffect(() => {
    if (filterTrigger == false) {
      setchecksaleminus1(true)
      SetNewPrice(false)
      setSellnftpriceerror(false)
      setmaxpriceofsell(false)
    }
  }, [filterTrigger])

  useEffect(() => {
    if (myData) {
      MasterAddressFunc()
    }
  }, [myData])

  const MasterAddressFunc = async () => {
    http
      .get(httpUrl + "/api/v1/Nft/GetMasterAddress")
      .then(async (res) => {
        // console.log("GetMasterAddress", res?.data?.data.address);
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
        console.log("master add");
        console.log(error?.message);
      });
  }

  const viewsCount = async (e) => {
    await http
      .post(httpUrl + `/api/v1/Nft/AddViewNft?NftId=${myData?.id}`)
      .then((res) => {
        console.log("view added", res);
      }).catch((e) => {
        console.log("er", e);
      })
  }
  const profileData = async (e) => {
    if (WalletAddress) {
      console.log("WalletAddress", WalletAddress);
      await http
        .get(httpUrl + `/api/v1/Account/GetAccount?address=${WalletAddress}`)
        .then((res) => {
          setIsStacked(res.data.data.isStacked)
          setStakeLoading(false)
        }).catch((e) => {

          console.log("er stackingggg", e);
        })
    }
    else {
      setStakeLoading(false)

    }
  }

  const removeToFavourite = async (nftId, OwnerAddress, favCount) => {
    if (!favouriteInProgress) {
      const payload = {
        nftId: nftId,
        nftAddress: OwnerAddress,
      };

      await dispatch(RemoveFavouriteNftAction(payload))
        .then(async (resp) => {
          setFavouriteInProgress(false);

          if (resp?.isSuccess === true) {
            toast.error(`${resp?.data}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.log("favcount --", favCount);

            await dispatch(GetFavouriteNftAction());
            // setFavCount((favcount) => favcount - 1);
            // setTimeout(() => window.location.reload(), 2000);
          } else if (resp?.isSuccess === false) {
            toast.error(`${resp?.data}`, {
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
          setFavouriteInProgress(false);
          toast.error(`${error?.data?.message}`, {
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
  };

  const sellingHandler = async (e) => {
    console.log("authconnectstate", AuthConnectState);
    e.preventDefault();
    setSellingIsLoading(true);
    const address = {
      address: myData.ownerAddress,
    };
    await http
      .post(httpUrl + "/api/v1/auth/connect", address)
      .then(async (res) => {
        console.log("authstate", res?.data.data.message);
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
            console.log("Address", res.data.data)
            const payload = {
              approved: res?.data.data,
              tokenId: myData?.nftTokenId,
            };
            const payloadMarket = {
              nftContractId: myData?.contractAddress,
              tokenId: myData?.nftTokenId,
              price: NewPrice,
              // marketAddress: resAddress
            };
            dispatch(
              approveContract(
                payload,
                myData?.contractAddress,
                payloadMarket
              ).then(async (r) => {
                // toast.success(
                //   `Contract approved, wait for the last step`,
                //   {
                //     position: "bottom-right",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //   }
                // );

                let body = {
                  nftId: myData?.id,
                  price: NewPrice,
                  approvalTransactionHash: r.response.hash,
                  openOrderTransactionHash: r.res.hash,
                };

                console.log("BODYYYYYYYYYYYYYYYYYYYYYY", body);
                delay(12000).then(async () => {
                  console.log("I have got 5 sec delay");
                  await http
                    .post(httpUrl + "/api/v1/Nft/SellNftMarket", body)
                    .then(async (res) => {
                      console.log("STATUS");
                      console.log("STATUS", res);
                      console.log("STATUS");
                      toast.success(
                        `NFT Selling in process, you will be redirected shortly`,
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
                        history.push("/explore");
                      }, 3000);
                    });
                });
              }).catch((e) => {
                // toast.error(
                //   `Transaction Rejected`,
                //   {
                //     position: "top-right",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //   }
                // );
                setSellingIsLoading(false)

                console.log("error in approve", e);
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
    console.log("IN IT");
    const payloadMarket = {
      nftContractId: myData?.contractAddress,
      tokenId: myData?.nftTokenId,
      price: NewPrice,
    };
    dispatch(
      approveContract(payloadMarket, myData?.contractAddress).then(
        (ress) => {
          console.log("open market for fixed");
          console.log(ress);
          console.log("open market for fixed");
        }
      )
    ).catch((e) => {
      console.log("error in market", e);
    });
  };

  async function getMarketByid() {
    await http
      .get(
        httpUrl +
        `/api/v1/Nft/GetNftMarketById?nftId=${id}&accountId=${accountId}`
      )
      .then(async (res) => {
        console.log(res.data.message)
        if (res.data.message === "NFTMarket not found") {
          history.push("/explore");
        }
        setMyData(res.data.data);
        if (GetFavouriteNft?.some((data) => data.id === res.data.data?.id)) {
          setfavnft(true);
          console.log("favourate")
        }
        else {
          setfavnft(false);
          console.log("not favourate")
        }
        setcountoffav(res.data.data?.nftFavouritesCount)
        //  collectionimage(res?.data.data.collectionId)
        // console.log("Collection Image ",res?.data.data.collectionId)

        setmyDataLoader(false)
      })
      .catch((error) => {
        // console.log(error);
      });
  }
  const [Acceptloader, setAcceptloader] = useState(true)
  const acceptBidOffer = async (id, price, buyerAddress, contractAddress) => {
    setAcceptloader(false)
    console.log("accept bid");
    console.log(id);
    console.log("accept bid");
    await http
      .get(httpUrl + `/api/v1/Nft/GetMarketNftAddress`)
      .then(async (res) => {
        console.log("market address", res.data.data);
        const payload = {
          contractAddress: res.data.data,
          tokenId: myData?.nftTokenId,
          price: price,
          buyerAddress: buyerAddress,
          nftContractAddress: contractAddress,
        };
        dispatch(acceptBid(payload)).then((res) => {
          delay(5000).then(async () => {
            setAcceptloader(false)
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
              .put(httpUrl + `/api/v1/Nft/bidAccepted?bidId=${id}&TransactionHash=${res.hash}`)
              .then(async (res) => {
                setAcceptloader(true)
                console.log("added accepted response", res);
                delay(2000).then(async () => {
                  history.push("/explore");
                });
              });
          });
        }).catch(() => {
          setAcceptloader(true)
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
        console.log("ACCEPT BID PAYLOAD", payload);
      });
  };

  const amountStatus = (value) => {
    setMakeofferinput(value);
    if (Makeofferinput > 0) {
      if (Makeofferinput === maxInputAmount) {
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
    if (value > WRLCBalance) {
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
      setMakeofferinput(value);
    }
    if (value === null) {
      setOpenBidCheck(false)
    }
  };
  useEffect(() => {

    if (Makeofferinput) {
      if (Makeofferinput > 0) {

        setnegetive1(false)
        setnegetive(false)
        if (Makeofferinput > WRLCBalance) {
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



  const amountStatus1 = (value) => {
    if (value < inputAmount) {
      setAmounCheck1(true);
      setOpenBidCheck1(false)
    }
    else {
      setAmounCheck1(false);
      setOpenBidCheck1(true)
      setAmounCheck(false);
      setMaxInputAmount(value);
    }
  };


  const openBidding = async () => {
    setBidInProgress(true);
    let params = window.location.pathname;
    console.log("nftid", params.split("/")[2]);
    console.log("accountid", params.split("/")[3]);
    await http
      .get(httpUrl + "/api/v1/Nft/GetMarketNftAddress")
      .then(async (res) => {
        console.log("object", res);
        const contractPayload = {
          nftContractId: myData?.contractAddress,
          tokenId: myData?.nftTokenId,
          price: inputAmount,
          maxPrice: maxInputAmount,
          contractAddress: res.data.data,

        };
        dispatch(openForAuction(contractPayload))
          .then(async (approvedHashes) => {
            console.log("auction response");
            console.log(res);
            console.log("auction response");
            let params = window.location.pathname;
            const payload = {
              nftId: params.split("/")[2],
              isBidOpen: true,
              minimumAmount: inputAmount,
              maximumAmount: maxInputAmount,
              bidStartDate: startDate,
              bidEndDate: endDate,
            };
            console.log(payload);
            await http
              .post(httpUrl + "/api/v1/Nft/OpenBid", payload)
              .then(async (res) => {
                let body = {
                  nftId: params.split("/")[2],
                  price: maxInputAmount,
                  approvalTransactionHash: approvedHashes.response.hash,
                  openOrderTransactionHash: approvedHashes.response.hash,
                };
                console.log("added bid response", res);
                setShow(false);
                setBidtrigger(true);
                delay(5000).then(async () => {
                  console.log("I have got 5 sec delay");
                  await http
                    .post(httpUrl + "/api/v1/Nft/SellNftMarket", body)
                    .then(async (res) => {
                      setBidInProgress(false);
                      console.log("STATUS");
                      console.log("STATUS", res);
                      console.log("STATUS");
                      toast.success(
                        `NFT Bidding has been opened, you will be redirected shortly`,
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
                        history.push("/explore");
                      }, 3000);
                    })
                    .catch((err) => {
                      console.log("SellNftMarket" + err?.message);
                      setBidInProgress(false);
                    });
                });
              })
              .catch((err) => {
                console.log("OpenBid" + err?.message);
                setBidInProgress(false);
              });
          })
          .catch((err) => {
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
        console.log("GetMarketNftAddress" + err?.message);
        setBidInProgress(false);
      });
  };


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
            console.log("objectttttttttt", hashPayload);
            delay(8000).then(async () => {
              await http
                .post(httpUrl + "/api/v1/Nft/NftCancelStatus", hashPayload)
                .then(async (res) => {
                  console.log("back to hold", res);
                  toast.success(
                    `NFT has been unlisted from marketplace`,
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
      console.log("errer");
      setExpiryError(true);
    } else {
      setExpiryError(false);
      console.log(date);
      setExpiryDate(date);
    }
  };
  const startDateFunc = (date) => {
    let dateNow = new Date();
    dateNow = moment(endDate).unix();
    let dateEntered = moment(date).unix();
    if (dateEntered >= dateNow) {
      console.log("errer");
      setBidError1(true);
    } else {
      setBidError1(false);
      console.log(date);
      setStartDate(date);
    }
  };

  const endDateFunc = (date) => {
    let dateNow = new Date();
    dateNow = moment(startDate).unix();
    let dateEntered = moment(date).unix();
    if (dateEntered <= dateNow) {
      console.log("errer");
      setBidError1(true);
    } else {
      setBidError1(false);
      console.log(date);
      setEndDate(date);
    }
  };

  const switchStatus = () => {
    console.log("SWITCHHHHH", !isSwitchOn);
    setIsSwitchOn(!isSwitchOn);
  };

  const postBidding = async () => {
    setIsOfferInProgress(true);
    let params = window.location.pathname;
    const amount = Web3.utils.fromWei(WalletBalance.toString(), "ether");
    setBalance(amount);

    await http
      .get(httpUrl + "/api/v1/Nft/GetWRLCAddress")
      .then(async (response) => {
        console.log("WRLC address", response);
        await http
          .get(httpUrl + `/api/v1/Nft/GetMarketNftAddress`)
          .then(async (res) => {
            console.log("marketplacecontractaddress", res.data);
            const contractPayload = {
              marketPlaceContract: res.data.data,
              ownerAddress: myData?.ownerAddress,
              contractAddress: response?.data?.data,
              id: myData?.nftTokenId,
              price: Makeofferinput,
            };
            console.log(contractPayload);
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
                console.log("hashhhdqdidnqiudnqwidnw", res);
                biddingPosting(res.hash)

              });
            }).catch(() => {
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
    console.log("hashhhhhhh", hash);
    let expp = moment(expiryDate).unix()
    let current = moment(expiryDate).unix()
    let diff = expp - current
    let duration = moment.duration(diff * 1000, "milliseconds");

    const payload = {
      nftId: params.split("/")[2],
      price: Makeofferinput,
      bidApprovalHash: hash,
      expiryDate: expiryDateplacebid
    };
    console.log("payload bid", payload);
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
        console.log("ADDED BID", res);
        setIsOfferInProgress(false);
        getBiddings(payload)
      })
      .catch((error) => {
        biddingPosting()
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
        console.log("#######################", res.data.data);
        if (!res.data.data || res.data.data === null) {
          setEmptyBids(true);
        }
        setEmptyBids(false);
        setBiddings(res.data.data);
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log(res.data.data);
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        setIsLoading(false);
        setIsBiddingLoading(false);
        setShow(false);
        setBidtrigger(true);
      }).catch(() => {
        getBiddings(payload)
      });
  }

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      if (!isConnected || isConnected == undefined) {
        return history.push("/connectwallet");
      }

      setIsLoading(false);
      dispatch(signMessage(AuthConnectState?.message))
        .then(async (res) => {
          const amount = parseInt(
            Web3.utils.toWei(String(myData?.sellPrice))
          ).toString(16);

          setIsLoading(false);
          const payload = [
            {
              from: WalletAddress,
              to: getMasterAddress,
              value: amount,
            },
          ];
          await dispatch(sendTransection(payload))
            .then(async (res) => {
              const payload = {
                nftId: myData.id,
                address: WalletAddress,
                transactionHash: res,
              };
              await dispatch(BuyNftMarketAction(payload))
                .then((res) => {
                  setIsTransactionSuccess(true);
                  toast.success(`${res.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
              console.log("selling Successfull");
            })
            .catch((error) => {
              setIsLoading(false);
              toast.error(`${error?.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              console.log(error);
            });
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("Signature Error");
        });
    } else {
      toast.error(`Please Install Metamask Extension`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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

  const inputhandler = (e) => {
    const { value } = e.target;

    SetNewPrice(value);
  };

  const buyNft = async () => {
    if (!isConnected || isConnected == undefined) {
      return history.push("/connectwallet");
    } else {
      setBidInProgress(true);
      console.log("in");
      await http
        .get(httpUrl + `/api/v1/Nft/GetMarketNftAddress`)
        .then(async (res) => {
          const payload = {
            contractAddress: res.data.data,
            nftContractId: myData?.contractAddress,
            tokenId: myData?.nftTokenId,
            price: myData?.sellPrice,
          };
          console.log("object", payload);
          dispatch(buyNftMarket(payload))
            .then((res) => {
              toast.success(`NFT purchasing in process. Please wait.`, {
                position: "top-right",
                autoClose: 15000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              delay(22000).then(async () => {
                console.log("bought nft", res);
                toast.success(`NFT bought!`, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                console.log("hurrayyyyyyy");
                const payload1 = {
                  address: "",
                  transactionHash: res.hash,
                  nftId: myData?.id,
                };
                console.log("payload buy nft", payload1);
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


  const buyNftMarketFunc = async (payload) => {
    await http
      .post(httpUrl + "/api/v1/Nft/BuyNftMarket", payload)
      .then(async (response) => {
        setBidInProgress(false);
        console.log(
          "responseeeeeeeeeeeeeeeeeeeeeeeeeeee",
          response
        );
        setTimeout(() => {
          history.push("/myprofile");
        }, 1000);
      })
      .catch((err) => {
        buyNftMarketFunc(payload)
        // setBidInProgress(false);
      });
  }

  const addToFavourite = async (nftID, OwnerAddress) => {
    console.log("user token ", Token)
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
          toast.success(`${resp?.data?.data}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          await dispatch(GetFavouriteNftAction());
          // setTimeout(() => window.location.reload(), 2000);
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
        console.log(error);
        swal({
          icon: "error",
          title: error?.data?.message,
        });
      });
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
    <div className="gradient-bg-light">
      <GlobalStyles />
      {(loader && myDataLoader) ? (
        <>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div className="col-sm-12 d-flex justify-content-center margin-top-150">
            <BounceLoader color="white" size="60" />
          </div>
        </>
      ) : (
        <>

          <section className="container user-nft-head">
            <div className="row ">
              {/* <div className="col-lg-12 col-md-12 col-sm-12">
                <h1>{myData?.name}</h1>
              </div> */}
              <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="my-profile-Img-pnl full-div">
                  <img src={`${httpUrl}/${myData?.image}`} alt="NFT.png" />

                  <div className="user-fav-heart-span">
                    {favnft ?
                      <img src={heart} style={{ cursor: "pointer" }} onClick={() => {
                        buttonclicked ? <></> : removeFromLike(myData?.id, myData?.ownerAddress);
                      }} />
                      :
                      <img
                        src={heartBlack} style={{ width: "15px", cursor: "pointer" }} onClick={() => {
                          buttonclicked ? <></> : addToLike(myData?.id, myData?.ownerAddress);
                        }} />
                    }
                    {countoffav}
                  </div>

                  {/* <span className="heart-span1 hanging"  style={{cursor:"pointer",color:"orange",fontSize:'15px'}}  onClick={() =>
                    history.push(
                        `/nftsbycollections/${myData?.collectionId}`
                    )
                }>
                       {myData?.collectionName}                    </span> */}


                </div>

              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="user-nft-info-pnl">
                  <div className="full-div">
                    <h3 className="info-name">
                      <span className="hoverdetail">{myData?.name}
                      </span>
                    </h3>
                    <p>
                      {myData?.description}
                    </p>
                  </div>
                </div>
                <ul className="creator-list">
                  <li onClick={() => history.push(myData?.ownerAddress === WalletAddress ? `/myprofile` : `/profile/${myData?.ownerAddress}`)} >
                    <div className="flex">
                      <div className="img-pnl">
                        <img src={myData?.ownerImage ? `${httpUrl}/${myData?.ownerImage}` : defaultImg} alt="NFT.png" />
                      </div>
                      <div className="txt-pnl">
                        <span>owned by</span>
                        {" "}
                        <h6>{myData?.ownerName ? myData?.ownerName : "Unnamed"}  </h6>
                      </div>
                    </div>
                  </li>
                  <li onClick={() => history.push(myData?.creatorAddress === WalletAddress ? `/myprofile` : `/profile/${myData?.creatorAddress}`)}>
                    <div className="flex">
                      <div className="img-pnl"></div>
                      <div className="txt-pnl">
                        <span>created by</span>
                        {" "}
                        <h6>{myData?.creatorName ? myData?.creatorName : "Unnamed"}</h6>
                      </div>
                    </div>
                  </li>
                </ul>

                <div className="flex-div">
                  <ul className="share-info-list">
                    <li    >
                      <p style={favnft ? { cursor: "pointer" } : { cursor: "pointer" }}
                        onClick={() => {
                          favnft ? removeFromLike(myData?.id, myData?.ownerAddress)
                            :
                            addToLike(myData?.id, myData?.ownerAddress)
                        }}>
                        <i className={favnft ? "fa fa-heart" : "fa fa-heart-o"} color={"red"}>{countoffav} </i></p>
                    </li>
                    <li>
                      <p><i className="fa fa-eye" > {myData?.viewCount + " "}</i></p>
                    </li>
                    <li title="Refresh" onClick={() => { window.location.reload(); }}>
                      <p onClick={() => { window.location.reload(); }}  ><i class="fa fa-refresh"></i></p>
                    </li>
                    <CopyToClipboard
                      text={window.location.href}
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
                      <li title="Copy">
                        <p>
                          <i class="fa fa-link"></i>
                        </p>
                      </li>
                    </CopyToClipboard>
                    {myData?.externalLink && (
                      <li onClick={() => { window.open(myData?.externalLink); }} title="Open NFT" >
                        <p >
                          <i class="fa fa-external-link"></i>
                        </p>
                      </li>
                    )}
                  </ul>
                </div>
                {/* <div className="full-div">
                  <h1>{myData?.name}</h1>
                  <h3>Owned by <span
                    onClick={() => history.push(myData?.creatorAddress === WalletAddress ? `/myprofile` : `/profile/${myData?.creatorAddress}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {myData?.ownerName
                      ? myData?.ownerName
                      : "Unnamed"}
                  </span></h3>
                </div> */}
                <div className="description-details-text w-100">
                  <div className="full-div"></div>
                  <h6>Current Bid</h6>
                  {myData?.isBidOpen && (
                    <div style={{ fontSize: "20px" }}>
                      <span>
                        Min price --{" "}
                        {myData?.bidInitialMinimumAmount
                          ? myData?.bidInitialMinimumAmount
                          + " RLC" : "Min price not set."}
                      </span>
                      <span style={{ marginLeft: "10px" }}>
                        Max price --{" "}
                        {myData?.bidInitialMaximumAmount
                          ? myData?.bidInitialMaximumAmount
                          + " RLC" : "Max price not set."}
                      </span>
                    </div>
                  )}
                  <p>
                    {
                      myData?.isBidOpen ? <div style={{ paddingTop: "10px" }} ></div> :
                        <>
                          <img src={rlc} style={{
                            display: "inline-block",
                            maxWidth: "20px",
                            marginRight: "4px",
                            marginBottom: "4px"

                            // display: inline-block;
                            // max-width: 20px;
                            // margin-right: 4px;
                          }} />
                          {" "}
                          <b>{myData?.sellPrice ? myData?.sellPrice : myData?.buyPrice}</b> {"  RLC"}
                        </>}
                  </p>
                </div>
                <div className="row">
                  <div className="col-lg-7 col-md-12 col-sm-12">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        {isConnected ? (
                          <>
                            {(myData?.ownerAddress != WalletAddress && myData?.isBidOpen) && (
                              <a
                                onClick={handleShow}
                                id="btnBuy"
                                type="submit"
                                className="reg-btn w-100"
                              >
                                <i className="fa fa-shopping-cart"></i> Place Bid
                              </a>
                            )}

                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        {isConnected ? (
                          <>
                            {(myData?.ownerAddress != WalletAddress && !myData?.isBidOpen && myData?.staus !== "Hold") && (
                              <>
                                {!bidInProgress ? (
                                  <a
                                    onClick={buyNft}
                                    id="btnBuy"
                                    type="submit"
                                    className="reg-btn w-100"
                                  >
                                    Buy
                                  </a>
                                ) : (
                                  <a
                                    id="btnBuy"
                                    className="reg-btn w-100"
                                    disabled
                                  >
                                    <PulseLoader color="white" size="15" />
                                  </a>
                                )}
                              </>
                            )}

                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        {((myData?.staus === 'ReadyForSell' || myData?.isBidOpen === true) && (myData?.ownerAddress === WalletAddress)) && (
                          <a onClick={() => cancelListing()} href="javascript:void(0);" className="reg-btn w-100"><i class="fa fa-suitcase"></i> Cancel Listing</a>
                        )}
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        {(!myData?.freezeData) && (myData?.ownerAddress === WalletAddress) && (
                          <a onClick={() =>
                            history.push(
                              `/createnft/${myData?.ownerAddress}/${myData?.id}/${myData?.accountId}`
                            )
                          } href="javascript:void(0);" className="reg-btn w-100"><i class="fa fa-suitcase"></i> Update NFT</a>
                        )}
                      </div>
                      <div className="full-div space20"></div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        {((myData?.staus != "ReadyForSell" &&
                          myData?.isMinted === true) && (myData?.ownerAddress === WalletAddress)) && (
                            <a onClick={() => setFilterTrigger(true)} href="javascript:void(0);" className="reg-btn w-100"><i class="fa fa-suitcase"></i> Sell NFT</a>
                          )}
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        {myData?.staus != "ReadyForSell" && myData?.isMinted === true && myData?.ownerAddress === WalletAddress && !myData?.isBidOpen && (
                          <a onClick={() => setOpenBid(true)} href="javascript:void(0);" className="reg-btn trans w-100"><i class="fa fa-suitcase"></i> Open for bid</a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-12 col-sm-12">
                    <div className="nft-timer">
                      {
                        <>
                          {(myData?.isBidOpen) && (
                            <>
                              {/* <h6>Sale ends {dateFormat(myData?.bidEndDate + "z", "mmm dd, yyyy")} at {dateFormat(myData?.bidEndDate + "z", "HH:MM TT")} </h6> */}

                              <ul className="timer">
                                <>
                                  <li>
                                    <p>{days ? days : days === 0 ? 0 : <BounceLoader color="white" size="20" width="10" />}</p>
                                  </li>
                                  <li>:</li>
                                  <li>
                                    <p>{hours ? hours : hours === 0 ? 0 : <BounceLoader color="white" size="20" width="10" />}</p>

                                  </li>
                                  <li>:</li>
                                  <li>
                                    <p>{minutes ? minutes : minutes === 0 ? 0 : <BounceLoader color="white" size="20" width="10" />}</p>

                                  </li>
                                  <li>:</li>
                                  <li>
                                    <p>{seconds ? seconds : seconds === 0 ? 0 : <BounceLoader color="white" size="20" width="10" />}</p>
                                  </li>
                                </>

                              </ul>
                            </>
                          )}
                        </>
                      }

                    </div>
                  </div>
                </div>
                <div className="full-div space20"></div>
                <div className="row">
                  {/* <div className="col-md-12 profiler-info">
                    <h2>
                      <h2
                        className="contract-hover"
                        onClick={() => {
                          history.push(
                            `/nftsbycollections/${myData.collectionId}`
                          );
                        }}
                      >
                        {myData?.collectionName}
                      </h2>{" "}
                      {"by"}{" "}
                      <h4
                        className="contract-hover"
                        onClick={() => {
                          history.push(
                            myData?.creatorAddress === WalletAddress ?
                              `/myprofile` :
                              `/profile/${myData.creatorAddress}`
                          );
                        }}
                      >
                        {myData?.creatorName
                          ? myData?.creatorName
                          : "Unnamed"}
                      </h4>
                    </h2>
                    <h3>
                      {myData?.name} {"#"}
                      {myData?.id}
                    </h3>
                    <h4>
                      Owned by{" "}
                      <span
                        className="contract-hover"
                        onClick={() => {
                          history.push(
                            `/profile/${myData.ownerAddress}`
                          );
                        }}
                      >
                        {myData?.ownerName
                          ? myData?.ownerName
                          : "Unnamed"}
                      </span>
                    </h4>
                    <div style={{ paddsingLeft: "10px" }}>
                      <i class="fa fa-eye"></i> {myData?.viewCount + " "}

                      {GetFavouriteNft?.some(
                        (item, index) => {
                          return (
                            item.nftTokenId === myData?.nftTokenId
                          );
                        }
                      ) ? (
                        <>
                          <i
                            onClick={() => addToFavourite(myData?.id, myData.ownerAddress)}
                            className="fa fa-heart"
                            style={{ color: "red" }}
                          ></i>{" " + myData?.nftFavouritesCount}
                        </>
                      ) : (
                        <>
                          <i
                            onClick={() => addToFavourite(myData?.id, myData.ownerAddress)}
                            className="fa fa-heart"
                          ></i>{" " + myData?.nftFavouritesCount}
                        </>
                      )}
                    </div>
                  </div> */}
                </div>
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
                              setInputAmount(e.target.value)
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
                                setMaxInputAmount(e.target.value)
                              }
                            }
                          }
                        }
                        } value={maxInputAmount} aria-label="Amount (to the nearest dollar)" />
                      </InputGroup>
                      <div className='bidDates'>
                        <div className='bidDat'>
                          <h6 style={{ color: '#000' }}>Start Date</h6>
                          <DatePicker className='dateInput' minDate={minndate} dateFormat="dd MMMM yyyy " selected={startDate} onChange={(date) => { endDateFunc(startmax); startDateFunc(date) }} format='yyyy-MM-dd' />
                        </div>
                        <div className='bidDat'>
                          <h6 style={{ color: '#000' }}>End Date</h6>
                          <DatePicker className='dateInput' minDate={startmax} dateFormat="dd MMMM yyyy " selected={endDate} onChange={(date) => endDateFunc(date)} />
                        </div>

                        {bidError1 && (
                          <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'right', width: '50%' }}>Start Date Cannot be greater than expiryDate</span>
                        )}
                      </div>
                      {amountCheck && (
                        <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'left', width: '50%' }}>Min value must be lower than available balance</span>
                      )}

                      {amountCheck1 && (
                        <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'left', width: '50%' }}>Max value must be greater than Min value</span>
                      )}
                      {amountCheck2 && (
                        <span style={{ color: 'red', wordBreak: "break-word", display: 'inline-block', float: 'left', width: '50%' }}>Max value must be lower than available balance</span>
                      )}

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
                    <Modal.Body>Available balance: {balance}{" "}RLC</Modal.Body>

                    <Modal.Body className="d-flex justify-content-center">

                      <Form>
                        {["checkbox"].map((type) => (
                          <div key={`inline-${type}`} className="mb-0">
                            <Form.Check
                              inline
                              label="By checking this, I agree REDLIGHT Terms of Service"
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


                      {!bidInProgress ? (
                        <>
                          {amountCheck3 && isSwitchOn && endDate && startDate ? (
                            <a
                              // variant="primary"
                              href="javascript:void(0);"
                              className="reg-btn w-100"
                              disabled={!isSwitchOn}
                              onClick={openBidding}
                            >
                              Open bid
                            </a>
                          ) : (
                            <a
                              // variant="primary"
                              href="javascript:void(0);"
                              className="reg-btn w-100"
                              disabled={true}
                            // onClick={ openBidding}
                            >
                              Open bid
                            </a>
                          )}

                        </>
                      ) : (
                        <a className="dark-btn" disabled>
                          <PulseLoader color="white" size="11" />
                        </a>
                      )

                      }
                      <a href="javascript:void(0);" className="reg-btn w-100" onClick={handleClose1}>
                        Close
                      </a>
                    </Modal.Footer>
                  </Modal>
                  {/* {
                    myData?.processing && myData?.processing != "Done" ? <> <p style={{ color: "white", fontSize: "25px" }}> NFT is in process    </p> <PulseLoader color="white" size="15" /></>
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
                                    class="reg-btn"
                                  >
                                    Buy
                                  </button>
                                ) : (
                                  <button
                                    id="btnBuy"
                                    class="reg-btn"
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
                                className="reg-btn"
                              >
                                <i className="fa fa-shopping-cart"></i> Place Bid
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <p style={{ color: "white" }}> Please connect to Wallet </p>
                          </>
                        )}
                      </>
                  } */}
                </div>
                <div className="full-div history-btn-cntnr">
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <a href="javascript:void(0);" onClick={() => {
                        setDetails(false)
                        setHistoryMenu(true)
                        setAbout(false)
                      }
                      } className="w-100 reg-btn trans brdr-rad">History</a>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <a href="javascript:void(0);" onClick={() => {
                        setDetails(true)
                        setHistoryMenu(false)
                        setAbout(false)
                      }
                      } className="w-100 reg-btn trans brdr-rad">Details</a>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <a href="javascript:void(0);" onClick={() => {
                        setDetails(false)
                        setHistoryMenu(false)
                        setAbout(true)
                      }
                      } className="w-100 reg-btn trans brdr-rad">About</a>
                    </div>
                  </div>
                </div>
                <div className="description-details-pnl full-div">
                  <div style={{ position: 'relative' }} className="description-details-head full-div">
                    {historymenu && (
                      <div className="col-lg-12">
                        <p className="clrd" style={{ cursor: "pointer" }}>
                          <b style={{ cursor: "initial" }}>Owner Address: </b>
                          <a onClick={() =>
                          history.push(
                            myData?.ownerAddress === WalletAddress
                              ? `/myprofile`
                              : `/profile/${myData?.ownerAddress}`
                          )} href="javascript:void(0);" style={{ color: "orange" }}>
                            {myData?.ownerAddress}
                          </a>
                        </p>
                        <p className="clrd">
                          <b>Owner Name: </b>
                          {myData?.ownerName ? myData?.ownerName: 'Unnamed'}
                        </p>
                        <p onClick={() =>
                          history.push(
                            myData?.creatorAddress === WalletAddress
                              ? `/myprofile`
                              : `/profile/${myData?.creatorAddress}`
                          )} className="clrd">
                          <b>Creator Address:</b> {myData?.creatorAddress}
                        </p>
                        <p onClick={() =>
                          history.push(
                            myData?.creatorAddress === WalletAddress
                              ? `/myprofile`
                              : `/profile/${myData?.creatorAddress}`
                          )} className="clrd">
                          <b>Creator Name:</b> {myData?.creatorName ? myData?.creatorName: 'Unnamed'}
                        </p>
                        
                      </div>
                    )}
                    {details && (
                      <div className="col-lg-12">
                        <p className="clrd" style={{ cursor: "pointer" }}>
                          <b style={{ cursor: "initial" }}>Collection: </b>
                          <a onClick={() => {
                            history.push(`/nftsbycollections/${myData?.collectionId}`)
                          }} href="javascript:void(0);" style={{ color: "orange" }}>
                            {myData?.collectionName}
                          </a>
                        </p>
                        <p className="clrd">
                          <b>Category: </b>
                          {myData?.collectionCategory}
                        </p>
                        <p className="clrd">
                          <b>Blockchain :</b> {myData?.blockChainName}
                        </p>
                        
                      </div>
                    )}
                    {aboutmenu && (
                      <div id="zero3" className="onStep fadeIn">
                      <div className="col-lg-12">
                        <div className="col-lg-12">
                          <div style={{ color: "white" }}>
                            <Row>
                              {
                                myData?.nftProperties.length > 0 ?
                                  <>
      
                                    {
                                      myData?.nftProperties.map((data, index) =>
                                        <Col
                                          xs={6}
                                          sm={6}
                                          md={6}
                                          lg={4}
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
                        </div>
                      </div>
                    </div>
                    )}
                    <div id="zero3" className="onStep fadeIn">
                    </div>
                  </div>

                  {/* <div className="description-details-bottom full-div">
                    <div className="head full-div">
                      <p>Description</p>
                    </div>
                    <div className="description full-div">
                      <p>
                        {showMore ? myData?.description : `${myData?.description?.substring(0, 300)}`}
                        {myData?.description?.length > 300 ? (
                          <span className="btn-more-less" onClick={() => setShowMore(!showMore)}>
                            {showMore ? " view less" : "...view more"}
                          </span>
                        ) : null
                        }
                      </p>
                      <a
                        className="contract-hover"
                        onClick={() =>
                          history.push(
                            myData?.creatorAddress === WalletAddress
                              ? `/myprofile`
                              : `/profile/${myData?.creatorAddress}`
                          )}>
                        Created By {myData?.creatorName ? myData?.creatorName : "Unnamed"}
                      </a>
                    </div>
                  </div> */}
                </div>



              </div>
            </div>
          </section>
          <section className="container p-t-0">
            <div className="row">
              <div className="col-lg-12">
                <div className="items_filter">
                  <ul className="de_nav de_nav">
                    <li id="Mainbtn" className="active">
                      <span onClick={handleBtnClick}>Bid History</span>
                    </li>
                    <li id="Mainbtn1">
                      <span onClick={handleBtnClick1}>Live Bids</span>
                    </li>
                    <li id="Mainbtn2" className="">
                      <span onClick={handleBtnClick2}>Transfers</span>
                    </li>
                    <li id="Mainbtn3" className="">
                      <span onClick={handleBtnClick3}>Listing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {openMenu1 && (
              <>
                <ul className="user-visitor-list">
                  {emptyBids ? (
                    <>No bids added so far</>
                  ) : (
                    <>
                      {biddings?.map((nft, index) => (
                        <>
                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="row">
                              <div className="col-lg-8 col-md-8 col-sm-12">
                                <div className="activity-pnl">
                                  <div className="left-pnl">
                                    <div className="img-pnl">
                                      <img src={nft.accountViewModel.profileImage ? httpUrl + '/' + nft.accountViewModel.profileImage : bannerimg} />
                                    </div>
                                    <div className="txt-pnl">
                                      <h3>Bid</h3>
                                      <p>{nft.accountViewModel.username ? nft.accountViewModel.username : 'Unnamed'} posted a bid for {nft.price} RLC</p>
                                      <span>At {moment(nft.createdAt.split('T')[0], "hours").format('Do [of] MMMM, YYYY')}</span>
                                    </div>
                                  </div>
                                  <div className="right-pnl">
                                    {nft?.nftResponseModel.ownerAddress === WalletAddress && (
                                      <>
                                        {
                                          Acceptloader ? (
                                            <a
                                              onClick={() => {
                                                setlastindex(index);
                                                setAcceptloader(false);
                                                acceptBidOffer(
                                                  nft.id,
                                                  nft.price,
                                                  nft.accountViewModel.address,
                                                  nft.nftResponseModel.contractAddress
                                                )
                                              }
                                              }
                                              type="submit"
                                              class="cart-btn"
                                            >
                                              <span style={{ fontSize: '12px' }}>Accept</span>
                                            </a>
                                          ) : (
                                            <a
                                              type="submit"

                                              class="cart-btn"
                                              disabled>
                                              {
                                                index == lastindex ?
                                                  <PulseLoader color="white" size="11" />
                                                  : "Accept"
                                              }

                                            </a>
                                          )
                                        }
                                      </>
                                      // <a  className="cart-btn" href="javascript:void(0);"><i class="fa fa-shopping-cart"></i></a>
                                    )}
                                  </div>
                                </div>



                              </div>
                              <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="full-div">
                                  <div class="subscribe-pnl">
                                    <input autocomplete="off" class="form-control" placeholder="Enter your word art" /><button>
                                      <i className="fa fa-search"></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="full-div">
                                  <h5>Filter</h5>
                                </div>
                                <div className="full-div">
                                  <ul className="filter-select-listing">
                                    <li>
                                      <a href="#"><i class="fa fa-bars"></i> Listings</a>
                                    </li>
                                    <li>
                                      <a href="#"><i className="fa fa-heart"></i> Like</a>
                                    </li>
                                    <li>
                                      <a href="#"><i class="fa fa-shopping-cart"></i> Purchases</a>
                                    </li>
                                    <li>
                                      <a href="#"><i class="fa fa-percent"></i> Sales</a>
                                    </li>
                                    <li>
                                      <a href="#"><i class="fa fa-sign-out"></i> Transfer</a>
                                    </li>
                                    <li>
                                      <a href="#"><i className="fa fa-star"></i> Burns</a>
                                    </li>
                                    <li>
                                      <a href="#"><i class="fa fa-window-maximize"></i> Bids</a>
                                    </li>
                                  </ul>
                                  <a href="#" className="clear-btn">Clear All</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                    </>
                  )}
                </ul>

              </>
            )}
            {openMenu3 && (
              <div id="zero3" className="onStep fadeIn">
                <div className="col-lg-12">
                  <div className="col-lg-12">
                    <div style={{ color: "white" }}>
                      <Row>
                        {
                          myData?.nftProperties.length > 0 ?
                            <>

                              {
                                myData?.nftProperties.map((data, index) =>
                                  <Col
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    lg={4}
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
                  </div>
                </div>
              </div>
            )}
            {openMenu && (
              <>

                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="row">
                    <div className="col-lg-8 col-md-8 col-sm-12">
                      {nftHistory ? nftHistory.map((data) => (
                        <>
                          <div className="activity-pnl">
                            <div className="left-pnl">
                              <div className="img-pnl">
                                <img src={httpUrl + '/' + data.nftImage} />
                              </div>
                              <div className="txt-pnl">
                                <h3>Acitivy Here</h3>
                                <p>{data.nftHistoryType} #{data.nftId} for {data.nftPrice} RLC</p>
                                <span>{moment(data.createdAt.split('T')[0], "hours").format('Do [of] MMMM, YYYY')}</span>
                              </div>
                            </div>
                            <div className="right-pnl">
                              <a className="cart-btn" href="#"><i class="fa fa-shopping-cart"></i></a>
                            </div>
                          </div>
                        </>
                      )) : (
                        <></>
                      )}

                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <div className="full-div">
                        <div class="subscribe-pnl">
                          <input autocomplete="off" class="form-control" placeholder="Enter your word art" /><button>
                            <i className="fa fa-search"></i>
                          </button>
                        </div>
                      </div>
                      <div className="full-div">
                        <h5>Filter</h5>
                      </div>
                      <div className="full-div">
                        <ul className="filter-select-listing">
                          <li>
                            <a href="#"><i class="fa fa-bars"></i> Listings</a>
                          </li>
                          <li>
                            <a href="#"><i className="fa fa-heart"></i> Like</a>
                          </li>
                          <li>
                            <a href="#"><i class="fa fa-shopping-cart"></i> Purchases</a>
                          </li>
                          <li>
                            <a href="#"><i class="fa fa-percent"></i> Sales</a>
                          </li>
                          <li>
                            <a href="#"><i class="fa fa-sign-out"></i> Transfer</a>
                          </li>
                          <li>
                            <a href="#"><i className="fa fa-star"></i> Burns</a>
                          </li>
                          <li>
                            <a href="#"><i class="fa fa-window-maximize"></i> Bids</a>
                          </li>
                        </ul>
                        <a href="#" className="clear-btn">Clear All</a>
                      </div>
                    </div>
                  </div>
                </div>


                {/* <ul className="user-visitor-list">
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
                              <h5 style={{ color: "white" }}>{nft.accountViewModel.username ? nft.accountViewModel.username : 'Unnamed'}</h5>
                              <p style={{ marginTop: '4px', color: "white" }}>
                                <span style={{ marginLeft: "0px", color: "white" }} >{nft.expiryDate.split("T")[0]}</span>
                              </p>
                            </div>
                          </div>

                          <div className="price-eth">
                            <p>
                              <b><img  style={{
                                display: "inline-block",
                                maxWidth: "20px",
                                marginRight: "4px",
                                marginBottom: "4px"
                              }} />    {nft.price + " RLC"}</b>

                            </p>
                          </div>
                          {myData?.ownerAddress === WalletAddress && (
                            <div className="col-md-3 col-lg-3 col-sm-3 col-3">
                              {
                                Acceptloader ? (
                                  <button
                                    onClick={() => {
                                      setlastindex(index);
                                      setAcceptloader(false);
                                      acceptBidOffer(
                                        nft.id,
                                        nft.price,
                                        nft.accountViewModel.address,
                                        nft.nftResponseModel.contractAddress
                                      )
                                    }
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

                                    class="reg-btn-green"
                                    disabled>
                                    {
                                      index == lastindex ?
                                        <PulseLoader color="white" size="11" />
                                        : "Accept"
                                    }

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
              </ul> */}
              </>

            )}
            {openMenu2 && (
              <div id="zero3" className="onStep fadeIn">
                <div className="col-lg-12">
                  <p className="clrd" style={{ cursor: "pointer" }}>
                    <b style={{ cursor: "initial" }}>Contract Address : </b>
                    <a target="_blank" href={"https://testnet.redlightscan.finance/address/" + myData?.contractAddress} style={{ color: "orange" }}>
                      {myData?.contractAddress}
                    </a>
                  </p>
                  <p className="clrd">
                    <b>Token ID : </b>
                    {myData?.nftTokenId}
                  </p>
                  <p className="clrd">
                    <b>Metadata :</b> {myData?.isMinted ? 'Not editable' : 'Editable'}
                  </p>
                  {/* <p className="clrd">
                    <b>File Size : </b>
                    2048 x 2048 px.IMAGE(1.27MB)
                  </p> */}
                </div>
              </div>
            )}

          </section>



          <Modal centered show={filterTrigger} onHide={sellingModal}>

            <Modal.Body>
              {" "}
              <div className="row">
                <div className="col-md-12">
                  <form
                    name="contactForm"
                    id="contact_form"
                    className="form-border"
                    onSubmit={sellingHandler}
                  >
                    <div className="row">
                      <div className="col-md-7">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="field-set">
                              <label style={{ color: "#000000" }}>Selling Amount in RLC:</label>
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
                          </div>
                        </div>
                        {maxpriceofsell ? <p style={{ color: "red" }}>Price must be greater than 0.00000001</p> : sellnftpriceerror ? <p style={{ color: "red" }}>Price Cannot be negetive</p> : ""}
                        {maxpriceofsell ? <p style={{ color: "red" }}><></></p> : sellnftpriceerror1 ? <p style={{ color: "red" }}>Price Cannot be zero</p> : ""}


                      </div>
                    </div>
                    <div className="col-md-12">
                      <div id="submit" className="pull-left">
                        {checksaleminus1 ?
                          <button className="btn-main" style={{ opacity: "0.6" }} disabled >
                            Sell NFT

                          </button> :

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
                  WRLC
                </InputGroup.Text>
                <FormControl
                  placeholder="Amount"
                  type="number"
                  value={Makeofferinput}
                  disabled={WRLCBalance <= myData?.bidInitialMinimumAmount ? true : ''}
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
                        setMakeofferinput(e.target.value)
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
                myData?.bidInitialMinimumAmount > WRLCBalance ?
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
              Min bidding price: {myData?.bidInitialMinimumAmount} WRLC
            </Modal.Body>

            <Modal.Body>
              Max bidding price: {myData?.bidInitialMaximumAmount} WRLC
            </Modal.Body>

            <Modal.Body>
              Available balance: {WRLCBalance} WRLC
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
                      label="By checking this, I agree RLC Terms of Service "
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

              {expiryError ? (
                <>
                  <a
                    className="reg-btn w-100"
                    disabled={true}
                    style={{ opacity: 0.6 }}
                  >
                    Make Offer
                  </a>
                </>
              ) : (
                <>
                  {!isOfferInProgress ? (
                    <>
                      {makeofferbutton && isSwitchOn && expiryDateplacebid ? <a
                        // variant="primary"
                        className="reg-btn w-100"
                        disabled={!isSwitchOn}
                        onClick={postBidding}
                      >
                        Make Offer
                      </a> : (
                        <a
                          className="reg-btn w-100"
                          disabled={true}
                        >
                          Make Offer
                        </a>)
                      }</>) : (
                    <a
                      className="reg-btn w-100"
                      disabled={true}
                    >
                      <PulseLoader color="white" size="11" />
                    </a>
                  )}
                </>
              )}
              <a className="reg-btn w-100" onClick={handleClose}>
                Close
              </a>
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
      )
      }
    </div >
  );
};
export default UserNftDetails;

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));








import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/footer";
import AddNftAction from "../../Redux/Actions/NftActions/AddNftAction";
import defaultImg from "../../assets/images/default.png";
import {
  Modal,
  Row,
  Col,
  Form as Formm,
  Button,
} from "react-bootstrap";

import { LogoutAction } from "../../Redux/Actions/AuthActions/LogoutAction";
import AuthConnectAction, {
  AuthConnectRequest,
} from "../../Redux/Actions/AuthActions/AuthConnectAction";
import axios from "axios";

import { ValidateSignatureRequest } from "../../Redux/Actions/AuthActions/ValidateSignatureAction";
import http from "../../Redux/Api/http";
import moment from "moment";
import { PulseLoader, RingLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GetMyAllNftsAction from "../../Redux/Actions/NftActions/GetMyAllNftsAction";
import Web3 from "web3";
import "react-datepicker/dist/react-datepicker.css";
import GetNftMarketAction from "../../Redux/Actions/NftActions/GetNftMarketAction";
import { useHistory, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import connectMetaMaskaction, {
  WalletDisconnect,
} from "../../Redux/Actions/WalletActions/WalletAction";
import {
  mint,
  multiMint
} from "../../../src/metamask/index";
import GetMyNftByIdAction, {
  GetMyNftByIdRequest,
} from "../../Redux/Actions/NftActions/GetMyNftByIdAction";
import GetAllBlockChainAction from "../../Redux/Actions/Blockchain/GetAllBlockChainAction";
import GetMyAllCollectionsAction from "../../Redux/Actions/CollectionAction/GetMyAllCollections";
import GetAllCurrencyAction from "../../Redux/Actions/CurrencyAction/GetAllCurrencyAction";
import { toInteger } from "lodash";
import { showConsole } from "../../utils/common-functions";

import NumberFormat from "react-number-format";
const CreateSchema = Yup.object().shape({
  fileupload: Yup.mixed().required("File is required"),
  NFT_name: Yup.string().max(40).required("Name is required").matches(/^(?![\s.]+$)[a-zA-Z\s.]*$/,"Name must contain Alphabets"),
  item_extLink: Yup.string().url().nullable(),
  item_desc: Yup.string().nullable(),
  no_NFT_Copy: Yup.number()
    .nullable(),
    NFT_price: Yup.number()
    .min(0.000001)
    .required("NFT Price required"),
  Royalty_price: Yup.number().min(0).max(25).integer().required("Royalty should between 0-25 and integer"),
  blockchain: Yup.string().nullable(),
  item_contactAddress: Yup.string(),
  item_tokenId: Yup.string().when("item_contactAddress", {
    is: true,
    then: Yup.string().required("Must enter Token Id"),
  }),
  collection: Yup.string().nullable(),
  bidStartDate: Yup.string(),
  bidEndDate: Yup.string(),
  payment_token: Yup.string().required("Payment Token required"),
});

function CreateNFT() {
  const { id } = useParams();

  const formRef = useRef();
  const Token = useSelector((state) => state.Login?.authResponse?.data?.token);

  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );
  const getAllBlockchain = useSelector(
    (state) => state?.GetAllBlockChain?.GetAllBlockChainResponse?.data
  );

  const getAllCollection = useSelector(
    (state) => state?.GetMyAllCollections?.GetAllMyCollectionsResponse?.data
  );

  const getAllCurrency = useSelector(
    (state) => state?.GetAllCurrency?.GetAllCurrencyResponse?.data
  );

  const history = useHistory();
  const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
  const [newnftid, setnewnftid] = useState(false)
  const [newnftid1, setnewnftid1] = useState(false)
  const [newaccountid, setnewaccountid] = useState(false)
  const [mintloader, setmintloder] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isToShowModal, setIsToShowModal] = useState(false);
  const [isloadingnft, setIsloadingnft] = useState(true);
  const [UnlockAbleContentt, SetUnlockAbleContentt] = useState(false);
  const [SensitiveContentt, SetSensitiveContentt] = useState(false);
  const [isBidOn, setIsBidOn] = useState(false);
  const [bidError, setBidError] = useState(false);
  const [bidError1, setBidError1] = useState(false);
  const [copies, setcopies] = useState("1/1" );
  const [collectionLoader, setCollectionLoader] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [finalCreatedProperties, setFinalCreatedProperties] = useState([]);
  const [selectedBlockchain, setSelectedBlockchain] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [currencyId, setCurrencyId] = useState(9);
  const [getAllCollectionData, setGetAllCollection] = useState();
  // const [allBlockchain, setAllBlockchain] = useState([]);
  const [showTokenId, setShowTokenId] = useState(false);
  const [getMasterAddress, setGetMasterAddress] = useState();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isvideo,setisvideo]=useState(false)
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const MyProfile = useSelector(
    (state) => state.MyProfile?.MyProfileResponse?.data
  );
  const [addPropertiesList, setAddPropertiesList] = useState([
    { name: "", type: "", rarity: null },
  ]);

  const [addLevelsList, setAddLevelsList] = useState([
    { speed: "", value: 3, of: 5 },
  ]);

  const [addStatsList, setAddStatsList] = useState([
    { speed: "", value: 3, of: 5 },
  ]);

  const [files, SetFiles] = useState();
  const [FileError, SetFileError] = useState("");
  const fileschange = (e) => {
    setisvideo(false)
    const file = e.target.files[0];
    if( file?.type === "video/mp4" || 
    file?.type ===  "video/mkv" || 
    file?.type ===  ".AVI"||
    file?.type ===  ".avi"||
    file?.type ===  ".MP4"  )
    { setisvideo(true)  }
    if (
      file?.type === "image/jpeg" ||
      file?.type === "image/png" ||
      file?.type === "image/jpg" ||
      file?.type === "image/gif" ||
      file?.type === "video/mp4" || 
      file?.type ===  "video/mkv" || 
      file?.type ===  ".AVI"||
      file?.type ===  ".avi"||
      file?.type ===  ".MP4"
    ) {
      SetFileError(null);
      SetFiles(file);
    } else {
      SetFileError("Invalid File Format ");
      SetFiles(null);
    }
  };
  const Logoutt = async () => {
    await dispatch(WalletDisconnect());
    await dispatch(AuthConnectRequest());
    await dispatch(LogoutAction());
    await dispatch(ValidateSignatureRequest())
    localStorage.setItem("loggedinwallet", "false")
    localStorage.setItem("userblock", "false")
  };

  const [show, setShow] = useState(false);
  const [levelShow, setLevelShow] = useState(false);
  const [statsShow, setStatsShow] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);
  const [nftImage, setNftImage] = useState("")
  const [params, setParams] = useState();
  const [orgCheck, setOrgCheck] = useState(true);

  // usman's change start
  const [organization, setOrganization] = useState([]);
  const [orgId, setOrgID] = useState(null)
  const [selectedOrgnization, setSelectedOrgnization] = useState(null)
  // usman's change end

  const [Whtelabel, setWhitelabel] = useState([])
  const [profileData, setProfileData] = useState();
  const [t_collectionid, sett_collectionid] = useState()
  const [t_BlockChianid, Sett_BlockChianid] = useState()
  const [Rateinusd, setRateinusd] = useState()

  useEffect(() => {
    if (getAllCollection) {
      setcollectiondata()
    }
  }, [getAllCollection])
  useEffect(() => {

    http
      .get(httpUrl + "/api/v1/Nft/GetRateInUSD")
      .then((res) => {
        setRateinusd(res.data.data)
      })
      .catch((error) => {
      });
    http
      .get(httpUrl + "/api/v1/Account/GetAllWhiteLableAddresses")
      .then((res) => {
        setWhitelabel(res.data.data)
        console.log("white label", res?.data)
      })
      .catch((error) => {

        if (error?.status === 400) Logoutt()

      });
  }, [])


  const setcollectiondata = async (e) => {
    setGetAllCollection(getAllCollection)
    sett_collectionid(getAllCollection[0]?.id)

    await dispatch(GetAllBlockChainAction()).then(
      async (blockchainApiData) => {
        Sett_BlockChianid(blockchainApiData?.data[0]?.chainID)
      }).catch((error) => { });
    setCollectionLoader(false)
  }
  const handleClose = () => {
    setShow(false);
  }

  useEffect(() => {
    setTimeout(() => {
      setLoader(true);
    }, 3000);
  });
  useEffect(() => {
    setTimeout(() => {
      setPageLoader(false);
    }, 2000);
  });

  const [NFTData, SetNFTData] = useState({
    fileupload: "",
    no_NFT_Copy: "",
    NFT_name: "",
    item_desc: "",
    item_extLink: "",
    NFT_price: "",
    Royalty_price: 0,
    item_supply: 1,
    blockchain: "",
    item_Freezemetadata: "",
    item_UnlockAbleContent: "",
    item_PropertyList: addPropertiesList,
    item_LevelsList: addLevelsList,
    item_StatsList: addStatsList,
    item_contactAddress: "",
    item_tokenId: "",
    collection: "",
    payment_token: 9,
    bidStart: "",
    bidEnd: "",
  });
  const inputhandler = (e) => {
    const { name, value } = e.target;
    // // console.log({ name, value });
    SetNFTData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const addMoreProperty = () => {
    setAddPropertiesList((prev) => {
      return [...prev, { name: "", type: "", rarity: null }];
    });
  };




  // const getOrganizations = async (e) => {
  //   await axios
  //     .get(
  //       httpUrl + `/api/v1/Account/GetUserAccount?address=${WalletAddress}&logedinWalletAddress=${WalletAddress}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Token}`,
  //         },
  //       }
  //     )
  //     .then((resp) => {
  //       setOrganization(resp.data.data?.accountViewModel.organizationName)
  //       setOrgCheck(false)
  //     })
  // };



  const getOrganizations = (e) => {
    axios
      .get(
        httpUrl + "/api/v1/Organization/GetAllOrganizationForNfts",
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((resp) => {

        setOrganization(resp?.data?.data)
        if (resp?.data?.data?.length > 0) setSelectedOrgnization(resp?.data?.data[0])

      })

  };


  useEffect(async () => {
    await http
      .get(httpUrl + "/api/v1/Nft/GetMasterAddress")
      .then((res) => {
        setGetMasterAddress(res?.data?.data?.address);
      })
      .catch((error) => {
      });

    getOrganizations()
  }, [])

  useEffect(async () => {
    let params = window.location.pathname;
    setParams(params.split("/")[2]);

    if (id) {
      await dispatch(GetAllBlockChainAction()).then(
        async (blockchainApiData) => {
          await dispatch(GetMyAllCollectionsAction()).then(
            async (CollectionApiData) => {
              await dispatch(GetAllCurrencyAction()).then(
                async (allCurrencyApiData) => {
                  await dispatch(GetMyNftByIdAction(id))
                    .then(async (res) => {
                      const data = res.data;
                      // fileschange(data.image);
                      const extractedBlockchain =
                        await blockchainApiData?.data?.find((item, index) => {
                          return item?.shortName == data?.blockChainName;
                        });
                      setSelectedBlockchain(extractedBlockchain);
                      const collectionExtracted =
                        await CollectionApiData?.data?.find((item, index) => {
                          return data.collectionId == item.id;
                        });
                      const paymentExtracted =
                        await allCurrencyApiData?.data?.find((item, index) => {
                          return data.currencyId == item.id;
                        });
                      setAddPropertiesList(data?.nftProperties)
                      setFinalCreatedProperties(data?.nftProperties)
                      setSelectedOrgnization({ id: data.organizationId, name: data.organizationName })

                      SetNFTData((prev) => {
                        return {
                          ...prev,
                          fileupload: data.image,
                          NFT_name: data?.name,
                          item_desc: data?.description === "null" || data?.description === null ? null : data?.description,
                          item_extLink: data?.externalLink,
                          NFT_price: data?.buyPrice,
                          item_supply: 1,
                          Royalty_price: data?.royality,
                          item_PropertyList: addPropertiesList,
                          item_LevelsList: addLevelsList,
                          item_StatsList: addStatsList,
                          item_contactAddress: data?.contractAddress,
                          item_tokenId: data?.nftTokenId,
                          collection: data?.collectionId,
                          payment_token: data?.currencyId,
                          bidStartTime: startDate,
                          bidEndTime: endDate,
                          blockchain: extractedBlockchain?.chainID,
                          nftid: data?.id
                        };
                      });
                      setCollectionId(data?.collectionId);

                      setIsloadingnft(false)
                      // setCurrencyId(data?.currencyId);

                      // await setTimeout(() => {
                      formRef.current.setValues({
                        fileupload: data?.image,
                        NFT_name: data?.name,
                        item_desc: data?.description === "null" || data?.description === null ? null : data?.description,
                        item_extLink: data?.externalLink,
                        NFT_price: data?.buyPrice,
                        Royalty_price: data?.royality,
                        item_supply: 1,
                        blockchain: extractedBlockchain?.chainID,
                        item_PropertyList: "",
                        item_contactAddress: data?.contractAddress,
                        item_tokenId: "",
                        collection: data?.collectionId,
                        payment_token: data?.currencyId,
                        bidStartDate: startDate,
                        bidEndDate: endDate,
                      });

                      SetFiles(data?.image);
                      // }, 2000);
                    })
                    .catch((error) => { });
                }
              );
            }
          );
        }
      );
    } else {

      setIsloadingnft(false)
      dispatch(GetMyNftByIdRequest());

    }
  }, [id]);

  useEffect(async () => {

  }, []);



  const removeProperty = (index) => {
    if (addPropertiesList.length == 0) return;
    else {
      let filteredList = [...addPropertiesList.filter((item, i) => i != index)];
      setAddPropertiesList(filteredList);
    }
  };

  const characterCahngeHandler = (e, index) => {
    const itemToChange = addPropertiesList.find((item, i) => index === i);
    const ind = addPropertiesList.indexOf(itemToChange);
    addPropertiesList[ind].name = e.target.value;
    const data = [...addPropertiesList];
    setAddPropertiesList(data);
  };

  const maleCahngeHandler = (e, index) => {
    const itemToChange = addPropertiesList.find((item, i) => index === i);
    const ind = addPropertiesList.indexOf(itemToChange);
    addPropertiesList[ind].type = e.target.value;
    const data = [...addPropertiesList];

    setAddPropertiesList(data);
  };

  const RarityHandler = (e, index) => {
    const itemToChange = addPropertiesList.find((item, i) => index === i);
    const ind = addPropertiesList.indexOf(itemToChange);
    let val = e.target.value;
    if (val > 100) {
      val = toInteger(val / 100)
    }
    if (val < 0) {
      val = 0
    }

    addPropertiesList[ind].rarity =  toInteger( val );
    const data = [...addPropertiesList];

    setAddPropertiesList(data);
  };

  const toggleLevelModal = () => {
    setLevelShow(!levelShow);
  };

  const toggleOnPropertiesModal = () => {
    setShow(true);
  };
  const switchStatus = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const addMoreLevel = () => {
    setAddLevelsList((prev) => {
      return [...prev, { speed: "", value: 3, of: 5 }];
    });
  };
  const speedCahngeHandler = (e, index) => {
    const itemToChange = addLevelsList.filter((item, i) => index === i);
    const remainingItems = addLevelsList.filter((item, i) => index !== i);
    itemToChange[0].speed = e.target.value;
    setAddLevelsList([...remainingItems, itemToChange[0]]);
  };
  const removeLevel = (index) => {
    if (addLevelsList.length == 1) return;
    else {
      let filteredList = [...addLevelsList.filter((item, i) => i != index)];
      setAddLevelsList(filteredList);
    }
  };
  const speedValueChangeHandler = (e, index) => {
    const itemToChange = addLevelsList.filter((item, i) => index === i);
    const remainingItems = addLevelsList.filter((item, i) => index !== i);
    if (e.target.value < 0) return;
    if (e.target.value > itemToChange[0].of) return;
    itemToChange[0].value = e.target.value;
    setAddLevelsList([...remainingItems, itemToChange[0]]);
  };
  const speedOfChangeHandler = (e, index) => {
    const itemToChange = addLevelsList.filter((item, i) => index === i);
    const remainingItems = addLevelsList.filter((item, i) => index !== i);
    if (e.target.value < 0) return;
    if (e.target.value < itemToChange[0].value) return;
    itemToChange[0].of = e.target.value;
    setAddLevelsList([...remainingItems, itemToChange[0]]);
  };

  const toggleStatModal = () => {
    setStatsShow(!statsShow);
  };

  const addMoreStats = () => {
    setAddStatsList((prev) => {
      return [...prev, { speed: "", value: 3, of: 5 }];
    });
  };
  const speedOfStatsCahngeHandler = (e, index) => {
    const itemToChange = addStatsList.filter((item, i) => index === i);
    const remainingItems = addStatsList.filter((item, i) => index !== i);
    itemToChange[0].speed = e.target.value;
    setAddStatsList([...remainingItems, itemToChange[0]]);
  };
  const removeStats = (index) => {
    if (addStatsList.length == 1) return;
    else {
      let filteredList = [...addStatsList.filter((item, i) => i != index)];
      setAddStatsList(filteredList);
    }
  };
  const speedValueOfStatsChangeHandler = (e, index) => {
    const itemToChange = addStatsList.filter((item, i) => index === i);
    const remainingItems = addStatsList.filter((item, i) => index !== i);
    if (e.target.value < 0) return;
    if (e.target.value > itemToChange[0].of) return;
    itemToChange[0].value = e.target.value;
    setAddStatsList([...remainingItems, itemToChange[0]]);
  };
  const speedOfOfStatsChangeHandler = (e, index) => {
    const itemToChange = addStatsList.filter((item, i) => index === i);
    const remainingItems = addStatsList.filter((item, i) => index !== i);
    if (e.target.value < 0) return;
    if (e.target.value < itemToChange[0].value) return;
    itemToChange[0].of = e.target.value;
    setAddStatsList([...remainingItems, itemToChange[0]]);
  };

  const UnlockAbleContent = (e) => {
    SetUnlockAbleContentt(e.target.checked);
  };

  const SensitiveContent = (e) => {
    SetSensitiveContentt(e.target.checked);
  };

  const savePropertiesList = () => {
    // // console.log(addPropertiesList);

    const filter = addPropertiesList?.filter((item, index) => {
      return item?.name.trim(' ' ) && item?.type.trim(' ' ) && item.rarity;
    });

    setAddPropertiesList([...filter]);

    setShow(false);
    setFinalCreatedProperties([...filter]);
  };

  const onsubmitHandler = async (e) => {
    setIsLoading(true);
    var bodyFormData = new FormData();
    bodyFormData.append("OwnerAddress", WalletAddress);
    bodyFormData.append("Name", NFTData.NFT_name);
    bodyFormData.append("ExternalLink", NFTData.item_extLink ? NFTData.item_extLink : " ");
    bodyFormData.append("Description", NFTData.item_desc);
    bodyFormData.append("UnlockableContent", UnlockAbleContentt);
    bodyFormData.append("CurrencyId", NFTData?.payment_token);


    // usman's change start

    bodyFormData.append("OrganizationName", selectedOrgnization.name);
    bodyFormData.append("OrganizationId", selectedOrgnization.id);

    // usman's change end



    bodyFormData.append(
      "UnlockableContentNote",
      NFTData.item_UnlockAbleContent
    );
    bodyFormData.append("ChainId", t_BlockChianid);
    bodyFormData.append("SensitiveContent", SensitiveContentt);
    bodyFormData.append("CollectionId", t_collectionid);
    bodyFormData.append("BlockChainName", selectedBlockchain?.shortName);
    bodyFormData.append(
      "Royality",
      NFTData.Royalty_price
    );
    if (id) {
      finalCreatedProperties?.map((x, index) => {
        bodyFormData.append("NftProperties[" + index + "].name", x.name)
        bodyFormData.append("NftProperties[" + index + "].type", x.type)
        bodyFormData.append("NftProperties[" + index + "].rarity", x.rarity)
      })
    }
    else {
      bodyFormData.append(
        "NftProperties",
        JSON.stringify(finalCreatedProperties)
      );
    }
    bodyFormData.append("NftLevels", []);
    bodyFormData.append("NftStats", []);
    if (NFTData.item_contactAddress) {
      bodyFormData.append("ContractAddress", NFTData.item_contactAddress);
      bodyFormData.append("TokenId", NFTData.item_tokenId);
    }
    bodyFormData.append("Image", files);
    bodyFormData.append("Price", NFTData.NFT_price);
    if (id) {
      bodyFormData.append("NftId", NFTData?.nftid);
      bodyFormData.append("freezeData", isSwitchOn);
      if (isSwitchOn === true) {
        let params = window.location.pathname;
        await http
          .get(
            httpUrl + `/api/v1/Nft/GetMyNftById?nftId=${params.split("/")[3]}`
          )
          .then(async (nftData) => {
            var payload;
            const amount = parseInt(
              Web3.utils.toWei(String(NFTData.NFT_price))
            ).toString(16);
            payload = [
              {
                to: nftData.data.data.ownerAddress,
                uri: nftData.data.data.ownerImage
                  ? nftData.data.data.ownerImage
                  : nftData.data.data.ownerAddress,
                tokenId: nftData.data.data.nftTokenId,
              },
            ];
            dispatch(
              multiMint(payload, nftData.data.data.contractAddress, nftData.data.data.royality)
                .then(async (response) => {
                  setIsLoading(true);
                  bodyFormData.append("FeeTransactionHash", response.hash);
                  const str = response.hash;

                  toast.success(
                    `NFT Updating in process`,
                    {
                      position: "top-right",
                      
                      hideProgressBar: false,
                      autoClose: 3000,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    }
                  );
                  var postBody = {
                    nftId: NFTData?.nftid,
                    transactionHash: str,
                  };
                  delay(12000).then(async () => {
                    http.put(httpUrl + "/api/v1/Nft/EditNft", bodyFormData).then(async (res) => {
                      await http
                        .post(
                          httpUrl +
                          `/api/v1/Nft/FreezeNft?NftId=${NFTData?.nftid}&TransactionHash=${str}`,
                          postBody
                        )
                        .then((res) => {
                          setIsLoading(false);
                          setTimeout(async () => {
                            await dispatch(GetMyAllNftsAction()).then(
                              (response) => {
                                return history.push(
                                  `/usernftdetail/${response?.data[0].contractAddress}/${response?.data[0].nftTokenId}`
                                );
                              }
                            );
                            await dispatch(GetNftMarketAction());
                          }, 2000);
                          toast.success(`NFT Updated successfully`, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                        })
                        .catch((err) => {

                        });

                    })
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
                  setIsLoading(false);
                })
            ).catch((e) => {

            });
          })
          .catch((error) => {

          });
      } else if (isSwitchOn === false) {

        http.put(httpUrl + "/api/v1/Nft/EditNft", bodyFormData).then((res) => {
          setTimeout(async () => {
            await dispatch(GetMyAllNftsAction()).then((response) => {
              return history.push(
                `/usernftdetail/${response?.data[0].contractAddress}/${response?.data[0].nftTokenId}`
              );
            });
            await dispatch(GetNftMarketAction());
          }, 2000);
          toast.success(`NFT Updated successfully`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsLoading(false);
        });
      }
    } else {
      http
        .get(httpUrl + "/api/v1/Nft/GetNftMintingFee")
        .then((res) => {
          const amount = parseInt(
            Web3.utils.toWei(String(res?.data?.data.nftFee))
          ).toString(16);
          var payload;
          if (NFTData.item_contactAddress) {
            payload = [
              {
                from: WalletAddress,
                to: NFTData.item_contactAddress,
                value: amount,
              },
            ];
          } else {
            payload = [
              {
                from: WalletAddress,
                to: getMasterAddress,
                value: amount,
              },
            ];
          }
          // console.table([...bodyFormData])
          dispatch(AddNftAction(bodyFormData))
            .then(async (res) => {
              setIsLoading(false);
              await dispatch(GetMyAllNftsAction()).then((response) => {
                setnewnftid(response?.data[0].contractAddress)
                setnewnftid1(response?.data[0].id)
                setnewaccountid(response?.data[0].nftTokenId)
                setIsToShowModal(true)
              });
              await dispatch(GetNftMarketAction());
            })
            .catch((error) => {
              setIsLoading(false);
              toast.error(`${error?.message}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            });
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  };

  const onsubmitHandler1 = async (e) => {
    setIsLoading(true);
    setIsLoading(true);
    setIsLoading(true);
    setmintloder(true);
    var bodyFormData = new FormData();
    bodyFormData.append("OwnerAddress", WalletAddress);
    bodyFormData.append("Name", NFTData.NFT_name);
    bodyFormData.append("ExternalLink", NFTData.item_extLink ? NFTData.item_extLink : " ");
    bodyFormData.append("Description", NFTData.item_desc);
    bodyFormData.append("UnlockableContent", UnlockAbleContentt);
    bodyFormData.append("CurrencyId", NFTData?.payment_token);
    bodyFormData.append(
      "UnlockableContentNote",
      NFTData.item_UnlockAbleContent
    );
    bodyFormData.append("ChainId", t_BlockChianid);
    bodyFormData.append("SensitiveContent", SensitiveContentt);
    bodyFormData.append("CollectionId", t_collectionid);
    bodyFormData.append("BlockChainName", selectedBlockchain?.shortName);
    bodyFormData.append(
      "Royality",
      NFTData.Royalty_price
    );
    if (id) {
      finalCreatedProperties?.map((x, index) => {
        bodyFormData.append("NftProperties[" + index + "].name", x.name)
        bodyFormData.append("NftProperties[" + index + "].type", x.type)
        bodyFormData.append("NftProperties[" + index + "].rarity", x.rarity)
      })
    }
    else {
      bodyFormData.append(
        "NftProperties",
        JSON.stringify(finalCreatedProperties)
      );
    }
    bodyFormData.append("NftLevels", []);
    bodyFormData.append("NftStats", []);
    if (NFTData.item_contactAddress) {
      bodyFormData.append("ContractAddress", NFTData.item_contactAddress);
      bodyFormData.append("TokenId", NFTData.item_tokenId);
    }
    bodyFormData.append("Image", files);
    bodyFormData.append("Price", NFTData.NFT_price);
    bodyFormData.append("NftId", newnftid1);
    bodyFormData.append("freezeData", isSwitchOn);
    let params = window.location.pathname;
    await http
      .get(
        httpUrl + `/api/v1/Nft/GetMyNftById?nftId=` + newnftid1
      )
      .then(async (nftData) => {
        var payload;
        const amount = parseInt(
          Web3.utils.toWei(String(NFTData.NFT_price))
        ).toString(16);
        payload = [
          {
            to: nftData.data.data.ownerAddress,
            uri: nftData.data.data.ownerImage
              ? nftData.data.data.ownerImage
              : nftData.data.data.ownerAddress,
            tokenId: nftData.data.data.nftTokenId,
          },
        ];
        await dispatch(
          multiMint(payload, nftData.data.data.contractAddress, nftData.data.data.royality)
            .then(async (response) => {
              setIsLoading(true);
              setmintloder(true);
              bodyFormData.append("FeeTransactionHash", response.hash);
              const str = response.hash;

              toast.success(
                `NFT Updating in process`,
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
              var postBody = {
                nftId: newnftid1,
                transactionHash: str,
              };
              delay(12000).then(async () => {
                http.put(httpUrl + "/api/v1/Nft/EditNft", bodyFormData).then(async (res) => {
                  await http
                    .post(
                      httpUrl +
                      `/api/v1/Nft/FreezeNft?NftId=${newnftid1.toString()}&TransactionHash=${str}`,
                      postBody
                    )
                    .then((res) => {
                      setTimeout(async () => {
                        await dispatch(GetMyAllNftsAction()).then(
                          (response) => {
                            return history.push(
                              `/usernftdetail/${response?.data[0].contractAddress}/${response?.data[0].nftTokenId}`
                            );
                          }
                        );
                        await dispatch(GetNftMarketAction());
                      }, 9000);
                      toast.success(`NFT Updated successfully`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                    })
                    .catch((err) => {

                    });

                })
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
              setIsLoading(false);
              setmintloder(false);
            })
        ).catch((e) => {
          setmintloder(false);
        });
      })
      .catch((error) => {
        setmintloder(false);

      });

  };

  return (
    <div>
      {pageLoader ? (
        <div className="spacer-10">
          <br />
          <br />
          <br />
          <br />
          <div className="col-sm-12 d-flex justify-content-center">
            <RingLoader color="orange" size="80" />
          </div>
        </div>
      ) : (
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

          <section className="jumbotron breadcumb no-bg">
            <div className="small-pnl secnd-anime">
              <div className="bg-layer"></div>
            </div>
            <div className="mainbreadcumb">
              <div className="container">
                <div className="row m-10-hor">
                  <div className="col-12">
                    <h1 className="text-center">
                      {id ? "Update " : "Create New "}NFT
                    </h1>
                    {/* <nav aria-label="breadcrumb">
                      <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Create New NFT</li>
                      </ol>
                    </nav> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {isloadingnft ? (
            <div className="col-sm-12 d-flex justify-content-center">
              <RingLoader color="orange" size="60" />
            </div>
          ) :
            <>
              <section className="container">
                <div className="row">
                  <div className="col-lg-8 mb-5">
                    <Formik
                      validationSchema={CreateSchema}
                      innerRef={formRef}
                      onSubmit={() =>   { onsubmitHandler() }}
                      validator={() => ({})}
                      initialValues={{
                        NFT_name: "",
                        item_extLink: "",
                        item_desc: "",
                        no_NFT_Copy: "",
                        NFT_price: "",
                        Royalty_price: 0,
                        blockchain: "",
                        fileupload: "",
                        collection: "",
                        payment_token: 9,
                        item_contactAddress: "",
                        item_tokenId: "",
                        bidStartDate: "",
                        bidEndDate: "",
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleSubmit,
                        handleChange,
                        setFieldValue,
                      }) => (
                        <Form
                          id="form-create-item"
                          className="form-border"
                          onSubmit={handleSubmit}
                        >
                          {/* {id ? setFieldValue(values?.blockchain) : ""} */}
                          <div className="field-set">

                            <div className="spacer-10"></div>
                            <h5 className="text-dark">Upload file</h5>
                            <div className="d-create-file">
                              <p
                                id="file_name"
                                className={FileError ? "text-danger" : ""}
                                style={{ textAlign: "center" }}
                              >
                                {FileError && FileError}
                                {/* @ts-ignore */}
                                {files
                                  ? //  @ts-ignore
                                  files?.name || files
                                  : "Please Select PNG, JPG, JPEG GIF or mp4"}
                              </p>
                              {/* {files.map((x) => (
                    <p key="{index}">{x.name}</p>
                  ))} */}
                              <div className="browse">
                                <input
                                  type="button"
                                  id="get_file"
                                  name="fileupload"
                                  className="btn-main whiter"
                                  value="Upload"
                                />
                                <input
                                  id="upload_file"
                                  type="file"
                                  name="fileupload"
                                  onChange={(e) => {
                                    fileschange(e);
                                    handleChange(e);
                                  }}
                                />
                              </div>
                            </div>
                            {errors.fileupload && touched.fileupload && (
                              <div className="text-red">{errors.fileupload}</div>
                            )}
                            <div className="spacer-10"></div>

                            <h5 className="text-dark">Name of the NFT</h5>
                            <input
                              type="text"
                              onChange={(e) => {
                                inputhandler(e);
                                handleChange(e);
                              }}
                              maxLength={25}
                              value={values.NFT_name}
                              name="NFT_name"
                              id="NFT_name"
                              className="form-control"
                              placeholder="NFT Name"
                            />

                            {errors.NFT_name && touched.NFT_name && (
                              <div className="text-red">{errors.NFT_name}</div>
                            )}



                            <div className="spacer-10"></div>
                            <h5 className="text-dark">Content Creator</h5>
                            <p>Individual or Entity (only if the IPs rights have been assigned to the Entity by the Individual(s))</p>
               
                         {organization?.find((x)=>x.id==selectedOrgnization?.id)?.isBlock?
                                    <p style={{color:"red"}}>Organization previously selected is blocked </p>:<></>      }
                              {console.log(organization.find((x)=>x.id==selectedOrgnization?.id),"zain"  )   }
                            <select className="form-select form-control custom-select-1"
 
                              value={selectedOrgnization?.id}
                              onChange={(data) => {
                                console.log("this is selected  ::  ", data.target.value)
                                organization?.filter((x)=>x.isBlock!=true)?.map(item => {
                                  if (item.id == data.target.value) {
                                    setSelectedOrgnization({ name: item.name, id: data.target.value })
                                  }
                                })
                              }
                              }>
                              {organization?.filter((x)=>x.isBlock!=true) ?.map((data) => <option value={data.id} key={data.name}>{data.name} </option>)}
                            </select>


                            {/* {orgCheck ? (
                              <PulseLoader color="white" size="11" />

                            ) : (
                              <>
                                <input
                                  disabled={organization ? true : false}
                                  value={organization} className="form-control"
                                  autoComplete="off" placeholder="Organization Name" />
                              </>
                            )} */}


                            <div className="spacer-10"></div>
                            <h5 className="text-dark">Description (Optional)</h5>
                            <textarea
                              data-autoresize
                              onChange={(e) => {
                                inputhandler(e);
                                handleChange(e);
                              }}
                              value={values.item_desc}
                              name="item_desc"
                              maxLength={500}
                              id="item_desc"
                              className="form-control"
                              placeholder="e.g. 'This is very limited item'"
                            ></textarea>

                            {errors.item_desc && touched.item_desc && (
                              <div className="text-red">{errors.item_desc}</div>
                            )}
                            <div className="spacer-10"></div>
                            <h5 className="text-dark">External Link (Optional)</h5>
                            <input
                              type="text"
                              onChange={(e) => {
                                inputhandler(e);
                                handleChange(e);
                              }}
                              value={values.item_extLink}
                              name="item_extLink"
                              id="item_extLink"
                              className="form-control"
                              placeholder="e.g. 'https://www.yoursite.com/item/123'"
                            />
                            {errors.item_extLink && touched.item_extLink && (
                              <div className="text-red">
                                Link must be URL
                              </div>
                            )}


                            <div className="spacer-single"></div>
                            <h5 className="text-dark">Number of NFT Editions (Optional)</h5>
                              <NumberFormat
        value={  copies   }
        onValueChange={v => {setcopies(v.formattedValue );console.log(v)  } }
        allowedDecimalSeparators={["/"]}
        fixedDecimalScale
        className="form-control"
        // decimalScale={2}
        decimalSeparator="/"
        isNumericString
        thousandSeparator=" "
      />
                            {/* <input
                                type="number"

                                onChange={(e) => {
                                  inputhandler(e);
                                  handleChange(e);
                                }}
                                // min="2"
                                // max="25"
                                style={{ width: "100%" }}
                                value={values.no_NFT_Copy}
                                  name="no_NFT_Copy"
                                    id="no_NFT_Copy"
                                className="form-control"
                                placeholder="Number Of NFT copies"
                              /> */}
                            {/* < input name="no_NFT_Copy" onChange={(e) => {
                              // inputhandler(e);
                              handleChange(e);
                            }}
                              id="no_NFT_Copy" className="form-control" type="number" autoComplete="off" placeholder="Number Of NFT copies" /> */}
                            {errors.no_NFT_Copy && touched.no_NFT_Copy && (
                              <div className="text-red">
                                Value must be valid
                              </div>
                            )}


                            <div className="spacer-10"></div>
                            <h5 className="text-dark">Payment tokens</h5>

                            <select
                              className="form-select form-control custom-select-1"
                              aria-label="Default select example"
                              onChange={(e) => {
                                inputhandler(e);
                                handleChange(e);
                              }}
                              value={values.payment_token}
                              // defaultValue={getAllCurrency ? getAllCurrency[0].id : null}
                              name="payment_token"
                              style={{
                                backgroundColor: "rgb(255, 255, 255)",
                                color: "#3d3d3d",
                                border: "solid 1px #3d3d3d",
                              }}
                            >
                              <option
                                value={9}
                                style={{ border: "1px solid #02AAB0" }}
                              >
                                BNB
                              </option>
                              {getAllCurrency?.length == 1 ? <></>
                                :
                                <>

                                  {getAllCurrency?.map((item, index) => {
                                    return (
                                      <option
                                        // selected={index === 0}
                                        value={item.id}
                                        style={{ border: "1px solid #02AAB0" }}
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </>}
                            </select>

                            {errors.payment_token && touched.payment_token && (
                              <div className="text-red">{errors.payment_token}</div>
                            )}
                            <div className="spacer-10"></div>
                            <h5 className="text-dark" >Royalty</h5>
                            <p>(Content Creator percentage when NFT is resold)</p>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                              <input
                                type="number"
                                onChange={(e) => {
                                  inputhandler(e);
                                  handleChange(e);
                                }}
                                // min="2"
                                // max="25"
                                style={{ width: "100%" }}
                                value={values.Royalty_price}
                                name="Royalty_price"
                                id="Royalty_price"
                                className="form-control"
                                placeholder="enter royalty percentage "
                              />
                            </div>
                            {/* {errors. Royalty_price && touched. Royalty_price && (
                              <div className="text-red">{errors. Royalty_price}</div>
                            )} */}


                            {errors.Royalty_price && touched.Royalty_price && (
                              <div className="text-red"> Royalty should between 0-25 and integer  </div>
                            )}
                            <div className="spacer-10"></div>
                            <div className="row">
                              <div className="col-lg-6 col-md-6 col-sm-6">
                                <h5 className="text-dark" >NFT Price</h5>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 text-right mb-lef">
                                <span style={{ fontSize: "18px", paddingRight: "5%" }}  >
                                  [${
                                    values.NFT_price ? (values.NFT_price * Rateinusd)
                                      : (values.NFT_price * Rateinusd)

                                  }] </span>
                              </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                              <input
                                type="number"
                                onChange={(e) => {
                                  inputhandler(e);
                                  handleChange(e);
                                
                                }}
                                style={{ width: "100%" }}
                                value={values.NFT_price}
                                name="NFT_price"

                                id="NFT_price"
                                className="form-control"
                                placeholder="NFT price"
                              />

                            </div>
                            {errors.NFT_price && touched.NFT_price && (
                              <div className="text-red"> Price must be greater than or equal to 0.000001 </div>
                            )}
                            <div className="spacer-10"></div>

                            <h5 className="text-dark">Collection</h5>
                            <span className="span-space">
                              This is the collection where your item will appear.
                            </span>

                            {collectionLoader ? (
                              <>
                                <div>
                                  <PulseLoader color="orange" size="11" />
                                </div>
                              </>
                            ) : (
                              <>
                                {getAllCollectionData.length == 0 ? (
                                  <>
                                    <div className="spacer-10"></div>
                                    <div className="propChildd">
                                      <div className="child">
                                        <span className="spann">
                                          {" "}
                                          <i
                                            onClick={() =>
                                              history.push("/addcollection")
                                            }
                                            className="fa fa-fw"
                                            aria-hidden="true"
                                            title="Properties"
                                          >
                                            
                                          </i>{" "}
                                          <h3
                                            onClick={() =>
                                              history.push("/addcollection")
                                            }
                                            className="text-dark"
                                          >
                                            Add a collection
                                          </h3>
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <select
                                      className="form-select form-control custom-select-1"
                                      aria-label="Default select example"
                                      onChange={(e) => {
                                        sett_collectionid(e.target.value)
                                      }}
                                      value={t_collectionid}
                                      style={{
                                        backgroundColor: "rgb(232, 232, 232)",
                                        color: "#3d3d3d",
                                        border: "solid 1px #3d3d3d",
                                      }}
                                      name="collection"
                                    >

                                      {getAllCollectionData?.map((item, index) => {
                                        return (
                                          <>
                                            {

                                              index == 0 ?
                                                <option
                                                  value={item.id}
                                                  style={{ border: "1px solid #02AAB0" }}
                                                  selected
                                                >
                                                  {item.name}
                                                </option>
                                                :
                                                <option
                                                  value={item.id}
                                                  style={{ border: "1px solid #02AAB0" }}
                                                >
                                                  {item.name}
                                                </option>
                                            }
                                          </>
                                        );
                                      })}
                                    </select>
                                  </>
                                )}

                              </>
                            )}

                            {errors.collection && touched.collection && (
                              <div className="text-red">{errors.collection}</div>
                            )}
                            <>


                              <div className="spacer-10"></div>
                              <div className="" id="propeerty">
                                <div className="bottomBorderRed pb-2">
                                  <div className="propChild">
                                    <div className="child">
                                      <span className="spann">
                                        {" "}
                                        <i className="fas fa-bars"></i>{" "}
                                        <h3 className="text-dark">Properties* (Optional)</h3>
                                      </span>
                                      <span>
                                        *Only for those that have a collection based on the same character
                                      </span>
                                    </div>
                                    <div className="child2">

                                      <i
                                        onClick={toggleOnPropertiesModal}
                                        className="fa fa-fw"
                                        aria-hidden="true"
                                        title="Properties"
                                      >
                                        
                                      </i>
                                    </div>
                                  </div>
                                  <Row>
                                    {finalCreatedProperties &&
                                      finalCreatedProperties?.map((data, index) => {
                                        return (
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
                                        );
                                      })}
                                  </Row>
                                </div>

                              </div>

                            </>
                            <div className="spacer-60"></div>
                            <h5 className="text-dark">Blockchain</h5>
                            <select
                              className="form-select form-control custom-select-1"
                              aria-label="Default select example"
                              onChange={(e) => {
                                Sett_BlockChianid(e.target.value)
                              }}
                              value={values.blockchain}
                              style={{
                                backgroundColor: "rgb(255, 255, 255)",
                                color: "#3d3d3d",
                                border: "solid 1px #3d3d3d",
                              }}
                              name="blockchain"
                            >
                              {getAllBlockchain?.map((item, index) => {
                                return (
                                  <>
                                    {
                                      index == 0 ?
                                        <option
                                          value={item.chainID}
                                          style={{ border: "1px solid #02AAB0" }}
                                          selected
                                        >
                                          {item.name} ({item.shortName})
                                        </option>
                                        :
                                        <option
                                          value={item.chainID}
                                          style={{ border: "1px solid #02AAB0" }}
                                        >
                                          {item.name} ({item.shortName})
                                        </option>

                                    }</>
                                );
                              })}


                            </select>

                            {errors.blockchain && touched.blockchain && (
                              <div className="text-red">{errors.blockchain}</div>
                            )}

                            <div className="my-3"></div>


                            {


                              WalletAddress === params && id ? (
                                <>
                                  {
                                    Whtelabel?.some((value, index) => { return value?.address === WalletAddress }) ?
                                      <>
                                        <h5 className="text-dark">Freeze metadata?</h5>
                                        <Formm>
                                          <Formm.Switch
                                            type="switch"
                                            id="custom-switch"
                                            label="Checking it will permanently freeze the data and enable minting and transactions."
                                            checked={isSwitchOn}
                                            onChange={() => {
                                              switchStatus();
                                            }}
                                          />
                                        </Formm>
                                      </> : <>
                                        <h5 className="text-dark">Freeze metadata?</h5>
                                        <Formm>
                                          <Formm.Switch
                                            type="switch"
                                            id="custom-switch"
                                            label="Checking it will permanently freeze the data and enable minting and transactions."
                                            checked={isSwitchOn}
                                            onChange={() => {
                                              switchStatus();
                                            }}
                                          />
                                        </Formm>
                                      </>

                                  }


                                </>
                              ) : (
                                <></>
                              )}


                            <div className="spacer-10"></div>
                            <h5 className="text-dark">
                              Contract Address (Optional)
                            </h5>
                            <input
                              placeholder="If already minted"
                              type="text"
                              onChange={(e) => {
                                inputhandler(e);
                                handleChange(e);
                                if (e.target.value == "") {
                                  setShowTokenId(false);
                                } else {
                                  setShowTokenId(true);
                                }
                              }}
                              value={values.item_contactAddress}
                              name="item_contactAddress"
                              id="item_contactAddress"
                              className="form-control"
                              disabled={id}
                            />

                            <div className="spacer-10"></div>

                            {showTokenId ? (
                              <>
                                <h5 className="text-dark">Token Id</h5>
                                <input
                                  type="number"
                                  onChange={(e) => {
                                    inputhandler(e);
                                    handleChange(e);
                                  }}
                                  value={values.item_tokenId}
                                  name="item_tokenId"
                                  id="item_tokenId"
                                  className="form-control"
                                  placeholder="Enter the Token id "
                                />

                                {NFTData.item_contactAddress.length > 0 &&
                                  !NFTData.item_tokenId ? (
                                  <div className="text-red">Token Id required</div>
                                ) : (
                                  ""
                                )}
                              </>
                            ) : (
                              ""
                            )}

                            {/* <div className="spacer-10"></div>
                  <h5>Freeze Data</h5>
                  <input
                    type="text"
                    onChange={inputhandler}
                    value={NFTData.item_Freezemetadata}
                    name="item_Freezemetadata"
                    id="item_Freezemetadata"
                    className="form-control"
                    placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%"
                  /> */}
                            <div className="spacer-10"></div>
                            <div className="btn-cntnr" style={{ gap: 10 }}>
                              {isLoading ? (
                                <button
                                  disabled
                                  style={{
                                    backgroundColor: "orange",
                                    borderRadius: 20,
                                    height: 35,
                                    width: 130,
                                    borderWidth: 0,
                                  }}
                                >
                                  <PulseLoader color="white" size="11" />
                                </button>
                              ) : NFTData.item_contactAddress == "" ||
                                (NFTData.item_contactAddress.length > 0 &&
                                  NFTData.item_tokenId) ? (
                                <input
                                  type="submit"
                                  id="submit"
                                  
                                  className="btn-main whiter"
                                  value={`${id ? "Update" : "Create"} NFT`}
                                />
                              ) : (
                                <>
                                  <input
                                    id="submit"
                                    className="btn-secondary text-center"
                                    value={`${id ? "Update" : "Create"} NFT`}
                                    style={{
                                      width: 150,
                                      height: 35,
                                      borderRadius: 30,
                                      borderWidth: 0,
                                    }}
                                    disabled
                                  />
                                </>
                              )}
                               <>
                               {
isLoading?                     <input
style={{
  width: 150,
  height: 35,
  borderRadius: 30,
  borderWidth: 0,
}}
value={"Cancel"}
className="btn-main whiter"
/>
:                     <input
style={{
  width: 150,
  height: 35,
  borderRadius: 30,
  borderWidth: 0,
}}
value={"Cancel"}
className="btn-main whiter"
onClick={() => history.goBack()}
/>

                               }
                               </>
                           </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>

                  <div className="col-lg-4 col-sm-6 col-xs-12 word-break-breakall">
                    <h5 className="text-dark">Preview</h5>
                    <div className="nft__item m-0 preview-box">
                      <div className="author_list_pp " style={{ background: "none" }}>
                        {MyProfile?.profileImage ? (
                          <span>
                            <img className="lazy profice-avatar-margin" src={MyProfile?.profileImage ? httpUrl + "/" + MyProfile?.profileImage : defaultImg} alt="User.png" />
                            {/* <i className="fa fa-check"></i> */}
                          </span>
                        ) : (
                          <div style={{
                            width: 150, height: "auto",
                            // backgroundColor: "#02AAB0",
                            borderRadius: "100%",
                          }} >
                            <FaUserCircle size={50} />
                          </div>
                        )}
                      </div>
                      <div className="nft__item_wrap">
                        <span>
                          {id && NFTData?.fileupload == files ? (
                            <>
                            {
                                 files?.split(".")[1] === 'mp4' ? <video  controls={true} src={`${httpUrl}/${files}`}    width="100%" id="get_file_2" className="lazy nft__item_preview" alt="NFT.png" autoPlay={true} loop={true} />
                               :  <img src={`${httpUrl}/${files}`} id="get_file_2" className="lazy nft__item_preview" alt="NFT.png" />
                            }
                            
                            </>
                          ) : (
                             isvideo?
                             <video
                                      
                             width="100%"
                             src={
                               URL.createObjectURL(files)
                                
                            }    id="get_file_2" controls={true} className="lazy nft__item_preview " alt="NFT.png"  autoPlay={true} loop={true} />
                                 :
                             <img src={
                              files
                                ? URL.createObjectURL(files)
                                : "./img/collections/def.jpeg"
                            } id="get_file_2" className="lazy nft__item_preview " alt="NFT.png" />
                          )}
                        </span>
                      </div>
                      <div className="nft__item_info nft-item-margin">
                        <span className="Nfttitle break-all-characters">
                          <h4>
                            {NFTData?.NFT_name
                              ? NFTData.NFT_name
                              : "Item Title"}
                          </h4>
                        </span>
                        <div className="nft__NFT_price break-all-characters ">
                          {NFTData?.NFT_price ? NFTData.NFT_price + " " + "BNB" : "Item Price"}{" "}
                          {selectedBlockchain?.shortName}
                        </div>
                        <div className="nft__item_action">

                          {NFTData.NFT_price ? <>  {
                            NFTData.NFT_price ? (NFTData.NFT_price * Rateinusd)
                              : (NFTData.NFT_price * Rateinusd)

                          }{" "}$</> : <>Buy NFT</>}
                          {/* <span className="text-dark">Buy NFT</span> */}
                        </div>
                        {/* <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>50</span>
                </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          }
          <Footer />

          <Modal show={show} onHide={() => handleClose()} animation={true} centered>
            <Modal.Header className="modal-header-color">
              <Modal.Title className="text-light text-dark">
                Add Properties
              </Modal.Title>

              <button
                aria-label="Hide"
                onClick={handleClose}
                className="btn-close"
              />
            </Modal.Header>
            <Modal.Body className="modal-body-color">
              <p>
                Properties show up underneath your item, are clickable, and can
                be filtered in your collection's sidebar.
              </p>
              <div className="table-contaienrrr">
                <div className="table-contaienr-innerrr">
                  <div className="table-small">
                    <Row style={{ paddingBottom: "5px" }}>
                      <Col xs={1}></Col>
                      <Col xs={4}>
                        <span
                          className="text-light text-dark"
                          style={{ fontWeight: "bold", color: "black" }}
                        >
                          Type
                        </span>
                      </Col>
                      <Col xs={3}>
                        <span
                          className="text-light text-dark"
                          style={{ fontWeight: "bold", color: "black" }}
                        >
                          Name
                        </span>
                      </Col>
                      <Col xs={4}>
                        <span
                          className="text-light text-dark"
                          style={{ fontWeight: "bold", color: "black" }}
                        >
                          Percentage
                        </span>
                      </Col>
                    </Row>
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "scroll",
                        overflowX: "hidden",
                      }}
                    >
                      {addPropertiesList.map((item, index) => {
                        return (
                          <div
                            style={{
                              border: "1px solid #c7a7a7b9",
                              borderRadius: "4px",
                              // marginTop: "10px",
                            }}
                            key={index}
                          >
                            <Row style={{ height: "40px" }}>
                              <Col xs={1}>
                                <div
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                    cursor: "pointer",
                                    marginTop: "8px",
                                  }}
                                  onClick={() => {
                                    removeProperty(index);
                                  }}
                                >
                                  <CrossIcon />
                                </div>
                              </Col>
                              <Col
                                xs={4}
                                style={{
                                  borderRight: "1px solid #c7a7a7b9",
                                  borderLeft: "1px solid #c7a7a7b9",
                                  height: 40,
                                }}
                              >
                                <input
                                  placeholder="Character"
                                  type="text"
                                  maxLength={10}
                                  className="form-control"
                                  value={item.name}
                                  onChange={(e) => {
                                    characterCahngeHandler(e, index);
                                  }}
                                  style={{
                                    border: "none",
                                    outline: "none",
                                  }}
                                />
                              </Col>
                              <Col xs={3}
                                style={{
                                  borderRight: "1px solid #c7a7a7b9",
                                  borderLeft: "1px solid #c7a7a7b9",
                                  height: 40,
                                }}>
                                <input
                                  placeholder="Name"
                                  maxLength={10}
                                  onChange={(e) => {
                                    maleCahngeHandler(e, index);
                                  }}
                                  className="form-control"
                                  value={item.type}
                                  type="text"
                                  style={{
                                    border: "none",
                                    outline: "none",
                                  }}
                                />
                              </Col>
                              <Col xs={4}>
                                <input
                                  placeholder="Percentage"
                                  maxLength={10}
                                  onChange={(e) => {
                                    RarityHandler(e, index);
                                  }}
                                  className="form-control"
                                  value={item.rarity}
                                  type="number"
                                  style={{
                                    border: "none",
                                    outline: "none",
                                  }}
                                />
                              </Col>
                            </Row>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={addMoreProperty}
                style={{
                  padding: "10px",

                  border: "none",
                  fontWeight: "bold",
                  background: "rgb(255, 166, 0)",
                  color: "white",
                  marginTop: "12px",
                  cursor: "pointer",
                }}
              >
                Add more
              </button>
            </Modal.Body>
            <Modal.Footer className="modal-footer-color">
              <div style={{ textAlign: "center", width: "100%" }}>
                <button
                  style={{
                    background: "rgb(255, 166, 0)",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                  }}
                  onClick={savePropertiesList}
                >
                  Save
                </button>
              </div>
            </Modal.Footer>
          </Modal>

          <Modal
            show={levelShow}
            onHide={toggleLevelModal}
            animation={true}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "black", textAlign: "center" }}>
                Add Levels
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Levels show up underneath your item, are clickable, and can be
                filtered in your collection's sidebar.
              </p>
              <Row style={{ paddingBottom: "5px" }}>
                <Col sm={1}></Col>
                <Col sm={5}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Name
                  </span>
                </Col>
                <Col sm={5}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Value
                  </span>
                </Col>
              </Row>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "scroll",
                  overflowX: "hidden",
                }}
              >
                {addLevelsList.map((item, index) => {
                  return (
                    <div
                      style={{
                        border: "1px solid #c7a7a7b9",
                        borderRadius: "4px",
                        marginTop: "10px",
                      }}
                      key={index}
                    >
                      <Row style={{ height: "40px" }}>
                        <Col sm={1}>
                          <div
                            style={{
                              width: "25px",
                              height: "25px",
                              cursor: "pointer",
                              marginTop: "8px",
                            }}
                            onClick={() => {
                              removeLevel(index);
                            }}
                          >
                            <CrossIcon />
                          </div>
                        </Col>
                        <Col
                          sm={6}
                          style={{
                            borderRight: "1px solid #c7a7a7b9",
                            borderLeft: "1px solid #c7a7a7b9",
                          }}
                        >
                          <input
                            placeholder="Speed"
                            type="text"
                            onChange={(e) => {
                              speedCahngeHandler(e, index);
                            }}
                            style={{
                              border: "none",
                              width: "100%",
                              outline: "none",
                              height: "100%",
                            }}
                          />
                        </Col>
                        <Col sm={5}>
                          <Row
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <Col sm={5}>
                              <input
                                value={addLevelsList[index].value}
                                onChange={(e) => {
                                  speedValueChangeHandler(e, index);
                                }}
                                type="number"
                                style={{
                                  border: "none",
                                  width: "100%",
                                  outline: "none",
                                  height: "100%",
                                }}
                              />
                            </Col>
                            <Col sm={2}>
                              <span>Of</span>
                            </Col>
                            <Col sm={5}>
                              <input
                                value={addLevelsList[index].of}
                                onChange={(e) => {
                                  speedOfChangeHandler(e, index);
                                }}
                                type="number"
                                style={{
                                  border: "none",
                                  width: "100%",
                                  outline: "none",
                                  height: "100%",
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addMoreLevel}
                style={{
                  padding: "10px",
                  border: "2px solid rgb(255, 166, 0)",
                  color: "rgb(255, 166, 0)",
                  fontWeight: "bold",
                  background: "transparent",
                  borderRadius: "6px",
                  marginTop: "12px",
                  cursor: "pointer",
                }}
              >
                Add more
              </button>
            </Modal.Body>
            <Modal.Footer>
              <div style={{ textAlign: "center", width: "100%" }}>
                <button
                  style={{
                    background: "rgb(255, 166, 0)",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                  }}
                  onClick={toggleLevelModal}
                >
                  Save
                </button>
              </div>
            </Modal.Footer>
          </Modal>
          <Modal
            show={statsShow}
            onHide={toggleStatModal}
            animation={true}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "black", textAlign: "center" }}>
                Add Stats
              </Modal.Title>
              {/* <div style={{width:"20px",height:"20px",backgroundColor:"green"}}>
          <CrossIcon/>
          </div> */}
            </Modal.Header>
            <Modal.Body>
              <p>
                Stats show up underneath your item, are clickable, and can be
                filtered in your collection's sidebar.
              </p>
              <Row style={{ paddingBottom: "5px" }}>
                <Col sm={1}></Col>
                <Col sm={5}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Name
                  </span>
                </Col>
                <Col sm={5}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Value
                  </span>
                </Col>
              </Row>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "scroll",
                  overflowX: "hidden",
                }}
              >
                {addStatsList.map((item, index) => {
                  return (
                    <div
                      style={{
                        border: "1px solid #c7a7a7b9",
                        borderRadius: "4px",
                        marginTop: "10px",
                      }}
                      key={index}
                    >
                      <Row style={{ height: "40px" }}>
                        <Col sm={1}>
                          <div
                            style={{
                              width: "25px",
                              height: "25px",
                              cursor: "pointer",
                              marginTop: "8px",
                            }}
                            onClick={() => {
                              removeStats(index);
                            }}
                          >
                            <CrossIcon />
                          </div>
                        </Col>
                        <Col
                          sm={6}
                          style={{
                            borderRight: "1px solid #c7a7a7b9",
                            borderLeft: "1px solid #c7a7a7b9",
                          }}
                        >
                          <input
                            placeholder="Speed"
                            type="text"
                            onChange={(e) => {
                              speedOfStatsCahngeHandler(e, index);
                            }}
                            style={{
                              border: "none",
                              width: "100%",
                              outline: "none",
                              height: "100%",
                            }}
                          />
                        </Col>
                        <Col sm={5}>
                          <Row
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <Col sm={5}>
                              <input
                                value={addStatsList[index].value}
                                onChange={(e) => {
                                  speedValueOfStatsChangeHandler(e, index);
                                }}
                                type="number"
                                style={{
                                  border: "none",
                                  width: "100%",
                                  outline: "none",
                                  height: "100%",
                                }}
                              />
                            </Col>
                            <Col sm={2}>
                              <span>Of</span>
                            </Col>
                            <Col sm={5}>
                              <input
                                value={addStatsList[index].of}
                                onChange={(e) => {
                                  speedOfOfStatsChangeHandler(e, index);
                                }}
                                type="number"
                                style={{
                                  border: "none",
                                  width: "100%",
                                  outline: "none",
                                  height: "100%",
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addMoreStats}
                style={{
                  padding: "10px",
                  border: "2px solid rgb(255, 166, 0)",
                  color: "rgb(255, 166, 0)",
                  fontWeight: "bold",
                  background: "transparent",
                  borderRadius: "6px",
                  marginTop: "12px",
                  cursor: "pointer",
                }}
              >
                Add more
              </button>
            </Modal.Body>
            <Modal.Footer>
              <div style={{ textAlign: "center", width: "100%" }}>
                <button
                  style={{
                    background: "rgb(255, 166, 0)",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                  }}
                  onClick={toggleStatModal}
                >
                  Save
                </button>
              </div>
            </Modal.Footer>
          </Modal>
          <Modal centered show={isToShowModal} onHide={() => {
            history.push(
              `/usernftdetail/${newnftid}/${newaccountid} `
              //  `/usernftdetail/${response?.data[0].contractAddress}/${response?.data[0].nftTokenId}`
            ); setIsToShowModal(false)
          }}>
            <Modal.Header closeButton>
              {/* <Modal.Title >
                <p > Alert</p> </Modal.Title> */}
            </Modal.Header>
            <Modal.Body style={{ color: "red", textAlign: "center" }}>

              <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}  > Do you want to Mint  NFT?</p>
              <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between" }} >
                <button
                  style={{
                    width: 150,
                    height: 35,
                    borderRadius: 30,
                    borderWidth: 0,
                  }}
                  value={"Cancel"}
                  className="btn-main whiter"
                  onClick={() => history.push(
                    `/usernftdetail/${newnftid}/${newaccountid}`
                  )}
                >No </button>
                {
                  mintloader ? <button
                    disabled
                    style={{
                      backgroundColor: "orange",
                      borderRadius: 20,
                      height: 35,
                      width: 130,
                      borderWidth: 0,
                    }}
                  >
                    <PulseLoader color="white" size="11" />
                  </button> :

                    <button
                      style={{
                        width: 150,
                        height: 35,
                        borderRadius: 30,
                        borderWidth: 0,
                      }}
                      value={"Cancel"}
                      className="btn-main whiter"
                      onClick={() => { setmintloder(true); onsubmitHandler1(); setIsToShowModal(false) }}
                    >Yes </button>
                }
              </div>
            </Modal.Body>
          </Modal>

        </>
      )}
    </div>
  );
}
export default CreateNFT;

function CrossIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));
import React, { Component, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { RingLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';
import heart from "../../../assets/images/heart-icon.png";
import HERO_IMG from "../../../assets/images/Capture.jpg";
import http from '../../../Redux/Api/http';
import verified from "../../../assets/images/verified-icon.png";
import cryptocurrency from "../../../assets/images/cryptocurrency-icon.png";
import placebid from "../../../assets/images/placebid-icon.png";
import defaultImg from "../../../assets/images/default.png";
import { toast } from "react-toastify";
import AuthorList from '../../components/authorList';
import GetNftMarketAction from '../../../Redux/Actions/NftActions/GetNftMarketAction';
import AddFavouriteNftAction from '../../../Redux/Actions/NftActions/AddFavouriteNftAction';
import GetFavouriteNftAction from '../../../Redux/Actions/NftActions/GetFavouriteNftAction';
import NftItem from '../../shared/NftItem';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import axios from 'axios';

const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

class CustomSlide extends Component {
    render() {
        const { index, ...props } = this.props;
        return <div {...props}></div>;
    }
}

const LandingComp = () => {
    const [hotcollection, setHotCollection] = useState();
    const [colLoading, setColLoading] = useState(true);
    const [isloading, setIsloading] = useState(true);
    const isConnected = useSelector((state) => state.Login?.authResponse?.data);


    // const [isFavouriteInProgress, setIsFavouriteInProgress] = useState(false);
    // const [isDefavouriteInProgress, setIsDefavouriteInProgress] = useState(false);


    const history = useHistory();
    const dispatch = useDispatch();
    const [slidermarketnfts,setslidermarketnfts]=useState([])
    const [slidermarketnftsforbid,setslidermarketnftsforbid]=useState([])
    const Marketplaceprodu = useSelector(
        (state) => state.GetNftMarket?.GetNftMarketResponse?.data
    );


    const [NFTonbid, SetNftonBid] = useState(Marketplaceprodu?.filter((nft) => nft.isBidOpen == true).slice(0, 4));
    const [marketNfts, SetMarketNfts] = useState(Marketplaceprodu?.filter((nft) => nft.isBidOpen != true).slice(0, 4));

    useEffect(() => {

        SetMarketNfts(Marketplaceprodu?.filter((nft) => nft.isBidOpen != true).slice(0, 4));

        SetNftonBid(Marketplaceprodu?.filter((nft) => nft.isBidOpen == true).slice(0, 4));
    }, [Marketplaceprodu]);
    useEffect(()=>{
        axios({
            method: "get",
            url: httpUrl + "/api/v1/Nft/GetNftMarket",
        })
            .then((response) => {
            console.log("fresh",response.data.data)
             setslidermarketnfts(response.data.data?.filter((nft) => nft.isBidOpen != true).slice(0, 4)) 
             setslidermarketnftsforbid(response.data.data?.filter((nft) => nft.isBidOpen == true).slice(0, 4))
            })
            .catch((error) => {
            });
    },[])

 

    useEffect(async () => {
        setTimeout(async () => {
            apisCall()

        }, 3000);
    }, []);

    const apisCall = async () => {
        await http
            .get(httpUrl + "/api/v1/Nft/GetHotCollections")
            .then((res) => {
                setIsloading(false);

                setHotCollection(res.data.data);
                setColLoading(false);
            })
            .catch((error) => {

            });

        await dispatch(GetNftMarketAction())
            .then((res) => {
                setIsloading(false);
            })
            .catch((error) => {
                setIsloading(false);
                toast.error(`${error?.message}`, {
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






    const likeAndDisLikeCallback = async () => {
        apisCall();

    }





    // var settings = {
    //     infinite: false,
    //     speed: 500,
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     initialSlide: 0,
    //     responsive: [
    //         {
    //             breakpoint: 2000,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //                 infinite: true,
    //             },
    //         },
    //         {
    //             breakpoint: 1900,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //                 infinite: true,
    //             },
    //         },
    //         {
    //             breakpoint: 1600,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //                 infinite: true,
    //             },
    //         },
    //         {
    //             breakpoint: 1500,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //                 infinite: true,
    //             },
    //         },
    //         {
    //             breakpoint: 1400,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //                 infinite: true,
    //             },
    //         },
    //         {
    //             breakpoint: 1300,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //                 infinite: true,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 3,
    //                 slidesToScroll: 1,
    //                 infinite: true,
    //             },
    //         },
    //         {
    //             breakpoint: 991,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1,
    //                 infinite: true,
    //             },
    //         },
    //         {
    //             breakpoint: 767,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1,
               
    //                 infinite: true,

    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //                 infinite: true,

    //                 // autoplay: true,
    //                 // autoplaySpeed: 1000,
    //                 // style={}
    //             },
    //         },
    //     ],
    // };

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
    return (
        <>
            <section className="container ptb-o">
                <div className="row">
                    <div className="col-lg-12 col-xl-12 col-sm-12 col-sm-12 onStep css-keef6k">
                        <h3 className="style-brder">Featured</h3>
                        <h2>Featured Drops</h2>
                    </div>
                </div>
            </section>
            <section className="container">
                <div className="row">
                    <div className="col-lg-12">
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
                                {Marketplaceprodu?.length == 0 ? (
                                    <div className="col-sm-12 text-center">
                                        No NFT Record Found
                                    </div>
                                ) : (
                                    <>

                                            <Slider {...settings}>

                                                {slidermarketnfts?.map((nft, index) => {
                                                    return (
                                                        // <div className="nft">
                                                        <NftItem nft={nft} key={index} likeAndDisLikeCallback={likeAndDisLikeCallback} />

                                                        //  </div>
                                                    );

                                                })}

                                            </Slider>

                                     
                                    </>
                                )}
                                <div className="spacer-30"></div>
                                {/* 
                                <div className="row">
                                    <div className="col-lg-6 col-xl-6 col-sm-6 col-sm-6 onStep css-keef6k">
                                        <h3 class="style-brder">Top Creater</h3>
                                        <h2>Top Seller</h2>
                                    </div>

                                    <div className="col-lg-6 col-xl-6 col-sm-6 col-sm-6 text-right onStep css-keef6k">
                                    </div>

                                    <div className="col-lg-12">
                                        <AuthorList />
                                    </div>
                                </div> */}


                                <div className="row">
                                    <div className="col-lg-6 col-xl-6 col-sm-6 col-sm-6 onStep css-keef6k">
                                        <h3 class="style-brder">Featured</h3>
                                        <h2>Live Auctions</h2>
                                    </div>

                                    <div className="col-lg-6 col-xl-6 col-sm-6 col-sm-6 text-right onStep css-keef6k">
                                    </div>

                                    <div className="col-lg-12">
                                        {Marketplaceprodu?.length == 0 ? (
                                            <div className="col-sm-12 text-center">
                                                No NFT Record Found
                                            </div>
                                        ) : (
                                            <>

                                                <Slider {...settings}>
                                                    {slidermarketnftsforbid?.map((nft, index) => {
                                                        return (
                                                            // <div className="nft">
                                                            <NftItem nft={nft} key={index} likeAndDisLikeCallback={likeAndDisLikeCallback} />

                                                            // </div>
                                                        );

                                                    })}

                                                </Slider>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div class="spacer-single"></div><div className="row">
                                    <div className="col-lg-6 col-xl-6 col-sm-6 col-sm-6 onStep css-keef6k">
                                        <h2>News Letter</h2>
                                    </div>
                                    <div className="sapcer-10"></div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-xl-6 col-sm-6 col-sm-6 onStep css-keef6k">
                                        <h3 className="style-brder">COLLECTIONS</h3>
                                        <h2>Top Collections</h2>
                                    </div>

                                    <div className="col-lg-6 col-xl-6 col-sm-6 col-sm-6 text-right">

                                    </div>
                                    <div className="sapcer-10"></div>
                                </div>

                                {colLoading ? (
                                    <div className="col-sm-12 d-flex justify-content-center">
                                        <RingLoader color="orange" size="60" />
                                    </div>
                                ) : (
                                    <>
                                        <Slider {...settings}>
                                            {hotcollection?.map((collection, index) => (
                                                <div className="nft nft-payen">
                                                    <CustomSlide className="itm" index={1}>
                                                        <div className="nft_coll">
                                                            <div className="nft_wrap">
                                                                <span
                                                                    className="pic-demo"
                                                                    onClick={() =>
                                                                        history.push(
                                                                            `/nftsbycollections/${collection?.id}`
                                                                        )
                                                                    }

                                                                > <i className="fa fa-check"></i>
                                                                    <div className="table-cell">
                                                                        <div className="table-cell-center">
                                                                            <img
                                                                                src={httpUrl + "/" + collection?.bannerImage}
                                                                                className="lazy img-fluid"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                            <div className="nft_coll_pp">
                                                                <span
                                                                    onClick={() =>
                                                                        history.push(
                                                                            `/nftsbycollections/${collection?.id}`
                                                                        )
                                                                    }
                                                                >
                                                                    <img
                                                                        className="lazy"
                                                                        src={collection?.logoImage ? httpUrl + "/" + collection?.logoImage : defaultImg}
                                                                        alt=""
                                                                    />
                                                                </span>
                                                            </div>
                                                            <div className="nft_coll_info">
                                                                <span
                                                                    onClick={() =>
                                                                        history.push(
                                                                            `/nftsbycollections/${collection?.id}`
                                                                        )
                                                                    }
                                                                >
                                                                    <h4> {collection?.name.length > 15 ? collection?.name.slice(0, 14) + '...' : collection?.name}</h4>
                                                                </span>

                                                                <div className="full-div">
                                                                    {/* <ul className="owner-item-list">
                                                                        <li>
                                                                           {" "}
                                                                        </li>

                                                                        <li> */}


                                                                    <span>
                                                                        <b>{collection?.totalNft}</b>
                                                                        {" "}Items
                                                                    </span>

                                                                    {/* </li>
                                                                        <li>
                                                                            <span>
                                                                            {" "}
                                                                            </span>
                                                                        </li>
                                                                    </ul> */}

                                                                    <p style={{ textAlign: 'center' }}>
                                                                        {collection?.description}                                                                       </p>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CustomSlide>
                                                </div>

                                                // );
                                            ))}
                                        </Slider>
                                    </>
                                )}


                                <div className='pt-2'></div>
                                <div className="row">
                                    <NavLink to="/userguide" >
                                        <img src={HERO_IMG} />
                                    </NavLink>
                                </div>



                                {/* {filterData?.length && filterTrigger ? (
                                        <>
                                            {marketNfts?.length < filterData?.length && (
                                            <div className="col-lg-12">
                                                <div className="spacer-single"></div>
                                                <span
                                                onClick={loadMore}
                                                className="btn-main lead m-auto"
                                                >
                                                Load More Filter
                                                </span>
                                            </div>
                                            )}
                                        </>
                                        ) : (
                                        <>
                                        
                                        </>
                                        )} */}



                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default LandingComp
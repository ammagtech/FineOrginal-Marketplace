import React, { useEffect, useState } from "react";
import Breakpoint, {
  BreakpointProvider,
  setDefaultBreakpoints,
} from "react-socks";
import marketplace from "../../assets/images/market-place-icon.png";
import logo from "../../assets/images/Favicon1.png";
import walet from "../../assets/images/wallet.svg";
import bell from "../../assets/images/bell.svg";
import { Link, useHistory, useLocation } from "react-router-dom";
import useOnclickOutside from "react-cool-onclickoutside";
import { useDispatch, useSelector } from "react-redux";
import { LogoutAction } from "../../Redux/Actions/AuthActions/LogoutAction";
import { FaUserCircle } from "react-icons/fa";
import { ValidateSignatureRequest } from "../../Redux/Actions/AuthActions/ValidateSignatureAction";
import AuthConnectAction, {
  AuthConnectRequest,
} from "../../Redux/Actions/AuthActions/AuthConnectAction";
import http from "../../Redux/Api/http";
import localforage from "localforage";
import MyProfileAction, {
  MyProfileRequest,
} from "../../Redux/Actions/Account/MyProfileAction";
import { autoConnect } from "../../metamask";
import localForage from "localforage";
import connectMetaMaskaction, {
  WalletDisconnect,
} from "../../Redux/Actions/WalletActions/WalletAction";
import GetAllBlockChainAction from "../../Redux/Actions/Blockchain/GetAllBlockChainAction";
import './googlelang.scss'
const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? "active" : "non-active",
      };
    }}
  />
);
const Header = function () {
  const [connectWalletCondition, setConnectWalletCondition] = useState();
  let location = useLocation();
  const isConnected = useSelector(
    (state) => state.Login?.authResponse?.data?.token
  );
  const [openMenu, setOpenMenu] = React.useState(false);
  const [dimenson_width, setdimension_width] = React.useState(false);
  const [dimenson_width1, setdimension_width1] = React.useState(false);

  const [calldimenson_width, setcalldimension_width] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);
  const [isWrongChain, setIsWrongChain] = useState(true);
  const [chain, setChain] = useState(false);
  const [lan, setlan] = useState(true)
  const [Modaltoshow, setIsToShowModal] = useState(true)
  const [showmenu, btn_icon] = useState(false);
  const MyProfile = useSelector(
    (state) => state.MyProfile?.MyProfileResponse?.data
  );
  const GetAllBlockChain = useSelector(
    (state) => state?.GetAllBlockChain?.GetAllBlockChainResponse?.data
  );
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(async () => {
    setTimeout(async () => {
      await dispatch(GetAllBlockChainAction())
        .then(async (res) => {

          const chainid = await parseInt(window.ethereum.chainId);
          const result = res?.data?.some((item, index) => {

            return item.chainID == chainid;
          });

          if (!result && isConnected) {
            history.push("/connectwallet");
          }
          setIsWrongChain(result);
        })
        .catch((error) => {
        });
    }, 2000);
  }, []);

  const Logoutt = async () => {
    await dispatch(WalletDisconnect());
    await dispatch(AuthConnectRequest());
    await dispatch(LogoutAction());
    await dispatch(ValidateSignatureRequest());
    localStorage.setItem("loggedinwallet", "false")
    localStorage.setItem("userblock", "false")
  };

  const handleBtnClick3 = () => {
    setOpenMenu3(!openMenu3);
  };
  const handleBtnClick4 = () => {
    document.getElementById("SideMenu").classList.add("active");
  };
  const handleBtnClick5 = () => {
    document.getElementById("SideMenu").classList.remove("active");
  };
  const closeMenu = () => {
    setOpenMenu(false);
  };
  const closeMenu3 = () => {
    setOpenMenu3(false);
  };

  const ref3 = useOnclickOutside(() => {
    closeMenu3();
  });

  useEffect(() => {
    const header = document.getElementById("myHeader");

    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);
      if (window.pageYOffset > sticky) {

      } else {

        totop.classList.remove("show");
      }
      if (window.pageYOffset > sticky) {
        closeMenu();
      }
    });
    return () => {

      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  useEffect(() => {
    localForage
      .getItem("persist:AuthConnect")
      .then(async (value) => {
        const authResponse = JSON.parse(JSON.parse(value)?.AuthConnectResponse);
        if (
          authResponse &&
          authResponse.data &&
          Object.keys(authResponse.data).length > 0 &&
          authResponse.data.address
        ) {
          await dispatch(MyProfileAction())
            .then((res) => {
              if (res.data) {
                dispatch(connectMetaMaskaction(authResponse.data.address));
                localStorage.setItem("userblock", "false")
              } else if (res.data == null) {
                Logoutt();
              }
            })
            .catch((error) => {

              if (error.data.error.errorMessage === 'Invalid jwt token') {
                Logoutt();
                //localStorage.setItem("userblock","true")
                // history.push('/connectwallet')
              }

            });
        }
      })
      .catch((err) => {
      });
  }, []);

  useEffect(async () => {
    if (location.pathname !== "/connectwallet") {
      setConnectWalletCondition(true);
    } else {
      setConnectWalletCondition(false);
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (window.ethereum) {
        WrongChainCheck();
      }
    }, 2000);
  }, [location.pathname]);
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'ar,en,es,jv,ko,pa,pt,ru,zh-CN', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false }, 'google_translate_element');
  }

  useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, [dimenson_width1])

  const WrongChainCheck = async () => {
    if (window.web3.currentProvider.isMetaMask && window.ethereum.chainId) {
      const chainid = await parseInt(window.ethereum.chainId);
      console.log("chain id", chainid)
      const checkChainValidation = GetAllBlockChain?.some((item, index) => {
        return item.chainID == chainid;
      });

      if (
        (!checkChainValidation &&
          isConnected &&
          checkChainValidation !== undefined) ||
        (!isWrongChain && isConnected)
      ) {
        history.push("/connectwallet");
      }
    } else {
      Logoutt();
    }
  };
  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (dimensions.width < 1200 && dimenson_width == false) {

      setdimension_width1(false)
      setcalldimension_width(true)

    }
    if (dimensions.width > 1201 && calldimenson_width == true) {
      setdimension_width1(true)
    }
  }, [handleResize])

  React.useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    http.get(
      httpUrl + "/api/v1/Nft/GetMyAllCollections?PageSize=" + http.pageSize
    ).then(resp => {
      if (resp?.data.data?.length === 0) {
        setIsToShowModal(false)
      }
    })
  }, [])
  return (
    <header id="myHeader" className="navbar white">
      <div className="container">
        <div className="row w-100-nav">
          <div className="mbile-flex">
            <div className="logo px-0">
              <div className="navbar-title navbar-item">
                <NavLink to="/">                <img
                  src={logo}
                  className="img-fluid d-block header-logo"
                  alt="#"
                />
                  <img src={logo} className="img-fluid d-3 header-logo" alt="#" />
                  <img
                    src={logo}
                    className="img-fluid d-none header-logo1"
                    alt="#"
                  /></NavLink>


              </div>
            </div>
            <div className="mainside mobile-view">
              {(isConnected) ? (

                <div ref={ref3}>
                  <div
                    className="dropdown-custom mainside-dropdown-toggle btn clsprofile"
                    onMouseEnter={handleBtnClick3}
                    onMouseLeave={closeMenu3}
                  >
                    <div className="header_list_pp">
                      <span>
                        {MyProfile?.profileImage ? (
                          <>
                            <img className="lazy" src={httpUrl + "/" + MyProfile?.profileImage} alt="user.png"
                              style={{ width: 40, objectFit: "cover", height: 40, borderRadius: "100%", }}
                            />
                            {MyProfile?.isVerfiedAccount ? <i className="fa fa-check"></i> : <></>}
                          </>
                        ) : (
                          <>
                            <FaUserCircle size="2x" />
                          </>
                        )}
                      </span>
                    </div>
                    {openMenu3 && (
                      <div className="mainside-item-dropdown">
                        <div className="dropdown" onClick={closeMenu3}>
                          {
                            localStorage.getItem("userblock") === "true" ? <></> :
                              <>
                                <Link className="SideDrop" to="/myprofile">
                                  My NFts
                                </Link>
                                <Link className="SideDrop" to="/collections">
                                  My Collections
                                </Link>
                                <Link className="SideDrop" to="/settings">
                                  Edit Profile
                                </Link>
                                {/* <Link className="SideDrop" to="/userguide">
                            User Guide
                          </Link>  */}
                              </>
                          }
                          <Link onClick={Logoutt} className="SideDrop" to="#">
                            Logout
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              ) : (
                <>

                </>
              )}
            </div>
          </div>

          <BreakpointProvider>
            <Breakpoint xl className="lft-mnu">
              <div className="menu left-menu">

                <div className="navbar-item">
                  <NavLink to="/marketplace" className={location.pathname == "/marketplace" && "active"}>
                    Marketplace
                  </NavLink>
                </div>
                {isConnected ?
                  <>
                    <div className="navbar-item">
                      <NavLink to="/addcollection" className={location.pathname == "/addcollection" && "active"}>
                        Add Collection
                      </NavLink>
                    </div>
                    {
                      Modaltoshow ?
                        <div className="navbar-item">
                          <NavLink to="/createnft" className={location.pathname == "/createnft" && "active"}>
                            Create New NFT
                          </NavLink>
                        </div>
                        : <></>
                    }
                  </> : <></>
                }
                <div className="navbar-item">
                  <NavLink to="/blog" className={location.pathname == "/blog" && "active"}>
                    Blog
                  </NavLink>
                </div>
                <div className="navbar-item">
                  <NavLink to="/userguide" className={location.pathname == "/userguide" && "active"}>
                    User Guide
                  </NavLink>
                </div>
                <div className="navbar-item">
                  <NavLink to="/connectwallet" className={location.pathname == "/connectwallet" && "active"}>
                    Wallet
                  </NavLink>
                </div>
                {/* <div className="navbar-item">
                  <a href="https://fineoriginal-admin.azurewebsites.net/"  target="_blank">   
                    Admin panel</a>
                  </div> */}
                <div className="navbar-item">
                  <Googleimage />
                </div>


                <div className="navbar-item">
                  <div id="google_translate_element"></div>
                </div>

                <div className="navbar-item">
                  <NavLink to="/add-organization" className={location.pathname == "/add-organization" && "active"}>
                    Add Organization
                  </NavLink>
                </div>

                {
                  localStorage.getItem("userblock") === "true" ?
                    <div className="navbar-item" style={{ color: "red", }}>

                      <p style={{ color: "red" }}> Blocked</p>

                    </div> : <></>
                }
              </div>
            </Breakpoint>

          </BreakpointProvider>

          <BreakpointProvider>
            <Breakpoint l down>
              {showmenu && (
                <div className="menu">
                  <div className="navbar-item">
                    <NavLink to="/createnft">
                      Create New NFT
                    </NavLink>
                  </div>
                  <div className="navbar-item">
                    <NavLink to="/marketplace">
                      <img src={marketplace} alt={""} className="market-logo" />
                    </NavLink>
                  </div>
                </div>
              )}
            </Breakpoint>

            <Breakpoint xl>
              <div className="menu">
                <div className="navbar-item">

                </div>
                <div className="navbar-item">
                  <NavLink className="circle-link walet" to="/connectwallet">
                    <img src={walet} alt={""} className="wallet" />
                  </NavLink>
                </div>

              </div>
            </Breakpoint>
          </BreakpointProvider>
          <div className="mainside">
            {(isConnected) ? (

              <div ref={ref3}>
                <div
                  className="dropdown-custom mainside-dropdown-toggle btn clsprofile"
                  onMouseEnter={handleBtnClick3}
                  onMouseLeave={closeMenu3}
                >
                  <div className="header_list_pp">
                    <span>
                      {MyProfile?.profileImage ? (
                        <>
                          <img className="lazy" src={httpUrl + "/" + MyProfile?.profileImage} alt="user.png"
                            style={{ width: 40, objectFit: "cover", height: 40, borderRadius: "100%", }}
                          />
                          {MyProfile?.isVerfiedAccount ? <i className="fa fa-check"></i> : <></>}
                        </>
                      ) : (
                        <>
                          <FaUserCircle size="2x" />
                        </>
                      )}
                    </span>
                  </div>
                  {openMenu3 && (
                    <div className="mainside-item-dropdown">
                      <div className="dropdown" onClick={closeMenu3}>
                        {
                          localStorage.getItem("userblock") === "true" ? <></> :
                            <>
                              <Link className="SideDrop" to="/settings">
                                Edit Profile
                              </Link>
                              <Link className="SideDrop" to="/collections">
                                My Collections
                              </Link>
                              <Link className="SideDrop" to="/myprofile">
                                My NFTs
                              </Link>


                              {/* <Link className="SideDrop" to="/userguide">
                            User Guide
                          </Link>  */}
                            </>
                        }
                        <Link onClick={Logoutt} className="SideDrop" to="#">
                          Logout
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            ) : (
              <>

              </>
            )}
          </div>
        </div>
        <button onClick={handleBtnClick4} class="burger-menu mobile">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {/* Side Menu Starts Here */}
      <div id="SideMenu" className="Sidemenu" onClick={handleBtnClick5}>
        <div className="Sidemenu-inner Sidemenu-inner1">
          <button onClick={handleBtnClick5} className="Close-btn">
            <i class="fa fa-close"></i>
          </button>
          <h1>Side Menu</h1>
          <ul className="Side-menu-list">
            <li>
              {" "}
              {connectWalletCondition && (
                <NavLink to="/connectwallet" className="">
                  Connect Wallet
                </NavLink>
              )}
            </li>

            <li>
              {" "}
              <NavLink to="/marketplace">
                MarketPlace
                <span className="lines"></span>
              </NavLink>
            </li>

            <li>
              {" "}
              <NavLink to="/createnft">
              Create New NFT
                <span className="lines"></span>
              </NavLink>
            </li>

            {isConnected ? <>

            </> : <></>
            }
            <li>
              {" "}
              <NavLink to="/blog" className="">
                Blog
              </NavLink>

            </li>
            <li>
            <NavLink to="/add-organization">
                Add Organization
                <span className="lines"></span>
              </NavLink>
              </li>
            {/* <li>
              {" "}
              <a href="https://fineoriginal-admin.azurewebsites.net/"  target="_blank">   
                    Admin panel</a>
                  
            </li> */}

            <li>
              {" "}
              <NavLink to="/userguide">
                User Guide
                <span className="lines"></span>
              </NavLink>
            </li>
            <li>
              {" "}
              <NavLink to="/contactus">
                Contact Us
                <span className="lines"></span>
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
      {/* Side Menu Starts Here */}
    </header>
  );
};
export default Header;
const Googleimage = () => {
  return (<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style={{
    height: '20px',
    width: '20px'
  }} >
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
  </svg>)
}

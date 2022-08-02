import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Metamask from "../../assets/images/metamask.png";
import Error from "../../assets/images/close-icon-100-01-01.png";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { PulseLoader } from "react-spinners";
import connectMetaMaskaction from "../../Redux/Actions/WalletActions/WalletAction";
import AuthConnectAction from "../../Redux/Actions/AuthActions/AuthConnectAction";
import ValidateSignatureAction from "../../Redux/Actions/AuthActions/ValidateSignatureAction";
import { ToastContainer, toast } from "react-toastify";
import lottie from "lottie-web";

import { Modal } from "react-bootstrap";
import connectionAnimation from "../../assets/animation/connection/data.json";
import localforage from "localforage";
function ConnectWallet() {
  const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    
  }
  .box-login p{
    color: #a2a2a2 !important;
  }
  .box-login{
    border-radius: 3px;
    padding: 40px 50px;
  }
`;

  const history = useHistory();
  const dispatch = useDispatch();
  const AuthConnectState = useSelector((state) => state.AuthConnect);
  const AuthConnect = AuthConnectState?.AuthConnectResponse?.data;
  const isConnected = useSelector(
    (state) => state.Login?.authResponse?.data?.token
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isToShowModal,setIsToShowModal]=useState(false);
  const [trigger, setTrigger] = useState(false);
  const [chain, setChain] = useState(false);
  const [SigError, SetSigError] = useState();
  const dispatchConnect = () => dispatch(connectMetaMaskaction());
  var isUserLogedIn = false;
  const User = useSelector((state) => state.Login);
  const Tokenn = User.authResponse?.data?.token;
  const GetAllBlockChain = useSelector(
    (state) => state?.GetAllBlockChain?.GetAllBlockChainResponse?.data
  );

  if (
    User.authResponse &&
    User.authResponse.data &&
    User.authResponse?.data?.token
  ) {
    isUserLogedIn = true;
  } else {
    isUserLogedIn = false;
  }
useEffect(()=>
{

  if(localStorage.getItem("userblock")==="true")
{
  setIsToShowModal(true)
}


},[])

  useEffect(() => {
        setChain(true)
     }, [GetAllBlockChain])

  const connnectwallet = async () => {

    setTrigger(true);
    setIsLoading(true);
    if (window.ethereum) {
      await window.ethereum.enable().then(async (res) => {
        setTimeout(async () => {
          await dispatchConnect().then(async (res) => {
            connectionFunc(res)
          }).catch(() => {
            setIsLoading(false)
          });
        }, 1000);
      });

    } else {
      setIsLoading(false);
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

  const connectionFunc = async (res) => {
    await dispatch(AuthConnectAction({ address: res }))
      .then(async (response) => {
        // // console.log(response);
        // setTimeout(async () => {
          
          localStorage.setItem("userblock","false") 
        if (response?.data?.message && !Tokenn) {
          localStorage.setItem("userblock","false")  
          await signMessage(response?.data?.message);
          setTrigger(false);
              }
        // }, 1000);
      })
      .catch((error) => {
        setIsLoading(false)
          if(error?.data?.error?.errorMessage==='Address blocked')
          {
             //window.location.reload(false);
            // localStorage.setItem("userblock","true")
            setIsToShowModal(true)
          }
        if (error?.code == 4001 || error?.status == 500) {
          connectionFunc(res)
        }
        // setIsLoading(false)
      });
  }
  useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#connectionCircle"),
      animationData: connectionAnimation,
      renderer: "svg", // "canvas", "html"
      loop: true, // boolean
      autoplay: true, // boolean
    });
  }, []);


  const signMessage = async (message) => {


    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    await dispatch(
      ValidateSignatureAction({
        address: address,
        signature: signature,
      })
    )
      .then((res) => {

        const chainCheck = GetAllBlockChain?.some((item, index) => {
 
          return item.chainID == parseInt(window.ethereum.chainId);
        });
        setTimeout(() => {
        if (chainCheck) {  
          toast.success(
            <p style={{wordBreak:"break-word"}}>You are now signed in and will be redirected to the Home page</p> ,
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
            localStorage.setItem("isFirstTime1","true");
            localStorage.setItem("loggedinwallet","true");
            localforage.setItem("isFirstTime","true",(error)=>{
              history.push("/");
            });
          }, 3000);
        }
      },3000); 
        setIsLoading(false);

      })
      .catch((err) => {
        setIsLoading(false);

        toast.error(`${err.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

  };

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
      <section className="jumbotron breadcumb no-bg">
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
        <div className="mainbreadcumb">
          <div className="container">
            {GetAllBlockChain &&
              isConnected && chain &&
              !GetAllBlockChain?.some((item, index) => {
                return item.chainID == parseInt(window.ethereum.chainId);
              }) ? (
              <div className="row align-items-center px-0 mb-4">
                <div className="col-lg-4 offset-lg-4 m-auto px-0">
                  <div className="box-login text-center">
                    <h3 style={{ color: "black",wordBreak: "keep-all" }}>
                      Wrong blockchain selected make sure that you are in
                      Binance Smart Chain Network
                    </h3>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row align-items-center px-0">

                <div className="col-lg-12  col-md-12">
                  <h1 class="text-center">Wallet</h1>
                  {/* <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                      <li class="breadcrumb-item"><a href="/">Home</a></li>
                      <li class="breadcrumb-item active" aria-current="page">Wallet</li>
                    </ol>
                  </nav> */}
                </div>

                <div className="col-lg-4 offset-lg-4 col-md-6  offset-md-3  col-sm-8 offset-sm-2">
                  <div class="wallet-panel">
                    <div className="wallet-panel-inner">
                      <div className="wallet-img">
                        <img src={Metamask} />
                      </div>
                      <h4 >Metamask Wallet</h4>
                      <p style={{

                        wordBreak: "keep-all"

                      }}>Please connect your metamask with BNB Mainnet</p>

                      {isLoading ? (
                        <div className="w-100">
                          <button
                            className="btn w-100"
                            style={{
                              backgroundColor: "rgb(255, 166, 0)",
                              borderRadius: "30px",
                              fontWeight: "bold",
                            }}>

                            <PulseLoader color="white" size="11" />
                          </button>
                        </div>
                      ) : isConnected ? (
                        <div className="field-set">
                          <input
                            type="submit"
                            id="send_message"
                            value="Connected"
                            className="btn btn-main btn-fullwidth color-2"
                            disabled
                          />
                        </div>
                      ) : (
                        <div className="field-set">
                          <input

                            type="submit"
                            id="send_message"
                            value="Connect Wallet"
                            className="btn btn-main btn-fullwidth color-2 trans"
                            onClick={connnectwallet}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-lg-10 offset-lg-1  col-md-12  offset-md-0  col-sm-12 col-sm-12">
                  <h2 className="mrg">How to connect Metamask to Binance Smart Chain.</h2>
                  <div className="full-div youtube-pnl">
                    <iframe
                      src="https://www.youtube.com/embed/8JZSUv40Tx0">
                    </iframe>
                  </div>
                </div>
                <Modal centered show={isToShowModal} onHide={() => { setIsToShowModal(false) }}>
          <Modal.Header closeButton>
            <Modal.Title>Blocked</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{color:"red",textAlign:"center" } }>
             <img src={Error} style={{width:"50px",height:"50px"}} />
            <div className="pt-4" />
            <div >
              <p style={{color:"red",textAlign:"center" } }>
              Blocked user can only view marketplace and Blog
              </p>
          </div>
          </Modal.Body>
        </Modal>

              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ConnectWallet;
function Errorimage()
{
  return(
    <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="100pt" height="100pt" viewBox="0 0 1024.000000 1024.000000" preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="red" stroke="none">
<path d="M4790 9379 c-729 -61 -1390 -285 -2000 -677 -477 -308 -944 -775 -1252 -1252 -399 -621 -621 -1285 -678 -2030 -18 -227 -8 -1021 14 -1200 86 -697 303 -1300 671 -1865 261 -402 624 -787 1018 -1084 588 -440 1281 -720 2017 -815 409 -53 900 -39 1305 35 738 135 1407 450 1985 933 117 97 353 329 465 456 415 472 728 1051 904 1675 49 176 98 430 127 665 22 179 32 973 14 1200 -57 745 -279 1409 -678 2030 -308 477 -775 944 -1252 1252 -616 396 -1272 617 -2015 678 -139 11 -506 11 -645 -1z m-425 -2866 c410 -406 750 -738 755 -738 6 0 326 313 712 695 386 382 723 714 750 738 l48 44 300 -293 c165 -161 300 -297 300 -302 0 -5 -264 -278 -587 -606 -323 -328 -661 -671 -752 -763 l-164 -166 604 -598 c332 -329 672 -665 754 -746 l150 -148 -300 -300 c-165 -165 -303 -299 -307 -298 -4 2 -345 337 -758 746 l-750 744 -750 -744 c-413 -409 -754 -744 -758 -746 -4 -1 -142 133 -307 298 l-300 300 150 148 c83 81 422 417 754 746 l604 598 -164 166 c-91 92 -429 435 -752 763 -323 328 -587 601 -587 605 0 11 591 593 603 593 4 1 343 -331 752 -736z"/>
</g>
</svg>
  )
}

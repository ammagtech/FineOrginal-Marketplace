import React, { useEffect, useState } from "react";

import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { keyframes } from "@emotion/react";
import heroimage from "../../assets/images/hero-img.png";
import LandingComp from "./MarketPlace/LandingComp";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";

import { checkBalance } from "../../metamask";
import { Modal } from "react-bootstrap";
import localforage from "localforage";
import http from "../../Redux/Api/http";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: white;
    border-bottom: 0;
    box-shadow: 0 4px 20px 0 rgba(10,10,10, .8);
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn-custom, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: #fff;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: none !important;
  }
  header#myHeader .logo .d-3{
    display: block !important;
  }
  .jumbotron.no-bg{
    background: center bottom;
    background-size: cover;
    height: 100vh;
  }
  footer.footer-light .subfooter span img.d-1{
    display: none !important;
  }
  footer.footer-light .subfooter span img.d-3{
    display: inline-block !important;
  }
  .de_countdown{
    right: 10px;
    color: #fff;
  }
  .author_list_pp{
    margin-left:0;
  }
  // footer.footer-light .subfooter{
  //   border-top: 1px solid rgba(255,255,255,.1);
  // }
`;

const Homethree = () => {
  const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
  const location = useLocation()

  const isConnected = useSelector((state) => state.Login?.authResponse?.data);

  useEffect(() => {

    localforage.getItem("isFirstTime", (err, data) => {
      if (data === "true") {
        http.get(
          httpUrl + "/api/v1/Nft/GetMyAllCollections?PageSize=" + http.pageSize
        ).then(resp => {
          if (resp?.data.data.length === 0) {
               localStorage.setItem("Collectioncreated","true")
            localforage.setItem("isFirstTime", "false", (err) => {
              setIsToShowModal(true)
            })
          }
        })
      }
    } )

  }, [])

  useEffect(async () => {

    await checkBalance()
    
  }, [])





  const history = useHistory();
  const isFirstTime = location.state
  const [isToShowModal, setIsToShowModal] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("isFirstTime1") === "true") {
      window.location.reload(false);
      localStorage.setItem("isFirstTime1", "false")
    }
    else {
      localforage.getItem("isFirstTime", (err, data) => {
        if (data === "true") {
          http.get(
            httpUrl + "/api/v1/Nft/GetMyAllCollections?PageSize=" + http.pageSize
          ).then(resp => {
            if (resp?.data.data.length === 0) {
              setIsToShowModal(true)
              
            }
          })
        }
      })
    }
  }, [])
  return (
    <div>
      <GlobalStyles />
      <section className="conatienr-fluid landing-header secnd-anime">
        {/* <span className="circle-span anim small yelow position-1"></span>
        <span className="circle-span anim small green position-4"></span>
        <span className="circle-span anim small green position-6"></span>
        <span className="circle-span anim star rotate-anim position-7"></span>
        <span className="circle-span anim star rotate-anim position-8"></span>
        <span className="square-span anim small rotate-anim yelow position-9"></span>
        <span className="square-span anim small rotate-anim green position-10"></span>
        <span className="square-big-span yellow anim translate-anim-1 position-11"></span>
        <span className="square-big-span greeen anim translate-anim-2 position-12"></span> */}
        <div className="table-cell">
          <div className="table-cell-center">
            <div className="container">
              <div className="row">
                <div className="col-lg-7 col-md-7 col-sm-12">
                  <span className="mrk-txt"><span style={{color:"black", fontWeight:"1000"}}>Your Community NFT marketplace </span></span>
                  <h1>
                  Collect & Manage NFT
                    <span>From Creators.</span>
                  </h1>
                  <p>
                  NFT marketplace & Web3 technologies for creators and project
                  </p>

                  <ul>
                    <li><Link to="/Marketplace" className="reg-btn">Explore Items</Link></li>
                    {
                      isConnected ? <li><a className="reg-btn">
                        Wallet Connected
                      </a></li> :
                        <li><Link to="/connectwallet" className="reg-btn-empty">
                          Connect Wallet
                        </Link></li>
                    }
                  </ul>
                </div>
                <div className="col-lg-5 col-md-5 col-sm-12">
                  <img src={heroimage} alt='image' />
                </div>
              </div>
            </div>
          </div>
        </div>



        <Modal centered show={isToShowModal} onHide={() => { 
          localforage.setItem("isFirstTime", "false", (err) => {
            setIsToShowModal(false)     
          })
           }}>
          <Modal.Header closeButton>
            <Modal.Title>Create You First Collection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>
                Warm welcome from us. Create your first collection for NFT's.
              </p>

              <div className="field-set">
                <input
                  type="button"
                  id="send_message"
                  value="Add Collection"
                  className="btn btn-main btn-fullwidth color-2"
                  onClick={() => {
                    window.location.reload(false);
                    setIsToShowModal(false)
                    history.push("addcollection")
                  }}

                />
              </div>
            </div>

          </Modal.Body>
        </Modal>



      </section>

      <Modal centered show={isToShowModal} onHide={() => { setIsToShowModal(false) }}>
        <Modal.Header closeButton>
          <Modal.Title>Create You First Collection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              Warm welcome from us. Create your first collection for NFT's.
            </p>

            <div className="field-set">
              <input
                type="button"
                id="send_message"
                value="Add Collection"
                className="btn btn-main btn-fullwidth color-2"
                onClick={() => {
                  setIsToShowModal(false)
                  history.push("addcollection")
                }}

              />
            </div>
          </div>

        </Modal.Body>
      </Modal>
      <LandingComp />
      {/* <MarketNfts /> */}

      <Footer />
    </div>
  )
};
export default Homethree;




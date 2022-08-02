import React from "react";
import { Row, Col } from "react-bootstrap";
import footerlogo from "../../assets/images/footer-logo.png";
const getCurruntYear = () => {
  return new Date().getFullYear();
}
const footer = () => (
  <footer className="container-fluid">
    {/* <span className="circle-span anim small yelow position-1"></span>
    <span className="circle-span anim mid yelow position-2"></span>
    <span className="circle-span anim big yelow position-3"></span>
    <span className="circle-span anim small green position-4"></span>
    <span className="circle-span anim mid green position-5"></span>
    <span className="circle-span anim small green position-6"></span>
    <span className="circle-span anim star rotate-anim position-7"></span>
    <span className="circle-span anim star rotate-anim position-8"></span>
    <span className="square-span anim small rotate-anim yelow position-9"></span>
    <span className="square-span anim small rotate-anim green position-10"></span>
    <span className="square-big-span yellow anim translate-anim-1 position-11"></span>
    <span className="square-big-span greeen anim translate-anim-2 position-12"></span> */}
    <div className="row">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-6">
            <h6>My Account</h6>
            <ul>
              <li><a href="/connectwallet">wallet</a></li>
              <li><a href="/myprofile">My Profile</a></li>
              <li><a href="/blog">Blogs</a></li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <h6>Web Links</h6>
            <ul>
              <li><a href="/marketplace">Marketplace</a></li>
              <li><a href="/addcollection">Add Collection</a></li>
              <li><a href="/createnft">Create New NFT</a></li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <h6>Help</h6>
            <ul className="footer-list">
              {/* <li><i className="fa fa-map-marker"></i> 12 New Elephant Road, P.O. 1334 NY, United States</li>
              <li><a href="tel:012 345 678 90"><i className="fa fa-phone"></i> 012 345 678 90</a></li> */}
              <li><a href="mailto:Fineoriginal.com"><i className="fa fa-envelope-o"></i>  service@fineoriginal.com</a></li>
              <li> <i className="fa fa-envelope-o"></i> <a href="/contactus">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <ul className="social-list">
              <li><a target="_blank"  href="/createnft"><i className="fa fa-twitter"></i> Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <p>© Copyright 2022 Fineoriginal - All Rights Reserved.</p>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <ul className="privacy-list">
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms">Term of Services</a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </footer>
);
export default footer;

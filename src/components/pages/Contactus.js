import React, { useState } from "react";
import emailjs from "emailjs-com";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import EmailShare from 'react-email-share-link'
import { message } from "antd";
import http from "../../Redux/Api/http";
const GlobalStyles = createGlobalStyle`

`;

const Contact = function () {
  const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
  const [Name, setName] = useState("")
  const [Email, setEmail] = useState("")
  const [Message, setMessage] = useState("")
  const [Phonenumber, setPhoneNumber] = useState("")
  function sendEmail(e) {
    const success = document.getElementById("success");
    const button = document.getElementById("buttonsent");
    const failed = document.getElementById("failed");
    e.preventDefault();
    emailjs
      .sendForm(
        "gmail",
        "template_csfdEZiA",
        e.target,
        "user_zu7p2b3lDibMCDutH5hif"
      )
      .then(
        async (result) => {

          await http
            .post(httpUrl + "/api/v1/Nft/AddContactUs",
              {
                name: Name,
                email: Email,
                subject: Phonenumber,
                message: Message,
              }
              , {})
            .then((res) => {
              console.log(res)
            })
            .catch((error) => {
            });

          console.log(result.text);
          success?.classList.add("show");
          button?.classList.add("show");
          failed?.classList.remove("show");
          console.log(Name);
          console.log(Email); console.log(); console.log();

        },
        (error) => {
          console.log(error?.text);
          failed?.classList.add("show");
        }
      );
  }

  return (
    <div>
      <GlobalStyles />

      <section className="jumbotron breadcumb no-bg ">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1>Contact Us</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container ">
        <div className="row" style={{ display: "flex", justifyContent: "center" }}>

          <div className="col-md-6 mb-3">
            <div className=" box-rounded ">
              <h3>General Enquiries</h3>
              <span style={{ wordBreak: "break-word" }}>
                For any general enquiries please send us an email to contact@fineoriginal.com
              </span>
              <address className="s1">
                {/* <h4>Address:</h4>
                <span>
                  <i className="id-color fa fa-map-marker fa-lg"></i>
                  12 New Elephant Road, P.O 1334 NY,United States
                </span>
                {/* <span>
                  <i className="id-color fa fa-phone fa-lg"></i>
                  Lorem ipsum dolar sit amet,consectetur adipiscing elit 
                </span> 
                <h4>Phone:</h4>
                <span>
                  <i className="id-color fa fa-phone fa-lg"></i>
                +(0)123 45 678 90                </span>
                <span>
                  <i className="fa fa-phone-square"></i>
                  +(0)123 45 678 90 
                </span> */}
                <h3>Support Center :</h3>
                <span>
                  <i className="id-color fa fa-envelope-o fa-lg"></i>
                  <EmailShare email="service@fineoriginal.com" subject="" body="">
                    {link => (
                      <span className="btn"> <a href={link} data-rel="external">service@fineoriginal.com</a></span>
                    )}
                  </EmailShare>
                  {/* <EmailShareButton
    subject="subject"
    
    className="Demo__some-network__share-button">
                  <span className="btn">service@fineoriginal.com</span>
                  </EmailShareButton> */}
                </span>
              </address>
            </div>
            {/* 
            <div className="padding40 box-rounded mb30 text-light">
              <h3>AU Office</h3>
              <address className="s1">
                <span>
                  <i className="fa fa-map-marker fa-lg"></i>100 Mainstreet
                  Center, Sydney
                </span>
                <span>
                  <i className="fa fa-phone fa-lg"></i>+61 333 9296
                </span>
                <span>
                  <i className="fa fa-envelope-o fa-lg"></i>
                  <span className="btn">contact@example.com</span>
                </span>
                <span>
                  <i className="fa fa-file-pdf-o fa-lg"></i>
                  <span className="btn">Download Brochure</span>
                </span>
              </address>
            </div> */}
          </div>
          <div className="col-md-6 mb-3"  >
            <div className=" box-rounded ">
              <h3>Contact Us</h3>
              <div className="form-side">
                <form className="formcontact1" onSubmit={sendEmail}>
                  <input
                    type="text"
                    className="form-control"
                    name="user_name"
                    placeholder="Name"
                    required
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    className="form-control"
                    name="user_email"
                    placeholder="Email"
                    required
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}

                  />
                  <input
                    type="text"
                    className="form-control"
                    name="user_phone"
                    placeholder="Subject"
                    required
                    value={Phonenumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}

                  />
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Message"
                    required
                    value={Message}
                    onChange={(e) => setMessage(e.target.value)}

                  />
                  <div id="success" className="hide">
                    Your message has been sent...
                  </div>
                  <div id="failed" className="hide">
                    Message failed...
                  </div>
                  <input
                    type="submit"
                    value="Contact Us"
                    className="btn btn-main color-2"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default Contact;

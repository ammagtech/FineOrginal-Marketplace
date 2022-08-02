import React, { useEffect, useState, useRef } from "react";
import defaultImg from "../../../assets/images/default.png";
import http from "../../../Redux/Api/http";

import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
const Followingslist = (image) => {
    const numbers = [1, 2, 3, 4, 5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
   const [users,setUsers]=useState([])
  const [button,setbutton] = useState(true)
   const [called,setcalled]=useState(true)
  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );
useEffect(async () => {
    await http
      .get(httpUrl + "/api/v1/Account/GetMyAllFollowing")
      .then((res) => {
         setUsers(res.data.data)
        })
      .catch((error) => {
      });
}, [])

useEffect(async () => {
  await http
    .get(httpUrl + "/api/v1/Account/GetMyAllFollowing")
    .then((res) => {
       setUsers(res.data.data)
      })
    .catch((error) => {
    });
}, [called])
  return (
    <>
      {
             users.map((number,index)=>   
        <div style={{height:"50px",borderStyle:"outset",marginBottom:'5px' } }> 
          <div style={{display:"flex",justifyContent:"space-between" }}  >
          <div className="" style={{height:"10px"}}  >
                          <img
                            src={number?.profileImage ? httpUrl + "/" + number?.profileImage :defaultImg  }
                            alt="Author.png"
                            style={{width:"45px",height:"45px",borderRadius:'100%'}}
                          />
        </div>  
           {number?.username?number?.username:<></>}
           <button className="follow-btn-profile" onClick={() => {
                             if (!WalletAddress) {
                                toast.error("please login to continue", {
                                  position: "top-right",
                                  autoClose: 5000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                });
                                return
                              }
                              if (number?.isFollowed) {
                                http
                                  .put(httpUrl + "/api/v1/Account/UnFollowUser", {
                                    "accountFollowerToId": number?.id
                                  })
                                  .then((res) => {
                                    toast.success(res.data?.data, {
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
                                    toast.error(`something went wrong`, {
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
                              else {
                                http
                                  .post(httpUrl + "/api/v1/Account/AddUserFollower", {
                                    "accountFollowerToId": number?.id
                                  })
                                  .then((res) => {
                                    toast.success(res.data?.data, {
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
                                    toast.error(`something went wrong`, {
                                      position: "top-right",
                                      autoClose: 5000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: true,
                                      draggable: true,
                                      progress: undefined,
                                    });
                                  });
                                  setcalled()
                                }

                            }}>{ button ? "Following" :   "+Follow"   }</button>
         </div>
                          </div>
            
               )
        }   

    </>
  );
};

export default Followingslist;

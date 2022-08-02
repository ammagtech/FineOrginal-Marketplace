import React, { useEffect, useState, useRef, useReducer } from "react";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import "../../assets/myProfile.scss";
import * as Yup from "yup";
import { WalletDisconnect } from "../../Redux/Actions/WalletActions/WalletAction";
import { AuthConnectRequest } from "../../Redux/Actions/AuthActions/AuthConnectAction";
import { LogoutAction } from "../../Redux/Actions/AuthActions/LogoutAction";
import { ValidateSignatureRequest } from "../../Redux/Actions/AuthActions/ValidateSignatureAction";
import { Formik, Form, Field } from "formik";
import { CopyToClipboard } from "react-copy-to-clipboard";
import bannerimg from '../../assets/images/profile-banner.jpg';
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import UpdateProfileAction from "../../Redux/Actions/Account/UpdateProfileAction";
import MyProfileAction from "../../Redux/Actions/Account/MyProfileAction";
import { FaCopy, FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import defaultImg from '../../assets/images/default.png'

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: transparent;
  }`;
const CreateSchema = Yup.object().shape({
  username: Yup.string().required("Name is required").matches(
    /^[A-Za-z\.\-\/]+$/,
    "Only alphabets are allowed without space this field "
  ),
  // .required("Please enter the username without any spaces in this field")
  // 
  bio: Yup.string(),
  email: Yup.string().required("Email is required"),
  instagramLink: Yup.string().url().nullable(),
  twitterLink: Yup.string().url().nullable(),
  yourSiteLink: Yup.string().url().nullable(),
  OrganizationId: Yup.string(),
});
function ProfileSettings() {
  const [files, SetFiles] = useState();



  // usman working start


  // const [orgID, setOrgID] = useState(-1);
  const [preorganiation, setpreorganization] = useState();
  const [organization, setOrganization] = useState();
  const [preorganiationname, setpreorganizationname] = useState();

  // usman working end





  const [orgerror, setorgerror] = useState("");
  const [orgset, setorgset] = useState(false);
  const reducer = (state, action) => {
    switch (action.type) {
      case 'clicked':
        return { isDisable: true };
      case 'notClicked':
        return { isDisable: false };
    }
  }
  const initialState = { isDisable: false };
  const [state, disableDispatch] = useReducer(reducer, initialState)
  const [FileError, SetFileError] = useState("");
  const [userImage, setUserImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orgCheck, setOrgCheck] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const history = useHistory();
  const formRef = useRef();
  const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
  const Token = useSelector((state) => state.Login?.authResponse?.data?.token);

  const MyProfile = useSelector(
    (state) => state.MyProfile?.MyProfileResponse?.data
  );
  const dispatch = useDispatch();
  const text = MyProfile?.bio ? MyProfile?.bio?.toString() : '';

  useEffect(() => {
    // getOrganizations()
    dispatch(MyProfileAction())
      .then((res) => {
        const data = res.data;
        // setpreorganization(data.organizationId)
        // setOrgID(data.organizationId)
        // setpreorganizationname(data.organizationName)

        formRef.current.setValues({
          yourSiteLink:
            (data?.yourSiteLink &&
              data?.yourSiteLink != "null" &&
              data?.yourSiteLink) ||
            "",
          username:
            (data?.username && data?.username != "null" && data?.username) ||
            "",
          bio: (data?.bio && data?.bio != "null" && data?.bio) || "",
          email: (data?.email && data?.email != "null" && data?.email) || "",
          instagramLink:
            (data?.instagramLink &&
              data?.instagramLink != "null" &&
              data?.instagramLink) ||
            "",
          twitterLink:
            (data?.twitterLink &&
              data?.twitterLink != "null" &&
              data?.twitterLink) ||
            "",
          WalletAdres: WalletAddress,
        });
      })
      .catch((error) => {
      });
  }, []);

  const fileschange = (e) => {


    const file = e.target.files[0];
    if (
      file?.type === "image/jpeg" ||
      file?.type === "image/png" ||
      file?.type === "image/jpg" ||
      file?.type === "image/gif"
    ) {

      SetFileError(null);
      SetFiles(file);
    } else {
      SetFileError("Invalid File Format");
      SetFiles(null);
    }
  };
  // const getOrganizations = async (e) => {
  //   await axios
  //     .get(
  //       httpUrl + "/api/v1/Organization/GetAllOrganization",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Token}`,
  //         },
  //       }
  //     )
  //     .then((resp) => {
  //       setOrganization(resp?.data?.data)
  //       setOrgCheck(false)
  //       if (resp?.data.data.length > 0)
  //         setOrgID(resp?.data?.data[0]?.id)
  //       else
  //         setOrgID(0)
  //     })

  // };

  const WalletAddress = useSelector(
    (state) => state.WalletConnction?.WalletResponse?.accounts
  );

  const [ProfileData, SetProfileData] = useState({
    username: MyProfile?.username,
    bio: MyProfile?.bio,
    email: MyProfile?.email,
    instagramLink: MyProfile?.instagramLink,
    yourSiteLink: MyProfile?.yourSiteLink,
    twitterLink: MyProfile?.twitterLink,
    WalletAdres: WalletAddress,
    OrganizationId1: MyProfile?.organizationId,
  });
  const inputhandler = (e) => {
    const { name, value } = e.target;

    SetProfileData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    setUserImage(MyProfile?.profileImage);
    SetProfileData(MyProfile);
  }, [MyProfile]);

  const onsubmitHandler = async (e) => {
    setIsLoading(true);
    if (files == null && FileError == "Invalid File Format") {
      toast.error(
        `You selected the wrong file type, you can only upload PNG, JPG, JPEG, GIF`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setIsLoading(false);
      return;
    }
  //  if (orgID === -1) { setorgset(true); return }
    var bodyFormData = new FormData();
    bodyFormData.append("ProfileImage", files ? files : defaultImg);
    bodyFormData.append("Username", ProfileData.username);
    bodyFormData.append("Email", ProfileData.email);
    bodyFormData.append("TwitterLink", ProfileData.twitterLink);
    bodyFormData.append("InstagramLink", ProfileData.instagramLink);
    bodyFormData.append("YourSiteLink", ProfileData.yourSiteLink);
    bodyFormData.append("Bio", ProfileData.bio ? ProfileData.bio : " ");

    // bodyFormData.append("OrganizationId", orgID);
    bodyFormData.append("OrganizationId", 0);
    console.table([...bodyFormData])
    await dispatch(UpdateProfileAction(bodyFormData))
      .then((res) => {
        setIsLoading(false);
        toast.success(`${res.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(MyProfileAction())
          .then((res) => {
            const data = res.data;
            formRef.current.setValues({
              yourSiteLink:
                (data?.yourSiteLink &&
                  data?.yourSiteLink != "null" &&
                  data?.yourSiteLink) ||
                "",
              username:
                (data?.username &&
                  data?.username != "null" &&
                  data?.username) ||
                "",
              bio: (data?.bio && data?.bio != "null" && data?.bio) || "",
              email:
                (data?.email && data?.email != "null" && data?.email) || "",
              instagramLink:
                (data?.instagramLink &&
                  data?.instagramLink != "null" &&
                  data?.instagramLink) ||
                "",
              twitterLink:
                (data?.twitterLink &&
                  data?.twitterLink != "null" &&
                  data?.twitterLink) ||
                "",
              WalletAdres: WalletAddress,
            });
          })
          .catch((error) => {
          });
        setUserImage(res?.data?.profileImage);
        setTimeout(() => {
          history.push("/myProfile")
        }, 5000);
      })
      .catch((error) => {
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
  };
  const Logoutt = async () => {
    await dispatch(WalletDisconnect());
    await dispatch(AuthConnectRequest());
    await dispatch(LogoutAction());
    await dispatch(ValidateSignatureRequest());
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

      <section className="profile-banner">

        {/* <h2>Edit Profile</h2> */}
        <h2>Edit Profile</h2>
        <div className="full-div banner" style={{ backgroundImage: `url(${bannerimg})` }}></div>
      </section >
      <div class="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="profile-info-container">
              <div className="d_profile profile-container">
                <div className="profile-pic-cntnr">
                  <div htmlFor="imagee" className="">
                    {files ? (
                      <img
                        id="changePic"
                        src={URL.createObjectURL(files)}
                        alt="profilepic.png"
                        style={{ width: 130, height: 130 }}
                      />
                    ) : (
                      MyProfile?.profileImage ? (
                        <img
                          id="changePic"
                          src={`${httpUrl}/${userImage}`}
                          alt="profilepic.png"
                          style={{ width: 130, height: 130 }}
                        />
                      ) : (
                        <FaUserCircle size="2x" />
                      ))}

                  </div>
                </div>

                {files ? <p style={{ textAlign: "center" }}>
                  < label for="img" style={{ cursor: "pointer", fontWeight: "bold",color:"orange", fontStyle: "italic" }}> Change Picture </label>
                </p>
                  :
                  <p style={{ textAlign: "center" }}>
                    < label for="img" style={{ cursor: "pointer",color:"orange" }}> Add Picture </label>
                  </p>}
                <div className="Profile-txt">
                  <h4>{MyProfile?.username ? MyProfile?.username : 'Unnamed'}
                    <span class="email-span">{MyProfile?.email}</span>
                    <span id="wallet" className="profile_wallet hover-blue">
                      {WalletAddress}{" "}
                      <CopyToClipboard
                        text={WalletAddress}
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
                        <button
                          // onClick={
                          // }
                          // onClick={async () => {
                          //   await navigator.clipboard.writeText(WalletAddress);
                          //   toast.success("Address copied successfully", {
                          //     position: "top-right",
                          //     autoClose: 5000,
                          //     hideProgressBar: false,
                          //     closeOnClick: true,
                          //     pauseOnHover: false,
                          //     draggable: true,
                          //     progress: undefined,
                          //   });
                          // }}
                          id="btn_copy"
                          title="Copy Address"
                          disabled={state.isDisable}
                        >
                          <i className="fa fa-files-o"></i>
                        </button>
                      </CopyToClipboard>
                    </span>
                  </h4>

                </div>
              </div>
              <div className="profile-text-container">
                <p>
                  {/* {showMore ? text : `${text?.substring(0, 45)}`}
                    {text?.length > 45 ? (
                      <span className="btn-more-less" onClick={() => setShowMore(!showMore)}>
                        {showMore ? " show less" : "...show more"}
                      </span>
                    ) : null
                    } */}

                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" container-fluid">
        <div className="container">
          <div className="row justify-content-center">
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
            <div className="col-md-12 col-lg-12 col-sm-12">
              <div className="Topbarsetting">
                <ul class="de_nav de_nav">
                  <li>
                    <a href="/myprofile">Preview Profile</a>
                  </li>
                  <li id="Mainbtn4" class="">
                    <span onClick={Logoutt}>Logout</span>
                  </li>
                </ul>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Formik
                    validationSchema={CreateSchema}
                    innerRef={formRef}
                    onSubmit={() => onsubmitHandler()}
                    validator={() => ({})}
                    initialValues={{
                      username: "",
                      bio: "",
                      email: "",
                      instagramLink: "",
                      twitterLink: "",
                      yourSiteLink: "",
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
                        name="contactForm"
                        id="contact_form"
                        className="form-border"
                        onSubmit={handleSubmit}
                      >

                        <div className="row">
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="field-set">
                                  <label>Name</label>
                                  <input type="text" onChange={(e) => {
                                    inputhandler(e);
                                    handleChange(e);
                                  }}
                                    // disabled={MyProfile?.username ?? false}
                                    value={values.username}
                                    maxLength={20}
                                    name="username" id="username" placeholder="Enter Your Full Name" className="form-control" />
                                </div>
                                {errors.username && touched.username && (
                                  <div className="text-red">
                                    {errors.username}
                                  </div>
                                )}
                              </div>
                              {/* <div className="col-md-6">
                                <div className="field-set">
                                  <label>Username</label>
                                  <input
                                    onChange={(e) => {
                                      inputhandler(e);
                                      handleChange(e);
                                    }}
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={values.username}
                                    placeholder="Enter Your Username Here..."
                                    className="form-control"
                                    disabled={MyProfile?.username ?? false}
                                  />
                                </div>
                                {errors.username && touched.username && (
                                  <div className="text-red">
                                    {errors.username}
                                  </div>
                                )}
                              </div> */}
                              <div className="col-md-6">
                                <div className="field-set">
                                  <label>Email</label>
                                  <input
                                    placeholder="MyEmailAddress@domain.com"
                                    onChange={(e) => {
                                      inputhandler(e);
                                      handleChange(e);
                                    }}
                                    type="email"
                                    value={values.email}
                                    name="email"
                                    id="email"
                                    className="form-control"
                                  />
                                </div>
                                {errors.email && touched.email && (
                                  <div className="text-red">{errors.email}</div>
                                )}
                              </div>
                              <div className="col-md-12">
                                <div className="field-set">
                                  <label>Biography (Optional) </label>
                                  <textarea
                                    data-autoresize
                                    name="bio"
                                    id="bio"
                                    onChange={(e) => {
                                      inputhandler(e);
                                      handleChange(e);
                                    }}
                                    className="form-control"
                                    value={values.bio}
                                    maxLength={300}
                                    placeholder="We all Have a story and message for the world!"
                                  ></textarea>
                                </div>
                                {errors.bio && touched.bio && (
                                  <div className="text-red">{errors.bio}</div>
                                )}
                              </div>
                              <div className="col-md-12">

                                <input
                                  onChange={fileschange}
                                  type="file"
                                  id="img" accept=".png, .jpg, .jpeg" style={{ display: "none" }}
                                  className="form-control"
                                />

                              </div>
                              {/* <div className="col-md-12">
                                <div className="field-set">
                                  <label>Content Creator</label>
                                  {
                                    organization?.length == 0 ? <p style={{ color: "red" }}>No organization found please add from admin side </p>
                                      :
                                      <select className="form-control" onChange={(data) => setOrgID(data.target.value)}>
                                        {orgCheck ? (
                                          <option>
                                            <PulseLoader color="orange" size="11" />
                                          </option>) : (
                                          <>
                                            {preorganiation ?
                                              <option value={preorganiation} selected hidden >{preorganiationname}</option>
                                              :
                                              <option value={organization[0]?.id} selected hidden >{organization[0]?.name}</option>
                                            }

                                            {organization?.map((data) => (
                                              <>
                                                <option value={data.id} >{data.name} </option>
                                              </>
                                            ))}
                                          </>
                                        )}
                                      </select>}
                                  {orgset ? <div className="text-red">please Set organization</div> : ""}
                                </div>
                              </div> */}


                              <div className="col-md-12">
                                <div className="field-set">
                                  <label>Wallet Address</label>
                                  {WalletAddress ? (
                                    <span
                                      style={{
                                        wordBreak: "break-all",
                                      }}
                                      id="name"
                                      className="form-control wallet-span"
                                    >
                                      {WalletAddress}{" "}
                                      <CopyToClipboard
                                        text={WalletAddress}
                                        onCopy={() => {
                                          toast.success(
                                            "Address copied successfully",
                                            {
                                              position: "top-right",
                                              autoClose: 5000,
                                              hideProgressBar: false,
                                              closeOnClick: true,
                                              pauseOnHover: false,
                                              draggable: true,
                                              progress: undefined,
                                            }
                                          );
                                        }}
                                      >
                                        <FaCopy
                                          style={{
                                            float: "right",
                                            fontSize: "25px",
                                            marginTop: "0px",
                                            cursor: "pointer",
                                          }}
                                          title="Copy to use paperclip"
                                        />
                                      </CopyToClipboard>
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        backgroundColor: "none",
                                        color: "white",
                                      }}
                                      id="name"
                                      className="form-control"
                                    >
                                      Login To View Wallet address
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="spacer-30"></div>
                              <div className="col-md-12">
                                <div className="row">

                                  <div className="col-md-6">
                                    <div className="field-set">
                                      <label>Twitter </label>
                                      <input
                                        onChange={(e) => {
                                          inputhandler(e);
                                          handleChange(e);
                                        }}
                                        type="text"
                                        name="twitterLink"
                                        id="twitter"
                                        value={values.twitterLink}
                                        className="form-control"
                                        placeholder="Your Twitter Handle"
                                      />
                                      {errors.twitterLink && touched.twitterLink && (
                                        <div className="text-red">
                                          Link must be a URL
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="field-set">
                                      <label>Instagram </label>
                                      <input
                                        onChange={(e) => {
                                          inputhandler(e);
                                          handleChange(e);
                                        }}
                                        type="text"
                                        name="instagramLink"
                                        value={values.instagramLink}
                                        id="instagram"
                                        className="form-control"
                                        placeholder="Your Instagram Handle"
                                      />
                                      {errors.instagramLink &&
                                        touched.instagramLink && (
                                          <div className="text-red">
                                            Link must be a URL
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="field-set">
                                      <label>Your Website</label>
                                      <input
                                        onChange={(e) => {
                                          inputhandler(e);
                                          handleChange(e);
                                        }}
                                        type="text"
                                        name="yourSiteLink"
                                        value={values.yourSiteLink}
                                        id="yourSiteLink"
                                        className="form-control"
                                        placeholder="MyWebsite.xx"
                                      />
                                      {errors.yourSiteLink &&
                                        touched.yourSiteLink && (
                                          <div className="text-red">
                                            Link must be a URL
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 pt-2">
                          <div className="row" style={{ gap: 10 }}>
                            {isLoading ? (
                              <button
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
                            ) : (
                              <input
                                type="submit"
                                id="submit"
                                className="btn-main"
                                value="Save"
                              />
                            )}
                            <input
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
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="spacer-double"></div>
      <Footer />
    </div>
  );
}

export default ProfileSettings;

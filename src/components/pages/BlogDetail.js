import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link, useHistory, Redirect } from "react-router-dom";
import Footer from "../components/footer";
import "./shd.css"
import http from "../../Redux/Api/http";
import { useDispatch, useSelector } from "react-redux";
import Comments from "../shared/Comments";
import dateFormat from 'dateformat';
import defaultImg from "../../assets/images/default.png";
import { PulseLoader } from "react-spinners";
import { initial } from "lodash";
const BlogDetail = () => {
    const location = useLocation()
    const [blogData, setBlogData] = useState()
    const [description, setDescription] = useState(null)
    const [loader, setloader] = useState(true)
    const [comment1, setcommect1] = useState("");
    const [showcomments,setShowcomments]=useState([])
    const [comments, setcommect] = useState([])
    const [commentloading, setcommentloading] = useState(false)
    const slug = location.slugName
    const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
    const [Useraccountid, setUseraccountid] = useState(false)
    const { id } = useParams();
    const [loadmorebutton,setLoadmorebutton]=useState(true)
    const [filterData, setFilterData] = useState([]);

    const [profiledata, setprofiledata] = useState(false)
    const MyProfile = useSelector(
        (state) => state.MyProfile?.MyProfileResponse?.data
    );
    useEffect(async () => {
        await http
        .get(httpUrl + "/api/v1/Account/GetAllWhiteLableAddresses")
        .then((res) => {  
        })
        .catch((error) => {
    
        if(error?.status===400) 
        localStorage.setItem("userblock1","true")
        });
    }, [])
    const SUBMIT = async (Blogid, accountid, comment) => {
        setcommentloading(true)
        await http
            .post(httpUrl + "/api/v1/Blog/AddComment?blogId=" + Blogid + "&accountId=" + accountid + "&comment=" + comment)
            .then(async (res) => {
                setcommect1("")
                setcommect1()
                axios({
                    method: "get",
                    url: httpUrl + "/api/v1/Blog/GetAllComment?blogId=" + Blogid
                })
                    .then((response) => {
                        setcommect(response.data.data)
                        setShowcomments(response.data.data.slice(0,4))
                        setcommentloading(false)
                    })
                    .catch((error) => {
                        setcommentloading(false)
                    });
            })
            .catch((error) => {
                setcommentloading(false)
            });
    }
    const Commectsession = (Blogid, accountid,check) => {
        return (
            <section className="container">
                <div className="row">
                    <div className="col-lg-8 mb-5">
                        <h5 className="text-dark">Leave a Comment </h5>
                        {comment1?.length>499?<p style={{color:"red"}} > Words Limit Exceed </p> :<></>           }
                        {check?   
                        <textarea
                            data-autoresize
                            onChange={(e) => { setcommect1(e.target.value) }}
                            name="item_desc"
                            value={comment1}
                            maxLength={500}
                            id="item_desc"
                            className="form-control"
                        ></textarea>
                        :
                        <textarea
                        data-autoresize
                        onChange={(e) => { setcommect1(e.target.value) }}
                        name="item_desc"
                        value={comment1}
                        disabled={true}
                        maxLength={500}
                        id="item_desc"
                        className="form-control"
                    ></textarea>
                        }
                        {

                            commentloading ?
                                <button
                                    id="submit"
                                    className="btn-secondary text-center"
                                    style={{
                                        width: 150,
                                        height: 35,
                                        backgroundColor: 'orange',
                                        borderRadius: 30,
                                        borderWidth: 0,
                                    }} >
                                    <PulseLoader color="white" size="15" />
                                </button> :
                                comment1 && check && comment1.trim(' ' )?
                                    <button
                                        id="submit"
                                        onClick={() => SUBMIT(Blogid, accountid, comment1)}
                                        className="btn-secondary text-center"
                                        style={{
                                            width: 150,
                                            height: 35,
                                            
                                            backgroundColor: 'orange',
                                            borderRadius: 30,
                                            borderWidth: 0,
                                        }} > Post Comment </button> :
                                    <button
                                        id="submit"
                                        className="btn-secondary text-center"
                                        style={{
                                            width: 150,
                                            opacity: 0.6,
                                            cursor:"initial",
                                            height: 35,
                                            backgroundColor: 'orange',
                                            borderRadius: 30,
                                            borderWidth: 0,
                                        }} > Post Comment </button>

                        }
                    </div></div></section>
        );
    }
    useEffect(() => {
        setprofiledata(MyProfile)
        console.log("profile", MyProfile)
    }, [])
    const loadmore = () =>
    {
        let marketNftstate = showcomments;
        let start = marketNftstate?.length;
        let end = marketNftstate?.length + 4;
        if(loadmorebutton===false)
         {
            setShowcomments([
              ...comments?.slice(0, 4),
            ]);
        
          setLoadmorebutton(true)
          return
         }
       if(comments?.length<end ) setLoadmorebutton(false);
        if (filterData?.length) 
        {
            setShowcomments([...marketNftstate, ...filterData?.slice(start, end)]);
        } 
        else {
            setShowcomments([
            ...marketNftstate,
            ...comments?.slice(start, end),
          ]);
        }
    
    }
    useEffect(() => {
        axios({
            method: "get",
            url: httpUrl + `/api/v1/Blog/GetBlogBySlugUrl?slugUrl=${id}`
        })
            .then((response) => {
                let values = response.data

                setBlogData(response.data.data)
                let desc = response.data.data.description
                // let stringParts=desc.split("<img")
                // let str=stringParts[0]
                // for(let i=1;i<stringParts.length;i++){
                //     str=str+"<img style=\"width:200px;\" "+stringParts[i]

                // }
                setDescription(desc)
                // setBlogList(values)
                setloader(false)
                let blogId = response.data.data.id
                axios({
                    method: "get",
                    url: httpUrl + `/api/v1/auth/current`
                })
                    .then((response) => {
                        let userId = response.data.data.id
                        setUseraccountid(response.data.data.id)
                        axios({
                            method: "post",
                            url: httpUrl + `/api/v1/Blog/AddBlogView?blogId=${blogId}&accountId=${userId}`,
                        })
                            .then((response) => {
                            })
                            .catch((error) => {
                            });
                    })
                    .catch((error) => {
                    });
                axios({
                    method: "get",
                    url: httpUrl + "/api/v1/Blog/GetAllComment?blogId=" + response.data.data.id
                })
                    .then((response) => {
                        setcommect(response.data.data)
                        setShowcomments(response.data.data.slice(0,4))

                    })
                    .catch((error) => {
                    });
            })
            .catch((error) => {
            });
    }, [])
    return (<>

        <section class="blog-Detail-page relative">

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
            {
                loader ? (
                    <>
                    </>
                ) : (
                    <>
                        {/* {
                            BlogList?.map((item) => ( */}
                        <div class="container">

                            <div class="row">

                                <div className="col-lg-12 col-md-12 col-sm-12">

                                    <h1>{blogData.title}</h1>

                                    <p><i className="fa fa-calendar"></i>{" "}{blogData.createtdDate.split("T")[0]}</p>

                                </div>
                            </div>
                            <div className="spacer-single"></div>  <img style={{ width: "300px", height: "300px" }} src={httpUrl + "/" + blogData.image} alt="banner" />
                            <div class="row">

                                  
                                    <p style={{wordBreak:"break-all"  }}>
                                        <div className="ck-content" dangerouslySetInnerHTML={{ __html: description }}></div>
                                    </p>
                     
                    
                                {
                                    localStorage.getItem("userblock1")==="true"?
                                    <></>:

                                    blogData?.isEnable ?
                                        <>
                                            {Commectsession(blogData.id, Useraccountid, true)}
                                            {
                                                comments?.length == 0 ? <></> :
                                                    <>

                                                        <h3>Comments {comments?.length} </h3>
                                                        {
                                                            showcomments?.map((value, index) => {
                                                                return (
                                                                    <>
                                                                        {
                                                                            value?.comments ?
                                                                                <div className="item_creator" style={{ borderBottom: "0.5px solid #0000002e" }}>
                                                                                    <div className="pic-post">
                                                                                        <div className="creator_list_pp">
                                                                                            <div >
                                                                                                <img
                                                                                                  src={value?.profileImage ? httpUrl + "/" + value?.profileImage : defaultImg}
                                                                                                    // src="./images/author/author-1.jpg"
                                                                                                    alt="Author.png"
                                                                                                    className="author_sell_Nft_image lazy"
                                                                                                    style={{ width: 35, objectFit: "cover", height: 35, borderRadius: "100%", marginTop: '10px' }}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="creator_list_info txt-m-left" style={{ paddingLeft: "50px" }}>
                                                                                        <h6><b> {value?.userName ? value?.userName : "Default Name"} </b> { }</h6>
                                                                                            <p>                            {
                                                                                                value?.comments
                                                                                            }
                                                                                            </p>
                                                                                            <p>                            {
                                                                                                dateFormat(value?.createdAt + "Z", "dddd, mmmm dS, yyyy") 
                                                                                                       }{' '}
                                                                                                   at {' '} {
                                                                                                dateFormat(value?.createdAt + "Z", "HH:MM TT") 
                                                                                                       }
                                                                                            </p>
                                                                                        </div>

                                                                                    </div>
                                                                                </div> : <></>
                                                                        }
                                                                    </>
                                                                );
                                                            }
                                                            )
                                                        
                                                       
                                                        }
                                                    </>
                                            
                                            }
                                              <div className="col-lg-12">
              <div className="spacer-single"></div>
              {
                    comments?.length>5?
                  <>               
              <span onClick={loadmore} className="btn-main lead m-auto">
                      { loadmorebutton?         
                        "Load More" :"Load Less" }
                 

                  

              </span>
              </>
:<></> }
            </div>
                                        </>
                                        : (<> <p style={{ color: 'red' }}>Comments are off by the Admin   </p>
                                            {Commectsession(blogData.id, Useraccountid, false)} </>)

                                }
                            </div>
                        </div>
                    </>)
            }

        </section>
        <Footer />
    </>)
};
export default BlogDetail;

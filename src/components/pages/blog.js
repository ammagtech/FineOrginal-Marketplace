import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Footer from "../../components/components/footer";
import banner from "../../assets/images/banner-img.jpg";
import { Link } from "react-router-dom"
import axios from "axios";
import trimText from './TrimText'
import Comments from "../shared/Comments";
const getCurruntYear = () => {
    return new Date().getFullYear();
}
const Blog = () => {
    const [blogList, setblogList] = useState([])
    const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;
    useEffect(() => {

        axios({
            method: "get",
            url: httpUrl + "/api/v1/Blog/GetAllBlog",
        })
            .then((response) => {
                setblogList(response.data.data)
            })
            .catch((error) => {
            });
    }, [])
    const readMore = (slug) => {
        axios({
            method: "get",
            url: httpUrl + "/api/v1/Blog/GetBlogBySlugUrl?slugUrl=" + slug,
        })
            .then((response) => {
            })
            .catch((error) => {
            });
    }
    return (
        <>
            <section class="blog-page relative">
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
                <div class="container">
                    <div class="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <h1 className="text-center">Blog</h1>
                        </div>
                    </div>
                    <div className="spacer-single"></div>
                    <div class="row">
                        {
                            blogList?.map((blog) => {
                                return (<>
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="blog-post">
                                            <span className="date-txt">{blog.createtdDate.split("T")[0]}</span>

                                            <div className="img-pnl">


                                                <Link to={{ pathname: `/BlogDetail/${blog.slugUrl}`, slugName: `${blog.slugUrl}`, }}>

                                                    <img src={httpUrl + "/" + blog.image} alt="banner" />

                                                </Link>

                                            </div>
                                            <div className="txt-pnl">

                                                    <h2>
                                                        {blog.title}
                                                    </h2>     
                                                <ul className="btn-list">
                                                    {
                                                        blog.blogTags.map((name,index)=>   
                                                    <li >
                                                        <a  style={{marginBottom:"4px",backgroundColor:"orange",border:"none",color:"white"}}>
                                                            {name.name}
                                                        </a>

                                                        {index>3?<div className="pt-2"></div>:<></> }
                                                    </li>
                                                    )
                                                }
                                                  </ul>
                                                <p>
                                                    <div dangerouslySetInnerHTML={{ __html:trimText(blog.description.replaceAll("h2","p").replaceAll("h1","p"), 20, 100)[0] }}></div>
                                                </p>

                                                <Link to={{ pathname: `/BlogDetail/${blog.slugUrl}`, slugName: `${blog.slugUrl}`, }}>Read More</Link>

                                            </div>
                                        </div>
                                    </div>
                                </>)
                            })
                        }
                    </div>

                </div>
            </section>
            <Footer />
        </>
    )
};
export default Blog;

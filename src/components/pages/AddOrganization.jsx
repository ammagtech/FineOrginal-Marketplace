import { Web3Provider } from '@ethersproject/providers'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { PulseLoader, RingLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import Web3 from "web3"
import {
    Modal,
    Row,
    Col,
    Form as Formm,
    Button,
  } from "react-bootstrap";
const AddOrganization = () => {
    const [data, setData] = useState({
        name: "", email: "", address: "", walletAddress: "",
        amount: null, platfarmPercentage: 5, siteLink: null, uploadedFromComputer: false
    })


    const [validation, setValidation] = useState({
        name: "", email: "", address: "", walletAddress: "",
        amount: null, platfarmPercentage: null, siteLink: null, uploadedFromComputer: false
    })

    // const [organizations, setOrganizations] = useState([1, 2, 3, 4, 54])

    const [organizations, setOrganizations] = useState([])
    const [filteredOrganizations, setFilteredOrganizations] = useState([])
    const [updateId, setUpdateId] = useState(null)
 const [isdeleteorganization,setdeleteorganization]=useState(0)
  const [isToShowModal, setIsToShowModal] = useState(false);
    const [uploadLogoImage, setUploadLogoImage] = useState(false);
    const [uploadLogoImage1, setUploadLogoImage1] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadLogoImageError, setUploadLogoImageError] = useState("");
    const [isButtonPressed, setIsButtonPressed] = useState(false)

    useEffect(() => {
        getMyOrganizations()
    }, [])

    const getMyOrganizations = () => {
        axios.get(process.env.REACT_APP_DEVELOPMENT_URL + "api/v1/Organization/GetAllOrganizationUser").then(resp => {
            setOrganizations(resp.data.data)
            setFilteredOrganizations(resp.data.data)

        }).catch(err => {

        })
    }


    const deleteOrganization = (id) => {
        axios.put(process.env.REACT_APP_DEVELOPMENT_URL + `api/v1/Organization/RemoveOrganizationUser?OrganizationId=${id}`).then(resp => {
            toast.success("Organization removed successfully")
            getMyOrganizations()

        }).catch(err => {
            toast.error("Something went wrong")
        })


    }





    const handleChange = (e) => {
        const { name, value } = e.target
        let error = ""
        var emailvalidation = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
        var wallet = /^0x[a-fA-F0-9]{40}$/g;
        var wallet1 = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/g;
        const nameValidation = /^(?![\s.]+$)[a-zA-Z\s.]*$/;

        switch (name) {
            case "name":
                if (value.length == 0) {
                    error = "Organization name required"
                }
                else if (!value?.match(nameValidation)) {
                    error = "Name only contains alphabets and numbers only"
                }
                break

            case "email":
                if (!value?.match(emailvalidation)) {
                    error = "Invalid email format"
                }
                break;
            case "address":
                if (value.length == 0) {
                    error = "address is required"
                }
                break;
            case "siteLink":
                const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
                if (!regex.test(value)) {
                    error = "Invalid URL"
                }
                break;

            case "platfarmPercentage":
                if ( value<2||value>25) error = "Platform percentage must be between 2-25"
                else if (!number_test(value)) {
                    error = "Decimal numbers are not allowed"
                }
                break;

            case "amount":
                if (!number_test(value)) {
                    error = "Decimal numbers are not allowed"
                }
                break;

            case "walletAddress":
                if (value.length == 0) {
                    error = "Wallet address is required"
                }
                else if (value?.match(wallet) || value?.match(wallet1)) {

                }
                else {
                    error = "Wallet Address is not valid"
                }
                break;

        }
        setValidation((prev) => {
            return { ...prev, [name]: error }
        })
        setData((prev) => {
            return { ...prev, [name]: value }
        })
    }

    function number_test(n) {
        var result = (n - Math.floor(n)) !== 0;

        if (result)
            return false;
        else
            return true;
    }

    const addOrganization = () => {
        setIsButtonPressed(true)
        if (!data.name || !data.email || !data.siteLink || !uploadLogoImage) {
            toast.error("Please fill the form carefully")
            return
        }


        if ( validation.name || validation.email || validation.siteLink || !uploadLogoImage) {

            toast.error("Please fill the form carefully")

            return
        }
        setIsLoading(true)
        const bodyData = new FormData()
        bodyData.append("Name", data.name)
        bodyData.append("Address", data.address)
        bodyData.append("Email", data.email)
        // bodyData.append("WalletAddress", data.walletAddress)
        // bodyData.append("AmountInPercent", data.platfarmPercentage)
        // orgaCommision
        bodyData.append("LogoImage", uploadLogoImage)
        bodyData.append("YourSiteLink", data.siteLink)
        // bodyData.append("PlateformFeePercentage", data.amount)
        // platcommision
        if (updateId) {
            setIsButtonPressed(false)
            axios.put(process.env.REACT_APP_DEVELOPMENT_URL + `api/v1/Organization/UpdateOrganizationUser?OrganizationId=${updateId}`,
                bodyData).then(resp => {
                    setUploadLogoImage(null)

                    setData({
                        name: "", email: "", address: "", walletAddress: "",
                        amount: 0, platfarmPercentage: 5, siteLink: "", uploadedFromComputer: false
                    })
                    setUpdateId(null)
                    getMyOrganizations()
                    toast.success("Organization updated successfully")
                    setIsLoading(false)
                }).catch(error => {
                    setIsLoading(false)
                    toast.error("Something went wrong")
                })

        }
        else {
            setIsButtonPressed(false)

            axios.post(process.env.REACT_APP_DEVELOPMENT_URL + "api/v1/Organization/AddOrganizationUser",
                bodyData).then(resp => {
                    if (resp.data.message === "Data successfully added") {


                        setUploadLogoImage(null)

                        setData({
                            name: "", email: "", address: "", walletAddress: "",
                            amount: false, platfarmPercentage: false, siteLink: "", uploadedFromComputer: false
                        })
                        getMyOrganizations()
                        toast.success("Organization created successfully")
                    }
                    else {
                        toast.error("Organization already exist")

                    }
                    setIsLoading(false)

                }).catch(error => {
                    setIsLoading(false)
                    toast.error("Something went wrong")
                })

        }
    }

    const logoImageFilesChange = (e) => {

        const file = e.target.files[0];
        if (
            file?.type === "image/jpeg" ||
            file?.type === "image/png" ||
            file?.type === "image/jpg" ||
            file?.type === "image/gif"
        ) {
            setData((prev) => {
                return { ...prev, uploadedFromComputer: true }
            })
            setUploadLogoImageError(null);
            setUploadLogoImage1(true)
            setUploadLogoImage((prev) => file);
        } else {
            setUploadLogoImageError("Invalid File Format ");
            setUploadLogoImage((prev) => null);
            setUploadLogoImage1(true)
        }
    };


    const handleSearchChange = (e) => {
        const filteredData = organizations.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setFilteredOrganizations(filteredData)
    }






    //   useEffect(()=>{
    //     if(Amountpercentage)
    //     {setAmountpercentage(parseInt(Amountpercentage))     
    //    if(Amountpercentage<0) 
    //       setAmountpercentage(0)
    //     if(Amountpercentage>25) 
    //       setAmountpercentage(  25  ) 
    //     }
    //     else
    //     {
    //       setAmountpercentage(0)

    //     }
    //    },[Amountpercentage])



    //   useEffect(()=>{
    //     if(WalletAddress=="" ) return
    //     var wallet = /^0x[a-fA-F0-9]{40}$/g;
    //     var wallet1=/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/g;
    //     if(WalletAddress?.match(wallet)||WalletAddress?.match(wallet1)) setWalletAddressvalidation(true)
    //     else {setWalletAddressvalidation(false);  }
    //   },[WalletAddress])

    //   useEffect(()=>{
    //     if(Amount1==null ) return
    //     if(Amount1<=0) setAmountvalidation(false)
    //     else {setAmountvalidation(true);  }
    //   },[Amount1])

    //   useEffect(()=>{
    //     if(YourSiteLink=="" ) return
    //     if(urlPatternValidation(YourSiteLink) ) setYourSiteLinkvalidation(true)
    //      else {setYourSiteLinkvalidation (false);  }
    //   },[YourSiteLink])





    const urlPatternValidation = URL => {

        // if(URL=="") return true

        // if(URL==null) return true
        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');

        return regex.test(URL);
    };



    return (
        <section className="jumbotron breadcumb no-bg">
            <div className="small-pnl secnd-anime">
                <div className="bg-layer"></div>
            </div>
            <div className='mainbreadcumb'>
                <section className="container ">
                    <h1 className='text-center'>
                        Add Organization
                    </h1>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className='row'>
                            <div className='col-md-8'>
                                <div className="spacer-10"></div>
                                <h5 className="text-dark">Name of organization</h5>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    maxLength={40}
                                    value={data.name}
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter name of organization"
                                />
                                {validation.name && <span className='text-danger'>{validation.name} </span>}

                                <div className="spacer-10"></div>

                                <h5 className="text-dark">Email of organization</h5>
                                <input
                                    type="email"
                                    onChange={handleChange}
                                    maxLength={40}
                                    value={data.email}
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter email of organization"
                                />
                                {validation.email && <span className='text-danger'>{validation.email} </span>}

                                <div className="spacer-10"></div>
                                <h5 className="text-dark">Address of organization</h5>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    maxLength={60}
                                    value={data.address}
                                    name="address"
                                    className="form-control"
                                    placeholder="Enter address of organization"
                                />
                                {validation.address && <span className='text-danger'>{validation.address} </span>}

                                {/* <div className="spacer-10"></div> */}
{/* 
                                <h5 className="text-dark">
                                    Wallet address of organization</h5>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    maxLength={44}
                                    value={data.walletAddress}
                                    name="walletAddress"
                                    className="form-control"
                                    placeholder="Wallet Address name of organization"
                                />
                                {validation.walletAddress && <span className='text-danger'>{validation.walletAddress} </span>}

                                <div className="spacer-10"></div>

                                <h5 className="text-dark">Organization Commission in Percentage</h5>
                                <input
                                    type="number"
                                    onChange={handleChange}
                                    maxLength={40}
                                    value={data.amount}
                                    name="amount"
                                    min="0"
                                    step="1"
                                    className="form-control"
                                    placeholder="Enter amount"
                                />
                                {validation.amount && <span className='text-danger'>{validation.amount} </span>}
                                <div className="spacer-10"></div>

                                <h5 className="text-dark">Platform Commission in Percentage</h5>
                                <input
                                    type="number"
                                    onChange={handleChange}
                                    maxLength={40}
                                    min="0"
                                    step="1"
                                    value={data.platfarmPercentage}
                                    name="platfarmPercentage"
                                    className="form-control"
                                    placeholder="Enter platformPercentage"
                                />
                                {validation.platfarmPercentage && <span className='text-danger'>{validation.platfarmPercentage} </span>} */}
                                <div className="spacer-10"></div>
                                <h5 className="text-dark">Site Link</h5>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    maxLength={40}
                                    value={data.siteLink}
                                    name="siteLink"
                                    className="form-control"
                                    placeholder="Enter Site Link"
                                />
                                {validation.siteLink && <span className='text-danger'>{validation.siteLink} </span>}
                                <div className="spacer-10"></div>

                                {
                                    isLoading ? <button
                                        style={{
                                            backgroundColor: "orange",
                                            borderRadius: 20,
                                            height: 35,
                                            width: 130,
                                            borderWidth: 0,
                                        }}
                                    >
                                        <PulseLoader color="white" size="11" />
                                    </button> : <input
                                        type="button"
                                        id="submit"
                                        className="btn-main whiter"
                                        value={`${updateId ? "Update Organization" : "Add Organization"}`}
                                        onClick={addOrganization}
                                    />
                                }

                            </div>

                            <div className='col-md-4'>
                                <h5 className="txt-dark">
                                    Organization Image
                                </h5>

                                <div className="collect-create-logo">
                                    <p
                                        id="file_name"
                                        className={uploadLogoImageError ? "text-danger" : "picture_centered"}
                                    >
                                        {
                                         uploadLogoImage1 ?<>
                                        {uploadLogoImage ? (
                                            <img
                                                src={updateId && !data.uploadedFromComputer ? process.env.REACT_APP_DEVELOPMENT_URL + uploadLogoImage : URL.createObjectURL(uploadLogoImage)}
                                                className="get_upload_file_logo"
                                                alt="AddCollection.png"
                                            />
                                        ) : (
                                            "Please Select PNG, JPG, JPEG Or GIF"
                                        )}
 
                                         
                                         </>   :
                                          (<p style={{color:"orange" }}>
                                            Please Select PNG, JPG, JPEG Or GIF
                                            </p>
                                        
                                        )
                                        }
                                                                            </p>
                                    <div className="browse">
                                        <input
                                            type="button"
                                            id="get_file"
                                            name="logoImage"
                                            className="btn-main"
                                            value="Upload"
                                        />
                                        <input
                                            id="upload_file"
                                            type="file"
                                            name="logoImage"
                                            onChange={(e) => {
                                                logoImageFilesChange(e);
                                                handleChange(e);
                                            }}
                                        />
                                    </div>
                                </div>
                                {!uploadLogoImage && isButtonPressed && <span className='text-danger'>Logo is required </span>}

                            </div>
                        </div>
                    </div>


                    <div className="collect-create-logo w-100 p-4" style={{ marginTop: "100px" }}>
                        <h3>Your Organizations</h3>


                        <div className="items_filter w-100 text-center">
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="row form-dark w-100"
                                id="form_quick_search"
                                name="form_quick_search"
                            >
                                <div className="offset-lg-3 col-lg-6 d-flex align-items-start justify-content-center">
                                    <input
                                        className="form-control w-100"
                                        id="name_1"
                                        name="name_1"
                                        placeholder="search organization here..."
                                        type="text"
                                        onChange={handleSearchChange}

                                    />
                                    <button id="btn-submit" type='button'>
                                        <i className="fa fa-search bg-color-secondary"></i>
                                    </button>
                                    <div className="clearfix"></div>
                                </div>
                            </form>

                        </div>

                        <div className='table-main'>
                            <div className='table-main-inner'>
                                <div className='table-smallyyyy' style={{ maxHeight: "300px", overflowY: "scroll" }}>
                                    <table className='w-100'>
                                        <thead>
                                            <tr style={{
                                                position: "sticky", top: "0px"
                                                , backgroundColor: "#d8d2d2",
                                                lineHeight: "30px"
                                            }}>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>Wallet Address</th>
                                                <th>Org Commision</th>
                                                <th>Platform Commission</th>
                                                <th>Site Link</th>
                                                <th>Action</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredOrganizations?.map((item, index) => <tr key={index} style={{
                                                    lineHeight: "50px"
                                                }}>
                                                    <td>{item?.name?.length > 6 ? item.name.substring(0, 6) : item?.name}</td>
                                                    <td>{item?.email}</td>
                                                    <td>{item?.address?.length > 10 ? item?.name?.substring(0, 10) : item?.address}</td>
                                                    <td>{item?.walletAddress?.length > 3 ? item?.walletAddress?.substring(0, 3) + "..." + item?.walletAddress?.slice(-3) : item?.walletAddress}</td>
                                                    <td>{item?.amountInPercent + " %"}</td>
                                                    <td>{item?.plateformFeePercentage + " %"}</td>
                                                    <td>{item?.yourSiteLink}</td>
                                                    <td><i className="fa fa-trash mr-2 cursor-pointor"
                                                        onClick={() => {    setIsToShowModal(true) ;         setdeleteorganization( item?.id )   }}
                                                        style={{ color: "red" }} />
                                                        {!item?.isBlock &&
                                                            <i className="fa fa-edit cursor-pointor"
                                                                onClick={() => {
                                                                    setUpdateId(item?.id)
                                                                    setData((prev) => {
                                                                        return {
                                                                            name: item?.name, email: item?.email, address: item?.address,
                                                                            walletAddress: item?.walletAddress, amount: item?.amountInPercent,
                                                                            platfarmPercentage: item?.plateformFeePercentage, siteLink: item?.yourSiteLink
                                                                        }
                                                                    })
                                                                    setUploadLogoImage(item?.logoImage)
                                                                    setUploadLogoImage1(true)
                                                                }}

                                                            />}</td>
                                                    <td style={{ color: item?.isBlock ? "red" : "green", fontWeight: 700 }}>{item?.isBlock ? "Block" : "Active"}</td>
                                                </tr>)
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal centered show={isToShowModal} onHide={() => {
                           setIsToShowModal(false)
          }}>
            <Modal.Header closeButton>
              {/* <Modal.Title >
                <p > Alert</p> </Modal.Title> */}
            </Modal.Header>
            <Modal.Body style={{ color: "red", textAlign: "center" }}>

              <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}  > Do you want to delete Organization?</p>
              <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between" }} >
                <button
                  style={{
                    width: 150,
                    height: 35,
                    borderRadius: 30,
                    borderWidth: 0,
                  }}
                  value={"Cancel"}
                  className="btn-main whiter"
                  onClick={() =>  setIsToShowModal(false)}
                >No </button>
                
                    <button
                      style={{
                        width: 150,
                        height: 35,
                        borderRadius: 30,
                        borderWidth: 0,
                      }}
                      value={"Cancel"}
                      className="btn-main whiter"
                      onClick={() => { setIsToShowModal(false);   deleteOrganization( isdeleteorganization)}}
                    >Yes </button>
                
              </div>
            </Modal.Body>
          </Modal>

                </section>
            </div>



        </section>
    )
}

export default AddOrganization
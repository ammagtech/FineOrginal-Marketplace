import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, utils } from "ethers";
import localforage from "localforage";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Web3 from "web3";
import { MyProfileRequest } from "../Redux/Actions/Account/MyProfileAction";
import AuthConnectAction, {
  AuthConnectRequest,
} from "../Redux/Actions/AuthActions/AuthConnectAction";
import ValidateSignatureAction, {
  ValidateSignatureRequest,
} from "../Redux/Actions/AuthActions/ValidateSignatureAction";
import { WalletDisconnect } from "../Redux/Actions/WalletActions/WalletAction";
import { showConsole } from "../utils/common-functions";

export const signMessage = (message) => async (dispatch) => {
  if (window.ethereum) {
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();
    return new Promise((resolve, reject) => {
      dispatch(
        ValidateSignatureAction(
          {
            address: address,
            signature: signature,
          }
          // true
        )
      )
        .then((res) => {
          resolve(res);
          // console.log(res);
        })
        .catch((err) => {
          // console.log(err);
          reject(err);
        });
    });
  }
};

export const buyNftMarket = (payload) => async (dispatch) => {
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "nftContractId",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "closeMarketForFixedType",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ];
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    // console.log("PAYLOAD BUY NFT", payload);
    const priceVal = Web3.utils.toWei(String(payload.price, "ether"));
    // const priceVal = window.web3.utils.toWei(payload.price, 'ether').toString();
    // // console.log("decimals", decimals);
    let d = {
      value: payload.price.toString(),
    };
    let contract = new ethers.Contract(payload.contractAddress, minABI, signer);

    await contract
      .closeMarketForFixedType(payload.nftContractId, payload.tokenId, {
        value: priceVal,
        gasLimit: 250000,
      })
      .then(async (response) => {
        // console.log("nft approve response", response);
        resolve(response);
      })
      .catch((err) => {
        reject(err);
        // console.log("errrrrrrr nft approve", err);
      });
  });
};

export const cancelNft = (payload) => async (dispatch) => {
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "nftContractId",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          }
        ],
        name: "cancel",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
    ];
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    // console.log("PAYLOAD FOR CANCEL", payload);
    let contract = new ethers.Contract(payload.contractAddress, minABI, signer);
    await contract
      .cancel(payload.nftContractId, payload.tokenId, {
        gasLimit: 250000,
      })
      .then(async (res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const openForAuction = (payload) => async (dispatch) => {
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "_approved",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    // console.log("PAYLOAD APPROVE", payload);
    let contract = new ethers.Contract(payload.nftContractId, minABI, signer);
    await contract
      .approve(payload.contractAddress, payload.tokenId, {
        gasLimit: 250000,
      })
      .then(async (res) => {
        let minABI = [
          {
            inputs: [
              {
                internalType: "address",
                name: "nftContractId",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "price",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "maxPrice",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "isUnderOrgnization",
                type: "bool"
              },
              {
                internalType: "address",
                name: "orgnizationAddress",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "orgnizationPercentage",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "platFormFeePercentage",
                type: "uint256"
              }
            ],
            name: "openMarketForAuctionType",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
          },
        ];
        const provider1 = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider1.getSigner();




        const priceVal = window.web3.utils.toWei(String(payload.price));
        // const orgPercentage = window.web3.utils.toWei(payload.orgnizationPercentage, "ether");
        const maxPrice = window.web3.utils.toWei(String(payload.maxPrice));

        // const priceVal = window.web3.utils.toWei(payload.price, 'ether').toString();
        // console.log("priceVal auction", priceVal);
        let contract = new ethers.Contract(
          payload.contractAddress,
          minABI,
          signer
        );

        // console.log("this is nftContractId ", payload.nftContractId)
        // console.log("this is tokenId ", payload.tokenId)
        // console.log("this is priceVal ", priceVal)
        // console.log("this is maxPrice ", maxPrice)
        // console.log("this is isUnderOrgnization ", payload.isUnderOrgnization)
        // console.log("this is orgnizationAddress ", payload.orgnizationAddress)
        // console.log("this is orgnizationPercentage ", payload.orgnizationPercentage)



        await contract
          .openMarketForAuctionType(
            payload.nftContractId,
            payload.tokenId,
            priceVal,
            maxPrice,
            payload.isUnderOrgnization,
            payload.orgnizationAddress,
            payload.orgnizationPercentage,
            payload.platform_percentage,
            {
              gasLimit: 250000,
            }
          )
          .then(async (response) => {
            // console.log("nft auction response", response);
            resolve({ res, response });
          })
          .catch((err) => {
            reject(err);
            // console.log("errrrrrrr nft approve", err);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const acceptBid = (payload) => async (dispatch) => {
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "nftContractId",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "buyerAccount",
            type: "address",
          },
        ],
        name: "closeMarketForAuctionType",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    // console.log("closeMarketForAuctionType  :: ", payload);
    const priceVal = window.web3.utils.toWei(String(payload.price));

    // const priceVal = window.web3.utils.toWei(payload.price, 'ether').toString();
    // console.log("closeMarketForAuctionType price  :: ", priceVal);
    let contract = new ethers.Contract(payload.contractAddress, minABI, signer);
    await contract
      .closeMarketForAuctionType(
        payload.nftContractAddress,
        payload.tokenId,
        priceVal,
        payload.buyerAddress,
        {
          gasLimit: 250000,
        }
      )
      .then(async (response) => {
        // console.log("nft approve response", response);
        resolve(response);
      })
      .catch((err) => {
        reject(err);
        // console.log("errrrrrrr nft approve", err);
      });
  });
};

export const approveNft = (payload) => async (dispatch) => {
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "_approved",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    // console.log("PAYLOAD APPROVE", payload);
    const priceVal = window.web3.utils.toWei(payload.price.toString() , "ether");
    let contract = new ethers.Contract(payload.contractAddress, minABI, signer);
    await contract
      .approve(payload.marketPlaceContract, priceVal, {
        gasLimit: 250000,
      })
      .then(async (response) => {
        // console.log("nft approve response", response);
        resolve(response);
      })
      .catch((err) => {
        reject(err);
        // console.log("errrrrrrr nft approve", err);
      });
  });
};

export async function approveContract(payload, contractAddress, payloadMarket) {
  // console.log("***********");
  // console.log(payload);
  // console.log(contractAddress);
  // console.log(payloadMarket);
  // console.log("***********");
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "_approved",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    // let decimals = window.web3.utils.toBN(18)
    // const amount1 = Web3.utils.toWei(String(payload.value))
    // const tokenAddress = payload.tokenAddress
    // const accounts = await window.web3.eth.getAccounts();
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    // console.log("PAYLOAD APPROVE", payload.approved.data);
    let contract = new ethers.Contract(contractAddress, minABI, signer);
    await contract
      .approve(payload.approved.data, payload.tokenId, {
        gasLimit: 250000,
      })
      .then(async (response) => {
        // console.log("ressss approve", response);
        let minABI = [
          {
            inputs: [
              {
                internalType: "address",
                name: "nftContractId",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "price",
                type: "uint256"
              },
              {
                internalType: "bool",
                name: "isUnderOrgnization",
                type: "bool"
              },
              {
                internalType: "address",
                name: "orgnizationAddress",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "orgnizationPercentage",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "platFormFeePercentage",
                type: "uint256"
              }
            ],
            name: "openMarketForFixedType",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
          },
        ];
        const provider1 = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider1.getSigner();
        console.log("PAYLOAD for market", payloadMarket);
        const priceVal = window.web3.utils.toWei(payloadMarket.price, "ether");
        // const orgPercentage = window.web3.utils.toWei(payloadMarket.orgnizationPercentage, "ether");
        // console.log("PAYLOAD PRICEEEE", priceVal);
        console.log("contract market", contractAddress);
        console.log("contract payload.approved.datapayload.approved.data", payload);

        let contract = new ethers.Contract(
          payload.approved.data,
          minABI,
          signer
        );
        console.log("contract", contract)
        await contract
          .openMarketForFixedType(
            payloadMarket.nftContractId,
            payloadMarket.tokenId,
            priceVal,
            payloadMarket.isUnderOrgnization,
            payloadMarket.orgnizationAddress,
            payloadMarket.orgnizationPercentage,
            payloadMarket.plateformFeePercentage,
            {
              gasLimit: 250000,
            }
          )
          .then(async (res) => {
            resolve({ res, response });
          })
          .catch((err) => {

            console.log("errrrrrrr market", err);
            reject(err);
          });
        // resolve(res)
      })
      .catch((err) => {
        reject(err);
        // console.log("errrrrrrr");
      });
  });
}

export async function mint(payload, contractAddress, royalty) {
  const provider = await detectEthereumProvider();
  console.log("imidmad", royalty)
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "_to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "_royality",
            type: "uint256"
          },
          {
            internalType: "string",
            name: "_uri",
            type: "string"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      // {
      //   inputs: [
      //     {
      //       internalType: "address",
      //       name: "_to",
      //       type: "address",
      //     },
      //     {
      //       internalType: "uint256",
      //       name: "_tokenId",
      //       type: "uint256",
      //     },
      //     {
      //       internalType: "string",
      //       name: "_uri",
      //       type: "string",
      //     },
      //   ],
      //   name: "mint",
      //   outputs: [],
      //   stateMutability: "nonpayable",
      //   type: "function",
      // },
    ];

    // const amount1 = Web3.utils.toWei(String(payload.value))
    // const tokenAddress = payload.tokenAddress
    // const accounts = await window.web3.eth.getAccounts();
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    // console.log("PAYLOAD", payload);
    // console.log("contracraderfas", contractAddress);
    let token_id = payload[0].tokenId;

    let uri = payload[0].uri;

    console.log(contractAddress)
    console.log(royalty)




    let contract = new ethers.Contract(contractAddress, minABI, signer);
    // console.log("HEHEHEEHEHHEHEH");
    await contract
      .mint(payload[0].to, token_id, royalty, uri, {
        gasLimit: 250000,
      })
      .then((res) => {
        res.wait().then(
          () => {
            resolve(res);

          }

        ).catch(() => {

        })


        console.log("ressss", res);

      })
      .catch((err) => {
        reject(err);

        console.log("errrrrrrr", err);
      });
  });
}
export async function multiMint(payload, contractAddress, royalty) {
  const provider = await detectEthereumProvider();
  console.log("imidmad", royalty)
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "_to",
            type: "address"
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "royality",
                type: "uint256"
              },
              {
                internalType: "string",
                name: "uri",
                type: "string"
              }
            ],
            internalType: "struct MarketplaceNFT.NFT[]",
            name: "data",
            type: "tuple[]"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },

    ];

    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    let token_id = payload[0].tokenId;
    let uri = payload[0].uri;
    

  
    const id = 1;

    const attr = [
      { tokenId: token_id, royality: royalty, uri: uri }
    ];
    // attr.push(    {tokenId: token_id, royality:royalty , uri: uri}
    //   )
    console.log("myarray", attr)

    let contract = new ethers.Contract(contractAddress, minABI, signer);
    // await contract
    // .mint(payload[0].to, attr).send();
    // console.log("HEHEHEEHEHHEHEH");
    await contract
      .mint(payload[0].to, attr, {
        gasLimit: 250000,
      })
      .then((res) => {
        res.wait().then(
          () => {
            resolve(res);

          }

        ).catch(() => {

        })


        console.log("ressss", res);

      })
      .catch((err) => {
        reject(err);

        console.log("errrrrrrr", err);
      });
  });
}
export async function openMarketForFixed(payload, contractAddress) {
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "nftContractId",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
        ],
        name: "openMarketForFixedType",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    // let decimals = window.web3.utils.toBN(18)
    // let decimals = window.web3.utils.toBN(payload.price)
    // // console.log("DECIMALS", decimals);
    // const amount1 = Web3.utils.toWei(String(payload.value))
    // const tokenAddress = payload.tokenAddress
    // const accounts = await window.web3.eth.getAccounts();
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    // console.log("PAYLOAD for market", payload);
    // console.log("PAYLOAD PRICEEEE", payload.price);
    // console.log("contract market", contractAddress);

    let contract = new ethers.Contract(contractAddress, minABI, signer);
    await contract
      .openMarketForFixedType(
        payload.nftContractId,
        payload.tokenId,
        payload.price,
        {
          gasLimit: 250000,
        }
      )
      .then((res) => {
        // console.log("ressss market", res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        // console.log("errrrrrrr market", err);
      });
  });
}

export const sendTransection = (payload) => async (dispatch) => {
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }
  // console.log("payload", payload);
  return new Promise((res, rej) => {
    // console.log("here");
    localStorage.setItem("confirmDialogOpen", true);
    if (window.ethereum) {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: payload,
        })
        .then(async (data) => {
          // console.log("data Transaction Completed ", data);
          res(data);
        })
        .catch((error) => {
          // console.log("error::::", error);
          rej(error);
        });
    }
  });
};

export const sellNFTAmount = (payload) => async (dispatch) => {
  // console.log("approve", payload);
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise(async (resolve, reject) => {
    let minABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "_from",
            type: "address",
          },
          {
            internalType: "address",
            name: "_to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    let decimals = window.web3.utils.toBN(18);
    const accounts = await window.web3.eth.getAccounts();
    // const balance = Web3.utils.toWei(String(0.0001));
    // const balance = parseInt(
    //   Web3.utils.toWei(String(payload.balance))
    // ).toString(8);
    // const tokenId = JSON.stringify(payload.tokenId);

    // const tokenAddress = payload.tokenAddress;
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider1.getSigner();
    // '0xCeeD223AbD796FD862AB707E86B46E4700dab8cE'
    // payload.idoContractAddress,

    let contract = new ethers.Contract(
      // "0x1359e3cbc99a525241cdd8c26b201447a573e2e1",
      payload.from,
      minABI,
      signer
    );

    // payload.from
    // payload.to
    // payload.tokenId

    await contract
      .transferFrom(accounts[0], payload.to, payload.tokenId, {
        gasLimit: 250000,
      })
      .then((res) => {
        // console.log("ressss stake", res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        // console.log("errrrrrrr", err);
      });
  });
};



export const checkBalance = async (tokenAddress = "0x6cfB4Daf6b2AbbfE7c0db97F0013bfB76E43D276",
  walletAddress = "0x0a8b0ae65a7062F6BdFD5e4C577E5CC3629971A5"
) => {
  const provider = await detectEthereumProvider()
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider)
  } else {
    window.web3 = new Web3(window.ethereum)
  }

  const minABI = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
  ];
  const contract = new window.web3.eth.Contract(minABI, tokenAddress);
  const result = await contract.methods.balanceOf(walletAddress)?.call();
  const format = window.web3.utils.fromWei(result);

}
export const checkBalance1 = async (tokenAddress, walletAddress) => {
  const provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    window.web3 = new Web3(provider);
  } else {
    window.web3 = new Web3(window.ethereum);
  }

  return new Promise((resolve, reject) => {

    const minABI = [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ];
    const contract = new window.web3.eth.Contract(minABI, tokenAddress);

    contract.methods.balanceOf(walletAddress).call().then(resp => {
      resolve(resp)

    }).catch(error => {
      reject(error)

    })

  })

}





import http from "../http";
const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

export default class GetNftMarketById {
  static GetNftMarketByIdApi(body) {
    return http.get(
      httpUrl +
        `/api/v1/Nft/GetNftMarketByIds?NFTSmartContractAddress=${body.nftId}&NFTTokenId=${body.accountId }`
    );
  }
}

// /GetNftMarketByIds?NFTSmartContractAddress=0x46101f0f14e2a5223f1fa7eaf306450d7f97193d&NFTTokenId=637871897746272288
// GetNftMarketById?nftId=${body.nftId}&accountId=${body.accountId}`
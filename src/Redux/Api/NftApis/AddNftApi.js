import { setDefaultBreakpoints } from "react-socks";
import http from "../http";
const httpUrl = process.env.REACT_APP_DEVELOPMENT_URL;

export default class AddNft {
  static AddNftApi(body) {
    return http.post(httpUrl + "/api/v1/Nft/AddNft", body);
  }
}

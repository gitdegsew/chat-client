import {io} from "socket.io-client"
import { baseUrl } from "./utils/api";
// const URL="http://192.168.0.163:3001"

export const socket = io(baseUrl, {
    autoConnect: false
  });
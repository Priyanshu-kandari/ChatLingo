import dotenv from "dotenv"
dotenv.config();
import {StreamChat} from "stream-chat"


const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

if(!apiKey || !apiSecret){
    console.error("Stream API key or Secret is Missing");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret,{
    timeout: 8000 // ⏱ 8 seconds
  });

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUsers([userData])
        return userData
    } catch(error){
        console.error("Error upserting Stream user:" , error)
    }
}

// export const generateStreamToken = (userId) => {

// }
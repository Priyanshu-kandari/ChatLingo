import dotENV from "dotenv";
dotENV.config();
import app from "./src/app.js"
import { connectDB } from "./src/lib/db.js";

const PORT = process.env.PORT;


app.listen(PORT, ()=>{
    console.log("app running at port", PORT);
    connectDB();
})
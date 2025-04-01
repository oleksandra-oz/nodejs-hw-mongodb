
import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

export const initMongoConnection = async () => {
    try {
        const pwd = getEnvVar("MONGODB_PASSWORD");
        const user = getEnvVar("MONGODB_USER");
        const url = getEnvVar("MONGODB_URL");
        const name = getEnvVar("MONGODB_DB");
        await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${name}?retryWrites=true&w=majority&appName=Cluster0`);
    } catch (error) {
        console.log(error.message);
        throw error;
        
    }
    

};
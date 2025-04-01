import { initMongoConnection } from "../src/db/initMongoConnection.js";
import { setupServer } from "./server.js";


await initMongoConnection();

setupServer();


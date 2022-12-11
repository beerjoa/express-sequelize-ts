import * as dotenv from "dotenv";
import path from "path";

const CONF_PATH = path.join(__dirname, "../../.env");

dotenv.config({ path: CONF_PATH });

export default {
  port: process.env.PORT,
  host: process.env.HOST,
};

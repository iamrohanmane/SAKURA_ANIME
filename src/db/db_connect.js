import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async () => {
  try {
    // check if /db_name is really needed, you can just do process.env.MOGODB_URI if not configured already
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    ); // formated string issue
    console.log(
      `\n MongoDB Connect !!! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED!!!", error);
    process.exit(1);
  }
};

export default connectDB

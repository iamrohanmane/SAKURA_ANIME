import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { user } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
      console.log(token);
      
    if (!token) {
      throw new apiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const tempuser = await user
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!tempuser) {
      throw new apiError(401, "Invalid Access Token");
    }
    req.tempuser = tempuser;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access token");
  }
});

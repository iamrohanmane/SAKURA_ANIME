import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";
import jwt from "jsonwebtoken"
const generateAccessAndRefereshTokens = async(userId) => {
  // console.log(userId)
  try {
    const tempuser = await user.findById(userId);
    const accessToken = tempuser.generateAccessToken();
    const refreshToken = tempuser.generateRefreeshToken();
    // console.log(userId);
    // console.log(accessToken)
    // console.log(refreshToken)
    tempuser.refreshToken = refreshToken;
    await tempuser.save({ validateBeforeSave: false });
    //return access token and referesh token
    return {accessToken, refreshToken};
  } catch (error) {
  // console.log(error)
    throw new apiError(
      500,
      "Something Went Wrong While Generating Accesss and Referech token",
    );
  }
};
const regiserUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  // validation - not empty
  //check if user already exists - username , email
  //check for images , check for avatar
  //upload them to cloudinary , avatar
  //create user object - create entry in db
  //remove password and refresh token field
  //check for user creation
  //return responce

  const { fullName, email, userName, password } = req.body;

  // console.log("email:", email);

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All field Are Complesary Required");
  }

  const existedUser = await user.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new apiError(409, "User With email and username already exist");
  }
  // console.log(req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0].path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "avatar file is required ");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "avatar file is required ");
  }

  const tempuser = await user.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await user
    .findById(tempuser._id)
    .select("-password -refreshToken");
  if (!createdUser) {
    throw new apiError(500, "something went wrong while regitering a user");
  }

  return res
    .status(201)
    .json(new apiResponce(200, createdUser, "User Registered Sucessfully"));

  //   if (fullName === "") {
  //     throw new apiError(400, "Full Name Is Required");
  //   }
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  //username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, userName, password } = req.body;

  if (!userName && !email) {
    throw new apiError(400, "userName or Email is Required");
  }

  const tempuser = await user.findOne({
    $or: [{ userName }, { email }],
  });

  if (!tempuser) {
    throw new apiError(404, "User Does not Exist");
  }
  const isPasswordValid = await tempuser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Invalid User Credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(tempuser._id);
  const loggedInUser = await user
    .findById(tempuser._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponce(
        200,
        {
          tempuser: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Sucessfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await user.findByIdAndUpdate(
    req.tempuser._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponce(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async(req, res) =>{
  const incomingRereshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRereshToken){
    throw new apiError(401, "unauthorized request")
  }
  
  const decodedToken = jwt.verify(
    incomingRereshToken,
    process.env.REFRESH_TOKEN_SECRET

  )

  const tempuser = await user.findById(decodedToken?._id)
  if(!tempuser){
    throw new apiError(401, "Invalid Refresh Token")
  }

  if(incomingRereshToken !== tempuser?.refreshToken){
    throw new apiError(401, "refresh token i expired or used")
  }
})
export { regiserUser, loginUser, logoutUser };

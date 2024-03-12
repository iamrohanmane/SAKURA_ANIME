import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { user } from "../models/user.model.js ";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";
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
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
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

export { regiserUser };

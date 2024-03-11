import {asyncHandler}  from "../utils/asyncHandler.js"

const regiserUser = asyncHandler(async (req, res) =>{
    res.status(200).json({
        message:"Rohan Post Method"
    })
})

export {regiserUser}

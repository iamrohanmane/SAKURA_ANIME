const asyncHandler = (requestHandler) =>{
  (req,res,next ) =>{
    Promise.resolve(requestHandler(req, res, next )).catch((err)=> next(err))
  }
}


// const asyncHandler = async (fn) => (req, res, next)=>{
// try {
    
// } catch (error) {
//     res.status(err.code || 500).json({
//         sucess:false,
//         message: err.message
//     })
// }
// }
export{asyncHandler}
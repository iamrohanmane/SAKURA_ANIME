import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, //Cloudenary URL
      required: true,
    },
    title: {
        type: String, //Cloudenary URL
        required: true,
      },
      description: {
        type: String, //Cloudenary URL
        required: true,
      },
      durtion: {
        type: Number, //Cloudenary URL
        required: true,
      },
      views: {
        type: Number, //Cloudenary URL
        required: true,
        default:0
      },
      thumbnail: {
        type: String, //Cloudenary URL
        required: true,
      },
      isPublished:{
        type:Boolean,
        default:true
      },
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }

       
  },
  {
    timestamps: true,
  },
);

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);

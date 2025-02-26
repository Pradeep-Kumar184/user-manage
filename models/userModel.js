import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
    },
    image: {
      image_url:{
        type:String,
        require:true
      },
      public_id:{
        type:String,
        require:true
      }
      },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("user", userSchema);

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

   // Configuration
   cloudinary.config({ 
    cloud_name: 'do5kn7wsm', 
    api_key: '898299415469249', 
    api_secret: 'kR5Uza0wiVTIUUBEW4HUPsBtUzY' // Click 'View API Keys' above to copy your API secret
});

export const uploadImageOnCloudinary=async(filePath,folderName)=>{
// uploading image from server
  try {
  const result=await cloudinary.uploader.upload(filePath,{folder:folderName})
// delete image from server
  try {
  fs.unlinkSync(filePath)
} catch (error) {
  console.log("faild to delete from server",error)
}
console.log(result)
return{
  secure_url:result.secure_url,
  public_id:result.public_id
}
} catch (error) {
  throw new Error(error)
}
}
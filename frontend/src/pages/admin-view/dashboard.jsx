import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  getAllFeatureImages,
  uploadFeatureImage,
} from "@/store/common/common-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImages } = useSelector((state) => state.commonFeatures);

  const handleUpload = () => {
    if (uploadImageUrl) {
      dispatch(uploadFeatureImage(uploadImageUrl)).then((data) => {
        if (data.payload.success) {
          setImageFile(null);
          setUploadImageUrl("");
          dispatch(getAllFeatureImages());
        }
      });
    }
  };

  useEffect(() => {
    dispatch(getAllFeatureImages());
  }, [dispatch]);
  return (
    <div className="flex flex-col items-center gap-5">
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadImageUrl={uploadImageUrl}
        setUploadImageUrl={setUploadImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        // isEidtMode={currentEditedId ? true : false}
      />
      <Button onClick={handleUpload} className="w-[450px]">
        Upload
      </Button>
      {featureImages && featureImages.length > 0
        ? featureImages.map((featureImage, index) => {
            return (
              <img
                src={featureImage.image}
                alt={"image"}
                className="w-full h-[400px] object-cover rounded-t-lg"
              />
            );
          })
        : null}
    </div>
  );
};

export default AdminDashboard;

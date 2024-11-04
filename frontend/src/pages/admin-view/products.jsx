import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/product-slice";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const { toast } = useToast();

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formdata: formData })).then(
        (data) => {
          if (data?.payload.success) {
            dispatch(fetchAllProducts());
            setOpenAddProductDialog(false);
            setImageFile(null);
            initialState;
            toast({
              title: "Product Edited Successfully",
            });
          }
        }
      );
    } else {
      dispatch(addNewProduct({ ...formData, image: uploadImageUrl })).then(
        (data) => {
          if (data?.payload.success) {
            dispatch(fetchAllProducts());
            setOpenAddProductDialog(false);
            setImageFile(null);
            setFormData(initialState);
            toast({
              title: "Product Added Successfully",
            });
          }
        }
      );
    }
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenAddProductDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList.map((product, index) => (
          <AdminProductTile
            setCurrentEditedId={setCurrentEditedId}
            product={product}
            key={index}
            setOpenAddProductDialog={setOpenAddProductDialog}
            setFormData={setFormData}
          />
        ))}
      </div>
      <Sheet
        open={openAddProductDialog}
        onOpenChange={() => {
          setOpenAddProductDialog(false);
          setFormData(initialState);
          setCurrentEditedId(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadImageUrl={uploadImageUrl}
            setUploadImageUrl={setUploadImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEidtMode={currentEditedId ? true : false}
          />
          <div className="py-6">
            <CommonForm
              formConrols={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Save Changes" : "Add"}
              onSubmit={onSubmit}
              isButtonDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProducts;

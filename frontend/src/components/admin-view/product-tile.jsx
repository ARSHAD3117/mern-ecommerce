import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { deleteProduct, fetchAllProducts } from "@/store/admin/product-slice";

const AdminProductTile = ({
  product,
  setOpenAddProductDialog,
  setFormData,
  setCurrentEditedId,
}) => {
  const dispatch = useDispatch();
  const handleEdit = () => {
    setCurrentEditedId(product._id);
    setOpenAddProductDialog(true);
    setFormData(product);
  };

  const handleDelete = () => {
    dispatch(deleteProduct(product._id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  };
  return (
    <div>
      <Card className="w-full max-w-sm mx-auto">
        <div>
          <div className="relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
          </div>
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mt-2 mb-2">{product.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product.salePrice > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminProductTile;

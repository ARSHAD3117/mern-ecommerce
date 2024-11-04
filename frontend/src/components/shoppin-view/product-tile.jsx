import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

const ShoppingProductTile = ({
  setOpenDialog,
  setSelectedProduct,
  product,
  handleAddToCart,
}) => {
  const handleClick = () => {
    setOpenDialog(true);
    setSelectedProduct(product);
  };
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={handleClick} className="">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-contain rounded-t-lg"
          />
          {product.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white">
              Out Of Stock
            </Badge>
          ) : product.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white">
              {`Only ${product.totalStock} items left`}
            </Badge>
          ) : product.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-lg font-semibold text-primary ${
                product.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold  text-red-500">
                -
                {(
                  ((product?.price - product?.salePrice) / product?.price) *
                  100
                ).toFixed()}
                %
              </span>
            ) : null}
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button
          disabled={product.totalStock === 0 ? true : false}
          onClick={() => handleAddToCart(product._id, product.totalStock)}
          className={`w-full ${
            product.totalStock === 0 ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          {product.totalStock === 0 ? "Out of Stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;

import ProductDetailsDialog from "@/components/shoppin-view/product-details";
import ShoppingProductTile from "@/components/shoppin-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { resetSearchResults, searchProducts } from "@/store/shop/search-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const dispatch = useDispatch();
  const { cartItem } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [openProductDetailsDialog, setOpenProductDetailsDialog] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const { toast } = useToast();

  const handleAddToCart = (id, stock) => {
    let getCartItems = cartItem.items;
    if (getCartItems) {
      let index = getCartItems.findIndex((item) => item.productId === id);
      if (index > -1) {
        if (getCartItems[index].quantity + 1 > stock) {
          toast({
            title: `Only ${stock} qunatity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(addToCart({ userId: user?.id, productId: id, quantity: 1 })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({
            title: "Product added to cart successfully",
          });
        }
      }
    );
  };

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(searchProducts(keyword));
      }, 1000);
    } else {
      dispatch(resetSearchResults());
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
    }
  }, [keyword]);
  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            type="text"
            className="py-6"
            placeholder="Search text..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="font-extrabold text-3xl">No Result found!</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults && searchResults.length
          ? searchResults.map((product, index) => {
              return (
                <ShoppingProductTile
                  key={index}
                  setOpenDialog={setOpenProductDetailsDialog}
                  setSelectedProduct={setSelectedProduct}
                  product={product}
                  handleAddToCart={handleAddToCart}
                />
              );
            })
          : null}
      </div>
      <ProductDetailsDialog
        open={openProductDetailsDialog}
        setOpen={setOpenProductDetailsDialog}
        productDetails={selectedProduct}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default SearchPage;

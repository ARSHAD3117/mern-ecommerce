import ProductFilter from "@/components/shoppin-view/filter";
import ProductDetailsDialog from "@/components/shoppin-view/product-details";
import ShoppingProductTile from "@/components/shoppin-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const createSearchParamsHelper = (filterParams) => {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
};

const ShoppingListing = () => {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const { cartItem } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openProductDetailsDialog, setOpenProductDetailsDialog] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const { toast } = useToast();

  const categorySearchParams = searchParams.get("category");

  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (getSectionId, getCurrentOption) => {
    let cpyFilter = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilter).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilter = {
        ...cpyFilter,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilter[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1)
        cpyFilter[getSectionId].push(getCurrentOption);
      else {
        cpyFilter[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilters(cpyFilter);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilter));
  };

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
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParams]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-4">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="w-full bg-background shadow-lg rounded-lg">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {productList.map((product, index) => (
            <ShoppingProductTile
              key={index}
              setOpenDialog={setOpenProductDetailsDialog}
              setSelectedProduct={setSelectedProduct}
              product={product}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
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

export default ShoppingListing;

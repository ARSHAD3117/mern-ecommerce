import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shoppin-view/product-tile";
import NikeIcon from "../../assets/icons/nike.png";
import AdidasIcon from "../../assets/icons/adidas.png";
import PumaIcon from "../../assets/icons/puma.png";
import LevisIcon from "../../assets/icons/levis.png";
import ZaraIcon from "../../assets/icons/zara.png";
import HMIcon from "../../assets/icons/h&m.png";
import { json, useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailsDialog from "@/components/shoppin-view/product-details";
import { getAllFeatureImages } from "@/store/common/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcons = [
  { id: "nike", label: "Nike", icon: NikeIcon },
  { id: "adidas", label: "Adidas", icon: AdidasIcon },
  { id: "puma", label: "Puma", icon: PumaIcon },
  { id: "levi", label: "Levi's", icon: LevisIcon },
  { id: "zara", label: "Zara", icon: ZaraIcon },
  { id: "h&m", label: "H&M", icon: HMIcon },
];

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const navigate = useNavigate();
  const [openProductDetailsDialog, setOpenProductDetailsDialog] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const { user } = useSelector((state) => state.auth);
  const { featureImages } = useSelector((state) => state.commonFeatures);

  const handleNavigation = (getCurrentId, type) => {
    sessionStorage.clear();
    const filters = {
      [type]: [getCurrentId.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(filters));
    navigate("/shop/listing");
  };

  const handleAddToCart = (id) => {
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
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImages?.length);
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, [featureImages]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(getAllFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImages && featureImages?.length > 0
          ? featureImages.map((featureImage, index) => (
              <img
                key={index}
                src={featureImage.image}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImages?.length) % featureImages?.length
            )
          }
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImages?.length
            )
          }
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((item, index) => (
              <Card
                key={index}
                onClick={() => handleNavigation(item, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <item.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcons.map((item, index) => (
              <Card
                key={index}
                onClick={() => handleNavigation(item, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    className="w-16 h-16 mb-4 text-primary"
                    src={item.icon}
                    alt="nike"
                  />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem, index) => (
                  <ShoppingProductTile
                    key={index}
                    product={productItem}
                    setOpenDialog={setOpenProductDetailsDialog}
                    setSelectedProduct={setSelectedProduct}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openProductDetailsDialog}
        setOpen={setOpenProductDetailsDialog}
        productDetails={selectedProduct}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ShoppingHome;

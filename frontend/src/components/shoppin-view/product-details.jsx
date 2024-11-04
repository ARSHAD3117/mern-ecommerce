import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Label } from "../ui/label";
import StarRatingComponent from "./star-rating";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useToast } from "@/hooks/use-toast";

const ProductDetailsDialog = ({
  open,
  setOpen,
  productDetails,
  handleAddToCart,
}) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviewResults } = useSelector((state) => state.shopReviews);
  const handleRatingChange = (getRating) => {
    setRating(getRating);
  };
  const { toast } = useToast();
  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user.id,
        userName: user.email,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data.payload.message,
        });
        dispatch(getReviews(productDetails._id));
        setRating(0);
        setReviewMsg("");
      } else if (!data?.payload?.success) {
        toast({
          title: data.payload.message,
          variant: "destructive",
        });
      }
    });
  };
  useEffect(() => {
    dispatch(getReviews(productDetails._id));
  }, [open]);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setRating(0);
        setReviewMsg("");
      }}
    >
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-contain"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <StarIcon
                    key={index}
                    className={`w-5 h-5 mr-1 ${
                      item <= productDetails?.averageReview
                        ? "fill-yellow-500"
                        : ""
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-muted-foreground">
              {`(${productDetails?.averageReview})` ?? ""}
            </span>
          </div>
          <div className="mt-5 mb-5">
            <Button
              onClick={() =>
                handleAddToCart(productDetails._id, productDetails.totalStock)
              }
              disabled={productDetails.totalStock === 0 ? true : false}
              className={`w-full ${
                productDetails.totalStock === 0
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
            >
              {productDetails.totalStock === 0 ? "Out of Stock" : "Add to cart"}
            </Button>
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviewResults && reviewResults.length > 0 ? (
                reviewResults.map((review, index) => (
                  <div className="flex gap-4" key={index}>
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {review?.userName?.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">
                          {review.userName.split("@")[0].toUpperCase()}
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((item, index) => {
                          return (
                            <StarIcon
                              key={index}
                              className={`w-5 h-5 mr-1 ${
                                item <= review.reviewValue
                                  ? "fill-yellow-500"
                                  : ""
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-muted-foreground">
                        {review.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>Be the first one to review this product</h1>
              )}
            </div>
            <div className="mt-3 flex flex-col  gap-2">
              <Label>Write a review</Label>
              <div className="flex">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                placeholder="write a review..."
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;

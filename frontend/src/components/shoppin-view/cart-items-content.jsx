import React from "react";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItem } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

const UserCartItemsContent = ({ cartItem }) => {
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const handleCartItemDelete = (item) => {
    dispatch(
      deleteCartItem({ userId: user.id, productId: item.productId })
    ).then((data) => {
      if (data.payload.success) {
        toast({
          title: "Cart item deleted successfully",
        });
      }
    });
  };
  const { toast } = useToast();
  const handleUpdataQuantity = (item, type) => {
    let count = item.quantity;
    let productIndex = productList.findIndex(
      (product) => product._id === item.productId
    );
    const totalStock = productList[productIndex]?.totalStock;
    switch (type) {
      case "minus":
        count -= 1;
        break;
      case "plus":
        count += 1;
        break;
      default:
        break;
    }
    if (!count) {
      handleCartItemDelete(item);
    } else {
      if (productIndex > -1) {
        if (count > totalStock) {
          toast({
            title: `Only ${totalStock} qunatity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
      dispatch(
        updateCartItem({
          userId: user.id,
          productId: item.productId,
          quantity: count,
        })
      ).then((data) => {
        if (data.payload.success) {
          toast({
            title: "Cart item is updated successfully",
          });
        }
      });
    }
  };
  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        className="h-20 w-20 rounded object-cover"
        alt={cartItem?.title}
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem.title}</h3>
        <div className="flex items-center mt-1 gap-4">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdataQuantity(cartItem, "minus")}
          >
            <MinusIcon className="w-4 h-4" />
            <span className="sr-only ">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdataQuantity(cartItem, "plus")}
          >
            <PlusIcon className="w-4 h-4" />
            <span className="sr-only ">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
};

export default UserCartItemsContent;

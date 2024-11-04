import React, { useState } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shoppin-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shoppin-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";

const ShoppingCheckout = () => {
  const { cartItem } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const { toast } = useToast();
  const { approvalURL, isLoading } = useSelector((state) => state.shopOrder);
  const totalCartAmount =
    cartItem && cartItem?.items?.length > 0
      ? cartItem.items.reduce((acc, cartItem) => {
          const value =
            cartItem?.salePrice > 0
              ? cartItem.salePrice * cartItem.quantity
              : cartItem?.price * cartItem.quantity;
          return acc + value;
        }, 0)
      : 0;
  const handleInitiatePaypalPayment = () => {
    if (cartItem.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please Select one address to proceed",
        variant: "destructive",
      });
      return;
    }
    const orderData = {
      userId: user.id,
      cartId: cartItem._id,
      cartItems: cartItem.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item?.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        pincode: currentSelectedAddress.pincode,
        phone: currentSelectedAddress.phone,
        notes: currentSelectedAddress.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload.success) {
        setIsPaymentStarted(true);
      } else {
        setIsPaymentStarted(false);
      }
    });
  };

  if (approvalURL) {
    window.location.href = approvalURL;
  }
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5 p-5">
        <Address
          currentSelectedAddress={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItem && cartItem?.items?.length > 0
            ? cartItem.items.map((item, index) => (
                <UserCartItemsContent key={index} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isLoading
                ? "Processing paypal payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;

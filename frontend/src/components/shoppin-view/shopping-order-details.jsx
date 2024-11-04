import React from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const ShoppingOrderDetails = ({ OrderDetails }) => {
  const { user } = useSelector((state) => state.auth);
  const statusMappings = {
    pending: "",
    inProgess: "bg-yellow-600",
    inShipping: "bg-orange-600",
    rejected: "bg-red-600",
    deliverd: "bg-purple-600",
    confirmed: "bg-green-500",
  };
  return (
    <div className="grid gap-6 ">
      <div className="grid gap-2">
        <div className="flex mt-6 items-center justify-between">
          <p className="font-medium">Order ID</p>
          <Label>{OrderDetails?._id}</Label>
        </div>
        <div className="flex  items-center justify-between">
          <p className="font-medium">Order Date</p>
          <Label>{OrderDetails?.orderDate.split("T")[0]}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">Order Status</p>
          <Label>
            <Badge
              className={`px-3 py-1 rounded-xl ${
                statusMappings[OrderDetails?.orderStatus]
              }`}
            >
              {OrderDetails?.orderStatus}
            </Badge>
          </Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">Order Price</p>
          <Label>${OrderDetails?.totalAmount}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">Payment Method</p>
          <Label>{OrderDetails?.paymentMethod}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">Payment Status</p>
          <Label>{OrderDetails?.paymentStatus}</Label>
        </div>
      </div>
      <Separator />
      <div className="grid gap-4 ">
        <div className="grid gap-2">
          <div className="font-medium">Order Details</div>
          <ul className="grid gap-3">
            {OrderDetails?.cartItems && OrderDetails?.cartItems.length > 0
              ? OrderDetails?.cartItems.map((data, index) => {
                  return (
                    <li className="flex items-center justify-between">
                      <span>Title: {data.title}</span>
                      <span>Quantity: {data.quantity}</span>
                      <span>Price: ${data.price}</span>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      </div>
      <div className="grid gap-4 ">
        <div className="grid gap-2">
          <div className="font-medium">Shipping Info</div>
          <div className="grid gap-0.5 text-muted-foreground">
            <span>{user.email}</span>
            <span>{OrderDetails?.addressInfo?.address}</span>
            <span>{OrderDetails?.addressInfo?.city}</span>
            <span>{OrderDetails?.addressInfo?.phone}</span>
            <span>{OrderDetails?.addressInfo?.notes}</span>
            <span>{OrderDetails?.addressInfo?.pincode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingOrderDetails;

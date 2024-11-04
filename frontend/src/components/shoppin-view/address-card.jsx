import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const AddressCard = ({
  addressInfo,
  handleEditAddress,
  handleDeleteAddress,
  setCurrentSelectedAddress,
  currentSelectedAddress,
}) => {
  return (
    <Card
      onClick={() => {
        setCurrentSelectedAddress
          ? setCurrentSelectedAddress(addressInfo)
          : null;
      }}
      className={`cursor-pointer border-black border ${
        currentSelectedAddress?._id === addressInfo?._id
          ? "border-green-600 border-[5px]"
          : ""
      }`}
    >
      <CardContent className="grid p-4  gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex items-center justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;

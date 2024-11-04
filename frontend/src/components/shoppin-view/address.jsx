import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address = ({ currentSelectedAddress, setCurrentSelectedAddress }) => {
  const [formData, setFormData] = useState(initialState);
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const dispatch = useDispatch();
  const [currentEditId, setCurrentEditId] = useState(null);
  const { toast } = useToast();

  const handleManageAddress = (e) => {
    e.preventDefault();
    if (addressList.length >= 3 && !currentEditId) {
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
        duration: 5000,
      });
      setFormData(initialState);
      return;
    }
    if (currentEditId) {
      dispatch(
        editAddress({
          formData,
          userId: user.id,
          addressId: currentEditId,
        })
      ).then((data) => {
        if (data.payload.success) {
          toast({
            title: "Address Updated Successfully",
            duration: 3000,
          });
          dispatch(fetchAllAddress(user.id));
          setFormData(initialState);
          setCurrentEditId(null);
        }
      });
    } else {
      dispatch(addNewAddress({ ...formData, userId: user.id })).then((data) => {
        if (data.payload.success) {
          dispatch(fetchAllAddress(user.id));
          setFormData(initialState);
          toast({
            title: "Address Added Successfully",
            duration: 3000,
          });
        }
      });
    }
  };
  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  };

  const handleDeleteAddress = (address) => {
    dispatch(deleteAddress({ userId: user.id, addressId: address._id })).then(
      (data) => {
        if (data.payload.success) {
          dispatch(fetchAllAddress(user.id));
          toast({
            title: "Address Deleted Successfully",
            duration: 3000,
          });
        }
      }
    );
  };

  const handleEditAddress = (address) => {
    setCurrentEditId(address._id);
    setFormData({
      ...formData,
      address: address?.address,
      city: address?.city,
      phone: address?.phone,
      pincode: address?.pincode,
      notes: address?.notes,
    });
  };

  useEffect(() => {
    dispatch(fetchAllAddress(user.id));
  }, []);

  return (
    <Card>
      <div className="grid mb-5 p-3 grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddress, index) => (
              <AddressCard
                key={index}
                addressInfo={singleAddress}
                handleEditAddress={handleEditAddress}
                handleDeleteAddress={handleDeleteAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
                currentSelectedAddress={currentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditId ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formConrols={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditId ? "Save Changes" : "Add Address"}
          onSubmit={handleManageAddress}
          isButtonDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default Address;

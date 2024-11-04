import CommonForm from "@/components/common/form";
import { ToastAction } from "@/components/ui/toast";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initianState = {
  userName: "",
  email: "",
  password: "",
};

const AuthResgister = () => {
  const [formData, setFormData] = useState(initianState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload.success) {
        toast({
          title: data.payload.message,
          description: "",
        });
        navigate("/auth/login");
      }
      if (!data?.payload.success) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.payload.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    });
  };
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Alrea-dy have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formConrols={registerFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText={"Sing Up"}
        onSubmit={handleOnSubmit}
      />
    </div>
  );
};

export default AuthResgister;

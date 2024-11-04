import CommonForm from "@/components/common/form";
import { ToastAction } from "@/components/ui/toast";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initianState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initianState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload.success) {
        toast({
          title: data.payload.message,
          description: "",
        });
        navigate("/shop/home");
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
          Sign in to your accont
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formConrols={loginFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText={"Log in"}
        onSubmit={handleOnSubmit}
      />
    </div>
  );
};

export default AuthLogin;

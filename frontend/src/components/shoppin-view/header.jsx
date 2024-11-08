import { House, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { logOutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const handleNavigate = (item) => {
    sessionStorage.removeItem("filters");
    const filters =
      item.id !== "home" && item.id !== "products" && item.id !== "search"
        ? {
            category: [item.id],
          }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(filters));
    location.pathname.includes("listing") && filters !== null
      ? setSearchParams(new URLSearchParams(`?category=${item.id}`))
      : navigate(item.path);
  };
  return (
    <nav className="flex flex-col mb-3  lg:mb-0 lg:flex-row lg:items-center gap-6">
      {shoppingViewHeaderMenuItems.map((item) => (
        <Label
          onClick={() => handleNavigate(item)}
          className="text-sm font-medium cursor-pointer"
          key={item.id}
        >
          {item.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItem } = useSelector((state) => state?.shopCart);

  const handleLogOut = () => {
    // dispatch(logOutUser());
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  };

  useEffect(() => {
    dispatch(fetchCartItems(user.id));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute h-5 w-5 top-[-10px] right-[-4px] text-sm  rounded-full bg-red-600 text-white">
            {cartItem?.items?.length || 0}
          </span>
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper
          cartItems={
            cartItem && cartItem.items && cartItem.items.length > 0
              ? cartItem.items
              : []
          }
          setOpenCartSheet={setOpenCartSheet}
        ></UserCartWrapper>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user.email[0].toUpperCase() + user.email[1].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="h-6 w-6" />
          <span className="font-bold">E-commerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu header</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;

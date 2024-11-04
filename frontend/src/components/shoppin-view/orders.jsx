import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import ShoppingOrderDetails from "./shopping-order-details";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersOfUser,
  getOrderDetails,
  resetOrderDetais,
} from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

const ShoppingOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  const { toast } = useToast();
  const statusMappings = {
    pending: "",
    inProgess: "bg-yellow-600",
    inShipping: "bg-orange-600",
    rejected: "bg-red-600",
    deliverd: "bg-purple-600",
    confirmed: "bg-green-500",
  };

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user.id)).then((data) => {
      if (data.payload.success) {
        toast({
          title: "orders fetched Successfully",
        });
      } else {
        toast({
          title: data?.payload?.message || "No Orders Found",
        });
      }
    });
  }, []);

  useEffect(() => {
    if (orderDetails) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Id</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{item._id}</TableCell>
                      <TableCell>{item.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`px-3 py-1 rounded-xl ${
                            statusMappings[item.orderStatus]
                          }`}
                        >
                          {item.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>${item.totalAmount}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            // setOpenDetailsDialog(true)
                            dispatch(getOrderDetails(item._id));
                          }}
                        >
                          view details
                        </Button>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetais());
                          }}
                        >
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>About Order</DialogTitle>
                            </DialogHeader>
                            <ShoppingOrderDetails OrderDetails={orderDetails} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShoppingOrders;

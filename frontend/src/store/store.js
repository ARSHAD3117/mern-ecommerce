import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminReducer from "./admin/product-slice/index";
import adminOrderReducer from "./admin/order-slice/index";
import shopProductReducer from "./shop/products-slice/index";
import shopCartReducer from "./shop/cart-slice/index";
import shopAddressReducer from "./shop/address-slice/index";
import shopOrderReducer from "./shop/order-slice/index";
import shopSearchReducer from "./shop/search-slice/index";
import shopReviewReducer from "./shop/review-slice/index";
import commonFeatureReducer from "./common/common-slice/index";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminReducer,
    adminOrders: adminOrderReducer,
    shopProducts: shopProductReducer,
    shopCart: shopCartReducer,
    shopAddress: shopAddressReducer,
    shopOrder: shopOrderReducer,
    shopSearch: shopSearchReducer,
    shopReviews: shopReviewReducer,
    commonFeatures: commonFeatureReducer,
  },
});

export default store;

import React from "react";
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs, HeaderStyleInterpolators } from "@react-navigation/stack";
import FooterTabs from "../components/layout/footer-tabs/FooterTabs";
import CartScreen from "../screens/cart/cart";
import TermsAndConditionsScreen from "../screens/terms-and-conditions";
import MealScreen from "../screens/meal";
import ProfileScreen from "../screens/profile";
import OrdersStatusScreen from "../screens/order/status";
import BcoinScreen from "../screens/b-coin";
import LoginScreen from "../screens/login";
import VerifyCodeScreen from "../screens/verify-code";
import LanguageScreen from "../screens/language";
import OrderSubmittedScreen from "../screens/order/submitted";
import OrderHistoryScreen from "../screens/order/history";
import insertCustomerName from "../screens/insert-customer-name";
import OrdersListScreen from "../screens/admin/order/list";
import AddCourseScreen from "../screens/admin/product/add";
import AddStudentScreen from "../screens/admin/students/add";
import AddEmployeScreen from "../screens/admin/employes/add";
import EpmloyeItemScreen from "../screens/admin/employes/item";
import EmployesListScreen from "../screens/admin/employes/list";
import AddPackageScreen from "../screens/admin/package/add";
import CoursesListScreen from "../screens/admin/product/list";
import PaymentReportScreen from "../screens/admin/payment/report";
import StudentsListScreen from "../screens/admin/students/list";
import StudentItemScreen from "../screens/admin/students/item";
import LecturesListScreen from "../screens/admin/lectures/list";
import CalanderContainer from "../screens/admin/calander/clander-container";
import DashboardScreen from "../screens/admin/dashboard/main";
import HomeScreen from "../screens/home/home";
import uploadImages from "../screens/admin/upload-images/upload-images";
import EditTranslationsScreen from "../screens/admin/edit-translations";
import EmployeReportScreen from "../screens/admin/employes/report";

const Stack = createStackNavigator();
const TransitionScreen = {
  gestureDirection: 'horizontal',
  transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
      return {
          cardStyle: {
              transform: [
                  {
                      translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0]
                      })
                  },
                  {
                      translateX: next
                          ? next.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -layouts.screen.width]
                            })
                          : 1
                  }
              ]
          },
          overlayStyle: {
              opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0]
              })
          }
      };
  }
};

export const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="admin-dashboard"
      header={null}
      headerMode="none"
      presentation={"presentation"}
      screenOptions={{
        cardStyle: { backgroundColor: 'transparent' },
        ...TransitionScreen

      }}
    >
       {/* name: "menuScreen",
    title: "תפריט",
    icon: "shopping-bag1",
    iconSize: 30,
    component: MenuScreen, */}
      <Stack.Screen name="menuScreen" component={FooterTabs} />
      <Stack.Screen name="homeScreen" component={HomeScreen} />
      <Stack.Screen name="terms-and-conditions" component={TermsAndConditionsScreen} />
      <Stack.Screen name="orders-status" component={OrdersStatusScreen} />
      <Stack.Screen name="admin-orders" component={OrdersListScreen} />
      <Stack.Screen name="admin-calander" component={CalanderContainer} />
      <Stack.Screen name="admin-dashboard" component={DashboardScreen} />
      {/* <Stack.Screen name="admin-add-product" component={AddProductScreen}  initialParams={{ categoryId: null, product: null }}/> */}
      <Stack.Screen name="admin-add-course" component={AddCourseScreen}  initialParams={{ categoryId: null, product: null }}/>
      <Stack.Screen name="admin-add-package" component={AddPackageScreen}  initialParams={{ categoryId: null, student: null }}/>
      <Stack.Screen name="admin-courses-list" component={CoursesListScreen}  initialParams={{ categoryId: null, product: null }}/>
      
      <Stack.Screen name="admin-add-student" component={AddStudentScreen}  initialParams={{ categoryId: null, student: null }}/>
      <Stack.Screen name="admin-students-list" component={StudentsListScreen}  initialParams={{ categoryId: null, product: null, studentIds: null }}/>
      <Stack.Screen name="admin-students-item" component={StudentItemScreen}  initialParams={{ categoryId: null, product: null, student: null }}/>
      
      <Stack.Screen name="admin-add-employe" component={AddEmployeScreen}  initialParams={{ categoryId: null, student: null }}/>
      <Stack.Screen name="admin-employes-list" component={EmployesListScreen}  initialParams={{ categoryId: null, product: null, studentIds: null }}/>
      <Stack.Screen name="admin-employes-item" component={EpmloyeItemScreen}  initialParams={{ categoryId: null, product: null, student: null }}/>
      <Stack.Screen name="admin-employe-report" component={EmployeReportScreen}  initialParams={{ categoryId: null, product: null, studentIds: null }}/>

      <Stack.Screen name="admin-lectures-list" component={LecturesListScreen}  initialParams={{ categoryId: null, product: null, studentIds: null }}/>
      <Stack.Screen name="admin-payment-report" component={PaymentReportScreen}  initialParams={{ categoryId: null, product: null, studentIds: null }}/>
      <Stack.Screen name="becoin" component={BcoinScreen} />
      <Stack.Screen name="cart" component={CartScreen} />
      <Stack.Screen name="profile" component={ProfileScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="insert-customer-name" component={insertCustomerName} />
      <Stack.Screen name="verify-code" component={VerifyCodeScreen} initialParams={{ phoneNumber: null }} />
      <Stack.Screen name="language" component={LanguageScreen} />
      <Stack.Screen name="order-history" component={OrderHistoryScreen} />
      <Stack.Screen name="upload-images" component={uploadImages} />
      <Stack.Screen name="edit-translations" component={EditTranslationsScreen} />
      <Stack.Screen 
        name="order-submitted"
        component={OrderSubmittedScreen}
        initialParams={{ shippingMethod: null }}
      />
      <Stack.Screen
        name="meal"
        component={MealScreen}
        initialParams={{ product: null, categoryId: null }}
      />
      <Stack.Screen
        name="meal/edit"
        component={MealScreen}
        initialParams={{ index: null }}
      />
    </Stack.Navigator>
  );
};

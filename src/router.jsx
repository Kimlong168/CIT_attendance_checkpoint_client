import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./components/authentication/PrivateRoute";
import GuestRoute from "./components/authentication/GuestRoute";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/home";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/authentication/Login";
import Error404 from "./pages/Error404";
import Unauthorized from "./pages/Unauthorized";

import User from "./pages/user";
import CreateUser from "./pages/user/CreateUser";
import UpdateUser from "./pages/user/UpdateUser";

import Profile from "./pages/profile/Profile";
import StaffProfile from "./pages/profile/StaffProfile";
import ForgetPassword from "./pages/authentication/ForgetPassword";

import Telegram from "./pages/telegram/Telegram";

import QrCode from "./pages/qrcode";
import CreateQrCode from "./pages/qrcode/CreateQrCode";
import UpdateQrCode from "./pages/qrcode/UpdateQrCode";

import Attendance from "./pages/attendance";
import LeaveRequest from "./pages/leaveRequest";
import CrudLeaveRequest from "./pages/leaveRequest/CrudLeaveRequest";
import AdminApprovedOrRejected from "./pages/leaveRequest/AdminApprovedOrRejected";
import CheckInCheckOut from "./pages/attendance/CheckInCheckOut";
import AttendanceReport from "./pages/report/AttendanceReport";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute
        roles={["admin", "manager", "cashier", "inventoryStaff"]}
        element={Home}
      />
    ),
  },

  {
    path: "/",
    element: <PrivateRoute roles={["admin", "manager"]} element={MainLayout} />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },

      {
        path: "/telegram",
        element: <Telegram />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/report/attendance",
        element: <AttendanceReport />,
      },
      {
        path: "/qrcode",
        element: <QrCode />,
      },
      {
        path: "/createQrcode",
        element: <CreateQrCode />,
      },
      {
        path: "/updateQrcode/:id",
        element: <UpdateQrCode />,
      },
      {
        path: "/attendance",
        element: <Attendance />,
      },
      {
        path: "/leaveRequest",
        element: <LeaveRequest />,
      },

      {
        path: "/leaveRequest/approve/:id",
        element: <AdminApprovedOrRejected />,
      },
    ],
  },
  {
    path: "/",
    element: <PrivateRoute roles={["admin"]} element={MainLayout} />,
    children: [
      {
        path: "/user",
        element: <User />,
      },

      {
        path: "/createUser",
        element: <CreateUser />,
      },

      {
        path: "/updateUser/:id",
        element: <UpdateUser />,
      },
    ],
  },

  {
    path: "/user/profile",
    element: (
      <PrivateRoute
        roles={["cashier", "inventoryStaff"]}
        element={StaffProfile}
      />
    ),
  },
  {
    path: "/user/leaveRequest",
    element: (
      <PrivateRoute
        roles={["cashier", "inventoryStaff"]}
        element={CrudLeaveRequest}
      />
    ),
  },

  {
    path: "/user/attendance",
    element: (
      <PrivateRoute
        roles={["cashier", "inventoryStaff"]}
        element={CheckInCheckOut}
      />
    ),
  },

  {
    path: "/login",
    element: <GuestRoute element={Login} />,
  },
  {
    path: "/forget-password",
    element: <GuestRoute element={ForgetPassword} />,
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  {
    path: "*",
    element: <Error404 />,
  },
]);

export default router;

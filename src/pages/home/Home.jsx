import { assets } from "@/assets/assets";
import { AuthContext } from "@/contexts/AuthContext";
import { useAttendancesByEmployeeId } from "@/hooks/attendance/useAttendance";
import isSameDate from "@/utils/isSameDate";
import { useContext, useEffect, useState } from "react";
import { IoIosArrowDropright } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { logout } from "@/hooks/authentication/useAuth";
import { notify } from "@/utils/toastify";
import ConfirmModal from "@/components/ui/ConfirmModal";

const Home = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isCheckIn, setIsCheckIn] = useState(null);
  const [isCheckOut, setIsCheckOut] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { data: attendances } = useAttendancesByEmployeeId(user._id);
  const navigate = useNavigate();
  useEffect(() => {
    if (attendances) {
      const isCheckedInToday = attendances
        ? attendances.find((att) => isSameDate(att.time_in, new Date()))
        : null;

      const isCheckedOutToday = attendances
        ? attendances.find((att) => isSameDate(att.time_out, new Date()))
        : null;

      setIsCheckOut(isCheckedOutToday);
      setIsCheckIn(isCheckedInToday);
    }
  }, [attendances]);

  const handleLogout = () => {
    const result = logout();

    if (result) {
      notify("Logout successful");
      navigate("/login");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      // Redirect them to the home page
    } else {
      notify("Logout failed", "error");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center ">
      <div
        className="w-[375px] bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between"
        style={{ minHeight: "calc(100vh - 30px)" }}
      >
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <img className="w-[60px] " src={assets.logo} alt="logo" />
            </div>
            <div className="flex items-center justify-end gap-3">
              <div onClick={() => setShowModal(true)}>
                <IoLogOutOutline
                  className="text-red-500 rounded cursor-pointer"
                  size={28}
                />
              </div>
              <Link to={user.role == "user" ? "/user/profile" : "/profile"}>
                <img
                  src={user.profile_picture || assets.default_profile}
                  className="rounded-full w-[40px] h-[40px] object-cover border border-black"
                  alt="profile_picture"
                />
              </Link>
            </div>
          </div>

          {/* Card */}
          <div className="bg-primary rounded-xl p-4 flex flex-col items-center mb-6">
            <div className="bg-white rounded-full w-20 h-20 flex justify-center items-center mb-2">
              <img
                className="w-[160px] img-fluid rounded-full"
                src={assets.logo}
                alt="logo"
              />
            </div>
            <h2 className="text-xl font-semibold text-white">
              CIT Attendance Checkpoint
            </h2>
            <small className="text-white mt-3">
              Welcome back, <span>{user.name}</span>
            </small>
            {user.role == "user" ? (
              <Link to="/user/attendance">
                <button className="text-white mt-4 py-2 px-3 rounded-full  border-2 border-white">
                  {isCheckIn
                    ? isCheckOut
                      ? "View attendance"
                      : "Check-out now"
                    : "Check-in now"}
                </button>
              </Link>
            ) : (
              <div>
                <Link to="/dashboard">
                  <button className="text-white mt-4 py-2 px-3 rounded-full  border-2 border-white">
                    Dashboard
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* Attendance */}
            <div>
              <Link
                to={user.role == "user" ? "/user/attendance" : "/attendance"}
              >
                <div className="flex justify-between items-center text-gray p-2 border rounded-lg shadow">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-200 p-2 rounded-full">
                      <i className="fas fa-calendar-check text-orange-500"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold">Attendance</h3>
                      <p className="text-sm text-gray-500">
                        {user.role == "user"
                          ? "Check-in and check-out"
                          : "View attendance records"}
                      </p>
                    </div>
                  </div>

                  <IoIosArrowDropright className="text-gray-500" size={28} />
                </div>
              </Link>
            </div>
            {/* Leave */}
            <div>
              <Link
                to={
                  user.role == "user" ? "/user/leaveRequest" : "/leaveRequest"
                }
              >
                <div className="flex justify-between items-center text-gray p-2 border rounded-lg shadow">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-200 p-2 rounded-full">
                      <i className="fas fa-calendar-alt text-green-500"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold">Leave</h3>
                      <p className="text-sm text-gray-500">
                        {user.role == "user"
                          ? "Request for leave"
                          : "Approve or reject requests"}
                      </p>
                    </div>
                  </div>
                  <IoIosArrowDropright className="text-gray-500" size={28} />
                </div>
              </Link>
            </div>
            {/* Members */}
            {/* <div className="flex justify-between items-center text-gray p-2 border rounded-lg shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-red-200 p-2 rounded-full">
                <i className="fas fa-users text-red-500"></i>
              </div>
              <div>
                <h3 className="font-semibold">Members</h3>
                <p className="text-sm text-gray-500">List all members</p>
              </div>
            </div>
            <IoIosArrowDropright className="text-gray-500" size={28} />
          </div> */}
          </div>
        </div>
        <div className="text-center text-gray-600">Version 1.0.0</div>
      </div>

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Home;

import Loading from "@/components/ui/Loading";
import {
  useAttendanceReport,
  useAttendanceReportByThisMonth,
} from "@/hooks/report/useReport";
import { useEffect, useRef, useState } from "react";

import { PiDownloadBold } from "react-icons/pi";
import { RiNumbersFill } from "react-icons/ri";
import { TbMessageReport } from "react-icons/tb";

import html2canvas from "html2canvas";

import {
  getFormattedDate,
  getFormattedTimeWithAMPM,
} from "@/utils/getFormattedDate";
import TotalAbsentByEmployee from "@/components/chart/TotalAbsentByEmployee";
import TotalOnLeaveByEmployee from "@/components/chart/TotalOnLeaveByEmployee";
import TotalOnTimeByEmployee from "@/components/chart/TotalOnTimeByEmployee";
import TotalNormalCheckOutByEmployee from "@/components/chart/TotalNormalCheckOutByEmployee";
import TotalMissedCheckOutByEmployee from "@/components/chart/TotalMissedCheckOutByEmployee";
import TotalLateByEmployee from "@/components/chart/TotalLateByEmployee";
import TotalEarlyCheckOutByEmployee from "@/components/chart/TotalEarlyCheckOutByEmployee";
import NumberCard from "@/components/ui/NumberCard";

const AttendanceReport = () => {
  const [date, setDate] = useState(new Date());
  const { data, isLoading, isError, refetch } = useAttendanceReport(date);
  const {
    data: monthlyData,
    isLoading: isLoading2,
    isError: isError2,
  } = useAttendanceReportByThisMonth();
  const monthAndYear = `${new Date().toLocaleString("default", {
    month: "long",
  })} ${new Date().getFullYear()}`;

  useEffect(() => {
    refetch();
  }, [date, refetch]);

  const captureTableRef = useRef();
  const captureChartRef = useRef();

  const handleCapture = (type) => {
    let element;
    if (type === "table") {
      element = captureTableRef.current; // Get the element to capture
    } else {
      element = captureChartRef.current; // Get the element to capture
    }

    html2canvas(element).then((canvas) => {
      // Convert canvas to an image
      const imgData = canvas.toDataURL("image/png");

      // Create a link element to trigger download
      const link = document.createElement("a");
      link.href = imgData;
      link.download =
        type === "table"
          ? `Report_attendance - ${getFormattedDate(date)}`
          : `Report_attendance_monthly - ${getFormattedDate(date)}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM after download
    });
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  console.log("monthlyData: ", monthlyData);

  if (isLoading || isLoading2) {
    return <Loading />;
  } else if (isError || isError2) {
    return <div>Error...</div>;
  }
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center mb-4 px-3">
        <div className="flex gap-5">
          <div className="flex items-center w-full">
            <label className="mr-2 truncate w-full hidden md:block">
              Select Date:
            </label>

            <input
              className="block w-full p-2 border border-gray-300 rounded-md"
              value={date}
              type="date"
              onChange={handleDateChange}
            />
          </div>
          <div className="w-full">
            <button
              className="p-2 rounded border border-gray-300 text-white bg-orange-500"
              onClick={() => setDate(new Date())}
            >
              Today
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={() => handleCapture("table")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2 flex gap-2 items-center"
          >
            Download <PiDownloadBold />
          </button>
        </div>
      </div>
      <div ref={captureTableRef} className="p-3">
        {date && (
          <div>
            <h3 className="w-full text-xl text-orange-500 bg-orange-500/10 p-3 rounded-lg md:w-fit border border-orange-500">
              Date : {getFormattedDate(date)}
            </h3>
          </div>
        )}

        <div className="mt-5">
          <div className="mb-5">
            <NumberCard
              title="Total Attendance"
              number={data?.total_attendance}
              icon={<RiNumbersFill />}
              subtitle="Total attendance of all employees"
            />
          </div>

          {/* check in report section */}
          <div>
            <div className="flex gap-2 items-center font-bold text-xl bg-green-600/10 text-green-600 border-green-600 border p-3 mb-3 rounded-lg">
              <TbMessageReport /> Check-In Report
            </div>
            <h3 className="text-xl font-semibold mb-2">On Time:</h3>
            <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border border-gray-300">
                    Employee Name
                  </th>
                  <th className="px-4 py-2 border border-gray-300">Time In</th>
                </tr>
              </thead>
              <tbody>
                {data.on_time_employees?.length == 0 && (
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">None</td>
                  </tr>
                )}
                {data.on_time_employees?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-300">
                      {item.employee?.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {getFormattedTimeWithAMPM(item.time_in)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="text-xl font-semibold mb-2">Late:</h3>
            <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border border-gray-300">
                    Employee Name
                  </th>
                  <th className="px-4 py-2 border border-gray-300">Late by</th>
                </tr>
              </thead>
              <tbody>
                {data.late_employees?.length == 0 && (
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">None</td>
                  </tr>
                )}
                {data.late_employees?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-300">
                      {item.employee?.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {item.checkInLateDuration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* check out report section */}
          <div>
            <div className="flex gap-2 items-center font-bold text-xl bg-red-500/10 text-red-500 border-red-500 border p-3 mb-3 rounded-lg">
              <TbMessageReport /> Check-Out Report
            </div>
            <h3 className="text-xl font-semibold mb-2">Normal Checkout:</h3>
            <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border border-gray-300">
                    Employee Name
                  </th>
                  <th className="px-4 py-2 border border-gray-300">Time Out</th>
                </tr>
              </thead>
              <tbody>
                {data.normal_checked_out_employees?.length == 0 && (
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">None</td>
                  </tr>
                )}
                {data.normal_checked_out_employees?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-300">
                      {item.employee?.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {getFormattedTimeWithAMPM(item.time_out)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-xl font-semibold mb-2">Early Check-out:</h3>
            <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border border-gray-300">
                    Employee Name
                  </th>
                  <th className="px-4 py-2 border border-gray-300">Early by</th>
                </tr>
              </thead>
              <tbody>
                {data.early_check_out_employees?.length == 0 && (
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">None</td>
                  </tr>
                )}
                {data.early_check_out_employees?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-300">
                      {item.employee?.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {item.checkOutEarlyDuration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-xl font-semibold mb-2">Missed Check-out:</h3>
            <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border border-gray-300">
                    Employee Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.missed_check_out_employees?.length == 0 && (
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">None</td>
                  </tr>
                )}
                {data.missed_check_out_employees?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-300">
                      {item.employee?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="flex gap-2 items-center font-bold text-xl bg-yellow-500/10 text-yellow-500 border-yellow-500 border p-3 mb-3 rounded-lg">
              <TbMessageReport /> Absent and On Leave Report
            </div>
            <h3 className="text-xl font-semibold mb-2">Absent:</h3>
            <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border border-gray-300">
                    Employee Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.absent_employees?.length == 0 && (
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">None</td>
                  </tr>
                )}
                {data.absent_employees?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-300">
                      {item.employee?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-xl font-semibold mb-2">On Leave:</h3>
            <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border border-gray-300">
                    Employee Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.on_leave_employees?.length == 0 && (
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">None</td>
                  </tr>
                )}
                {data.on_leave_employees?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-300">
                      {item.employee?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* chart */}
      <hr />
      <br />
      {monthlyData && (
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold my-3 text-orange-600">
              Monthly Attendance Report ({monthAndYear})
            </h3>
            <button
              onClick={() => handleCapture("chart")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2 flex gap-2 items-center"
            >
              Download <PiDownloadBold />
            </button>
          </div>
          <div
            ref={captureChartRef}
            className="grid auto-rows-auto  lg:grid-cols-2 gap-5"
          >
            <TotalAbsentByEmployee data={monthlyData} />
            <TotalOnLeaveByEmployee data={monthlyData} />
            <TotalOnTimeByEmployee data={monthlyData} />
            <TotalNormalCheckOutByEmployee data={monthlyData} />
            <TotalMissedCheckOutByEmployee data={monthlyData} />
            <TotalLateByEmployee data={monthlyData} />
            <TotalEarlyCheckOutByEmployee data={monthlyData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;

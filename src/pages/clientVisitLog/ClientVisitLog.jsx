import { useContext, useEffect, useState } from "react";
import Pagination from "../../components/table/Pagination";
import Table from "../../components/table/Table";
import TableBody from "../../components/table/TableBody";
import TableHeader from "../../components/table/TableHeader";
import LoadingInTable from "../../components/ui/LoadingInTable";

import { renderRows } from "./components/DataRow";
import PageTitle from "../../components/ui/PageTitle";
import SelectNumberPerPage from "../../components/form/SelectNumberPerPage";
import SearchBar from "../../components/form/SearchBar";

import ExportToExcel from "@/components/table/ExportToExcel";
import ExportToPDF from "@/components/table/ExportToPDF";
import SelectFilter from "@/components/form/SelectFilter";
import {
  getFormattedDate,
  getFormattedTimeWithAMPM,
} from "@/utils/getFormattedDate";
import { useUsers } from "@/hooks/user/useUser";
import { handleDeleteFunction } from "@/utils/handleDeleteFunction";
import { notify } from "@/utils/toastify";
import { useNavigate } from "react-router-dom";
import {
  useClearAllClientVisitLogs,
  useClientVisitLogs,
  useDeleteClientVisitLog,
} from "@/hooks/clientVisitLog/useClientVisitLog";
import { ClientVisitLogContext } from "@/contexts/ClientVisitLog";

const ClientVisitLog = () => {
  const { data, isLoading, isError } = useClientVisitLogs();
  const { data: users, isLoading: isUserLoading } = useUsers();
  const clearAllClientVisitLogs = useClearAllClientVisitLogs();
  const deleteAttendance = useDeleteClientVisitLog();
  const {
    state: clientVisitLogs,
    dispatch,
    removeClientVisitLog,
    searchClientVisitLog,
  } = useContext(ClientVisitLogContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );
  const navigate = useNavigate();

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_CLIENT_VISIT_LOGS", payload: data });
    }
  }, [data, dispatch]);

  const handleFilterByEmployee = (employee) => {
    if (employee === "all") {
      dispatch({ type: "SET_CLIENT_VISIT_LOGS", payload: data });
    } else {
      const filteredData = data.filter(
        (item) => item.employee?._id === employee
      );
      dispatch({ type: "SET_CLIENT_VISIT_LOGS", payload: filteredData });
    }
  };

  const handleFilterByDate = (date) => {
    if (date === "all") {
      dispatch({ type: "SET_CLIENT_VISIT_LOGS", payload: data });
    } else {
      const filteredData = data.filter((item) => {
        const visitDate = new Date(item.created_at);
        const today = new Date();

        // Calculate relevant date ranges
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(
          today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
        ); // Start from Monday

        const endOfWeek = today; // End on today

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7); // Last week starts

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = today; // Current date

        const startOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        ); // Last day of last month

        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = today; // Current date

        // Calculate the start date for last 6 months
        const startOfLast6Months = new Date(today);
        startOfLast6Months.setMonth(today.getMonth() - 6);

        // Filtering based on the date parameter
        if (date === "today") {
          return visitDate.toDateString() === today.toDateString();
        } else if (date === "yesterday") {
          return visitDate.toDateString() === yesterday.toDateString();
        } else if (date === "this_week") {
          return visitDate >= startOfWeek && visitDate <= endOfWeek;
        } else if (date === "last_week") {
          return visitDate >= startOfLastWeek && visitDate < startOfWeek;
        } else if (date === "this_month") {
          return visitDate >= startOfMonth && visitDate <= endOfMonth;
        } else if (date === "last_month") {
          return visitDate >= startOfLastMonth && visitDate <= endOfLastMonth;
        } else if (date === "this_year") {
          return visitDate >= startOfYear && visitDate <= endOfYear;
        } else {
          // Last 6 months
          return visitDate >= startOfLast6Months && visitDate <= today;
        }
      });

      dispatch({ type: "SET_CLIENT_VISIT_LOGS", payload: filteredData });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_CLIENT_VISIT_LOGS", payload: data });
    } else {
      searchClientVisitLog(searchKeyWord);
    }
  };

  const handleClearAll = async () => {
    handleDeleteFunction(async () => {
      try {
        const result = await clearAllClientVisitLogs.mutateAsync();

        if (result.status === "success") {
          notify("Clear all client visit logs successfully", "success");
          navigate("/clientVisitLog");
        } else {
          notify(result.error.message, "error");
          console.error("Error deleting item:", result.error.message);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Clear all fail!", "error");
      }
    }, "Are you sure you want to clear all client visit logs? Once deleted, you will not be able to recover this data!");
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteAttendance.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removeClientVisitLog(id);
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
  };

  const dataToExport = clientVisitLogs.map((item, index) => {
    return {
      No: index + 1,
      Employee: item.employee?.name + `(${item.employee?.role})`,
      Agent: item.agentName,
      Purpose: item.purpose,
      Date: getFormattedDate(item.date),
      ST: getFormattedTimeWithAMPM(item.startTime),
      EET: getFormattedTimeWithAMPM(item.expectedEndTime),
      Notes: item.notes || "",
    };
  });

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      {/* page title */}
      <PageTitle
        title={`Client Visit Logs (${clientVisitLogs?.length || 0})`}
        link="#"
      />

      {/* search and filter */}

      <div className="flex flex-col md:flex-row md:items-center gap-5 py-5 ">
        <SelectNumberPerPage
          setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
          numberOfRecordsPerPage={numberOfRecordsPerPage}
          maxLength={clientVisitLogs?.length}
        />

        <SearchBar
          handleSearch={handleSearch}
          setSearchKeyWord={setSearchKeyWord}
          searchKeyWord={searchKeyWord}
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-3 w-full mb-5">
        {!isUserLoading && (
          <div>
            <label>
              <span className="text-gray-700">Employee</span>
            </label>
            <SelectFilter
              handleFilter={handleFilterByEmployee}
              filterName={"employee"}
              options={[
                {
                  value: "all",
                  label: "All",
                },
                ...users
                  .filter(
                    (user) => user.role !== "admin" && user.role !== "manager"
                  )
                  .map((user) => ({
                    value: user._id,
                    label: user.name,
                  })),
              ]}
            />
          </div>
        )}
        <div>
          <label>
            <span className="text-gray-700">Visit Date</span>
          </label>
          <SelectFilter
            handleFilter={handleFilterByDate}
            filterName={"date"}
            options={[
              {
                value: "all",
                label: "All",
              },
              {
                value: "today",
                label: "Today",
              },
              {
                value: "yesterday",
                label: "Yesterday",
              },
              {
                value: "this_week",
                label: "This Week",
              },
              {
                value: "last_week",
                label: "Last Week",
              },
              {
                value: "this_month",
                label: "This Month",
              },
              {
                value: "last_month",
                label: "Last Month",
              },
            ]}
          />
        </div>

        <div>
          <label htmlFor="">Export to</label>
          <div className="flex gap-2 w-full">
            <ExportToExcel
              data={dataToExport}
              fileName={`Client_visit_log_${new Date().toLocaleDateString()}`}
            />
            <ExportToPDF
              data={dataToExport}
              fileName={`Client_visit_log_${new Date().toLocaleDateString()}`}
            />
          </div>
        </div>

        <div>
          <label>Clear all</label>
          <div
            onClick={handleClearAll}
            className="w-fit cursor-pointer bg-red-500 hover:bg-red-600 p-2 rounded text-white"
          >
            Clear all Now☢️
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader
          theads={[
            "No",
            "Employee",
            "Agent",
            "Purpose",
            "Date",
            "Start Time",
            "Expected End Time",
            "Notes",
            "Action",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={9} />
          ) : (
            <>
              {clientVisitLogs?.length == 0 ? (
                <tr>
                  <td
                    className="py-10 dark:text-white text-orange-500 text-center"
                    colSpan={9}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                <Pagination
                  data={clientVisitLogs}
                  deleteItemFn={handleDelete}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  renderRow={renderRows}
                  columns={9}
                />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientVisitLog;

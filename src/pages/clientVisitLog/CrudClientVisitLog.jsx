import { AuthContext } from "@/contexts/AuthContext";
import {
  useClientVisitLogsByEmployeeId,
  useDeleteClientVisitLog,
  useCreateClientVisitLog,
  useUpdateClientVisitLog,
} from "@/hooks/clientVisitLog/useClientVisitLog";
import { useContext, useEffect, useState } from "react";
import {
  getFormattedDate,
  getFormattedTimeWithAMPM,
} from "@/utils/getFormattedDate";
import {
  IoIosArrowDropdown,
  IoIosArrowDropup,
  IoMdAddCircleOutline,
} from "react-icons/io";
import { handleDeleteFunction } from "@/utils/handleDeleteFunction";
import { notify } from "@/utils/toastify";
import { MdOutlineArrowBackIos } from "react-icons/md";
import ExportToExcel from "@/components/table/ExportToExcel";
import ExportToPDF from "@/components/table/ExportToPDF";
import { scrollToTop } from "@/utils/scrollToTop";

const CrudClientVisitLog = () => {
  const { user } = useContext(AuthContext);
  const { data, isLoading, refetch } = useClientVisitLogsByEmployeeId(user._id);
  const deleteClientVisitLog = useDeleteClientVisitLog();
  const createClientVisitLog = useCreateClientVisitLog();
  const updateClientVisitLog = useUpdateClientVisitLog();

  const [clientVisitLog, setClientVisitLog] = useState({
    agentName: "",
    purpose: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    startTime: "",
    expectedEndTime: "",
    notes: "",
  });

  const [clientVisitLogs, setClientVisitLogs] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [expandIndex, setExpandIndex] = useState(0);

  useEffect(() => {
    if (data) {
      setClientVisitLogs(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If the field is a time field, update the time
    if (name === "startTime" || name === "expectedEndTime") {
      const [hours, minutes] = value.split(":");
      const updatedTime = new Date(clientVisitLog.startTime || new Date());
      updatedTime.setHours(hours);
      updatedTime.setMinutes(minutes);

      // Update the clientVisitLog with the new time
      setClientVisitLog((prev) => ({
        ...prev,
        [name]: updatedTime.toISOString(),
      }));
    } else {
      // For other fields, update normally
      setClientVisitLog((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate data
    if (
      !clientVisitLog.agentName ||
      !clientVisitLog.purpose ||
      !clientVisitLog.date ||
      !clientVisitLog.startTime
    ) {
      notify("Please fill all fields", "error");
      return;
    }
    // formated data to add or update
    const dataToAddOrUpdate = {
      ...clientVisitLog,
      // startTime: convertTimeToDate(clientVisitLog.startTime),
      // expectedEndTime: convertTimeToDate(clientVisitLog.expectedEndTime),
    };

    console.log("dataToAddOrUpdate", dataToAddOrUpdate);

    // check if editing or adding
    if (parseInt(editingIndex) >= 0) {
      const updatedClientVisitLogs = clientVisitLogs.map((item, index) =>
        index === editingIndex ? clientVisitLog : item
      );
      setClientVisitLogs(updatedClientVisitLogs);
      setEditingIndex(-1);

      try {
        const result = await updateClientVisitLog.mutateAsync({
          id: clientVisitLogs[editingIndex]._id,
          ...dataToAddOrUpdate,
        });

        if (result.status === "success") {
          notify("Update successfully", "success");
        } else {
          notify("Update fail!", "error");
        }
        console.log("Created item:", result);
      } catch (error) {
        notify("Update fail!", "error");
        console.error("Error Updating item:", error);
      }
    } else {
      try {
        const result = await createClientVisitLog.mutateAsync(
          dataToAddOrUpdate
        );

        if (result.status === "success") {
          notify("Created successfully", "success");
          refetch();
        } else {
          notify(result.error.message, "info");
        }
        console.log("Created item:", result);
      } catch (error) {
        notify("Created fail!", "error");
        console.error("Error Creating item:", error);
      }
    }

    setClientVisitLog({
      agentName: "",
      purpose: "",
      date: new Date().toISOString().split("T")[0], // Default to today's date
      startTime: "",
      expectedEndTime: "",
      notes: "",
    });
  };

  const handleEdit = (index) => {
    setClientVisitLog(clientVisitLogs[index]);
    setEditingIndex(index);
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteClientVisitLog.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          refetch();
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

  return (
    <div
      className={`flex justify-center items-center relative min-h-screen bg-gray-100 `}
    >
      <div
        className="bg-white shadow-md rounded-xl p-6 w-[375px] relative m-2"
        style={{ minHeight: "calc(100vh - 30px)" }}
      >
        <button
          onClick={() => {
            window.history.back();
          }}
          className="mt-6 flex items-center gap-2 text-white w-fit px-2 py-2 bg-red-500 hover:bg-orange-600 border border-white rounded-xl top-0 left-4 fixed"
        >
          <MdOutlineArrowBackIos />
        </button>

        {/* update and create client visit log form */}
        <div>
          <div className="flex items-center justify-between my-5">
            <h2 className="text-2xl font-bold">Client Visit Log Form </h2>
            {editingIndex >= 0 && (
              <span
                className="cursor-pointer"
                onClick={() => {
                  setEditingIndex(-1);
                  setClientVisitLog({
                    agentName: "",
                    purpose: "",
                    date: "",
                    startTime: "",
                    expectedEndTime: "",
                    notes: "",
                  });
                }}
              >
                <IoMdAddCircleOutline size={26} />
              </span>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name
              </label>
              <input
                value={clientVisitLog.agentName}
                onChange={handleChange}
                name="agentName"
                required
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purpose
              </label>
              <textarea
                type="text"
                name="purpose"
                value={clientVisitLog.purpose}
                rows={2}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md min-h-[70px] max-h-[200px]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={clientVisitLog.date?.split("T")[0]}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time {clientVisitLog.startTime}
              </label>
              <input
                type="time"
                name="startTime"
                value={
                  clientVisitLog.startTime
                    ? new Date(clientVisitLog.startTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : ""
                }
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expected End Time
              </label>
              <input
                type="time"
                name="expectedEndTime"
                value={
                  clientVisitLog.expectedEndTime
                    ? new Date(
                        clientVisitLog.expectedEndTime
                      ).toLocaleTimeString("en-US", {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <input
                type="text"
                name="notes"
                value={clientVisitLog.notes}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              disabled={
                updateClientVisitLog.isLoading || createClientVisitLog.isLoading
              }
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              {editingIndex >= 0
                ? updateClientVisitLog.isLoading
                  ? "Updating..."
                  : "Update Client Visit Log"
                : createClientVisitLog.isLoading
                ? "Creating..."
                : "Create Client Visit Log"}
            </button>
          </form>
        </div>

        {/* listing all client visit logs */}
        <div className="mt-5">
          <h3 className="text-xl font-semibold w-full">
            All Client Visit Logs{" "}
            {clientVisitLogs?.length > 0 && `(${clientVisitLogs.length})`}
          </h3>

          {isLoading ? (
            <small className="mt-2.5 block">Fetching Leave Requests...</small>
          ) : (
            <div>
              {clientVisitLogs.length > 0 ? (
                <>
                  <ul className="mt-4 space-y-2">
                    {clientVisitLogs.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 border border-gray-200 rounded-md relative"
                      >
                        <div
                          className="top-1.5 right-1.5 absolute cursor-pointer"
                          onClick={() => {
                            expandIndex === index
                              ? setExpandIndex(null)
                              : setExpandIndex(index);
                          }}
                        >
                          {expandIndex === index ? (
                            <IoIosArrowDropup size={22} />
                          ) : (
                            <IoIosArrowDropdown size={22} />
                          )}
                        </div>
                        <div>
                          <div>
                            <strong className="min-w-[150px] inline-block">
                              Agent name:
                            </strong>
                            {item.agentName}
                          </div>{" "}
                          <div className="line-clamp-1 hover:line-clamp-none">
                            <strong className="min-w-[150px] inline-block">
                              Purpose:
                            </strong>
                            {item.purpose}
                          </div>
                          {expandIndex === index && (
                            <>
                              {" "}
                              <div>
                                <strong className="min-w-[150px] inline-block">
                                  Date:
                                </strong>
                                {getFormattedDate(item.date)}
                              </div>
                              <div className="line-clamp-1 hover:line-clamp-none">
                                <strong className="min-w-[150px] inline-block">
                                  Start Time:
                                </strong>
                                {getFormattedTimeWithAMPM(item.startTime)}
                              </div>
                              <div className="line-clamp-1 hover:line-clamp-none">
                                <strong className="min-w-[150px] inline-block">
                                  Expected End Time:
                                </strong>
                                {getFormattedTimeWithAMPM(item.expectedEndTime)}
                              </div>
                              <div>
                                <strong className="min-w-[150px] inline-block">
                                  Notes:
                                </strong>
                                {item.notes ? item.notes : "No notes"}
                              </div>
                            </>
                          )}
                          <div className="mt-1">
                            <button
                              onClick={() => {
                                handleEdit(index);
                                scrollToTop();
                              }}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              disabled={deleteClientVisitLog.isLoading}
                              onClick={() => handleDelete(item._id)}
                              className="ml-3 text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {clientVisitLogs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <span> Export to:</span>
                      <div className="flex gap-1 w-fit justify-end">
                        <ExportToExcel
                          data={dataToExport}
                          fileName={`${
                            user.name
                          }_Leave_request_${new Date().toLocaleDateString()}`}
                        />
                        <ExportToPDF
                          data={dataToExport}
                          fileName={`${
                            user.name
                          }_Leave_request_${new Date().toLocaleDateString()}`}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <small className="mt-2.5 block">No Leave Request Found</small>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrudClientVisitLog;

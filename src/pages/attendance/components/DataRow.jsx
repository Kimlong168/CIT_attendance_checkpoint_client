import { FaTrash } from "react-icons/fa";
import {
  getFormattedDate,
  getFormattedTimeWithAMPM,
} from "@/utils/getFormattedDate";
export const renderRows = (item, index, handleDelete) => {
  return (
    <>
      <tr
        key={item.id}
        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
      >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.employee?.name}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {getFormattedTimeWithAMPM(item.time_in)}{" "}
          <span
            className={
              item.check_in_status == "On Time"
                ? "text-green-600"
                : "text-red-500"
            }
          >
            ({item.check_in_status})
          </span>
        </td>
        <td className="px-4 py-3 min-w-[250px]">
          {item.check_out_status ? (
            <>
              {item.time_out ? getFormattedTimeWithAMPM(item.time_out) : ""}{" "}
              <span
                className={
                  item.check_out_status == "Checked Out"
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                ({item.check_out_status})
              </span>
            </>
          ) : (
            "Not Yet"
          )}
        </td>
        <td className="px-4 py-3 min-w-[250px]">
          {getFormattedDate(item.date)}
        </td>
        <td className="px-4 py-3 min-w-[250px]">{item.qr_code?.location}</td>

        <td className="px-4 py-3 text-sm text-center">
          <div className=" flex items-center gap-2">
            <div
              onClick={() => handleDelete(item._id)}
              className="grid place-content-center rounded bg-red-600 text-white w-7 h-7 cursor-pointer"
            >
              <FaTrash />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

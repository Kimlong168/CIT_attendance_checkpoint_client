import { useState } from "react";
import { notify } from "../../../utils/toastify";
import PropTypes from "prop-types";
import RedStar from "../../../components/ui/RedStar";
import { useGetCurrentIp } from "@/hooks/qrcode/useQrcode";

const QrCodeForm = ({ onSubmitFn, isSubmitting, initialData = {} }) => {
  const { data: currentIp } = useGetCurrentIp();
  const [data, setData] = useState({
    location: initialData.location || "",
    workStartTime: initialData.workStartTime || "",
    workEndTime: initialData.workEndTime || "",
    allowedNetworkRanges: initialData.allowedNetworkRanges || [
      {
        wifiName: "",
        ip: "",
      },
    ],
  });

  // Handle change in input fields
  const handleChangeNetworkRanges = (index, e) => {
    const newAllowedNetworkRanges = [...data.allowedNetworkRanges];
    newAllowedNetworkRanges[index][e.target.name] = e.target.value;
    setData((prevData) => ({
      ...prevData,
      allowedNetworkRanges: newAllowedNetworkRanges,
    }));
  };

  // Handle adding new empty object in allowedNetworkRanges array
  const handleAdd = () => {
    setData((prevData) => ({
      ...prevData,
      allowedNetworkRanges: [
        ...prevData.allowedNetworkRanges,
        { wifiName: "", ip: "" },
      ],
    }));
  };

  // Handle removing an item from allowedNetworkRanges
  const handleRemove = (index) => {
    const newAllowedNetworkRanges = data.allowedNetworkRanges.filter(
      (_, i) => i !== index
    );
    setData((prevData) => ({
      ...prevData,
      allowedNetworkRanges: newAllowedNetworkRanges,
    }));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value, // Handle file input and text input
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !data.location ||
      !data.workStartTime ||
      !data.workEndTime ||
      data.allowedNetworkRanges.length === 0
    ) {
      const message = !data.allowedNetworkRanges.length
        ? "Allowed Network Ranges must not be empty."
        : "Please fill all the fields!";
      notify(message, "error");
      return;
    }

    // make sure all allowedNetworkRanges are filled
    for (let i = 0; i < data.allowedNetworkRanges.length; i++) {
      if (
        !data.allowedNetworkRanges[i].wifiName ||
        !data.allowedNetworkRanges[i].ip
      ) {
        notify("Please fill all the fields!", "error");
        return;
      }
    }

    onSubmitFn(data);
  };

  return (
    <div className="w-full flex flex-col  border border-white/50 rounded-3xl gap-3">
      {/* data title input */}

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">
          Location <RedStar />
        </label>
        <input
          type="text"
          name="location"
          value={data.location}
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />
      </div>

      {/* work time */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">
            Work Start Time <RedStar />
          </label>
          <input
            type="time"
            name="workStartTime"
            value={data.workStartTime}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>{" "}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">
            Work End Time <RedStar />
          </label>
          <input
            type="time"
            name="workEndTime"
            value={data.workEndTime}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>{" "}
      </div>

      {/* allowed network ranges */}
      <div className="space-y-4">
        {data.allowedNetworkRanges.map((networkRange, index) => (
          <div key={index} className="p-4 border rounded-md shadow-sm bg-white">
            {currentIp ? "Your current IP: " + currentIp.userIp : ""}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Wi-Fi Name
                  <RedStar />
                </label>
                <input
                  type="text"
                  name="wifiName"
                  value={networkRange.wifiName}
                  onChange={(e) => handleChangeNetworkRanges(index, e)}
                  placeholder="Enter Wi-Fi name"
                  className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  IP Address
                  <RedStar />
                </label>
                <input
                  type="text"
                  name="ip"
                  value={networkRange.ip}
                  onChange={(e) => handleChangeNetworkRanges(index, e)}
                  placeholder="Enter IP address"
                  className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {data.allowedNetworkRanges.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 focus:outline-none"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 py-2 px-4 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Another Network
        </button>
      </div>

      {/*create data button */}
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 mt-2 rounded"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

QrCodeForm.propTypes = {
  onSubmitFn: PropTypes.func,
  isSubmitting: PropTypes.bool,
  initialData: PropTypes.object,
};

export default QrCodeForm;

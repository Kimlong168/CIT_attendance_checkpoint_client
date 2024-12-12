// Function to format the date for the input field
export const getFormattedDate = (isoString) => {
  if (!isoString) {
    return "";
  }
  const date = new Date(isoString);

  // Options for the date format
  const options = { day: "numeric", month: "short", year: "numeric" };

  // Formatting the date to "10 Jan 2023"
  return date.toLocaleDateString("en-GB", options);
};

// get time with AM and PM

export const getFormattedTimeWithAMPM = (isoString) => {
  if (!isoString) {
    return "";
  }
  const date = new Date(isoString);

  // Options for the date format, including seconds
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  // Formatting the date to include hours, minutes, and seconds with AM/PM
  return date.toLocaleTimeString("en-GB", options);
};

//convert to date
export const convertTimeToDate = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number); // Split and parse the time string
  const now = new Date(); // Get the current date
  now.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds and milliseconds
  return now;
};

export const convertDateToTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0"); // Get hours and format with two digits
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes and format with two digits
  return `${hours}:${minutes}`; // Return formatted time string
};

export const convertTo24HourFormat = (timeString) => {
  // Split the time string into [time, period]
  const [time, period] = timeString.split(" ");
  let [hours, minutes, seconds] = time.split(":");

  // Convert hours to a number
  hours = parseInt(hours, 10);

  // Adjust hours based on the period (AM/PM)
  if (period?.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  } else if (period?.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  // Return the 24-hour formatted time with seconds
  return `${hours?.toString().padStart(2, "0")}:${minutes
    ?.toString()
    .padStart(2, "0")}:${seconds?.toString().padStart(2, "0")}`;
};

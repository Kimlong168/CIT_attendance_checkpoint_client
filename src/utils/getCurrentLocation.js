export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Resolve only latitude and longitude
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          reject(err);
        },
        {
          enableHighAccuracy: true, // Forces the use of GPS or a more accurate method
          timeout: 30000, // Maximum time allowed to wait for a position (in milliseconds)
          maximumAge: 0, // Don't accept a cached location
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

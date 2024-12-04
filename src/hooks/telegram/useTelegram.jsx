import { useMutation } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useTelegramSendMessage = () => {
  return useMutation(async (data) => {
    const response = await axiosClient.post(`/telegram/send-message`, data);

    return response.data;
  });
};

export const useTelegramSendImage = () => {
  return useMutation(async (data) => {
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("chat_id", data.chat_id);
    formData.append("caption", data.caption);

    const response = await axiosClient.post(`/telegram/send-image`, formData);

    return response.data;
  });
};

export const useTelegramSendImageUrl = () => {
  return useMutation(async (data) => {
    const response = await axiosClient.post(`/telegram/send-image-url`, data);

    return response.data;
  });
};


export const useRequestOtp = () => {
  return useMutation(async (data) => {
    const response = await axiosClient.post(`/auth/request-otp`, data);

    return response.data;
  });
};

export const useVerifyOtp = () => {
  return useMutation(async (data) => {
    const response = await axiosClient.post(`/auth/verify-otp`, data);

    console.log("response verify otp", response);

    return response.data;
  });
};

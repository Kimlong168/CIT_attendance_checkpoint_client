import { useState } from "react";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { notify } from "../../utils/toastify";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/user/useUser";
import { telegramMessageTemplate } from "../../utils/data";

import RedStar from "../../components/ui/RedStar";
import {
  useTelegramSendImage,
  useTelegramSendImageUrl,
  useTelegramSendMessage,
} from "@/hooks/telegram/useTelegram";
const Telegram = () => {
  const sendMessage = useTelegramSendMessage();
  const sendImage = useTelegramSendImage();
  const sendImageUrl = useTelegramSendImageUrl();
  const {
    data: users,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUsers();

  const [telegramData, setTelegramData] = useState({
    name: "",
    chat_id: "",
    message: "",
    image: "",
    image_url: "",
  });

  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (value === "default" || value == "Loading") return;

    if (name === "image") {
      const file = e.target.files[0];
      setTelegramData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
      return;
    }

    if (name === "name") {
      const user = users.find((user) => user.name === value);

      setTelegramData((prevtelegramData) => ({
        ...prevtelegramData,
        name: value,
        chat_id: user?.chat_id,
      }));

      return;
    }

    setTelegramData((prevtelegramData) => ({
      ...prevtelegramData,
      [name]: value, // Handle file input and text input
    }));
  };

  const handleChangeTemplate = (e) => {
    const { value } = e.target;

    if (value === "") {
      setSelectedTemplate("");
      setTelegramData((prevtelegramData) => ({
        ...prevtelegramData,
        message: "",
      }));
      return;
    }

    setSelectedTemplate(value);

    const template = telegramMessageTemplate.find(
      (template) => template.type === value
    );

    setTelegramData((prevtelegramData) => ({
      ...prevtelegramData,
      // subject: template.subject,
      message: template.body,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!telegramData.message || !telegramData.name || !telegramData.chat_id) {
      notify("Please fill all the fields!", "error");
      return;
    }

    // check is email and cc dubplicate

    setIsSubmitting(true);
    // Send telegram message
    try {
      let result;
      if (telegramData.image_url) {
        result = await sendImageUrl.mutateAsync({
          image: telegramData.image_url,
          caption: telegramData.message,
          chat_id: telegramData.chat_id,
        });
      } else if (telegramData.image) {
        result = await sendImage.mutateAsync({
          image: telegramData.image,
          caption: telegramData.message,
          chat_id: telegramData.chat_id,
        });
      } else {
        result = await sendMessage.mutateAsync({
          message: telegramData.message,
          chat_id: telegramData.chat_id,
        });
      }

      navigate("/telegram");
      setIsSubmitting(false);

      if (result.status === "success") {
        notify("Sent successfully", "success");
      } else {
        notify("Sent fail!", "error");
      }
      console.log("sending telegram message:", result);
    } catch (error) {
      notify("Sent fail!", "error");
      console.error("Error sending mail:", error);
    }
  };

  if (isUserError) {
    return <div>Error...</div>;
  }

  return (
    <div className="text-gray-900  border-gray-700 rounded shadow-xl p-4">
      {/* title */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-xl sm:text-2xl md:text-3xl underline text-orange-500 uppercase">
          Send Telegram Message
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-sm">Message Template</label>
        <select
          name="name"
          value={selectedTemplate}
          onChange={handleChangeTemplate}
          className="border p-2 rounded focus:outline-orange-500"
        >
          <option value="" className=" bg-green-600/50">
            Select Template
          </option>
          {telegramMessageTemplate.map((template) => (
            <option key={template.type} value={template.type}>
              {template.type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex flex-col md:flex-row gap-3 mt-3">
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-sm">
              Send To <RedStar />
            </label>
            <select
              name="name"
              value={telegramData.name}
              onChange={handleOnChange}
              className="border p-2 rounded focus:outline-orange-500"
            >
              {isUserLoading ? (
                <option value="Loading">Loading...</option>
              ) : (
                <>
                  <option value="default" className=" bg-green-600/50">
                    Select User
                  </option>{" "}
                  {users?.map((user) => (
                    <option key={user._id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-sm">
              Chat ID <RedStar />
            </label>
            <input
              type="text"
              name="chat_id"
              value={telegramData.chat_id}
              onChange={handleOnChange}
              className="border p-2 rounded focus:outline-orange-500 w-auto"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="font-medium text-sm">Image(File)</label>

          <input
            type="file"
            name="image"
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500 block mt-1 w-full"
          />
        </div>

        <div className="mt-3">
          <label className="font-medium text-sm">or Image(URL)</label>

          <input
            type="url"
            name="image_url"
            value={telegramData.image_url}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500 block mt-1 w-full"
          />
        </div>

        <div className="mt-3">
          <label className="font-medium text-sm">
            Message <RedStar />
          </label>

          <textarea
            name="message"
            value={telegramData.message}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500 block mt-1 w-full min-h-[300px]"
          >
            {telegramData.message}
          </textarea>
        </div>

        {/*create telegramData button */}
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 px-5 mt-2 rounded"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Telegram;

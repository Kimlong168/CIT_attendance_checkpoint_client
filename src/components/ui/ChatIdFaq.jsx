import { useState } from "react";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
const ChadIdFaq = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mt-12">
      <hr />
      <br />
      <h1
        className="text-xl lg:text-2xl mb-5 font-bold text-gray-800 hover:text-blue-500 cursor-pointer flex items-center gap-4"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        FAQ: How to Get Chat ID?{" "}
        <span>{collapsed ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}</span>
      </h1>
      {collapsed && (
        <ol className="space-y-4">
          <li className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex justify-center items-center font-semibold">
              1
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Open Telegram
              </h2>
              <p className="text-gray-600">
                Launch the Telegram app on your device.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex justify-center items-center font-semibold">
              2
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Search for @getInfoByIdBot
              </h2>
              <p className="text-gray-600">
                In the Telegram search bar, type @getInfoByIdBot and select the
                bot from the results. or you can{" "}
                <span className="text-blue-500 hover:text-blue-600 underline">
                  {" "}
                  <Link
                    to="https://t.me/getInfoByIdBot
"
                  >
                    click here
                  </Link>
                </span>
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex justify-center items-center font-semibold">
              3
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Start the Bot
              </h2>
              <p className="text-gray-600">
                Tap &quot;Start&quot; to initiate a conversation with the bot.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex justify-center items-center font-semibold">
              4
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Get the Chat ID
              </h2>
              <p className="text-gray-600">
                The bot will provide your chat ID. Copy it and share it with the
                admin or input it into the dashboard.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex justify-center items-center font-semibold">
              5
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                If you want to Get the Chat ID of your employee?
              </h2>
              <p className="text-gray-600">
                Forward their message that texted with you to this bot. The bot
                will provide his/her chat ID. Copy it and share it with the
                admin or input it into the dashboard. <br />
                <br />
                <mark className="mr-3">Note: </mark>In case, you cannot see
                their chat ID, It is because that user set up their telegram
                account as private. So, you might need to let him/her get the
                the chat ID for you themselvess by following the above steps.
              </p>
            </div>
          </li>
        </ol>
      )}
    </div>
  );
};

export default ChadIdFaq;

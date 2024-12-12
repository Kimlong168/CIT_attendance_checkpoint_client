import { useState } from "react";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
const WifiIpRangeFaq = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="mt-12">
      <hr />
      <br />
      <h1
        className="text-xl lg:text-2xl mb-5 font-bold text-gray-800 hover:text-blue-500 cursor-pointer flex items-center gap-4"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        FAQ: How to Get a Network IP Range on ipinfo.io{" "}
        <span>{collapsed ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}</span>
      </h1>
      {collapsed && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              What is ipinfo.io?
            </h2>
            <p className="text-gray-700">
              ipinfo.io is a service that provides detailed information about IP
              addresses, including geolocation, organization, and network
              details.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Do I need an account to use ipinfo.io?
            </h2>
            <p className="text-gray-700">
              Yes, some features, such as searching for IP ranges, may require
              you to create an account and log in.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Steps to Get a Network IP Range on ipinfo.io
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                <strong>Visit ipinfo.io:</strong> Go to the website:{" "}
                <a href="https://ipinfo.io" className="text-blue-500 underline">
                  https://ipinfo.io
                </a>
                .
              </li>
              <li>
                <strong>Log in or Create an Account:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Click on the &#34;Log In&#34; button in the top-right
                    corner.
                  </li>
                  <li>
                    If you don’t have an account, click &#34;Sign Up&#34; and
                    follow the instructions to create one.
                  </li>
                  <li>Once your account is created, log in.</li>
                </ul>
              </li>
              <li>
                <strong>Go to the &#34;Search&#34; Feature:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Navigate to the &#34;Search&#34; page from your account
                    dashboard.
                  </li>
                  <li>
                    Direct URL:{" "}
                    <a
                      href="https://ipinfo.io/account/search"
                      className="text-blue-500 underline"
                    >
                      https://ipinfo.io/account/search
                    </a>
                    .
                  </li>
                </ul>
              </li>
              <li>
                <strong>
                  Click on{" "}
                  <span className="text-blue-500">Your IP Address</span> button
                  on the top right:
                </strong>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Click directly on your IP address shown on the page. This
                    will take you to a detailed page with more information about
                    the IP.
                  </li>
                </ul>
              </li>
              <li>
                <strong>
                  Scroll Down to Network Information (Abuse Section):
                </strong>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    On the details section, find the row labeled
                    <strong className="text-blue-500">
                      {" "}
                      &#34;network&#34;
                    </strong>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Copy the Network IP:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Look for the network range, which should be something like
                    202.56.0.0/22 or a similar format.
                  </li>
                  <li>copy it and paste to your application.</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default WifiIpRangeFaq;

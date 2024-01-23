import React from "react";
import { useUrl } from "../context/UrlContext";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

export const LatestUrl = ({ theme }) => {
  const { url } = useUrl();
  const { currentUser } = useAuth();
  const latestUrl = url[url.length - 1];

  const containerClass = `m-8 p-6 rounded-lg shadow-md ${
    theme ? "bg-gray-800 " : "bg-white"
  }`;

  const linkClass = `font-bold hover:underline`;

  const handleCopyOriginalUrl = async () => {
    try {
      await navigator.clipboard.writeText(latestUrl.originalUrl);
      toast.success("Original URL Copied to clipboard!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };
  const handleCopyShortUrl = async () => {
    try {
      await navigator.clipboard.writeText(latestUrl.shortUrl);
      toast.success("Short URL Copied to clipboard!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div>
      {currentUser && url.length > 0 ? (
        <div className={containerClass}>
          <div className="flex items-center justify-between mb-4">
            <h5
              className={`text-xl font-bold leading-none text-gray-900 ${
                theme ? "text-white" : ""
              }`}
            >
              Latest Short URL
            </h5>
            <Link
              to="/manage-links"
              className={`text-sm font-medium  hover:underline`}
            >
              Manage Links
            </Link>
          </div>

          <div className="flex border-t p-3">
            <div className="text-start flex justify-center items-center">
              <p className="text-sm font-medium truncate ">Original URL:</p>
            </div>
            <p className=" w-[100%] bg-gray-200 p-2 rounded-lg text-gray-500 text-start truncate m-2">
              {latestUrl?.originalUrl}
            </p>
            <div className="inline-flex items-center text-base font-semibold  ">
              <button onClick={handleCopyOriginalUrl} className={linkClass}>
                Copy
              </button>
            </div>
          </div>
          <div className="flex border-t p-3">
            <div className="text-start flex justify-center items-center">
              <p className="text-sm font-medium truncate ">Shorten URL:</p>
            </div>
            <p className=" w-[100%] bg-gray-200 p-2 rounded-lg text-gray-500 text-start truncate m-2">
              <Link
                to={latestUrl?.shortUrl}
                className={linkClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                {latestUrl?.shortUrl}
              </Link>
            </p>
            <div className="inline-flex items-center text-base font-semibold">
              <button onClick={handleCopyShortUrl} className={linkClass}>
                Copy
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {url.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Original URL
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Shorten URL
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Expiration Date
                  </th>

                  {/* <th scope="col" className="px-6 py-3">
                    <span>Action</span>
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {url?.map((urlList) => {
                  return (
                    <tr key={urlList._id} className="bg-white border-b ">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex justify-between ">
                          <Link
                            to={urlList.originalUrl}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {urlList.originalUrl.split("").length > 40
                              ? urlList.originalUrl
                                  .split("")
                                  .slice(0, 20)
                                  .join("") + "..."
                              : urlList.originalUrl}
                          </Link>

                          <span
                            className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded flex justify-center items-center cursor-pointer"
                            onClick={handleCopyOriginalUrl}
                          >
                            Copy
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                        <div className="flex justify-between">
                          <Link
                            to={urlList.originalUrl}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {urlList.shortUrl.split("").length > 40
                              ? urlList.originalUrl
                                  .split("")
                                  .slice(0, 20)
                                  .join("") + "..."
                              : urlList.shortUrl}
                          </Link>

                          <span
                            className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded flex justify-center items-center cursor-pointer"
                            onClick={handleCopyShortUrl}
                          >
                            Copy
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(urlList.expiresAt)}
                      </td>

                      {/* <td className="px-6 py-4 ">
                        <a
                          href="#"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Share it
                        </a>
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
        </div>
      )}
    </div>
  );
};

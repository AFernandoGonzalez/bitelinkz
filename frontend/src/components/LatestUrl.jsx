import React from "react";
import { useUrl } from "../context/UrlContext";
import { Link } from "react-router-dom";

import { toast } from 'react-toastify';


export const LatestUrl = ({ theme }) => {
    const { url } = useUrl();
    const latestUrl = url[url.length - 1];

    const containerClass = `m-8 p-6 rounded-lg shadow-md ${theme ? "bg-gray-800 " : "bg-white"
        }`;

    const linkClass = `font-bold hover:underline`;


    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(latestUrl.originalUrl);
            toast.success('Copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy to clipboard');
        }
    };

    return (
        <div>
            {latestUrl && (
                <div className={containerClass}>
                    <div className="flex items-center justify-between mb-4">
                        <h5 className={`text-xl font-bold leading-none text-gray-900 ${theme ? "text-white" : ""}`}>Latest Short URL</h5>
                        <Link to="/manage-links" className={`text-sm font-medium  hover:underline`}>
                            Manage Links
                        </Link>
                    </div>

                    <div className="flex border-t p-3">
                        <div className="text-start flex justify-center items-center">
                            <p className="text-sm font-medium truncate ">
                                Original URL:
                            </p>

                        </div>
                        <p className=" w-[100%] bg-gray-200 p-2 rounded-lg text-gray-500 text-start truncate m-2">
                            {latestUrl.originalUrl}
                        </p>
                        <div className="inline-flex items-center text-base font-semibold  ">
                            <button onClick={handleCopyClick} className={linkClass}>
                                Copy
                            </button>
                        </div>
                    </div>
                    <div className="flex border-t p-3">
                        <div className="text-start flex justify-center items-center">
                            <p className="text-sm font-medium truncate ">
                                Shorten URL:
                            </p>

                        </div>
                        <p className=" w-[100%] bg-gray-200 p-2 rounded-lg text-gray-500 text-start truncate m-2">
                            <Link
                                to={latestUrl.shortUrl}
                                className={linkClass}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {latestUrl.shortUrl}
                            </Link>
                        </p>
                        <div className="inline-flex items-center text-base font-semibold">
                            <button onClick={handleCopyClick} className={linkClass}>
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

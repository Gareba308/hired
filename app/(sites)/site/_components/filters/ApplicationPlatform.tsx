import React from "react";
import { platforms } from "../data/create-job/CreateJobData";
interface ApplicationPlatformProps {
  handlePlatformChange: (platform: string) => void;
  selectedPlatforms: string[];
}

const ApplicationPlatform = ({
  selectedPlatforms,
  handlePlatformChange,
}: ApplicationPlatformProps) => {
  return (
    <ul
      role="list"
      className="space-y-4 border-b border-gray-200 pb-6 text-gray-600"
    >
      <h2 className="font-medium">Application Platform</h2>
      <div className="space-y-2 font-normal text-sm">
        {platforms.map((platform, idx) => (
          <div key={idx} className="flex items-center">
            <input
              type="checkbox"
              id={`platform-${idx}`}
              value={platform.value}
              checked={selectedPlatforms.includes(platform.value)}
              onChange={() => handlePlatformChange(platform.value)}
            />
            <label htmlFor={`platform-${idx}`} className="ml-2">
              {platform.label}
            </label>
          </div>
        ))}
      </div>
    </ul>
  );
};

export default ApplicationPlatform;

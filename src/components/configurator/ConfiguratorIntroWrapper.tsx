
import React from "react";
import ConfiguratorIntro from "./ConfiguratorIntro";

interface ConfiguratorIntroWrapperProps {
  onStart: () => void;
}

const ConfiguratorIntroWrapper = ({ onStart }: ConfiguratorIntroWrapperProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <ConfiguratorIntro onStart={onStart} />
    </div>
  );
};

export default ConfiguratorIntroWrapper;

import React, { useEffect, useState } from "react";
import "./FadeComponent.css";

const FadeComponent = ({ isOpen, children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  return shouldRender ? (
    <div
      className={`fade ${isOpen ? "fade-in" : "fade-out"}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  ) : null;
};

export default FadeComponent;

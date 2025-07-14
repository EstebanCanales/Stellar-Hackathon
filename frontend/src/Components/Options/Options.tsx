import React from "react";
import { Link } from "react-router-dom";

type OptionsProps = {
  color?: string;
  text?: string;
  icon?: React.ElementType;
  page: string;
  description?: string;
};

const Options: React.FC<OptionsProps> = ({
  color,
  icon: Icon,
  text,
  page,
  description,
}) => {
  return (
    <Link to={page} className="block group">
      <div className="verida-card p-6 text-center hover:scale-105 transition-all duration-300 min-h-[200px] flex flex-col justify-center">
        {/* Icon Container */}
        <div className="flex items-center justify-center mb-4">
          {Icon && (
            <div
              className="w-16 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-verida-md"
              style={{ backgroundColor: color }}
            >
              <Icon size={32} className="text-verida-dark-teal" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-verida-dark-teal mb-2 group-hover:text-verida-dark-purple transition-colors duration-300">
            {text}
          </h3>
          {description && (
            <p className="text-sm text-verida-dark-teal/70 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Hover effect indicator */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-0.5 bg-gradient-accent mx-auto rounded-full"></div>
        </div>
      </div>
    </Link>
  );
};

export default Options;

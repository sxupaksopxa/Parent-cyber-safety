import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation("ui");

  const currentLanguage = i18n.resolvedLanguage?.startsWith("de") ? "de" : "en";

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm hover:border-gray-300 transition">
      <select
        value={currentLanguage}
        onChange={handleChange}
        aria-label="Language selector"
        className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer pr-1"
      >
        <option value="en">EN</option>
        <option value="de">DE</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
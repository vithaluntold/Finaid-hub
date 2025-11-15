"use client";

import React from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { format as formatDate } from "date-fns";

type Props = {
  state: Record<string, any>;
  setState: React.Dispatch<React.SetStateAction<any>>;
  name: string;
  format?: string; // default: 'Y-m-d'
  placeholder?: string;
};

const DatePickerInput: React.FC<Props> = ({
  state,
  setState,
  name,
  format = "Y-m-d",
  placeholder = "Select a date",
}) => {
  const handleChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      const date = selectedDates[0];

      // Format as YYYY-MM-DD
      const formattedDate = formatDate(
        date,
        format === "d-m-Y" ? "dd-MM-yyyy" : "yyyy-MM-dd"
      );

      setState((prev: any) => ({
        ...prev,
        [name]: formattedDate,
      }));
    }
  };

  const defaultValue = state[name] ? new Date(state[name]) : null;

  return (
    <Flatpickr
      options={{
        dateFormat: format,
      }}
      value={defaultValue || undefined}
      onChange={handleChange}
      className="border border-black-300 rounded px-2 py-2 w-full text-black font-normal text-sm"
      placeholder={placeholder}
    />
  );
};

export default DatePickerInput;

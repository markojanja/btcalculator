import { useState, useRef } from "react";
import Flatpickr from "react-flatpickr";
import { FaCalendarAlt } from "react-icons/fa";
import "flatpickr/dist/flatpickr.min.css";

const CustomDatePicker = ({ setter, placeholder }) => {
  const [date, setDate] = useState(null);

  const flatpickrRef = useRef(null);

  const handleDateChange = (selectedDates) => {
    const date = selectedDates[0];
    const formattedDate = date?.toLocaleDateString("en-CA"); // YYYY-MM-DD

    setDate(formattedDate);
    setter(formattedDate);
  };

  return (
    <div className="date-picker-container">
      <Flatpickr
        ref={flatpickrRef}
        value={date}
        onChange={handleDateChange}
        options={{ dateFormat: "Y-m-d" }}
        placeholder={placeholder}
      />
      <FaCalendarAlt
        className="calendar-icon"
        onClick={() => flatpickrRef.current.flatpickr.open()}
      />
    </div>
  );
};

export default CustomDatePicker;

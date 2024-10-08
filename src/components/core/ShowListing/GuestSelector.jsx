import { useState } from "react";
import React from 'react'

export default function GuestSelector({ guests, onGuestChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="guests-dropdown my-4 relative">
      <button onClick={()=>setShowDropdown(!showDropdown)} type="button" className={`border rounded-xl ${showDropdown && "rounded-b-[0]"} w-full p-2 text-left`}>
        {/* Guests */}
        {
          guests.adults > 0 && <span>{guests.adults} Adults </span>
        }
        {
          guests.children > 0 && <span>{guests.children} Children </span>
        }
        {
          guests.infants > 0 && <span>{guests.infants} Infants </span>
        }
        {
          guests.pets > 0 && <span>{guests.pets} Pets </span>
        }
      </button>
      <div className={`w-full ${showDropdown && "rounded-t-[0rem]"} rounded-xl absolute z-[2] bg-white border px-8 py-2 ${showDropdown ? "block":"hidden"}`}>
        {['adults', 'children', 'infants', 'pets'].map((type) => (
          <div key={type} className="flex items-center justify-between py-2">
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <div className="controls flex items-center gap-2">
              <button
                type="button"
                className="minus h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center"
                onClick={() => onGuestChange(type, 'decrement')}
              >
                -
              </button>
              <span className="count">{guests[type]}</span>
              <button
                type="button"
                className="plus h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center"
                onClick={() => onGuestChange(type, 'increment')}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


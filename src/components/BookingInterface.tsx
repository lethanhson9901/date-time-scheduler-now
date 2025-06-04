"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SelectedSlot {
  date: Date;
  time: string;
  dateString: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookingInterface = () => {
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([
    {
      date: new Date(2025, 5, 26), // June 26, 2025
      time: "16:00",
      dateString: "June 26, 2025"
    },
    {
      date: new Date(2025, 5, 19), // June 19, 2025
      time: "9:00",
      dateString: "June 19, 2025"
    },
    {
      date: new Date(2025, 5, 12), // June 12, 2025
      time: "20:00",
      dateString: "June 12, 2025"
    }
  ]);
  
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1)); // May 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 5, 19)); // June 19, 2025 for time display
  const [focusedDate, setFocusedDate] = useState<Date | null>(new Date(2025, 4, 4)); // May 4, 2025 with blue ring
  
  const maxSlots = 3;
  const remainingSlots = maxSlots - selectedSlots.length;

  // Mock time slots for different dates
  const getTimeSlots = (date: Date): TimeSlot[] => {
    return [
      { time: "9:00", available: true },
      { time: "12:00", available: false },
      { time: "16:00", available: true },
      { time: "20:00", available: true }
    ];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatDateString = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const isDateSelected = (date: Date) => {
    return selectedSlots.some(slot => 
      slot.date.getDate() === date.getDate() && 
      slot.date.getMonth() === date.getMonth() &&
      slot.date.getFullYear() === date.getFullYear()
    );
  };

  const isDateFocused = (date: Date) => {
    if (!focusedDate) return false;
    return focusedDate.getDate() === date.getDate() && 
           focusedDate.getMonth() === date.getMonth() &&
           focusedDate.getFullYear() === date.getFullYear();
  };

  const getSelectedTimeForDate = (date: Date) => {
    const slot = selectedSlots.find(slot => 
      slot.date.getDate() === date.getDate() && 
      slot.date.getMonth() === date.getMonth() &&
      slot.date.getFullYear() === date.getFullYear()
    );
    return slot?.time;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    setSelectedDate(new Date(date));
    setFocusedDate(null); // Clear focus when clicking
  };

  const handleDateDoubleClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    // If the date is selected, remove it from selectedSlots
    if (isDateSelected(date)) {
      const newSlots = selectedSlots.filter(slot => 
        !(slot.date.getDate() === date.getDate() && 
          slot.date.getMonth() === date.getMonth() &&
          slot.date.getFullYear() === date.getFullYear())
      );
      setSelectedSlots(newSlots);
      
      // If we just deselected the currently viewed date, clear the selected date
      if (selectedDate && 
          selectedDate.getDate() === date.getDate() && 
          selectedDate.getMonth() === date.getMonth() &&
          selectedDate.getFullYear() === date.getFullYear()) {
        setSelectedDate(null);
      }
    }
  };

  const handleDateHover = (date: Date) => {
    if (!isDateDisabled(date) && !isDateSelected(date)) {
      setFocusedDate(new Date(date));
    }
  };

  const handleDateLeave = () => {
    setFocusedDate(null);
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;

    const existingSlotIndex = selectedSlots.findIndex(slot => 
      slot.date.getDate() === selectedDate.getDate() && 
      slot.date.getMonth() === selectedDate.getMonth() &&
      slot.date.getFullYear() === selectedDate.getFullYear()
    );

    const newSlot: SelectedSlot = {
      date: new Date(selectedDate),
      time,
      dateString: formatDateString(selectedDate)
    };

    if (existingSlotIndex >= 0) {
      // Update existing slot
      const newSlots = [...selectedSlots];
      newSlots[existingSlotIndex] = newSlot;
      setSelectedSlots(newSlots);
    } else if (selectedSlots.length < maxSlots) {
      // Add new slot
      setSelectedSlots([...selectedSlots, newSlot]);
    }
  };

  const clearSlots = () => {
    setSelectedSlots([]);
    setFocusedDate(new Date(2025, 4, 4)); // Reset focus to May 4th
  };

  const saveSlots = () => {
    console.log('Saving slots:', selectedSlots);
    // Handle save logic here
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates and some random dates for demo
    const today = new Date();
    if (date < today) return true;
    
    // Disable some specific dates for demo (like weekends or unavailable dates)
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Disable weekends for demo
  };

  const renderCalendar = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <div className="flex-1">
        <h3 className="text-center font-medium mb-4 text-black">
          {monthNames[month]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-sm text-gray-500 p-2 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === month;
            const isSelected = isDateSelected(day);
            const isFocused = isDateFocused(day);
            const isDisabled = isDateDisabled(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                onDoubleClick={() => handleDateDoubleClick(day)}
                onMouseEnter={() => handleDateHover(day)}
                onMouseLeave={handleDateLeave}
                disabled={isDisabled}
                className={`
                  p-2 text-sm rounded-full aspect-square flex items-center justify-center
                  transition-all duration-200 hover:bg-gray-100 font-medium relative
                  ${!isCurrentMonth ? 'text-gray-300' : 'text-black'}
                  ${isSelected ? 'bg-black text-white hover:bg-gray-800' : ''}
                  ${isDisabled ? 'text-gray-300 cursor-not-allowed hover:bg-transparent' : ''}
                  ${isToday && !isSelected ? 'ring-2 ring-blue-500' : ''}
                  ${isFocused && !isSelected ? 'ring-2 ring-blue-400' : ''}
                `}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const timeSlots = selectedDate ? getTimeSlots(selectedDate) : [];
  const selectedTime = selectedDate ? getSelectedTimeForDate(selectedDate) : null;

  return (
    <Card className="max-w-6xl mx-auto p-8 bg-white rounded-lg border border-gray-200">
      <div className="flex gap-12">
        {/* Left Pane - Date Selection */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-black mb-2">3x 9:16's to TT & IG</h1>
                <p className="text-gray-600 text-sm">
                  {selectedSlots.length === maxSlots 
                    ? `${selectedSlots.length} slots selected - all slots selected`
                    : `${selectedSlots.length} slot${selectedSlots.length !== 1 ? 's' : ''} selected - select ${remainingSlots} more slot${remainingSlots !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
              <div className="text-right text-sm text-gray-600">
                {selectedSlots.map((slot, index) => (
                  <div key={index}>
                    {slot.dateString} - {slot.time}
                    {index < selectedSlots.length - 1 && ','}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendars */}
          <div className="flex gap-12 mb-12">
            {renderCalendar(currentDate.getMonth(), currentDate.getFullYear())}
            {renderCalendar(currentDate.getMonth() + 1, currentDate.getFullYear())}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={clearSlots}
              className="text-black underline hover:no-underline text-sm transition-all"
            >
              Clear slots
            </button>
            <Button
              onClick={saveSlots}
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-medium"
              disabled={selectedSlots.length !== maxSlots}
            >
              Save Slots
            </Button>
          </div>
        </div>

        {/* Right Pane - Time Availability */}
        <div className="w-72">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-black mb-2">9:16 availabilities</h2>
            <p className="text-gray-600 text-sm">
              {selectedDate ? formatDate(selectedDate) : 'Select a date'}
            </p>
          </div>

          {selectedDate && (
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`
                    w-full p-4 rounded-lg border-2 transition-all duration-200 text-center
                    ${selectedTime === slot.time
                      ? 'bg-blue-50 border-blue-400 text-blue-600'
                      : slot.available
                        ? 'bg-blue-50 border-blue-200 text-blue-600 hover:border-blue-300'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="font-medium text-base">{slot.time}</div>
                  {!slot.available && (
                    <div className="text-xs text-gray-400 mt-1">Not available</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BookingInterface;

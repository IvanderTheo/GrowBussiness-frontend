import { generateDate, months } from "../helper/calendar";
import cn from "../helper/cn";
import dayjs from "dayjs";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useState } from "react";

export const Calendar = ({schedule}) => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const currentDate = dayjs();
    const [today, setToday] = useState(currentDate);
    const [showPopup, setShowPopup] = useState(false);

    //tandai schedul
    const getStatusClass = (date) => {
        //cari tanggal yang sama
        const matchedSchedule = schedule.find((item) => 
            dayjs(item.start_datetime).isSame(date, "day")
        );

        if (!matchedSchedule) return "";

        switch (matchedSchedule.status) {
            case "ongoing":
                return "bg-yellow-400";

            case "pending":
                return "bg-blue-400";

            case "completed":
                return "bg-green-400";

            case "cancelled":
                return "bg-red-400";

            default:
                return "";
        }
    };

    return (
        <div className="px-6 py-2 flex gap-10 justify-center items-center text-white">
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold">
                        {months[today.month()]} {today.year()}
                    </h1>
                    {/* arrow pindah tanggal */}
                    <div className="flex items-center gap-4">
                        <SlArrowLeft
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => setToday(today.subtract(1, "month"))}
                        />

                        <SlArrowRight
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => setToday(today.add(1, "month"))}
                        />
                    </div>
                </div>
                {/* hari */}
                <div className="w-full grid grid-cols-7 text-gray-400">
                    {days.map((day, index) => (
                        <h1
                            key={index}
                            className="h-14 grid place-content-center text-sm"
                        >
                            {day}
                        </h1>
                    ))}
                </div>

                {/* tanggal */}
                <div className="w-full h-full grid grid-cols-7">
                    {generateDate(today.month(), today.year()).map(
                        ({ date, currentMonth, isToday }, index) => (
                            <div key={index} className="h-14 place-items-center">
                                <h1
                                    className={cn(
                                        currentMonth ? "" : "text-gray-400",
                                        isToday ? "bg-[#504F4F]" : "",
                                        getStatusClass(date), //tandai schedul
                                        "h-10 w-full grid place-content-center rounded-2xl"
                                    )}
                                >
                                    {date.date()}
                                </h1>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
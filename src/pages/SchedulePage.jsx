import { Calendar } from "../components/Calendar"

//assests
import { FaDotCircle } from "react-icons/fa";

export const SchedulePage = () => {
    return (
        <section className="flex gap-6 px-4">
            <div className="flex flex-col basis-2/3 gap-4">
                {/* calendar */}
                <div className="custom-bg-color rounded-xl">
                    <Calendar/>
                </div>
                {/* activity */}
                <div className="rounded-xl flex flex-col custom-bg-color px-6 py-2 h-[27vh]">
                    <h1 className="font-bold text-xl text-white">Activity Status</h1>
                    {/* detail activity */}
                    <div className="custom-bg-color flex gap-3">
                        {/* planned */}
                        <div className="basis-1/3 flex flex-col gap-2">
                            <div className="flex gap-2 items-center text-white font-semibold">
                                <FaDotCircle className="fill-white"/>
                                <h2>Planned</h2>
                            </div>
                            {/* detail max 2 */}
                            <div className="flex-flex-col gap-2 bg-[#535353] px-4 py-1">
                                <h3 className="font-bold text-white">
                                    Title
                                </h3>
                                <p className="text-gray-300">tanggal</p>
                            </div>
                        </div>
                        {/* ongoing */}
                        <div className="basis-1/3 flex flex-col gap-2">
                            <div className="flex gap-2 items-center text-orange-500 font-semibold">
                                <FaDotCircle className="fill-orange-500"/>
                                <h2>In Progress</h2>
                            </div>
                            {/* detail */}
                            <div className="flex-flex-col gap-2 bg-[#535353] px-4 py-1">
                                <h3 className="font-bold text-orange-500">
                                    Title
                                </h3>
                                <p className="text-gray-300">tanggal</p>
                            </div>
                        </div>
                        {/* completed */}
                        <div className="basis-1/3 flex flex-col gap-2">
                            <div className="flex gap-2 items-center text-green-500 font-semibold">
                                <FaDotCircle className="fill-green-500"/>
                                <h2>Completed</h2>
                            </div>
                            {/* detail */}
                            <div className="flex-flex-col gap-2 bg-[#535353] px-4 py-1">
                                <h3 className="font-bold text-green-500 line-through">
                                    Title
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="basis-1/3"></div>
        </section>
    )
}
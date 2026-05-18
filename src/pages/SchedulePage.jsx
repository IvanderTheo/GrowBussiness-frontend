import { useState, useEffect } from "react";
import { Calendar } from "../components/Calendar";
import { usersAPI } from '../services/api';

//assests
import { FaDotCircle,FaRegSave } from "react-icons/fa";
import Swal from 'sweetalert2'

//helper
import { formatTanggalId } from "../helper/format-tanggal-id";
import { formatUntukInputDate } from '../helper/input-date'

export const SchedulePage = () => {
    const [schedule, setSchedule] = useState([]);
    const [isLoading,setIsloading] = useState(false);
    //enable endtime
    const [isEndTime, setIsEndTime] = useState(false);
    // popup
    const [selectedId, setSelectedId] = useState(null);
    //edit schedule
    const [editSchedule, setEditSchedule] = useState({
        title:'',
        description: '',
        start_datetime: null,
        end_datetime: null,
    })
    
    //form activity
    const [form, setForm] = useState({
        title: '',
        description: '',
        start_datetime: null,
        end_datetime: null,
    });
    useEffect(() => {
        fetchSchedule();
        //set interval
        const interval = setInterval(() => {
            fetchSchedule(); 
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchSchedule = async () =>{
        try {
            const response = await usersAPI.getSchedule();
            setSchedule(response.data.data);
        } catch (error) {
            console.log(error);
        }

    }
    //edit activity
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    // change activity
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const [error, setError] = useState({
        end_datetime: '',
    });

    //submit edit activity
    const handleAcivitySubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const response = await usersAPI.putSchedule({
                title: editSchedule.title,
                description: editSchedule.description,
                start_datetime: editSchedule.start_datetimem,
                end_datetime: editSchedule.end_datetime
            });
            if (response.status===201) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    title: response.data.status,
                    icon: 'success',
                    showConfirmButton: false,
                    timer:3000,
                    timerProgressBar:true,
                })
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    title: 'store failed',
                    icon: 'error',
                    showConfirmButton: false,
                    timer:3000,
                    timerProgressBar:true,
                })
            }
            fetchSchedule();
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                title: 'store failed',
                icon: 'error',
                showConfirmButton: false,
                timer:3000,
                timerProgressBar:true,
            })
            console.log(error);
        } finally {
            setIsloading(false);
        }
    }
    //submit activity
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({
            end_datetime: ''
        });
        if (form.end_datetime) {
            const start = new Date(form.start_datetime);
            const end = new Date(form.end_datetime);

            if (start.getTime() === end.getTime()) {
                setError(prev => ({
                    ...prev,
                    end_datetime: 'End Date must be different'
                }));
                return;
            }
        }
        setIsloading(true);
        try {
            const response = await usersAPI.postSchedule({
                title: form.title,
                description: form.description,
                start_datetime: form.start_datetime,
                end_datetime: form.end_datetime,
            });
            if (response.status===201) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    title: response.data.status,
                    icon: 'success',
                    showConfirmButton: false,
                    timer:3000,
                    timerProgressBar:true,
                })
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    title: 'store failed',
                    icon: 'error',
                    showConfirmButton: false,
                    timer:3000,
                    timerProgressBar:true,
                })
            }
            fetchSchedule();
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                title: 'store failed',
                icon: 'error',
                showConfirmButton: false,
                timer:3000,
                timerProgressBar:true,
            })
            console.log(error);
        } finally {
            setIsloading(false);
        }
    }

    return (
        <section className="flex gap-6 px-4">
            <div className="flex flex-col basis-2/3 gap-4">
                {/* calendar */}
                <div className="custom-bg-color rounded-xl">
                    <Calendar schedule={schedule}/>
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
                            {schedule
                            .filter((item)=>item.status==="pending") 
                            .slice(0,2)
                            .map((item)=>(
                                <div key={item.id}>
                                    <button
                                    onClick={(e)=>setSelectedId(item.id)}
                                    className="rounded-2xl flex flex-col gap-1 bg-[#535353] px-4 py-1 cursor-pointer w-full items-start justify-start">
                                        <h3 className="font-bold text-white">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-300">
                                            {formatTanggalId(item.start_datetime)}
                                        </p>
                                    </button>
                                    {selectedId === item.id && (
                                        <div 
                                        className="rounded-2xl p-4 bg-[#535353] popup">
                                            <form className="flex flex-col gap-2 text-white" onSubmit={handleAcivitySubmit}>
                                                <label htmlFor="edit_title">Title</label>
                                                <input
                                                id="edit_title"
                                                name="edit_title"
                                                value={item.title}
                                                type='text'
                                                onChange={handleEditChange}/>
                                                <label htmlFor="edit_description">description</label>
                                                <input
                                                id="edit_description"
                                                name="edit_description"
                                                value={item.description}
                                                type='text'
                                                onChange={handleEditChange}/>
                                                <label htmlFor="edit_start_datetime">Start Datetime</label>
                                                <input
                                                type='date'
                                                id="edit_start_datetime"
                                                name="edit_start_datetime"
                                                value={formatUntukInputDate(item.start_datetime)}
                                                onChange={handleEditChange}/>
                                                {item.end_datetime && (
                                                    <>
                                                    <label htmlFor="edit_end_datetime">End Datetime</label>
                                                    <input
                                                    type='date'
                                                    id="edit_end_datetime"
                                                    name="edit_end_datetime"
                                                    value={formatUntukInputDate(item.end_datetime)}
                                                    onChange={handleEditChange}/>
                                                    </>
                                                )}
                                                <div className="flex flex-row justify-between gap-2">
                                                    <button className="bg-green-500 w-full rounded-2xl" type='submit'>Save</button>
                                                    <button className="bg-yellow-500 w-full rounded-2xl" onClick={(e)=>setSelectedId(null)}>Close</button>
                                                    <button className="bg-red-500 w-full rounded-2xl" onClick={(e)=>setSelectedId(null)}>Cancel</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* ongoing */}
                        <div className="basis-1/3 flex flex-col gap-2">
                            <div className="flex gap-2 items-center text-yellow-500 font-semibold">
                                <FaDotCircle className="fill-yellow-500"/>
                                <h2>In Progress</h2>
                            </div>
                            {/* detail */}
                            {schedule
                            .filter((item)=>item.status==="ongoing") 
                            .slice(0,2)
                            .map((item)=>(
                                <button
                                key={item.id}
                                onMouseEnter={()=>setShowPopup(true)}
                                onMouseLeave={()=>setShowPopup(false)}
                                onClick={() => setShowPopup(!showPopup)}
                                className="rounded-2xl flex flex-col gap-1 bg-yellow-500 px-4 py-1 cursor-pointer w-full items-start justify-start">
                                    <h3 className="font-bold text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500">
                                        {formatTanggalId(item.start_datetime)}
                                    </p>
                                </button>
                            ))}
                        </div>
                        {/* completed */}
                        <div className="basis-1/3 flex flex-col gap-2">
                            <div className="flex gap-2 items-center text-green-500 font-semibold">
                                <FaDotCircle className="fill-green-500"/>
                                <h2>Completed</h2>
                            </div>
                            {/* detail */}
                            {schedule
                            .filter((item)=>item.status==="completed") 
                            .slice(0,2)
                            .map((item)=>(
                                <button
                                key={item.id}
                                onMouseEnter={()=>setShowPopup(true)}
                                onMouseLeave={()=>setShowPopup(false)}
                                onClick={() => setShowPopup(!showPopup)}
                                className="rounded-2xl flex-flex-col gap-2 bg-green-500 px-4 py-1">
                                    <h3 className="font-bold text-white line-through">
                                        {item.title}
                                    </h3>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* add schedule */}
            <div className="basis-1/3 flex flex-col gap-2">
                {/* today schedul */}
                <div className="overflow-auto scrollbar-none custom-bg-color flex flex-col gap-2 w-full h-[33vh] rounded-2xl text-white p-4">
                    <h2 className="font-bold text-2xl">Today</h2>
                    {schedule
                        .filter((item)=>item.status==="ongoing")
                        .map((item)=>(
                            <div 
                            key={item.id}
                            className="flex flex-col gap-1">
                            <h3 className="text-xl">
                                {item.title}
                            </h3>
                            <div className="text-gray-500 flex gap-1">
                                <p className="text-gray-500">
                                    {new Date(item.start_datetime)
                                        .getHours()
                                        .toString()
                                        .padStart(2, '0')}
                                    :
                                    {new Date(item.start_datetime)
                                        .getMinutes()
                                        .toString()
                                        .padStart(2, '0')}
                                </p>
                                <p>-</p>
                                {item.end_datetime && (
                                    <p className="text-gray-500">
                                        {new Date(item.end_datetime)
                                            .getHours()
                                            .toString()
                                            .padStart(2, '0')}
                                        :
                                        {new Date(item.end_datetime)
                                            .getMinutes()
                                            .toString()
                                            .padStart(2, '0')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {/* add schedule */}
                <div className="h-[54vh] scrollbar-none overflow-auto custom-bg-color flex flex-col gap-2 w-full rounded-2xl text-white p-4">
                    <h2 className="font-bold text-2xl">Add Activity</h2>
                    <form className="flex flex-col gap-2"
                        onSubmit={handleSubmit}>
                        <label htmlFor='title' className="text-xl">Title</label>
                        <input
                            id='title'
                            name='title'
                            type="text"
                            placeholder="Activity name.."
                            className="bg-[#343434] rounded-2xl p-2"
                            value={form.title}
                            required
                            onChange={handleInputChange}/>
                        <label htmlFor='start-datetime' className="text-xl">Date</label>
                        <input
                            id='start-datetime'
                            name='start_datetime'
                            type="date"
                            placeholder="Select date"
                            className="bg-[#343434] rounded-2xl p-2"
                            required
                            onChange={handleInputChange}/>
                        {/* end time */}
                        <div className="flex gap-2 items-center">
                            <input
                                id='enable-end-datetime'
                                type="checkbox"
                                checked={isEndTime}
                                onChange={(e) => setIsEndTime(e.target.checked)}/>
                            <label htmlFor="enable-end-datetime">Enable End Date</label>
                        </div>
                        {isEndTime && (
                            <div className="flex flex-col gap-2">
                                <label htmlFor='end-datetime' className="text-xl">End Date</label>
                            <input
                                id='end-datetime'
                                name='end_datetime'
                                type="date"
                                placeholder="Select date"
                                value={form.end_datetime}
                                className="bg-[#343434] rounded-2xl p-2"
                                onChange={handleInputChange}/>
                                {error.end_datetime && <p className="text-red-500">{error.end_datetime}</p>}
                            </div>
                        )}
                        <label htmlFor='description' className="text-xl">Description</label>
                        <input
                            id='description'
                            name="description"
                            value={form.description}
                            type="text"
                            placeholder="Write description here"
                            className="bg-[#343434] rounded-2xl p-2"
                            required
                            onChange={handleInputChange}/>
                        <button 
                            type="submit"   
                            disabled={isLoading}
                            className="font-light mt-2 py-1 rounded-2xl text-xl bg-[#343434] flex flex-row items-center justify-center gap-6 cursor-pointer">
                            {isLoading ? (
                                'Storing...'
                            ) : (
                                <>
                                    <FaRegSave />
                                    Save
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
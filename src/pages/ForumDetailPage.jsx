import {useEffect, useState, useRef} from 'react'
import { publicApi } from '../services/api'
import { useParams } from "react-router-dom";

import searchIcon from "../assets/search.svg";
import userIcon from "../assets/user.svg"
import sendIcon from '../assets/sent.svg'

// helper tanggal
const formatTanggalId = (isoString) => {
  if (!isoString) return '-';
  const dateObj = new Date(isoString);
  
  // Menggunakan standar lokalisasi Indonesia (id-ID)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(dateObj);
};

//helper view
const formatAngka = (angka) => {
  if (!angka || isNaN(angka)) return '0';
  
  // Jika angka kurang dari 1.000, tampilkan angka biasa
  if (angka < 1000) return angka.toString();

  // Menggunakan Intl.NumberFormat dengan opsi notation: 'compact'
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1 // Menampilkan maksimal 1 angka di belakang koma (misal: 10.1k)
  }).format(angka).toLowerCase(); // .toLowerCase() agar huruf 'K' menjadi kecil 'k'
};


export const ForumDetailPage = () => {
    const { id } = useParams();
    const [forum, setForum] = useState(null);
    const [comment,setComment] = useState([]);

    // handle text area
    const textareaRef = useRef(null); 
    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
        textarea.style.height = 'auto'; // Reset tinggi
        textarea.style.height = `${textarea.scrollHeight}px`; // Atur sesuai isi teks
        }
    };
    useEffect(() => {
        if (id) {
            fetchForumDetail();
        }
    }, [id]);

    const fetchForumDetail = async () => {
        try {
            const response = await publicApi.getForumDetail(id);
            setForum(response.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className='flex flex-row p-6 gap-6'>
            <div className='basis 1/4 flex flex-col gap-6'>
                <div className='custom-bg-color text-gray-300 outline-1 outline-white rounded-xl px-4 py-2'>
                    {forum && (
                        <div>
                            <p>Date Posted: {formatTanggalId(forum.created_at)}</p>
                            <p>View: {formatAngka(forum.views)}</p>
                        </div>
                    )}
                </div>
                {/* search */}
                <form>
                <div className="relative w-full max-w-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <img src={searchIcon}/>
                    </div>
                    <input
                        type="search"
                        placeholder="Type the topic title here"
                        className="focus:outline-none focus:ring-1 block w-full pl-10 pr-3  rounded-xl outline-1 outline-white bg-[#474646] p-2 placeholder-white"/>
                    </div>
                </form>
            </div>
            <div className='basis 3/4 flex flex-1 flex-col gap-6'>
                {/* forum detail */}
                <div className='custom-bg-color flex flex-col gap-4 px-4 py-2 min-h-[35vh] rounded-xl outline-1 outline-white'>
                    <div className='flex flex-row gap-2'>
                        {/* user */}
                        <img src={userIcon} alt="user icon"/>
                        {forum && (
                            <div className='text-white'>
                                <h3 className='text-xl'><strong>{forum.user?.first_name} {forum.user?.last_name}</strong></h3>
                                <p>created at {formatTanggalId(forum.user?.created_at)}</p>
                            </div>
                        )}
                    </div>
                    {/* forum content */}
                    {forum && (
                        <div>
                            <h2 className='text-white text-3xl font-bold'>
                                {forum.title}
                            </h2>
                            <p className='text-gray-300 break-all'>
                                {forum.content}
                            </p>
                        </div>
                    )}
                </div>
                {/* paginate */}
                <div className=' px-4 py-2 text-gray-300 flex flex-row justify-between bg-[#1E1E1E]'>
                    <p>Showing 1-15 of 100 comments</p>
                    <p>1 2 3 4 5 6</p>
                </div>
                {/* create comment */}
                <div className=' text-gray-300 flex flex-row justify-between bg-[#1E1E1E]'>
                    <form className='w-full'>
                        <div className='flex flex-row'>
                            <textarea
                                ref={textareaRef}
                                onInput={handleInput}
                                placeholder="Type your comment here..."
                                rows={1}
                                className="w-full px-4 py-2 break-all resize-none overflow-hidden min-h-[40px]"
                            />
                            <button>
                                <img src={sendIcon} alt='send icon' className='px-4 py-2'/>
                            </button>
                        </div>
                    </form>
                </div>
                {/* comment */}
                {forum?.comments?.map((comment) => (
                    <div 
                    key={comment.id}
                    className='custom-bg-color flex flex-col gap-4 px-4 py-2 rounded-xl outline-1 outline-white'>
                        <div className='flex flex-row gap-2 items-center'>
                            <img src={userIcon} alt="user icon" className='w-[4vh] h-[4vh]'/>
                            <div className='text-white'>
                                <h3 className='text-xl'>{comment.user?.first_name}</h3>
                                <p>{formatTanggalId(comment.created_at)}</p>
                            </div>
                        </div>
                        <p className='text-gray-300 break-all'>{comment.comment}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
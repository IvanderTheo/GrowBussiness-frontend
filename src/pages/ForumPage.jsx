import { useEffect, useState } from "react";
import { publicApi, usersAPI } from "../services/api";
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

//assets
import searchIcon from "../assets/search.svg";
import userIcon from "../assets/user.svg";
import { FaPlus } from "react-icons/fa";
import Swal from 'sweetalert2'

//helper
import { formatTanggalId } from "../helper/format-tanggal-id";
import { formatAngka } from "../helper/format-view";
import forumService from "../services/forumService";

export const ForumPage = () => {

    const isAuthenticated = useAuth();
    const [category,setCategory] = useState([]);
    const [forum, setForum] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        content: '',
        category_id: ''
    })
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(()=>{
        const categorySub =
            forumService.category$
            .subscribe(setCategory);

        const forumSub =
            forumService.forum$
            .subscribe(setForum);

        const selectedSub =
            forumService.selectedCategory$
            .subscribe(setSelectedCategory);

        forumService.fetchCategory();

        return ()=>{

            categorySub.unsubscribe();
            forumSub.unsubscribe();
            selectedSub.unsubscribe();

        }

    },[]);

    //handle detail forum
    const handleDetailForum = (id) => {
        try {
            console.log(id);
            navigate(`/forum/${id}`);
        } catch (error) {
            console.log(error);
        }
    }
    
    //limit content
    const maxContent = 20;

    //create forum
    const handleShowPopup = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setShowPopup(true);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "category_id"
                    ? Number.parseInt(value)
                    : value
        }));
    };
    const [error, setError] = useState({
        title:'',
        content:'',
        category:''
    });
    const handlePostForum = async(e) => {
        e.preventDefault();
        setError({
            title:'',
            content:'',
            category_id:''
        })
        
        setIsLoading(true);
        try {
            console.log('[COMPONENT] Posting new forum...');
            const response = await forumService.postForum(form);
            Swal.fire({
                toast: true,
                position: 'top-end',
                title: 'Forum created successfully',
                icon: 'success',
                showConfirmButton: false,
                timer:3000,
                timerProgressBar:true,
            });
            console.log('[COMPONENT] Forum posted');
            setForm({
                title: '',
                content: '',
                category_id: ''
            });
            setShowPopup(false);
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                title: 'store failed',
                icon: 'error',
                showConfirmButton: false,
                timer:3000,
                timerProgressBar:true,
            });
            console.error('[COMPONENT] Error posting forum:', error.message);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <section className='flex flex-row p-6 gap-6'>
            <div className="flex flex-col gap-6">
                {/* search */}
                <div className="bg-[#252424] px-4 py-2 rounded-2xl outline-1 outline-white flex flex-col gap-2">
                    <h3 className="text-white text-2xl"><strong>Search</strong></h3>
                    {/* search */}
                    <form>
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <img src={searchIcon} alt="search icon"/>
                            </div>
                            <input
                            type="search"
                            placeholder="Type the topic title here"
                            className="focus:outline-none focus:ring-1 block w-full pl-10 pr-3  rounded-2xl outline-1 outline-white bg-[#474646] p-2 placeholder-white"/>
                        </div>
                    </form>
                </div>
                {/* categories */}
                <div className="bg-[#252424] px-4 py-2 rounded-2xl outline-1 outline-white gap-2 h-[35vh] flex flex-col overflow-y-auto custom-scroll">
                    <h3 className="text-white text-2xl"><strong>Categories</strong></h3>
                    {category.map((category) => (
                        <div key={category.id}>
                            <button
                            className={
                                selectedCategory?.id===category.id
                                ? "bg-gray-700 cursor-pointer w-full rounded-2xl px-2"
                                : "cursor-pointer w-full px-2"}
                            onClick={()=>
                                forumService
                                .selectCategory(category)
                            }
                            ><p className="truncate text-white text-start text-xl">{category.name}</p></button>
                            <hr className="border-t border-white"></hr>
                        </div>
                    ))}
                </div>
                {/* trending topics */}
                <div className="bg-[#252424] px-4 py-2 rounded-2xl outline-1 outline-white gap-4 text-white">
                    <h3 className="text-white text-2xl"><strong>Global Trending topics</strong></h3>
                    <p><strong>#AIAdvantage</strong></p>
                    <p>🔥 4.2k active | <span className="text-green-500">+18%</span> hourly</p>
                    <p><strong>#GlobalScaling</strong></p>
                    <p>📈 2.8k insight | Trending Global</p>
                    <p><strong>#FutureProof</strong></p>
                    <p>🌟 1.5k new | High Engagement</p>
                </div>
            </div>
            {/* forum */}
            <div className="flex-1 h-[82vh] bg-[#252424] rounded-2xl text-white outline-1 outline-white overflow-y-auto custom-scroll">
                {/* forum based on category */} 
                <h2 className="px-6 py-2 text-2xl font-bold">
                    {selectedCategory?.name}
                </h2>
                <hr className="border-t border-white"></hr>
                {/* forum */}
                <div>
                    {forum.map((item) => {
                        if (!item) return null;
                        return (
                            <div key={item.id} className="flex flex-col">
                                <div
                                    className="bg-[#1d1d1d] rounded-xl flex flex-row">
                                    <div className="flex flex-col basis-1/4 py-2">
                                        <button 
                                            onClick={() => handleDetailForum(item.id)}
                                            className="text-left cursor-pointer pl-6 font-bold text-lg focus:outline-none"
                                        >
                                            {item.title}
                                        </button>
    
                                        <button onClick={() => handleDetailForum(item.id)} 
                                            className="text-left cursor-pointer pl-6 text-base text-gray-500 focus:outline-none"
                                        >
                                            {item.content && item.content.length > maxContent
                                            ? `${item.content.substring(0, maxContent)}...`
                                            : item.content}
                                        </button>
                                    </div>
                                    <div className="flex flex-row justify-end basis-3/4 items-center gap-6 pr-8">
                                        <p className="text-gray-500">views: <strong className="text-white">{formatAngka(item.views)}</strong></p>
                                        <p className="text-gray-500">created: <span>{formatTanggalId(item.created_at)}</span></p>
                                        <p className="flex flex-row gap-2"><img src= {userIcon} alt="user icon"/>{item.user?.first_name}</p>
                                    </div>
                                </div>
                                <hr className="border-t border-white"></hr>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* add forum */}
            <div className="absolute bottom-20 right-20">
                <button 
                type="button"
                onClick={handleShowPopup}
                className="rounded-full bg-[#474646] min-h-[8vh] min-w-[8vh] flex justify-center items-center cursor-pointer">
                    <FaPlus className="min-h-[4vh] min-w-[4vh] fill-white"/>
                </button>
            </div>
            {showPopup && (
                <form 
                onSubmit={handlePostForum}
                className="flex flex-col rounded-2xl p-4 popup bg-[#252424] gap-2 outline-1 outline-white min-w-[100vh]">
                    <h2 className="text-white text-2xl font-bold">Post Forum</h2>
                    <label htmlFor="title">Title:</label>
                    <input
                    id="title"
                    name="title"
                    placeholder="Info RTX"
                    value={form.title}
                    type="text"
                    required
                    onChange={handleInputChange}/>
                    <label htmlFor="content">Content:</label>
                    <textarea
                    id="content"
                    name="content"
                    placeholder="berapa ya harga rtx sekarang"
                    value={form.content}
                    onChange={handleInputChange}
                    required
                    className="scrollbar-none rounded-2xl text-white p-2 outline-2 outline-gray-500"/>
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category_id"
                        value={form.category_id}
                        onChange={handleInputChange}
                        className="text-white rounded-2xl outline-2 outline-gray-500 p-2"
                    >
                        <option value="">
                            Pilih kategori
                        </option>

                        {category.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                                className="bg-[#252424] text-white"
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex flex-row gap-2 w-full justify-between">
                        <button 
                        disabled={isLoading}
                        className="w-full bg-green-500 rounded-2xl text-white cursor-pointer py-2" 
                        type="submit">
                            {isLoading ? 'Posting' : 'Post'}
                        </button>
                        <button
                        disabled={isLoading}
                        className="w-full bg-yellow-500 rounded-2xl text-white cursor-pointer py-2" 
                        type="button" 
                        onClick={(e)=>(setShowPopup(false))}>Cancel</button>
                    </div>
                </form>
            )}
        </section>
    )
}
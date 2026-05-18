import { useEffect, useState } from "react";
import { publicApi } from "../services/api";
import {useNavigate} from 'react-router-dom';

//assets
import searchIcon from "../assets/search.svg";
import userIcon from "../assets/user.svg";

//helper
import { formatTanggalId } from "../helper/format-tanggal-id";
import { formatAngka } from "../helper/format-view";

export const ForumPage = () => {

    const [category,setCategory] = useState([]);
    const [forum, setForum] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchCategory();
    }, []);

    //fetch category
    const fetchCategory = async () => {
        try {
            const response = await publicApi.getForumCategory();
            const categoriesData = response.data.data;

            setCategory(categoriesData);

            //pilih category pertama
            if (categoriesData.length > 0) {

                const firstCategory = categoriesData[0];

                setSelectedCategory(firstCategory);

                fetchForum(firstCategory.slug);

            }
        } catch (error) {
            console.log(error);
        }
    }

    //handle detail forum
    const handleDetailForum = (id) => {
        try {
            console.log(id);
            navigate(`/forum/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

    //fetch forum
    const fetchForum = async (slug) => {
        try {
            const response = await publicApi.getForum(slug);
            setForum(response.data.data.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    //limit content
    const maxContent = 20;
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
                                <img src={searchIcon}/>
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
                    {category.map((category) =>(
                        <div key={category.id}>
                            <button
                            className="cursor-pointer w-full"
                            onClick={()=> {
                                setSelectedCategory(category);
                                fetchForum(category.slug);
                            }}
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
                    {forum.map((item) => (
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
                                        {item.content.length > maxContent
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
                    ))}
                </div>
            </div>
        </section>
    )
}
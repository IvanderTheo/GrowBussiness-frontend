export const Footer = () => {
    return (
        <footer id="footer" className='bg-olive-950 flex flex-col justify-center items-center p-6 gap-6'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 flex flex-col justify-start items-start text-white gap-4">
                    <h3 className="text-3xl">
                        <strong><span className="text-cyan-300">Grow</span>Business</strong>
                    </h3>
                    <p className="text-gray-500">Optimize your operations and scale your revenue with data-driven insights</p>
                </div>
                <div className="p-6 flex flex-col justify-start items-start text-white gap-4">
                    <h3>
                        <strong>features</strong>
                    </h3>
                    <ul className="list-none text-gray-500">
                        <li>AI Consultant</li>
                        <li>Business Forum</li>
                        <li>Cost  Of Goods Sold</li>
                        <li>Schedule Management</li>
                    </ul>
                </div>
                <div className="p-6 flex flex-col justify-start items-start text-white gap-4">
                    <h3>
                        <strong>Our Team</strong>
                    </h3>
                    <ul className="list-none text-gray-500">
                        <li>Ivander Theodorus</li>
                        <li>Qudwa Abyaz Ghiffara</li>
                        <li>Achdan Maulana</li>
                        <li>Arza Marevi Ketiduran</li>
                    </ul>
                </div>
                <div className="p-6 flex flex-col justify-start items-start text-white gap-4">
                    <h3>
                        <strong>Connect</strong>
                    </h3>
                    <ul className="list-none text-gray-500">
                        <li>Location: Malang, Indonesia</li>
                        <li>Qudwa Abyaz Ghiffara</li>
                        <li>support@growbusiness.com</li>
                    </ul>
                </div>
            </div>
            <p className="text-white"> © 2026 GrowBusiness. All rights reserved</p>
        </footer>
    )
}
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSection } from './context/SectionContext';

const App = () => {
    const { activeSection } = useSection();

    const getNavbarColor = () => {
        switch (activeSection) {
            case 'pricing':
                return 'bg-[#CBDCEB] text-[#133E87]';
            case 'about':
                return 'bg-[#608BC1] text-white';
            default: // includes 'features' or anything else
                return 'bg-[#133E87] text-white';
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className={`flex justify-between items-center p-6 sticky top-0 z-50 shadow-md transition-colors duration-500 ${getNavbarColor()}`}>
                <div className="text-xl font-bold">Shortly</div>
                <div className="space-x-6">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/analytics" className="hover:underline">Analytics</Link>
                </div>
            </nav>

            {/* Page Content */}
            <div className="flex-grow w-full">
                <Outlet />
            </div>

            {/* Footer */}
            <footer className="bg-[#133E87] text-white py-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 w-full">
                    <div>
                        <h3 className="font-bold mb-2">Shortly</h3>
                        <p className="text-sm">A modern link shortener built for performance and privacy.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Quick Links</h4>
                        <ul className="space-y-1 text-sm">
                            <li><Link to="/" className="hover:underline">Home</Link></li>
                            <li><Link to="/analytics" className="hover:underline">Analytics</Link></li>
                            <li><a href="#" className="hover:underline">Docs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Contact</h4>
                        <p className="text-sm">support@shortly.io</p>
                        <p className="text-sm">+91 98765 43210</p>
                    </div>
                </div>
                <div className="text-center text-sm mt-6 border-t border-white/20 pt-4 w-full">
                    © 2025 Shortly. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default App;

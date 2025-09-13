import React from 'react';
import { Users } from 'lucide-react';

const Header = () => {
    return (
        <div className="header-content">
            <div className="header-title">
                <Users className="header-icon" />
                <div>
                    <h1>Team Builder</h1>
                    <p>Find your perfect hackathon teammates based on skills and experience</p>
                </div>
            </div>
        </div>
    );
};

export default Header;

import React from 'react'
import Profile from './profile'

const Header = ({ author }) => (
    <div className="lg:w-1/3 mt-4">
        <Profile {...author} />

    </div>
)

export default Header
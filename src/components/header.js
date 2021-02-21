import React from 'react'

import Nav from './nav'
import Profile from './profile'

const Header = ({ author }) => (
    <div className="lg:w-2/5 mt-4">
        <Profile {...author} />
        <Nav />
    </div>
)

export default Header
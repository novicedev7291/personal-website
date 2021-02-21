import React from 'react'

const Layout = ({ children }) => (
    <div class="lg:w-3/4 w-full md:mx-auto">
        <div class="flex md:flex-row flex-col">
            {children}
        </div>
    </div>
)

export default Layout
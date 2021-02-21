import React from 'react'

const DefaultLayout = ({ children }) => (
    <div className="lg:w-1/2 w-full md:mx-auto">
        <div className="flex md:flex-row flex-col">
            {children}
        </div>
    </div>
)

export default DefaultLayout
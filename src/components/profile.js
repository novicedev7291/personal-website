import React from 'react'

const Profile = ({ name, shortIntro, social }) => (
    <div className="flex flex-col items-center py-4">
            <img src="https://images.unsplash.com/photo-1561463385-0e5ea0ca925b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1450&q=80" alt="Awab Husameldin" className="w-24 h-24 mb-4 rounded-full" />
            <p className="text-green-700">{name}</p>
            <p className="mt-2 text-gray-500 flex-wrap">{shortIntro}</p>
            <div className="flex mt-4">
              <a href={`https://twitter.com/${social.twitter}`}><img src="https://simpleicons.org/icons/twitter.svg" alt="my-twitter" className="mr-2 w-5 h-5" /></a>
              <a href={`https://github.com/${social.github}`}><img src="https://simpleicons.org/icons/github.svg" alt="my-github" className="ml-2 w-5 h-5" /></a>
            </div>
    </div>
)

export default Profile
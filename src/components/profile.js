import React from 'react'
import Img from 'gatsby-image'

const Profile = ({ avatar, name, shortIntro, social }) => (
    <div className="flex flex-col items-center py-4">
            <Img className="rounded-full" fixed={avatar} alt="profile-pic" />
            <p className="mt-1 text-green-700">{name}</p>
            <small className="text-gray-500">{shortIntro}</small>
            <div className="flex mt-4">
              <a href={`https://twitter.com/${social.twitter}`}><img src="https://simpleicons.org/icons/twitter.svg" alt="my-twitter" className="mr-2 w-5 h-5" /></a>
              <a href={`https://github.com/${social.github}`}><img src="https://simpleicons.org/icons/github.svg" alt="my-github" className="ml-2 w-5 h-5" /></a>
            </div>
    </div>
)

export default Profile
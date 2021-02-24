import React from "react"
import Img from "gatsby-image"

const Profile = ({ avatar, name, shortIntro, social, extraClassNames }) => {
  return <div className={`flex items-center space-x-4 p-4 ${extraClassNames && extraClassNames}`}>
      <Img className="rounded-full" fixed={avatar} alt="profile-pic" />
    <div className="flex flex-col flex-grow justify-center">
      <p className="font-medium text-gray-700 text-md">{name}</p>
      <strong className="text-gray-600 italic text-sm">{shortIntro}</strong>
      <div className="flex mt-2">
        <a href={`https://twitter.com/${social.twitter}`}>
          <img
            src="https://simpleicons.org/icons/twitter.svg"
            alt="my-twitter"
            className="mr-2 mb-0 w-5"
          />
        </a>
        <a href={`https://github.com/${social.github}`}>
          <img
            src="https://simpleicons.org/icons/github.svg"
            alt="my-github"
            className="ml-2 mb-0 w-5"
          />
        </a>
      </div>
    </div>
  </div>
}

export default Profile

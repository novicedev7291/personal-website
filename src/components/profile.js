import React from "react"
import Img from "gatsby-image"

const Profile = ({ avatar, name, shortIntro, social }) => {
  return <div classNameName="flex items-center">
    <div classNameName="rounded-full">
      <Img fixed={avatar} alt="profile-pic" />
    </div>
    <div className="flex flex-col">
      <p className="font-medium text-gray-700 text-lg">{name}</p>
      <strong className="text-gray-600 italic mt-1">{shortIntro}</strong>
      <div className="flex mt-2">
        <a href={`https://twitter.com/${social.twitter}`}>
          <img
            src="https://simpleicons.org/icons/twitter.svg"
            alt="my-twitter"
            className="mr-2 w-5 h-5"
          />
        </a>
        <a href={`https://github.com/${social.github}`}>
          <img
            src="https://simpleicons.org/icons/github.svg"
            alt="my-github"
            className="ml-2 w-5 h-5"
          />
        </a>
      </div>
    </div>
  </div>
}

export default Profile

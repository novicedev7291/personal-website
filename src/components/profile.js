import React from "react"
import Img from "gatsby-image"

const Profile = ({ avatar, name, shortIntro, social }) => (
  <div className="flex items-center">
    <div className="rounded-full">
      <Img fixed={avatar} alt="profile-pic" />
    </div>
    <div class="flex flex-col">
      <p class="font-medium text-gray-700 text-lg">{name}</p>
      <strong class="text-gray-600 italic mt-1">{shortIntro}</strong>
      <div class="flex mt-2">
        <a href={`https://twitter.com/${social.twitter}`}>
          <img
            src="https://simpleicons.org/icons/twitter.svg"
            alt="my-twitter"
            class="mr-2 w-5 h-5"
          />
        </a>
        <a href={`https://github.com/${social.github}`}>
          <img
            src="https://simpleicons.org/icons/github.svg"
            alt="my-github"
            class="ml-2 w-5 h-5"
          />
        </a>
      </div>
    </div>
  </div>
)

export default Profile

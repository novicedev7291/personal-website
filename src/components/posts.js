import React from 'react'

const Tag = ({name}) => (
    <div className="mr-1 p-0.5">{`#${name}`}</div> 
)

const Post = ({ title, date, timeToRead, excerpt, tags }) => (
    <div className="flex flex-col border-b-2 border-gray-100 p-4">
            <p className="inline-block text-gray-500 my-2 text-xl font-semibold">{title}</p>
            <div className="flex text-gray-400 mb-2">
              <small className="text-gray-400 mr-4">{date}</small>
              <small className="text-gray-400">{`${timeToRead} min read`}</small>
            </div>
            <p className="text-gray-600 mb-2">{excerpt}</p>
            <div className="flex text-green-500">
               {tags.map(tag => <Tag key={tag} name={tag} />)}
            </div>
          </div>
)

const Posts = ({ posts }) => posts.map(post => <Post key={post.id} {...post} />)

export default Posts
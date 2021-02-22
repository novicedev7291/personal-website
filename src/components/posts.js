import React from 'react'
import { Link } from 'gatsby'

const Tag = ({name}) => (
    <div className="mr-1 p-0.5">{`#${name}`}</div> 
)

const Post = ({ title, date, timeToRead, excerpt, tags, slug }) => (
    <>
      <div className="flex flex-col p-4">
            <Link className="inline-block text-gray-600 my-2 text-xl font-semibold" to={`${slug}`}>{title}</Link>
            <div className="flex text-gray-500 mb-2">
              <small className="text-gray-500 mr-4">{date}</small>
              <small className="text-gray-500">{`${timeToRead} min read`}</small>
            </div>
            <p className="text-gray-600 mb-2">{excerpt}</p>
            <div className="flex text-green-500">
               {tags.map(tag => <Tag key={tag} name={tag} />)}
            </div>
          </div>
    </>
)

const Posts = ({ posts }) => posts.map(post => <Post key={post.id} {...post} />)

export default Posts
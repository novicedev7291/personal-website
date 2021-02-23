import React from "react"
import { Link } from "gatsby"

const Tag = ({ name }) => <div className="mr-1 p-0.5">{`#${name}`}</div>

const Post = ({ title, date, timeToRead, excerpt, tags, slug }) => (
  <>
    <div className="flex flex-col space-y-1">
      <Link className="text-gray-700 font-semibold text-2xl" to={`${slug}`}>
        {title}
      </Link>
      <div className="flex space-x-8">
        <small className="text-gray-500 text-sm">{date}</small>
        <small className="text-gray-500 text-sm">{`${timeToRead} min read`}</small>
      </div>
      <p className="text-gray-600 font-medium text-md">{excerpt}</p>
      <div className="flex text-green-500 text-sm">
        {tags.map(tag => (
          <Tag key={tag} name={tag} />
        ))}
      </div>
    </div>
  </>
)

const Posts = ({ posts }) =>
  posts.map(post => (
    <div className="p-2 mt-8">
      <div className="w-full space-y-8">
        <Post key={post.id} {...post} />;
      </div>
    </div>
  ))

export default Posts

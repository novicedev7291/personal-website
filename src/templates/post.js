import React, { useEffect } from "react"

import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import ReactMarkdown from "react-markdown"

import "prismjs/themes/prism-solarizedlight.css"
import "../styles/markdown.css"

import Prism from "prismjs"
import ProfileContainer from "../components/profile-container"
import Hr from "../components/hr"
import Seo from "../components/seo"

const SubHeading = ({ text, otherClasses }) => (
  <p className={`font-medium text-gray-500 text-sm ${otherClasses}`}>{text}</p>
)

const PostTemplate = ({ data }) => {
  const {
    excerpt,
    rawMarkdownBody,
    frontmatter: { title, date },
    timeToRead,
  } = data.markdownRemark

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <Layout>
      <Seo title={title} description={excerpt} />
      <div className="flex flex-col space-y-4 mt-4 px-2">
        <h1 className="text-2xl font-medium text-gray-600">{title}</h1>
        <div className="flex">
          <SubHeading text={date} otherClasses="mr-4" />
          <SubHeading text={`${timeToRead} min read`} />
        </div>
        <ReactMarkdown className="flex flex-col markdown space-y-4">
          {rawMarkdownBody}
        </ReactMarkdown>
      </div>
      <div className="mt-4">
        <Hr />
        <ProfileContainer extraClassNames={`my-4`} />
      </div>
      <div className="px-4 pb-4">
        <Link
          className="text-gray-600 font-semibold text-sm"
          to="/"
        >{`<- Back`}</Link>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query PostById($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      excerpt
      rawMarkdownBody
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        author
        tags
      }
      timeToRead
    }
  }
`

export default PostTemplate

import React, {useEffect} from 'react'

import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Main from '../components/main'
import ReactMarkdown from 'react-markdown'

import 'prismjs/themes/prism-solarizedlight.css'
import '../styles/markdown.css'

import Prism from 'prismjs'
import HeaderInfo from '../components/headerInfo'

const SubHeading = ({ text,otherClasses }) => (
  <p className={`font-medium text-gray-500 text-sm ${otherClasses}`}>{text}</p> 
)

const PostTemplate = ({data, location}) => {
    const { rawMarkdownBody, frontmatter: { title, date }, timeToRead } = 
                        data.markdownRemark
    
    useEffect(() => {
        Prism.highlightAll()
    }, [])

    return <Layout>
        <HeaderInfo />
        <Main>
            <div className="flex flex-col pt-8 space-y-4">
                <h1 className="text-3xl font-medium text-gray-600">{title}</h1>
                <div className="flex">
                    <SubHeading text={date} otherClasses="mr-4" />
                    <SubHeading text={`${timeToRead} min read`} />
                </div>
                <ReactMarkdown className="flex flex-col markdown space-y-4">{rawMarkdownBody}</ReactMarkdown>
            </div>
        </Main>
    </Layout>
}

export const pageQuery = graphql`
    query PostById($id: String!) {
        markdownRemark(id: { eq: $id }) {
            id,
            excerpt,
            rawMarkdownBody,
            frontmatter {
                title,
                date(formatString: "MMMM DD, YYYY"),
                author,
                tags
            },
            timeToRead
        }
    }
`

export default PostTemplate
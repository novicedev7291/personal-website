import React, {useEffect} from 'react'

import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Header from '../components/header'
import Main from '../components/main'
import ReactMarkdown from 'react-markdown'

import 'prismjs/themes/prism-solarizedlight.css'

import Prism from 'prismjs'

const PostTemplate = ({data, location}) => {
    const author = data.site.siteMetadata.author

    const { rawMarkdownBody, frontmatter: { title, date }, timeToRead } = 
                        data.markdownRemark
    
    const avatar = data.file.childImageSharp.fixed

    useEffect(() => {
        Prism.highlightAll()
    }, [])

    return <Layout>
        <Header author={{...author, avatar}} />
        <Main>
            <div className="flex flex-col md:max-w-lg max-w-full p-8 space-y-4">
                <h1>{title}</h1>
                <div className="flex">
                    <p>{date}</p>
                    <p>{`${timeToRead} min read`}</p>
                </div>
                <ReactMarkdown>{rawMarkdownBody}</ReactMarkdown>
            </div>
        </Main>
    </Layout>
}

export const pageQuery = graphql`
    query PostById($id: String!) {
        site {
            siteMetadata {
              title,
              description,
              author {
                name,
                shortIntro,
                about,
                contact,
                social {
                  twitter,
                  github
                }
              }
            }
        }
        file(relativePath: { eq: "profile-pic.JPG"}) {
            childImageSharp {
              fixed(width: 100, height: 100, quality:90) {
                ...GatsbyImageSharpFixed
              }
            }
          }
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
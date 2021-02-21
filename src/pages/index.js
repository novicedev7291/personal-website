import React from 'react'

import { graphql } from 'gatsby'


import Layout from '../components/layout'
import Header from '../components/header'
import Main from '../components/main'
import Posts from '../components/posts'

const IndexPage = ({ data, location }) => {
  const postEdges = data.allMarkdownRemark.edges

  const author = data.site.siteMetadata.author
  const avatar = data.file.childImageSharp.fixed

  const posts = postEdges.map(edge => {
    const node = edge.node
    return {
      id: node.id,
      excerpt: node.excerpt,
      title: node.frontmatter.title,
      author: node.frontmatter.author,
      date: node.frontmatter.date,
      tags: node.frontmatter.tags.split(','),
      timeToRead: node.timeToRead,
      slug: node.slug
    }
  })

  return <Layout>
    <Header author={{...author, avatar}} />
    <Main>
      <Posts posts={posts} />
    </Main>
  </Layout>
}

export default IndexPage

export const pageQuery = graphql`
  query {
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
    allMarkdownRemark (
      sort: { fields: [frontmatter___date], order: DESC },
      limit: 10
    )
    {
      edges {
        node {
          id,
          excerpt,
          fields {
            slug
          },
          frontmatter {
            title,
            author,
            date(formatString: "MMMM DD, YYYY"),
            tags
          },
          timeToRead
        }
      }
    }
  }
`

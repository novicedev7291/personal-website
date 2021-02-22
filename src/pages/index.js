import React from 'react'

import { graphql } from 'gatsby'


import Layout from '../components/layout'
import Main from '../components/main'
import Posts from '../components/posts'
import HeaderInfo from '../components/headerInfo'

const IndexPage = ({ data, location }) => {
  const postEdges = data.allMarkdownRemark.edges

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
      slug: node.fields.slug
    }
  })

  return <Layout>
    <HeaderInfo />
    <Main>
      <Posts posts={posts} />
    </Main>
  </Layout>
}

export default IndexPage

export const pageQuery = graphql`
  query {
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

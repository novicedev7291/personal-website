import React from "react"

import { StaticQuery, graphql } from "gatsby"
import Header from "./header"

const HeaderInfo = () => {
  const query = graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author {
            name
            shortIntro
            about
            contact
            social {
              twitter
              github
            }
          }
        }
      }
      file(relativePath: { eq: "profile-pic.JPG" }) {
        childImageSharp {
          fixed(width: 100, height: 100, quality: 90) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `

  return (
    <StaticQuery
      query={query}
      render={data => {
        const author = data.site.siteMetadata.author
        const avatar = data.file.childImageSharp.fixed

        return <Header author={{ ...author, avatar }} />
      }}
    />
  )
}

export default HeaderInfo

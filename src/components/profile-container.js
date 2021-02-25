import React from "react"
import { graphql, StaticQuery } from "gatsby"
import Profile from "./profile"

const ProfileContainer = ({ extraClassNames }) => {
  const staticQuery = graphql`
    query {
      site {
        siteMetadata {
          author {
            name
            shortIntro
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
      query={staticQuery}
      render={data => {
        const author = data.site.siteMetadata.author
        const avatar = data.file.childImageSharp.fixed

        return (
          <Profile
            {...author}
            avatar={avatar}
            extraClassNames={extraClassNames}
          />
        )
      }}
    />
  )
}

export default ProfileContainer

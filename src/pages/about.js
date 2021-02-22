import React from 'react'
import { graphql } from 'gatsby'
import Header from '../components/header'
import Layout from '../components/layout'
import Main from '../components/main'

export default function About({data, location}) {
   const author = data.site.siteMetadata.author
   const avatar = data.file.childImageSharp.fixed
   return <Layout>
       <Header author={{...author, avatar}} />
       <Main>
           <div className="flex flex-col max-w-lg pt-8">
                <p className="text-gray-600">{author.about}</p>
           </div>
       </Main>
   </Layout> 
}

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
      },
      file(relativePath: { eq: "profile-pic.JPG"}) {
        childImageSharp {
          fixed(width: 100, height: 100, quality:90) {
            ...GatsbyImageSharpFixed
          }
        }
      }
}
`
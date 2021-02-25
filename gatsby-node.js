const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const postTemplate = path.resolve("src/templates/post.js")

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 10
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
            }
          }
        }
      }
    `
  )

  console.log(result)

  if (result.errors) {
    reporter.panicOnBuild(
      "There was some problem fetching posts",
      result.errors
    )
    return
  }

  const edges = result.data.allMarkdownRemark.edges

  if (edges.length > 0) {
    edges.forEach((edge, index) => {
      const post = edge.node
      createPage({
        path: post.fields.slug,
        component: postTemplate,
        context: {
          id: post.id,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === "MarkdownRemark") {
    const date = new Date(node.frontmatter.date)
    const basePath = `content/posts/${date.getFullYear()}`
    const value = createFilePath({
      node,
      getNode,
      basePath,
      trailingSlash: false,
    })

    createNodeField({
      name: "slug",
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
        type MarkdownRemark implements Node {
            frontMatter: FrontMatter
            fields: Fields
        }

        type FrontMatter {
            title: String
            author: String
            date: Date @dateformat
            tags: String
        }

        type Fields {
            slug: String
        }
    `)
}

module.exports = {
  siteMetadata: {
    title: 'Coding saga',
    description: 'Coding saga is about sharing my personal experiences about programming',
    author: {
      name: 'Kuldeep Yadav',
      shortIntro: 'Software Engineer, India',
      about: 'Hi, My name is Kuldeep Yadav and I live in Gurugram, India and work in a small startup, I have a beautiful wife and family.\nI have worked upon various programming langauges and frameworks in my career and I love to build things from scratch.\nHere, I share whatever I learnt and tried so far.',
      contact: 'kuldeepyadav7291@gmail.com',
      social: {
        twitter: 'marzi_ka_maalik',
        github: 'novicedev7291'
      }
    },
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography' 
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/posts`,
        name: 'posts'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/assets`,
        name: 'assets'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-prismjs'
        ]
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-postcss'
  ],
}

module.exports = {
  siteMetadata: {
    title: "Coding saga",
    description:
      "Coding saga is about sharing my personal experiences about programming",
    author: {
      name: "Kuldeep Yadav",
      shortIntro: "I know few things about coding",
      contact: "kuldeepyadav7291@gmail.com",
      social: {
        twitter: "marzi_ka_maalik",
        github: "novicedev7291",
      },
    },
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-typography",
      options: {
        pathToConfigModule: "src/utils/typography",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/assets`,
        name: "assets",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/posts`,
        name: "posts",
      },
    }, 
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1200,
              withWebp: true,
              showCaptions: true,
              quality: 100
            }
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files"
        ]
      }
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Coding Saga",
        start_url: "/",
        icon: "content/assets/favicon.png",
      },
    },
    {
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: ["G-GVFZ4Q2W8K"],
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        pluginConfig: {
          head: true,
          exclude: ["/about"],
        },
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-remove-serviceworker",  
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-postcss",
  ],
}

const path = require(`path`)

let siteConfig
let ghostConfig
let mediaConfig
let routesConfig

try {
    siteConfig = require(`./siteConfig`)
} catch (e) {
    siteConfig = null
}

try {
    mediaConfig = require(`./mediaConfig`)
} catch (e) {
    mediaConfig = null
}

try {
    routesConfig = require(`./routesConfig`)
} catch (e) {
    routesConfig = null
}

try {
    ghostConfig = require(`./.ghost`)
} catch (e) {
    ghostConfig = {
        development: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
        production: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
    }
} finally {
    const { apiUrl, contentApiKey } = process.env.NODE_ENV === `development` ? ghostConfig.development : ghostConfig.production

    if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
        ghostConfig = null //allow default config to take over
    }
}

module.exports = {
    plugins: [
        `gatsby-plugin-preact`,
        `gatsby-plugin-netlify`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `images`),
                name: `images`,
            },
        },
        {
            resolve: `gatsby-theme-try-ghost`,
            options: {
                ghostConfig: ghostConfig,
                siteConfig: siteConfig,
                mediaConfig: mediaConfig,
                routes: routesConfig,
            },
        },
        {
            resolve: `gatsby-theme-ghost-dark-mode`,
            options: {
                // Set to true if you want your theme to default to dark mode (default: false)
                // Note that this setting has an effect only, if
                //    1. The user has not changed the dark mode
                //    2. Dark mode is not reported from OS
                defaultModeDark: false,
                // If you want the defaultModeDark setting to take precedence
                // over the mode reported from OS, set this to true (default: false)
                overrideOS: false,
            },
        },
        {
            resolve: `gatsby-theme-ghost-members`,
        },
        {
            resolve: `gatsby-transformer-rehype`,
            options: {
                filter: node => (
                    node.internal.type === `GhostPost` ||
                    node.internal.type === `GhostPage`
                ),
                plugins: [
                    {
                        resolve: `gatsby-rehype-ghost-links`,
                    },
                    {
                        resolve: `gatsby-rehype-prismjs`,
                    },
                ],
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // This plugin is currently causing issues: https://github.com/gatsbyjs/gatsby/issues/25360
        //`gatsby-plugin-offline`,
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
              // The property ID; the tracking code won't be generated without it
              trackingId: "UA-177235244-1",
              // Defines where to place the tracking script - `true` in the head and `false` in the body
              head: false,
              // Setting this parameter is optional
              anonymize: true,
              // Setting this parameter is also optional
              respectDNT: true,
              // Avoids sending pageview hits from custom paths
              exclude: ["/preview/**", "/do-not-track/me/too/"],
              // Delays sending pageview hits on route update (in milliseconds)
              pageTransitionDelay: 0,
              // Enables Google Optimize using your container Id
              optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
              // Enables Google Optimize Experiment ID
              experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
              // Set Variation ID. 0 for original 1,2,3....
              variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
              // Defers execution of google analytics script after page load
              defer: false,
              // Any additional optional fields
              sampleRate: 5,
              siteSpeedSampleRate: 10,
              cookieDomain: "romlittera.com",
            },
          },
    ],
}

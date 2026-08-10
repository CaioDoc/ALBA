const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repo = "";
if (isGithubActions) {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "ALBA";
  repo = `/${repoName}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: repo,
  assetPrefix: repo,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

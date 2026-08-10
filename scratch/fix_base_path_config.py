import os

# 1. Update next.config.js
next_config_path = r'F:\Antigravity\Alba\ALBA\next.config.js'

next_config_content = """const isGithubActions = process.env.GITHUB_ACTIONS || false;

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
"""

with open(next_config_path, 'w', encoding='utf-8') as f:
    f.write(next_config_content)

print("Updated next.config.js with dynamic basePath/assetPrefix for GitHub Actions!")

# 2. Update app/profissionais/page.tsx to clean getImagePath
prof_path = r'F:\Antigravity\Alba\ALBA\app\profissionais\page.tsx'
with open(prof_path, 'r', encoding='utf-8') as f:
    prof_text = f.read()

prof_text = prof_text.replace(
    "const basePath = process.env.NODE_ENV === 'production' ? '/ALBA' : '';\n    return `${basePath}${path.startsWith('/') ? '' : '/'}${path}`;",
    "return path.startsWith('/') ? path : `/${path}`;"
)

with open(prof_path, 'w', encoding='utf-8') as f:
    f.write(prof_text)

print("Updated app/profissionais/page.tsx getImagePath!")

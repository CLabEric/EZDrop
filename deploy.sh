#!/usr/bin/env sh

# abort on errors
set -e

# navigate into the build output directory
cd app

# build
npm run build

#go back to root directory
cd -

#404 hack for gh-pages
cp app/dist/index.html app/dist/404.html

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git add .
git commit -m $*

# push to regular repo
git push

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
#git push -f git@github.com:CLabEric/EZDrop.git main:gh-pages
git subtree push --prefix app/dist origin gh-pages

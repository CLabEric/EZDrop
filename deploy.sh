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

# commit changes
git add .
git commit -m "$*"

# push to regular repo
git push

#push to gh-pages
git subtree push --prefix app/dist origin gh-pages

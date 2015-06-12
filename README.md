# :deciduous_tree: Austin Green Map

An easy to browse gallery of the parks in Austin. Started at [ATX Hack For Change 2015](atxhackforchange.org). Inspired by https://github.com/codeforboston/bostongreenmap.

**Development in progress.**

#### Install

```
git clone git@github.com:open-austin/austingreenmap.git
npm install -g gulp
npm install
```

#### Run

```
gulp clean && gulp
```

#### Deploy

```
gulp clean
gulp build
gulp deploy-gh-pages
```

#### Data

We use PostGIS to transform the GeoJSON files, even though we should not. One day we'll fix this. To setup your PostGIS database follow the instruction at https://github.com/codeforboston/bostongreenmap.

```
pip install -r requirements.txt
brew install jq
npm install -g topojson
./download.sh
```

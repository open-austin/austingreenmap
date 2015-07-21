# Austin Green Map

:deciduous_tree: See it live! [open-austin.github.io/austingreenmap/](http://open-austin.github.io/austingreenmap/) :deciduous_tree:


An easy to browse gallery of the parks in Austin. Started at [ATX Hack For Change 2015](http://atxhackforchange.org). Inspired by https://github.com/codeforboston/bostongreenmap.

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

#### License

Released to the public domain under [the Unlicense](http://unlicense.org/) by Open Austin, 2015.

# Austin Green Map

:deciduous_tree: See it live! [open-austin.github.io/austingreenmap/](http://open-austin.github.io/austingreenmap/) :deciduous_tree:

:green_apple: Now on the App Store https://itunes.apple.com/us/app/green-map-interactive-map/id1022734155?mt=8 :green_apple: 


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

To deploy the webapp:

```
gulp clean
gulp build
gulp deploy-gh-pages
```

#### Cordova

To run as a native iOS/Android app through Cordova see [github.com/open-austin/austingreenmap-cordova](https://github.com/open-austin/austingreenmap-cordova).

To build the app for Cordova:

```
gulp clean
gulp build
gulp inject-cordova
```

#### Data

We use PostGIS to transform the GeoJSON files, even though we should not. One day we'll fix this. To setup your PostGIS database follow the instructions at https://github.com/codeforboston/bostongreenmap.

```
pip install -r requirements.txt
brew install jq
npm install -g topojson
./download.sh
```

#### License

Released to the public domain under [the Unlicense](http://unlicense.org/) by Open Austin, 2015.

#### Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

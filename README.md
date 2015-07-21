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

Austin Green Map is a gallery of parks.
Copyright (C) 2015  Luqmaan Dawoodjee

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

[![Stories in Ready](https://badge.waffle.io/geosolutions-it/MapStore2.png?label=ready&title=Ready)](https://waffle.io/geosolutions-it/MapStore2)
[![Build Status](https://travis-ci.org/geosolutions-it/MapStore2.svg?branch=master)](https://travis-ci.org/geosolutions-it/MapStore2)
[![Coverage Status](https://coveralls.io/repos/geosolutions-it/MapStore2/badge.svg?branch=master&service=github)](https://coveralls.io/github/geosolutions-it/MapStore2?branch=master)
[![Codacy Badge](https://www.codacy.com/project/badge/1648d484427346e2877006dc287379b6)](https://www.codacy.com/app/simone-giannecchini/MapStore2)

MapStore 2
==========
MapStore 2 is a framework to build *web mapping* applications using standard mapping libraries, such as [OpenLayers 3](http://openlayers.org/) and [Leaflet](http://leafletjs.com/).

MapStore 2 has several example applications: 
 * MapViewer is a simple viewer of preconfigured maps (optionally stored in a database using GeoStore)
 * MapPublisher has been developed to create, save and share in a simple and intuitive way maps and mashups created selecting contents by server like OpenStreetMap, Google Maps, MapQuest or specific servers provided by your organization or third party. 
 
For more information check the [MapStore wiki](https://github.com/geosolutions-it/MapStore2/wiki).

License
------------
MapStore 2 is Free and Open Source software, it is based on OpenLayers 3, Leaflet and [ReactJS](https://facebook.github.io/react/), and is licensed under the Simplified BSD License.

Quick Start
------------

Clone the repository with the --recursive option to automatically clone submodules:

`git clone --recursive https://github.com/geosolutions-it/MapStore2.git`

Install NodeJS, if needed, from [here](https://nodejs.org/en/blog/release/v0.12.7/).

Start the demo locally:

`npm install`

`npm start`

The demo runs at `http://localhost:8081` afterwards.

Install latest Maven, if needed, from [here](https://maven.apache.org/download.cgi) (version 3.1.0 is required).

Build the deployable war:

`./build.sh`

Deploy the generated mapstore.war file (in web/target) to your favourite J2EE container (e.g. Tomcat).

Read more on the [wiki](https://github.com/geosolutions-it/MapStore2/wiki).

Professional Support
---------------------
MapStore 2 is being developed by [GeoSolutions](http://www.geo-solutions.it/) hence you can talk to us for professional support. Anyway the project is a real Open Source project hence you can contribute to it (see section below).

Communication
---------------------
We currently have two mailing list, [one](https://groups.google.com/d/forum/mapstore-users) for users and [one](https://groups.google.com/d/forum/mapstore-developers) for developers. The first one is for those who are willing to use MapStore and need help/directions, the latter is for those trying to extend/proposed fixes for MapStore.


Contributing
---------------------
We welcome contributions in any form:

* pull requests for new features
* pull requests for bug fixes
* pull requests for documentation
* funding for any combination of the above

For more information check [this](https://github.com/geosolutions-it/MapStore2/blob/master/CONTRIBUTING.md) page.

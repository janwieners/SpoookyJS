# SpoookyJS

A JavaScript Multiagent Board Game Framework Based On Monte Carlo Methods.
German: "Ein multiagentenbasiertes JavaScript-Framework zur flexiblen Implementation digitaler browserbasierter Brettspiele und spielübergreifender künstlicher Intelligenz."

I developed SpoookyJS as part of my PhD thesis at the University of Cologne [http://www.hki.uni-koeln.de](http://www.hki.uni-koeln.de "Historisch-Kulturwissenschaftliche Informationsverarbeitung").
You can find my PhD thesis at [http://www.jan-wieners.de/dissertation](http://www.jan-wieners.de/dissertation "http://www.jan-wieners.de/dissertation").

## Development

### Prerequisites

You need the following components to build the SpoookyJS library, minify CSS and start your development environment:

* [NodeJS](https://nodejs.org/download/)
* [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

### Installation

To install the necessary dependencies for SpoookyJS, please run the following commands in your working directory:

```
git clone https://github.com/janwieners/SpoookyJS.git
cd SpoookyJS
npm install
npm install -g bower gulp
bower install
```

### Build the SpoookyJS libraries

Start gulp's default task to build the SpoookyJS libraries and necessary dependencies: 

```
gulp
```

### Running the development server

Use 

```
gulp server
```

to start your development server at [http://localhost:1503/](http://localhost:1503/).
# SpoookyJS

A JavaScript Multiagent Board Game Framework Based On Monte Carlo Methods.
German: "Ein multiagentenbasiertes JavaScript-Framework zur flexiblen Implementation digitaler browserbasierter Brettspiele und spielübergreifender künstlicher Intelligenz."

I developed SpoookyJS as part of my PhD thesis at the Institute for [Historisch-Kulturwissenschaftliche Informationsverarbeitung](http://www.hki.uni-koeln.de "Historisch-Kulturwissenschaftliche Informationsverarbeitung"), University of Cologne.
You can play the board games I implemented at [https://spoookyjs.de](https://spoooky.js.de) and read my PhD thesis [here](https://jan-wieners.de/diss/dissertation_jan-wieners.pdf) or at the [Kölner UniversitätsPublikationsServer](http://kups.ub.uni-koeln.de/5971/).

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
```

### Build the SpoookyJS libraries

Run 

```
npm run build
```

to build the SpoookyJS libraries and necessary dependencies.

### Running the development server

Use 

```
npm start
```

after building SpoookyJS to start your development server at [http://localhost:1503/](http://localhost:1503/).
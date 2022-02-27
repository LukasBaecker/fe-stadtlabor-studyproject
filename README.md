# GardenUp Frontend Repository

This repository contains all frontend for the GardenUp application.
It was created within the scope of the Stadtlabor Urban Gardening Study Project at WWU Muenster
in the Geoinformatics masters program.

It is deployed at [](http://giv-project15.uni-muenster.de:3000).
Currently, it is accessible from within the university network only.

## About GardenUp

GardenUp is a social platform for urban gardeners to connect with each other.
It allows urban gardeners to get in touch with the local gardening community.
Communities can announce events, publish the plants that grow in the garden
and offer tools, seeds etc. for borrowing to others or for givaway.

Heart of the GardenUp platform is a map, which shows the location of all gardens.
This map can be filtered by items that the gardens are offering for givaway or for borrowing.

## How to run

This application requireds Node.js and NPM packet manager to run.
Please install these prior to running the GardenUp frontend application.
First, clone this repository using `git clone https://github.com/LukasBaecker/fe-stadtlabor-studyproject.git` command.
Next, use `cd` command to navigate into the repository directory and use `npm install` to install all dependencies.

### Run dev server

For development purposes, run the dev server by using `npm run dev`, wait until it has started up.
Then, view the application in a web browser at `localhost:3000`

### Run production server

For production, first build the application using `npm run build`. This may take a few minutes.
Next, run the production server using `npm run start`.

## Backend

This application heavily relies on RESTful APIs served by a Django backendd.
The backend code is stored in a seperate repository located [here](https://github.com/LukasBaecker/be-stadtlabor).
All REST-API URLs are stored centrally in `/helpers/urls.jsx`. This allows for switching
to a different backend instance easily by modifying the variable `backendBaseURL`.

One instance of the backend is currently deployed at [](http://giv-project15.uni-muenster.de:8000).
It is however only accessible from within the university network.

## Basic folder structure

This application was developed using [Next.js](https://nextjs.org/) framework and [ReactJS](https://reactjs.org/) Components.
Please consult their documentations for details.
The folder structure stems from Next.js structure, with a few extra ones

- `/components/`: Contains some React components, that were outsourced to seperate files to improve code modularity.
- `/helpers/`: Contains some Javascript methods that are useful to work with.
- `/hooks/`: Contains React Custom hooks.
- `/pages/`: Contains all web pages. Router generates URLs based on files in this directory.
- `/public/`: Public file storage, e.g. for images that are used throughout the application.
- `/store/`: Contains anything related to the redux store.
- `/styles/`: Contains all SCSS styles used throughout the appplication.

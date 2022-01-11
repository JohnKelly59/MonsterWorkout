# MonsterWorkout
Description:
MonsterWorkout is a complexx fitness web application. MonsterWorkout has a multitude of
features. Guests who are not logged in can search through over 3,000 workouts that are 
provided by the ExerciseDB API created be Justin Mozley. Guest can also use the apps randomizer
route to create random workouts based on the parameters the guest has put in the form.
Users who are signed up can not only utilize the features given to guests, but they alos have 
features exlusive to signed in users. Users can sign up through Googles AuthO APi
or sign up through the native register form. Once signed in, Users can add workouts to their 
favorite lists, create, edit, and delete logs in the log route, and create daily workouts that can 
be editedand deleted after 24 hours.

Build:
Node.JS - API calls, MondgoDB Atlas Database Connection, Route rendering

EJS - Javscript templating for header, and server side data

MongoDB Atlas - CLud Database to hold user credentials, user favorite exercises, user logs,
and user sessions

HTML - Create pages

CSS - Design/Style pages

JavaScript - Functions to indicate what forms are shown and which exercise card to show to user

Passport.js - User Authentication

RapidAPI - ExerciseDB API created be Justin Mozley to GET  and POST exercise data

AWS Elastic Beanstalk - Run project on cloud-base environment

AWS CodePipeline - Direct connection between Github repo and Elastic Beanstalk

Features to be implemented in the future: 
A blog page where user can interact with each other and
discuss workout regumines and exercises.

Run Demo:
MonsterWorkout is currently deployed - http://workoutapp-env.eba-5vn3jgdm.us-east-2.elasticbeanstalk.com/

Run Locally: 
command line -
npm init 
npm start


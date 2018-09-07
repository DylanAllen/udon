# Udon

> Project Management for Agencies

Udon is a time tracking and project management app for agencies. It uses Vue.js, Vue Router, Firestore, Firebase Storage, Firebase Authentication, Babel, eslint, Sass, and webpack. This project is in active development.

## Build Setup

In order to connect this to a database:

- Create a new project in the [Firebase Console](https://console.firebase.google.com/)
- Create a Firestore database in the project
- Go to the Project Settings, click "Add Firebase to your web app"
- Go to 'Authentication' > 'Sign-in' method and enable Email/Password
- Create a new file in your src directory called ``firebaseConfig.js``
- Fill the config data from your firebase project into that file following this format:

``` js
var firebaseConfig = {
  apiKey: '...',
  authDomain: '...',
  databaseURL: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...'
}

export default firebaseConfig
```

Then:

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

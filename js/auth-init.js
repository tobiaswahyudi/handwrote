firebase.auth().onAuthStateChanged((u) => {
  console.log("auth state changed to ", u)
  userLoaded = true;
  if (u) {
    user = u;
    initLoggedInUserView("#firebaseui-auth-container");
  } else {
    user = null
  }
  setLoginDisplayGates()
});

const login = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log(result)
      var credential = result.credential;

      var token = credential.accessToken;
      var user = result.user;
    }).catch((error) => {
      console.error("auth error", error)
    });
}


var userLoaded = false;
var user = firebase.auth().currentUser;
var userChecked = false;

const getUser = () => {
  if (!userLoaded || !user) return null;
  return {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    uid: user.uid,
  };
};

const initLoggedInUserView = () => {
  const user = getUser();
  if (!user) return;
  const img = document.querySelector('#user-img');
  const name = document.querySelector('#user-name');
  img.src = user.photoURL
  name.innerText = user.displayName
};

const setLoginDisplayGates = () => {
  const loggedIn = !!getUser()
  console.log("setting gates to loggin?", loggedIn);
  [...document.getElementsByClassName('login-hide')].forEach(e => e.style.display = loggedIn ? 'none' : 'initial');
  [...document.getElementsByClassName('login-show')].forEach(e => e.style.display = loggedIn ? 'initial' : 'none');
  [...document.getElementsByClassName('login-enable')].forEach(e => e.disabled = !loggedIn);
}

const logout = () => {
  firebase.auth().signOut()
}
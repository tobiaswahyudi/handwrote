var ui = new firebaseui.auth.AuthUI(app.firebase.auth());

app.firebase.auth().onAuthStateChanged((u) => {
  userLoaded = true;
  if (u) {
    user = u;
    initLoggedInUserView("#firebaseui-auth-container");
  } else {
    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        // firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      signInSuccessUrl: window.location.href,
      // persistence: firebase.auth.Auth.Persistence.SESSION
    });
  }
});

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

const initLoggedInUserView = (selector) => {
  const user = getUser();
  if (!user) return;
  const rootNode = document.querySelector(selector);
  if (!rootNode) return;

  const toggleProfileDropdown = 

  rootNode.setHTMLUnsafe(`
        <div class="user-container">
            <div class="user-name-email">
                <span class="user-name">${user.displayName}</span>
                <span class="user-email">${user.email}</span>
            </div>
            <img src="${user.photoURL}"></img>
        </div>
    `);
};

import { firebase, googleAuthProvider, facebookAuthProvider } from '../firebase/firebase';

let triedFacebook = false;

export const login = (uid, currentUser) => ({
  type: 'LOGIN',
  uid,
  currentUser,
});

export const startLoginGoogle = () => {
  return () => {
    return firebase.auth().signInWithPopup(googleAuthProvider).catch((e) => {
      if (e.code === 'auth/account-exists-with-different-credential') {
        if (!triedFacebook) {
          triedFacebook = true;
          return firebase.auth().signInWithPopup(facebookAuthProvider);
        } else if (triedFacebook) {
          return undefined;// change this to trying email
        }
      }
      return console.log(`Error: ${e}`);
    });
  };
};

export const startLoginFacebook = () => {
  return () => {
    return firebase.auth().signInWithPopup(facebookAuthProvider).catch((e) => {
      console.log('There was an error signing in with facebook so you have been redirected to google sign-in.');
      console.log(e);
      return firebase.auth().signInWithPopup(googleAuthProvider);
    });
  };
};


export const createLoginEmail = (email, password) => {
  return () => {
    return firebase.auth().createUserWithEmailAndPassword(email, password).catch((e) => {
      return e;
    });
  };
};

export const startLoginEmail = (email, password) => {
  return () => {
    return firebase.auth().signInWithEmailAndPassword(email, password).catch((e) => {
      return e;
    });
  };
};

export const logout = () => ({ type: 'LOGOUT' });

export const startLogout = () => {
  return () => {
    return firebase.auth().signOut();
  };
};

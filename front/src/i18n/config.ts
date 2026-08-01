import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
        login: {
            welcome: 'Bienvenue ! Connecte-toi pour gérer ton projet.',
            input: {
                email: 'Adresse e-mail',
                password: 'Mot de passe',
                rememberMe: 'Se souvenir de moi',
            },
            button: {
                login: 'Se connecter',
            },
            noAccount: "Vous n'avez pas encore de compte ?",
            createAccount: 'Créer un compte',
        }
    },
  },
  en: {
    translation: {
        login: {
            welcome: 'Welcome ! Please login to manage your project.',
            input: {
                email: 'Email',
                password: 'Password',
                rememberMe: 'Remember me',
            },
            button: {
                login: 'Login',
            },
            noAccount: "Don't have an account yet?",
            createAccount: 'Create an account',
        }
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr', // Langue par défaut
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React gère déjà le XSS
  },
});

export default i18n;
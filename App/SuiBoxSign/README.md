# React-Basic-Config
Projet vide pré-configuré en utilisant **React + TypeScript + Vite + SCSS**.\
Il a pour but d'être pull pour vous aider à pré-configurer des projets React.

**RAPPEL**\
Typescript est de plus en plus adopté et préférer, il a également pour avantage de vous laisser utiliser des fichiers '.js' et '.jsx' et avoir un code hybride.\
La pratique n'est pas vraiment recommandé mais ça peut être pratique, malgré l'utilisation du JS certains avantages donné par la création d'un projet Typescript resteront.

**ATTENTION**\
Différente branche seront créer avec différentes configuration (en terme de packages). Les différences seront expliquée pour chaque configuration.

## Configuration de base
![image](https://github.com/user-attachments/assets/d61f4352-206b-4974-ac1f-b57035be557e)

- public:\
Contient les dossiers/fichiers des images nécessaire pour le projet

- src:\
Code source du projet séparé en différent dossiers. **NE PAS MODIFIER LE 'main.tsx'** sauf si l'encadrement de l'App tout entière dans un *provider* l'exige, si possible préférer modifier 'App.tsx'

## Description du dossier *src*
### Components
Exemple du composant *NavBar*: 
```typescript
import logo from "/logo/vite.svg";
import "../styles/components/Style-NavBar.scss";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src={logo} alt="Logo" />
        </a>
      </div>
        <div className="navbar-menu">
          <a href="/" className="navbar-item">
            Home
          </a>
          <a href="/about" className="navbar-item">
            About
          </a>
        </div>
    </nav>
  );
}

export default NavBar;
```
Typiquement ce fichier condiendra uniquement des composant qui seront utilisé dans les **pages**.

*A Noter:*
```typescript
import logo from "/logo/vite.svg";
```
Le chemin correspond à une image dans le dossier "public/logo/vite.svg". Par défaut toute les ressources graphique seront recherchée dans le dossier *public* c'est un comportement natif d'un projet créer avec Vite.

### Config
Ce dossier à pour but de contenir les diverses éléments en lien avec la structure du projet.\
Exemple de l'*App*:
```typescript
import AppRouter from "./AppRouter.tsx";

function App() {
  return (
      <AppRouter/>
  )
}

export default App
```
Exemple de l'*AppRouter*:
```typescript
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from "../pages/Home.tsx";
import About from "../pages/About.tsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
```

Il est volontaire que l'*App* ne servent qu'à retourné l'*AppRouter*. Le but est de laissé de la place pour d'éventuelles autre configuration globale du projets (provider, cookies, tokens, constantes, setup de plugin, ...).\
l'*AppRouter* quant à lui va contenir l'ensemble des routes de notre projet, avoir ce composant de manière distincte permet de centraliser l'ensemble de toute les routes de notre projet, facilter la gesiton des routes privées, etc...

### Models
Dossier qui va comporter l'ensemble des scripts en lien avec le projet. Il a pour rôle de séparé et grouper les scripts selon leur utilité du reste du code en lien avec les composant.\
Typiquement, si vous utilisez une API, par exemple de FireBase et une faite par vous même, il est judicieux de créer 2 fichiers de scripts qui vont reprendre toute les fonctions en lien avec les appels d'API.\
Un autre avantage est de garder les code des composant plus simple et clair car la logique d'intéraction avec les API sera illustré par un appel de fonction d'un fichier externe, seul le résultat et l'appel sera traité dans le composant.

**REMARQUE**\
Il est aussi possible de faire des objets (statique ou non) et les exporter. Seul inconvéniant c'est que si vous avez toutes vos méthode dans la même class, une page comme *Login* va importer la class **en entier** alors qu'elle n'utilisera que les méthodes de login.\
Exemple de *display-alert-boxes*:
```typescript
export function displayAlertBoxes(alertType: string){
    if (!['success', 'info', 'warning', 'danger'].includes(alertType)) {
        alert('Invalid alert type');
        return;
    }

    const existingAlertBox = document.getElementById('alert-box');
    if (existingAlertBox) {
        existingAlertBox.remove();
    }

    const alertBox = document.createElement('div');
    alertBox.className = alertType;
    alertBox.id = 'alert-box';
    alertBox.textContent = `This is a ${alertType} alert box!`;
    document.getElementsByClassName('content')[0].appendChild(alertBox);
}
```
### Pages
Contient l'ensemble des **pages** utilisant les *composant*. Ceci est le composant principal qui est appellé par le Router selon l'URL.\
Exemple d'*Home*:
```typescript
// Import components
import NavBar from "../components/NavBar.tsx";
import Footer from "../components/Footer.tsx";

// Import the styles
import "../styles/pages/Style-HomePage.scss";

// Import the function from the model
import {displayAlertBoxes} from "../models/display-alert-boxes.ts";

function Home() {

    function displayAlertBox() {
        const checkedRadioButton: HTMLInputElement | null = document.querySelector('input[type="radio"]:checked');
        checkedRadioButton ? displayAlertBoxes(checkedRadioButton.value) : alert('No radio button selected');
    }

    function hideAlertBox() {
        const existingAlertBox = document.getElementById('alert-box');
        if (existingAlertBox) {
            existingAlertBox.remove();
        }
    }

    return (
        <>
            <NavBar/>

            <div className="container">
                <h1 className="title">Home</h1>
                <div className="content">
                    <div className="radio-group">
                        <div className="field">
                            <input type="radio" id="success" name="alert" value="success"/>
                            <label htmlFor="success">Success</label>
                        </div>
                        <div className="field">
                            <input type="radio" id="info" name="alert" value="info"/>
                            <label htmlFor="info">Info</label>
                        </div>
                        <div className="field">
                            <input type="radio" id="warning" name="alert" value="warning"/>
                            <label htmlFor="warning">Warning</label>
                        </div>
                        <div className="field">
                            <input type="radio" id="danger" name="alert" value="danger"/>
                            <label htmlFor="danger">Danger</label>
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="button" onClick={displayAlertBox}>Show Alert</button>
                        <button className="button" onClick={hideAlertBox}>Hide Alert</button>
                    </div>
                </div>
            </div>

            <Footer/>
        </>
    );
}

export default Home;
```
### Styles 
Globalement ce fichier comportera 2 dossiers :
- components:\
Style pour les composants
- pages:\
Style pour les pages

Ici le SCSS a été utilisé, donc un fichier 'brandchart.scss' a été créer (incomplet) mais permet de stocker les variables/constantes/fonctions/... en lien avec le design des pages du projet, **Ce fichier est importer dans les autres FEUILLES DE STYLES**.
Quelques petits exemples de fonctionnalités un peu plus avancées néanmoins pratique ont été ajouté a des fin démonstrative.


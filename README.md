# Milla App

App desarrollada en Ionic para Milla.

## ☕ Getting Started

Este proyecto está desarrollado en [Ionic](https://ionicframework.com/docs) y [Capacitor](https://capacitorjs.com/) así que tenemos que tener por lo menos instalado globalmente `Ionic` y lo vamos a hacer con el siguiente comando:

```sh
npm i -g @ionic/cli
```

Además deberíamos tener la última versión actualizada de `XCode` y del `Simulator` y por supuesto [Android Studio](https://developer.android.com/studio?hl=es-419)

## 🚀 Project Structure

Dentro del proyecto tenemos la siguiente estructura de carpetas.

```text
/
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── components/
│   ├── pages/
│   └── theme/
├── tsconfig.json
├── ionic.config.json
├── capacitor.config.ts
└── package.json
```

Las más importantes son las carpetas `components`, `pages` y `theme`, donde estará prácticamente toda la aplicación.

## 🧞 Commands

Listas de comandos necesarios útiles para la aplicación. 

| Command                   | Action                                                                   |
| :------------------------ | :----------------------------------------------------------------------- |
| `npm install`             | Instala las depdendencias                                                |
| `npm run dev`             | Inicia la aplicación en livereload para ios y web                        |
| `npm run build`           | Genera la aplicación de producción en `./dist/`                          |
| `npm run serve`           | Inicia la aplicación en livereload para web                              |
| `npm run sync`            | Sincroniza la aplicación de produccion con los binarios de android y ios |
| `npm run dev.android`     | Inicia la aplicación en livereload para android y web                    |
| `npm run open.android`    | Abre el proyecto de android en Android Studio con los binarios generados |
| `npm run open.ios`        | Abre el proyecto de iOS en XCode con los binarios generados              |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
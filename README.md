# Soma - Conectando mentes![Logo](https://i.postimg.cc/13LS22DD/logo-soma-azul-bg-trans.png)

Una aplicación móvil diseñada para crear un mejor puente entre maestros y estudiantes al proveer una plataforma en la que puedan interactuar sin dejar de lado el aspecto escolar y profesional.

Ahora mismo el proyecto es privado y diseñado solo para que nosotros lo usemos.

## ¿Como vamos a trabajar?

#### Estructura del proyecto

```bash
apps
├── expo
│   ├── assets
│   │   └── Imagenes y contenido estático que vamos a usar
│   └── src
│       ├── components
│       │   └── Componentes reutilizables
│       ├── screens
│       │   └── Las pantallas que van a aparecer en la aplicación
│       ├── types
│       │   └── react-navigation.ts
│       │       └── Guarda los tipos que usa TypeScript para
│       │           identificar la pantalla en la que está
│       └── utils
│           └── Utilidades y funciones generales
└── nextjs
    ├── public
    │   └── Imagenes y contenido estático que vamos a usar
    └── src
        ├── pages
        │   ├── api: Todas las funciones del servidor van aquí:
        │   │         consultar base de datos, autorizar, etc.
        │   └── Aquí van todas las páginas que se mostrarán
        └── styles
            └── Archivos de CSS globales -serán reemplazados por TailWind
packages
└── Paquetes de configuración que nosotros crearemos
```

#### React Native

Primeramente, usen Javascript un poco para que aprendan como funciona, deben de aprender:

- ES6 sintaxis
- Objetos
- Promesas y las palabras clave `async await`
- Operadores ternarios `? :`
- Las funciones `.map() .filter() .reduce()`

Después, consulten tutoriales de React en sí, pueden ser de Youtube, les recomiendo este video: . Después de eso, ya por fin consulten como funciona React Native y hagan un proyecto personal, haganlo con la opcion que dice **EXPO**, y abranlo con la app Expo Go de la PlayStore.

#### TypeScript

Añadidura a Javascript que checa que pasemos los tipos de datos correctos: por ejemplo, si queremos pasar un String pero la variable es un entero, nos marca error.

Generalmente, no será mucho problema y no necesitan consultar guías, nada más chequen su código y traduzcan el error que les salga.

_Importante:_
Al crear una nueva pantalla añadiendo un nuevo archivo a `apps/expo/src/screens/` deben de añadir el nombre de esa pantalla a `react-navigation.ts` donde están las otras pantallas, pueden consultar las pantallas que ya hice para que se den una idea.

#### TailWind

Esta es una alternativa al CSS puro que nos deja usar palabras clave dentro de el atributo className de cualquier elemento HTML y de REACT.
Tampoco necesitan investigar mucho, nada más recuerden como funciona CSS y usen [este acordion para que no se tengan que memorizar nada](https://tailwindcomponents.com/cheatsheet/)

**Importante:** En React Native tambien estamos usando TailWind mediante NativeWind, que funciona exactamente igual pero tiene problemas con algunos atributos, por lo que si algo no les funciona cambienlo por otro atributo.

#### NextJS

Este es un _framework_ de React que nos deja hacer páginas web y comunicarlas con el servidor fácilmente. Sin embargo, la única página web que tendremos será para pedirles que descarguen nuestra aplicación.

Vamos a usar NextJS por sus habilidades de servidor dentro de la carpeta `nextjs/src/pages/api/`, pero de eso ya me encargare yo.

#### Servicios web

- Expo. Vamos a usar la pagina de Expo para distribuir la aplicación de manera automática a la PlayStore y Apple Store.
- Vercel. Para servir la página de NextJS y sus funciones de servidor.
- PlanetScale. Un servicio de base de datos que usa MySQL. Todavia no nos conectamos porque no tenemos listo el servidor.
- Clerk. Es un servicio de autenticacion que maneja el estado del usuario y su información, ya lo tengo conectado y funcionado en la aplicación móvil.

## ¿Que hay por hacer?

- Decorar la pantalla de Login y el botón de Google

- Mejorar el flujo de autenticación para que no pregunte a si deseas salir de la aplicacion ni del navegador.

- Añadir la pantalla de todos los chats y del chat individual

- Integrar con Classroom via nuestro servicio de Google OAuth que ya cree.

- Añadir la página web que los rediriga hacia las futuras paǵinas de la PlayStore y Apple Store.

- Crear el servidor en NextJS usando tRCP

- Configurar la conexión entre el cliente y el servidor.

- Configurar el servidor para que se conecte con PlanetScale.

- Crear las funciones que permitan acceder a los chats y los mensajes.

## Como instalar

Clona el proyecto usando el cliente de git en tu terminal de comandos:

```bash
git clone https://github.com/ashley-lizbeth/Soma.git
```

Entra al directorio del proyecto:

```bash
cd Soma
```

**ANTES DE INSTALAR** los paquetes, copia el archivo .env.example de la carpeta principal y el que esta dentro de `apps/expo` a .env
```bash
cp .env.example .env
cp apps/expo/.env.example apps/expo/.env
```

Instala todos los paquetes el proyecto necesita:
```bash
npm install
```

Comienza ambos servidores, el de Expo para celulares y el de NextJS para web. Este proceso consume mucha memoria, así que les recomiendo iniciarlos individaulmente

```bash
npm run dev
```

Si solo quieres empezar el servidor de la aplicacion móvil, entra a la carpeta `apps/expo` y corre `npm run dev`

```bash
cd apps/expo
npm run dev
```

Si solo quieres empezar el servidor de NextJS, haz lo siguiente:

```bash
cd apps/nextjs
npm run dev
```

## Tech Stack

Esta app usa una variación del [T3Stack by Theo - t3.gg](https://github.com/t3-oss/create-t3-turbo.git) para móviles:

**Cliente:** React Native, TailwindCSS mediante NativeWind, NextJS para página web

**Server:** Vercel Serverless Functions via NextJS, tRPC, PlanetScale (SQL), Clerk para autenticación

## Autores

Este proyecto es desarrollado en colaboración con:

//Sección pendiente

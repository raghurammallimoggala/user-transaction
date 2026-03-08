# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
## project name: "USER-TRANSACTION" 

## backend : 
           mkdir user-transaction-backend 
           cd user-transaction-backend 
## initialize Node.js project: 
           npm init -y  (create package.json file)
## install Dependencies :
           express -> web server
           sqlite3 -> database 
           jsonwebtoken ->JWT auth 
           bcrypt -> password hashing,
           dotenv ->environment variables,
           nodemon -> for development auto-restart 

           npm install express sqlite3 jsonwebtoken bcrypt dotenv  

           npm install --save-dev nodemon 

## create folder structure :
         user-transaction-backend
                |->node_modules
                |->.env
                |->app.http
                |->package-lock.json
                |->package.json
                |->server.js
                |->userTransaction.db 

## start server:
                node server.js (use terminal) 

## server run at:
                http://localhost:3000

## Environment variables: 
               create a .env file:
                                 PORT=3000
                                 MY_SECRET_KEY=your_super_secret_key_here 

## All requests must include headers:
                         
                         {
                          "Content-Type":"application/json",
                          "Authorization":"Bearer <jwtToken>"
                         } 


## User Authentication :

   # Method         endpoint      Description

      POST          /register     Register new user 

      POST          /login        Login user/ receive JWT 

      POST          /forgot-password  Request password reset 



## Transactions: 

  # Method         endpoint                     Description

      POST          /transactions                Add new transaction 

      GET          /transaction?                  Search & filter transactions
                    search=Grocery&category=
                    food&minAmount=100&maxAmount=
                    500&from=2024-01-01&to=2024-01-31         

      PUT          /transactions/:id               Update transaction by ID 

      DELETE       /transactions/:id               delete transaction by ID
 

 ## Eaxmple json request:
      

                          {
                          "title": "Grocery",
                          "amount": 350,
                          "category": "food",
                          "date": "2024-01-10",
                          "notes": "Weekly shopping"
                        }         



## forntend: 
            mkdir user-transaction-frontend
            cd user-transaction-frontend  

## initialize react project: 
             npm create vite@latest 

             use framework:React,
             use variant:JavaScript

## install Dependencies:
            react-router-dom,
            react-iocns,
            tailwind.css
            
            npm install react-router-dom react-iocns  

            npm install -D tailwindcss postcss autoprefixer

            npx tailwindcss init -p

## create folder structure: 
            
            user-transaction-frontend
                      |
                      src
                      |
                      components
                      |    |_Dashboard
                      |    |    |_index.jsx
                      |    |_ForgotPassword
                      |    |    |_index.jsx
                      |    |_UserLogin
                      |    |    |_index.jsx
                      |    |_UserRegister
                      |    |    |_index.jsx
                      |    |_UserTransactions
                      |    |    |_index.jsx  

## run frontend: 
                 
                 npm run dev  

## frontend run at:
                http://localhost:5173 



## Features :
            - User Registration 
            - User Login with JWT
            - Forgot Password 
            - Add Transactions 
            - Update Transactions
            - Delete Transactions 
            - Search Transactions 
            - Filter by Title/Category

## Tech Stack :
              Frontend:
                       - React
                       - Vite 
                       - React Router

              Backend: 
                      - Node.js
                      - Express.js
                      - Sqlite 
                      - JWT 
                      - bcrypt   

## frontend Deploy:
       vercel : https://user-transaction-ochre.vercel.app/ 

## backend Deploy:
       Render : https://user-transaction.onrender.com
                      




# AQUARIUS

### Built With

* [![MySQL][MySQL]][MySQL-url]
* [![Node][Node.js]][Node-url]
* [![Prisma][Prisma]][Prisma-url]
* [![Typescript][Typescript]][Typescript-url]
* [![Vue][Vue.js]][Vue-url]

<!-- Getting Started -->
## Getting Started

### Prerequisites

* yarn
```sh
npm install -g yarn
```

### Installation
1. Clone the repo
```sh
git clone https://github.com/nikzanda/aquarius
```

#### Backend

2. Go to `backend` folder and install dependencies
```sh
yarn
```

3. Rename `.env.example` in `.env` and insert your data
```sh
mv .env.example .env
```

4. Run migrations
```sh
yarn migrate
```

#### Frontend

5. Go to `frontend` folder and install dependencies
```sh
yarn
```

6. Rename `.env.example` in `.env` and insert your data
```sh
mv .env.example .env
```

## Development
Run `yarn dev` in both backend and frontend folders.

## Production
Run `yarn build` in both backend and frontend folders. Remember to launch migrations also in the production database.

<!-- MARKDOWN LINKS & IMAGES -->
[MySQL]: https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.dev/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
# Holidaze

[Live Deployment](https://holidaze.homes)

## Overview

This is my final university exam project from Noroff. It's a NextJS application built with TypeScript, Tailwind CSS, and Shadcn. The project is a frontend for a fictional holiday booking website called Holidaze and includes OpenAI chat integration.

## Stack

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/zod-FF3E00?style=for-the-badge&logo=zod&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-0F111A?style=for-the-badge&logo=pnpm&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-FF3E00?style=for-the-badge&logo=openai&logoColor=white)

## Features

- Partial Pre-rendering (PPR) with NextJS 14 (experimental)
- OpenAi chat integration
- Server actions
- User authentication and registration
- Admin dashboard for managing bookings and venues

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20+)
- [pnpm](https://pnpm.io/)

### Installation

To get started, clone the repository and install the dependencies:

```zsh
gh repo clone kyrregjerstad/holidaze
cd holidaze
pnpm install
```

Copy over the `.env.example` file to a new file called `.env` and fill in the necessary environment variables.

```zsh
cp .env.example .env
```

To start the development server, run the following command:

```zsh
pnpm dev
```

That's it! The full project is now running on `http://localhost:3000/`.

To build the project, run:

```zsh
pnpm build
```

To start the production server, run:

```zsh
pnpm start
```

### Testing

To run unit tests, use the following command:

```zsh
pnpm test:unit
```

To run end-to-end tests, you first need to build the project and run the preview server, then use the following command:

```zsh
pnpm test:e2e
```

---

To log into the page, you need to register with a `@stud.noroff.no` email address. This email is not verified, and you can use any email address with this domain as long as it's available.

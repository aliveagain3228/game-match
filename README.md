<div align="center">

# 🎮 GameMatch

  <p>
    <a href="[#](https://game-match-phi-kohl.vercel.app)" target="_blank">
      <img src="https://img.shields.io/badge/Live_Demo-Link-007ACC?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  </p>

</div>

## 📝 About the Project

A full-stack real-time web application designed to help players discover games and find teammates. Built with a robust Next.js architecture, secure authentication, and real-time WebSocket connections. Users can filter games by platform or mode, generate matchmaking rooms, and connect with friends across the globe.

## ✨ Features

- 🔐 **Authentication** — seamless Google OAuth and manual Credentials login via NextAuth.
- 👥 **Friend System** — send requests via unique IDs, accept/decline invites, and manage your friends list.
- 🟢 **Real-Time Status** — see who is currently online with live WebSocket integration (Socket.io).
- 🎲 **Room Creation** — generate unique matchmaking rooms based on specific game modes and platforms.
- 🎮 **Dynamic Game Data** — fetches accurate game counts and details utilizing the RAWG Video Games Database API.
- 🗄️ **Relational Database** — structured user profiles and friendship data models managed via Prisma and PostgreSQL.
- 🎨 **Modern UI/UX** — sleek, dark-themed responsive interface built entirely with Tailwind CSS and Lucide icons.

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js (App Router)** | Full-stack React framework |
| **TypeScript** | Strict type safety and error prevention |
| **NextAuth.js** | Authentication management |
| **Prisma** | Modern ORM for database interaction |
| **PostgreSQL** | Primary relational database |
| **Socket.io / Node.js** | Real-time WebSocket server for online statuses |
| **Tailwind CSS v4** | Rapid utility-first styling |
| **RAWG API** | External video game database |

## 🚀 Installation & Setup

**1. Clone the repository**
```bash
git clone [https://github.com/aliveagain3228/game-match.git](https://github.com/aliveagain3228/game-match.git)
cd game-match

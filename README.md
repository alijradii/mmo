# Elder Tale

<p align="center" width="100%">
<img src="cover.png" alt="elder tale" style="width: 80%; min-width: 300px; display: block; margin: auto;">
</p>

> This repository accompanies the research paper
> _“Next-Gen NPCs: Integrating Generative Cognition with Real-Time Planning for Believable Game Agents”_.

> Elder Tale is a browser-based sandbox Massively Multiplayer Online Role-Playing Game (MMORPG) developed as a research environment to explore the frontier of AI-driven game characters. The project aims to redefine the role of Non-Player Characters (NPCs) by transforming them into lifelike agents—capable of autonomous decision-making, real-time responsiveness, and socially coherent behavior—mirroring the complexity and adaptability of human players.

---

## 🎮 Features

- 🌍 **Open World Exploration**  
  Discover a seamless and persistent world filled with towns, wilderness, dungeons, and dynamic events.

- 🧠 **Lifelike AI Agents**  
  Interact with intelligent NPCs powered by the novel architecture proposed in our paper, capable of memory, planning, conversation, and real-time decision-making.

- 🧑‍🎨 **Character Customization**  
  Create unique avatars with customizable appearances, gear, and cosmetic details.

- 🛡️ **Class System**  
  Choose from a variety of playable classes, each with distinct roles, abilities, and progression paths.

- 📜 **Quests**  
  Engage in story-driven and dynamic quests, including agent-generated objectives that respond to in-game events.

- 🛡️ **Guilds and Parties**  
  Form guilds, join parties, and cooperate with others in both PvE and PvP gameplay.

- ⚒️ **Professions and Crafting**  
  Take up in-game professions like farming, fishing, smithing, and alchemy to gather resources and craft valuable items.

- 🕳️ **Dungeons and Raids**  
  Participate in instanced group content with challenging encounters and coordinated mechanics.

- ⚔️ **Group PvP Events**  
  Compete in large-scale battles and faction-based conflicts and shape the world around you.

---

## 🚀 Tech Stack

- **Frontend**: React, Phaser, TailwindCSS, Shadcn/ui
- **Game Server**: Node.js, Express, Colyseus
- **AI Server**: Python, FastAPI, FAISS, OpenAI-SDK
- **Database**: MongoDB
- **Interprocess Communication**: WebSocket and REST communication between servers

---

## 📂 Repository Structure

```bash
.
├── packages/
│   ├── client/        # React + Phaser-based game client
│   ├── server/        # Colyseus game server
│   └── ai/            # FastAPI-based server for our AI agents
├── README.md
└── ...
```

---

## 🛠 Requirements

Before running the project locally, make sure you have the following installed and configured:

- **Node.js** (v18 or higher) and **bun** – for running the game server and client
- **Python 3.9+** – for the AI backend
- **MongoDB** – used for storing player data, memory logs, and agent state
  > You must have a local or remote MongoDB server running. The connection URI can be configured in `.env` files for each service.
- **OpenAI API Key** – used for LLM functionality

---

## 📖 How to Run

### 1. **Clone the Repository**

```bash
git clone https://github.com/alijradii/mmo.git
cd mmo
```

### 2. **Install Dependencies**

```bash
# For the client
cd packages/client
bun install
```

```bash
# For the game server
cd packages/client
bun install
```

```bash
# For the AI server
cd packages/ai
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. **Configure .env files**

Before running the services, you need to create `.env` files for the **client**, **server**, and **AI service**. These environment variables handle API URLs, authentication, and database connections.

> ⚠️ **Important**: This project uses **Discord OAuth2** for user authentication. To enable this:
>
> 1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
> 2. Create a new application and navigate to the **OAuth2 → General** tab.
> 3. Add a **redirect URI**: `http://localhost:4070/api/auth/discord/redirect`
> 4. Copy your **Client ID** and **Client Secret**, and paste them in your `.env` as shown below.

---

Client `.env`

```env
VITE_SERVER_URL=ws://localhost:4070
VITE_API_URL=http://localhost:4070
```

> This configures the client to communicate with the local game server over WebSocket and HTTP.

---

Server `.env`

```env
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

FRONT_END_URL=http://localhost:4071
SERVER_ORIGIN=http://localhost:4070

SERVER_DB=mongodb://127.0.0.1:27017/ncnl?authSource=admin
```

> - Replace `JWT_SECRET` and `SESSION_SECRET` with secure random strings.
> - `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` come from your Discord application setup.
> - `SERVER_DB` points to your local MongoDB instance. Adjust if you're using Docker or remote DB.

---

AI `.env`

```env
OPENAI_API_KEY=your_openai_api_key
SERVER_DB=mongodb://127.0.0.1:27017/ncnl?authSource=admin
```

> - Replace `OPENAI_API_KEY` with your OpenAI API key or compatible provider.
> - The AI server shares the same MongoDB instance.

---

Let me know if you'd like to include example commands to generate secrets, or templates like `.env.example` files for contributors.

4. **Run Services**

```bash
# Start the game server
cd packages/ai
uvicorn app.main:app --host 0.0.0.0 --port 4073 --reload
```

```bash
# Start the game server
cd packages/client
bun run dev
```

```bash
cd packages/server
bun run start
```

4. **Open the Client**

   Visit `http://localhost:4071` in your browser.

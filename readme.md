# Zomato Clone (Short-Form Food Reels)

A full-stack app for short-form food videos. Food Partners upload reels; Users browse, like, save, and comment. Built for speed, simplicity, and clean DX.

## Tech Stack

- Frontend: React + Vite, React Router, Axios
- Backend: Node.js, Express, Multer (memory), JWT auth (cookies), CORS
- Database: MongoDB + Mongoose
- Media: Pluggable storage service (e.g., ImageKit or any S3-compatible)
- Dev tooling: Nodemon, dotenv

## Monorepo Structure

```
e:\Project2\Zomato
├─ Client/                 # React app
│  ├─ src/
│  │  ├─ components/       # ReelFeed, BottomNav, etc.
│  │  ├─ pages/            # Home, Saved, Auth, Food Partner, Comments
│  │  └─ routes/AppRoutes.jsx
│  └─ styles/              # reels.css, profile.css, theme.css
└─ Server/
   └─ src/
      ├─ app.js            # Express app + CORS + routes
      ├─ server.js         # bootstrap + listen
      ├─ routes/           # auth.routes, food.routes, foodpartner.routes
      ├─ controllers/      # auth.controller, food.controler, foodpartner.controller
      ├─ models/           # user, foodpartner, food, likes, save, comment
      └─ middlewares/      # auth.middleware
```

## Key Features

- Auth
  - Users and Food Partners with JWT tokens in HTTP-only cookies
  - Dev-safe cookie options for localhost; prod-ready SameSite=None; Secure
- Food Partner
  - Upload reels (video) via Multer memory storage + external storage service
  - Profile page shows thumbnail grid of their videos
- User
  - Vertical reel feed with auto-play on scroll
  - Like / Save toggles with atomic counters
  - Saved page shows thumbnails (grid), like Food Partner profile
  - Comment page: post and display comments in reverse chronological order
- Cross-Origin Ready
  - CORS allowed for http://localhost:5173 with credentials

## API Overview

Base URL: http://localhost:3000

- Auth (mounted at /api/auth)
  - POST /user/register
  - POST /user/login
  - GET /user/logout
  - POST /foodpartner/register
  - POST /foodpartner/login
  - GET /foodpartner/logout
- Food (mounted at /api/food)
  - POST / -> createFood (Food Partner auth, multipart: video)
  - GET / -> getFoodItems (includes commentsCount)
  - POST /save -> toggle save (User)
  - GET /saved -> list saved foods (User)
  - POST /comments -> addComment (User)
  - GET /:foodId/comments -> getComments (User)
- Food Partner (mounted at /api/foodpartner)
  - GET /:id -> getFoodPartnerById ({ foodPartner, foods })

## Data Models (simplified)

- food
  - { name, video, description, foodPartner: ref "foodpartner", likeCount, savesCount }
- comment
  - { food: ref "food", user: ref "user", text } with timestamps
- like
  - { user: ref "user", food: ref "food" }
- save
  - { user: ref "user", food: ref "food" }
- user, foodpartner
  - { fullName, email, passwordHash, ... }

## Frontend Routes

- / -> Home + BottomNav (reel feed)
- /saved -> Saved + BottomNav (thumbnail grid)
- /register -> ChooseRegister
- /user/register -> UserRegister
- /user/login -> UserLogin
- /foodpartner/register -> FoodPartnerRegister
- /foodpartner/login -> FoodPartnerLogin
- /create-food -> CreateFood (partner)
- /foodpartner/:id -> Profile (partner thumbnails)
- /food/:foodId/comments -> Comments (add + list reverse-chrono)

## Workflow

- Food Partner uploads:

  1. Login → gets cookie
  2. POST /api/food with form-data (video) → storageService returns URL → saved in food doc
  3. Profile page renders foods as thumbnails from food.video

- User interactions:

  1. Login → cookie
  2. Home → GET /api/food returns feed + commentsCount
  3. Like/Save toggles → POST /like or /save; counters updated atomically
  4. Comments → navigate to /food/:id/comments → POST comment → list updates newest-first
  5. Saved page → GET /api/food/saved → display thumbnails

- Auth and CORS:
  - Server: CORS({ origin: http://localhost:5173, credentials: true })
  - Client: axios withCredentials: true
  - Cookies: dev mode uses sameSite: "lax", secure: false; prod uses "none"/true

## Optimizations

- Lean queries (Mongoose .lean()) for read-heavy endpoints
- Aggregation-based counts (commentsCount) to avoid N+1 fetch
- IntersectionObserver to auto-play/pause reels (perf-friendly)
- Multer memory + external storage → fast upload pipeline; swapable storage backend
- Atomic updates for likeCount/savesCount
- Minimal payload shape for grids to reduce render work

## Scalability Measures

- Clear separation of concerns (routes/controllers/models/middleware)
- Pluggable storage service for media (S3/ImageKit/CDN-friendly)
- Cookie-based auth scales across instances behind a load balancer (stateless)
- Avoids over-fetching: computed counts server-side; thumbnail grids use lean data
- Ready for pagination/infinite scroll (feed endpoints can add limit/skip)
- Horizontal scaling: stateless API + external DB/storage; CORS and cookies already aligned

## Local Setup

- Prereqs: Node.js 18+, MongoDB
- Env (.env):
  - JWT_SECRET=your-secret
  - STORAGE\_\* for your media provider (if needed)
- Install:
  - Server:
    - cd Server
    - npm i
    - npm run dev
  - Client:
    - cd Client
    - npm i
    - npm run dev
- Open client at http://localhost:5173

## Notes

- Don’t navigate the browser to /api/... on the client; use axios
- Auth middleware:
  - Use authUserMiddleware for user-only routes
  - Use authFoodPartnerMiddleware for partner-only routes
  - Implement authAnyMiddleware if both should access a route
- On localhost HTTP, set cookies to sameSite: "lax", secure: false

## Future Enhancements

- Pagination for feeds and comments
- Profile editing, bio, avatar for partners
- Metrics/analytics (views, retention)
- Search and tags
- CDN-backed video playback with adaptive streaming

Happy cooking and coding!

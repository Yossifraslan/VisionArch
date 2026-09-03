# VisionArch

Floor plan to 3D-style architectural visualization, with a community to share and discuss designs.

VisionArch transforms a 2D floor plan - uploaded as an image or sketched directly in-app - into a polished top-down 3D-style render. Compare before/after, try different interior styles, save your work, and share it with the community to get votes and feedback.

Repo: github.com/Yossifraslan/VisionArch

Live demo: vision-arch-two.vercel.app

Puter: https://puter.com/
open this link, and create an account from puter.com itself then open my website and click `login` and you should be in. 
because the sign in page is from puter. Also I had some friends to test it out and they were able to login through Phone number verification. 

and in the project itself, next to start building there is a `watch demo` video. Watch it to see the project.

<video controls src="public/demo.mp4" title="Demo video"></video>
---

## Credits

This project was built on top of the excellent Roomify tutorial by Adrian Hajdin (JS Mastery), which covers the core upload -> AI render -> compare flow using Puter.js. Huge thanks to Adrian for the foundation.

Everything beyond that base - the drawing canvas, templates, community feed, voting, threaded comments, project sharing, renaming, and the visual redesign - was built independently on top of it.

The drawing canvas is powered by tldraw, an open-source (MIT licensed) infinite canvas SDK.

---

## Features

### Core

- Upload a floor plan image and generate a polished, top-down 3D-style render locally in the browser
- Draw your own floor plan from scratch on a full freehand canvas (powered by tldraw) - sketch shapes, rooms, and labels, then generate a render directly from your drawing
- Floor plan templates - load a pre-made starter layout (Studio, 1-Bedroom, 2-Bedroom, Open Loft, Family Home) onto the canvas instead of starting blank
- Before/after comparison slider to see the original plan next to the rendered visualization
- Style selector - regenerate the same floor plan in Modern, Minimalist, Industrial, or Luxury styles, without losing the strict floor plan geometry
- Export your render as a downloadable image

### Projects

- Save, rename, and delete projects
- Projects persist privately to your account via Puter's key-value storage

### Community

- Share / unshare any project - moves it from your private storage into a public community feed, with your username and a timestamp attached
- Browse community designs on a dedicated /community page, visible to everyone (including logged-out visitors)
- Upvote / downvote designs (Reddit-style net score)
- Threaded comments - reply to comments, delete your own
- Logged-out visitors can browse freely; voting or commenting prompts a one-click sign-in

### Polish

- Custom amber/teal visual identity with ambient animated background
- Animated route-transition loader
- Custom confirmation modals (no native browser popups)

---

## Tech Stack

- React Router v7 (framework mode, SSR)
- TypeScript
- Tailwind CSS v4
- Puter.js - authentication, key-value storage, and a custom Puter Worker (serverless backend) for all project/vote/comment APIs
- tldraw - drawing canvas SDK
- react-compare-slider - before/after image comparison
- lucide-react - icons
- Vercel - hosting / deployment

---

## How It Works

1. Sign in with Puter (one-click, no separate account needed)

2. Get a floor plan in, either by:
   - Uploading an image (JPG/PNG)
   - Drawing one from scratch or starting from a template on the /draw canvas

3. VisionArch processes the image locally into a styled, architectural visualization that keeps the floor-plan structure readable while enhancing the presentation

4. Compare the original plan against the 3D-style render with a drag slider

5. Try different interior styles, export the result, rename the project, or share it to the community feed

6. On /community, anyone can browse, vote, and leave threaded comments on shared designs

---

## Architecture Notes

- Private projects live in each user's own Puter key-value storage namespace
- Sharing moves a project from private storage into a shared public namespace (accessible via the Puter Worker, using me.puter.kv), attaching the owner's username and a share timestamp
- Unsharing reverses this - pulls it back into the user's private storage and removes it from the public feed
- All project, vote, comment, and rename logic is handled by a custom-deployed Puter Worker acting as a lightweight serverless API, rather than a traditional backend server
- Public, read-only endpoints (community list, comments) use plain fetch() rather than puter.workers.exec(), since the latter requires an authenticated Puter session - this was a deliberate fix to make sure logged-out visitors can browse the community without being signed in

---

## Setup (Local Development)

```bash
git clone https://github.com/Yossifraslan/VisionArch.git

cd VisionArch

npm install
```

Create a `.env` file in the project root:

```env
VITEPUTERWORKERURL=yourputerworkerurl_here
```

You'll need to deploy your own Puter Worker (the backend API for projects, voting, and comments) via puter.com and put its URL above.

Run the dev server:

```bash
npm run dev
```

---

## Future Ideas

- Real-time presence (see who else is viewing a project live)
- More interior styles, and finer style differentiation
- Image-based templates in addition to the current shape-based ones

# VisionArch

### Introduction

VisionArch is an AI powered architectural visualization Saas that is built using React, Typescript, and Puter. I used AI models like Gemini to help me transform the 2D floor plans into 3D floor plans that renders with a permanent hosting and persistent metadata.

Repo: github.com/Yossifraslan/VisionArch

Live demo: vision-arch-two.vercel.app

### Tech Stack

- React
- TypeScript
- Tailwind CSS v4
- Puter.js: authentication, key-value storage, and a custom Puter Worker (serverless backend) for all project/vote/comment APIs
- tldraw: drawing canvas SDK
- react-compare-slider: before/after image comparison
- lucide-react: icons
- Vercel: hosting / deployment

### Features

- _Core Features_: You can upload a floor plan image and it will generate a 3D style floor plan or you can draw your own floor plan from scratch under /draw for a full freehand canvas that is powered by tldraw, but I added a prebuilt ones under templates to help you build faster. After you generate, you can see the before and after comparison of the 2D and 3D floor plan. If you don't like the theme, you can change it into a different style and changing it to Modern, Minimalist, Industrial, or Luxury style then click regenerate. Then you can export it into a downloadable image.

- _Projects_: You can save, rename, and delete your projects. The projects persist privately to your own account by Puter's key-value storage.

- _Community_: Community is a page where people share their 3D designed space/room and other people can vote whether they like it or hate it and write a comment about it.

- _Polish_: Custom amber or teal visual identity with an ambient animated background, animated the route transition loading and a custom confirmation modals.

### How It Works

1. Sign in with Puter (one-click, no separate account needed)

2. Get a floor plan in, either by:
   - Uploading an image (JPG/PNG)
   - Drawing one from scratch or starting from a template on the /draw canvas

3. VisionArch processes the image locally into a styled, architectural visualization that keeps the floor-plan structure readable while enhancing the presentation

4. Compare the original plan against the 3D style render with a drag slider

5. Try different interior styles, export the result, rename the project, or share it to the community feed

6. On /community, anyone can browse, vote, and leave threaded comments on shared designs

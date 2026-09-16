Hand Controlled Drone Game

Live game:
https://joenasriani.github.io/hand-drone-game/

A web-based endless runner game where you pilot a drone using real-time hand gestures captured by your webcam. Built with Three.js for 3D graphics and MediaPipe for hand tracking.

Requirements:

- Requires camera permission.
- Requires an internet connection because Three.js, MediaPipe, and the hand tracking model load from external CDNs.
- Works best in a modern desktop browser such as Chrome, Edge, or Firefox.

How to Play

1. Open the game.
2. Press Start Game.
3. Allow camera access when prompted.
4. Hold your hand clearly in front of the webcam.
5. Move your hand left/right to steer the drone.
6. Move your hand up/down to change altitude.
7. Avoid trees.
8. Fly through gold rings to score points.
9. Survive as long as possible as the speed increases.

Features

- Hand tracking control using MediaPipe.
- 3D endless runner scene built with Three.js.
- Procedural tree and ring spawning.
- Score and speed progression.
- Responsive canvas resizing.

Tech Stack

- HTML5 / CSS3
- Three.js
- MediaPipe Tasks Vision

Installation and Usage

This game is a single-file web application. There is no npm install, package.json, or build step required.

Run locally:

1. Run this in the folder containing index.html:
   python3 -m http.server
2. Open:
   http://localhost:8000/

You can also open index.html directly in a browser, but some browsers restrict camera access for local file pages. Running a local server is recommended.

Host online:

Upload index.html to GitHub Pages, Netlify, Vercel, itch.io, or any static hosting service.

Troubleshooting

Camera access denied:

- Refresh the page.
- Click Allow when the browser asks for camera permission.
- Check that the site is not blocked in browser camera settings.

Camera not supported:

- Use a modern browser with navigator.mediaDevices.getUserMedia support.
- Try Chrome or Edge if your current browser does not support webcam access.

MediaPipe failed to load:

- Check your internet connection.
- Refresh the page.
- Make sure CDN requests are not blocked by browser extensions, firewall rules, or privacy settings.

Performance issues:

- Enable hardware acceleration in your browser.
- Close heavy background tabs.
- Use a device with stronger graphics performance when possible.

Hand not detected:

- Use a well-lit environment.
- Keep your full hand visible in the video preview.
- Avoid strong backlighting.

License

MIT License. See LICENSE for details.

Created with assistance.

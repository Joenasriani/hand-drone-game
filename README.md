Hand Controlled Drone Game 🛸✋

A futuristic, web-based endless runner game where you pilot a drone using real-time hand gestures captured by your webcam. Built with Three.js for 3D graphics and MediaPipe for AI-powered hand tracking.

<!-- Replace the link above with an actual screenshot of your game -->

🎮 How to Play

Allow Camera Access: When the game starts, grant permission for the browser to access your webcam.

Show Your Hand: Hold your hand up in front of the camera. The AI will detect your hand landmarks.

Steer the Drone:

Move your hand Left/Right to bank the drone.

Move your hand Up/Down to change altitude.

Objective:

Avoid the Trees (crashing ends the game).

Fly through Gold Rings to score points.

Survive as long as possible as the speed increases!

✨ Features

AI Hand Tracking: Uses Google MediaPipe to track hand movements without any external controllers.

Immersive 3D World: Created with Three.js, featuring a low-poly Synthwave aesthetic with neon grids and dynamic lighting.

Procedural Generation: Trees and rings spawn infinitely as you fly.

Responsive Design: Adjusts to window resizing.

Dynamic Physics: Smooth banking and acceleration effects based on hand position.

🛠️ Tech Stack

HTML5 / CSS3: Core structure and styling.

Three.js: 3D rendering engine.

MediaPipe Tasks Vision: Machine learning model for real-time hand detection.

🚀 Installation & Usage

This game is a single-file web application. You don't need a build server or complex installation.

Option 1: Run Locally

Clone this repository or download the drone_game.html file.

Open drone_game.html in a modern web browser (Chrome, Edge, or Firefox recommended).

Note: Some browsers restrict camera access for local files (file://). If the camera doesn't load, you may need to run a simple local server.

Using Python (if installed):

# Run this in the folder containing the file
python3 -m http.server
# Then open http://localhost:8000/drone_game.html


Using VS Code:

Install the "Live Server" extension.

Right-click the HTML file and select "Open with Live Server".

Option 2: Host Online

Simply upload the drone_game.html file to GitHub Pages, Netlify, or Vercel to play it instantly on the web.

⚠️ Troubleshooting

"Camera Access Denied": Make sure you clicked "Allow" on the browser prompt. Check your browser settings to ensure the site isn't blocked.

Performance Issues: Ensure Hardware Acceleration is enabled in your browser settings. The game runs best on devices with a dedicated GPU.

Hand Not Detected: Ensure your environment is well-lit and your hand is clearly visible within the video frame in the bottom corner.

📝 License

This project is open-source and available under the MIT License.

Created with AI assistance.

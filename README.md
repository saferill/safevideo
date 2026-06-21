<div align="center">
  <br />
  <h1>🛡️ SafeVideo</h1>
  <p><b>Universal Media Extraction Engine</b></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/React_Motion-purple?style=for-the-badge&logo=framer" alt="Motion" />
  </p>
  <p>A lightning-fast, privacy-first web application to download videos and audio from 40+ social media platforms without watermarks.</p>
</div>

<br />

## ✨ Features

- **🌐 Universal Support**: Download media seamlessly from TikTok, Instagram, YouTube, X (Twitter), Facebook, Reddit, Pinterest, and more.
- **🎥 Best Quality (1080p HD)**: Smart parsing engine that automatically fetches the highest available resolution.
- **🎵 MP3 Audio Extraction**: Isolates and provides direct download links for the audio/music track of any video.
- **✨ No Watermarks**: Extracts original, raw video files directly from CDN servers (e.g., TikTok/Douyin without the bouncing logo).
- **🔒 Privacy First**: No user tracking, no download logging. History is securely stored locally in the browser using `localStorage`.
- **⚡ In-App Preview**: Integrated HTML5 video player to preview content before downloading.
- **💎 Premium UI/UX**: Designed with a sleek "Dark-Tech" aesthetic, glassmorphism, and smooth micro-animations.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Motion for React](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Core Engine:** [Nayan Media Downloader](https://www.npmjs.com/package/nayan-media-downloader)

## 💻 Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/saferill/safevideo.git
   cd safevideo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🛠️ How it Works

SafeVideo uses a secure API proxy route (`/api/force-download`) to bypass restrictive CORS policies and prevent browser navigation issues. When a user requests a download, the backend securely fetches the media stream and forwards it to the client as an `attachment`, forcing a direct download rather than opening the media in a new tab.

## 📝 License

This project is licensed under the MIT License.

---
<div align="center">
  <i>Developed by <b>safe_rill</b></i>
</div>

# YT-Grab  

**YT-Grab** is a Node.js application powered by **Express.js** and **MongoDB** that allows users to effortlessly fetch and download YouTube thumbnails and community posts. Its responsive design and seamless functionality make it a handy tool for content creators.  

## 🚀 Features  

- **Thumbnail Fetching**: Retrieve high-quality thumbnails from YouTube videos.  
- **Community Post Fetching**: Access and view recent YouTube community posts by channel.  
- **Download Functionality**: Download thumbnails for offline use.  
- **Error Handling**: Custom 404 and internal error pages.  
- **Responsive Design**: Optimized for mobile and desktop users.  

## 🛠️ Tech Stack  

### Backend  
- **Node.js**: For server-side programming.  
- **Express.js**: For building RESTful APIs and managing routes.  
- **MongoDB**: Database for storing application data (optional).  

### Frontend  
- **EJS**: Template engine for rendering dynamic views.  
- **CSS**: For styling and responsive design.  
- **JavaScript**: Enhancing interactivity on the client side.  

## 📂 Project Structure  

```plaintext
yt-grab/
├── config/                   # Configuration files
│   ├── emailConfig.js        # Email service configuration
├── controllers/              # Controllers for handling routes
│   ├── indexControllers.js   # Main application logic
├── middlewares/              # Middleware functions
│   ├── validateContentAccess.js  # Middleware for content validation
├── public/                   # Static assets (CSS, JS, images)
│   ├── css/                  # CSS files for styling
│   ├── js/                   # JavaScript files for client-side features
├── routes/                   # Route handlers
│   ├── indexRoutes.js        # Main route handler
├── utils/                    # Utility functions
│   ├── communityPostUtils.js # Logic for fetching community posts
│   ├── emailUtils.js         # Helper functions for sending emails
│   ├── httpStatusCodes.js    # HTTP status code constants
│   ├── messageUtils.js       # Utility functions for messages
├── views/                    # EJS templates for rendering pages
│   ├── layouts/              # Layout templates
│   ├── partials/             # Reusable components (header, footer, etc.)
│   ├── 404.ejs               # 404 error page
│   ├── about.ejs             # About page
│   ├── communityResult.ejs   # Community post result page
│   ├── contact.ejs           # Contact page
│   ├── home.ejs              # Home page
│   ├── internalError.ejs     # Internal server error page
│   ├── shortsResult.ejs      # YouTube Shorts result page
│   ├── thumbnailResult.ejs   # Thumbnail result page
│   ├── videoResult.ejs       # Video result page
├── .gitignore                # Ignored files and folders for Git
├── app.js                    # Main application entry point
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Lock file for dependencies
```

## 🔧 Setup and Installation  

### Prerequisites  

- **Node.js** (v16+ recommended)  
- **MongoDB** (local or cloud instance)  
- **npm** (Node Package Manager)  

### Steps  

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/your-username/yt-grab.git
   cd yt-grab
   ```

2. **Install dependencies**:  
   ```bash
   npm install
   ```

3. **Set up environment variables**:  
   Create a `.env` file in the root directory and add the following:  
   ```plaintext
   PORT=3000
   DB_URI=mongodb://localhost:27017/your_database_name
   SESSION_SECRET=your_session_secret
   SEND_EMAIL=your_email@example.com
   SEND_EMAIL_PASS=your_email_password
   ```

4. **Run the application**:  
   ```bash
   npm start
   ```

5. Open your browser and go to:  
   ```plaintext
   http://localhost:3000
   ```

## 📜 Usage  

1. **Fetch Thumbnails**  
   - Enter the YouTube video URL to retrieve and download its thumbnail.  

2. **Fetch Community Posts**  
   - Enter the YouTube channel ID to view recent community posts.  

3. **Error Handling**  
   - Enjoy customized error pages for a better user experience.  

## 📈 Learning Outcomes  

- Building RESTful APIs with **Express.js**.  
- Rendering dynamic views with **EJS**.  
- Using **MongoDB** for data storage and retrieval.  
- Implementing middleware for security and validation.  

## 🛡️ License  

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it as needed.  

## 🌟 Acknowledgements  

- YouTube API for inspiration and open-source data.  
- Thanks to the open-source community for tools and resources.  

Happy Fetching with **YT-Grab**! 🎉
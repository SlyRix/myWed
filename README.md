# Multicultural Wedding Website

A beautiful, responsive wedding website that celebrates the union of two cultures through a Christian and Hindu wedding ceremony. This React-based project features password-protected ceremony pages, RSVP functionality, a gift registry, and much more.

![Wedding Website Screenshot](https://i.imgur.com/placeholder.jpg)

## ✨ Features

- **Dual Ceremony Support**: Separate pages for Christian and Hindu ceremonies with unique designs
- **Password-Protected Access**: Guests can only access the ceremonies they're invited to
- **QR Code Invitations**: Generate custom QR codes for each guest that provide access to their specific ceremonies
- **Multilingual Support**: Available in English, German, and Tamil
- **Responsive Design**: Looks beautiful on all devices
- **RSVP System**: Allow guests to confirm their attendance and select which ceremonies they'll attend
- **Gift Registry**: Integration with common registry services
- **Photo Gallery**: For sharing wedding memories
- **Guest Book**: Let your guests leave messages
- **Admin Dashboard**: Manage guest access and generate QR codes
- **Accommodation Information**: Help out-of-town guests find places to stay

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wedding-website.git
   cd wedding-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Start the backend server (for RSVP and guest management):
   ```bash
   node src/server/server.js
   ```

## 🏗️ Project Structure

```
wedding-website/
├── public/
├── src/
│   ├── api/            # API integration
│   ├── components/     # React components
│   │   ├── admin/      # Admin dashboard
│   │   ├── ceremonies/ # Christian and Hindu ceremony pages
│   │   ├── common/     # Shared components
│   │   ├── gallery/    # Photo gallery components
│   │   ├── gifts/      # Gift registry components
│   │   ├── guestbook/  # Guestbook components
│   │   ├── home/       # Homepage components
│   │   ├── map/        # Map components
│   │   ├── rsvp/       # RSVP form components
│   │   ├── story/      # Our story components
│   │   └── welcome/    # Welcome splash components
│   ├── contexts/       # React contexts
│   ├── data/           # Static data
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Internationalization
│   │   └── locales/    # Translation files
│   ├── server/         # Backend server code
│   ├── styles/         # CSS and styling
│   └── utils/          # Utility functions
└── README.md
```

## 🌈 Customization

### Updating Ceremony Information

Edit the translation files in `src/i18n/locales/` to update ceremony details:

```json
"christian": {
  "title": "Christian Ceremony",
  "dateTime": {
    "date": "July 4, 2026",
    "time": "2:00 PM - 4:00 PM"
  },
  "location": {
    "address1": "Your Church Name",
    "address2": "Church Address"
  }
}
```

### Changing Colors and Theme

The theme colors can be modified in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      'christian': {
        primary: '#f9f7f5',
        secondary: '#e8e6e1',
        accent: '#b08968',
      },
      'hindu': {
        primary: '#fff9e6',
        secondary: '#bc863c',
        accent: '#d93f0b',
      },
    }
  }
}
```

### Adding or Removing Guests

Use the admin dashboard at `/admin` (password: 123) to manage guest access.

## 📱 Deployment

### Option 1: Traditional Web Hosting

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the contents of the `build` directory to your web hosting provider.

### Option 2: Raspberry Pi Self-Hosting

Follow the instructions in `src/server/README.md` to set up the website on a Raspberry Pi.

### Option 3: Vercel/Netlify

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fwedding-website)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/wedding-website)

For these platforms, you'll need to set up a separate backend for the API server.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Tailwind CSS for the styling system
- Framer Motion for the animations
- React-i18next for translations
- React Router for navigation
- The amazing open-source community

## 📸 Screenshots

| Homepage | Ceremonies | Mobile View |
|---------|------------|-------------|
| ![Homepage](https://i.imgur.com/placeholder1.jpg) | ![Ceremonies](https://i.imgur.com/placeholder2.jpg) | ![Mobile](https://i.imgur.com/placeholder3.jpg) |

---

Created with ❤️ for Rushel & Sivani's wedding
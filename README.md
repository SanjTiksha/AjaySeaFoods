# 🐟 Rajesh Fish Market Website

A modern, responsive website for a fish wholesale & retail business built with React, Vite, and Tailwind CSS.

## 🎯 Features

### 🏠 **Home Page**
- Hero banner with compelling tagline
- Featured fish showcase
- Quick contact buttons (Call, WhatsApp)
- Promotional sections

### 🐠 **Fish Catalog**
- Dynamic fish list with rates
- Search and filter functionality
- QR code payment integration
- Print/Download rate sheets
- Stock status indicators

### 👤 **About Us**
- Shop introduction
- Owner profile
- Contact information
- Location details

### 🔑 **Admin Panel**
- Secure login system
- CRUD operations for fish management
- Shop settings management
- Promotions control
- Data backup/restore functionality

### 💳 **QR Payment System**
- Static QR code display
- UPI ID integration
- Deep link support for UPI apps
- Copy UPI ID functionality

### 📱 **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Fast loading times

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fish-webside-17-10-2024
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx       # Site footer
│   ├── FishCard.jsx    # Individual fish display
│   ├── QRModal.jsx     # Payment modal
│   ├── PromoBanner.jsx # Promotional banner
│   ├── AdminLogin.jsx  # Admin authentication
│   ├── AdminPanel.jsx  # Admin dashboard
│   └── FeedbackButton.jsx # Feedback widget
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── About.jsx       # About us page
│   ├── FishCatalog.jsx # Fish listing page
│   ├── Contact.jsx     # Contact page
│   └── Admin.jsx       # Admin page
├── data/               # Data files
│   └── fishData.json   # Fish data and shop info
├── App.jsx             # Main app component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Ocean Blue (#005f73)
- **Secondary**: Coral Red (#ee6c4d)
- **Accent**: Seafoam White (#e0fbfc)
- **Text**: Dark Navy (#001219)

### Typography
- **Font**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons**: Rounded corners (12px), hover effects
- **Cards**: Modern shadows, smooth animations
- **Layout**: Card-based design with consistent spacing

## 🔧 Configuration

### Admin Access
- **Default Password**: `admin123`
- **Access URL**: `/admin`

### Data Management
- Fish data stored in `src/data/fishData.json`
- Admin panel allows CRUD operations
- Export/Import functionality for backups

### Customization
- Update shop information in `fishData.json`
- Modify colors in `tailwind.config.js`
- Add new fish images in `public/images/fish/`

## 📱 Mobile Features

- **Touch-friendly buttons**
- **Swipe gestures** (where applicable)
- **Responsive images**
- **Optimized navigation**
- **Fast loading**

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Deploy to Vercel
1. Import project from GitHub
2. Framework preset: Vite
3. Deploy!

## 🔄 Daily Updates

### Admin Workflow
1. Login to admin panel
2. Update fish rates
3. Modify stock status
4. Update promotions
5. Export data backup

### Data Backup
- Automatic localStorage backup
- Manual export/import functionality
- Version control for data changes

## 🛠️ Technical Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **QR Codes**: qrcode.react
- **PDF Export**: html2canvas + jsPDF
- **Charts**: Chart.js (optional)

## 📞 Support

For technical support or customization requests:
- **Email**: rajeshfishmarket@gmail.com
- **Phone**: +917666293267

## 📄 License

This project is proprietary software developed for Rajesh Fish Market.

---

**Designed by Ajay Sea Foods** 🎨


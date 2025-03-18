# Automatic Attendance System Using Face Recognition

A modern web-based attendance system that uses face recognition technology to automate the attendance marking process.

## Features

- **Face Recognition**: Automatically mark attendance using facial recognition
- **Liveness Detection**: Prevent proxy attendance through blink detection and thermal analysis
- **User Authentication**: Secure login system for students and administrators
- **Subject Selection**: Mark attendance for specific subjects
- **Admin & Student Dashboards**: Role-based dashboards with appropriate features
- **Attendance Reports**: Generate and download attendance reports in PDF format
- **Custom Filters**: Filter attendance data by date, subject, etc.
- **Real-time Tracking**: Track attendance in real-time
- **Notifications**: Receive confirmation notifications for attendance

## Tech Stack

### Backend
- Flask (Python)
- SQLAlchemy (ORM)
- OpenCV (Computer Vision)
- dlib (Face Recognition)
- PyJWT (Authentication)

### Frontend
- React.js
- React Router
- Axios
- Material-UI
- Chart.js (for analytics)

## Project Structure

```
project/
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── static/
│   │   ├── templates/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── routes.py
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── assets/
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── README.md
```

## Setup and Installation

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the application: `python run.py`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Deployment

The application is configured for deployment on:
- Heroku (Backend)
- Render (Frontend)

## Future Enhancements

- Scalability improvements
- External camera integration
- Cloud storage for attendance data
- Enhanced AI-based liveness detection
- Mobile application

## License

MIT

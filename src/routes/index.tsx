import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Layout from '../components/layout/Layout';
import ChatBotPage from '../pages/ChatBot/ChatBotPage';
import AdmissionSchedulePage from '../pages/AdmissionSchedule/AdmissionSchedulePage';
import StaffAdmissionSchedulePage from '../pages/StaffAdmissionSchedule/StaffAdmissionSchedulePage';
import Login from '../pages/Authen/Login';
import Register from '../pages/Authen/Register';
import TestPage from '../pages/Authen/TestPage';
import LoginSimple from '../pages/Authen/LoginSimple';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'admission-schedule',
        element: <AdmissionSchedulePage />
      },
    ]
  },
  {
    path: '/chatbot',
    element: <ChatBotPage />
  },
  {
    path: '/staff/admissionschedule',
    element: <StaffAdmissionSchedulePage />
  },
  {

    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/test',
    element: <TestPage />
  },
  {
    path: '/login-simple',
    element: <LoginSimple />
  }
]);

export default router;
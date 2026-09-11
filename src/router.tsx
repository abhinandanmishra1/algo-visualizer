import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SubjectPage from './pages/SubjectPage';
import VisualizerPage from './pages/VisualizerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'subjects/:subjectId', element: <SubjectPage /> },
      { path: 'subjects/:subjectId/:topicId', element: <VisualizerPage /> },
    ],
  },
]);

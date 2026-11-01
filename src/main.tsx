import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyThemeToDOM } from './utils/themeStorage';

// Apply saved theme settings immediately before render
applyThemeToDOM();

createRoot(document.getElementById('root')!).render(<App />);

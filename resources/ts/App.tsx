import React from 'react';
import { createRoot } from 'react-dom/client';
import FontendRoutes from './FrontendRoutes';

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <FontendRoutes />
    </React.StrictMode>,
);
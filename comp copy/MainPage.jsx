import React, { useState, useMemo, useEffect } from 'react';
import ChatgptPrediction from './ChatgptPrediction';
import Header from './Header';
import PerformancePage from './PerformancePage';
export const MainPage = () => {
    const [activeView, setActiveView] = useState('predictor');

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-200">
            <Header activeView={activeView} setActiveView={setActiveView} />
            <main className="container mx-auto p-4 md:p-6">
                {activeView === 'predictor' && <ChatgptPrediction />}
                {activeView === 'performance' && <PerformancePage />}
            </main>
        </div>
    );
}

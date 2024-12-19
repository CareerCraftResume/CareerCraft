import React, { createContext, useContext, useState } from 'react';
import ResumeAI from '../ai/ResumeAI';
import { useSubscription } from '../contexts/SubscriptionContext';

const AIContext = createContext();

export function AIProvider({ children }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const { subscription } = useSubscription();
    const resumeAI = new ResumeAI(subscription);

    const analyzeResume = async (resumeData) => {
        try {
            setLoading(true);
            resumeAI.setSubscriptionTier(subscription);
            const result = await resumeAI.analyzeResume(resumeData);
            setAnalysis(result);
        } catch (error) {
            console.error('Error in AI analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        analysis,
        loading,
        analyzeResume
    };

    return (
        <AIContext.Provider value={value}>
            {children}
        </AIContext.Provider>
    );
}

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};

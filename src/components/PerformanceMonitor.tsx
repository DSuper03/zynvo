'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

interface MetricData {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating?: string;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    // Performance monitoring placeholder
    // Web Vitals will be enabled once properly configured
    logger.info('Performance monitoring initialized');
    
    
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              logger.info('Navigation timing:', {
                name: entry.name,
                duration: entry.duration,
                startTime: entry.startTime,
              });
            }
          });
        });
        
        observer.observe({ entryTypes: ['navigation'] });
        
        return () => observer.disconnect();
      } catch (error) {
        logger.warn('Performance Observer not supported');
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
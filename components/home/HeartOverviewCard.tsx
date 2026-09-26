'use client';

import React from 'react';
import { PinterestClinicalCockpit } from '@/components/dashboard/PinterestClinicalCockpit';

export const HeartOverviewCard: React.FC = () => {
  return (
    <div className="w-full transition-all duration-500">
      <PinterestClinicalCockpit />
    </div>
  );
};

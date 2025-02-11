import React from 'react';
import { Seasons } from '../lib/types/seasons';
import type { SeasonInfo } from '../lib/types/seasons';
import { seasonsData } from '../lib/data/seasons';

interface ColorAnalysisProps {
  season?: Seasons;
}

const ColorAnalysis: React.FC<ColorAnalysisProps> = ({ season }) => {
  if (!season) return null;

  const seasonInfo: SeasonInfo = seasonsData[season];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className={`text-2xl font-bold mb-4 ${seasonInfo.textColor}`}>
        {season}
      </h3>
      <p className="text-gray-600 mb-6">{seasonInfo.description}</p>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {seasonInfo.colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full shadow-md"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorAnalysis; 
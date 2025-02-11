interface ColorRecommendation {
  color: string;
  name: string;
}

interface ColorRecommendations {
  recommended: ColorRecommendation[];
  avoid: ColorRecommendation[];
}

interface OutfitRecommendations {
  recommended: ColorRecommendation[];
  avoid: ColorRecommendation[];
}

const monkScaleColors = {
  monk1: '#FFF3E1', // Very Light
  monk2: '#FFE0BD',
  monk3: '#FFD1A1',
  monk4: '#FFC183', // Medium Light
  monk5: '#FFB165',
  monk6: '#FFA047',
  monk7: '#FF8F29', // Medium Dark
  monk8: '#FF7E0B',
  monk9: '#FF6D00',
  monk10: '#FF5C00' // Very Dark
};

function findClosestMonkTone(hexColor: string): number {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const differences = Object.entries(monkScaleColors).map(([monk, color]) => {
    const mr = parseInt(color.slice(1, 3), 16);
    const mg = parseInt(color.slice(3, 5), 16);
    const mb = parseInt(color.slice(5, 7), 16);

    const diff = Math.sqrt(
      Math.pow(r - mr, 2) + Math.pow(g - mg, 2) + Math.pow(b - mb, 2)
    );

    return { monk: parseInt(monk.replace('monk', '')), difference: diff };
  });

  return differences.reduce((prev, curr) => 
    curr.difference < prev.difference ? curr : prev
  ).monk;
}

export function getRecommendedColors(skinToneHex: string): ColorRecommendations {
  const monkTone = findClosestMonkTone(skinToneHex);

  if (monkTone <= 3) {
    return {
      recommended: [
        { color: '#FF6B6B', name: 'Coral Red' },
        { color: '#4ECDC4', name: 'Turquoise' },
        { color: '#45B7D1', name: 'Ocean Blue' },
        { color: '#96CEB4', name: 'Sage Green' },
        { color: '#FFAFCC', name: 'Soft Pink' },
        { color: '#9B5DE5', name: 'Royal Purple' }
      ],
      avoid: [
        { color: '#FFD700', name: 'Bright Yellow' },
        { color: '#FF4500', name: 'Orange Red' },
        { color: '#32CD32', name: 'Lime Green' },
        { color: '#FF1493', name: 'Deep Pink' }
      ]
    };
  }
  else if (monkTone <= 6) {
    return {
      recommended: [
        { color: '#D35F5F', name: 'Terra Cotta' },
        { color: '#2B7B78', name: 'Deep Teal' },
        { color: '#5F87D3', name: 'Steel Blue' },
        { color: '#79A98B', name: 'Sage' },
        { color: '#D6A3C5', name: 'Dusty Rose' },
        { color: '#8B63A6', name: 'Plum Purple' }
      ],
      avoid: [
        { color: '#FFE135', name: 'Bright Yellow' },
        { color: '#FF4D00', name: 'Orange Red' },
        { color: '#39FF14', name: 'Neon Green' },
        { color: '#FF1493', name: 'Hot Pink' }
      ]
    };
  }
  else {
    return {
      recommended: [
        { color: '#FFD700', name: 'Gold' },
        { color: '#FF4500', name: 'Orange Red' },
        { color: '#00FF7F', name: 'Spring Green' },
        { color: '#FF1493', name: 'Deep Pink' },
        { color: '#4B0082', name: 'Indigo' },
        { color: '#FF8C00', name: 'Dark Orange' }
      ],
      avoid: [
        { color: '#FFE4E1', name: 'Misty Rose' },
        { color: '#F0E68C', name: 'Khaki' },
        { color: '#E6E6FA', name: 'Lavender' },
        { color: '#F5DEB3', name: 'Wheat' }
      ]
    };
  }
}

export function getOutfitRecommendations(skinToneHex: string): OutfitRecommendations {
  const monkTone = findClosestMonkTone(skinToneHex);
  
  if (monkTone <= 3) {
    return {
      recommended: [
        { color: '#000080', name: 'Navy Blue' },
        { color: '#800000', name: 'Maroon' },
        { color: '#556B2F', name: 'Olive Green' },
        { color: '#4B0082', name: 'Indigo' }
      ],
      avoid: [
        { color: '#FFFF00', name: 'Yellow' },
        { color: '#FF4500', name: 'Orange Red' },
        { color: '#FF69B4', name: 'Hot Pink' },
        { color: '#00FF00', name: 'Lime' }
      ]
    };
  }
  else if (monkTone <= 6) {
    return {
      recommended: [
        { color: '#8B4513', name: 'Saddle Brown' },
        { color: '#006400', name: 'Dark Green' },
        { color: '#483D8B', name: 'Dark Slate Blue' },
        { color: '#800000', name: 'Maroon' }
      ],
      avoid: [
        { color: '#FFB6C1', name: 'Light Pink' },
        { color: '#98FB98', name: 'Pale Green' },
        { color: '#87CEEB', name: 'Sky Blue' },
        { color: '#DDA0DD', name: 'Plum' }
      ]
    };
  }
  else {
    return {
      recommended: [
        { color: '#FFD700', name: 'Gold' },
        { color: '#FF0000', name: 'Red' },
        { color: '#00FF00', name: 'Lime' },
        { color: '#FF1493', name: 'Deep Pink' }
      ],
      avoid: [
        { color: '#F0E68C', name: 'Khaki' },
        { color: '#E6E6FA', name: 'Lavender' },
        { color: '#FFE4E1', name: 'Misty Rose' },
        { color: '#F5DEB3', name: 'Wheat' }
      ]
    };
  }
}
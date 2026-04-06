import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const TRANSLATION_MAP = {
  // Tops
  'jersey': { category: 'Tops', subCategory: 'T-shirt' },
  't-shirt': { category: 'Tops', subCategory: 'T-shirt' },
  'shirt': { category: 'Tops', subCategory: 'Shirt' },
  'blouse': { category: 'Tops', subCategory: 'Blouse' },
  'sweatshirt': { category: 'Tops', subCategory: 'Hoodie' },
  'hoodie': { category: 'Tops', subCategory: 'Hoodie' },
  'sweater': { category: 'Tops', subCategory: 'Sweater' },
  'coat': { category: 'Tops', subCategory: 'Coat' },
  'jacket': { category: 'Tops', subCategory: 'Jacket' },
  'cardigan': { category: 'Tops', subCategory: 'Cardigan' },
  'polo shirt': { category: 'Tops', subCategory: 'Polo Shirt' },
  'jean': { category: 'Tops', subCategory: 'Jacket' },
  'lab coat': { category: 'Tops', subCategory: 'Coat' },
  'gown': { category: 'Tops', subCategory: 'Dress' },
  'maillot': { category: 'Tops', subCategory: 'Tank Top' },
  'tank top': { category: 'Tops', subCategory: 'Tank Top' },
  
  // Bottoms
  'jeans': { category: 'Bottoms', subCategory: 'Jeans' },
  'jean': { category: 'Bottoms', subCategory: 'Jeans' },
  'trousers': { category: 'Bottoms', subCategory: 'Trousers' },
  'pants': { category: 'Bottoms', subCategory: 'Trousers' },
  'shorts': { category: 'Bottoms', subCategory: 'Shorts' },
  'skirt': { category: 'Bottoms', subCategory: 'Skirt' },
  'miniskirt': { category: 'Bottoms', subCategory: 'Skirt' },
  'dress': { category: 'Bottoms', subCategory: 'Skirt' },
  'swimsuit': { category: 'Bottoms', subCategory: 'Shorts' },
  'bikini': { category: 'Bottoms', subCategory: 'Shorts' },
  'brassiere': { category: 'Bottoms', subCategory: 'Shorts' },
  'legging': { category: 'Bottoms', subCategory: 'Leggings' },
  'sock': { category: 'Bottoms', subCategory: 'Leggings' },
  
  // Shoes
  'sneaker': { category: 'Shoes', subCategory: 'Sneakers' },
  'shoe': { category: 'Shoes', subCategory: 'Sneakers' },
  'running shoe': { category: 'Shoes', subCategory: 'Sneakers' },
  'loafer': { category: 'Shoes', subCategory: 'Loafers' },
  'sandal': { category: 'Shoes', subCategory: 'Sandals' },
  'sandal': { category: 'Shoes', subCategory: 'Sandals' },
  'boot': { category: 'Shoes', subCategory: 'Boots' },
  'shoe': { category: 'Shoes', subCategory: 'Shoes' },
  'heel': { category: 'Shoes', subCategory: 'Heels' },
  'shoe': { category: 'Shoes', subCategory: 'Sneakers' },
  'basketball shoe': { category: 'Shoes', subCategory: 'Sneakers' },
  'tennis shoe': { category: 'Shoes', subCategory: 'Sneakers' },
  'moccasin': { category: 'Shoes', subCategory: 'Loafers' },
  ' clog': { category: 'Shoes', subCategory: 'Sandals' },
  'low shoe': { category: 'Shoes', subCategory: 'Sneakers' },
  
  // Accessories
  'watch': { category: 'Accessories', subCategory: 'Watch' },
  'sunglasses': { category: 'Accessories', subCategory: 'Sunglasses' },
  'glasses': { category: 'Accessories', subCategory: 'Sunglasses' },
  'hat': { category: 'Accessories', subCategory: 'Hat' },
  'cap': { category: 'Accessories', subCategory: 'Hat' },
  'scarf': { category: 'Accessories', subCategory: 'Scarf' },
  'belt': { category: 'Accessories', subCategory: 'Belt' },
  'bag': { category: 'Accessories', subCategory: 'Bag' },
  'handbag': { category: 'Accessories', subCategory: 'Bag' },
  'purse': { category: 'Accessories', subCategory: 'Bag' },
  'backpack': { category: 'Accessories', subCategory: 'Bag' },
  'wallet': { category: 'Accessories', subCategory: 'Bag' },
  'briefcase': { category: 'Accessories', subCategory: 'Bag' },
  'umbrella': { category: 'Accessories', subCategory: 'Accessory' },
  'tie': { category: 'Accessories', subCategory: 'Accessory' },
  'bow tie': { category: 'Accessories', subCategory: 'Accessory' },
  'glove': { category: 'Accessories', subCategory: 'Accessory' },
  'wig': { category: 'Accessories', subCategory: 'Accessory' },
  'brassiere': { category: 'Accessories', subCategory: 'Accessory' },
  'miniskirt': { category: 'Bottoms', subCategory: 'Skirt' },
};

const COLORS = ['White', 'Black', 'Navy', 'Beige', 'Gray', 'Blue', 'Red', 'Green', 'Pink', 'Brown'];
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const STYLES = ['Casual', 'Formal', 'Sporty', 'Vintage'];

export const useImageClassifier = () => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const modelRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const mobilenetModel = await mobilenet.load({
          version: 2,
          alpha: 1.0
        });
        modelRef.current = mobilenetModel;
        setModel(mobilenetModel);
      } catch (error) {
        console.error('Failed to load MobileNet:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  const classifyImage = async (imageElement) => {
    if (!modelRef.current) {
      throw new Error('Model not loaded');
    }

    const predictions = await modelRef.current.classify(imageElement);
    return predictions;
  };

  const translateToClothing = (predictions) => {
    const topPrediction = predictions[0]?.className?.toLowerCase() || '';
    
    let matched = null;
    let bestScore = 0;

    for (const [key, value] of Object.entries(TRANSLATION_MAP)) {
      if (topPrediction.includes(key)) {
        matched = value;
        bestScore = predictions[0]?.probability || 0;
        break;
      }
    }

    if (!matched) {
      const categories = ['Tops', 'Bottoms', 'Shoes', 'Accessories'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const subCategories = {
        Tops: ['T-shirt', 'Shirt', 'Hoodie', 'Blouse'],
        Bottoms: ['Jeans', 'Trousers', 'Shorts', 'Skirt'],
        Shoes: ['Sneakers', 'Loafers', 'Boots', 'Sandals'],
        Accessories: ['Watch', 'Sunglasses', 'Hat', 'Bag'],
      };
      
      matched = {
        category: randomCategory,
        subCategory: subCategories[randomCategory][Math.floor(Math.random() * subCategories[randomCategory].length)]
      };
    }

    return {
      category: matched.category,
      subCategory: matched.subCategory,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      season: SEASONS[Math.floor(Math.random() * SEASONS.length)],
      style: STYLES[Math.floor(Math.random() * STYLES.length)],
      confidence: bestScore,
    };
  };

  const recognizeClothing = async (imageElement) => {
    const predictions = await classifyImage(imageElement);
    const clothingData = translateToClothing(predictions);
    return clothingData;
  };

  return {
    model,
    isLoading,
    recognizeClothing,
  };
};

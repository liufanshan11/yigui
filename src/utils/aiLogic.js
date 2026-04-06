export const generateWeather = () => {
  const conditions = ['晴', '多云', '阴'];
  const temps = [22, 24, 26, 28, 30];
  return {
    temp: temps[Math.floor(Math.random() * temps.length)],
    condition: conditions[Math.floor(Math.random() * conditions.length)],
  };
};

export const getOutfitSuggestion = (weather) => {
  const { temp, condition } = weather;
  
  if (temp >= 28) {
    return '今天气温较高，适合穿轻薄透气的衣物，推荐短袖T恤搭配短裤或短裙。';
  } else if (temp >= 22) {
    return '天气温和舒适，适合穿长袖衬衫或薄外套搭配牛仔裤。';
  } else if (temp >= 15) {
    return '早晚温差较大，建议搭配一件薄外套或卫衣。';
  } else {
    return '天气较凉，建议穿厚外套或毛衣，注意保暖。';
  }
};

export const analyzeWardrobe = (items) => {
  const issues = [];
  const suggestions = [];
  let score = 100;

  const hasWhiteTshirt = items.some(
    (item) => item.category === 'Tops' && item.subCategory === 'T-shirt' && item.color === 'White'
  );
  if (!hasWhiteTshirt) {
    issues.push('你缺少一件百搭的白色T恤');
    suggestions.push('白色T恤是衣橱必备单品，适合各种搭配场景');
    score -= 15;
  }

  const tops = items.filter((item) => item.category === 'Tops');
  const bottoms = items.filter((item) => item.category === 'Bottoms');
  const shoes = items.filter((item) => item.category === 'Shoes');
  const accessories = items.filter((item) => item.category === 'Accessories');

  if (tops.length > 5 && bottoms.length < 3) {
    issues.push('你的下装数量不足，难以搭配');
    suggestions.push('建议添加 2-3 条裤子或裙子');
    score -= 10;
  }

  if (bottoms.length > 5 && tops.length < 3) {
    issues.push('你的上装数量不足');
    suggestions.push('建议添加几件上衣');
    score -= 10;
  }

  const styles = items.map((item) => item.style);
  const hasFormal = styles.includes('Formal');
  if (!hasFormal && items.length > 10) {
    issues.push('缺少正式风格衣物');
    suggestions.push('建议添加一件衬衫或西装裤，适合通勤场合');
    score -= 15;
  }

  const hasSummer = items.some((item) => item.season === 'Summer');
  const hasWinter = items.some((item) => item.season === 'Winter');
  if (!hasSummer) {
    suggestions.push('可考虑添加夏季单品');
    score -= 10;
  }
  if (!hasWinter) {
    suggestions.push('可考虑添加冬季单品');
    score -= 10;
  }

  if (shoes.length < 2) {
    issues.push('鞋子种类不足');
    suggestions.push('建议至少准备3双不同风格的鞋子');
    score -= 10;
  }

  if (accessories.length < 2) {
    suggestions.push('可以添加一些配饰来提升整体穿搭层次感');
    score -= 5;
  }

  return {
    score: Math.max(score, 20),
    issues,
    suggestions,
  };
};

export const generateOutfit = (items, scene, temperature) => {
  const tops = items.filter((item) => item.category === 'Tops');
  const bottoms = items.filter((item) => item.category === 'Bottoms');
  const shoes = items.filter((item) => item.category === 'Shoes');
  const accessories = items.filter((item) => item.category === 'Accessories');

  let preferredSeasons = [];
  if (temperature > 25) {
    preferredSeasons = ['Summer', 'Spring'];
  } else if (temperature >= 15) {
    preferredSeasons = ['Spring', 'Autumn'];
  } else {
    preferredSeasons = ['Autumn', 'Winter'];
  }

  let preferredStyles = [];
  switch (scene) {
    case 'commute':
      preferredStyles = ['Formal', 'Casual'];
      break;
    case 'date':
      preferredStyles = ['Vintage', 'Casual'];
      break;
    case 'sport':
      preferredStyles = ['Sporty', 'Casual'];
      break;
    default:
      preferredStyles = ['Casual'];
  }

  const filterByPreference = (itemList, preferred) => {
    const preferredItems = itemList.filter((item) => preferred.includes(item.style));
    if (preferredItems.length > 0) {
      return preferredItems;
    }
    return itemList;
  };

  const filteredTops = filterByPreference(tops, preferredStyles);
  const filteredBottoms = filterByPreference(bottoms, preferredStyles);
  const filteredShoes = filterByPreference(shoes, preferredStyles);
  const filteredAccessories = filterByPreference(accessories, preferredStyles);

  const getRandomItem = (arr) => {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const generateSet = () => {
    const top = getRandomItem(filteredTops.length ? filteredTops : tops);
    const bottom = getRandomItem(filteredBottoms.length ? filteredBottoms : bottoms);
    const shoe = getRandomItem(filteredShoes.length ? filteredShoes : shoes);
    const accessory = getRandomItem(filteredAccessories.length ? filteredAccessories : accessories);

    return {
      top,
      bottom,
      shoes: shoe,
      accessory,
    };
  };

  const outfits = [];
  const usedCombos = new Set();

  let attempts = 0;
  const maxAttempts = 20;

  while (outfits.length < 3 && attempts < maxAttempts) {
    attempts++;
    const set = generateSet();
    const comboKey = `${set.top?.id}-${set.bottom?.id}-${set.shoes?.id}-${set.accessory?.id}`;
    
    if (!usedCombos.has(comboKey) && set.top && set.bottom && set.shoes) {
      usedCombos.add(comboKey);
      outfits.push(set);
    }
  }

  return outfits;
};

export const recognizeClothing = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = ['Tops', 'Bottoms', 'Shoes', 'Accessories'];
      const subCategories = {
        Tops: ['T-shirt', 'Shirt', 'Hoodie', 'Blouse', 'Sweater'],
        Bottoms: ['Jeans', 'Trousers', 'Shorts', 'Skirt'],
        Shoes: ['Sneakers', 'Loafers', 'Boots', 'Sandals'],
        Accessories: ['Watch', 'Sunglasses', 'Hat', 'Bag'],
      };
      const colors = ['White', 'Black', 'Navy', 'Beige', 'Gray', 'Blue', 'Brown'];
      const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
      const styles = ['Casual', 'Formal', 'Sporty', 'Vintage'];

      const category = categories[Math.floor(Math.random() * categories.length)];
      const subCategory = subCategories[category][Math.floor(Math.random() * subCategories[category].length)];
      
      resolve({
        category,
        subCategory,
        color: colors[Math.floor(Math.random() * colors.length)],
        season: seasons[Math.floor(Math.random() * seasons.length)],
        style: styles[Math.floor(Math.random() * styles.length)],
      });
    }, 1500);
  });
};

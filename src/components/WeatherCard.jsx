import { useState, useEffect } from 'react';
import { Sun, CloudRain, Cloudy, MapPin, Loader2 } from 'lucide-react';

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const [weatherRes, geocodeRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius`),
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        ]);

        const weatherData = await weatherRes.json();
        const geocodeData = await geocodeRes.json();

        const city = geocodeData.address?.city || geocodeData.address?.town || geocodeData.address?.village || '未知';
        setLocation(city);

        const code = weatherData.current?.weather_code || 0;
        const temp = Math.round(weatherData.current?.temperature_2m || 0);

        const weatherMap = {
          0: { condition: '晴', icon: 'sun', tempDesc: '阳光明媚' },
          1: { condition: '晴', icon: 'sun', tempDesc: '晴朗' },
          2: { condition: '多云', icon: 'cloudy', tempDesc: '多云' },
          3: { condition: '阴', icon: 'cloudy', tempDesc: '阴天' },
          45: { condition: '雾', icon: 'cloudy', tempDesc: '有雾' },
          48: { condition: '雾', icon: 'cloudy', tempDesc: '雾' },
          51: { condition: '小雨', icon: 'rain', tempDesc: '有小雨' },
          53: { condition: '中雨', icon: 'rain', tempDesc: '有雨' },
          55: { condition: '大雨', icon: 'rain', tempDesc: '大雨' },
          61: { condition: '雨', icon: 'rain', tempDesc: '有雨' },
          71: { condition: '雪', icon: 'snow', tempDesc: '有雪' },
          80: { condition: '阵雨', icon: 'rain', tempDesc: '阵雨' },
          81: { condition: '大雨', icon: 'rain', tempDesc: '大雨' },
          95: { condition: '雷暴', icon: 'storm', tempDesc: '雷暴' },
        };

        const weatherInfo = weatherMap[code] || { condition: '晴', icon: 'sun', tempDesc: '未知' };

        setWeather({
          temp,
          ...weatherInfo,
          suggestion: getSuggestion(temp)
        });
      } catch (err) {
        console.error('Weather fetch error:', err);
        setWeather(getMockWeather());
      } finally {
        setLoading(false);
      }
    };

    const getSuggestion = (temp) => {
      if (temp >= 30) return '高温预警，建议穿着轻薄透气材质';
      if (temp >= 25) return '气温舒适，适合简约轻便穿搭';
      if (temp >= 18) return '早晚温差渐显，可搭配薄外套';
      if (temp >= 10) return '天气微凉，建议叠穿保暖';
      return '气温较低，注意防寒保暖';
    };

    const getMockWeather = () => ({
      temp: 24,
      condition: '晴',
      tempDesc: '阳光明媚',
      suggestion: '今日天气宜人，适合简约舒适的穿搭'
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeather(39.9042, 116.4074);
        }
      );
    } else {
      fetchWeather(39.9042, 116.4074);
    }
  }, []);

  const getWeatherIcon = (icon) => {
    const iconClass = "w-14 h-14";
    switch (icon) {
      case 'sun': return <Sun className={`${iconClass} text-amber-500`} />;
      case 'cloudy': return <Cloudy className={`${iconClass} text-slate-400`} />;
      case 'rain': return <CloudRain className={`${iconClass} text-blue-400`} />;
      case 'storm': return <CloudRain className={`${iconClass} text-indigo-500`} />;
      default: return <Sun className={`${iconClass} text-amber-500`} />;
    }
  };

  if (loading) {
    return (
      <div className="premium-card p-6 flex items-center justify-center min-h-[180px]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-900 text-white p-6 lg:p-8 min-h-[180px] lg:min-h-[220px] shadow-2xl shadow-slate-900/25">
      <div className="absolute inset-0 opacity-35">
        <div className="absolute top-0 right-0 w-52 h-52 bg-amber-300 rounded-full blur-3xl transform translate-x-10 -translate-y-10 animate-float" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-cyan-400 rounded-full blur-3xl transform -translate-x-10 translate-y-10 animate-float" />
      </div>

      <div className="absolute top-8 right-4 h-[1px] w-40 bg-gradient-to-r from-white/5 via-white/55 to-white/5 rotate-12 animate-pulse-soft" />
      <div className="absolute bottom-8 left-2 h-[1px] w-36 bg-gradient-to-r from-white/5 via-cyan-200/60 to-white/5 -rotate-12 animate-pulse-soft" />

      <div className="absolute inset-0 opacity-25">
        <svg className="w-full h-full" viewBox="0 0 500 250" preserveAspectRatio="none">
          <path d="M0,210 C120,140 210,240 340,175 C410,140 455,168 500,136" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" />
          <path d="M0,224 C100,164 212,246 330,194 C410,160 442,186 500,160" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
        </svg>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl lg:text-7xl font-light tracking-tight">{weather?.temp}</span>
              <span className="text-3xl text-white/60">°</span>
            </div>
            <p className="text-cyan-100 text-base mt-2">{weather?.condition} · {weather?.tempDesc}</p>
          </div>
          <div className="animate-float">
            {getWeatherIcon(weather?.icon)}
          </div>
        </div>

        <div className="mt-5 lg:mt-6 pt-4 lg:pt-5 border-t border-white/10">
          <p className="text-base text-white/90 leading-relaxed">
            {weather?.suggestion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

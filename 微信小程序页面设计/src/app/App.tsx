import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Sun, Cloud, CloudRain, CloudSnow, ChevronRight } from 'lucide-react';
import { mockForecast } from './components/data';

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// 极简线稿单色天气图标
const WeatherIcon = ({ status, className }: { status: string, className?: string }) => {
  const baseClass = `text-slate-700 ${className}`;
  switch (status) {
    case 'sunny': return <Sun className={baseClass} strokeWidth={1.5} />;
    case 'cloudy': return <Cloud className={baseClass} strokeWidth={1.5} />;
    case 'partly-cloudy': return <CloudSnow className={baseClass} strokeWidth={1.5} />;
    case 'rainy': return <CloudRain className={baseClass} strokeWidth={1.5} />;
    default: return <Sun className={baseClass} strokeWidth={1.5} />;
  }
};

// 生成24小时气象数据
const generate24h = (baseTemp: number, weather: string) => {
  const patterns: Record<string, (h: number) => any> = {
    'sunny': (h: number) => {
      const temp = Math.round(baseTemp + Math.sin(((h - 6) / 24) * Math.PI * 2) * 6);
      const cloud = h >= 14 && h <= 17 ? 10 : (h >= 10 && h <= 18 ? 5 : 0);
      return { icon: 'sunny', totalCloud: cloud, highCloud: cloud, midCloud: 0, lowCloud: 0, temp, precip: 0, humidity: Math.max(25, 40 - Math.round(temp / 3)), wind: 1 + (h >= 12 && h <= 16 ? 1 : 0) };
    },
    'cloudy': (h: number) => {
      const temp = Math.round(baseTemp + Math.sin(((h - 6) / 24) * Math.PI * 2) * 5);
      const cloud = 50 + (h % 3 === 0 ? 15 : (h % 3 === 1 ? 10 : 5));
      return { icon: 'cloudy', totalCloud: cloud, highCloud: Math.round(cloud * 0.5), midCloud: Math.round(cloud * 0.35), lowCloud: Math.round(cloud * 0.15), temp, precip: 0, humidity: Math.max(45, 65 - Math.round(temp / 4)), wind: 2 + (h >= 14 && h <= 20 ? 2 : 1) };
    },
    'partly-cloudy': (h: number) => {
      const temp = Math.round(baseTemp + Math.sin(((h - 6) / 24) * Math.PI * 2) * 5);
      const cloud = 20 + (h >= 12 && h <= 18 ? 20 : (h >= 8 && h <= 20 ? 10 : 5));
      return { icon: cloud > 30 ? 'partly-cloudy' : 'sunny', totalCloud: cloud, highCloud: Math.round(cloud * 0.6), midCloud: Math.round(cloud * 0.3), lowCloud: Math.round(cloud * 0.1), temp, precip: 0, humidity: Math.max(35, 55 - Math.round(temp / 4)), wind: 2 + (h >= 12 && h <= 18 ? 1 : 0) };
    },
    'rainy': (h: number) => {
      const temp = Math.round(baseTemp + Math.sin(((h - 6) / 24) * Math.PI * 2) * 4);
      const cloud = 80 + (h >= 15 && h <= 22 ? 15 : 5);
      return { icon: cloud > 85 ? 'rainy' : 'cloudy', totalCloud: cloud, highCloud: Math.round(cloud * 0.55), midCloud: Math.round(cloud * 0.45), lowCloud: Math.round(cloud * 0.3), temp, precip: cloud > 85 ? Math.round((cloud - 80) * 0.2 * 10) / 10 : 0, humidity: Math.max(65, 85 - Math.round(temp / 5)), wind: 3 + (h >= 15 && h <= 22 ? 3 : 1) };
    }
  };

  const pattern = patterns[weather] || patterns['sunny'];

  return Array.from({ length: 24 }, (_, h) => {
    const time = h.toString().padStart(2, '0');
    const result = pattern(h);
    return { time, ...result };
  });
};

const allDetailedData = [
  generate24h(14, 'cloudy'),        // 06-04 多云
  generate24h(16, 'sunny'),         // 06-05 晴
  generate24h(15, 'partly-cloudy'), // 06-06 局部多云
  generate24h(12, 'rainy'),         // 06-07 雨
  generate24h(17, 'sunny'),         // 06-08 晴
  generate24h(18, 'sunny'),         // 06-09 晴
  generate24h(15, 'partly-cloudy'), // 06-10 局部多云
];

export default function App() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [baseDate, setBaseDate] = useState(new Date());

  // 每分钟检查日期是否变化，过了0点自动顺延
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== baseDate.getDate() || now.getMonth() !== baseDate.getMonth()) {
        setBaseDate(now);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [baseDate]);

  // 基于真实日期生成7日预报
  const forecastData = React.useMemo(() => {
    return mockForecast.map((item, idx) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + idx);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const date = d.getDate().toString().padStart(2, '0');

      let dayLabel = '';
      if (idx === 0) dayLabel = '今天';
      else if (idx === 1) dayLabel = '明天';
      else if (idx === 2) dayLabel = '后天';
      else dayLabel = weekDays[d.getDay()];

      return {
        ...item,
        date: `${month}-${date}`,
        day: dayLabel,
      };
    });
  }, [baseDate]);

  // 当天只展示当前时刻及之后的数据，其他日期展示全天
  const displayData = React.useMemo(() => {
    const data = allDetailedData[selectedDayIndex];
    if (selectedDayIndex !== 0) return data;

    const now = new Date().getHours();
    const idx = data.findIndex(d => parseInt(d.time) >= now);
    if (idx === -1) return data;
    return data.slice(idx);
  }, [selectedDayIndex, baseDate]);

  const gridCols = `60px repeat(${displayData.length}, 44px)${selectedDayIndex < forecastData.length - 1 ? ' 60px' : ''}`;
  
  // 表格行配置
  const tableRows = [
    { 
      id: 'time', 
      height: 'h-10',
      renderLabel: () => <div className="h-full w-full flex items-center justify-center font-medium text-slate-700 bg-[#EBE8DD]">时间</div>,
      render: (d: any) => (
        <div className="h-full w-full flex items-center justify-center text-[12px] font-bold text-slate-700 bg-[#F8F8F5]">
          {d.time}
        </div>
      ) 
    },
    { 
      id: 'icon', 
      height: 'h-10',
      renderLabel: () => <div className="h-full w-full flex items-center justify-center font-medium text-slate-700 bg-[#EBE8DD]">天气</div>,
      render: (d: any) => (
        <div className="h-full w-full flex items-center justify-center bg-[#F8F8F5]">
          <WeatherIcon status={d.icon} className="w-5 h-5" />
        </div>
      ) 
    },
    {
      id: 'clouds',
      height: 'h-[140px]',
      renderLabel: () => (
        <div className="h-full w-full flex flex-col bg-[#EBE8DD] font-medium text-slate-700">
          <div className="h-7 flex items-center justify-center text-[10px] tracking-wide">总云量</div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center text-[10px] text-slate-600">高云</div>
            <div className="flex-1 flex items-center justify-center text-[10px] text-slate-600">中云</div>
            <div className="flex-1 flex items-center justify-center text-[10px] text-slate-600">低云</div>
          </div>
        </div>
      ),
      render: (d: any) => (
        <div className="h-full w-full flex flex-col bg-[#F8F8F5]">
          {/* Total Cloud Number */}
          <div className="h-7 w-full flex items-center justify-center">
            <span className="text-[11px] font-bold text-slate-700">{d.totalCloud}<span className="text-[9px] font-normal text-slate-400 ml-[1px]">%</span></span>
          </div>
          
          {/* High Cloud Stack (Top) - 晨雾燕麦灰 */}
          <div className="flex-1 relative w-full overflow-hidden">
            <div 
              className="absolute bottom-0 w-full transition-all duration-300" 
              style={{ height: `${d.highCloud}%`, backgroundColor: '#EAE7E0' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {d.highCloud > 0 && <span className="text-[10px] font-bold text-slate-900 leading-none">{d.highCloud}</span>}
            </div>
          </div>
          
          {/* Mid Cloud Stack (Middle) - 浅灰卡其 */}
          <div className="flex-1 relative w-full overflow-hidden">
            <div 
              className="absolute bottom-0 w-full transition-all duration-300" 
              style={{ height: `${d.midCloud}%`, backgroundColor: '#D5D2CA' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {d.midCloud > 0 && <span className="text-[10px] font-bold text-slate-900 leading-none">{d.midCloud}</span>}
            </div>
          </div>
          
          {/* Low Cloud Stack (Bottom) - 深岩石灰 */}
          <div className="flex-1 relative w-full overflow-hidden">
            <div 
              className="absolute bottom-0 w-full transition-all duration-300" 
              style={{ height: `${d.lowCloud}%`, backgroundColor: '#BCB9B0' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {d.lowCloud > 0 && <span className="text-[10px] font-bold text-slate-900 leading-none">{d.lowCloud}</span>}
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'temp', 
      height: 'h-[34px]',
      renderLabel: () => <div className="h-full w-full flex items-center justify-center font-medium text-slate-700 bg-[#EBE8DD] text-[11px]">气温(℃)</div>,
      render: (d: any) => (
        <div className="h-full w-full flex items-center justify-center font-bold text-slate-700 text-[12px]" 
             style={{ backgroundColor: '#F5E8D8' }}>
          {d.temp}
        </div>
      ) 
    },
    { 
      id: 'precip', 
      height: 'h-[34px]',
      renderLabel: () => <div className="h-full w-full flex items-center justify-center font-medium text-slate-700 bg-[#EBE8DD] text-[10px]">降水(mm)</div>,
      render: (d: any) => (
        <div className="h-full w-full flex items-center justify-center font-bold text-slate-700 text-[12px]" 
             style={{ backgroundColor: '#D6E0DD' }}>
          {d.precip}
        </div>
      ) 
    },
    { 
      id: 'humidity', 
      height: 'h-[34px]',
      renderLabel: () => <div className="h-full w-full flex items-center justify-center font-medium text-slate-700 bg-[#EBE8DD] text-[11px]">湿度(%)</div>,
      render: (d: any) => (
        <div className="h-full w-full flex items-center justify-center font-bold text-slate-700 text-[12px]" 
             style={{ backgroundColor: '#DBDEE6' }}>
          {d.humidity}
        </div>
      ) 
    },
    { 
      id: 'wind', 
      height: 'h-[34px]',
      renderLabel: () => <div className="h-full w-full flex items-center justify-center font-medium text-slate-700 bg-[#EBE8DD] text-[11px]">风速</div>,
      render: (d: any) => (
        <div className="h-full w-full flex items-center justify-center font-bold text-slate-700 text-[12px]" 
             style={{ backgroundColor: '#E6E4D1' }}>
          {d.wind}
        </div>
      ) 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 sm:flex sm:items-center sm:justify-center sm:p-8 font-sans text-slate-800">
      
      {/* Mobile Screen Container */}
      <div 
        className="w-full min-h-screen sm:min-h-0 sm:w-[390px] sm:h-[844px] sm:rounded-[40px] relative overflow-x-hidden overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:border-[6px] sm:border-slate-800"
        style={{ background: 'linear-gradient(to bottom, #FFF6F0 0%, #DDF1F5 100%)' }}
      >
        
        {/* Safe Area Top / Header Section */}
        <div className="pt-16 pb-6 px-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-slate-800 mb-2">
            <MapPin className="w-5 h-5" />
            <h1 className="text-[22px] font-bold tracking-tight">梅里雪山</h1>
          </div>
          <div className="text-[13px] font-medium text-slate-600 mb-1">
            {baseDate.getFullYear()}年 {baseDate.getMonth() + 1}月 {baseDate.getDate()}日 {weekDays[baseDate.getDay()]}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            更新时间: {forecastData[0].date} {new Date().getHours().toString().padStart(2, '0')}:00
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 pb-12 space-y-4">
          
          {/* Middle Section: Two Glass Widgets (Ratio 3:1) */}
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3 bg-white/50 backdrop-blur-xl rounded-[24px] p-5 flex flex-col border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="text-[13px] font-semibold text-slate-500 mb-2">明日日出概率</div>
              <div className="flex justify-between items-center flex-1">
                <div className="flex flex-col items-start">
                  <Sun className="w-10 h-10 text-slate-700 mb-2" strokeWidth={1.5} />
                  <div className="text-[42px] font-bold text-slate-800 leading-none tracking-tight">
                    68<span className="text-lg font-semibold text-slate-500 ml-0.5">%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 font-medium">预计可见日出，云量较少</div>
                </div>

                <div className="flex flex-col items-center pr-2">
                  <div className="w-2 h-20 bg-slate-200/60 rounded-full relative">
                    <div className="absolute w-3 h-3 bg-[#FF3B30] rounded-full left-1/2 shadow-sm" style={{ bottom: '68%', transform: 'translate(-50%, 50%)' }} />
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 mt-2.5 tracking-wide uppercase">Medium</div>
                </div>
              </div>
            </div>

            <div className="col-span-1 bg-white/50 backdrop-blur-xl rounded-[24px] py-5 px-2 flex flex-col items-center border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="flex-1 flex flex-col justify-center items-center w-full">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[10px] font-medium text-slate-500">日出</div>
                  <div className="text-[14px] font-bold text-slate-700 leading-none">06:34</div>
                </div>
                <div className="w-8 h-px bg-slate-200/50 my-4"></div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[10px] font-medium text-slate-500">日落</div>
                  <div className="text-[14px] font-bold text-slate-700 leading-none">20:12</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section 1: 7-Day Forecast (Card) */}
          <div className="bg-white/50 backdrop-blur-xl rounded-[24px] p-4 pb-3 border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            <h3 className="text-[15px] font-bold text-slate-800 mb-4 pl-1">七日预报</h3>
            
            <div className="flex justify-between items-end">
              {forecastData.map((day, idx) => (
                <div 
                  key={day.id} 
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex flex-col items-center flex-1 pt-2 pb-1.5 rounded-[16px] transition-colors cursor-pointer ${
                    idx === selectedDayIndex ? 'bg-slate-500/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]' : 'hover:bg-slate-500/5'
                  }`}
                >
                  <WeatherIcon status={day.status} className="w-5 h-5 mb-2" />
                  <span className={`text-[9px] font-semibold mb-3 ${idx === selectedDayIndex ? 'text-slate-800' : 'text-slate-500'}`}>
                    {day.date}
                  </span>
                  
                  <div className={`w-1 h-20 rounded-full relative mb-2.5 ${idx === selectedDayIndex ? 'bg-slate-300/80' : 'bg-slate-200/60'}`}>
                    <div 
                      className="absolute w-2 h-2 bg-[#FF3B30] rounded-full left-1/2 shadow-[0_1px_3px_rgba(255,59,48,0.4)]" 
                      style={{ bottom: `${day.prob}%`, transform: 'translate(-50%, 50%)' }} 
                    />
                  </div>
                  
                  <span className="text-[11px] font-bold text-slate-800 mb-1">{day.prob}%</span>
                  <span className="text-[9px] font-medium text-slate-400 scale-90 origin-top">{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section 2: Detailed Hourly Inline Table */}
          <div className="bg-white/50 backdrop-blur-xl rounded-[24px] pt-4 pb-4 border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
            
            <div className="px-5 flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">{forecastData[selectedDayIndex].date} 逐小时气象详情</h3>
            </div>

            {/* Scrollable Table Area */}
            <div className="w-full relative px-2">
              
              {/* Horizontal Scroll Hint (Right edge gradient) */}
              <div className="absolute right-2 top-0 bottom-0 w-8 bg-gradient-to-l from-white/70 via-white/40 to-transparent z-20 pointer-events-none rounded-r-xl" />

              <div className="w-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-xl border border-white/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                
                {/* Grid Container (Zero Gap for seamless area chart) */}
                <div className="min-w-max grid gap-0 bg-transparent text-[11px] text-center" style={{ gridTemplateColumns: gridCols }}>
                  
                  {tableRows.map((row) => (
                    <React.Fragment key={row.id}>
                      {/* Sticky Left Column (Label) */}
                      <div className={`sticky left-0 shadow-[2px_0_6px_rgba(0,0,0,0.04)] z-10 ${row.height}`}>
                        {row.renderLabel()}
                      </div>
                      
                      {/* Data Columns (Hours) */}
                      {displayData.map((d, i) => (
                        <div key={`${row.id}-${i}`} className={`bg-transparent overflow-hidden ${row.height}`}>
                          {row.render(d, i)}
                        </div>
                      ))}

                      {/* Jump to Next Day */}
                      {selectedDayIndex < forecastData.length - 1 && (
                        <div
                          key={`${row.id}-next`}
                          className={`bg-transparent overflow-hidden ${row.height} flex items-center justify-center cursor-pointer hover:bg-white/60 transition-colors`}
                          onClick={() => setSelectedDayIndex(selectedDayIndex + 1)}
                        >
                          {row.id === 'time' && (
                            <span className="text-[9px] text-slate-400 tracking-wide" style={{ writingMode: 'vertical-rl' }}>跳转到下一天</span>
                          )}
                          {row.id === 'icon' && (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  ))}

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

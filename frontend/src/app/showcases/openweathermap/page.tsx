'use client';

/**
 * OpenWeatherMap 展示页面
 * 展示指定经纬度的天气数据
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 天气数据类型定义
interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  };
}

// 获取天气数据的函数
const fetchWeatherData = async (lat: string, lon: string): Promise<WeatherData> => {
  const response = await fetch(`/api/showcases/openweathermap?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error('获取天气数据失败');
  }
  return response.json();
};

export default function OpenWeatherMapPage() {
  // 状态管理
  const [lat, setLat] = useState('33.44');
  const [lon, setLon] = useState('-94.04');

  // 使用 React Query 获取数据
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchWeatherData(lat, lon),
    enabled: false, // 默认不自动请求
  });

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OpenWeatherMap API 展示</h1>
      
      {/* 输入表单 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lat">纬度</Label>
            <Input
              id="lat"
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="输入纬度"
            />
          </div>
          <div>
            <Label htmlFor="lon">经度</Label>
            <Input
              id="lon"
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="输入经度"
            />
          </div>
        </div>
        <Button type="submit" className="mt-4">
          获取天气数据
        </Button>
      </form>

      {/* 加载状态 */}
      {isLoading && (
        <div className="text-center">
          <p>加载中...</p>
        </div>
      )}

      {/* 错误状态 */}
      {isError && (
        <div className="text-red-500">
          <p>错误: {(error as Error).message}</p>
        </div>
      )}

      {/* 天气数据展示 */}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>当前天气</CardTitle>
            <CardDescription>
              位置: {data.lat}, {data.lon} ({data.timezone})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center">
                <Image
                  src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`}
                  alt={data.current.weather[0].description}
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{data.current.temp}°C</p>
                  <p className="text-gray-500">{data.current.weather[0].description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">体感温度</p>
                  <p>{data.current.feels_like}°C</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">湿度</p>
                  <p>{data.current.humidity}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">风速</p>
                  <p>{data.current.wind_speed} m/s</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
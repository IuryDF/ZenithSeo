'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Target, Calendar, Award, Activity } from 'lucide-react';

interface MetricsData {
  overview: {
    totalPrompts: number;
    promptsThisMonth: number;
    monthlyGrowth: number;
    dailyAverage: number;
  };
  topNiches: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
  performance: {
    consistency: string;
    mostActiveDay: string | null;
    streak: number;
  };
}

export default function MetricsCards() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      if (!response.ok) {
        throw new Error('Erro ao carregar métricas');
      }
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-600">Erro ao carregar métricas: {error}</p>
      </div>
    );
  }

  const formatGrowth = (growth: number) => {
    if (growth > 0) return `+${growth}%`;
    if (growth < 0) return `${growth}%`;
    return '0%';
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Prompts */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Prompts</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.overview.totalPrompts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Desde o início</p>
        </div>

        {/* Prompts Este Mês */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.overview.promptsThisMonth}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className={`flex items-center mt-2 ${getGrowthColor(metrics.overview.monthlyGrowth)}`}>
            {getGrowthIcon(metrics.overview.monthlyGrowth)}
            <span className="text-xs ml-1">{formatGrowth(metrics.overview.monthlyGrowth)} vs mês anterior</span>
          </div>
        </div>

        {/* Média Diária */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média Diária</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.overview.dailyAverage}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Prompts por dia</p>
        </div>

        {/* Consistência */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consistência</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.performance.consistency}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{metrics.performance.streak} dias ativos</p>
        </div>
      </div>

      {/* Seção de Nichos Favoritos */}
      {metrics.topNiches.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seus Nichos Favoritos</h3>
          <div className="space-y-3">
            {metrics.topNiches.map((niche, index) => (
              <div key={niche.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{niche.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{niche.count} prompts</span>
                  <div className="text-xs text-gray-500">{niche.percentage}% do total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atividade Recente */}
      {metrics.recentActivity.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade dos Últimos 7 Dias</h3>
          <div className="grid grid-cols-7 gap-2">
            {metrics.recentActivity.reverse().map((day, index) => (
              <div key={day.date} className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                </div>
                <div className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                  day.count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                }`}>
                  {day.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
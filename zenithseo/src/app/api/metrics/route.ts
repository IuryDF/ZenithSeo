import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth-server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o usuário tem plano Pro
    if (user.plan !== 'pro') {
      return NextResponse.json({ 
        error: 'Métricas de performance disponíveis apenas no plano Pro',
        message: 'Faça upgrade para acessar suas métricas detalhadas'
      }, { status: 403 });
    }

    const supabase = createSupabaseServerClient();

    // Buscar métricas do usuário usando Supabase
    const [
      totalPromptsResult,
      promptsThisMonthResult,
      promptsLastMonthResult,
      topNichesResult,
      recentActivityResult
    ] = await Promise.all([
      // Total de prompts gerados
      supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      
      // Prompts deste mês
      supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      
      // Prompts do mês passado
      supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
        .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      
      // Top 3 nichos mais usados
      supabase
        .from('prompts')
        .select('niche')
        .eq('user_id', user.id)
        .not('niche', 'is', null),
      
      // Atividade dos últimos 7 dias
      supabase
        .from('prompts')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    // Processar os resultados
    const totalPrompts = totalPromptsResult.count || 0;
    const promptsThisMonth = promptsThisMonthResult.count || 0;
    const promptsLastMonth = promptsLastMonthResult.count || 0;

    // Processar nichos mais usados
    const nicheCounts: { [key: string]: number } = {};
    if (topNichesResult.data) {
      topNichesResult.data.forEach((prompt: any) => {
        if (prompt.niche) {
          nicheCounts[prompt.niche] = (nicheCounts[prompt.niche] || 0) + 1;
        }
      });
    }
    
    const topNiches = Object.entries(nicheCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([niche, count]) => ({ niche, count }));

    // Processar atividade dos últimos 7 dias
    const activityByDate: { [key: string]: number } = {};
    if (recentActivityResult.data) {
      recentActivityResult.data.forEach((prompt: any) => {
        const date = new Date(prompt.created_at).toISOString().split('T')[0];
        activityByDate[date] = (activityByDate[date] || 0) + 1;
      });
    }
    
    const recentActivity = Object.entries(activityByDate)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, count]) => ({ date, count }));

    // Calcular crescimento mensal
    const monthlyGrowth = promptsLastMonth > 0 ? ((promptsThisMonth - promptsLastMonth) / promptsLastMonth * 100) : 0;

    // Calcular média diária
    const totalDays = Math.max(1, Math.ceil((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)));
    const dailyAverage = Math.round((totalPrompts) / totalDays * 10) / 10;

    const metrics = {
      overview: {
        totalPrompts,
        promptsThisMonth,
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
        dailyAverage
      },
      topNiches: topNiches.map((niche: any) => ({
        name: niche.niche,
        count: niche.count,
        percentage: Math.round((niche.count / Math.max(1, totalPrompts)) * 100)
      })),
      recentActivity,
      performance: {
        consistency: recentActivity.length >= 3 ? 'Alta' : recentActivity.length >= 1 ? 'Média' : 'Baixa',
        mostActiveDay: recentActivity.length > 0 ? recentActivity[0].date : null,
        streak: recentActivity.length
      }
    };

    return NextResponse.json(metrics);
    
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
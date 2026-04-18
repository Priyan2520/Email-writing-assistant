import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!supabase) {
    // Return demo data when Supabase is not configured (for local dev / demo)
    return NextResponse.json({
      logs: [
        {
          id: 1,
          created_at: new Date().toISOString(),
          tone: 'Professional',
          email_type: 'Follow-up',
          language: 'English',
          status: 'Success',
          prompt_preview: 'Demo mode — connect Supabase to see real logs',
        },
      ],
      stats: {
        total: 1,
        successRate: 100,
        topTone: 'Professional',
        topType: 'Follow-up',
      },
    });
  }

  try {
    // Fetch all logs, most recent first
    const { data: logs, error } = await supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Compute summary statistics
    const total = logs?.length || 0;
    const successful = logs?.filter((l) => l.status === 'Success').length || 0;
    const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

    // Most common tone
    const toneCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    logs?.forEach((l) => {
      toneCounts[l.tone] = (toneCounts[l.tone] || 0) + 1;
      typeCounts[l.email_type] = (typeCounts[l.email_type] || 0) + 1;
    });

    const topTone = Object.entries(toneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    return NextResponse.json({
      logs,
      stats: { total, successRate, topTone, topType },
    });
  } catch (error) {
    console.error('Admin logs error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

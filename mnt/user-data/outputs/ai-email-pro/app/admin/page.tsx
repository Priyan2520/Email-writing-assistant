'use client';
import { useEffect, useState } from 'react';
import styles from './admin.module.css';

type Log = {
  id: number;
  created_at: string;
  tone: string;
  email_type: string;
  language: string;
  status: string;
  prompt_preview: string;
};

type Stats = {
  total: number;
  successRate: number;
  topTone: string;
  topType: string;
};

export default function AdminDashboard() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLogs(data.logs || []);
      setStats(data.stats || null);
    } catch {
      setError('Could not load activity logs. Check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const toneColors: Record<string, string> = {
    Professional: '#5e3cc4',
    Friendly: '#2a9d5c',
    Formal: '#c4783c',
    Concise: '#2196f3',
    Persuasive: '#e74c3c',
    Empathetic: '#9b59b6',
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <div className={styles.breadcrumb}>
              <a href="/" className={styles.breadcrumbLink}>MailCraft AI</a>
              <span className={styles.breadcrumbSep}>/</span>
              <span>Admin</span>
            </div>
            <h1 className={styles.title}>Activity Monitor</h1>
          </div>
          <button className={styles.refreshBtn} onClick={fetchLogs}>
            ↻ Refresh
          </button>
        </header>

        {/* Stats Cards */}
        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Generated</span>
              <span className={styles.statValue}>{stats.total}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Success Rate</span>
              <span className={`${styles.statValue} ${styles.statGreen}`}>
                {stats.successRate}%
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Top Tone</span>
              <span className={styles.statValue}>{stats.topTone || '—'}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Top Type</span>
              <span className={styles.statValue}>{stats.topType || '—'}</span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <span className={styles.tableTitle}>Recent Activity</span>
            <span className={styles.liveIndicator}>
              <span className={styles.liveDot} />
              Live
            </span>
          </div>

          {loading ? (
            <div className={styles.placeholder}>Loading activity logs…</div>
          ) : error ? (
            <div className={styles.errorBox}>
              <p>{error}</p>
              <p className={styles.errorHint}>
                Make sure <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set in your <code>.env.local</code> file
                and that the <code>email_logs</code> table exists in Supabase.
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className={styles.placeholder}>No activity yet. Generate your first email!</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Type</th>
                  <th>Tone</th>
                  <th>Language</th>
                  <th>Prompt Preview</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className={styles.mono}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>{log.email_type}</td>
                    <td>
                      <span
                        className={styles.badge}
                        style={{ background: toneColors[log.tone] + '22', color: toneColors[log.tone] || '#888' }}
                      >
                        {log.tone}
                      </span>
                    </td>
                    <td className={styles.mono}>{log.language}</td>
                    <td className={styles.preview}>"{log.prompt_preview}…"</td>
                    <td>
                      <span className={log.status === 'Success' ? styles.statusSuccess : styles.statusFail}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

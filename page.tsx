'use client';
import { useState } from 'react';
import styles from './page.module.css';

const TONES = ['Professional', 'Friendly', 'Formal', 'Concise', 'Persuasive', 'Empathetic'];
const EMAIL_TYPES = ['Follow-up', 'Proposal', 'Thank You', 'Introduction', 'Apology', 'Request'];
const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese'];

export default function Home() {
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('Professional');
  const [emailType, setEmailType] = useState('Follow-up');
  const [language, setLanguage] = useState('English');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: context, tone, type: emailType, language }),
      });
      const data = await res.json();
      setOutput(data.draft);
    } catch {
      setOutput('Error generating email. Please try again.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className={styles.main}>
      <div className={styles.bg} />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✦</span>
            <span className={styles.logoText}>MailCraft <span className={styles.logoBadge}>AI</span></span>
          </div>
          <a href="/admin" className={styles.adminLink}>Admin →</a>
        </header>

        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Write Emails That<br />
            <em className={styles.titleAccent}>Actually Get Replies</em>
          </h1>
          <p className={styles.subtitle}>
            AI-powered email generation. Pick your tone, drop your context, send with confidence.
          </p>
        </section>

        {/* Form */}
        <div className={styles.card}>
          {/* Chips Row */}
          <div className={styles.chipGroup}>
            <label className={styles.chipLabel}>Type</label>
            <div className={styles.chips}>
              {EMAIL_TYPES.map(t => (
                <button
                  key={t}
                  className={`${styles.chip} ${emailType === t ? styles.chipActive : ''}`}
                  onClick={() => setEmailType(t)}
                >{t}</button>
              ))}
            </div>
          </div>

          <div className={styles.chipGroup}>
            <label className={styles.chipLabel}>Tone</label>
            <div className={styles.chips}>
              {TONES.map(t => (
                <button
                  key={t}
                  className={`${styles.chip} ${tone === t ? styles.chipActive : ''}`}
                  onClick={() => setTone(t)}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className={styles.inputWrap}>
            <label className={styles.chipLabel}>What do you want to say?</label>
            <textarea
              className={styles.textarea}
              placeholder="e.g. Thank the hiring manager after my interview for the Senior Engineer role at Anthropic. Mention I'm excited about the AI safety work."
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={4}
            />
          </div>

          {/* Bottom row */}
          <div className={styles.formBottom}>
            <select
              className={styles.select}
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>

            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={loading || !context.trim()}
            >
              {loading ? (
                <span className={styles.spinner}>⟳</span>
              ) : (
                <>Generate Email <span className={styles.btnArrow}>↗</span></>
              )}
            </button>
          </div>
        </div>

        {/* Output */}
        {output && (
          <div className={styles.outputCard}>
            <div className={styles.outputHeader}>
              <span className={styles.outputTitle}>Generated Email</span>
              <button className={styles.copyBtn} onClick={handleCopy}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <pre className={styles.outputText}>{output}</pre>
          </div>
        )}
      </div>
    </main>
  );
}

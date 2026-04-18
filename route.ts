import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Template engine that mimics an AI response
// Replace the body of generateEmailDraft() with an Anthropic/OpenAI API call for production
function generateEmailDraft(prompt: string, tone: string, type: string, language: string): string {
  const greetings: Record<string, string> = {
    English: 'Hi there,',
    Hindi: 'नमस्ते,',
    Spanish: 'Hola,',
    French: 'Bonjour,',
    German: 'Hallo,',
    Portuguese: 'Olá,',
  };

  const closings: Record<string, string> = {
    Professional: 'Best regards,',
    Friendly: 'Cheers,',
    Formal: 'Yours sincerely,',
    Concise: 'Thanks,',
    Persuasive: 'Looking forward to hearing from you,',
    Empathetic: 'With warm regards,',
  };

  const subjectMap: Record<string, string> = {
    'Follow-up': `Follow-Up: ${prompt.split(' ').slice(0, 4).join(' ')}...`,
    'Proposal': `Proposal: ${prompt.split(' ').slice(0, 4).join(' ')}...`,
    'Thank You': `Thank You — ${prompt.split(' ').slice(0, 4).join(' ')}...`,
    'Introduction': `Introduction — ${prompt.split(' ').slice(0, 4).join(' ')}...`,
    'Apology': `Apology Regarding ${prompt.split(' ').slice(0, 3).join(' ')}...`,
    'Request': `Request: ${prompt.split(' ').slice(0, 4).join(' ')}...`,
  };

  const greeting = greetings[language] || greetings['English'];
  const closing = closings[tone] || closings['Professional'];
  const subject = subjectMap[type] || `RE: ${prompt.substring(0, 40)}...`;

  const body = `I wanted to reach out regarding the following: ${prompt}

I am writing in a ${tone.toLowerCase()} capacity to address this ${type.toLowerCase()} matter. I believe this communication will be valuable for both parties, and I appreciate your time in reading this.

Please feel free to reach out if you need any clarification or further discussion on this topic.`;

  return `Subject: ${subject}\n\n${greeting}\n\n${body}\n\n${closing}\n[Your Name]`;
}

export async function POST(req: Request) {
  try {
    const { prompt, tone, type, language } = await req.json();

    if (!prompt || !tone || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Generate the email draft
    const draft = generateEmailDraft(prompt, tone, type, language || 'English');

    // 2. Log the activity to Supabase (for Admin Dashboard)
    // This runs asynchronously and does not block the response
    if (supabase) {
      await supabase.from('email_logs').insert([
        {
          prompt_preview: prompt.substring(0, 80),
          tone,
          email_type: type,
          language: language || 'English',
          status: 'Success',
        },
      ]);
    }

    return NextResponse.json({ draft });
  } catch (error) {
    console.error('Generate API error:', error);

    // Log failure to Supabase
    if (supabase) {
      await supabase.from('email_logs').insert([
        { tone: 'Unknown', email_type: 'Unknown', status: 'Failed', language: 'Unknown' },
      ]);
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import React, { useRef, useState } from 'react';
import ToolLifecycle from './components/ToolLifecycle.jsx';

function scoreLead(lead, signal) {
  return new Promise((resolve, reject) => {
    const name = lead.company.toLowerCase();
    const timer = setTimeout(() => {
      if (signal.aborted) return;
      if (name === 'error') reject({ title: 'Scoring service unavailable', message: 'The local scoring service returned an unexpected error. Please retry.' });
      else if (name === 'rate') reject({ title: 'Rate limit reached', message: 'Too many scoring requests were simulated. Wait a moment, then retry.' });
      else if (name === 'midstream') reject({ title: 'Connection ended midstream', message: 'The simulated tool connection ended before a result arrived.' });
      else { const base = lead.intent === 'High' ? 76 : lead.intent === 'Medium' ? 58 : 36; const bonus = lead.size === 'Enterprise' ? 14 : lead.size === 'Mid-market' ? 8 : 3; const score = Math.min(100, base + bonus); resolve({ score, tier: score >= 75 ? 'Hot' : score >= 50 ? 'Warm' : 'Cool', action: score >= 75 ? 'Contact within 24 hours' : score >= 50 ? 'Qualify with a discovery call' : 'Nurture with helpful content', reasons: [`${lead.intent} buying intent indicates ${lead.intent === 'High' ? 'strong' : 'developing'} urgency`, `${lead.size} account profile shapes the opportunity size`, 'Company details were evaluated locally with no external API'] }); }
    }, name === 'slow' ? 2600 : 850);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject({ title: 'Scoring stopped', message: 'The simulated request was cancelled before completion.' }); }, { once: true });
  });
}

export default function App() {
  const [lead, setLead] = useState({ company: '', size: '', intent: '' }); const [state, setState] = useState('idle'); const [result, setResult] = useState(null); const [error, setError] = useState(null); const [cooldown, setCooldown] = useState(false); const controller = useRef(null); const lastSubmit = useRef(0);
  async function submit(event) { event?.preventDefault(); if (!lead.company.trim() || !lead.size || !lead.intent || state === 'loading' || cooldown || Date.now() - lastSubmit.current < 1200) return; lastSubmit.current = Date.now(); setCooldown(true); window.setTimeout(() => setCooldown(false), 1200); controller.current = new AbortController(); setState('loading'); setResult(null); setError(null); try { setResult(await scoreLead(lead, controller.current.signal)); setState('success'); } catch (reason) { setError(reason); setState('error'); } }
  function stop() { controller.current?.abort(); }
  return <><header className="site-header"><div className="shell"><a className="brand" href="/">Signalboard</a><span className="header-status"><i />Local tool simulation</span></div></header><main className="shell"><section className="intro"><span className="eyebrow">Lead intelligence / v1</span><h1>Turn buying signals into a next step.</h1><p>Score a lead with a transparent, local simulation that keeps the tool lifecycle visible from input to recommendation.</p></section><section className="workspace"><form className="lead-form" onSubmit={submit} aria-labelledby="form-title"><div><span className="eyebrow">Input</span><h2 id="form-title">Lead details</h2></div><label>Company name<input value={lead.company} maxLength={120} onChange={e => setLead({ ...lead, company: e.target.value })} placeholder="e.g. Northstar Health" required /></label><label>Company size<select value={lead.size} onChange={e => setLead({ ...lead, size: e.target.value })} required><option value="">Select size</option><option>Startup</option><option>Mid-market</option><option>Enterprise</option></select></label><label>Intent<select value={lead.intent} onChange={e => setLead({ ...lead, intent: e.target.value })} required><option value="">Select intent</option><option>Low</option><option>Medium</option><option>High</option></select></label><button className="button primary" type="submit" disabled={state === 'loading' || cooldown}>{state === 'loading' ? 'Scoring…' : cooldown ? 'Please wait…' : 'Score this lead'}</button><p className="form-note">Try <strong>error</strong>, <strong>rate</strong>, <strong>slow</strong>, or <strong>midstream</strong> as the company name to test tool states.</p></form><ToolLifecycle state={state} lead={lead} result={result} error={error} onRetry={submit} onStop={stop} /></section></main><footer className="shell">Built for clear decisions, with no external API calls.</footer></>;
}

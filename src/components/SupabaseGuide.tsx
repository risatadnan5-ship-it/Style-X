import React, { useState, useEffect } from 'react';
import { db, SUPABASE_SQL_SCHEMA } from '../dbMock';
import { Terminal, Database, Key, CheckCircle2, Copy, Shield } from 'lucide-react';

export default function SupabaseGuide() {
  const [activeSegment, setActiveSegment] = useState<'sql' | 'rls' | 'env' | 'deploy'>('sql');
  const [copied, setCopied] = useState(false);

  // Live Sync feedback details
  const [status, setStatus] = useState(db.getSupabaseStatus());
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    // Read status initially
    setStatus(db.getSupabaseStatus());

    const handleDbUpdate = () => {
      setStatus(db.getSupabaseStatus());
    };

    window.addEventListener('stylex_db_update', handleDbUpdate);
    return () => {
      window.removeEventListener('stylex_db_update', handleDbUpdate);
    };
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedSuccess(null);
    const success = await db.seedSupabase();
    setSeedSuccess(success);
    setSeeding(false);
  };

  return (
    <section id="stylex-supabase-guide" className="relative bg-[#0E0E0E] py-20 lg:py-24 border-t border-b border-[#D4AF37]/15">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-left">
        
        {/* Title block */}
        <div className="max-w-3xl text-left space-y-2 mb-12">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase font-bold">SOVEREIGN ARCHITECTURE SPECIFICATION</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight font-extrabold uppercase">
            Supabase & Live Sync Panel
          </h2>
          <p className="text-sm font-light text-gray-400 max-w-2xl mt-2 leading-relaxed">
            Style X is connected live with your Supabase workspace. Copy the SQL directives below to establish your database tables, then click the automated Seeding mechanism to sync our premium catalog.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-800 text-[10px] font-mono uppercase tracking-widest gap-2 sm:gap-4 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSegment('sql')}
            className={`pb-3 border-b-2 px-1 transition-all flex items-center gap-1.5 cursor-pointer ${activeSegment === 'sql' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>PostgreSQL Schema</span>
          </button>
          <button
            onClick={() => setActiveSegment('rls')}
            className={`pb-3 border-b-2 px-1 transition-all flex items-center gap-1.5 cursor-pointer ${activeSegment === 'rls' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>RLS Policies</span>
          </button>
          <button
            onClick={() => setActiveSegment('env')}
            className={`pb-3 border-b-2 px-1 transition-all flex items-center gap-1.5 cursor-pointer ${activeSegment === 'env' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>Environment variables</span>
          </button>
          <button
            onClick={() => setActiveSegment('deploy')}
            className={`pb-3 border-b-2 px-1 transition-all flex items-center gap-1.5 cursor-pointer ${activeSegment === 'deploy' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Vercel Deploy checklist</span>
          </button>
        </div>

        {/* Outer grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main detailed display (8 cols) */}
          <div className="lg:col-span-8">
            
            {activeSegment === 'sql' && (
              <div id="sql-display-pane" className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center p-4 bg-[#161616] rounded border border-gray-800">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                      <Terminal className="h-4 w-4 text-[#D4AF37]" />
                      PostgreSQL Script Compilation
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">Defines relational FKs, Constraints, Cascades, and Indexes.</p>
                  </div>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950 hover:bg-purple-900 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] font-mono uppercase font-bold rounded transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copied ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="relative">
                  <pre className="p-4 rounded-lg bg-black border border-gray-900 text-[10px] font-mono text-gray-400 overflow-x-auto max-h-96 leading-relaxed text-left select-all">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent pointer-none"></div>
                </div>
              </div>
            )}

            {activeSegment === 'rls' && (
              <div id="rls-display-pane" className="space-y-5 animate-fadeIn font-light text-xs text-gray-300 leading-relaxed">
                <div className="p-5 bg-[#161616] rounded border border-gray-800 space-y-3">
                  <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-widest text-[#D4AF37]">Row Level Security (RLS) Mandate</h4>
                  <p>
                    Relational datasets of luxury businesses must defend critical profiles, product indices, and private order information. Below are key declarations to implement inside Supabase shell commands:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950 rounded border border-zinc-900">
                    <span className="block font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider mb-1">PROFILES RLS</span>
                    <p className="text-gray-400">Allows global public reading of avatars / custom labels, but prevents foreign writes. Users can update only their matching auth.uid() ID.</p>
                  </div>
                  <div className="p-4 bg-zinc-950 rounded border border-zinc-900">
                    <span className="block font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider mb-1">CATALOG & DETAILS</span>
                    <p className="text-gray-400">Universal public readings initialized for categories and products. Administrative edits mapped exactly to auth.jwt() admin filters.</p>
                  </div>
                  <div className="p-4 bg-zinc-950 rounded border border-zinc-900">
                    <span className="block font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider mb-1">ORDER METADATA</span>
                    <p className="text-gray-400">Restricts user invoice listings specifically to matching UID rows. Administrators retain absolute global read access across overall registers.</p>
                  </div>
                  <div className="p-4 bg-zinc-950 rounded border border-zinc-900">
                    <span className="block font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider mb-1">MESSENGER SEALS</span>
                    <p className="text-gray-400">Authenticates chat feeds to preserve privacy. Chat is queryable by sender parameters while admin dashboard views encompass total rows.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSegment === 'env' && (
              <div id="env-display-pane" className="space-y-4 animate-fadeIn">
                <div className="p-5 bg-[#161616] rounded border border-gray-800 text-xs">
                  <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-widest text-[#D4AF37] mb-3">Vite Client Environment Variables</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Style X client environment variables are pre-configured with the connection parameters you provided. You can override them if needed by editing the <code className="text-[#D4AF37] font-mono">.env.example</code> file or setting these in your own custom hosting environment:
                  </p>
                </div>

                <div className="p-4 bg-black rounded border border-gray-900 text-left">
                  <pre className="text-[10px] font-mono text-gray-500 leading-normal">
                    {`# Style X Connected Supabase credentials
VITE_SUPABASE_URL="https://khlmfaodrzzjonjhzodu.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
`}
                  </pre>
                </div>
              </div>
            )}

            {activeSegment === 'deploy' && (
              <div id="deploy-display-pane" className="space-y-4 animate-fadeIn font-light text-xs text-gray-300">
                <div className="p-5 bg-[#161616] rounded border border-gray-800 space-y-2">
                  <h4 className="font-serif text-sm font-semibold text-[#D4AF37] uppercase">Vercel sovereign deployment pipeline</h4>
                  <p className="text-gray-400">Our Style X frontend layout utilizes Vite, Tailwind v4, and ESNext structures, fully ready to integrate with Vercel.</p>
                </div>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="flex gap-2.5 items-center p-3.5 bg-zinc-950 rounded border border-zinc-900">
                    <div className="h-5 w-5 bg-gradient-to-tr from-purple-950 to-[#D4AF37] text-white rounded-full flex items-center justify-center text-[10px] font-bold">1</div>
                    <span className="text-gray-300">Initialize a new GitHub project, configure remote origin, and commit Style X files.</span>
                  </div>
                  <div className="flex gap-2.5 items-center p-3.5 bg-zinc-950 rounded border border-zinc-900">
                    <div className="h-5 w-5 bg-gradient-to-tr from-purple-950 to-[#D4AF37] text-white rounded-full flex items-center justify-center text-[10px] font-bold">2</div>
                    <span className="text-gray-300">Connect Vercel to your GitHub profile, select repository, and set Framework to "Vite".</span>
                  </div>
                  <div className="flex gap-2.5 items-center p-3.5 bg-zinc-950 rounded border border-zinc-900">
                    <div className="h-5 w-5 bg-gradient-to-tr from-purple-950 to-[#D4AF37] text-white rounded-full flex items-center justify-center text-[10px] font-bold">3</div>
                    <span className="text-gray-300">Add the environment variables listed in the "Keys" pane inside your Vercel Dashboard project settings.</span>
                  </div>
                  <div className="flex gap-2.5 items-center p-3.5 bg-zinc-950 rounded border border-zinc-900">
                    <div className="h-5 w-5 bg-gradient-to-tr from-purple-950 to-[#D4AF37] text-white rounded-full flex items-center justify-center text-[10px] font-bold">4</div>
                    <span className="text-gray-300">Run "vercel deploy --prod" or trigger an automatic build based on GitHub pushes.</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Side Info Box (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Supabase Link-State Dashboard card */}
            <div className="p-5 rounded-none border border-[#D4AF37]/25 bg-black space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white">
                  <Database className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Supabase Link-State</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${status.connected === true ? 'bg-green-500 animate-pulse' : status.connected === false ? 'bg-red-500' : 'bg-gray-600 animate-pulse'}`} />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-gray-500">
                    {status.connected === true ? 'ONLINE' : status.connected === false ? 'OFFLINE' : 'SCANNING'}
                  </span>
                </div>
              </div>

              {status.connected === true ? (
                <div className="space-y-3">
                  <p className="text-[11px] font-light text-gray-300 leading-relaxed text-left">
                    Established live sync tunnel. All products, orders, chat tables, reviews, and coupons are transparently reading and writing with your active Supabase cloud.
                  </p>
                  <button
                    onClick={() => db.syncFromSupabase()}
                    className="w-full py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer text-center block"
                  >
                    Force Cloud Refresh
                  </button>
                </div>
              ) : status.connected === false ? (
                <div className="space-y-4">
                  <div className="text-left">
                    <span className="text-[9px] font-mono uppercase text-[#D4AF37] tracking-wider block mb-1">Tunnel Interception:</span>
                    <p className="text-[10px] text-zinc-400 font-mono leading-relaxed bg-[#111] p-3 border border-white/5 select-all">
                      {status.error || 'Connection failed. Database structures appear uninitialized.'}
                    </p>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleSeed}
                      disabled={seeding}
                      className="w-full py-3 bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {seeding ? 'SEEDING DATABASE...' : 'SEED SUPABASE DATABASE'}
                    </button>
                    <p className="text-[8.5px] text-gray-500 mt-2 text-center font-mono uppercase tracking-wider leading-normal">
                      Pushes core products & categories into empty Postgres tables with 1-Click
                    </p>
                  </div>

                  {seedSuccess === true && (
                    <p className="text-[10px] text-green-500 font-mono uppercase tracking-widest text-center mt-2">
                      ✔ Seeded Successfully!
                    </p>
                  )}
                  {seedSuccess === false && (
                    <p className="text-[10px] text-red-500 font-mono uppercase tracking-widest text-center mt-2">
                      ✘ Selection Failed. Did you run PostgreSQL script?
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 py-4 text-center">
                  <div className="inline-block h-4 w-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-1"></div>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest animate-pulse">
                    Probing Cloud Workspace...
                  </p>
                </div>
              )}
            </div>

            {/* Storage Bucket Info */}
            <div className="p-5 rounded-none border border-white/5 bg-[#0C0A15]/75 space-y-4 text-left">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Database className="h-4 w-4" />
                <h4 className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-white">Media Bucket Guide</h4>
              </div>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                When configuring Supabase, you can establish an active public storage bucket called <strong className="text-white">"product_images"</strong> inside your Storage console.
              </p>
              <div className="p-3 bg-black rounded border border-gray-900 text-[10px] font-mono text-zinc-500">
                <span className="text-[#D4AF37]">BUCKET PATH:</span><br />
                storage.from('product_images')
              </div>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                Enable "Public access allowed" on the bucket settings to fetch high resolution media and premium luxury photography instantly.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

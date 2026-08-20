// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";

// ── SPOOL LOGO COMPONENTS (inline — no image files needed) ──────────────────
const SpoolWordmark=()=>(
  <svg viewBox="0 0 280 80" width="280" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="50%" stopColor="#cccccc"/>
        <stop offset="100%" stopColor="#ffffff"/>
      </linearGradient>
    </defs>
    {/* Cassette shell top */}
    <rect x="2" y="2" width="276" height="28" rx="6" fill="#111" stroke="white" strokeWidth="1.5"/>
    {/* 8 color stripes */}
    {[['#00cec9',30],['#ff9f43',37],['#a29bfe',44],['#2ed573',51],['#ffd32a',58],['#ff4d4d',65],['#1e90ff',72],['#fd79a8',79]].map(([c,y])=>(
      <rect key={c} x="2" y={y-7} width="276" height="7" fill={c}/>
    ))}
    {/* Cassette shell bottom */}
    <rect x="2" y="58" width="276" height="20" rx="6" fill="#111" stroke="white" strokeWidth="1.5"/>
    {/* SPOOL text */}
    <text x="140" y="52" textAnchor="middle" fontFamily="Audiowide,monospace" fontSize="22" fontWeight="700" fill="white" stroke="black" strokeWidth="3" paintOrder="stroke">Spool</text>
    {/* Reel dots */}
    <rect x="95" y="38" width="7" height="7" rx="1" fill="#ffd32a"/>
    <rect x="178" y="38" width="7" height="7" rx="1" fill="#ffd32a"/>
  </svg>
);

const SpoolIcon=({size=28})=>(
  <svg viewBox="0 0 40 30" width={size*1.4} height={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="40" height="9" rx="3" fill="#111" stroke="white" strokeWidth="1"/>
    {[['#00cec9',9],['#ff9f43',12],['#a29bfe',15],['#2ed573',18],['#ffd32a',21],['#ff4d4d',24],['#1e90ff',27]].map(([c,y])=>(
      <rect key={c} x="0" y={y-3} width="40" height="3" fill={c}/>
    ))}
    <rect x="0" y="21" width="40" height="9" rx="3" fill="#111" stroke="white" strokeWidth="1"/>
  </svg>
);

const COLORS = ['#ff4d4d','#ff9f43','#ffd32a','#2ed573','#1e90ff','#a29bfe','#fd79a8','#00cec9'];
const N = 8;

// ── SUPPORT CHAT ── paste your Anthropic API key below ──────────────────────
const LOOPGEN_API_KEY = '';


// ── LICENSE GATE ─────────────────────────────────────────────────────────────
const LG_VALID_KEYS=[
  'LOOP-MQRW-6DNC-XC3F','LOOP-34XU-PPK6-MJUM','LOOP-ZQP9-XIY2-KXKN',
  'LOOP-RAIF-LUMQ-1SH8','LOOP-H7NA-11XL-ZNA9','LOOP-N2X8-F5C1-4Z8N',
  'LOOP-0WAQ-EWP6-U6YM','LOOP-51B7-7U29-VPCE','LOOP-8I0Y-OV46-S6IG',
  'LOOP-HZAD-IMFV-SWYO','LOOP-EQFE-IIAR-6NGU','LOOP-U1SY-NJZ6-6SU1',
  'LOOP-J391-V0BC-ZPY0','LOOP-DB4I-AQAH-LNPZ','LOOP-WMXN-TECC-SQWU',
  'LOOP-8IP5-A5YG-JBR9','LOOP-5SDY-23FJ-HXB3','LOOP-6FEL-WX3B-1DJ7',
  'LOOP-CHTD-EP63-3RJ8','LOOP-GF7L-EH42-BS3S','LOOP-4XTX-M35N-8WSH',
  'LOOP-MRM1-ABFQ-M1KQ','LOOP-8AWC-LK52-O3B6','LOOP-VKQS-JW5O-A8AA',
  'LOOP-RWWZ-11FH-D7DY','LOOP-FQ57-R4TP-9ODO','LOOP-8YQW-PXPZ-TI75',
  'LOOP-PE63-I99A-U69C','LOOP-MR8K-F1MQ-XATZ','LOOP-U6V6-3VNS-KPVE',
  // ── BETA KEYS ──
  'LG-BETA-RUCS-56AR','LG-BETA-5URK-J0TQ','LG-BETA-0T3P-YPWI',
  'LG-BETA-HA54-U9PF','LG-BETA-PSYU-T375','LG-BETA-QASA-2NTV',
  'LG-BETA-U4PH-65Y6','LG-BETA-83ZO-KTT6','LG-BETA-Q69Z-41RF',
  'LG-BETA-29XR-A1A4','LG-BETA-HZG6-768F','LG-BETA-NM96-3HXX',
  'LG-BETA-70TW-9EBB','LG-BETA-HNDM-RN38','LG-BETA-YSH6-7LJ4',
  // ── BUNDLE KEYS ──
  'BNDL-OZJC-1GAV-O5RF','BNDL-VFMP-EIU9-JEZ7','BNDL-F5E8-NEG3-X1R5',
  'BNDL-SU7V-TPU5-P8EB','BNDL-96HQ-4SG1-EK0G','BNDL-TSQ8-266D-IGLE',
  'BNDL-K9XA-VUMV-RC2M','BNDL-OZIJ-REFX-LZRH','BNDL-3QHX-Q657-IFF4',
  'BNDL-8JF8-FNP1-ZEJI','BNDL-28XL-5AQ0-BD04','BNDL-TLRG-05KN-HSHU',
  'BNDL-DBCV-IJU0-WAT3','BNDL-X2ZI-9UZI-ZEEJ','BNDL-H9UP-ZR7X-Q86S',
  'BNDL-WXSP-SB0E-OCRD','BNDL-2RC4-1QXZ-1D4F','BNDL-3YDB-C8BM-IZLP',
  'BNDL-JLS2-LKK7-1AB8','BNDL-6BIL-OZ51-V2ZE','BNDL-LAIQ-17QB-21GY',
  'BNDL-XEAI-GK72-CNEU','BNDL-18XD-E9N0-JF80','BNDL-ABR6-WZ33-8SFH',
  'BNDL-RD0M-CHUZ-AK2B','BNDL-304E-88IA-6KO5','BNDL-YSG8-I1KN-HWBU',
  'BNDL-TMXS-WU4Y-QBY6','BNDL-4HBV-MD2P-LQZB','BNDL-M4BO-6IQP-PMV5',
];
const LG_STORAGE_KEY='lg-license';
function LicenseGate({children}){
  const[unlocked,setUnlocked]=useState(()=>{
    try{const k=localStorage.getItem(LG_STORAGE_KEY);
      return k&&LG_VALID_KEYS.includes(k);}catch{return false;}
  });
  const[input,setInput]=useState('');
  const[error,setError]=useState('');
  const[shake,setShake]=useState(false);
  const attempt=()=>{
    const k=input.trim().toUpperCase();
    if(LG_VALID_KEYS.includes(k)){
      try{localStorage.setItem(LG_STORAGE_KEY,k);}catch{}
      setUnlocked(true);
    } else {
      setError('Invalid key. Check your confirmation email.');
      setShake(true);setTimeout(()=>setShake(false),500);
    }
  };
  if(unlocked)return children;
  return(
    <div style={{background:'var(--bg)',minHeight:'100vh',display:'flex',alignItems:'center',
      justifyContent:'center',fontFamily:"'Audiowide',sans-serif",padding:20}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Audiowide&family=DM+Mono:wght@400;500&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
        *{box-sizing:border-box;}
        .lg-input::placeholder{color:var(--text40);}
      `}</style>
      <div style={{width:'100%',maxWidth:420,textAlign:'center'}}>
        <div style={{marginBottom:28,textAlign:'center'}}>
          <SpoolWordmark/>
        </div>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',
          borderRadius:10,padding:'32px 28px'}}>
          <div style={{fontFamily:'DM Mono',fontSize:10,color:'var(--text70)',
            letterSpacing:3,marginBottom:20}}>ENTER YOUR LICENSE KEY</div>
          <input
            className="lg-input"
            value={input}
            onChange={e=>setInput(e.target.value.toUpperCase())}
            onKeyDown={e=>e.key==='Enter'&&attempt()}
            placeholder="LOOP-XXXX-XXXX-XXXX"
            style={{
              width:'100%',background:'var(--bg)',color:'var(--text)',
              border:'1px solid var(--border)',borderRadius:6,
              padding:'12px 14px',fontFamily:'DM Mono',fontSize:13,
              letterSpacing:3,outline:'none',textAlign:'center',marginBottom:12,
              animation:shake?'shake .4s ease':'none',
            }}
          />
          {error&&<div style={{fontFamily:'DM Mono',fontSize:9,color:'#ff4d4d',
            letterSpacing:2,marginBottom:12}}>{error}</div>}
          <button onClick={attempt} style={{
            width:'100%',padding:'13px',borderRadius:6,border:'none',cursor:'pointer',
            background:'#39ff14',color:'#000',fontFamily:"'Audiowide',sans-serif",
            fontSize:12,letterSpacing:3,fontWeight:700,
          }}>UNLOCK</button>
          <div style={{fontFamily:'DM Mono',fontSize:9,color:'var(--text40)',
            letterSpacing:2,marginTop:16,lineHeight:1.7}}>
            Your key was sent in your purchase confirmation email.<br/>
            gentrydodd.com
          </div>
        </div>
      </div>
    </div>
  );
}
// ── END LICENSE GATE ──────────────────────────────────────────────────────────

const LOOPGEN_SYSTEM = `You are the official AI support assistant for LOOPGEN — a browser-based, keyboard-controlled multi-track loop station built by Gentry Dodd. You have complete, deep knowledge of every feature, every button, every behavior, and every edge case in the application. Your job is to walk users through exactly what they need, step by step, with total confidence.

TONE: Friendly and direct — like a bandmate who built the software. Never robotic. Never vague. If someone is stuck mid-performance, give them the fix in 10 words. If they want to understand something deeply, go deep.

FORMAT: Numbered steps for how-to questions. Bold for UI element names and important terms. Inline code for key names. Keep answers complete but never padded.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLETE SPOOL KNOWLEDGE BASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT IS SPOOL:
A browser-based multi-track looper that turns your computer keyboard into a fully programmable performance controller. Runs in any modern browser — Chrome recommended. No downloads, no drivers, no hardware required. Built on the Web Audio API. Has 8 loop tracks, a three-gesture engine (tap/double-tap/hold per key), a full macro system for multi-track commands, per-track FX chains with key binding on every parameter, an input FX chain, auto-sync engine, quantize, BPM tap tempo, WAV export, MIDI output, and an AI support assistant.

━━━ TAB NAVIGATION ━━━━━━━━━━━━━━━━━━━━━

The UI has 5 tabs across the top:
- **PERFORM** — track grid, master controls, keyboard view. Everything for live performance.
- **KEYS** — keyboard map, track gesture bindings, global keys, macros, presets.
- **FX** — input FX chain + per-track EQ, compressor, reverb, delay. Every control has a key binding chip.
- **ROUTING** — audio device selection (input/output) + signal path reference.
- **MIDI** — MIDI output enable, port selection, channel selection.

The top bar (always visible): BPM display, TAP button + its key badge, Q·ON/OFF, AUTO·ON/OFF, SYNC·ON/OFF, MASTER VOL knob, EXPORT WAV button.

━━━ INITIALIZATION ━━━━━━━━━━━━━━━━━━━━━

On first load, the page shows "AUDIO ENGINE OFFLINE." The user must:
1. Click the green **◉ INITIALIZE AUDIO** button
2. Grant microphone permission in the browser popup
3. The Web Audio API initializes and all controls activate

If they see an error message: mic permission was denied. They need to click the lock/camera icon in the browser address bar → allow microphone → refresh the page. Or click **↗ OPEN IN NEW TAB** to open LOOPGEN outside of an embedded frame where mic is blocked.

Nothing works until audio is initialized. If buttons do nothing, this is almost always why.

━━━ THE 8 TRACKS ━━━━━━━━━━━━━━━━━━━━━━━

Each track has a unique color: red (L1), orange (L2), yellow (L3), green (L4), blue (L5), purple (L6), pink (L7), teal (L8).

Each track card (in GRID layout) shows:
- **⠿ drag handle** — drag to reorder tracks
- **State dot** — glowing color = playing, red blinking = recording, dark = empty/stopped
- **Track name** — LOOP 1 through LOOP 8 (editable)
- **Duration** in seconds once recorded
- **▶S** (Sync Start toggle) — green when on
- **■S** (Sync Stop toggle) — teal when on
- **Waveform canvas** — shows recorded audio, playhead sweeps across while playing
- **● REC** button — start recording
- **▶ PLAY** button — play/stop the loop
- **⊕ OVR** button — overdub (layer on top)
- **⊙ MUTE** button — silence without stopping
- **✕ CLR** button — erase the loop
- **→PLAY / →OVR toggle** — what happens when you stop recording
- **Key binding chip** — shows bound key or ⌨ if unbound; click to open binding modal

TRACK STATES:
- **empty** — no audio recorded yet
- **recording** — actively capturing mic input
- **recorded** — has audio, not currently playing
- **playing** — loop is running and looping

━━━ RECORDING A LOOP ━━━━━━━━━━━━━━━━━━━

Step by step:
1. Initialize audio first (◉ INITIALIZE AUDIO + allow mic)
2. Click **● REC** on any track (or press its bound key)
3. The track turns red, shows RECORDING in the waveform area
4. Play your instrument / sing / make sound
5. Click **■ STOP REC** (same button) to end recording
6. The loop immediately starts playing and repeats indefinitely

The **→PLAY / →OVR** toggle on the track controls what happens when you stop recording:
- **→PLAY**: stops recording → loop starts playing (default)
- **→OVR**: stops recording → immediately enters overdub mode

━━━ SMART RECORD ━━━━━━━━━━━━━━━━━━━━━━━

Smart Record is the most important action in LOOPGEN. It is context-aware:

- Track is **empty** → starts fresh recording
- Track is **recording** → stops recording (then plays or overdubs based on →PLAY/→OVR setting)
- Track is **playing** → starts overdubbing on top of the playing loop
- Track is **recorded** (stopped) → starts a new fresh recording

Assign Smart Record to the **TAP** gesture on every track key for one-button full control.

━━━ OVERDUB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overdub layers new audio directly on top of an existing loop. The original loop keeps playing underneath while you record. When you stop overdubbing, the new audio is permanently mixed into the loop using OfflineAudioContext — no quality loss, no latency stacking.

**OVR DECAY knob** (in FX tab per track): controls how much of the original loop survives each overdub pass. 1.0 = full stack (layers pile up), 0.0 = full replace (each overdub replaces the previous).

━━━ MUTE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mute silences the audio output of a track but the **loop keeps running in the background**. The playhead advances silently. When you unmute, the audio comes back **exactly in sync** — because the loop never stopped.

This is critical for live performance: use mute for drops, not stop. Mute = reversible, stays in sync. Stop = breaks sync.

━━━ CLEAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clear permanently erases a loop. If **Sync Stop** is on and the track is playing, it waits until the end of the current loop cycle before clearing. If Sync Stop is off, it clears immediately.

Click **✕ CLR** or use the HOLD gesture on the track's bound key.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE KEY BINDING SYSTEM — COMPLETE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is the core of LOOPGEN. Every key on your keyboard can be bound to any combination of actions — track control, global master commands, FX parameters, or macros. One key, three independent gestures.

━━━ GESTURE TYPES ━━━━━━━━━━━━━━━━━━━━━━

Every bound key supports three independently programmable gestures:

**TAP** — single press. Commits after 260ms (waits to see if a second tap is coming).
**DOUBLE TAP** — two presses within 280ms of each other. Fires immediately on the second press.
**HOLD** — press and hold for 500ms. Fires on the audio thread as soon as the threshold is reached.

This means one key can do three completely different things:
- Example: key "G" → TAP=toggle reverb · DBL=mute all · HOLD=control chorus knob

━━━ THE UNIVERSAL KEY BINDING MODAL ━━━━

This is the main tool for assigning keys. Access it two ways:
1. Click any key on the keyboard map (in PERFORM tab **⌨ KEYS** view or KEYS tab **Keyboard Map** section)
2. Click the **⌨ KB** chip beneath any FX knob or toggle in the FX tab

The modal has four binding types. Select the type first, then configure it.

**BIND TYPE: TRACK**
- Pick one of the 8 loops
- Set TAP, DOUBLE TAP, and HOLD actions independently
- Set the AFTER STOP REC behavior (→PLAY or →OVERDUB)
- Available actions: Smart Record, Record, Play/Stop, Overdub, Punch In, Restart, Reverse, Cycle Play Mode, Cycle Speed, Cycle Stop Mode, Mute, Solo, Count-In, Auto-Rec, Threshold Rec, Toggle EQ, Toggle Comp, Toggle Reverb, Toggle Delay, Clear, Do Nothing

**BIND TYPE: GLOBAL**
- Assigns master-level actions to TAP, DOUBLE TAP, and HOLD independently on one key
- Available actions: Tap Tempo, Play All, Stop All, Clear All, Export Mix, Quantize Toggle, Sync All Toggle, BPM×2, BPM÷2, Master Fade Out, Master Fade In, Do Nothing
- Example: one key with TAP=Play All · DBL=Stop All · HOLD=Clear All

**BIND TYPE: FX**
- Choose source: INPUT CHAIN or TRACK (pick which track)
- Choose parameter from the full list of that source's controls (knobs and toggles)
- Set TAP, DOUBLE TAP, and HOLD to: Increase, Decrease, Reset (for knobs) or Toggle, Reset (for buttons)
- For knobs: while HOLDING the key, press ↑/↓ arrow keys to scrub the value in real time
- Assignments show beneath every knob/toggle in the FX tab for visual confirmation

**BIND TYPE: MACRO**
- Select any macro you've built from the scrollable list
- Fires the macro on tap

**SAVING**: The **SAVE BINDING** button is disabled until you've selected a key, a type, and all required settings. Hit SAVE and the key immediately appears on the keyboard map in the correct color.

**REMOVING**: The REMOVE BINDING button in the key picker section clears the entire binding for that key immediately.

━━━ BINDING COLORS ON KEYBOARD MAP ━━━━━

Keys are color-coded on both keyboard maps (PERFORM and KEYS tabs):
- **Track color tint** — bound to a loop track
- **Purple tint** — global master action (with tap/dbl/hold breakdown shown)
- **Yellow/gold tint** — bound to a macro
- **Teal tint** — bound to an FX parameter
- **Unbound keys** — dim grey with a faint + symbol; click to assign

Click any key (bound or unbound) to open the Universal Key Binding Modal.

━━━ TRACK GESTURE BINDINGS SECTION ━━━━━

In the **KEYS tab**, the Track Gesture Bindings section shows:
- Every track's current bound key (in its track color)
- All three gesture assignments (TAP, DBL, HOLD) and their actions
- EDIT or ASSIGN KEY button — opens the gesture binding directly

━━━ GLOBAL KEYS SECTION ━━━━━━━━━━━━━━━

In the **KEYS tab**, the Global Keys section lists all assignable master actions with their current key and which interaction type (TAP / DBL / HOLD) triggers them. Click ASSIGN KEY or EDIT to open the global gesture modal where you set all three slots independently.

━━━ FX KEY BINDINGS ━━━━━━━━━━━━━━━━━━━━

In the **FX tab**, every single knob and toggle button has a small **⌨ KB** chip beneath it. Click it to open the Universal Key Binding Modal pre-set to FX type for that specific parameter.

Once assigned, the chip shows the bound key letter and the active interaction types (e.g. "G INC·DEC").

The full list of bindable FX parameters per track:
Volume, OVR Decay, EQ On/Off, EQ Low, EQ Mid, EQ High, Comp On/Off, Comp Threshold, Comp Ratio, Reverb Send, Delay Send, Delay Time, Delay Feedback.

The full list for Input Chain:
Input Gain, Comp On/Off, Comp Threshold, Comp Ratio, Comp Attack, Comp Release, EQ On/Off, EQ Low, EQ Mid, EQ High, EQ Mid Freq.

**Knob scrub mode**: Assign any knob to a key. While holding that key down (after 500ms), use ↑ arrow to increase the value and ↓ arrow to decrease it — real-time, sample-accurate, no mouse needed.

━━━ SYNC ENGINE ━━━━━━━━━━━━━━━━━━━━━━━━

LOOPGEN has a master clock system. The moment the first loop starts playing, it sets the master clock timestamp. All loops sync relative to this clock.

**SYNC START (▶S)** — when green: pressing play on a track queues it to start at the next bar boundary aligned with the master clock. Visual: green border, "STARTING…" text, fill sweeps left-to-right. Cancel a pending start by pressing the key again.

**SYNC STOP (■S)** — when teal: pressing stop or clear on a playing track waits until the end of the current loop cycle. Visual: teal border, "STOP AT END" text, fill shrinks right-to-left.

**SYNC·ON/OFF** in top bar: sets all 8 tracks' sync start and sync stop simultaneously.

**AUTO·ON/OFF**: when on, LOOPGEN automatically detects BPM from the first loop you record (measures exact duration → infers tempo to 0.1 BPM precision → sets BPM display). All subsequent loops snap to the nearest whole multiple or division of the first loop's length (¼×, ½×, ⅔×, 1×, 2×, 4×, etc.). A toast notification confirms the detected tempo or snap ratio. Turn AUTO off for free-form loop lengths.

The master clock only resets when you use the **Play From Top** macro.

━━━ BPM, TAP TEMPO, QUANTIZE ━━━━━━━━━━━

**BPM display**: shown in the top bar to 0.1 BPM precision.

**TAP button**: click repeatedly (minimum 2 taps, up to 8) at the desired tempo. Tap times older than 4 seconds are discarded. The TAP button also has a KB chip — bind a key to trigger tap tempo from your keyboard.

**Q·ON / Q·OFF (Quantize)**: when ON, every loop recording is automatically snapped to the nearest bar length at the current BPM after recording stops. Turn this on before recording for perfectly grid-aligned loops.

━━━ MASTER CONTROLS ━━━━━━━━━━━━━━━━━━━━

At the bottom of the PERFORM tab (visible in all layout views except Touch, where they appear as large buttons):
- **▶▶ PLAY ALL** — starts all tracks that have recordings
- **■■ STOP ALL** — stops all playing tracks
- **✕✕ CLEAR ALL** — erases all tracks

Each has a key badge beneath it. Click the badge to open the Universal Key Binding Modal and assign a global key with tap/double-tap/hold actions.

**MASTER VOL knob** (top bar): 0 to 1.5×. Double-click to reset to 0.8.

━━━ MACROS — FULL REFERENCE ━━━━━━━━━━━━

Macros are single-key commands that perform complex multi-track operations in one press. Macro keys fire on tap (no gesture delay — instant on key release).

HOW TO CREATE A MACRO:
1. Go to **KEYS tab** → Macros section → click **+ NEW MACRO**
2. Give it a name (e.g. "Drop Bass", "Chorus In", "Song End")
3. Choose a command from the grouped dropdown
4. Configure parameters: track selection, BPM value, fade duration, etc.
5. In the **KEY BINDING** section at the bottom of the editor, click **+ ASSIGN KEY** and press any key
6. Click **CREATE MACRO**

Key binding is built directly into the macro editor — no separate step. The KB badge on each macro row also opens the editor. The bound key is shown in gold on the keyboard map.

━━━ MACRO COMMAND LIBRARY ━━━━━━━━━━━━━━

TRACK GROUP COMMANDS (you select which tracks):
- **▶ Group Play** — start selected tracks simultaneously
- **■ Group Stop** — stop selected playing tracks simultaneously
- **⊙ Group Toggle Mute / Group Mute / Group Unmute** — mute state control for specific tracks
- **✕ Group Clear** — erase selected tracks
- **◎ Solo Track** — mute all tracks EXCEPT the one you pick

MASTER COMMANDS (all 8 tracks):
- **⬛ Full Drop** — mutes ALL 8 tracks instantly. Loops KEEP RUNNING. Playheads advance through silence. Press Full Bring = everything snaps back in perfect sync. Use this for live drops.
- **⬛ Full Bring / Unsolo All** — unmutes all tracks. Audio returns exactly where the loops are.
- **■⊙ Stop + Mute All** — actually STOPS all loops AND mutes. Use for hard song endings, not live drops.
- **⟳ Play From Top** — force-stops all loops, resets master clock to null, restarts everything from the beginning simultaneously. The nuclear sync fix.

CRITICAL DIFFERENCE — Full Drop vs Stop + Mute All:
Full Drop only silences gain nodes. Loops still running on the audio thread. Hit Full Bring = instant sync-perfect return.
Stop + Mute All calls src.stop() on all sources. Loops dead. Need to restart. Use for endings, not drops.

TEMPO COMMANDS:
- **×2 BPM Double** — doubles current BPM (max 300)
- **÷2 BPM Half** — halves current BPM (min 30)
- **= BPM Set** — jumps to a specific BPM (set with slider in macro editor)

FADE COMMANDS (Web Audio scheduled, sample-accurate):
- **↘ Master Fade Out** — linearRampToValueAtTime on master gain from current to 0 over your chosen duration (0.2s–16s). Auto-calls Stop All after fade completes.
- **↗ Master Fade In** — ramps master gain from 0 back to current level. Does NOT start loops — pair with Group Play or Play All first.
- **↘↗ Group Fade Out / Fade In** — same behavior but only for selected tracks' volume nodes.

FX COMMANDS:
- **~ Toggle Reverb All** — global flip: if any track has reverb above 0, cuts all to 0. If all are 0, restores all to their last values.
- **⏺ Toggle Delay All** — same behavior for delay sends.
- **EQ / Comp group toggles** — enable or disable EQ/Compressor across selected tracks simultaneously.

━━━ LAYOUT MODES ━━━━━━━━━━━━━━━━━━━━━━━

In the **PERFORM tab**, four layout buttons at top right:

**▦ GRID** — default. 2-column grid of track cards, each with waveform, all controls, and settings drawer.

**⌨ KEYS** — full QWERTY keyboard map with live status. Color-coded keys show what each key does. Every key is clickable to open the Universal Key Binding Modal. Below the keyboard: track strips with progress rings.

**⚡ PERFORM** — minimal 4×2 grid of large colored pads. Track name, state, progress bar. Big REC and PLAY buttons. Bound key shown large. Good for tablet or when you need big targets.

**👆 TOUCH** — optimized for touchscreens. Large finger-friendly buttons. Top row: BPM display, TAP, GRID toggle, QUANTIZE toggle. 2-column track pads with 44px+ buttons.

━━━ FX CHAIN — PER TRACK ━━━━━━━━━━━━━━━

Go to the **FX tab** and click any track name to expand its FX panel. Status badges (EQ, COMP, VERB, DELAY) show which effects are active.

Every control has a **⌨ KB** chip beneath it for key binding.

**VOLUME knob**: 0 to 1.5×. Double-click to reset to 0.8. KB chip below.

**OVR DECAY knob**: 0=replace (new overdub fully replaces old), 1=full stack (layers pile up). Default 1.0.

**3-BAND EQ** (enable with ON/OFF toggle — has its own KB chip):
- **LO**: lowshelf at 120Hz, ±15dB. Cuts or boosts bass.
- **MI**: peaking filter, ±15dB, frequency 200Hz–5000Hz. Controls midrange.
- **HI**: highshelf at 8000Hz, ±15dB. Cuts or boosts highs.
- Double-click any knob to reset to 0dB.

**COMPRESSOR** (enable with ON/OFF toggle — has its own KB chip):
- **THR**: threshold in dB (–60 to 0). Audio above this gets compressed.
- **RAT**: compression ratio (1:1 to 20:1). Higher = more aggressive.
- Bypassed: threshold 0dB, ratio 1:1 (unity).

**SENDS** (all four knobs have KB chips):
- **VERB**: reverb send level (0–1). Feeds the global convolution reverb bus.
- **DLY**: delay send level (0–1). Feeds the track's delay line.
- **TIME**: delay time in seconds (0.05s–1s). Independent per track.
- **FBCK**: delay feedback (0–0.9 max). 0.9 max prevents runaway feedback.

Signal chain: entry gain → EQ → Comp → Volume → Mute node → Master. Reverb and delay are parallel sends from after the volume node.

━━━ INPUT FX CHAIN ━━━━━━━━━━━━━━━━━━━━━

Found at the top of the **FX tab**. Processes your microphone signal BEFORE any recording happens. Every control has a KB chip.

**INPUT TRIM knob**: gain 0 to 2×.

**Input COMPRESSOR** (same controls as track comp): tame dynamic range before recording.

**Input 3-BAND EQ**: shape mic tone before it records into any loop. EQ Mid Freq knob lets you dial in the exact center frequency for the mid band (200Hz–5000Hz).

Full input signal path: MIC → Input Trim → Input Comp → Input EQ → MediaStreamDestination (recorder) → loop buffer

━━━ AUDIO ROUTING ━━━━━━━━━━━━━━━━━━━━━━

In the **ROUTING tab**:

**INPUT DEVICE**: select microphone or audio interface. Change this to use an audio interface instead of the built-in mic.

**OUTPUT DEVICE**: select playback destination. Chrome/Edge only (setSinkId API — not supported in Firefox or Safari).

Full signal path: MIC → INPUT GAIN → COMPRESSOR → 3-BAND EQ → RECORDER → TRACK EQ → TRACK COMP → TRACK VOL → REV SEND → DLY SEND → MASTER OUT

━━━ MIDI OUTPUT ━━━━━━━━━━━━━━━━━━━━━━━━

In the **MIDI tab**:

Click **ENABLE MIDI** — browser will request Web MIDI access. Select your output port from the dropdown. Select MIDI channel (1–16).

Once enabled, LOOPGEN can send MIDI note/CC messages to external hardware or DAWs when gestures fire. Requires Chrome (Web MIDI API — not supported in Firefox or Safari).

━━━ WAV EXPORT ━━━━━━━━━━━━━━━━━━━━━━━━━

Click **⬇ EXPORT WAV** in the top bar (grayed out until audio initialized and at least one loop exists).

LOOPGEN creates an OfflineAudioContext and renders all active tracks through their complete FX chains. Output: mono WAV file, maximum 60 seconds (4× the longest loop's duration, capped at 60s). File auto-downloads. Import directly into any DAW.

EQ and Comp enabled/disabled states are captured at export time — set them exactly as you want before exporting. Muted tracks export as silence.

━━━ BINDING PRESETS ━━━━━━━━━━━━━━━━━━━━

In the **KEYS tab** → Binding Presets section:

- Type a name → click SAVE → complete binding layout saved (all track bindings with gestures, all global key bindings, all macro key bindings)
- Click LOAD on any preset to instantly restore that layout
- Use to switch between different performance setups (e.g. "Singer/Songwriter", "Live DJ Set", "Studio Session")

━━━ TRACK ADVANCED SETTINGS ━━━━━━━━━━━━

Click the ⚙ settings button on any track card (in GRID layout) to open the track drawer:

**Count-In**: 0, 1, or 2 bars of metronome clicks before recording starts. Hear the click, then record.

**Auto-Rec Bars**: 0 (manual stop), 1, 2, 4, or 8 bars. Recording automatically stops after the set number of bars.

**Threshold Rec**: waits for audio input above a set level before starting the recording. Threshold level adjustable.

**Overdub Decay**: 0=full replace, 1=full stack. Controls layering behavior.

**Play Mode**: Loop (repeat forever), One-shot (plays once then stops), Ping-Pong (forward then reverse, alternating).

**Playback Speed**: 0.25×, 0.5×, 1×, 2×, 4×. Changes pitch along with tempo.

**Reverse**: play the loop backwards.

**Sync Stop Mode**: Immediate, Loop End, Bar End, Phrase End, Fade.

**Mute Fade Duration**: 0=instant mute/unmute, 0.1–2s=smooth fade in/out.

**Punch-In**: enable punch-in recording, set start/end points (0–100% of loop length).

**Mute Group**: A, B, C, or D — radio-button muting. Un-muting one track in a group mutes the others.

━━━ TROUBLESHOOTING ━━━━━━━━━━━━━━━━━━━━

**"Nothing happens when I press keys"**
→ Click anywhere on the LOOPGEN page to refocus it
→ Check audio is initialized (◉ INITIALIZE AUDIO clicked, mic allowed)
→ Open KEYS tab and verify the key is actually bound
→ Don't press keys while a text input field has focus

**"My loops don't stay in sync / drift apart"**
→ Enable ▶S (Sync Start) on all tracks
→ Your first recorded loop sets the master clock — make it tight
→ Enable Q·ON before recording to snap loop lengths to bar boundaries
→ Subsequent loops should be whole multiples or divisions of the first loop's length

**"Audio sounds distorted or clipping"**
→ Reduce INPUT TRIM in FX tab → Input FX Chain
→ Lower the track VOLUME knob in that track's FX panel
→ Enable the input COMPRESSOR to tame peaks before recording

**"Key is assigned but won't fire"**
→ Click the page to focus it first
→ Open KEYS tab and confirm binding is listed with the correct type
→ Confirm audio is initialized
→ If it's a track key: the action may be disabled for that track state (e.g. PLAY on an empty track does nothing)

**"Double-tap not registering"**
→ 280ms window between taps — press faster
→ Make sure the second tap happens before the first tap's 260ms commit window fires

**"FX key binding doesn't seem to do anything"**
→ Open FX tab and check the KB chip under that parameter — confirm the key is shown
→ For toggle params: tap should flip the ON/OFF state; check the ON/OFF button changed
→ For knob params: tap increases, double-tap decreases. Hold the key then use ↑/↓ arrows to scrub live.

**"I can't find where to bind a key to a master control"**
→ Click any key on the keyboard map (in PERFORM tab ⌨ KEYS view or KEYS tab)
→ In the Universal Key Binding Modal, select **GLOBAL** as the binding type
→ Set TAP, DOUBLE TAP, and HOLD to different actions — all on one key

**"I want one key to do Play All on tap and Stop All on double tap"**
→ Click that key on the keyboard map → Universal Key Binding Modal → GLOBAL
→ Set TAP = Play All, DOUBLE TAP = Stop All, HOLD = Clear All (or anything else)
→ Save. Done.

**"Loop starts at wrong place when I bring it back in"**
→ Sync Start was off when you pressed play. Enable ▶S.

**"Export WAV sounds different from what I heard"**
→ EQ/Comp enabled states are captured at export time. Match your performance state.
→ Muted tracks export as silence — unmute anything you want in the mix.

**"Play From Top brought loops back but still out of sync"**
→ Loop lengths must be whole multiples of each other. First loop defines the grid.

**"The keyboard map shows a key bound but I don't remember setting it"**
→ Open the Universal Key Binding Modal for that key to see what it does, then REMOVE BINDING if not wanted.

━━━ PERFORMANCE TIPS ━━━━━━━━━━━━━━━━━━━

- Set BPM with TAP before your set begins, before recording anything
- Enable Q·ON before recording so loop lengths snap to bars
- Enable AUTO·ON so LOOPGEN auto-detects tempo from your first loop
- Set SYNC·ON to keep all loops on the same clock
- Record your foundation loop (bass, rhythm) on Loop 1 first — this sets the master clock
- Bind Q/W/E/R/T/Y/U/I to Loops 1–8 for easy left-hand reach while playing guitar/bass
- Default track gestures: TAP=Smart Record, DBL=Play/Stop, HOLD=Clear
- Use Full Drop + Full Bring for live drops — never Stop All
- Save your binding layout as a preset before any performance
- Use ⌨ KEYS view during performance to see your whole map at a glance
- Bind reverb send to a key with TAP=increase, DBL=decrease so you can dial verb while playing
- Use the Universal Key Binding Modal to put Play All, Stop All, and Clear All on one key with different gestures
- Build macros for chorus hits, verse drops, and song endings before you go on stage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE RULES:
- Always answer specifically — no generic "it depends" responses
- Numbered steps for any how-to question
- Bold all button names, tab names, and UI elements
- If they describe a problem, diagnose and fix it
- If they're mid-session, prioritize the fastest fix first
- Never say "I don't know" — use your Web Audio and looper knowledge to reason through edge cases
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;


// ── UTILS ──────────────────────────────────────────────────────────────────
function encodeWAV(ab) {
  const sr=ab.sampleRate,len=ab.length,out=new ArrayBuffer(44+len*2),v=new DataView(out);
  const ws=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};
  ws(0,'RIFF');v.setUint32(4,36+len*2,true);ws(8,'WAVE');ws(12,'fmt ');
  v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
  v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);
  ws(36,'data');v.setUint32(40,len*2,true);
  const d=ab.getChannelData(0);let off=44;
  for(let i=0;i<len;i++){const s=Math.max(-1,Math.min(1,d[i]));v.setInt16(off,s<0?s*0x8000:s*0x7FFF,true);off+=2;}
  return out;
}

function paintWave(canvas,buf,color){
  if(!canvas||!buf)return;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  // Waveform fill — subtle gradient under the wave
  const grad=ctx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0,color+'22');
  grad.addColorStop(0.5,color+'08');
  grad.addColorStop(1,color+'00');
  const d=buf.getChannelData(0),step=Math.max(1,Math.floor(d.length/w));
  // Fill path
  ctx.beginPath();
  ctx.moveTo(0,h/2);
  for(let i=0;i<w;i++){
    let mx=0;
    for(let j=0;j<step;j++){const vv=Math.abs(d[i*step+j]||0);if(vv>mx)mx=vv;}
    ctx.lineTo(i+.5,(0.5-mx*0.44)*h);
  }
  for(let i=w-1;i>=0;i--){
    let mx=0;
    for(let j=0;j<step;j++){const vv=Math.abs(d[i*step+j]||0);if(vv>mx)mx=vv;}
    ctx.lineTo(i+.5,(0.5+mx*0.44)*h);
  }
  ctx.closePath();
  ctx.fillStyle=grad;
  ctx.fill();
  // Waveform stroke
  ctx.strokeStyle=color+'99';ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<w;i++){
    let mn=0,mx=0;
    for(let j=0;j<step;j++){const vv=d[i*step+j]||0;if(vv<mn)mn=vv;if(vv>mx)mx=vv;}
    ctx.moveTo(i+.5,(0.5-mx*0.44)*h);
    ctx.lineTo(i+.5,(0.5-mn*0.44)*h);
  }
  ctx.stroke();
  // Center line
  ctx.strokeStyle=color+'20';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  // Loop boundary markers — bright vertical lines at start and end
  ctx.strokeStyle=color+'cc';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(1,h);ctx.stroke();
  ctx.beginPath();ctx.moveTo(w-1,0);ctx.lineTo(w-1,h);ctx.stroke();
}

// Paint playhead over an already-drawn waveform canvas
function paintPlayhead(canvas,progress,color){
  if(!canvas||progress==null)return;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  const x=Math.round(progress*w);
  // Glow behind the line
  ctx.save();
  ctx.shadowColor=color;
  ctx.shadowBlur=8;
  ctx.strokeStyle=color;
  ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();
  ctx.restore();
  // Small triangle at top
  ctx.fillStyle=color;
  ctx.beginPath();ctx.moveTo(x-4,0);ctx.lineTo(x+4,0);ctx.lineTo(x,5);ctx.closePath();ctx.fill();
}

async function quantizeBuf(actx,buf,bpm){
  const bar=(4*60)/bpm,bars=Math.max(1,Math.round(buf.duration/bar)),target=Math.round(bars*bar*buf.sampleRate);
  if(Math.abs(target-buf.length)<200)return buf;
  const nb=actx.createBuffer(buf.numberOfChannels,target,buf.sampleRate);
  for(let c=0;c<buf.numberOfChannels;c++)nb.getChannelData(c).set(buf.getChannelData(c).subarray(0,Math.min(buf.length,target)));
  return nb;
}

// ── MASTER LOOP SYNC ─────────────────────────────────────────────────────────
// Infer BPM from first loop duration to 0.1 BPM precision.
// Strategy: try all bar counts 1-32, find the one that gives a BPM in range,
// then return the exact floating-point BPM to 1 decimal place.
function inferBPMFromLoop(duration){
  const BAR_COUNTS=[1,2,3,4,6,8,12,16,24,32];
  const BPM_MIN=30, BPM_MAX=250;
  let best=null,bestErr=Infinity;
  for(const bars of BAR_COUNTS){
    // exact BPM = bars * 4 beats * 60sec / duration
    const exactBpm=(bars*4*60)/duration;
    if(exactBpm<BPM_MIN||exactBpm>BPM_MAX)continue;
    // Round to nearest 0.1 BPM
    const roundedBpm=Math.round(exactBpm*10)/10;
    const cleanDur=(bars*4*60)/roundedBpm;
    const err=Math.abs(cleanDur-duration)/duration;
    if(err<bestErr){
      bestErr=err;
      best={bpm:roundedBpm,bars,cleanDuration:cleanDur,exactBpm,error:err};
    }
  }
  return best;
}

// Snap a buffer to the nearest whole multiple or division of the master loop duration.
// Uses sample-accurate math — no approximation.
// Multiples checked: 1/4, 1/3, 1/2, 2/3, 1, 4/3, 3/2, 2, 3, 4, 6, 8 of masterDuration
async function snapToMasterLoop(actx,buf,masterDuration){
  const RATIOS=[0.25, 1/3, 0.5, 2/3, 1, 4/3, 1.5, 2, 3, 4, 6, 8];
  let bestRatio=1,bestErr=Infinity;
  for(const r of RATIOS){
    const target=masterDuration*r;
    const err=Math.abs(buf.duration-target)/target;
    if(err<bestErr){bestErr=err;bestRatio=r;}
  }
  const targetDur=masterDuration*bestRatio;
  const targetSamples=Math.round(targetDur*buf.sampleRate);
  // Only snap if we're more than 30ms off — ignore tiny rounding differences
  if(Math.abs(targetSamples-buf.length)<(buf.sampleRate*0.03))return{buf,snapped:false,ratio:bestRatio};
  const nb=actx.createBuffer(buf.numberOfChannels,targetSamples,buf.sampleRate);
  for(let c=0;c<buf.numberOfChannels;c++)
    nb.getChannelData(c).set(buf.getChannelData(c).subarray(0,Math.min(buf.length,targetSamples)));
  return{buf:nb,snapped:true,ratio:bestRatio,targetDur};
}

async function mixOver(actx,base,layer){
  const off=new OfflineAudioContext(1,base.length,actx.sampleRate);
  const s1=off.createBufferSource();s1.buffer=base;s1.connect(off.destination);s1.start(0);
  const s2=off.createBufferSource();s2.buffer=layer;s2.loop=true;s2.loopEnd=base.duration;s2.connect(off.destination);s2.start(0);
  return off.startRendering();
}

// Overdub with feedback decay — decay=1.0 full layer, decay=0.0 full replace
async function mixOverWithDecay(actx,base,layer,decay){
  const off=new OfflineAudioContext(1,base.length,actx.sampleRate);
  const s1=off.createBufferSource();s1.buffer=base;
  const dg=off.createGain();dg.gain.value=Math.max(0,Math.min(1,decay));
  s1.connect(dg);dg.connect(off.destination);s1.start(0);
  const s2=off.createBufferSource();s2.buffer=layer;s2.loop=true;s2.loopEnd=base.duration;
  s2.connect(off.destination);s2.start(0);
  return off.startRendering();
}

// Reverse an AudioBuffer — returns new buffer playing backwards
function reverseBuffer(buf){
  const nb=new AudioBuffer({numberOfChannels:buf.numberOfChannels,length:buf.length,sampleRate:buf.sampleRate});
  for(let c=0;c<buf.numberOfChannels;c++)nb.copyToChannel(buf.getChannelData(c).slice().reverse(),c);
  return nb;
}

// Resample buffer to simulate speed change (stretches/compresses time, shifts pitch)
async function resampleBuffer(buf, rate){
  if(Math.abs(rate-1.0)<0.001)return buf;
  const newLen=Math.round(buf.length/rate);
  const off=new OfflineAudioContext(buf.numberOfChannels,newLen,buf.sampleRate);
  const src=off.createBufferSource();src.buffer=buf;src.playbackRate.value=rate;src.connect(off.destination);src.start(0);
  return off.startRendering();
}

// Punch-in splice: replace samples [startSec, endSec] in base with corresponding samples from patch
async function punchInSplice(actx, base, patch){
  // patch buffer replaces the first (patch.duration) seconds starting at offset 0 of base
  // The caller should pass a patch that corresponds to the desired region
  const off=new OfflineAudioContext(1,base.length,actx.sampleRate);
  const s1=off.createBufferSource();s1.buffer=base;s1.connect(off.destination);s1.start(0);
  // patch plays at correct offset, replacing the region
  const s2=off.createBufferSource();s2.buffer=patch;s2.connect(off.destination);s2.start(0);
  return off.startRendering();
}

function createReverbIR(ctx,dur=2.8,decay=2.2){
  const sr=ctx.sampleRate,len=Math.floor(sr*dur),ir=ctx.createBuffer(2,len,sr);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,decay);}
  return ir;
}

// ── KNOB ──────────────────────────────────────────────────────────────────
function Knob({value,min,max,onChange,label,color='#888',size=40,decimals=1,unit='',defaultValue}){
  const onMD=(e)=>{
    e.preventDefault();e.stopPropagation();
    const sv=value,sy=e.clientY,range=max-min;
    const onMM=(me)=>{const dy=sy-me.clientY;onChange(Math.max(min,Math.min(max,sv+(dy/120)*range)));};
    const onMU=()=>{window.removeEventListener('mousemove',onMM);window.removeEventListener('mouseup',onMU);};
    window.addEventListener('mousemove',onMM);window.addEventListener('mouseup',onMU);
  };
  const onDbl=(e)=>{e.preventDefault();if(defaultValue!==undefined)onChange(defaultValue);};
  const pct=Math.max(0,Math.min(1,(value-min)/(max-min)));
  // All geometry shares one center — cx/cy always at dead center of SVG
  const cx=size/2, cy=size/2;
  const r=size/2-3; // 3px gap so stroke (width=3) doesn't clip
  const a2r=(a)=>(a-90)*Math.PI/180;
  const p2c=(a)=>({x:cx+r*Math.cos(a2r(a)),y:cy+r*Math.sin(a2r(a))});
  const sA=-135,eA=135,cA=sA+pct*270;
  const sp=p2c(sA),ep=p2c(eA),cp=p2c(cA),ip=p2c(cA);
  const la=pct>0.5?1:0;
  const trkD=`M${sp.x.toFixed(2)},${sp.y.toFixed(2)}A${r},${r},0,1,1,${ep.x.toFixed(2)},${ep.y.toFixed(2)}`;
  const actD=pct>0.001?`M${sp.x.toFixed(2)},${sp.y.toFixed(2)}A${r},${r},0,${la},1,${cp.x.toFixed(2)},${cp.y.toFixed(2)}`:'';
  return(
    <div onMouseDown={onMD} onDoubleClick={onDbl} title="Drag up/down · Double-click to reset"
      style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'ns-resize',userSelect:'none'}}>
      <svg width={size} height={size} style={{overflow:'visible',display:'block'}}>
        {/* Track arc — full sweep background */}
        <path d={trkD} fill="none" stroke="var(--border2,#1a1a2e)" strokeWidth={3} strokeLinecap="round"/>
        {/* Active arc — colored fill from start to current value */}
        {actD&&<path d={actD} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"/>}
        {/* Center cap — same cx/cy as arcs */}
        <circle cx={cx} cy={cy} r={r*0.3} fill="var(--card2,#0a0a0a)" stroke="var(--border)" strokeWidth={1}/>
        {/* Indicator dot — sits on the arc */}
        <circle cx={ip.x} cy={ip.y} r={2.5} fill={color}/>
      </svg>
      <div style={{textAlign:'center',lineHeight:1.3}}>
        <div style={{fontSize:8,color:'var(--text40,#808098)'}}>{value.toFixed(decimals)}{unit}</div>
        <div style={{fontSize:7,color:'var(--text40,#808098)',letterSpacing:1}}>{label}</div>
      </div>
    </div>
  );
}

// ── KEY BADGE ─────────────────────────────────────────────────────────────
function KB({k,waiting,onClick}){
  return <button onClick={onClick} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:20,height:15,padding:'0 3px',background:waiting?'#ff9f43':k?'rgba(128,128,128,0.15)':'transparent',border:`1px solid ${waiting?'#ff9f43':k?'rgba(128,128,128,0.4)':'rgba(128,128,128,0.2)'}`,borderRadius:2,cursor:'pointer',color:waiting?'#000':k?'inherit':'rgba(128,128,128,0.5)',fontFamily:'DM Mono,monospace',fontSize:8,animation:waiting?'pulse .6s infinite':'none',flexShrink:0}}>
    {waiting?'…':k?k.toUpperCase():'—'}
  </button>;
}

// ── MAIN ──────────────────────────────────────────────────────────────────
export default function LoopStation(){
  return <LicenseGate><LoopStationInner/></LicenseGate>;
}
function LoopStationInner(){
  const [tracks,setTracks]=useState(()=>Array.from({length:N},(_,i)=>({
    id:i,name:`LOOP ${i+1}`,state:'empty',isMuted:false,duration:0,color:COLORS[i],
    overdub:false,syncStart:true,syncStop:true,stopRecMode:'play',
    // ── Advanced recording features ──
    overdubDecay:1.0,    // 0=replace existing, 1=full layer stack
    autoRecBars:0,       // 0=manual stop, 1-8=auto stop after N bars
    muteGroup:null,      // null | 'A' | 'B' | 'C' | 'D' — radio-button mute switching
    isReversed:false,    // play buffer backwards
    playMode:'loop',     // 'loop' | 'oneshot' | 'pingpong'
    countIn:0,           // 0=none, 1=1 bar, 2=2 bars metronome before recording
    thresholdRec:false,  // wait for audio input before starting recording
    thresholdLevel:0.05, // 0.01–0.5 input level to trigger
    // ── Round 2 ──
    muteFadeDur:0,       // 0=instant, 0.1–2s fade when muting/unmuting
    syncStopMode:'loop-end', // 'immediate'|'loop-end'|'bar-end'|'phrase-end'|'fade'
    syncStopFadeDur:1.0, // seconds for fade-stop mode
    syncStopPhraseBars:4,// how many bars = a "phrase"
    recFade:0.02,        // seconds of fade-in/out at rec boundaries (0=off)
    playSpeed:1.0,       // playback rate 0.25–4.0 (affects pitch)
    pingPongPhase:1,     // internal: 1=forward -1=reverse for pingpong
    // Punch-in
    punchInEnabled:false,
    punchInStart:0.25,   // 0–1 normalized position in loop
    punchInEnd:0.75,
  })));
  const [bindings,setBindings]=useState(()=>{try{const s=localStorage.getItem('lg-bindings');return s?JSON.parse(s):{}}catch{return{}}});
  const [assigning,setAssigning]=useState(null);
  const [hasAudio,setHasAudio]=useState(false);
  const [inputLevel,setInputLevel]=useState(0); // 0–1 live RMS for threshold meter
  const [masterLoopDur,setMasterLoopDur]=useState(null); // UI mirror of masterLoopDurR
  const [audioError,setAudioError]=useState(null);
  const [bpm,setBpm]=useState(()=>{try{const v=localStorage.getItem('lg-bpm');return v?parseInt(v):120}catch{return 120}});
  const [tapTimes,setTapTimes]=useState([]);
  const [quantize,setQuantize]=useState(()=>{try{return localStorage.getItem('lg-quantize')==='true'}catch{return false}});
  const [progresses,setProgresses]=useState({});
  const [exporting,setExporting]=useState(false);
  const [panel,setPanel]=useState(null);
  const [presets,setPresets]=useState([]);
  const [presetName,setPresetName]=useState('');
  const [dragOver,setDragOver]=useState(null);
  const [gestureModal,setGestureModal]=useState(null); // null | { trackId, awaitingKey:bool }
  // const [globalGestureModal,setGlobalGestureModal]=useState(null); // REMOVED — dead state, modal was unreachable
  const [layout,setLayout]=useState(()=>{
    if(typeof window!=='undefined'&&('ontouchstart' in window||navigator.maxTouchPoints>0))return 'touch';
    return 'grid';
  }); // 'grid' | 'keyboard' | 'performance' | 'touch'
  const [macros,setMacros]=useState([]); // [{ id, name, command, params }]
  const macrosR=useRef([]); // always-current ref for use in callbacks
  useEffect(()=>{macrosR.current=macros;},[macros]);
  const [macroModal,setMacroModal]=useState(null); // null | { macro, isNew }
  const fadeTimerR=useRef(null); // track active fade RAF
  const cutoffResetTimerR=useRef(null); // reset lowpass filter after groupCutoff macro

  // ── UI MODES ──────────────────────────────────────────────────────────────────
  const [darkMode,setDarkMode]=useState(()=>{try{return localStorage.getItem('lg-dark')!=='false';}catch{return true;}});
  const [monitorEnabled,setMonitorEnabled]=useState(false);
  useEffect(()=>{try{localStorage.setItem('lg-dark',darkMode);}catch{};},[darkMode]);
  // Conflict modal: fires when user tries to assign an already-mapped key/gesture
  const [conflictModal,setConflictModal]=useState(null); // null | { msg:str, onConfirm:fn }

  // ── METRONOME ──────────────────────────────────────────────────────────────────
  const [metronomeMode,setMetronomeMode]=useState('off'); // 'off' | 'always' | 'countinOnly'
  const metronomeIntervalR=useRef(null);
  const metronomeBeatR=useRef(0);

  // ── BPM EDIT ──────────────────────────────────────────────────────────────────
  const [bpmEditing,setBpmEditing]=useState(false);
  const [bpmEditVal,setBpmEditVal]=useState('');

  // ── MASTER INPUT / PLAYBACK VOLUME ────────────────────────────────────────────
  const [masterInputVol,setMasterInputVol]=useState(1.0);
  const [masterPlaybackVol,setMasterPlaybackVol]=useState(1.0);

  // ── FX KEY BINDINGS ─────────────────────────────────────────────────────────
  // fxBindings: { key: { type:'fxParam', target:'track'|'input', trackId?, param, tap, doubleTap, hold, label, isKnob, min?, max? } }
  const [fxBindings,setFxBindings]=useState(()=>{try{const s=localStorage.getItem('lg-fx-bindings');return s?JSON.parse(s):{}}catch{return{}}});
  const fxBindingsR=useRef({});
  fxBindingsR.current=fxBindings;
  useEffect(()=>{try{localStorage.setItem('lg-fx-bindings',JSON.stringify(fxBindings))}catch{}},[fxBindings]);

  // fxKbModal: null | { target:'track'|'input', trackId?, param, label, isKnob, min?, max?, awaitingKey:bool, step2:bool }
  const [fxKbModal,setFxKbModal]=useState(null);

  // keyAssignModal: null | { key:string|null, awaitingKey:bool } — "pick what to bind this key to"
  const [keyAssignModal,setKeyAssignModal]=useState(null);

  // ── KEY FLOW MODAL ─────────────────────────────────────────────────────────
  // New unified step-by-step binding: key → gesture → type → details
  const [keyFlowModal,setKeyFlowModal]=useState(null);
  // shape: { key, awaitingKey, step:'key'|'gesture'|'type'|'details',
  //   gesture:'tap'|'doubleTap'|'hold'|null,
  //   type:'track'|'global'|'fx'|'macro'|null,
  //   trackId, trackAction,
  //   globalAction,
  //   fxTarget, fxTrackId, fxParam, fxIsKnob, fxLabel, fxMin, fxMax, fxStep, fxDefault,
  //   fxDirection, fxSpeed, fxHoldMin, fxHoldMax,
  //   macroName, macroCommand, macroParams
  // }
  const KFM_BLANK={key:null,awaitingKey:false,step:'gesture',gesture:null,type:null,
    trackId:null,trackAction:'smartRecord',
    globalAction:'playAll',
    fxTarget:'track',fxTrackId:null,fxParam:null,fxIsKnob:true,fxLabel:'',fxMin:0,fxMax:1,fxStep:0.05,fxDefault:0,
    fxDirection:'up',fxSpeed:'medium',fxHoldMin:0,fxHoldMax:1,
    macroName:'',macroCommand:'groupPlay',macroParams:{trackIds:[]}};

  // ── UNIVERSAL KEY BINDING MODAL ──────────────────────────────────────────────
  const [universalKeyModal,setUniversalKeyModal]=useState(null);
  // {
  //   key: string|null, awaitingKey: bool,
  //   bindType: 'track'|'global'|'fx'|'macro'|null,
  //   // track
  //   selectedTrackId: number|null, tapAction: string, doubleTapAction: string, holdAction: string, stopRecMode: 'play'|'overdub',
  //   // global
  //   globalTap: string, globalDoubleTap: string, globalHold: string,
  //   // fx
  //   fxTarget: 'track'|'input', fxTrackId: number|null, fxParam: string|null,
  //   fxTap: string, fxDoubleTap: string, fxHold: string,
  //   // macro
  //   macroId: string|null,
  // }

  // Master list of all FX parameters (used in universal modal)
  const FX_PARAMS_INPUT=[
    {param:'gain',label:'Input Gain',isKnob:true,min:0,max:2,step:0.05,defaultValue:1},
    {param:'compEnabled',label:'Compressor On/Off',isKnob:false},
    {param:'compThreshold',label:'Comp Threshold',isKnob:true,min:-60,max:0,step:2,defaultValue:-24},
    {param:'compRatio',label:'Comp Ratio',isKnob:true,min:1,max:20,step:1,defaultValue:4},
    {param:'compAttack',label:'Comp Attack',isKnob:true,min:0.001,max:0.5,step:0.01,defaultValue:0.003},
    {param:'compRelease',label:'Comp Release',isKnob:true,min:0.01,max:2,step:0.05,defaultValue:0.25},
    {param:'eqEnabled',label:'EQ On/Off',isKnob:false},
    {param:'eqLow',label:'EQ Low',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
    {param:'eqMid',label:'EQ Mid',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
    {param:'eqHigh',label:'EQ High',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
    {param:'eqMidFreq',label:'EQ Mid Freq',isKnob:true,min:200,max:5000,step:50,defaultValue:1000},
  ];
  const FX_PARAMS_TRACK=[
    {param:'volume',label:'Volume',isKnob:true,min:0,max:1.5,step:0.05,defaultValue:0.8},
    {param:'eqEnabled',label:'EQ On/Off',isKnob:false},
    {param:'eqLow',label:'EQ Low',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
    {param:'eqMid',label:'EQ Mid',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
    {param:'eqHigh',label:'EQ High',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
    {param:'compEnabled',label:'Comp On/Off',isKnob:false},
    {param:'compThreshold',label:'Comp Threshold',isKnob:true,min:-60,max:0,step:2,defaultValue:-18},
    {param:'compRatio',label:'Comp Ratio',isKnob:true,min:1,max:20,step:1,defaultValue:4},
    {param:'reverbSend',label:'Reverb Send',isKnob:true,min:0,max:1,step:0.05,defaultValue:0},
    {param:'delaySend',label:'Delay Send',isKnob:true,min:0,max:1,step:0.05,defaultValue:0},
    {param:'delayTime',label:'Delay Time',isKnob:true,min:0.05,max:1,step:0.025,defaultValue:0.375},
    {param:'delayFeedback',label:'Delay Feedback',isKnob:true,min:0,max:0.9,step:0.05,defaultValue:0.3},
  ];

  // Hold-for-knob: track which key is being held for FX scrub
  const fxHeldR=useRef({}); // { key: { param, target, trackId, holdTimer, scrubbing } }

  // ── NEW FEATURE REFS ────────────────────────────────────────────────────────
  const reverseBufsR=useRef({}); // cached reversed AudioBuffers per track
  const autoRecTimerR=useRef({}); // auto-rec stop timers per track
  const thresholdTimerR=useRef({}); // threshold rec polling timers
  const recStartOffsetR=useRef({}); // master-loop offset (seconds) when each track started recording
  const analyserR=useRef(null); // AnalyserNode for threshold detection
  const speedBufsR=useRef({}); // { id: { rate, buf } } cached speed-shifted buffers
  const pingPongPhaseR=useRef({}); // current direction per track: 1=fwd -1=rev
  const muteFadeTimerR=useRef({}); // mute fade scheduled values
  const punchInTimerR=useRef({}); // punch-in region replace timers

  // ── SUPPORT CHAT ────────────────────────────────────────────────────────────
  const [chatMsgs,setChatMsgs]=useState([]);
  const [chatInput,setChatInput]=useState('');
  const [chatBusy,setChatBusy]=useState(false);
  const [chatOpen,setChatOpen]=useState(true);
  const chatEndR=useRef(null);
  const chatHistR=useRef([]);

  // ── TAB NAVIGATION ───────────────────────────────────────────────────────────
  const [activeTab,setActiveTab]=useState('perform');
  const [chatPopupOpen,setChatPopupOpen]=useState(false);
  const [trackSettingsOpen,setTrackSettingsOpen]=useState({});

  // ── MIDI STATE ───────────────────────────────────────────────────────────────
  const [midiEnabled,setMidiEnabled]=useState(false);
  const [midiOutputs,setMidiOutputs]=useState([]); // available MIDI output ports
  const [midiOutputId,setMidiOutputId]=useState(''); // selected port id
  const [midiChannel,setMidiChannel]=useState(1); // 1-16
  const [midiAccess,setMidiAccess]=useState(null);
  const [midiOverrides,setMidiOverrides]=useState({}); // {key_gesture: {type:'note'|'cc'|'pc', value:0-127, channel:1-16}}
  const midiOutputR=useRef(null); // current WebMIDI output object
  const midiEnabledR=useRef(false);
  const midiChannelR=useRef(1);
  const midiOverridesR=useRef({});
  midiEnabledR.current=midiEnabled;
  midiChannelR.current=midiChannel;
  midiOverridesR.current=midiOverrides; // {[trackId]: bool}

  // ── MIDI INPUT ──────────────────────────────────────────────────────────
  const [midiInputs,setMidiInputs]=useState([]); // available input ports
  const [midiInputEnabled,setMidiInputEnabled]=useState(()=>{try{return localStorage.getItem('lg-midiIn')==='true'}catch{return false}});
  // Per-device enable state: {deviceId: bool}. Missing or undefined = enabled (default allow)
  const [midiInputDevicesOn,setMidiInputDevicesOn]=useState(()=>{try{const s=localStorage.getItem('lg-midiIn-devs');return s?JSON.parse(s):{}}catch{return{}}});
  const midiInputDevicesOnR=useRef({});
  midiInputDevicesOnR.current=midiInputDevicesOn;
  const [midiActivity,setMidiActivity]=useState(false); // true for ~150ms on any MIDI event
  const midiFlashTimerR=useRef(null);
  const flashMidi=()=>{
    setMidiActivity(true);
    if(midiFlashTimerR.current)clearTimeout(midiFlashTimerR.current);
    midiFlashTimerR.current=setTimeout(()=>setMidiActivity(false),150);
  };
  const [midiLearn,setMidiLearn]=useState(null); // {action, targetFn} — currently listening to capture next event
  const [midiBindings,setMidiBindings]=useState(()=>{try{const s=localStorage.getItem('lg-midiBindings');return s?JSON.parse(s):{}}catch{return{}}});
  // Bindings shape: { 'ch1-note60': { type:'track'|'global'|'fx'|'macro', ...same as keyboard bindings } }
  // CC bindings shape: { 'ch1-cc7': { type:'fxParam', target, trackId, param, min, max } }
  const midiBindingsR=useRef({});
  midiBindingsR.current=midiBindings;
  const midiLearnR=useRef(null);
  midiLearnR.current=midiLearn;
  useEffect(()=>{try{localStorage.setItem('lg-midiBindings',JSON.stringify(midiBindings))}catch{}},[midiBindings]);
  useEffect(()=>{try{localStorage.setItem('lg-midiIn',String(midiInputEnabled))}catch{}},[midiInputEnabled]);
  useEffect(()=>{try{localStorage.setItem('lg-midiIn-devs',JSON.stringify(midiInputDevicesOn))}catch{}},[midiInputDevicesOn]);

  // Gesture detection refs
  const heldR=useRef({});    // { key: { pressTime, holdFired, holdTimer } }
  const tapTimerR=useRef({}); // { key: timeoutId } — wait for possible double-tap
  const lastTapR=useRef({});  // { key: timestamp }
  const HOLD_MS=500, DBL_MS=280, TAP_COMMIT_MS=260;
  const [fxOpen,setFxOpen]=useState({});
  const [globalSync,setGlobalSync]=useState(()=>{try{return localStorage.getItem('lg-globalSync')!=='false'}catch{return true}}); // default for new tracks; also "set all" shortcut
  const [pending,setPending]=useState({}); // { [id]: 'stop'|'clear'|'start' }
  const pendingTimers=useRef({});
  const pendingTypeR=useRef({}); // mirror of pending for use inside callbacks
  const masterClockR=useRef(null);
  const masterLoopDurR=useRef(null);
  const [autoSync,setAutoSync]=useState(()=>{try{return localStorage.getItem('lg-autoSync')!=='false'}catch{return true}});
  const [syncFeedback,setSyncFeedback]=useState(null); // {type:'tempo'|'snap', ...}
  const [devices,setDevices]=useState({inputs:[],outputs:[]});
  const [selectedInput,setSelectedInput]=useState('default');
  const [selectedOutput,setSelectedOutput]=useState('default');
  const [masterVol,setMasterVol]=useState(0.8);
  const [inputFX,setInputFX]=useState({
    gain:1,compEnabled:false,compThreshold:-24,compRatio:4,compAttack:0.003,compRelease:0.25,
    eqEnabled:false,eqLow:0,eqMid:0,eqHigh:0,eqMidFreq:1000,
  });
  const [trackFX,setTrackFX]=useState(()=>Array.from({length:N},(_,i)=>({
    id:i,volume:0.8,eqEnabled:false,eqLow:0,eqMid:0,eqHigh:0,
    compEnabled:false,compThreshold:-18,compRatio:4,
    reverbSend:0,delaySend:0,delayTime:0.375,delayFeedback:0.3,
  })));

  // Audio refs
  const actxR=useRef(null),streamR=useRef(null),micSrcR=useRef(null);
  const masterGainR=useRef(null);
  const monitorGainR=useRef(null); // gain node for mic monitor (through-output)
  const inputGainR=useRef(null),inputCompR=useRef(null),inputEQR=useRef({low:null,mid:null,high:null}),inputDestR=useRef(null);
  const reverbConvR=useRef(null);
  const trackEntryR=useRef({}),trackEQR=useRef({}),trackCompR=useRef({});
  const trackVolR=useRef({}),trackMuteR=useRef({}),trackCutoffR=useRef({});
  const trackRevSendR=useRef({}),trackDelayR=useRef({});
  const bufsR=useRef({}),srcR=useRef({}),t0R=useRef({});
  const recR=useRef({}),chunksR=useRef({});
  const rafR=useRef(null),canvR=useRef({});
  const liveCanvR=useRef({}); // separate canvas for live recording wave
  const liveWaveDataR=useRef({}); // scrolling buffer of recent samples per track
  const dragItem=useRef(null),dragOverIt=useRef(null);
  // Overdub undo/redo — one layer per track
  const overdubUndoBufsR=useRef({}); // pre-overdub buffer (for undo)
  const overdubRedoBufsR=useRef({}); // post-overdub buffer (for redo)

  // Stable refs
  const TR=useRef(tracks),BR=useRef(bindings),AR=useRef(assigning);
  const bpmR=useRef(bpm),qR=useRef(quantize),iFXR=useRef(inputFX),tFXR=useRef(trackFX),mvR=useRef(masterVol);
  const autoSyncR=useRef(autoSync);
  TR.current=tracks;BR.current=bindings;AR.current=assigning;
  // Persist bindings to localStorage for BundleKeyboard
  useEffect(()=>{try{localStorage.setItem('lg-bindings',JSON.stringify(bindings))}catch{}},[bindings]);
  useEffect(()=>{try{localStorage.setItem('lg-bpm',String(bpm))}catch{}},[bpm]);
  useEffect(()=>{try{localStorage.setItem('lg-quantize',String(quantize))}catch{}},[quantize]);
  useEffect(()=>{try{localStorage.setItem('lg-autoSync',String(autoSync))}catch{}},[autoSync]);
  useEffect(()=>{try{localStorage.setItem('lg-globalSync',String(globalSync))}catch{}},[globalSync]);
  bpmR.current=bpm;qR.current=quantize;iFXR.current=inputFX;tFXR.current=trackFX;mvR.current=masterVol;
  autoSyncR.current=autoSync;

  const upd=useCallback((id,u)=>setTracks(p=>p.map(t=>t.id===id?{...t,...(typeof u==='function'?u(t):u)}:t)),[]);

  // ── GRAPH SETUP ──────────────────────────────────────────────────────────
  const setupGraph=async(ctx,stream)=>{
    const master=ctx.createGain();master.gain.value=mvR.current;master.connect(ctx.destination);masterGainR.current=master;
    // Global reverb bus
    const conv=ctx.createConvolver();conv.buffer=createReverbIR(ctx);
    const revWet=ctx.createGain();revWet.gain.value=0.8;conv.connect(revWet);revWet.connect(master);
    reverbConvR.current=conv;
    // Per-track chains
    for(let i=0;i<N;i++){
      const entry=ctx.createGain();entry.gain.value=1;
      const eqL=ctx.createBiquadFilter();eqL.type='lowshelf';eqL.frequency.value=120;eqL.gain.value=0;
      const eqM=ctx.createBiquadFilter();eqM.type='peaking';eqM.frequency.value=1000;eqM.Q.value=1;eqM.gain.value=0;
      const eqH=ctx.createBiquadFilter();eqH.type='highshelf';eqH.frequency.value=8000;eqH.gain.value=0;
      const comp=ctx.createDynamicsCompressor();comp.threshold.value=0;comp.ratio.value=1;comp.attack.value=0.003;comp.release.value=0.25;
      const vol=ctx.createGain();vol.gain.value=tFXR.current[i].volume;
      // Lowpass filter for cutoff macro — defaults wide open (20kHz), inaudible
      const cutoff=ctx.createBiquadFilter();cutoff.type='lowpass';cutoff.frequency.value=20000;cutoff.Q.value=0.7;
      const mute=ctx.createGain();mute.gain.value=1;
      const revSend=ctx.createGain();revSend.gain.value=0;
      const delNode=ctx.createDelay(5);delNode.delayTime.value=0.375;
      const delFb=ctx.createGain();delFb.gain.value=0.3;
      const delSend=ctx.createGain();delSend.gain.value=0;
      const delOut=ctx.createGain();delOut.gain.value=0.7;
      // Chain: entry→EQ→comp→vol→cutoff→mute→master
      entry.connect(eqL);eqL.connect(eqM);eqM.connect(eqH);eqH.connect(comp);comp.connect(vol);
      vol.connect(cutoff);cutoff.connect(mute);mute.connect(master);
      // Sends
      vol.connect(revSend);revSend.connect(conv);
      vol.connect(delSend);delSend.connect(delNode);
      delNode.connect(delFb);delFb.connect(delNode); // feedback loop
      delNode.connect(delOut);delOut.connect(master);
      trackEntryR.current[i]=entry;
      trackEQR.current[i]={low:eqL,mid:eqM,high:eqH};
      trackCompR.current[i]=comp;
      trackVolR.current[i]=vol;
      trackCutoffR.current[i]=cutoff;
      trackMuteR.current[i]=mute;
      trackRevSendR.current[i]=revSend;
      trackDelayR.current[i]={node:delNode,feedback:delFb,send:delSend,output:delOut};
    }
    // Input chain: mic → gain → comp → eq3 → MediaStreamDest (for recording)
    const micSrc=ctx.createMediaStreamSource(stream);
    const inG=ctx.createGain();inG.gain.value=1;
    const inC=ctx.createDynamicsCompressor();inC.threshold.value=0;inC.ratio.value=1;inC.attack.value=0.003;inC.release.value=0.25;
    const inEL=ctx.createBiquadFilter();inEL.type='lowshelf';inEL.frequency.value=120;inEL.gain.value=0;
    const inEM=ctx.createBiquadFilter();inEM.type='peaking';inEM.frequency.value=1000;inEM.Q.value=1;inEM.gain.value=0;
    const inEH=ctx.createBiquadFilter();inEH.type='highshelf';inEH.frequency.value=8000;inEH.gain.value=0;
    const inDest=ctx.createMediaStreamDestination();
    micSrc.connect(inG);inG.connect(inC);inC.connect(inEL);inEL.connect(inEM);inEM.connect(inEH);inEH.connect(inDest);
    // Monitor branch: tap post-EQ and route to master output when enabled
    const mon=ctx.createGain();mon.gain.value=0; // off by default
    inEH.connect(mon);mon.connect(master);
    monitorGainR.current=mon;
    micSrcR.current=micSrc;inputGainR.current=inG;inputCompR.current=inC;
    inputEQR.current={low:inEL,mid:inEM,high:inEH};inputDestR.current=inDest;
    // ── Analyser for threshold recording ──
    const analyser=ctx.createAnalyser();analyser.fftSize=512;
    inG.connect(analyser);analyserR.current=analyser;
  };

  const initAudio=async(deviceId='default')=>{
    try{
      const c=deviceId==='default'?{audio:true,video:false}:{audio:{deviceId:{exact:deviceId}},video:false};
      const stream=await navigator.mediaDevices.getUserMedia(c);
      streamR.current=stream;
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      actxR.current=ctx;
      await setupGraph(ctx,stream);
      setHasAudio(true);
      try{const devs=await navigator.mediaDevices.enumerateDevices();setDevices({inputs:devs.filter(d=>d.kind==='audioinput'),outputs:devs.filter(d=>d.kind==='audiooutput')});}catch(e){}
    }catch(e){setAudioError(e.message||'Mic denied');}
  };

  const changeInput=async(deviceId)=>{
    if(!actxR.current)return;
    try{
      if(streamR.current)streamR.current.getTracks().forEach(t=>t.stop());
      if(micSrcR.current){try{micSrcR.current.disconnect();}catch(e){}}
      const c=deviceId==='default'?{audio:true,video:false}:{audio:{deviceId:{exact:deviceId}},video:false};
      const stream=await navigator.mediaDevices.getUserMedia(c);
      streamR.current=stream;
      const micSrc=actxR.current.createMediaStreamSource(stream);
      micSrc.connect(inputGainR.current);
      micSrcR.current=micSrc;
      setSelectedInput(deviceId);
    }catch(e){console.warn(e);}
  };

  const changeOutput=async(deviceId)=>{
    try{if(actxR.current?.setSinkId)await actxR.current.setSinkId(deviceId);setSelectedOutput(deviceId);}catch(e){console.warn('setSinkId not supported');}
  };

  // ── PARAM SYNC EFFECTS ───────────────────────────────────────────────────
  useEffect(()=>{if(masterGainR.current)masterGainR.current.gain.value=masterVol*masterPlaybackVol;},[masterVol,masterPlaybackVol]);
  useEffect(()=>{if(inputGainR.current)inputGainR.current.gain.value=inputFX.gain*masterInputVol;},[masterInputVol,inputFX.gain]);
  useEffect(()=>{
    if(!monitorGainR.current||!actxR.current)return;
    const target=monitorEnabled?1:0;
    const now=actxR.current.currentTime;
    // short ramp to avoid clicks
    monitorGainR.current.gain.cancelScheduledValues(now);
    monitorGainR.current.gain.setValueAtTime(monitorGainR.current.gain.value,now);
    monitorGainR.current.gain.linearRampToValueAtTime(target,now+0.03);
  },[monitorEnabled,hasAudio]);

  // ── METRONOME ENGINE ──────────────────────────────────────────────────────
  // Only the 'always' mode runs a continuous click here.
  // 'countinOnly' clicks are scheduled inside startRec when count-in fires.
  useEffect(()=>{
    if(metronomeIntervalR.current){clearInterval(metronomeIntervalR.current);metronomeIntervalR.current=null;}
    if(metronomeMode!=='always'||!hasAudio||!actxR.current)return;
    metronomeBeatR.current=0;
    const interval=60000/bpm;
    metronomeIntervalR.current=setInterval(()=>{
      if(!actxR.current)return;
      const isDown=metronomeBeatR.current%4===0;
      playClick(actxR.current,actxR.current.currentTime,isDown);
      metronomeBeatR.current++;
    },interval);
    return()=>{if(metronomeIntervalR.current)clearInterval(metronomeIntervalR.current);};
  },[metronomeMode,bpm,hasAudio]);

  useEffect(()=>{
    if(!inputGainR.current)return;
    // NOTE: inputGain.gain is controlled by the line above (line ~1190)
    // which combines inputFX.gain × masterInputVol. Do NOT write it here or
    // we'll stomp the masterInputVol multiplier.
    if(inputCompR.current){
      inputCompR.current.threshold.value=inputFX.compEnabled?inputFX.compThreshold:0;
      inputCompR.current.ratio.value=inputFX.compEnabled?inputFX.compRatio:1;
      inputCompR.current.attack.value=inputFX.compAttack;
      inputCompR.current.release.value=inputFX.compRelease;
    }
    if(inputEQR.current.low){
      inputEQR.current.low.gain.value=inputFX.eqEnabled?inputFX.eqLow:0;
      inputEQR.current.mid.gain.value=inputFX.eqEnabled?inputFX.eqMid:0;
      inputEQR.current.high.gain.value=inputFX.eqEnabled?inputFX.eqHigh:0;
      inputEQR.current.mid.frequency.value=inputFX.eqMidFreq;
    }
  },[inputFX]);

  useEffect(()=>{
    trackFX.forEach(fx=>{
      if(trackVolR.current[fx.id])trackVolR.current[fx.id].gain.value=fx.volume;
      if(trackEQR.current[fx.id]){
        trackEQR.current[fx.id].low.gain.value=fx.eqEnabled?fx.eqLow:0;
        trackEQR.current[fx.id].mid.gain.value=fx.eqEnabled?fx.eqMid:0;
        trackEQR.current[fx.id].high.gain.value=fx.eqEnabled?fx.eqHigh:0;
      }
      if(trackCompR.current[fx.id]){
        trackCompR.current[fx.id].threshold.value=fx.compEnabled?fx.compThreshold:0;
        trackCompR.current[fx.id].ratio.value=fx.compEnabled?fx.compRatio:1;
      }
      if(trackRevSendR.current[fx.id])trackRevSendR.current[fx.id].gain.value=fx.reverbSend;
      if(trackDelayR.current[fx.id]){
        trackDelayR.current[fx.id].send.gain.value=fx.delaySend;
        trackDelayR.current[fx.id].node.delayTime.value=Math.max(0.001,fx.delayTime);
        trackDelayR.current[fx.id].feedback.gain.value=fx.delayFeedback;
      }
    });
  },[trackFX]);

  // ── PLAYBACK / RECORDING ─────────────────────────────────────────────────
  const stopPlay=useCallback((id)=>{const s=srcR.current[id];if(s){try{s.stop();}catch(e){}srcR.current[id]=null;}},[]);

  const startPlay=useCallback((id, atTime=null)=>{
    const ctx=actxR.current;
    const t=TR.current.find(t=>t.id===id);
    const isPingPong=t?.playMode==='pingpong';
    const phase=pingPongPhaseR.current[id]??1;
    // Determine correct buffer (reversed for reverse/pingpong-reverse phase)
    const shouldReverse=t?.isReversed||(isPingPong&&phase===-1);
    const rawBuf=bufsR.current[id];
    if(!ctx||!rawBuf)return;
    // Apply speed shift if needed (use cached if same rate)
    const rate=t?.playSpeed??1.0;
    const getPlayBuf=async()=>{
      let base=shouldReverse?(reverseBufsR.current[id]||reverseBuffer(rawBuf)):rawBuf;
      if(Math.abs(rate-1.0)<0.01)return base;
      const cached=speedBufsR.current[id];
      if(cached&&Math.abs(cached.rate-rate)<0.01&&cached.rev===shouldReverse)return cached.buf;
      const resampled=await resampleBuffer(base,rate);
      speedBufsR.current[id]={rate,rev:shouldReverse,buf:resampled};
      return resampled;
    };
    if(ctx.state==='suspended')ctx.resume();
    stopPlay(id);
    // Use immediate buffer for normal speed, async for speed-shifted
    const doPlay=(buf)=>{
      const src=ctx.createBufferSource();src.buffer=buf;
      const isOneShot=t?.playMode==='oneshot';
      src.loop=!isOneShot&&!isPingPong;
      if(src.loop)src.loopEnd=buf.duration;
      src.connect(trackEntryR.current[id]);
      const startAt=atTime??ctx.currentTime;
      src.start(startAt);
      srcR.current[id]=src;
      t0R.current[id]=startAt;
      if(!masterClockR.current)masterClockR.current=startAt;
      if(trackMuteR.current[id])trackMuteR.current[id].gain.value=t?.isMuted?0:1;
      upd(id,{state:'playing'});
      // One-shot: return to recorded
      if(isOneShot){
        src.onended=()=>{if(srcR.current[id]===src){srcR.current[id]=null;upd(id,{state:'recorded'});}}
      }
      // Ping-pong: flip direction and restart at loop end
      if(isPingPong){
        const dur=buf.duration*1000;
        punchInTimerR.current[`pp_${id}`]=setTimeout(()=>{
          if(TR.current.find(t=>t.id===id)?.state==='playing'){
            pingPongPhaseR.current[id]=(pingPongPhaseR.current[id]??1)*-1;
            startPlay(id);
          }
        },dur-20);
      }
    };
    if(Math.abs(rate-1.0)<0.01){
      const buf=shouldReverse?(reverseBufsR.current[id]||reverseBuffer(rawBuf)):rawBuf;
      if(shouldReverse&&!reverseBufsR.current[id])reverseBufsR.current[id]=reverseBuffer(rawBuf);
      doPlay(shouldReverse?reverseBufsR.current[id]:rawBuf);
    } else {
      getPlayBuf().then(doPlay);
    }
  },[stopPlay,upd]);

  const stopRec=useCallback((id)=>{
    const ctx=actxR.current;
    // Ensure context is running when stopping record
    if(ctx&&(ctx.state==='suspended'||ctx.state==='interrupted')){try{ctx.resume();}catch(e){}}
    const r=recR.current[id];
    if(r&&r.state!=='inactive'){
      // Stop the recorder immediately. The fade-out is applied to the RECORDED
      // BUFFER DATA in recorder.onstop (see ~line 1396), not to the live input
      // gain — touching the live input would affect OTHER tracks currently recording.
      r.stop();
    }
    // Cancel any auto-rec timer
    if(autoRecTimerR.current[id]){clearTimeout(autoRecTimerR.current[id]);delete autoRecTimerR.current[id];}
    // Cancel threshold polling
    if(thresholdTimerR.current[id]){clearInterval(thresholdTimerR.current[id]);delete thresholdTimerR.current[id];}
  },[]);

  // Helper: play a metronome click at ctx time using Web Audio
  const playClick=(ctx,time,isDownbeat)=>{
    const osc=ctx.createOscillator();const g=ctx.createGain();
    osc.frequency.value=isDownbeat?1200:900;
    g.gain.setValueAtTime(0.4,time);g.gain.exponentialRampToValueAtTime(0.001,time+0.05);
    osc.connect(g);g.connect(ctx.destination);
    osc.start(time);osc.stop(time+0.06);
  };

  const doStartRec=useCallback(async(id,isOvr=false,isPunchIn=false)=>{
    if(!inputDestR.current||!actxR.current)return;
    const ctx=actxR.current;
    // Ensure AudioContext is running BEFORE starting recorder — prevents click/delay
    if(ctx.state==='suspended'||ctx.state==='interrupted'){
      try{await ctx.resume();}catch(e){}
    }
    // Small microtask yield to let audio engine settle after resume
    await new Promise(r=>setTimeout(r,0));
    if(!isOvr&&!isPunchIn)stopPlay(id);

    // ── Capture where we are in the master loop right now ──
    // Used after recording stops to pad buffer into the correct position
    if(!isOvr&&!isPunchIn&&masterClockR.current&&masterLoopDurR.current){
      const elapsed=(ctx.currentTime-masterClockR.current)%masterLoopDurR.current;
      recStartOffsetR.current[id]=elapsed;
    } else {
      recStartOffsetR.current[id]=0;
    }

    chunksR.current[id]=[];
    const recorder=new MediaRecorder(inputDestR.current.stream);
    recorder.ondataavailable=e=>{if(e.data.size>0)chunksR.current[id].push(e.data);};
    recorder.onstop=async()=>{
      try{
        const blob=new Blob(chunksR.current[id],{type:'audio/webm'});
        const ab=await blob.arrayBuffer();
        let nb=await actxR.current.decodeAudioData(ab);
        if(qR.current&&!isPunchIn)nb=await quantizeBuf(actxR.current,nb,bpmR.current);
        let final=nb;
        const t=TR.current.find(t=>t.id===id);

        // Apply record fade-in/out to new recording
        if(t?.recFade>0&&nb.length>0){
          const fadeSamples=Math.min(Math.round(t.recFade*nb.sampleRate),Math.floor(nb.length/4));
          for(let c=0;c<nb.numberOfChannels;c++){
            const d=nb.getChannelData(c);
            for(let i=0;i<fadeSamples;i++){const g=i/fadeSamples;d[i]*=g;d[nb.length-1-i]*=g;}
          }
        }

        if(isPunchIn&&bufsR.current[id]&&t){
          // Punch-in: splice new recording into the defined region
          const base=bufsR.current[id];
          const startSample=Math.round(t.punchInStart*base.length);
          const endSample=Math.round(t.punchInEnd*base.length);
          const patchLen=endSample-startSample;
          const out=new AudioBuffer({numberOfChannels:1,length:base.length,sampleRate:base.sampleRate});
          const outD=out.getChannelData(0);
          const baseD=base.getChannelData(0);
          outD.set(baseD);
          const patchD=nb.getChannelData(0);
          for(let i=0;i<patchLen&&i<patchD.length;i++)outD[startSample+i]=patchD[i];
          final=out;
        } else if(isOvr&&bufsR.current[id]){
          // Save pre-overdub buffer for undo BEFORE mixing
          overdubUndoBufsR.current[id]=bufsR.current[id];
          overdubRedoBufsR.current[id]=null;
          const decay=t?.overdubDecay??1.0;
          final=await mixOverWithDecay(actxR.current,bufsR.current[id],nb,decay);
        } else {
          // ── PAD TO MASTER LOOP LENGTH ──────────────────────────────────
          // If a master loop duration exists and this is a fresh recording,
          // embed the recorded audio at the correct offset within a full-length buffer.
          // This keeps every track the same length and in perfect positional sync.
          const masterDur=masterLoopDurR.current;
          const offset=recStartOffsetR.current[id]??0;
          if(masterDur&&masterDur>0.1&&!isOvr&&!isPunchIn){
            const sr=nb.sampleRate;
            const ch=nb.numberOfChannels;
            // Target length = nearest whole multiple of master duration >= recorded duration+offset
            const minDur=offset+nb.duration;
            const mult=Math.max(1,Math.ceil(minDur/masterDur));
            const totalSamples=Math.round(masterDur*mult*sr);
            const padded=actxR.current.createBuffer(ch,totalSamples,sr);
            const offsetSamples=Math.round(offset*sr);
            for(let c=0;c<ch;c++){
              const src=nb.getChannelData(c);
              const dst=padded.getChannelData(c); // initialised to zeros = silence
              const writeLen=Math.min(src.length,totalSamples-offsetSamples);
              if(writeLen>0)dst.set(src.subarray(0,writeLen),offsetSamples);
            }
            final=padded;
            delete recStartOffsetR.current[id];
          }
        }
        bufsR.current[id]=final;
        reverseBufsR.current[id]=reverseBuffer(final);
        speedBufsR.current[id]=null; // invalidate speed cache

        // ── AUTO-SYNC: tempo detection + loop snapping ───────────────────
        if(autoSyncR.current&&!isOvr&&!isPunchIn){
          const isFirstLoop=!masterLoopDurR.current&&
            TR.current.every(t=>t.id===id||t.state==='empty'||!bufsR.current[t.id]);
          // Skip snapping if we already padded this buffer to master loop length
          const alreadyPadded=masterLoopDurR.current&&
            Math.abs(final.duration-masterLoopDurR.current*Math.round(final.duration/masterLoopDurR.current))<0.05;

          if(isFirstLoop){
            // First loop: measure exact duration, infer BPM, clean up buffer
            const inferred=inferBPMFromLoop(final.duration);
            if(inferred&&inferred.error<0.08){
              // Trim buffer to exact sample-accurate clean duration
              const cleanSamples=Math.round(inferred.cleanDuration*final.sampleRate);
              if(Math.abs(cleanSamples-final.length)>30){
                const cleaned=actxR.current.createBuffer(
                  final.numberOfChannels,cleanSamples,final.sampleRate);
                for(let c=0;c<final.numberOfChannels;c++)
                  cleaned.getChannelData(c).set(
                    final.getChannelData(c).subarray(0,Math.min(final.length,cleanSamples)));
                final=cleaned;
                bufsR.current[id]=final;
                reverseBufsR.current[id]=reverseBuffer(final);
                speedBufsR.current[id]=null;
              }
              masterLoopDurR.current=final.duration;setMasterLoopDur(final.duration);
              // Update BPM display to 0.1 precision
              setBpm(inferred.bpm);
              setSyncFeedback({
                type:'tempo',
                bpm:inferred.bpm,
                bars:inferred.bars,
                dur:final.duration.toFixed(3),
              });
              setTimeout(()=>setSyncFeedback(null),3500);
            } else {
              // Can't cleanly infer BPM — use raw duration as master grid
              masterLoopDurR.current=final.duration;setMasterLoopDur(final.duration);
              const rawBpm=Math.round(((final.duration>0?4*60/final.duration:bpmR.current))*10)/10;
              setSyncFeedback({type:'raw',dur:final.duration.toFixed(3)});
              setTimeout(()=>setSyncFeedback(null),2500);
            }
          } else if(masterLoopDurR.current&&!alreadyPadded){
            // Subsequent loop: snap to nearest multiple/division of master
            const result=await snapToMasterLoop(actxR.current,final,masterLoopDurR.current);
            if(result.snapped){
              bufsR.current[id]=result.buf;
              reverseBufsR.current[id]=reverseBuffer(result.buf);
              speedBufsR.current[id]=null;
              final=result.buf;
              const ratioLabel=result.ratio===0.25?'¼×':result.ratio===1/3?'⅓×':
                result.ratio===0.5?'½×':result.ratio===2/3?'⅔×':
                result.ratio===1?'1×':result.ratio===2?'2×':
                result.ratio===4?'4×':`${result.ratio}×`;
              setSyncFeedback({
                type:'snap',
                ratio:ratioLabel,
                dur:final.duration.toFixed(3),
                master:masterLoopDurR.current.toFixed(3),
              });
              setTimeout(()=>setSyncFeedback(null),2500);
            }
          }
        }
        // ─────────────────────────────────────────────────────────────────
        const dur=Math.round(final.duration*10)/10;
        setTimeout(()=>{const c=canvR.current[id],t=TR.current.find(t=>t.id===id);if(c&&t)paintWave(c,final,t.color);},60);
        // Always auto-play after any recording (initial or overdub)
        upd(id,{duration:dur,overdub:false});
        // Sync enforcement: subsequent loops grid-align to master.
        // - For the first loop (no master clock yet), scheduleStart returns immediately.
        // - For overdubs/punch-ins, we want seamless continuation (no grid wait).
        if(isOvr||isPunchIn){
          startPlay(id);
        } else {
          scheduleStart(id);
        }
        // If this was initial recording and stopRecMode='overdub', chain into overdub immediately
        if(!isOvr&&!isPunchIn){
          const t2=TR.current.find(tk=>tk.id===id);
          if(t2?.stopRecMode==='overdub'){
            setTimeout(()=>startRec(id,true),60);
          }
        }
      }catch(e){upd(id,{state:bufsR.current[id]?'recorded':'empty',overdub:false});}
    };

    // NOTE: Record fade-in/out is applied to the RECORDED BUFFER DATA in
    // recorder.onstop (see ~line 1396). Do NOT touch trackEntry gain (wrong
    // chain — that's the playback side) or inputGain (shared across all
    // recording tracks — would break multi-track recording).

    recorder.start();recR.current[id]=recorder;
    upd(id,{state:'recording',overdub:isOvr});
    // ── AUTO-REC: stop after N bars ──
    const t=TR.current.find(t=>t.id===id);
    if(t?.autoRecBars>0){
      const barMs=(4*60/bpmR.current)*1000;
      autoRecTimerR.current[id]=setTimeout(()=>{
        delete autoRecTimerR.current[id];
        stopRec(id); // Fade-out is applied to the recorded buffer in onstop
      },t.autoRecBars*barMs);
    }
  },[stopPlay,startPlay,upd]);

  const startRec=useCallback(async(id,isOvr=false)=>{
    const t=TR.current.find(t=>t.id===id);
    if(!t||!actxR.current)return;

    // ── SYNC-ARMED RECORDING ──
    // If Grid Sync is on, another loop is already playing, and this is a fresh record
    // (not overdub), arm it: wait for the next master clock boundary, then start recording.
    if(t.syncStart&&!isOvr&&masterClockR.current){
      const ctx=actxR.current;
      // Find duration of first playing loop to use as the boundary reference
      const playingTrack=TR.current.find(tt=>tt.state==='playing'&&bufsR.current[tt.id]);
      if(playingTrack){
        const refDur=bufsR.current[playingTrack.id].duration;
        const elapsed=(ctx.currentTime-masterClockR.current)%refDur;
        const ttl=elapsed<0.04?0:refDur-elapsed;
        if(ttl>0.04){
          // Show armed state — uses pendingType so the card can show "ARMED" badge
          upd(id,{state:'recording',overdub:false});
          pendingTypeR.current[id]='armed';
          setPending(p=>({...p,[id]:'armed'}));
          autoRecTimerR.current[`sync_${id}`]=setTimeout(()=>{
            delete autoRecTimerR.current[`sync_${id}`];
            delete pendingTypeR.current[id];
            setPending(p=>{const n={...p};delete n[id];return n;});
            const t2=TR.current.find(tt=>tt.id===id);
            if(t2&&t2.state==='recording')doStartRec(id,false);
          },ttl*1000);
          return;
        }
      }
    }

    // ── THRESHOLD RECORDING ──
    if(t.thresholdRec&&!isOvr){
      upd(id,{state:'recording',overdub:false}); // show visual feedback
      // Poll analyser until level exceeds threshold
      const dataArr=new Float32Array(analyserR.current?.fftSize||512);
      thresholdTimerR.current[id]=setInterval(()=>{
        if(!analyserR.current)return;
        analyserR.current.getFloatTimeDomainData(dataArr);
        const rms=Math.sqrt(dataArr.reduce((s,v)=>s+v*v,0)/dataArr.length);
        if(rms>=t.thresholdLevel){
          clearInterval(thresholdTimerR.current[id]);
          delete thresholdTimerR.current[id];
          doStartRec(id,isOvr); // fire-and-forget inside interval is fine
        }
      },30);
      return;
    }

    // ── COUNT-IN ──
    if(t.countIn>0&&!isOvr){
      const ctx=actxR.current;
      const barDur=4*60/bpmR.current;
      const beatDur=60/bpmR.current;
      const totalBars=t.countIn;
      const now=ctx.currentTime+0.05;
      // Schedule click sounds
      for(let bar=0;bar<totalBars;bar++){
        for(let beat=0;beat<4;beat++){
          playClick(ctx,now+bar*barDur+beat*beatDur,beat===0);
        }
      }
      upd(id,{state:'recording',overdub:false}); // show UI feedback during count-in
      // Start actual recording after count-in completes
      autoRecTimerR.current[`ci_${id}`]=setTimeout(()=>{
        delete autoRecTimerR.current[`ci_${id}`];
        doStartRec(id,isOvr); // fire-and-forget inside timeout is fine
      },(totalBars*barDur*1000)+40);
      return;
    }

    await doStartRec(id,isOvr);
  },[doStartRec,upd]);

  // ── SYNC HELPERS ─────────────────────────────────────────────────────────
  const cancelPending=useCallback((id)=>{
    const pType=pendingTypeR.current[id]; // 'stop'|'clear'|'start'|'armed'
    clearTimeout(pendingTimers.current[id]);
    delete pendingTimers.current[id];
    delete pendingTypeR.current[id];
    setPending(p=>{const n={...p};delete n[id];return n;});
    // Armed recording: kill the sync-wait timer, revert track state
    if(pType==='armed'){
      if(autoRecTimerR.current[`sync_${id}`]){
        clearTimeout(autoRecTimerR.current[`sync_${id}`]);
        delete autoRecTimerR.current[`sync_${id}`];
      }
      upd(id,{state:bufsR.current[id]?'recorded':'empty',overdub:false});
      return;
    }
    const src=srcR.current[id];
    if(pType==='start'){
      // pre-scheduled src.start() is already fired on the audio thread — stop it
      if(src){try{src.stop();}catch(e){}srcR.current[id]=null;}
      // track stays in 'recorded' — no state update needed
    } else {
      // stop/clear was pending: src.stop(futureTime) already called — cancel by replacing source
      if(src){try{src.stop();}catch(e){}srcR.current[id]=null;}
      if(bufsR.current[id]&&TR.current.find(t=>t.id===id)?.state==='playing'){
        startPlay(id); // restart cleanly so loop continues
      }
    }
  },[startPlay]);

  // Time until this track's loop reaches its end
  const timeToLoopEnd=(id)=>{
    const ctx=actxR.current,t=TR.current.find(t=>t.id===id);
    if(!ctx||!t||!t.duration)return 0;
    const elapsed=(ctx.currentTime-t0R.current[id])%t.duration;
    return t.duration-elapsed;
  };

  // Time until next aligned loop boundary (relative to master clock).
  // CRITICAL: uses masterLoopDurR if available, NOT the local buffer duration —
  // otherwise tracks with different loop lengths would each align to their own
  // grid, breaking sync across the session.
  const timeToNextStart=(id)=>{
    const ctx=actxR.current,buf=bufsR.current[id];
    if(!ctx||!buf)return 0;
    const mc=masterClockR.current??ctx.currentTime;
    // Prefer the master loop duration; fall back to this track's buffer if
    // no master has been established yet (first loop in the session).
    const dur=masterLoopDurR.current||buf.duration;
    const elapsed=(ctx.currentTime-mc)%dur;
    const toNext=elapsed<0.04?0:dur-elapsed;
    return toNext;
  };

  // Schedule a stop or clear at end of current loop cycle
  const scheduleStop=(id,type,execFn)=>{
    if(pendingTimers.current[id]){cancelPending(id);return;}
    const t=TR.current.find(t=>t.id===id);
    const mode=t?.syncStopMode??'loop-end';
    if(!t?.syncStop||mode==='immediate'){execFn();return;}

    let ttl=0;
    if(mode==='loop-end'){
      ttl=timeToLoopEnd(id);
    } else if(mode==='bar-end'){
      const ctx=actxR.current;
      const barDur=4*60/bpmR.current;
      const elapsed=(ctx.currentTime-t0R.current[id])%t.duration;
      const barElapsed=elapsed%barDur;
      ttl=barDur-barElapsed;
    } else if(mode==='phrase-end'){
      const ctx=actxR.current;
      const barDur=4*60/bpmR.current;
      const phraseDur=barDur*(t?.syncStopPhraseBars??4);
      const elapsed=(ctx.currentTime-t0R.current[id])%t.duration;
      const phraseElapsed=elapsed%phraseDur;
      ttl=phraseDur-phraseElapsed;
    } else if(mode==='fade'){
      // Fade out then stop
      const fadeDur=t?.syncStopFadeDur??1.0;
      if(trackMuteR.current[id]&&actxR.current){
        const mg=trackMuteR.current[id];
        const now=actxR.current.currentTime;
        mg.gain.setValueAtTime(mg.gain.value,now);
        mg.gain.linearRampToValueAtTime(0,now+fadeDur);
      }
      ttl=fadeDur;
    }

    if(ttl<0.05){execFn();return;}
    const src=srcR.current[id];
    if(src&&actxR.current&&mode!=='fade'){try{src.stop(actxR.current.currentTime+ttl);}catch(e){}}
    pendingTypeR.current[id]=type;
    setPending(p=>({...p,[id]:type}));
    pendingTimers.current[id]=setTimeout(()=>{
      delete pendingTimers.current[id];delete pendingTypeR.current[id];
      setPending(p=>{const n={...p};delete n[id];return n;});
      // For 'fade' mode: stop the source now that the fade has completed,
      // AND restore the mute gain so the next play isn't silent.
      // For other modes: src.stop() was already scheduled inline above.
      if(mode==='fade'){
        try{srcR.current[id]?.stop();}catch(e){}
        // Restore mute gain to match the track's isMuted state (default = unmuted = 1)
        if(trackMuteR.current[id]&&actxR.current){
          const tNow=TR.current.find(t=>t.id===id);
          const restoreVal=tNow?.isMuted?0:1;
          const now=actxR.current.currentTime;
          trackMuteR.current[id].gain.cancelScheduledValues(now);
          trackMuteR.current[id].gain.setValueAtTime(restoreVal,now);
        }
      }
      srcR.current[id]=null;
      execFn();
    },ttl*1000);
  };

  // Schedule a start at next master-clock-aligned loop boundary.
  // Delegates to startPlay(id, atTime) so reverse, speed, playMode, and
  // ping-pong are all honored — previously this created a raw buffer source
  // that ignored all of those.
  const scheduleStart=(id)=>{
    if(pendingTimers.current[id]){cancelPending(id);return;}
    const ctx=actxR.current,buf=bufsR.current[id];
    if(!ctx||!buf)return;
    const t=TR.current.find(t=>t.id===id);
    if(!t?.syncStart){startPlay(id);return;}
    const ttl=timeToNextStart(id);
    if(ttl<0.04){startPlay(id);return;}
    const startAt=ctx.currentTime+ttl;
    // startPlay handles reverse/speed/playMode correctly when given a future atTime
    startPlay(id,startAt);
    // Track pending UI state so the progress-bar "arming" effect shows
    pendingTypeR.current[id]='start';
    setPending(p=>({...p,[id]:'start'}));
    pendingTimers.current[id]=setTimeout(()=>{
      delete pendingTimers.current[id];delete pendingTypeR.current[id];
      setPending(p=>{const n={...p};delete n[id];return n;});
      // startPlay already set state to 'playing'; no-op here
    },ttl*1000);
  };

  // ── ACTIONS ───────────────────────────────────────────────────────────────
  const A=useRef({});
  A.current={
    // Smart record: context-aware single-press track control
    smartRecord:(id)=>{
      const t=TR.current.find(t=>t.id===id);if(!t||!actxR.current)return;
      if(t.state==='empty'){
        // Start fresh recording
        startRec(id,false);
      } else if(t.state==='recording'&&!t.overdub){
        // Stop initial recording → onstop auto-plays the loop
        stopRec(id);
      } else if(t.state==='recording'&&t.overdub){
        // Finish overdub → onstop keeps playing with overdub mixed in
        stopRec(id);
      } else if(t.state==='playing'){
        // Start overdub on top of playing loop
        startRec(id,true);
      } else if(t.state==='recorded'){
        // Play the stopped loop
        if(pendingTimers.current[id]){cancelPending(id);return;}
        scheduleStart(id);
      }
    },
    none:()=>{},
    // Undo last overdub while playing, or redo it. Erase if loop is stopped.
    overdubUndoOrErase:(id)=>{
      const t=TR.current.find(t=>t.id===id);if(!t)return;
      if(t.state==='playing'||(t.state==='recording'&&t.overdub)){
        // While playing/overdubbing: undo or redo overdub
        if(overdubRedoBufsR.current[id]){
          // Redo available — restore the overdubbed buffer
          bufsR.current[id]=overdubRedoBufsR.current[id];
          overdubRedoBufsR.current[id]=null;
        } else if(overdubUndoBufsR.current[id]){
          // Undo — save current buffer to redo slot, restore pre-overdub
          overdubRedoBufsR.current[id]=bufsR.current[id];
          bufsR.current[id]=overdubUndoBufsR.current[id];
        } else {
          return; // nothing to undo
        }
        reverseBufsR.current[id]=reverseBuffer(bufsR.current[id]);
        speedBufsR.current[id]=null;
        // If currently overdubbing, stop that recording first
        if(t.state==='recording'&&t.overdub)stopRec(id);
        // Restart playback with updated buffer
        stopPlay(id);
        setTimeout(()=>{
          startPlay(id);
          const c=canvR.current[id];
          const tk=TR.current.find(t=>t.id===id);
          if(c&&tk)paintWave(c,bufsR.current[id],tk.color);
          upd(id,{duration:Math.round(bufsR.current[id].duration*10)/10,overdub:false});
        },20);
      } else if(t.state==='recorded'){
        // Loop is stopped — erase permanently
        A.current.clear(id);
      }
    },
    record:(id)=>{const t=TR.current.find(t=>t.id===id);if(!t||!hasAudio)return;t.state==='recording'?stopRec(id):startRec(id,false);},
    playStop:(id)=>{
      const t=TR.current.find(t=>t.id===id);
      if(!t||t.state==='empty')return;
      if(t.state==='recording'){
        // Stop the recording — onstop auto-plays the loop
        stopRec(id);
      } else if(t.state==='playing'){
        scheduleStop(id,'stop',()=>upd(id,{state:'recorded'}));
      } else if(t.state==='recorded'){
        if(pendingTimers.current[id]){cancelPending(id);return;}
        scheduleStart(id);
      }
    },
    mute:(id)=>{
      const t=TR.current.find(t=>t.id===id);
      const group=t?.muteGroup;
      const nowMuted=t?.isMuted;
      const fadeDur=t?.muteFadeDur??0;
      const doMute=(targetId,mute)=>{
        upd(targetId,tk=>{
          if(fadeDur>0&&trackMuteR.current[targetId]&&actxR.current){
            const g=trackMuteR.current[targetId];
            const now=actxR.current.currentTime;
            g.gain.cancelScheduledValues(now);
            g.gain.setValueAtTime(g.gain.value,now);
            g.gain.linearRampToValueAtTime(mute?0:1,now+fadeDur);
          } else {
            if(trackMuteR.current[targetId])trackMuteR.current[targetId].gain.value=mute?0:1;
          }
          return{isMuted:mute};
        });
      };
      doMute(id,!nowMuted);
      if(group&&nowMuted){
        TR.current.forEach(other=>{
          if(other.id!==id&&other.muteGroup===group&&!other.isMuted)doMute(other.id,true);
        });
      }
    },
    // Solo: mute all others, unmute this one
    solo:(id)=>{
      const t=TR.current.find(t=>t.id===id);
      const isSolo=TR.current.every(other=>other.id===id||other.isMuted);
      TR.current.forEach(other=>{
        const shouldMute=isSolo?false:other.id!==id; // toggle: if already soloed, unsolo all
        const fadeDur=other.muteFadeDur??0;
        upd(other.id,()=>{
          if(fadeDur>0&&trackMuteR.current[other.id]&&actxR.current){
            const g=trackMuteR.current[other.id];
            const now=actxR.current.currentTime;
            g.gain.cancelScheduledValues(now);
            g.gain.setValueAtTime(g.gain.value,now);
            g.gain.linearRampToValueAtTime(shouldMute?0:1,now+fadeDur);
          } else {
            if(trackMuteR.current[other.id])trackMuteR.current[other.id].gain.value=shouldMute?0:1;
          }
          return{isMuted:shouldMute};
        });
      });
    },
    // Restart: jump back to loop start without stopping
    restart:(id)=>{
      const t=TR.current.find(t=>t.id===id);
      if(!t||!bufsR.current[id])return;
      pingPongPhaseR.current[id]=1; // reset ping-pong direction
      stopPlay(id);startPlay(id);
    },
    // Toggle reverse playback
    reverse:(id)=>{
      const t=TR.current.find(t=>t.id===id);
      if(!t||!bufsR.current[id])return;
      if(!reverseBufsR.current[id])reverseBufsR.current[id]=reverseBuffer(bufsR.current[id]);
      const wasPlaying=t.state==='playing';
      const newReversed=!t.isReversed;
      upd(id,{isReversed:newReversed});
      // Update TR.current immediately so startPlay reads the correct value without waiting for re-render
      TR.current=TR.current.map(t=>t.id===id?{...t,isReversed:newReversed}:t);
      if(wasPlaying){stopPlay(id);startPlay(id);}
    },
    // Punch-in: record into the defined region only
    punchIn:(id)=>{
      const t=TR.current.find(t=>t.id===id);
      if(!t||!bufsR.current[id]||!hasAudio)return;
      // If already recording a punch-in, stop it
      if(t.state==='recording'){stopRec(id);return;}
      // If punch-in is armed, disarm it
      if(t.punchInEnabled){upd(id,{punchInEnabled:false});return;}
      // Arm punch-in — start playing immediately so user can hear the loop
      upd(id,{punchInEnabled:true});
      if(t.state!=='playing')startPlay(id);
      // Wait a moment then start recording the punch-in region
      const regionDur=t.duration*(t.punchInEnd-t.punchInStart);
      // Wait until the playhead reaches punchInStart
      const startDelay=t.duration*t.punchInStart;
      const elapsed=t.duration>0?((actxR.current.currentTime-t0R.current[id])%t.duration):0;
      const waitMs=Math.max(50,((startDelay-elapsed+t.duration)%t.duration)*1000);
      autoRecTimerR.current[`pi_${id}`]=setTimeout(()=>{
        delete autoRecTimerR.current[`pi_${id}`];
        doStartRec(id,false,true);
        // Auto-stop after region duration
        autoRecTimerR.current[`pi_stop_${id}`]=setTimeout(()=>{
          delete autoRecTimerR.current[`pi_stop_${id}`];
          stopRec(id);
          upd(id,{punchInEnabled:false});
        },(regionDur*1000)+50);
      },waitMs);
    },
    // Overdub — now works on stopped loops too
    overdub:(id)=>{
      const t=TR.current.find(t=>t.id===id);
      if(!t||!bufsR.current[id]||!hasAudio)return;
      if(t.state==='recording'&&t.overdub){stopRec(id);return;}
      if(t.state==='playing'){
        startRec(id,true);
      } else if(t.state==='recorded'){
        // Overdub while stopped — record silently, mix on top
        startRec(id,true);
        // Don't auto-start playback during overdub-while-stopped
      } else if(t.state==='empty'){
        // Nothing to overdub on top of
        startRec(id,false);
      }
    },
    clear:(id)=>{
      const t=TR.current.find(t=>t.id===id);
      const doClear=()=>{
        srcR.current[id]=null;stopRec(id);bufsR.current[id]=null;
        reverseBufsR.current[id]=null;
        speedBufsR.current[id]=null;
        overdubUndoBufsR.current[id]=null;
        overdubRedoBufsR.current[id]=null;
        liveWaveDataR.current[id]=null;
        const c=canvR.current[id];if(c){const cx=c.getContext('2d');cx.clearRect(0,0,c.width,c.height);}
        const lc=liveCanvR.current[id];if(lc){const lx=lc.getContext('2d');lx.clearRect(0,0,lc.width,lc.height);}
        upd(id,{state:'empty',duration:0,isMuted:false,overdub:false,isReversed:false});
        // If no loops remain, reset the master grid
        const anyLeft=TR.current.some(t=>t.id!==id&&bufsR.current[t.id]);
        if(!anyLeft){masterLoopDurR.current=null;masterClockR.current=null;setMasterLoopDur(null);}
      };
      if(t?.state==='playing'){
        scheduleStop(id,'clear',doClear);
      } else {
        if(pendingTimers.current[id])cancelPending(id);
        stopPlay(id);doClear();
      }
    },
    playAll:()=>{TR.current.forEach(t=>{if(bufsR.current[t.id]&&t.state==='recorded')scheduleStart(t.id);});},
    stopAll:()=>{TR.current.forEach(t=>{if(t.state==='playing')scheduleStop(t.id,'stop',()=>upd(t.id,{state:'recorded'}));if(t.state==='recording')stopRec(t.id);});},
    clearAll:()=>{
      TR.current.forEach(t=>A.current.clear(t.id));
      masterLoopDurR.current=null;setMasterLoopDur(null);
      masterClockR.current=null;
    },
    // ── FX TOGGLES (press on = press off) ────────────────────────────────
    toggleEQ:(id)=>setTrackFX(p=>p.map(f=>f.id===id?{...f,eqEnabled:!f.eqEnabled}:f)),
    toggleComp:(id)=>setTrackFX(p=>p.map(f=>f.id===id?{...f,compEnabled:!f.compEnabled}:f)),
    toggleReverb:(id)=>setTrackFX(p=>p.map(f=>{
      if(f.id!==id)return f;
      if(f.reverbSend>0){return{...f,_lastReverb:f.reverbSend,reverbSend:0};}
      return{...f,reverbSend:f._lastReverb||0.5};
    })),
    toggleDelay:(id)=>setTrackFX(p=>p.map(f=>{
      if(f.id!==id)return f;
      if(f.delaySend>0){return{...f,_lastDelay:f.delaySend,delaySend:0};}
      return{...f,delaySend:f._lastDelay||0.5};
    })),
    toggleMute:(id)=>A.current.mute(id),
    // ── VOLUME RAMP (HOLD) ────────────────────────────────────────────────
    // Fires on key HOLD; ramps track volume toward a target based on direction+speed+range.
    // Stops when key released (caller handles via setTimeout; we simply set up a ramp
    // and let the next action override it).
    volumeUp:(id,params={})=>{
      const ctx=actxR.current,vn=trackVolR.current[id];
      if(!ctx||!vn)return;
      const speedMap={slow:4.0,medium:2.0,fast:0.8};
      const dur=speedMap[params.speed||'medium'];
      const target=params.volMax??1.2;
      const now=ctx.currentTime;
      vn.gain.cancelScheduledValues(now);
      vn.gain.setValueAtTime(vn.gain.value,now);
      vn.gain.linearRampToValueAtTime(target,now+dur);
      // Reflect in state when ramp completes
      setTimeout(()=>setTrackFX(p=>p.map(f=>f.id===id?{...f,volume:target}:f)),dur*1000);
    },
    volumeDown:(id,params={})=>{
      const ctx=actxR.current,vn=trackVolR.current[id];
      if(!ctx||!vn)return;
      const speedMap={slow:4.0,medium:2.0,fast:0.8};
      const dur=speedMap[params.speed||'medium'];
      const target=params.volMin??0;
      const now=ctx.currentTime;
      vn.gain.cancelScheduledValues(now);
      vn.gain.setValueAtTime(vn.gain.value,now);
      vn.gain.linearRampToValueAtTime(target,now+dur);
      setTimeout(()=>setTrackFX(p=>p.map(f=>f.id===id?{...f,volume:target}:f)),dur*1000);
    },
    // ── NEW LOOPY PRO ACTIONS ─────────────────────────────────────────────
    // Cycle play mode: loop → oneshot → pingpong → loop
    togglePlayMode:(id)=>{
      upd(id,t=>({playMode:t.playMode==='loop'?'oneshot':t.playMode==='oneshot'?'pingpong':'loop'}));
    },
    // Toggle reverse
    toggleReverse:(id)=>A.current.reverse(id),
    // Cycle stop mode: immediate → loop-end → bar-end → phrase-end → fade → immediate
    cycleStopMode:(id)=>{
      const modes=['immediate','loop-end','bar-end','phrase-end','fade'];
      upd(id,t=>{
        const cur=t.syncStopMode||'loop-end';
        const next=modes[(modes.indexOf(cur)+1)%modes.length];
        return{syncStopMode:next,syncStop:next!=='immediate'};
      });
    },
    // Toggle threshold recording on/off
    toggleThreshold:(id)=>upd(id,t=>({thresholdRec:!t.thresholdRec})),
    // Toggle count-in (off → 1 bar → 2 bars → off)
    cycleCountIn:(id)=>upd(id,t=>({countIn:(t.countIn+1)%3})),
    // Toggle auto-rec (off → 1 → 2 → 4 → 8 → off)
    cycleAutoRec:(id)=>upd(id,t=>{
      const steps=[0,1,2,4,8];
      const cur=steps.indexOf(t.autoRecBars);
      return{autoRecBars:steps[(cur+1)%steps.length]};
    }),
    // Cycle speed: 1→2→4→0.5→0.25→1
    cycleSpeed:(id)=>{
      const speeds=[1,2,4,0.5,0.25];
      const t=TR.current.find(t=>t.id===id);
      if(!t)return;
      const cur=speeds.findIndex(s=>Math.abs(s-(t.playSpeed||1))<0.01);
      const next=speeds[(cur+1)%speeds.length];
      speedBufsR.current[id]=null;
      const wasPlaying=t.state==='playing';
      upd(id,{playSpeed:next});
      TR.current=TR.current.map(t=>t.id===id?{...t,playSpeed:next}:t);
      if(wasPlaying){stopPlay(id);startPlay(id);}
    },
    // ── MACRO RUNNER ──────────────────────────────────────────────────────
    runMacro:(macroId)=>{
      const macro=macrosR.current.find(m=>m.id===macroId);
      if(!macro)return;
      const{command,params}=macro;
      const ctx=actxR.current;
      const setMuteGain=(id,muted)=>{if(trackMuteR.current[id])trackMuteR.current[id].gain.value=muted?0:1;};

      if(command==='groupPlay'){
        (params.trackIds||[]).forEach(id=>{const t=TR.current.find(t=>t.id===id);if(t&&t.state==='recorded'&&bufsR.current[id])scheduleStart(id);});
      } else if(command==='groupStop'){
        (params.trackIds||[]).forEach(id=>{const t=TR.current.find(t=>t.id===id);if(t?.state==='playing')A.current.playStop(id);});
      } else if(command==='groupMute'){
        (params.trackIds||[]).forEach(id=>{upd(id,{isMuted:true});setMuteGain(id,true);});
      } else if(command==='groupUnmute'){
        (params.trackIds||[]).forEach(id=>{upd(id,{isMuted:false});setMuteGain(id,false);});
      } else if(command==='groupClear'){
        (params.trackIds||[]).forEach(id=>A.current.clear(id));
      } else if(command==='soloTrack'){
        TR.current.forEach(t=>{const m=t.id!==params.trackId;upd(t.id,{isMuted:m});setMuteGain(t.id,m);});
      } else if(command==='unsoloAll'||command==='fullBring'){
        TR.current.forEach(t=>{upd(t.id,{isMuted:false});setMuteGain(t.id,false);});
      } else if(command==='fullDrop'){
        TR.current.forEach(t=>{upd(t.id,{isMuted:true});setMuteGain(t.id,true);});
      } else if(command==='stopAllMute'){
        A.current.stopAll();
        TR.current.forEach(t=>{upd(t.id,{isMuted:true});setMuteGain(t.id,true);});
      } else if(command==='playFromTop'){
        // Force-stop all sources immediately (bypass sync stop), reset clock, restart
        TR.current.forEach(t=>{
          if(pendingTimers.current[t.id]){clearTimeout(pendingTimers.current[t.id]);delete pendingTimers.current[t.id];delete pendingTypeR.current[t.id];}
          stopPlay(t.id);
          if(t.state==='recording')stopRec(t.id);
        });
        setPending({});
        setTracks(p=>p.map(t=>t.state==='playing'||t.state==='recording'?{...t,state:bufsR.current[t.id]?'recorded':t.state}:t));
        masterClockR.current=null;
        setTimeout(()=>A.current.playAll(),80);
      } else if(command==='bpmDouble'){
        setBpm(b=>Math.min(Math.round(b*2),300));
      } else if(command==='bpmHalf'){
        setBpm(b=>Math.max(Math.round(b/2),30));
      } else if(command==='bpmSet'){
        setBpm(Math.max(20,Math.min(300,Number(params.value)||120)));
      } else if(command==='masterFadeOut'){
        if(!ctx||!masterGainR.current)return;
        const dur=Math.max(0.1,params.duration||4);
        const now=ctx.currentTime;
        masterGainR.current.gain.cancelScheduledValues(now);
        masterGainR.current.gain.setValueAtTime(masterGainR.current.gain.value,now);
        masterGainR.current.gain.linearRampToValueAtTime(0,now+dur);
        if(fadeTimerR.current)clearTimeout(fadeTimerR.current);
        fadeTimerR.current=setTimeout(()=>A.current.stopAll(),(dur*1000)+200);
      } else if(command==='masterFadeIn'){
        if(!ctx||!masterGainR.current)return;
        const dur=Math.max(0.1,params.duration||2);
        const now=ctx.currentTime;
        masterGainR.current.gain.cancelScheduledValues(now);
        masterGainR.current.gain.setValueAtTime(0,now);
        masterGainR.current.gain.linearRampToValueAtTime(mvR.current,now+dur);
        if(fadeTimerR.current)clearTimeout(fadeTimerR.current);
        fadeTimerR.current=setTimeout(()=>{setMasterVol(mvR.current);},(dur*1000)+100);

      // ── GROUP FADE — fade specific tracks via their mute node ────────────
      } else if(command==='groupFadeOut'){
        if(!ctx)return;
        const ids=params.trackIds||[];
        const dur=Math.max(0.1,params.duration||4);
        const now=ctx.currentTime;
        ids.forEach(id=>{
          const mg=trackMuteR.current[id];
          if(!mg)return;
          mg.gain.cancelScheduledValues(now);
          mg.gain.setValueAtTime(mg.gain.value,now);
          mg.gain.linearRampToValueAtTime(0,now+dur);
        });
        // After fade: mark tracks as muted in state
        if(fadeTimerR.current)clearTimeout(fadeTimerR.current);
        fadeTimerR.current=setTimeout(()=>{
          ids.forEach(id=>upd(id,{isMuted:true}));
        },(dur*1000)+100);
      } else if(command==='groupFadeIn'){
        if(!ctx)return;
        const ids=params.trackIds||[];
        const dur=Math.max(0.1,params.duration||2);
        const now=ctx.currentTime;
        ids.forEach(id=>{
          const mg=trackMuteR.current[id];
          if(!mg)return;
          // Unmute in state first so audio node activates
          upd(id,{isMuted:false});
          mg.gain.cancelScheduledValues(now);
          mg.gain.setValueAtTime(0,now);
          mg.gain.linearRampToValueAtTime(1,now+dur);
        });
      } else if(command==='groupCutoff'){
        // Sweep the lowpass filter cutoff for selected tracks while key is held.
        // direction: 'up' (min→max) or 'down' (max→min); speed: slow/medium/fast; range in Hz.
        if(!ctx)return;
        const ids=params.trackIds||[];
        const dir=params.direction||'up';
        const speedMap={slow:4.0,medium:2.0,fast:0.8};
        const rampDur=speedMap[params.speed||'medium'];
        const cutMin=Math.max(20,params.cutoffMin??200);
        const cutMax=Math.min(20000,params.cutoffMax??8000);
        const from=dir==='up'?cutMin:cutMax;
        const to=dir==='up'?cutMax:cutMin;
        const now=ctx.currentTime;
        ids.forEach(id=>{
          const cf=trackCutoffR.current[id];
          if(!cf)return;
          cf.frequency.cancelScheduledValues(now);
          cf.frequency.setValueAtTime(from,now);
          cf.frequency.exponentialRampToValueAtTime(Math.max(20,to),now+rampDur);
        });
        // On key release (next macro fire or any other action), reset filters to wide open.
        // Store cleanup on a ref so a second trigger resets.
        if(cutoffResetTimerR.current)clearTimeout(cutoffResetTimerR.current);
        cutoffResetTimerR.current=setTimeout(()=>{
          const t2=actxR.current?.currentTime||0;
          ids.forEach(id=>{
            const cf=trackCutoffR.current[id];
            if(!cf)return;
            cf.frequency.cancelScheduledValues(t2);
            cf.frequency.linearRampToValueAtTime(20000,t2+0.4);
          });
        },rampDur*1000+100);
      } else if(command==='toggleReverbAll'){
        setTrackFX(p=>{
          const anyOn=p.some(f=>f.reverbSend>0);
          return p.map(f=>anyOn
            ?{...f,_lastReverb:f.reverbSend>0?f.reverbSend:f._lastReverb,reverbSend:0}
            :{...f,reverbSend:f._lastReverb||0.5});
        });
      } else if(command==='toggleDelayAll'){
        setTrackFX(p=>{
          const anyOn=p.some(f=>f.delaySend>0);
          return p.map(f=>anyOn
            ?{...f,_lastDelay:f.delaySend>0?f.delaySend:f._lastDelay,delaySend:0}
            :{...f,delaySend:f._lastDelay||0.5});
        });

      // ── GROUP FX COMMANDS (select specific tracks) ──────────────────────
      } else if(command==='groupToggleReverb'){
        const ids=params.trackIds||[];
        setTrackFX(p=>p.map(f=>{
          if(!ids.includes(f.id))return f;
          if(f.reverbSend>0)return{...f,_lastReverb:f.reverbSend,reverbSend:0};
          return{...f,reverbSend:f._lastReverb||0.5};
        }));
      } else if(command==='groupToggleDelay'){
        const ids=params.trackIds||[];
        setTrackFX(p=>p.map(f=>{
          if(!ids.includes(f.id))return f;
          if(f.delaySend>0)return{...f,_lastDelay:f.delaySend,delaySend:0};
          return{...f,delaySend:f._lastDelay||0.5};
        }));
      } else if(command==='groupToggleEQ'){
        const ids=params.trackIds||[];
        setTrackFX(p=>p.map(f=>{
          if(!ids.includes(f.id))return f;
          return{...f,eqEnabled:!f.eqEnabled};
        }));
      } else if(command==='groupToggleComp'){
        const ids=params.trackIds||[];
        setTrackFX(p=>p.map(f=>{
          if(!ids.includes(f.id))return f;
          return{...f,compEnabled:!f.compEnabled};
        }));
      } else if(command==='groupSetSpeed'){
        const ids=params.trackIds||[];
        const spd=params.speed||1;
        ids.forEach(id=>{
          speedBufsR.current[id]=null;
          upd(id,{playSpeed:spd});
          TR.current=TR.current.map(t=>t.id===id?{...t,playSpeed:spd}:t);
          const t=TR.current.find(t=>t.id===id);
          if(t?.state==='playing'){stopPlay(id);startPlay(id);}
        });
      } else if(command==='groupToggleReverse'){
        const ids=params.trackIds||[];
        ids.forEach(id=>{
          if(!bufsR.current[id])return;
          if(!reverseBufsR.current[id])reverseBufsR.current[id]=reverseBuffer(bufsR.current[id]);
          const t=TR.current.find(t=>t.id===id);
          const wasPlaying=t?.state==='playing';
          const newReversed=!t?.isReversed;
          upd(id,{isReversed:newReversed});
          TR.current=TR.current.map(t=>t.id===id?{...t,isReversed:newReversed}:t);
          if(wasPlaying){stopPlay(id);startPlay(id);}
        });
      } else if(command==='groupSetPlayMode'){
        const ids=params.trackIds||[];
        const mode=params.playMode||'loop';
        ids.forEach(id=>upd(id,{playMode:mode}));
      } else if(command==='groupToggleMute'){
        const ids=params.trackIds||[];
        const setMuteGain=(id,m)=>{if(trackMuteR.current[id])trackMuteR.current[id].gain.value=m?0:1;};
        // Toggle: if ANY selected track is unmuted, mute all; otherwise unmute all
        const anyUnmuted=ids.some(id=>!TR.current.find(t=>t.id===id)?.isMuted);
        ids.forEach(id=>{upd(id,{isMuted:anyUnmuted});setMuteGain(id,anyUnmuted);});
      } else if(command==='groupRestartLoops'){
        const ids=params.trackIds||[];
        ids.forEach(id=>{
          const t=TR.current.find(t=>t.id===id);
          if(t?.state==='playing'){stopPlay(id);startPlay(id);}
        });
      }
    },
    tapTempo:()=>{const now=Date.now();setTapTimes(prev=>{const r=[...prev,now].filter(t=>now-t<4000).slice(-8);if(r.length>=2){const iv=r.slice(1).map((t,i)=>t-r[i]);setBpm(Math.round(60000/(iv.reduce((a,b)=>a+b,0)/iv.length)));}return r;});},
    metronomeToggle:()=>setMetronomeMode(m=>m==='off'?'always':'off'),

    // ── NEW CYCLE / TOGGLE PER-TRACK ACTIONS ─────────────────────────────
    // These are designed to be useful on a single key gesture
    togglePlayMode:(id)=>upd(id,t=>({playMode:t.playMode==='loop'?'oneshot':t.playMode==='oneshot'?'pingpong':'loop'})),
    toggleStopRecMode:(id)=>upd(id,t=>({stopRecMode:t.stopRecMode==='play'?'overdub':'play'})),
    toggleThresholdRec:(id)=>upd(id,t=>({thresholdRec:!t.thresholdRec})),
    cycleCountIn:(id)=>upd(id,t=>({countIn:t.countIn>=2?0:t.countIn+1})),
    cycleAutoRecBars:(id)=>upd(id,t=>{const steps=[0,1,2,4,8];const idx=steps.indexOf(t.autoRecBars??0);return{autoRecBars:steps[(idx+1)%steps.length]};}),
    cycleSyncStopMode:(id)=>upd(id,t=>{const modes=['immediate','loop-end','bar-end','phrase-end','fade'];const idx=modes.indexOf(t.syncStopMode??'loop-end');return{syncStopMode:modes[(idx+1)%modes.length],syncStop:modes[(idx+1)%modes.length]!=='immediate'};}),
    speedHalf:(id)=>{const t=TR.current.find(t=>t.id===id);speedBufsR.current[id]=null;upd(id,{playSpeed:0.5});TR.current=TR.current.map(t=>t.id===id?{...t,playSpeed:0.5}:t);if(t?.state==='playing'){stopPlay(id);startPlay(id);}},
    speedDouble:(id)=>{const t=TR.current.find(t=>t.id===id);speedBufsR.current[id]=null;upd(id,{playSpeed:2});TR.current=TR.current.map(t=>t.id===id?{...t,playSpeed:2}:t);if(t?.state==='playing'){stopPlay(id);startPlay(id);}},
    speedNormal:(id)=>{const t=TR.current.find(t=>t.id===id);speedBufsR.current[id]=null;upd(id,{playSpeed:1});TR.current=TR.current.map(t=>t.id===id?{...t,playSpeed:1}:t);if(t?.state==='playing'){stopPlay(id);startPlay(id);}},
    speedQuarter:(id)=>{const t=TR.current.find(t=>t.id===id);speedBufsR.current[id]=null;upd(id,{playSpeed:0.25});TR.current=TR.current.map(t=>t.id===id?{...t,playSpeed:0.25}:t);if(t?.state==='playing'){stopPlay(id);startPlay(id);}},
    speedQuad:(id)=>{const t=TR.current.find(t=>t.id===id);speedBufsR.current[id]=null;upd(id,{playSpeed:4});TR.current=TR.current.map(t=>t.id===id?{...t,playSpeed:4}:t);if(t?.state==='playing'){stopPlay(id);startPlay(id);}},
    cycleSpeed:(id)=>{const t=TR.current.find(t=>t.id===id);if(!t)return;const steps=[0.25,0.5,1,2,4];const idx=steps.findIndex(s=>Math.abs((t.playSpeed??1)-s)<0.01);const ns=steps[(idx+1)%steps.length];speedBufsR.current[id]=null;upd(id,{playSpeed:ns});TR.current=TR.current.map(t=>t.id===id?{...t,playSpeed:ns}:t);if(t.state==='playing'){stopPlay(id);startPlay(id);}},

    // ── GLOBAL-LEVEL ACTIONS (no trackId needed) ──────────────────────────
    bpmDouble:()=>setBpm(b=>Math.min(Math.round(b*2),300)),
    bpmHalf:()=>setBpm(b=>Math.max(Math.round(b/2),30)),
    quantizeToggle:()=>setQuantize(v=>!v),
    syncAllToggle:()=>{setGlobalSync(v=>{const ns=!v;setTracks(p=>p.map(t=>({...t,syncStart:ns,syncStop:ns})));return ns;});},
    masterFadeOut:()=>{
      const ctx=actxR.current;if(!ctx||!masterGainR.current)return;
      const dur=2;const now=ctx.currentTime;
      masterGainR.current.gain.cancelScheduledValues(now);
      masterGainR.current.gain.setValueAtTime(masterGainR.current.gain.value,now);
      masterGainR.current.gain.linearRampToValueAtTime(0,now+dur);
      if(fadeTimerR.current)clearTimeout(fadeTimerR.current);
      fadeTimerR.current=setTimeout(()=>A.current.stopAll(),(dur*1000)+200);
    },
    masterFadeIn:()=>{
      const ctx=actxR.current;if(!ctx||!masterGainR.current)return;
      const dur=2;const now=ctx.currentTime;
      masterGainR.current.gain.cancelScheduledValues(now);
      masterGainR.current.gain.setValueAtTime(0,now);
      masterGainR.current.gain.linearRampToValueAtTime(mvR.current,now+dur);
      if(fadeTimerR.current)clearTimeout(fadeTimerR.current);
      fadeTimerR.current=setTimeout(()=>setMasterVol(mvR.current),(dur*1000)+100);
    },
    exportMix:async()=>{
      if(exporting||!actxR.current)return;setExporting(true);
      try{
        const active=TR.current.filter(t=>bufsR.current[t.id]);
        if(!active.length){setExporting(false);return;}
        // Use the longest active loop, multiplied by 4 to give a few iterations
        // for reverb/delay tails to play out. NO upper cap — user can export full mixes.
        const longest=Math.max(...active.map(t=>bufsR.current[t.id].duration));
        const dur=Math.max(8,longest*4); // floor at 8s for very short loops
        const sr=actxR.current.sampleRate;
        // Stereo output (2 channels) to preserve the live signal path's stereo
        const off=new OfflineAudioContext(2,Math.ceil(dur*sr),sr);

        // ── Master gain — matches the user's current master volume ──
        const masterOut=off.createGain();
        masterOut.gain.value=masterVol;
        masterOut.connect(off.destination);

        // ── Global reverb bus (matches setupGraph) ──
        const conv=off.createConvolver();conv.buffer=createReverbIR(off);
        const revWet=off.createGain();revWet.gain.value=0.8;
        conv.connect(revWet);revWet.connect(masterOut);

        active.forEach(t=>{
          const fx=tFXR.current[t.id];
          if(!fx)return;

          // ── Pick the correct buffer based on track state ──
          // Match what the live track is actually playing right now: reverse
          // if reversed, speed-shifted buffer if speed !== 1, else original.
          let buf=bufsR.current[t.id];
          if(t.isReversed&&reverseBufsR.current[t.id]){
            buf=reverseBufsR.current[t.id];
          }
          if(t.playSpeed&&t.playSpeed!==1&&speedBufsR.current[t.id]){
            // Speed buffer is pre-rendered at the chosen speed
            buf=speedBufsR.current[t.id];
          }
          if(!buf)return;

          // ── Source ──
          const src=off.createBufferSource();
          src.buffer=buf;
          src.loop=true;

          // ── EQ (3-band, matches live setup) ──
          const eqL=off.createBiquadFilter();eqL.type='lowshelf';eqL.frequency.value=120;
          eqL.gain.value=fx.eqEnabled?fx.eqLow:0;
          const eqM=off.createBiquadFilter();eqM.type='peaking';eqM.frequency.value=1000;eqM.Q.value=1;
          eqM.gain.value=fx.eqEnabled?fx.eqMid:0;
          const eqH=off.createBiquadFilter();eqH.type='highshelf';eqH.frequency.value=8000;
          eqH.gain.value=fx.eqEnabled?fx.eqHigh:0;

          // ── Compressor (matches live) ──
          const comp=off.createDynamicsCompressor();
          comp.threshold.value=fx.compEnabled?fx.compThreshold:0;
          comp.ratio.value=fx.compEnabled?fx.compRatio:1;
          comp.attack.value=fx.compAttack||0.003;
          comp.release.value=fx.compRelease||0.25;

          // ── Volume ──
          const vol=off.createGain();
          vol.gain.value=fx.volume;

          // ── Cutoff filter — read the LIVE node's current frequency to capture
          // any sweeps from the groupCutoff macro that may be in effect ──
          const cutoff=off.createBiquadFilter();
          cutoff.type='lowpass';
          cutoff.Q.value=0.7;
          const liveCutoff=trackCutoffR.current[t.id];
          cutoff.frequency.value=liveCutoff?liveCutoff.frequency.value:20000;

          // ── Mute — read the LIVE mute node's gain to capture mid-fade state ──
          const mute=off.createGain();
          const liveMute=trackMuteR.current[t.id];
          mute.gain.value=liveMute?liveMute.gain.value:(t.isMuted?0:1);

          // ── Reverb send ──
          const revSend=off.createGain();
          revSend.gain.value=fx.reverbSend||0;

          // ── Delay (with feedback loop, matches live) ──
          const delNode=off.createDelay(5);
          delNode.delayTime.value=Math.max(0.001,fx.delayTime||0.375);
          const delFb=off.createGain();
          delFb.gain.value=fx.delayFeedback||0.3;
          const delSend=off.createGain();
          delSend.gain.value=fx.delaySend||0;
          const delOut=off.createGain();
          delOut.gain.value=0.7;

          // ── Chain (matches setupGraph exactly) ──
          // entry→EQ→comp→vol→cutoff→mute→master
          src.connect(eqL);eqL.connect(eqM);eqM.connect(eqH);
          eqH.connect(comp);comp.connect(vol);
          vol.connect(cutoff);cutoff.connect(mute);
          mute.connect(masterOut);

          // Sends — both tap from post-volume
          vol.connect(revSend);revSend.connect(conv);
          vol.connect(delSend);delSend.connect(delNode);
          delNode.connect(delFb);delFb.connect(delNode); // feedback loop
          delNode.connect(delOut);delOut.connect(masterOut);

          src.start(0);
          src.stop(dur);
        });

        const rendered=await off.startRendering();
        const wav=encodeWAV(rendered);
        const url=URL.createObjectURL(new Blob([wav],{type:'audio/wav'}));
        const a=document.createElement('a');a.href=url;a.download=`mix-${Date.now()}.wav`;a.click();
        setTimeout(()=>URL.revokeObjectURL(url),5000);
      }catch(e){
        console.error('Export failed:',e);
      }
      setExporting(false);
    },
  };

  // ── SUPPORT CHAT SEND ────────────────────────────────────────────────────────
  const sendChat=async(overrideText)=>{
    const text=(overrideText??chatInput).trim();
    if(!text||chatBusy)return;
    setChatInput('');
    setChatBusy(true);
    setChatMsgs(p=>[...p,{role:'user',text}]);
    chatHistR.current=[...chatHistR.current,{role:'user',content:text}];
    // Cap history at 10 pairs (20 messages) to prevent unbounded memory growth
    if(chatHistR.current.length>20)chatHistR.current=chatHistR.current.slice(-20);
    setTimeout(()=>chatEndR.current?.scrollIntoView({behavior:'smooth'}),60);
    if(!LOOPGEN_API_KEY){
      setChatMsgs(p=>[...p,{role:'ai',text:'⚠ API key not set. Open App.jsx and paste your Anthropic API key into the LOOPGEN_API_KEY constant at the top of the file.'}]);
      setChatBusy(false);return;
    }
    const controller=new AbortController();
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        signal:controller.signal,
        headers:{
          'Content-Type':'application/json',
          'x-api-key': LOOPGEN_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:800,system:LOOPGEN_SYSTEM,messages:chatHistR.current})
      });
      const data=await res.json();
      if(!res.ok)throw new Error(data.error?.message||`API error ${res.status}`);
      const reply=data.content?.[0]?.text||'No response — try again.';
      chatHistR.current=[...chatHistR.current,{role:'assistant',content:reply}];
      setChatMsgs(p=>[...p,{role:'ai',text:reply}]);
    }catch(e){
      if(e.name!=='AbortError'){
        setChatMsgs(p=>[...p,{role:'ai',text:`Something went wrong: ${e.message}`}]);
        chatHistR.current.pop();
      }
    }
    setChatBusy(false);
    setTimeout(()=>chatEndR.current?.scrollIntoView({behavior:'smooth'}),80);
  };

  // ── GESTURE ENGINE ───────────────────────────────────────────────────────
  // Track bindings: { key: { type:'track', trackId, tap, doubleTap, hold } }
  // Global bindings: { key: { type:'global', action } }
  // Dispatch a binding record (from keyboard or MIDI) — unified for both input types.
  // `b` is the binding object ({ type, tap, doubleTap, hold, trackId, ... }).
  const dispatchBinding=(b,gesture)=>{
    if(!b)return;
    if(b.type==='macro'){
      const macroId=b[gesture]||b.macroId;
      if(macroId)A.current.runMacro(macroId);
      return;
    }
    const action=b[gesture];
    if(!action||action==='none')return;
    if(b.type==='global'){
      A.current[action]?.();
    } else {
      if((action==='volumeUp'||action==='volumeDown')&&b[`${gesture}Params`]){
        A.current[action]?.(b.trackId,b[`${gesture}Params`]);
      } else {
        A.current[action]?.(b.trackId);
      }
    }
  };

  const fireGesture=(key,gesture)=>{
    dispatchBinding(BR.current[key],gesture);
  };

  useEffect(()=>{
    const onDown=(e)=>{
      if(window.__bundleFocus__&&window.__bundleFocus__!=='loopgen')return;
      if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT'||e.target.isContentEditable)return;
      if(AR.current)return;
      const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;
      if(!BR.current[k])return;
      e.preventDefault();
      if(heldR.current[k])return; // already held
      const holdTimer=setTimeout(()=>{
        heldR.current[k].holdFired=true;
        // cancel any pending tap
        clearTimeout(tapTimerR.current[k]);delete tapTimerR.current[k];delete lastTapR.current[k];
        fireGesture(k,'hold');
      },HOLD_MS);
      heldR.current[k]={pressTime:Date.now(),holdFired:false,holdTimer};
    };
    const onUp=(e)=>{
      if(window.__bundleFocus__&&window.__bundleFocus__!=='loopgen')return;
      if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT'||e.target.isContentEditable)return;
      const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;
      if(!BR.current[k]||!heldR.current[k])return;
      e.preventDefault();
      const held=heldR.current[k];
      clearTimeout(held.holdTimer);
      delete heldR.current[k];
      if(held.holdFired){
        // If a hold gesture fired, check if it was a groupCutoff macro — if so,
        // reset the filter NOW on key release instead of waiting for a fixed timer.
        const b=BR.current[k];
        if(b?.hold&&b.hold!=='none'){
          const macroId=b.hold;
          const mac=macrosR.current?.find(m=>m.id===macroId);
          if(mac?.command==='groupCutoff'){
            if(cutoffResetTimerR.current){clearTimeout(cutoffResetTimerR.current);cutoffResetTimerR.current=null;}
            const ctx=actxR.current;
            if(ctx){
              const t2=ctx.currentTime;
              const ids=mac.params?.trackIds||[];
              ids.forEach(id=>{
                const cf=trackCutoffR.current[id];
                if(!cf)return;
                cf.frequency.cancelScheduledValues(t2);
                cf.frequency.linearRampToValueAtTime(20000,t2+0.4);
              });
            }
          }
        }
        return;
      }
      const now=Date.now();
      const b=BR.current[k];
      // ALL key types now use full gesture detection (tap / double-tap / hold)
      // check double tap
      if(lastTapR.current[k]&&now-lastTapR.current[k]<DBL_MS){
        clearTimeout(tapTimerR.current[k]);delete tapTimerR.current[k];delete lastTapR.current[k];
        fireGesture(k,'doubleTap');
      } else {
        // queue single tap — wait for possible double
        lastTapR.current[k]=now;
        clearTimeout(tapTimerR.current[k]);
        tapTimerR.current[k]=setTimeout(()=>{
          delete lastTapR.current[k];delete tapTimerR.current[k];
          fireGesture(k,'tap');
        },TAP_COMMIT_MS);
      }
    };
    window.addEventListener('keydown',onDown);
    window.addEventListener('keyup',onUp);
    return()=>{window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);};
  },[hasAudio]);

  // ── MIDI INPUT ENGINE ──────────────────────────────────────────────────────
  // Listens to all MIDI input devices. Handles:
  //  1. Learn mode: captures the next event and registers a binding
  //  2. Normal mode: dispatches to matching midiBinding (note = gesture, CC = parameter)
  //  3. Activity indicator: flashes green dot whenever any event comes in
  useEffect(()=>{
    if(!midiInputEnabled)return;
    let access=null;
    let inputs=[];
    const handleMIDI=(e)=>{
      // Device filter: skip events from disabled devices
      const devId=e.target?.id;
      const devOn=midiInputDevicesOnR.current;
      if(devId&&devOn[devId]===false)return;
      const [status,data1,data2]=e.data;
      const type=status&0xF0;
      const channel=(status&0x0F)+1; // 1-16
      // Pulse activity indicator (auto-clears via separate effect)
      flashMidi();

      // Learn mode — capture this event and register it
      const learn=midiLearnR.current;
      if(learn){
        let capturedKey=null;
        if(type===0x90&&data2>0){ // note on (velocity > 0)
          capturedKey=`ch${channel}-note${data1}`;
        } else if(type===0xB0){ // control change
          capturedKey=`ch${channel}-cc${data1}`;
        }
        if(capturedKey){
          setMidiLearn(null);
          // Conflict check
          const existing=midiBindingsR.current[capturedKey];
          if(existing){
            setConflictModal({
              msg:`"${capturedKey}" is already mapped to another action. Replace it?`,
              onConfirm:()=>setMidiBindings(p=>({...p,[capturedKey]:learn.binding}))
            });
          } else {
            setMidiBindings(p=>({...p,[capturedKey]:learn.binding}));
          }
          return;
        }
      }

      // Normal dispatch
      const note0=`ch${channel}-note${data1}`;
      const noteOmni=`chany-note${data1}`; // future: omni fallback
      const cc0=`ch${channel}-cc${data1}`;
      if(type===0x90&&data2>0){
        // Note on — treat as TAP gesture for now (v1)
        const b=midiBindingsR.current[note0];
        if(b)dispatchBinding(b,'tap');
      } else if(type===0x80||(type===0x90&&data2===0)){
        // Note off — not dispatched in v1
      } else if(type===0xB0){
        // CC — dispatch to fxParam bindings, value 0-127 mapped linearly to param range
        const b=midiBindingsR.current[cc0];
        if(b&&b.type==='fxParam'){
          const norm=data2/127;
          const range=(b.max??1)-(b.min??0);
          const val=(b.min??0)+norm*range;
          // Directly set the param on the track FX state
          if(b.target==='track'&&b.trackId!==null&&b.trackId!==undefined){
            setTrackFX(p=>p.map(f=>f.id===b.trackId?{...f,[b.param]:val}:f));
          } else if(b.target==='input'){
            setInputFX(p=>({...p,[b.param]:val}));
          } else if(b.target==='master'&&b.param==='volume'){
            setMasterVol(val);
          }
        } else if(b){
          // Non-fx CC binding: treat over-threshold (>63) as TAP, under as release
          if(data2>63)dispatchBinding(b,'tap');
        }
      }
    };
    navigator.requestMIDIAccess?.().then(a=>{
      access=a;
      const inArr=[...a.inputs.values()];
      setMidiInputs(inArr);
      inputs=inArr;
      inArr.forEach(inp=>{inp.onmidimessage=handleMIDI;});
      // Listen for newly connected devices
      a.onstatechange=(ev)=>{
        if(ev.port.type==='input'){
          const newInputs=[...a.inputs.values()];
          setMidiInputs(newInputs);
          newInputs.forEach(inp=>{if(!inputs.includes(inp))inp.onmidimessage=handleMIDI;});
          inputs=newInputs;
        }
      };
    }).catch(err=>console.warn('MIDI input unavailable',err));
    return()=>{
      if(inputs)inputs.forEach(inp=>{inp.onmidimessage=null;});
      if(access)access.onstatechange=null;
    };
  },[midiInputEnabled]);

  // ── FX BINDING GESTURE ENGINE ─────────────────────────────────────────────
  useEffect(()=>{
    const onDown=(e)=>{
      if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT'||e.target.isContentEditable)return;
      if(AR.current)return;
      const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;
      const fb=fxBindingsR.current[k];
      if(!fb)return;
      if(fxHeldR.current[k])return;
      e.preventDefault();
      if(fb.isKnob){
        // KNOB: HOLD = continuous ramp in configured direction
        const dir=fb.direction==='down'?-1:1;
        const mn=fb.holdMin??fb.min??0;
        const mx=fb.holdMax??fb.max??1;
        const speedMap={slow:(mx-mn)/80,medium:(mx-mn)/30,fast:(mx-mn)/10};
        const step=speedMap[fb.holdSpeed||'medium']*dir;
        const interval=setInterval(()=>{
          const{target,trackId,param}=fb;
          if(target==='track'){
            setTrackFX(p=>p.map(f=>{
              if(f.id!==trackId)return f;
              return{...f,[param]:+(Math.max(mn,Math.min(mx,f[param]+step)).toFixed(4))};
            }));
          } else {
            setInputFX(p=>({...p,[param]:+(Math.max(mn,Math.min(mx,p[param]+step)).toFixed(4))}));
          }
        },50);
        fxHeldR.current[k]={interval,isKnob:true};
      } else {
        fxHeldR.current[k]={isKnob:false,pressTime:Date.now()};
      }
    };
    const onUp=(e)=>{
      if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT'||e.target.isContentEditable)return;
      const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;
      const fb=fxBindingsR.current[k];
      if(!fb||!fxHeldR.current[k])return;
      e.preventDefault();
      const held=fxHeldR.current[k];
      if(fb.isKnob){
        clearInterval(held.interval);
        delete fxHeldR.current[k];
      } else {
        delete fxHeldR.current[k];
        const now=Date.now();
        const fireToggle=(gesture)=>{
          const action=fb[gesture];if(!action||action==='none')return;
          const{target,trackId,param}=fb;
          if(target==='track'){
            setTrackFX(p=>p.map(f=>{
              if(f.id!==trackId)return f;
              if(action==='toggle')return{...f,[param]:!f[param]};
              if(action==='reset')return{...f,[param]:fb.defaultValue??f[param]};
              return f;
            }));
          } else {
            setInputFX(p=>{
              if(action==='toggle')return{...p,[param]:!p[param]};
              if(action==='reset')return{...p,[param]:fb.defaultValue??p[param]};
              return p;
            });
          }
        };
        if(lastTapR.current[`fx_${k}`]&&now-lastTapR.current[`fx_${k}`]<280){
          clearTimeout(tapTimerR.current[`fx_${k}`]);delete tapTimerR.current[`fx_${k}`];delete lastTapR.current[`fx_${k}`];
          fireToggle('doubleTap');
        } else {
          lastTapR.current[`fx_${k}`]=now;
          clearTimeout(tapTimerR.current[`fx_${k}`]);
          tapTimerR.current[`fx_${k}`]=setTimeout(()=>{
            delete lastTapR.current[`fx_${k}`];delete tapTimerR.current[`fx_${k}`];
            fireToggle('tap');
          },260);
        }
      }
    };
    window.addEventListener('keydown',onDown);
    window.addEventListener('keyup',onUp);
    return()=>{window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);};
  },[hasAudio,fxBindings]);

  // ── FX KB MODAL KEY CAPTURE ───────────────────────────────────────────────
  useEffect(()=>{
    if(!fxKbModal?.awaitingKey)return;
    const h=(e)=>{
      e.preventDefault();
      const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;
      if(k==='Escape'){setFxKbModal(p=>({...p,awaitingKey:false}));return;}
      // Remove conflicting binding if key already used in regular bindings
      setBindings(p=>{const n={...p};if(n[k])delete n[k];return n;});
      // Save the FX binding with this key
      setFxBindings(p=>{
        const n={...p};
        // Remove old binding for this same param
        Object.keys(n).forEach(ok=>{
          if(n[ok]?.target===fxKbModal.target&&(fxKbModal.target==='input'||n[ok]?.trackId===fxKbModal.trackId)&&n[ok]?.param===fxKbModal.param)delete n[ok];
        });
        n[k]={
          type:'fxParam',target:fxKbModal.target,trackId:fxKbModal.trackId,
          param:fxKbModal.param,label:fxKbModal.label,
          isKnob:fxKbModal.isKnob,min:fxKbModal.min,max:fxKbModal.max,
          step:fxKbModal.step,defaultValue:fxKbModal.defaultValue,
          // Knobs: hold-ramp config
          direction:'up',holdSpeed:'medium',
          holdMin:fxKbModal.min??0,holdMax:fxKbModal.max??1,
          // Toggles: tap/dbl gestures
          tap:fxKbModal.isKnob?'none':'toggle',
          doubleTap:'none',hold:'none',
        };
        return n;
      });
      setFxKbModal(p=>({...p,awaitingKey:false,step2:true,assignedKey:k}));
    };
    window.addEventListener('keydown',h,true);return()=>window.removeEventListener('keydown',h,true);
  },[fxKbModal]);

  // ── KEY ASSIGN MODAL KEY CAPTURE ──────────────────────────────────────────
  useEffect(()=>{
    if(!keyAssignModal?.awaitingKey)return;
    const h=(e)=>{
      e.preventDefault();
      const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;
      if(k==='Escape'){setKeyAssignModal(p=>({...p,awaitingKey:false}));return;}
      setKeyAssignModal(p=>({...p,key:k,awaitingKey:false}));
    };
    window.addEventListener('keydown',h,true);return()=>window.removeEventListener('keydown',h,true);
  },[keyAssignModal]);

  // ── KEY FLOW MODAL KEY CAPTURE ─────────────────────────────────────────────
  useEffect(()=>{
    if(!keyFlowModal?.awaitingKey)return;
    const h=(e)=>{
      e.preventDefault();
      const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;
      if(k==='Escape'){setKeyFlowModal(p=>({...p,awaitingKey:false}));return;}
      setKeyFlowModal(p=>({...p,key:k,awaitingKey:false}));
    };
    window.addEventListener('keydown',h,true);return()=>window.removeEventListener('keydown',h,true);
  },[keyFlowModal]);

  // ── UNIVERSAL KEY MODAL HELPERS ───────────────────────────────────────────
  const openUniversalKey=useCallback((lk)=>{
    const eb=BR.current[lk];
    const efx=fxBindingsR.current[lk];
    const base={key:lk,awaitingKey:false};
    if(eb?.type==='track'){
      const t=TR.current.find(t=>t.id===eb.trackId);
      setUniversalKeyModal({...base,bindType:'track',selectedTrackId:eb.trackId,
        tapAction:eb.tap||'smartRecord',doubleTapAction:eb.doubleTap||'playStop',holdAction:eb.hold||'overdubUndoOrErase',
        stopRecMode:t?.stopRecMode||'play'});
    } else if(eb?.type==='global'){
      setUniversalKeyModal({...base,bindType:'global',
        globalTap:eb.tap||'none',globalDoubleTap:eb.doubleTap||'none',globalHold:eb.hold||'none'});
    } else if(eb?.type==='macro'){
      setUniversalKeyModal({...base,bindType:'macro',macroId:eb.macroId||null});
    } else if(efx){
      setUniversalKeyModal({...base,bindType:'fx',
        fxTarget:efx.target||'track',fxTrackId:efx.trackId??null,fxParam:efx.param||null,
        fxTap:efx.tap||'increase',fxDoubleTap:efx.doubleTap||'decrease',fxHold:efx.hold||'reset'});
    } else {
      setUniversalKeyModal({...base,bindType:null,selectedTrackId:null,
        tapAction:'smartRecord',doubleTapAction:'playStop',holdAction:'overdubUndoOrErase',stopRecMode:'play',
        globalTap:'none',globalDoubleTap:'none',globalHold:'none',
        fxTarget:'track',fxTrackId:null,fxParam:null,
        fxTap:'increase',fxDoubleTap:'decrease',fxHold:'reset',macroId:null});
    }
  },[]);

  // Key capture for universal key modal
  useEffect(()=>{
    if(!universalKeyModal?.awaitingKey)return;
    const h=(e)=>{
      e.preventDefault();
      const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;
      if(k==='Escape'){setUniversalKeyModal(p=>({...p,awaitingKey:false}));return;}
      setUniversalKeyModal(p=>({...p,key:k,awaitingKey:false}));
    };
    window.addEventListener('keydown',h,true);return()=>window.removeEventListener('keydown',h,true);
  },[universalKeyModal]);

  // Key capture for gesture modal
  useEffect(()=>{
    if(!gestureModal?.awaitingKey)return;
    if(gestureModal.trackId===null||gestureModal.trackId===undefined){setGestureModal(null);return;}
    const h=(e)=>{
      e.preventDefault();
      const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;
      if(k==='Escape'){setGestureModal(p=>({...p,awaitingKey:false}));return;}
      // Clear any FX binding on the new key — two engines must never share a key
      setFxBindings(p=>{const n={...p};delete n[k];return n;});
      // Remove any old binding for this key (other than same track)
      setBindings(p=>{const n={...p};if(n[k]&&n[k].trackId!==gestureModal.trackId)delete n[k];return n;});
      // Set binding with defaults if new
      setBindings(p=>{
        const existing=Object.entries(p).find(([,v])=>v.type==='track'&&v.trackId===gestureModal.trackId)?.[1]||{};
        return {...p,[k]:{type:'track',trackId:gestureModal.trackId,tap:existing.tap||'smartRecord',doubleTap:existing.doubleTap||'playStop',hold:existing.hold||'overdubUndoOrErase'}};
      });
      // Remove old key for this track if different
      setBindings(p=>{
        const n={...p};
        Object.keys(n).forEach(ok=>{if(ok!==k&&n[ok]?.type==='track'&&n[ok]?.trackId===gestureModal.trackId)delete n[ok];});
        return n;
      });
      setGestureModal(p=>({...p,awaitingKey:false}));
    };
    window.addEventListener('keydown',h,true);return()=>window.removeEventListener('keydown',h,true);
  },[gestureModal]);

  // Macro key assigning
  useEffect(()=>{
    if(assigning?.type!=='macro')return;
    const h=(e)=>{e.preventDefault();const k=e.key===' '?'Space':e.key.length===1?e.key.toLowerCase():e.code;if(k==='Escape'){setAssigning(null);return;}
      setBindings(p=>{const n={...p};Object.keys(n).forEach(ok=>{if(n[ok]?.type==='macro'&&n[ok]?.macroId===assigning.macroId)delete n[ok];});return{...n,[k]:{type:'macro',macroId:assigning.macroId}};});
      setAssigning(null);};
    window.addEventListener('keydown',h,true);return()=>window.removeEventListener('keydown',h,true);
  },[assigning]);
  useEffect(()=>{
    // Scrolling live waveform buffer — 2 seconds of history per track
    const LIVE_BUF_SIZE=300; // number of amplitude samples to keep
    const liveData=liveWaveDataR.current;

    const go=()=>{
      const ctx=actxR.current;
      if(ctx){
        const now=ctx.currentTime;
        const p={};

        TR.current.forEach(t=>{
          // ── Progress tracking ──
          if(t.state==='playing'&&t.duration>0){
            const elapsed=(now-t0R.current[t.id]);
            p[t.id]=elapsed<0?0:(elapsed%t.duration)/t.duration;
          }
          if(pendingTypeR.current[t.id]==='start'&&t.duration>0){
            const mc=masterClockR.current??now;
            const elapsed=(now-mc)%t.duration;
            p[t.id]=elapsed/t.duration;
          }

          // ── Playhead painting on stored waveform ──
          if((t.state==='playing'||pendingTypeR.current[t.id]==='start')&&bufsR.current[t.id]){
            const canvas=canvR.current[t.id];
            if(canvas){
              paintWave(canvas,bufsR.current[t.id],t.color);
              paintPlayhead(canvas,p[t.id]??0,t.color);
            }
          }

          // ── Live recording wave ──
          if(t.state==='recording'&&analyserR.current){
            if(!liveData[t.id])liveData[t.id]=new Float32Array(LIVE_BUF_SIZE).fill(0);
            const buf=new Float32Array(analyserR.current.fftSize);
            analyserR.current.getFloatTimeDomainData(buf);
            // Get RMS of this frame
            let rms=0;for(let i=0;i<buf.length;i++)rms+=buf[i]*buf[i];
            rms=Math.sqrt(rms/buf.length);
            // Shift buffer left and append new sample
            liveData[t.id].copyWithin(0,1);
            liveData[t.id][LIVE_BUF_SIZE-1]=rms;
            // Draw live wave on the live canvas
            const lc=liveCanvR.current[t.id];
            if(lc){
              const lctx=lc.getContext('2d');
              const w=lc.width,h=lc.height;
              lctx.clearRect(0,0,w,h);
              // Background pulse while recording
              lctx.fillStyle='rgba(255,77,77,0.03)';
              lctx.fillRect(0,0,w,h);
              // Draw bars for each sample
              const barW=w/LIVE_BUF_SIZE;
              for(let i=0;i<LIVE_BUF_SIZE;i++){
                const amp=liveData[t.id][i];
                const barH=Math.max(1,amp*h*2.5);
                const alpha=0.3+amp*3;
                // Color gets brighter as you get to the right (more recent)
                const intensity=Math.round(50+i/LIVE_BUF_SIZE*205);
                lctx.fillStyle=`rgba(255,77,77,${Math.min(1,alpha)})`;
                lctx.fillRect(
                  i*barW,
                  (h-barH)/2,
                  Math.max(1,barW-0.5),
                  barH
                );
              }
              // Center line
              lctx.strokeStyle='rgba(255,77,77,0.2)';
              lctx.lineWidth=1;
              lctx.beginPath();lctx.moveTo(0,h/2);lctx.lineTo(w,h/2);lctx.stroke();
              // Recording indicator dot (right edge)
              const lastAmp=liveData[t.id][LIVE_BUF_SIZE-1];
              const dotR=3+lastAmp*8;
              lctx.beginPath();
              lctx.arc(w-dotR-2,h/2,dotR,0,Math.PI*2);
              lctx.fillStyle=`rgba(255,77,77,${0.6+lastAmp})`;
              lctx.fill();
            }
          } else if(t.state!=='recording'){
            // Clear live wave data when not recording
            if(liveData[t.id])liveData[t.id]=null;
          }
        });
        setProgresses(p);
        // ── Live input level for threshold meter ──
        if(analyserR.current){
          const buf=new Float32Array(analyserR.current.fftSize);
          analyserR.current.getFloatTimeDomainData(buf);
          let sum=0;for(let i=0;i<buf.length;i++)sum+=buf[i]*buf[i];
          const rms=Math.sqrt(sum/buf.length);
          setInputLevel(Math.min(1,rms*4)); // scale 0–1 (rms*4 gives useful visual range)
        }
      }
      rafR.current=requestAnimationFrame(go);
    };
    rafR.current=requestAnimationFrame(go);
    return()=>cancelAnimationFrame(rafR.current);
  },[]);

  // ── UNMOUNT CLEANUP — close AudioContext and stop MediaStream ──────────────
  // Fixes bugs #21 and #22: without this, the browser holds the mic open
  // indefinitely and the AudioContext counts against the browser's limit.
  useEffect(()=>{
    return()=>{
      try{
        if(streamR.current){
          streamR.current.getTracks().forEach(t=>t.stop());
          streamR.current=null;
        }
      }catch(e){}
      try{
        if(actxR.current&&actxR.current.state!=='closed'){
          actxR.current.close();
          actxR.current=null;
        }
      }catch(e){}
    };
  },[]);

  // ── HELPERS ──────────────────────────────────────────────────────────────
  const getTrackBinding=(trackId)=>Object.entries(bindings).find(([,v])=>v.type==='track'&&v.trackId===trackId);
  // Find which key has a given global action in any gesture slot
  const getGlobalKey=(action)=>Object.entries(bindings).find(([,v])=>v.type==='global'&&(v.tap===action||v.doubleTap===action||v.hold===action))?.[0];
  // Find the interaction type(s) for a global action on its key
  const getGlobalInteractions=(action)=>{
    const entry=Object.entries(bindings).find(([,v])=>v.type==='global'&&(v.tap===action||v.doubleTap===action||v.hold===action));
    if(!entry)return null;
    const[k,v]=entry;
    const slots=[];
    if(v.tap===action)slots.push('TAP');
    if(v.doubleTap===action)slots.push('DBL');
    if(v.hold===action)slots.push('HOLD');
    return{key:k,slots};
  };
  const getFxKey=(target,trackId,param)=>Object.entries(fxBindings).find(([,v])=>v.target===target&&(target==='input'||v.trackId===trackId)&&v.param===param)?.[0];
  const isWaitGlobal=(action)=>assigning?.type==='global'&&assigning?.action===action;
  const handleDrop=()=>{if(dragItem.current===null||dragOverIt.current===null)return;setTracks(prev=>{const a=[...prev];const fi=a.findIndex(t=>t.id===dragItem.current),ti=a.findIndex(t=>t.id===dragOverIt.current);if(fi===-1||ti===-1||fi===ti)return prev;const[m]=a.splice(fi,1);a.splice(ti,0,m);return a;});dragItem.current=null;dragOverIt.current=null;setDragOver(null);};
  const sc=(t)=>t.state==='recording'?'#ff4d4d':t.state==='playing'?t.color:'#1e1e2e';
  const updFX=(id,k,v)=>setTrackFX(p=>p.map(f=>f.id===id?{...f,[k]:v}:f));
  // panelBtn removed — no longer used

  // ── RENDER ────────────────────────────────────────────────────────────────
  // ── shared style tokens ──
  const T={
    white:darkMode?'#ffffff':'#111111',
    offwhite:darkMode?'#ffffff':'#111111',
    soft:darkMode?'#ffffff':'#222222',
    muted:darkMode?'rgba(255,255,255,0.7)':'rgba(0,0,0,0.6)',
    faint:darkMode?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.4)',
    dim:darkMode?'rgba(255,255,255,0.22)':'rgba(0,0,0,0.2)',
    bg:darkMode?'#000000':'#f0f0f0',
    card:darkMode?'#0a0a0a':'#ffffff',
    cardBorder:darkMode?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.12)',
    border:darkMode?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.14)',
    borderBright:darkMode?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.25)',
    // Accent colors — toned down in light mode so they're readable on white
    green:darkMode?'#39ff14':'#1a9900',
    greenDim:darkMode?'rgba(57,255,20,0.18)':'rgba(26,153,0,0.12)',
    greenBorder:darkMode?'rgba(57,255,20,0.3)':'rgba(26,153,0,0.35)',
    red:darkMode?'#ff4d4d':'#cc2200',
    amber:darkMode?'#ff9f43':'#c97000',
    teal:darkMode?'#00cec9':'#007a77',
    purple:darkMode?'#a29bfe':'#5145cd',
    pink:darkMode?'#fd79a8':'#c0005a',
    blue:darkMode?'#1e90ff':'#0055cc',
  };
  const sec=(label)=>(
    <div style={{fontSize:10,fontWeight:700,letterSpacing:4,color:T.offwhite,textTransform:'uppercase',marginBottom:12,marginTop:4,borderBottom:`1px solid ${T.border}`,paddingBottom:6}}>{label}</div>
  );
  const sBtn=(opts)=>{
    const{label,active,color=T.green,onClick,disabled,small}=opts;
    return(
      <button onClick={onClick} disabled={disabled} style={{
        padding:small?'4px 8px':'7px 12px', borderRadius:5,
        background:active?`${color}14`:'transparent',
        border:`1px solid ${active?color:T.border}`,
        color:active?color:T.muted,
        fontSize:small?9:11, letterSpacing:1, fontWeight:700, cursor:'pointer',
        transition:'all .15s', whiteSpace:'nowrap',
      }}>{label}</button>
    );
  };

  // ── MIDI LEARN CHIP ──────────────────────────────────────────────────────
  // `binding` = the shape we'll store if learn succeeds (same format as keyboard binding)
  // Finds existing MIDI binding by matching globalAction/trackAction/fxParam.
  const MidiChip=({binding,matcher,title='Learn MIDI'})=>{
    if(!midiInputEnabled)return null;
    // Find existing MIDI binding that matches this action
    const existingEntry=Object.entries(midiBindings).find(([,v])=>matcher?matcher(v):false);
    const existingKey=existingEntry?.[0];
    const isLearning=midiLearn?.learnId===binding.__learnId;
    const parseMidiKey=(k)=>{
      if(!k)return'';
      const m=k.match(/^ch(\d+)-(note|cc)(\d+)$/);
      if(!m)return k;
      const[,ch,type,num]=m;
      if(type==='note'){
        const names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
        const n=parseInt(num),oct=Math.floor(n/12)-1,name=names[n%12];
        return`${name}${oct}`;
      }
      return`CC${num}`;
    };
    return(
      <button onClick={(e)=>{
        e.stopPropagation();
        if(existingKey){
          setConflictModal({
            msg:`Clear MIDI binding "${parseMidiKey(existingKey)}"?`,
            onConfirm:()=>setMidiBindings(p=>{const n={...p};delete n[existingKey];return n;})
          });
          return;
        }
        if(isLearning){setMidiLearn(null);return;}
        // Start learn
        const learnId=`learn_${Date.now()}`;
        setMidiLearn({learnId,binding});
        // Auto-timeout after 10s
        setTimeout(()=>{
          if(midiLearnR.current?.learnId===learnId)setMidiLearn(null);
        },10000);
      }} title={existingKey?`${parseMidiKey(existingKey)} — click to clear`:isLearning?'Listening… press/turn your MIDI controller':title}
        style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:3,minWidth:22,height:16,padding:'0 5px',
          background:isLearning?'rgba(255,159,67,0.15)':existingKey?'rgba(0,206,201,0.1)':'transparent',
          border:`1px solid ${isLearning?T.amber:existingKey?'rgba(0,206,201,0.4)':T.border}`,
          borderRadius:2,cursor:'pointer',color:isLearning?T.amber:existingKey?T.teal:T.muted,
          fontFamily:'DM Mono,monospace',fontSize:8,flexShrink:0,
          animation:isLearning?'pulse .8s infinite':'none'}}>
        <span style={{fontSize:9}}>🎹</span>
        <span style={{fontWeight:700}}>{isLearning?'…':existingKey?parseMidiKey(existingKey):'+'}</span>
      </button>
    );
  };

  return(
    <div style={{background:'var(--bg)',minHeight:'100vh',fontFamily:"'Audiowide',sans-serif",fontWeight:400,color:T.offwhite,boxSizing:'border-box',userSelect:'none',position:'relative'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Audiowide&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes typingDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
        @keyframes chatSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        :root{
          --bg:${darkMode?'#000000':'#f0f0f0'};
          --card:${darkMode?'#0a0a0a':'#ffffff'};
          --card2:${darkMode?'#0f0f0f':'#f5f5f5'};
          --card3:${darkMode?'#141414':'#eeeeee'};
          --inset:${darkMode?'#050505':'#e8e8e8'};
          --border:${darkMode?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.13)'};
          --border2:${darkMode?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.08)'};
          --border3:${darkMode?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.06)'};
          --text:${darkMode?'#ffffff':'#111111'};
          --text70:${darkMode?'rgba(255,255,255,0.7)':'rgba(0,0,0,0.65)'};
          --text40:${darkMode?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.45)'};
          --text20:${darkMode?'rgba(255,255,255,0.22)':'rgba(0,0,0,0.22)'};
          --text10:${darkMode?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'};
        }
        *{box-sizing:border-box}
        body{background:var(--bg);color:var(--text)}
        button{cursor:pointer;transition:filter .12s,transform .08s;font-family:'DM Mono',monospace;font-weight:700;letter-spacing:0.5px;min-height:28px;min-width:28px;color:inherit}
        button:hover:not(:disabled){filter:brightness(${darkMode?1.35:0.8})}
        button:active:not(:disabled){transform:scale(0.94)}
        button:disabled{opacity:.28;cursor:default}
        button:focus-visible{outline:2px solid ${darkMode?'rgba(57,255,20,0.7)':'rgba(26,153,0,0.7)'};outline-offset:2px}
        button[data-destructive]:focus-visible{outline-color:rgba(255,77,77,0.7)}
        button[data-destructive]:hover:not(:disabled){filter:brightness(1.2) saturate(1.3)}
        input,textarea{font-family:'DM Mono',monospace;font-weight:400;color:var(--text);background:var(--card2);border:1px solid var(--border)}
        input:focus-visible,textarea:focus-visible{outline:1px solid ${darkMode?'rgba(57,255,20,0.5)':'rgba(26,153,0,0.5)'};outline-offset:1px}
        select{font-family:'DM Mono',monospace;font-weight:400;background:var(--card2);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:6px 10px;font-size:11px;letter-spacing:1px;outline:none;cursor:pointer;width:100%}
        select option{background:var(--card);color:var(--text)}
        select:focus-visible{outline:1px solid ${darkMode?'rgba(57,255,20,0.5)':'rgba(26,153,0,0.5)'}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:${darkMode?'#1e1e38':'#bbb'};border-radius:2px}
        ::-webkit-scrollbar-track{background:transparent}
        .drawer-section{font-size:9px;font-weight:700;letter-spacing:3px;color:var(--text40);text-transform:uppercase;margin-bottom:8px;margin-top:4px;padding-bottom:5px;border-bottom:1px solid var(--border3)}
        .btn-destructive{border-color:rgba(255,77,77,0.3)!important;color:rgba(255,77,77,0.7)!important}
        .btn-destructive:hover:not(:disabled){border-color:rgba(255,77,77,0.6)!important;color:#ff4d4d!important;background:rgba(255,77,77,0.08)!important}
      `}</style>

      {/* ━━━ TAB BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{borderBottom:`1px solid var(--border2)`,background:'var(--bg)',position:'sticky',top:0,zIndex:50}}>
        {/* Top row: Logo + Tabs + Right controls */}
        <div style={{display:'flex',alignItems:'stretch',padding:'0 16px',gap:4,overflowX:'auto',overflowY:'hidden',WebkitOverflowScrolling:'touch'}}>
        {/* Logo */}
        <div style={{display:'flex',alignItems:'center',gap:8,paddingRight:20,borderRight:'1px solid var(--border2)',marginRight:8,flexShrink:0}}>
          <span style={{color:T.red,animation:hasAudio?'blink 2.5s infinite':'none',fontSize:10}}>◉</span>
          <SpoolIcon size={28}/>
          <span style={{fontSize:7,color:'#ffd32a',background:'rgba(255,211,42,0.1)',border:'1px solid rgba(255,211,42,0.3)',borderRadius:3,padding:'1px 5px',letterSpacing:2,fontWeight:700}}>BETA</span>
          {!hasAudio&&<span style={{fontSize:9,color:T.muted,letterSpacing:2}}>OFFLINE</span>}
        </div>
        {/* Tabs */}
        {[
          {id:'perform',icon:'◉',label:'PERFORM'},
          {id:'keys',icon:'⌨',label:'KEYS'},
          {id:'trackfx',icon:'⊛',label:'TRACK FX'},
          {id:'master',icon:'⚙',label:'SETTINGS'},
          {id:'tablet',icon:'👆',label:'TABLET'},
        ].map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
            background:'transparent',border:'none',flexShrink:0,
            borderBottom:activeTab===tab.id?`2px solid ${T.green}`:'2px solid transparent',
            color:activeTab===tab.id?T.green:T.offwhite,
            fontSize:10,letterSpacing:3,fontWeight:700,
            padding:'14px 14px 12px',cursor:'pointer',
            display:'flex',alignItems:'center',gap:6,
            transition:'color .15s',
            touchAction:'manipulation',WebkitTapHighlightColor:'transparent',
          }}>
            <span style={{fontSize:11}}>{tab.icon}</span>{tab.label}
          </button>
        ))}
        </div>{/* end tabs row */}
        {/* Row 2: Controls — always fully visible, no scroll cutoff */}
        <div style={{display:'flex',alignItems:'center',padding:'0 8px',borderTop:'1px solid var(--border3)',background:'var(--bg)',overflowX:'auto'}}>
          {/* TEMPO — clickable to edit */}
          <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 10px',borderRight:`1px solid ${T.border}`,flexShrink:0}}>
            {bpmEditing?(
              <input autoFocus type="number" min={20} max={300} value={bpmEditVal}
                onChange={e=>setBpmEditVal(e.target.value)}
                onBlur={()=>{const v=parseInt(bpmEditVal);if(v>=20&&v<=300)setBpm(v);setBpmEditing(false);}}
                onKeyDown={e=>{if(e.key==='Enter'){const v=parseInt(bpmEditVal);if(v>=20&&v<=300)setBpm(v);setBpmEditing(false);}if(e.key==='Escape')setBpmEditing(false);}}
                style={{width:52,background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.amber}`,color:T.amber,borderRadius:4,padding:'2px 4px',fontSize:14,fontWeight:900,fontFamily:"'DM Mono',monospace",textAlign:'center',outline:'none'}}/>
            ):(
              <div onClick={()=>{setBpmEditVal(String(bpm));setBpmEditing(true);}} title="Click to edit BPM"
                style={{textAlign:'center',padding:'2px 6px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid rgba(255,155,67,0.25)`,borderRadius:4,minWidth:42,cursor:'text'}}>
                <div style={{fontSize:15,color:T.amber,lineHeight:1,fontWeight:900,fontFamily:"'DM Mono',monospace"}}>{Number.isInteger(bpm)?bpm:bpm.toFixed(1)}</div>
                <div style={{fontSize:6,color:'rgba(255,155,67,0.5)',letterSpacing:2}}>BPM</div>
              </div>
            )}
            <button onClick={A.current.tapTempo} style={{background:'rgba(255,155,67,0.08)',border:`1px solid rgba(255,155,67,0.3)`,color:T.amber,borderRadius:4,padding:'3px 7px',fontSize:8,letterSpacing:2,fontWeight:700}}>TAP</button>
            {/* Master loop length readout */}
            {masterLoopDur&&(
              <div title="Master loop length · click to clear"
                onClick={()=>setConflictModal({
                  msg:'Clear master loop reference? All tracks will re-establish sync on next recording.',
                  onConfirm:()=>{masterLoopDurR.current=null;masterClockR.current=null;setMasterLoopDur(null);}
                })}
                style={{textAlign:'center',padding:'2px 6px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.teal}44`,borderRadius:4,minWidth:48,cursor:'pointer'}}>
                <div style={{fontSize:11,color:T.teal,lineHeight:1,fontWeight:900,fontFamily:"'DM Mono',monospace"}}>{masterLoopDur.toFixed(2)}s</div>
                <div style={{fontSize:6,color:`${T.teal}99`,letterSpacing:2}}>MASTER</div>
              </div>
            )}
          </div>
          {/* METRONOME */}
          <div style={{display:'flex',alignItems:'center',gap:3,padding:'3px 10px',borderRight:`1px solid ${T.border}`,flexShrink:0}}>
            <span style={{fontSize:7,color:T.muted,letterSpacing:1}}>METRO</span>
            {[['off','OFF','var(--border)'],['countinOnly','COUNT-IN',T.amber],['always','ALWAYS',T.green]].map(([v,l,c])=>(
              <button key={v} onClick={()=>setMetronomeMode(v)}
                style={{background:metronomeMode===v?`${c}18`:'transparent',border:`1px solid ${metronomeMode===v?c:'var(--border)'}`,color:metronomeMode===v?c:T.muted,borderRadius:4,padding:'2px 6px',fontSize:7,letterSpacing:1,fontWeight:700}}>
                {l}
              </button>
            ))}
          </div>
          {/* MASTER INPUT VOL */}
          <div style={{display:'flex',alignItems:'center',gap:4,padding:'3px 10px',borderRight:`1px solid ${T.border}`,flexShrink:0}}>
            <span style={{fontSize:7,color:T.muted,letterSpacing:1}}>IN VOL</span>
            <input type="range" min={0} max={2} step={0.05} value={masterInputVol}
              onChange={e=>setMasterInputVol(parseFloat(e.target.value))}
              style={{width:60,accentColor:T.blue}}/>
            <span style={{fontSize:8,color:T.blue,fontFamily:"'DM Mono',monospace",minWidth:28}}>{Math.round(masterInputVol*100)}%</span>
          </div>
          {/* MASTER PLAYBACK VOL */}
          <div style={{display:'flex',alignItems:'center',gap:4,padding:'3px 10px',borderRight:`1px solid ${T.border}`,flexShrink:0}}>
            <span style={{fontSize:7,color:T.muted,letterSpacing:1}}>OUT VOL</span>
            <Knob value={masterVol} min={0} max={1.5} onChange={v=>{setMasterVol(v);}} label="VOL" color={T.green} size={28} decimals={2} defaultValue={0.8}/>
          </div>
          {/* SYNC */}
          <div style={{display:'flex',alignItems:'center',gap:4,padding:'3px 10px',borderRight:`1px solid ${T.border}`,flexShrink:0}}>
            <button onClick={()=>setQuantize(v=>!v)} style={{background:quantize?'rgba(255,211,42,0.08)':'transparent',border:`1px solid ${quantize?'rgba(255,211,42,0.4)':'var(--border)'}`,color:quantize?'#ffd32a':T.muted,fontWeight:700,borderRadius:4,padding:'3px 7px',fontSize:8,letterSpacing:1}}>{quantize?'Q·ON':'Q·OFF'}</button>
            <button onClick={()=>setAutoSync(v=>!v)} style={{background:autoSync?'rgba(57,255,20,0.08)':'transparent',border:`1px solid ${autoSync?'rgba(57,255,20,0.4)':'var(--border)'}`,color:autoSync?T.green:T.muted,fontWeight:700,borderRadius:4,padding:'3px 7px',fontSize:8,letterSpacing:1}}>{autoSync?'AUTO·ON':'AUTO·OFF'}</button>
            <button onClick={()=>{const ns=!globalSync;setGlobalSync(ns);setTracks(p=>p.map(t=>({...t,syncStart:ns,syncStop:ns})));}} style={{background:globalSync?'rgba(0,206,201,0.08)':'transparent',border:`1px solid ${globalSync?'rgba(0,206,201,0.4)':'var(--border)'}`,color:globalSync?T.teal:T.muted,fontWeight:700,borderRadius:4,padding:'3px 7px',fontSize:8,letterSpacing:1}}>{globalSync?'GRID·ON':'GRID·OFF'}</button>
          </div>
          {/* MONITOR + MIDI activity + DARK MODE */}
          <div style={{display:'flex',alignItems:'center',gap:4,padding:'3px 10px',borderRight:`1px solid ${T.border}`,flexShrink:0}}>
            <button onClick={()=>setMonitorEnabled(v=>!v)}
              style={{background:monitorEnabled?'rgba(0,206,201,0.1)':'transparent',border:`1px solid ${monitorEnabled?'rgba(0,206,201,0.4)':'var(--border)'}`,color:monitorEnabled?T.teal:T.muted,borderRadius:4,padding:'3px 7px',fontSize:8,letterSpacing:1,fontWeight:700}}>
              {monitorEnabled?'MON·ON':'MON·OFF'}
            </button>
            {/* MIDI activity indicator — always visible when Web MIDI is supported */}
            {typeof navigator!=='undefined'&&navigator.requestMIDIAccess&&(()=>{
              const isActive=midiActivity&&midiInputEnabled;
              const hasDevices=midiInputEnabled&&midiInputs.length>0;
              const dotColor=isActive?T.green:hasDevices?'rgba(57,255,20,0.5)':midiInputEnabled?T.amber:T.muted;
              const borderColor=isActive?T.green:hasDevices?'rgba(57,255,20,0.3)':midiInputEnabled?'rgba(255,159,67,0.4)':'var(--border)';
              const textColor=isActive?T.green:hasDevices?T.green:midiInputEnabled?T.amber:T.muted;
              const bg=isActive?'rgba(57,255,20,0.15)':hasDevices?'rgba(57,255,20,0.04)':'transparent';
              const tooltip=!midiInputEnabled
                ?'MIDI input is OFF — click to enable'
                :midiInputs.length===0
                  ?'MIDI enabled — no devices connected. Plug in a controller and it will appear.'
                  :`MIDI in: ${midiInputs.map(i=>i.name).join(', ')}`;
              return(
                <div title={tooltip}
                  onClick={()=>{
                    if(!midiInputEnabled){setMidiInputEnabled(true);}
                    else{setActiveTab('tablet');}
                  }}
                  style={{display:'flex',alignItems:'center',gap:3,padding:'3px 6px',borderRadius:4,cursor:'pointer',
                    background:bg,border:`1px solid ${borderColor}`,transition:'all 0.08s'}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:dotColor,boxShadow:isActive?`0 0 6px ${T.green}`:'none'}}/>
                  <span style={{fontSize:8,letterSpacing:1,fontWeight:700,color:textColor}}>MIDI</span>
                </div>
              );
            })()}
            <button onClick={()=>setDarkMode(v=>!v)}
              style={{background:'transparent',border:'1px solid var(--border)',color:T.muted,borderRadius:4,padding:'3px 7px',fontSize:11}}>
              {darkMode?'☀':'🌙'}
            </button>
          </div>
          {/* EXPORT */}
          <div style={{padding:'3px 10px',flexShrink:0}}>
            <button onClick={A.current.exportMix} disabled={exporting||!hasAudio}
              style={{background:exporting?'rgba(46,213,115,0.08)':'transparent',border:`1px solid ${exporting?'rgba(46,213,115,0.4)':'var(--border)'}`,color:exporting?T.green:T.muted,fontWeight:700,borderRadius:4,padding:'3px 9px',fontSize:8,letterSpacing:1,display:'flex',alignItems:'center',gap:4}}>
              <span style={{fontSize:10}}>{exporting?'⟳':'⬇'}</span>{exporting?'RENDERING…':'EXPORT WAV'}
            </button>
          </div>
        </div>
      </div>

      {/* ━━━ TAB CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{padding:'16px',minHeight:'calc(100vh - 54px)'}}>

        {/* ── INIT BANNER — compact inline ── */}
        {!hasAudio&&(
          <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',border:`1px solid ${T.greenBorder}`,borderRadius:8,marginBottom:12,background:'rgba(57,255,20,0.03)'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:T.green,boxShadow:`0 0 10px ${T.green}`,animation:'pulse 2s infinite',flexShrink:0}}/>
            {audioError
              ?<>
                <span style={{color:T.red,fontSize:11,fontWeight:700,letterSpacing:1}}>⚠ MIC ACCESS DENIED</span>
                <button onClick={()=>initAudio()} style={{background:'transparent',border:`1px solid ${T.green}`,color:T.green,borderRadius:5,padding:'4px 12px',fontSize:10,letterSpacing:2,fontWeight:700}}>↺ RETRY</button>
                <a href={window.location.href} target="_blank" rel="noopener noreferrer" style={{background:T.green,color:'#000',borderRadius:5,padding:'4px 12px',fontSize:10,letterSpacing:2,fontWeight:700,textDecoration:'none'}}>↗ NEW TAB</a>
              </>
              :<>
                <span style={{color:T.muted,fontSize:11,letterSpacing:1}}>Audio engine offline</span>
                <button onClick={()=>initAudio()} style={{background:'transparent',border:`1px solid ${T.green}`,color:T.green,borderRadius:5,padding:'4px 16px',fontSize:10,letterSpacing:3,fontWeight:700,boxShadow:`0 0 12px rgba(57,255,20,0.2)`}}>◉ INITIALIZE AUDIO</button>
              </>
            }
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            PERFORM TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab==='perform'&&(
          <div style={{animation:'fadeUp 0.2s ease'}}>

            {/* Layout toggle */}
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12,gap:4}}>
              {[['grid','▦ GRID'],['keyboard','⌨ KEYS'],['performance','⚡ PERFORM'],['touch','👆 TOUCH']].map(([v,l])=>(
                <button key={v} onClick={()=>setLayout(v)} style={{
                  background:layout===v?'rgba(57,255,20,0.08)':'transparent',
                  color:layout===v?T.green:T.muted,fontWeight:layout===v?700:400,
                  border:`1px solid ${layout===v?T.green+'44':'var(--border)'}`,
                  borderRadius:5,padding:'5px 12px',fontSize:9,letterSpacing:2,
                }}>{l}</button>
              ))}
            </div>

            {/* ── KEYBOARD VIEW ── */}
            {layout==='keyboard'&&(()=>{
              const ROWS=[
                ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
                ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
                ['CapsLock','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
                ['ShiftLeft','z','x','c','v','b','n','m',',','.','/','ShiftRight'],
                ['Space'],
              ];
              const KEY_LABEL={Backspace:'⌫',Tab:'TAB',CapsLock:'CAPS',Enter:'↵',ShiftLeft:'SHIFT',ShiftRight:'SHIFT','\\':'\\','`':'`',Space:'SPACE'};
              const KEY_FLEX={Backspace:1.8,Tab:1.4,CapsLock:1.7,Enter:2.0,ShiftLeft:2.2,ShiftRight:2.2,Space:6};
              const ACT_SHORT={smartRecord:'S-REC',record:'REC',playStop:'PLAY',overdub:'OVR',mute:'MUTE',solo:'SOLO',clear:'CLR',restart:'RST',reverse:'REV',punchIn:'PNCH',togglePlayMode:'MODE',cycleSpeed:'SPD',cycleStopMode:'STOP',cycleCountIn:'CI',cycleAutoRec:'AR',toggleThreshold:'THR',toggleEQ:'EQ',toggleComp:'COMP',toggleReverb:'VERB',toggleDelay:'DLY',overdubUndoOrErase:'UNDO',none:'—'};
              return(
                <div style={{background:darkMode?'var(--card3)':'#e8e8e8',border:`1px solid ${T.border}`,borderRadius:12,padding:'16px',marginBottom:12,overflowX:'auto'}}>
                  <div style={{fontSize:10,color:T.muted,letterSpacing:4,marginBottom:14,fontWeight:700}}>KEYBOARD MAP — click any bound key to edit</div>
                  <div style={{display:'flex',flexDirection:'column',gap:4,minWidth:640}}>
                    {ROWS.map((row,ri)=>(
                      <div key={ri} style={{display:'flex',gap:3,paddingLeft:ri===1?8:ri===2?14:ri===3?20:0}}>
                        {row.map(k=>{
                          const lk=k.length===1?k.toLowerCase():k==='Space'?'Space':k;
                          const b=bindings[lk];
                          const isTrack=b?.type==='track';
                          const isGlobal=b?.type==='global';
                          const isMacro=b?.type==='macro';
                          const macro=isMacro?macros.find(m=>m.id===b.macroId):null;
                          const track=isTrack?tracks.find(t=>t.id===b.trackId):null;
                          const color=isTrack?track?.color:isGlobal?T.purple:isMacro?'#ffd32a':null;
                          const isActive=isTrack&&(track?.state==='playing'||track?.state==='recording');
                          const prog=isTrack?progresses[track?.id]||0:0;
                          const isRec=track?.state==='recording';
                          const pendAct=isTrack?pending[track?.id]:null;
                          return(
                            <div key={k}
                              onClick={()=>setKeyFlowModal({...KFM_BLANK,key:lk,step:'gesture'})}
                              style={{
                                flex:KEY_FLEX[k]||1,minWidth:k==='Space'?120:36,
                                height:k==='Space'?32:b?70:50,
                                background:color?`${color}18`:'var(--card3)',
                                border:`1px solid ${color?color+'55':'var(--border)'}`,
                                borderBottom:`${b?3:2}px solid ${color?color+'88':'#14142a'}`,
                                borderRadius:5,padding:'4px 4px 3px',
                                cursor:'pointer',
                                position:'relative',overflow:'hidden',
                                display:'flex',flexDirection:'column',justifyContent:'space-between',
                              }}>
                              {isTrack&&track?.state==='playing'&&(
                                <div style={{position:'absolute',bottom:0,left:0,height:2,width:`${prog*100}%`,background:color,transition:'width .08s linear'}}/>
                              )}
                              {isRec&&<div style={{position:'absolute',top:3,right:3,width:4,height:4,borderRadius:'50%',background:T.red,animation:'blink .5s infinite'}}/>}
                              <div style={{fontSize:k.length>1?8:12,color:b?T.white:T.faint,fontWeight:700}}>
                                {KEY_LABEL[k]||k.toUpperCase()}
                              </div>
                              {isTrack&&(
                                <div style={{display:'flex',flexDirection:'column',gap:1}}>
                                  <div style={{fontSize:8,color:T.soft,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{track?.name}</div>
                                  <div style={{display:'flex',gap:3}}>
                                    {[['↑',b.tap],['↑↑',b.doubleTap],['⊙',b.hold]].map(([ic,ac])=>ac&&ac!=='none'&&(
                                      <span key={ic} style={{fontSize:6,color:T.muted}}>{ic}{(ACT_SHORT[ac]||ac).slice(0,3)}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {isGlobal&&(
                                <div style={{display:'flex',flexDirection:'column',gap:1}}>
                                  <div style={{display:'flex',gap:3}}>
                                    {[['↑',b.tap],['↑↑',b.doubleTap],['⊙',b.hold]].map(([ic,ac])=>ac&&ac!=='none'&&(
                                      <span key={ic} style={{fontSize:6,color:T.purple}}>{ic}{(ACT_SHORT[ac]||ac||'').slice(0,3)}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {isMacro&&<div style={{fontSize:8,color:'#ffd32a',fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>⚡ {macro?.name||'?'}</div>}
                              {!b&&<div style={{fontSize:7,color:'var(--text10)',textAlign:'center',marginTop:'auto'}}>+</div>}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:10,fontSize:10,color:T.faint,letterSpacing:2}}>↑ TAP · ↑↑ DBL · ⊙ HOLD · Click to edit</div>
                </div>
              );
            })()}

            {/* ── PERFORMANCE MODE ── */}
            {layout==='performance'&&(
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:12}}>
                {tracks.map(track=>{
                  const isRec=track.state==='recording';
                  const isPlay=track.state==='playing';
                  const hasBuf=!!bufsR.current[track.id]||track.state!=='empty';
                  const trackBind=getTrackBinding(track.id);
                  const boundKey=trackBind?.[0];
                  const prog=progresses[track.id]||0;
                  return(
                    <div key={track.id} style={{
                      background:isRec?'rgba(255,77,77,0.08)':isPlay?`${track.color}10`:T.card,
                      border:`2px solid ${isRec?T.red:isPlay?track.color:'var(--border2)'}`,
                      borderRadius:12,padding:'14px 10px',textAlign:'center',
                      position:'relative',overflow:'hidden',
                      boxShadow:isPlay?`0 0 28px ${track.color}22`:isRec?'0 0 20px rgba(255,77,77,0.12)':'none',
                      transition:'box-shadow .3s,border-color .3s',
                    }}>
                      {/* Progress bar at bottom */}
                      {isPlay&&<div style={{position:'absolute',bottom:0,left:0,height:3,width:`${prog*100}%`,background:track.color,transition:'width .08s linear',borderRadius:2}}/>}
                      {isRec&&<div style={{position:'absolute',top:8,right:8,width:6,height:6,borderRadius:'50%',background:T.red,animation:'blink .5s infinite'}}/>}
                      {/* Track name */}
                      <div style={{fontSize:10,color:isPlay?track.color:isRec?T.red:T.muted,fontWeight:700,letterSpacing:2,marginBottom:8,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{track.name}</div>
                      {/* State indicator */}
                      <div style={{fontSize:9,color:isRec?T.red:isPlay?track.color:T.dim,letterSpacing:2,marginBottom:10,fontWeight:700,minHeight:14}}>
                        {isRec?'● REC':isPlay?'▶ PLAYING':track.state==='empty'?'EMPTY':'STOPPED'}
                      </div>
                      {/* Big action buttons */}
                      <div style={{display:'flex',gap:4,justifyContent:'center'}}>
                        <button disabled={!hasAudio} onClick={()=>A.current.smartRecord(track.id)} style={{flex:1,padding:'8px 4px',borderRadius:6,fontSize:9,letterSpacing:1,fontWeight:700,background:isRec?'rgba(255,77,77,0.15)':'rgba(255,77,77,0.06)',border:`1px solid ${isRec?T.red:'rgba(255,77,77,0.3)'}`,color:isRec?T.red:'rgba(255,77,77,0.7)'}}>
                          {isRec?'■ STOP':'● REC'}
                        </button>
                        <button disabled={!hasBuf||isRec} onClick={()=>A.current.playStop(track.id)} style={{flex:1,padding:'8px 4px',borderRadius:6,fontSize:9,letterSpacing:1,fontWeight:700,background:isPlay?`${track.color}15`:`${track.color}06`,border:`1px solid ${isPlay?track.color:track.color+'44'}`,color:isPlay?track.color:track.color+'99'}}>
                          {isPlay?'■':'▶'}
                        </button>
                        <button disabled={!hasBuf} onClick={()=>A.current.mute(track.id)} style={{flex:0.7,padding:'8px 4px',borderRadius:6,fontSize:9,letterSpacing:0,fontWeight:700,background:track.isMuted?'rgba(255,211,42,0.12)':'transparent',border:`1px solid ${track.isMuted?'rgba(255,211,42,0.5)':'var(--border)'}`,color:track.isMuted?'#ffd32a':T.dim}}>
                          {track.isMuted?'⊘':'⊙'}
                        </button>
                      </div>
                      {/* Bound key */}
                      {boundKey&&<div style={{marginTop:8,fontSize:9,color:track.color,letterSpacing:2,opacity:.7}}>{boundKey.toUpperCase()}</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TOUCH / TABLET LAYOUT ── */}
            {layout==='touch'&&(
              <div style={{marginBottom:12}}>

                {/* ─ Top controls row ─ */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:6,marginBottom:10}}>
                  {/* BPM display */}
                  <div style={{textAlign:'center',padding:'10px 6px',background:darkMode?'var(--card2)':'#ececec',border:'1px solid rgba(255,155,67,0.3)',borderRadius:8}}>
                    <div style={{fontSize:26,color:T.amber,fontWeight:900,lineHeight:1,fontFamily:"'DM Mono',monospace"}}>{Number.isInteger(bpm)?bpm:bpm.toFixed(1)}</div>
                    <div style={{fontSize:8,color:'rgba(255,155,67,0.5)',letterSpacing:2,marginTop:2}}>BPM</div>
                  </div>
                  {/* TAP */}
                  <button onClick={A.current.tapTempo} style={{padding:'0 6px',background:'rgba(255,155,67,0.08)',border:'1px solid rgba(255,155,67,0.3)',borderRadius:8,color:T.amber,fontSize:13,fontWeight:700,letterSpacing:2,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
                    TAP
                  </button>
                  {/* GRID toggle */}
                  <button onClick={()=>{const ns=!globalSync;setGlobalSync(ns);setTracks(p=>p.map(t=>({...t,syncStart:ns,syncStop:ns})));}}
                    style={{padding:'0 6px',background:globalSync?'rgba(0,206,201,0.08)':'transparent',border:`1px solid ${globalSync?'rgba(0,206,201,0.4)':'var(--border)'}`,borderRadius:8,color:globalSync?T.teal:T.muted,fontSize:10,fontWeight:700,letterSpacing:1,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
                    {globalSync?'GRID·ON':'GRID·OFF'}
                  </button>
                  {/* QUANTIZE toggle */}
                  <button onClick={()=>setQuantize(v=>!v)}
                    style={{padding:'0 6px',background:quantize?'rgba(255,211,42,0.08)':'transparent',border:`1px solid ${quantize?'rgba(255,211,42,0.4)':'var(--border)'}`,borderRadius:8,color:quantize?'#ffd32a':T.muted,fontSize:10,fontWeight:700,letterSpacing:1,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
                    {quantize?'Q·ON':'Q·OFF'}
                  </button>
                </div>

                {/* ─ Track pads ─ */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:10}}>
                  {tracks.map(track=>{
                    const isRec=track.state==='recording';
                    const isPlay=track.state==='playing';
                    const hasBuf=!!bufsR.current[track.id]||track.state!=='empty';
                    const prog=progresses[track.id]||0;
                    const pendingAction=pending[track.id];
                    const isPendingStart=pendingAction==='start';
                    const isPendingStop=pendingAction==='stop'||pendingAction==='clear';
                    return(
                      <div key={track.id} style={{
                        background:isRec?'rgba(255,77,77,0.06)':isPlay?`${track.color}08`:T.card,
                        border:`1px solid ${isRec?'rgba(255,77,77,0.25)':isPlay?`${track.color}33`:'var(--border2)'}`,
                        borderTop:`3px solid ${isRec?T.red:track.color}`,
                        borderRadius:10,overflow:'hidden',
                        boxShadow:isPlay?`0 0 20px ${track.color}10`:isRec?'0 0 16px rgba(255,77,77,0.08)':'none',
                        transition:'box-shadow .3s,border-color .3s',
                      }}>
                        <div style={{padding:'10px 10px'}}>

                          {/* Header */}
                          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
                            <div style={{width:7,height:7,borderRadius:'50%',flexShrink:0,
                              background:isRec?T.red:isPlay?track.color:'var(--border)',
                              animation:isRec?'blink .7s infinite':'none',
                              boxShadow:isPlay?`0 0 5px ${track.color}`:isRec?'0 0 5px #ff4d4d':'none',
                            }}/>
                            <span style={{fontSize:12,color:T.soft,fontWeight:700,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:"'Audiowide',sans-serif"}}>{track.name}</span>
                            {track.isMuted&&<span style={{fontSize:7,color:'#ffd32a',background:'rgba(255,211,42,0.15)',border:'1px solid rgba(255,211,42,0.4)',borderRadius:3,padding:'2px 4px',letterSpacing:1,fontWeight:700}}>MUTED</span>}
                            <span style={{fontSize:9,color:T.offwhite,flexShrink:0}}>{track.duration>0?`${track.duration}s`:isRec?'●':'—'}</span>
                          </div>

                          {/* Waveform */}
                          <div style={{position:'relative',height:28,background:darkMode?'var(--card3)':'#e8e8e8',borderRadius:4,overflow:'hidden',marginBottom:8,border:`1px solid ${T.border}`}}>
                            <canvas ref={el=>{canvR.current[track.id]=el;}} width={400} height={28}
                              style={{width:'100%',height:'100%',display:'block',position:'absolute',inset:0}}/>
                            <canvas ref={el=>{liveCanvR.current[track.id]=el;}} width={400} height={28}
                              style={{width:'100%',height:'100%',display:'block',position:'absolute',inset:0,
                                opacity:isRec?1:0,transition:'opacity 0.4s'}}/>
                            {isPendingStop&&<div style={{position:'absolute',top:0,right:0,width:`${(1-prog)*100}%`,height:'100%',background:'rgba(0,206,201,0.06)',pointerEvents:'none'}}/>}
                            {isPendingStart&&<div style={{position:'absolute',top:0,left:0,width:`${prog*100}%`,height:'100%',background:'rgba(46,213,115,0.06)',pointerEvents:'none'}}/>}
                            {track.state==='empty'&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:T.muted,fontSize:8,letterSpacing:3}}>EMPTY</div>}
                          </div>

                          {/* Primary action buttons — large finger targets */}
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:5}}>
                            <button
                              disabled={!hasAudio}
                              onClick={()=>A.current.smartRecord(track.id)}
                              style={{
                                padding:'13px 6px',borderRadius:7,fontSize:11,fontWeight:700,
                                background:isRec?'rgba(255,77,77,0.15)':'rgba(255,77,77,0.06)',
                                border:`1px solid ${isRec?T.red:'rgba(255,77,77,0.3)'}`,
                                color:isRec?T.red:'rgba(255,77,77,0.7)',
                                touchAction:'manipulation',WebkitTapHighlightColor:'transparent',
                              }}>
                              {isRec?'■ STOP':'● REC'}
                            </button>
                            <button
                              disabled={!hasBuf||isRec}
                              onClick={()=>A.current.playStop(track.id)}
                              style={{
                                padding:'13px 6px',borderRadius:7,fontSize:11,fontWeight:700,
                                background:isPlay?`${track.color}15`:`${track.color}06`,
                                border:`1px solid ${isPlay?track.color:track.color+'44'}`,
                                color:isPlay?track.color:track.color+'99',
                                touchAction:'manipulation',WebkitTapHighlightColor:'transparent',
                              }}>
                              {isPendingStart?'▶…':isPlay?'■ STOP':'▶ PLAY'}
                            </button>
                          </div>

                          {/* Secondary buttons */}
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5}}>
                            <button
                              disabled={!hasBuf}
                              onClick={()=>A.current.overdub(track.id)}
                              style={{
                                padding:'10px 4px',borderRadius:7,fontSize:9,fontWeight:700,
                                background:isRec&&track.overdub?`${T.pink}15`:'transparent',
                                border:`1px solid ${isRec&&track.overdub?T.pink:'rgba(255,121,198,0.25)'}`,
                                color:isRec&&track.overdub?T.pink:'rgba(255,121,198,0.6)',
                                touchAction:'manipulation',WebkitTapHighlightColor:'transparent',
                              }}>
                              ⊕ OVR
                            </button>
                            <button
                              disabled={!hasBuf}
                              onClick={()=>A.current.mute(track.id)}
                              style={{
                                padding:'10px 4px',borderRadius:7,fontSize:9,fontWeight:700,
                                background:track.isMuted?'rgba(255,211,42,0.12)':'transparent',
                                border:`1px solid ${track.isMuted?'rgba(255,211,42,0.5)':'var(--border)'}`,
                                color:track.isMuted?'#ffd32a':T.dim,
                                touchAction:'manipulation',WebkitTapHighlightColor:'transparent',
                              }}>
                              {track.isMuted?'⊘':'⊙'}
                            </button>
                            <button
                              disabled={!hasBuf}
                              onClick={()=>A.current.clear(track.id)}
                              style={{
                                padding:'10px 4px',borderRadius:7,fontSize:9,fontWeight:700,
                                background:'transparent',
                                border:'1px solid rgba(255,77,77,0.15)',
                                color:'rgba(255,77,77,0.4)',
                                touchAction:'manipulation',WebkitTapHighlightColor:'transparent',
                              }}>
                              ✕ CLR
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ─ Master controls — big tap targets ─ */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                  <button onClick={()=>A.current.playAll()} disabled={!hasAudio}
                    style={{padding:'16px 8px',borderRadius:8,fontSize:10,letterSpacing:1,fontWeight:700,background:`${T.green}08`,border:`1px solid ${T.green}44`,color:T.green,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
                    ▶▶ PLAY ALL
                  </button>
                  <button onClick={()=>A.current.stopAll()} disabled={!hasAudio}
                    style={{padding:'16px 8px',borderRadius:8,fontSize:10,letterSpacing:1,fontWeight:700,background:`${T.teal}08`,border:`1px solid ${T.teal}44`,color:T.teal,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
                    ■■ STOP ALL
                  </button>
                  <button onClick={()=>A.current.clearAll()} disabled={!hasAudio}
                    style={{padding:'16px 8px',borderRadius:8,fontSize:10,letterSpacing:1,fontWeight:700,background:'rgba(255,77,77,0.06)',border:'1px solid rgba(255,77,77,0.25)',color:T.red,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
                    ✕✕ CLEAR ALL
                  </button>
                </div>

              </div>
            )}

            {/* ── TRACK GRID ── */}
            {layout==='grid'&&(
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:12}}>
                {tracks.map(track=>{
                  const prog=progresses[track.id]||0;
                  const isRec=track.state==='recording';
                  const isPlay=track.state==='playing';
                  const hasBuf=!!bufsR.current[track.id]||track.state!=='empty';
                  const pendingAction=pending[track.id];
                  const isPendingStart=pendingAction==='start';
                  const isPendingStop=pendingAction==='stop'||pendingAction==='clear';
                  const trackBind=getTrackBinding(track.id);
                  const boundKey=trackBind?.[0];
                  const settingsOpen=!!trackSettingsOpen[track.id];
                  const toggleSettings=()=>setTrackSettingsOpen(p=>({...p,[track.id]:!p[track.id]}));

                  // Build a summary of active non-default settings for the settings button badge
                  const activeSettings=[];
                  if(track.countIn>0)activeSettings.push(`${track.countIn}-bar count-in`);
                  if(track.autoRecBars>0)activeSettings.push(`auto-stop ${track.autoRecBars} bars`);
                  if(track.thresholdRec)activeSettings.push('threshold');
                  if(track.isReversed)activeSettings.push('reversed');
                  if(track.playMode!=='loop')activeSettings.push(track.playMode==='oneshot'?'one-shot':'ping-pong');
                  if((track.playSpeed??1)!==1)activeSettings.push(`${track.playSpeed}×`);
                  if(track.syncStopMode&&track.syncStopMode!=='loop-end')activeSettings.push(track.syncStopMode.replace('-',' '));
                  if(track.muteGroup)activeSettings.push(`group ${track.muteGroup}`);

                  return(
                    <div key={track.id}
                      draggable onDragStart={()=>{dragItem.current=track.id;}}
                      onDragOver={e=>{e.preventDefault();dragOverIt.current=track.id;setDragOver(track.id);}}
                      onDrop={handleDrop}
                      onDragLeave={()=>{if(dragOverIt.current===track.id){dragOverIt.current=null;setDragOver(null);}}}
                      style={{
                        background:isRec?'rgba(255,77,77,0.06)':isPlay?`${track.color}08`:T.card,
                        border:`1px solid ${isRec?'rgba(255,77,77,0.25)':isPlay?`${track.color}33`:isPendingStart?'rgba(46,213,115,0.3)':isPendingStop?'rgba(0,206,201,0.3)':'var(--border2)'}`,
                        borderTop:`3px solid ${isRec?T.red:track.color}`,
                        borderRadius:10,overflow:'hidden',
                        outline:dragOver===track.id?`2px solid ${track.color}44`:'none',
                        boxShadow:isPlay?`0 0 20px ${track.color}10`:isRec?'0 0 16px rgba(255,77,77,0.08)':'none',
                        transition:'box-shadow .3s,border-color .3s',
                      }}>

                      {/* ── Compact card body ── */}
                      <div style={{padding:'10px 12px'}}>

                        {/* Header row */}
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
                          <span style={{color:T.offwhite,cursor:'grab',fontSize:11,flexShrink:0}}>⠿</span>
                          <div style={{width:7,height:7,borderRadius:'50%',flexShrink:0,
                            background:isRec?T.red:isPlay?track.color:'var(--border)',
                            animation:isRec?'blink .7s infinite':'none',
                            boxShadow:isPlay?`0 0 5px ${track.color}`:isRec?'0 0 5px #ff4d4d':'none',
                          }}/>
                          <span style={{fontSize:13,color:T.offwhite,fontWeight:700,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:"'Audiowide',sans-serif",WebkitFontSmoothing:'antialiased'}}>{track.name}</span>
                          {track.isMuted&&<span style={{fontSize:8,color:'#ffd32a',background:'rgba(255,211,42,0.15)',border:'1px solid rgba(255,211,42,0.4)',borderRadius:3,padding:'2px 5px',flexShrink:0,letterSpacing:1,fontWeight:700}}>MUTED</span>}
                          {track.overdub&&isRec&&<span style={{fontSize:8,color:T.pink,background:`${T.pink}18`,border:`1px solid ${T.pink}55`,borderRadius:3,padding:'2px 5px',flexShrink:0,letterSpacing:1,fontWeight:700}}>OVR</span>}
                          {track.punchInEnabled&&!isRec&&track.state!=='empty'&&<span style={{fontSize:8,color:'#fd79a8',background:'rgba(253,121,168,0.12)',border:'1px solid rgba(253,121,168,0.4)',borderRadius:3,padding:'2px 5px',flexShrink:0,letterSpacing:1,fontWeight:700,animation:'pulse 1.2s infinite'}}>ARMED</span>}
                          {isPlay&&track.isReversed&&<span style={{fontSize:8,color:T.purple,background:`${T.purple}15`,border:`1px solid ${T.purple}44`,borderRadius:3,padding:'2px 5px',flexShrink:0,letterSpacing:1,fontWeight:700}}>REV</span>}
                          {overdubRedoBufsR.current[track.id]&&(isPlay||isRec)&&<span style={{fontSize:8,color:T.teal,background:`${T.teal}12`,border:`1px solid ${T.teal}44`,borderRadius:3,padding:'2px 5px',flexShrink:0,letterSpacing:1,fontWeight:700}}>REDO</span>}
                          {overdubUndoBufsR.current[track.id]&&!overdubRedoBufsR.current[track.id]&&(isPlay||isRec)&&<span style={{fontSize:8,color:'#a29bfe',background:'rgba(162,155,254,0.12)',border:'1px solid rgba(162,155,254,0.4)',borderRadius:3,padding:'2px 5px',flexShrink:0,letterSpacing:1,fontWeight:700}}>UNDO</span>}
                          {pendingAction&&(
                            <button onClick={()=>cancelPending(track.id)} style={{fontSize:8,color:pendingAction==='armed'?T.red:isPendingStart?T.green:T.teal,background:pendingAction==='armed'?'rgba(255,77,77,0.08)':isPendingStart?'rgba(57,255,20,0.08)':'rgba(0,206,201,0.08)',border:`1px solid ${pendingAction==='armed'?'rgba(255,77,77,0.4)':isPendingStart?'rgba(57,255,20,0.4)':'rgba(0,206,201,0.4)'}`,borderRadius:3,padding:'2px 6px',animation:'pulse .8s infinite',cursor:'pointer',flexShrink:0,letterSpacing:1,fontWeight:700}}>
                              {pendingAction==='armed'?'ARMED…':pendingAction==='start'?'STARTING…':pendingAction==='clear'?'CLR…':'STOP…'} ✕
                            </button>
                          )}
                          <span style={{fontSize:10,color:T.offwhite,fontWeight:400,flexShrink:0}}>{track.duration>0?`${track.duration}s`:isRec?'●':'—'}</span>
                        </div>

                        {/* Waveform */}
                        <div style={{position:'relative',height:32,background:darkMode?'var(--card3)':'#e8e8e8',borderRadius:4,overflow:'hidden',marginBottom:8,border:`1px solid ${T.border}`}}>
                          {/* Static waveform — painted on record finish, playhead swept by RAF */}
                          <canvas ref={el=>{canvR.current[track.id]=el;}} width={400} height={32}
                            style={{width:'100%',height:'100%',display:'block',position:'absolute',inset:0}}/>
                          {/* Live recording oscilloscope — shown only while recording */}
                          <canvas ref={el=>{liveCanvR.current[track.id]=el;}} width={400} height={32}
                            style={{width:'100%',height:'100%',display:'block',position:'absolute',inset:0,
                              opacity:isRec?1:0,transition:'opacity 0.4s'}}/>
                          {/* Pending overlays */}
                          {isPendingStop&&<div style={{position:'absolute',top:0,right:0,width:`${(1-prog)*100}%`,height:'100%',background:'rgba(0,206,201,0.06)',pointerEvents:'none'}}/>}
                          {isPendingStart&&<div style={{position:'absolute',top:0,left:0,width:`${prog*100}%`,height:'100%',background:'rgba(46,213,115,0.06)',pointerEvents:'none'}}/>}
                          {track.state==='empty'&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:T.muted,fontSize:9,letterSpacing:3,fontWeight:400}}>EMPTY</div>}
                          {isPendingStop&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:6,pointerEvents:'none'}}><span style={{fontSize:8,color:'rgba(0,206,201,0.7)',fontWeight:700}}>STOP AT END</span></div>}
                          {isPendingStart&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',paddingLeft:6,pointerEvents:'none'}}><span style={{fontSize:8,color:'rgba(46,213,115,0.7)',fontWeight:700}}>STARTING…</span></div>}
                          {activeSettings.length>0&&!isRec&&<div style={{position:'absolute',top:3,right:4,display:'flex',gap:2}}>
                            {activeSettings.slice(0,4).map((_,i)=>(
                              <div key={i} style={{width:3,height:3,borderRadius:'50%',background:track.color,opacity:0.6}}/>
                            ))}
                          </div>}
                        </div>

                        {/* Action buttons row */}
                        <div style={{display:'flex',gap:4,alignItems:'center'}}>
                          {[
                            {a:'smartRecord',l:isRec?'■ STOP':'● REC',ac:T.red,on:isRec,dis:!hasAudio,aria:isRec?'Stop recording':'Start recording'},
                            {a:'playStop',l:isPendingStart?'▶…':isPlay?'■ STOP':'▶ PLAY',ac:isPendingStart?T.teal:track.color,on:isPlay||isPendingStart,dis:!hasBuf||isRec,aria:isPlay?'Stop playback':'Play loop'},
                            {a:'overdub',l:isRec&&track.overdub?'■ OVR':'⊕ OVR',ac:T.pink,on:isRec&&track.overdub,dis:!hasBuf||!hasAudio,aria:'Toggle overdub'},
                            {a:'mute',l:track.isMuted?'⊘':'⊙',ac:'#ffd32a',on:track.isMuted,dis:!hasBuf,aria:track.isMuted?'Unmute track':'Mute track'},
                            {a:'clear',l:'✕',ac:T.muted,on:false,dis:!hasBuf,aria:'Clear track',destructive:true},
                          ].map(({a,l,ac,on,dis:d,aria,destructive})=>(
                            <button key={a} disabled={d}
                              aria-label={aria}
                              data-destructive={destructive||undefined}
                              className={destructive?'btn-destructive':''}
                              onClick={()=>A.current[a](track.id)} style={{
                              flex:a==='smartRecord'||a==='playStop'?1.5:1,
                              padding:'5px 4px',borderRadius:5,fontSize:10,letterSpacing:0,whiteSpace:'nowrap',
                              background:on?`${ac}14`:'transparent',
                              border:`1px solid ${on?ac:d?T.dim:T.border}`,
                              color:on?ac:d?T.dim:T.muted,
                              fontWeight:on?700:400,
                            }}>{l}</button>
                          ))}
                          {/* Settings toggle */}
                          <button onClick={toggleSettings}
                            aria-label={settingsOpen?'Close track settings':'Open track settings'}
                            aria-expanded={settingsOpen}
                            title={activeSettings.length>0?`Active: ${activeSettings.join(', ')}`:'Track settings'}
                            style={{
                              padding:'5px 7px',borderRadius:5,fontSize:11,
                              background:settingsOpen?`${track.color}14`:'transparent',
                              border:`1px solid ${settingsOpen?track.color+'44':activeSettings.length>0?track.color+'33':'var(--border)'}`,
                              color:settingsOpen?track.color:activeSettings.length>0?track.color:T.offwhite,fontWeight:settingsOpen?700:400,
                              position:'relative',
                            }}>
                            ⚙{activeSettings.length>0&&!settingsOpen&&<span style={{position:'absolute',top:2,right:2,width:4,height:4,borderRadius:'50%',background:track.color,display:'block'}}/>}
                          </button>
                          {/* Key binding chip */}
                          <button onClick={()=>setGestureModal({trackId:track.id,awaitingKey:false})}
                            aria-label={boundKey?`Edit key binding: ${boundKey}`:'Assign keyboard key'}
                            title={boundKey?`Bound to ${boundKey.toUpperCase()} — click to edit`:'Click to assign a keyboard key'}
                            style={{
                              padding:'5px 7px',borderRadius:5,
                              background:boundKey?`${track.color}10`:'transparent',
                              border:`1px solid ${boundKey?track.color+'44':'var(--border)'}`,
                              color:boundKey?track.color:T.muted,
                              fontSize:boundKey?12:10,fontWeight:700,
                            }}>
                            {boundKey?boundKey.toUpperCase():'⌨'}
                          </button>
                          {/* MIDI binding chip — maps to smartRecord (primary action) */}
                          <MidiChip
                            binding={{type:'track',trackId:track.id,tap:'smartRecord',doubleTap:'none',hold:'none',__learnId:`track_${track.id}`}}
                            matcher={v=>v.type==='track'&&v.trackId===track.id}
                          />
                        </div>

                        {/* ── Input vol + Playback vol strip ── */}
                        {(()=>{
                          const tfx=trackFX.find(f=>f.id===track.id);
                          if(!tfx)return null;
                          return(
                            <div style={{display:'flex',gap:4,alignItems:'center',marginTop:6,padding:'4px 6px',background:darkMode?'var(--card2)':'#f5f5f5',borderRadius:6,border:`1px solid ${T.border}`,minWidth:0,overflow:'hidden'}}>
                              <span style={{fontSize:7,color:T.muted,letterSpacing:1,flexShrink:0}}>IN</span>
                              <input type="range" min={0} max={2} step={0.05} value={tfx.inputGain??1}
                                onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()}
                                onChange={e=>updFX(track.id,'inputGain',parseFloat(e.target.value))}
                                style={{flex:'1 1 40px',minWidth:0,accentColor:T.blue,height:14,cursor:'ew-resize'}}/>
                              <span style={{fontSize:8,color:T.blue,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{Math.round((tfx.inputGain??1)*100)}%</span>
                              <div style={{width:1,height:16,background:T.border,flexShrink:0,margin:'0 2px'}}/>
                              <span style={{fontSize:7,color:T.muted,letterSpacing:1,flexShrink:0}}>OUT</span>
                              <input type="range" min={0} max={1.5} step={0.05} value={tfx.volume}
                                onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()}
                                onChange={e=>updFX(track.id,'volume',parseFloat(e.target.value))}
                                style={{flex:'1 1 40px',minWidth:0,accentColor:track.color,height:14,cursor:'ew-resize'}}/>
                              <span style={{fontSize:8,color:track.color,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{Math.round(tfx.volume/1.5*100)}%</span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* ── Settings Drawer ── */}
                      {settingsOpen&&(
                        <div style={{borderTop:`1px solid var(--border2)`,background:'var(--card)',padding:'12px 14px',animation:'fadeUp 0.15s ease'}}>

                          {/* RECORDING section */}
                          <div className='drawer-section'>RECORDING</div>

                          {/* Count-In */}
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                            <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Count-In</span>
                            <div style={{display:'flex',gap:4}}>
                              {[{v:0,l:'Off'},{v:1,l:'1 Bar'},{v:2,l:'2 Bars'}].map(({v,l})=>(
                                <button key={v} onClick={()=>upd(track.id,{countIn:v})}
                                  style={{padding:'4px 10px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:track.countIn===v?700:400,letterSpacing:0,
                                    background:track.countIn===v?'rgba(30,144,255,0.15)':'transparent',
                                    border:`1px solid ${track.countIn===v?'rgba(30,144,255,0.5)':'var(--border)'}`,
                                    color:track.countIn===v?T.blue:T.white,
                                  }}>{l}</button>
                              ))}
                            </div>
                          </div>

                          {/* Auto-Record */}
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                            <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Auto-Record</span>
                            <div style={{display:'flex',gap:4}}>
                              {[{v:0,l:'Off'},{v:1,l:'1 Bar'},{v:2,l:'2 Bars'},{v:4,l:'4 Bars'},{v:8,l:'8 Bars'}].map(({v,l})=>(
                                <button key={v} onClick={()=>upd(track.id,{autoRecBars:v})}
                                  style={{
                                    padding:'4px 8px',borderRadius:4,
                                    fontSize:11,fontFamily:"'DM Mono',monospace",
                                    fontWeight:track.autoRecBars===v?700:400,
                                    letterSpacing:0,
                                    background:track.autoRecBars===v&&v>0?'rgba(46,213,115,0.12)':'transparent',
                                    border:`1px solid ${track.autoRecBars===v&&v>0?'rgba(46,213,115,0.45)':'var(--border)'}`,
                                    color:track.autoRecBars===v&&v>0?T.green:T.white,
                                  }}>{l}</button>
                              ))}
                            </div>
                          </div>

                          {/* Threshold Recording */}
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:track.thresholdRec?4:8}}>
                            <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Threshold Recording</span>
                            <button onClick={()=>upd(track.id,t=>({thresholdRec:!t.thresholdRec}))}
                              style={{padding:'4px 12px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:track.thresholdRec?700:400,letterSpacing:0,
                                background:track.thresholdRec?'rgba(0,206,201,0.12)':'transparent',
                                border:`1px solid ${track.thresholdRec?'rgba(0,206,201,0.45)':'var(--border)'}`,
                                color:track.thresholdRec?T.teal:T.white,
                              }}>{track.thresholdRec?'On':'Off'}</button>
                          </div>
                          {track.thresholdRec&&(
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,paddingLeft:8}}>
                              <span style={{fontSize:10,color:T.muted,flexShrink:0}}>Level</span>
                              {/* Live input meter */}
                              <div style={{position:'relative',flex:1,height:6,borderRadius:3,background:'var(--card2)',border:`1px solid var(--border2)`,overflow:'hidden'}}>
                                <div style={{position:'absolute',left:0,top:0,bottom:0,borderRadius:3,transition:'width 0.04s linear',
                                  width:`${inputLevel*100}%`,
                                  background:inputLevel>(track.thresholdLevel??0.05)*4?T.amber:T.green,
                                }}/>
                                {/* Red threshold marker */}
                                <div style={{position:'absolute',top:0,bottom:0,width:2,background:T.red,
                                  left:`${Math.min(98,(track.thresholdLevel??0.05)*400)}%`,
                                }}/>
                              </div>
                              <input type="range" min={0.01} max={0.5} step={0.005}
                                value={track.thresholdLevel??0.05}
                                onChange={e=>upd(track.id,{thresholdLevel:parseFloat(e.target.value)})}
                                style={{flex:1,accentColor:T.red}}
                              />
                              <span style={{fontSize:10,color:T.red,minWidth:28,textAlign:'right',fontFamily:"'DM Mono',monospace"}}>
                                {((track.thresholdLevel??0.05)*100).toFixed(0)}%
                              </span>
                            </div>
                          )}

                          {/* After Recording */}
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                            <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>After Recording</span>
                            <div style={{display:'flex',gap:4}}>
                              {[{v:'play',l:'Play Loop'},{v:'overdub',l:'Start Overdub'}].map(({v,l})=>(
                                <button key={v} onClick={()=>upd(track.id,{stopRecMode:v})}
                                  style={{padding:'4px 10px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:track.stopRecMode===v?700:400,letterSpacing:0,
                                    background:track.stopRecMode===v?`${track.color}12`:'transparent',
                                    border:`1px solid ${track.stopRecMode===v?track.color+'44':'var(--border)'}`,
                                    color:track.stopRecMode===v?track.color:T.offwhite,
                                  }}>{l}</button>
                              ))}
                            </div>
                          </div>

                          <div style={{borderTop:'1px solid var(--border2)',margin:'12px 0'}}/>

                          {/* PLAYBACK section */}
                          <div className='drawer-section'>PLAYBACK</div>

                          {/* Play Mode */}
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                            <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Play Mode</span>
                            <div style={{display:'flex',gap:4}}>
                              {[{v:'loop',l:'Loop'},{v:'oneshot',l:'One-Shot'},{v:'pingpong',l:'Ping-Pong'}].map(({v,l})=>(
                                <button key={v} onClick={()=>upd(track.id,{playMode:v})}
                                  style={{padding:'4px 10px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:track.playMode===v?700:400,letterSpacing:0,
                                    background:track.playMode===v?`${track.color}12`:'transparent',
                                    border:`1px solid ${track.playMode===v?track.color+'44':'var(--border)'}`,
                                    color:track.playMode===v?track.color:T.offwhite,
                                  }}>{l}</button>
                              ))}
                            </div>
                          </div>

                          {/* Speed */}
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                            <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Speed</span>
                            <div style={{display:'flex',gap:4}}>
                              {[{v:0.25,l:'¼×'},{v:0.5,l:'½×'},{v:1,l:'1×'},{v:2,l:'2×'},{v:4,l:'4×'}].map(({v,l})=>(
                                <button key={v} onClick={()=>{upd(track.id,{playSpeed:v});speedBufsR.current[track.id]=null;TR.current=TR.current.map(t=>t.id===track.id?{...t,playSpeed:v}:t);if(isPlay){stopPlay(track.id);startPlay(track.id);}}}
                                  style={{padding:'4px 8px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:(track.playSpeed??1)===v&&v!==1?700:400,letterSpacing:0,
                                    background:(track.playSpeed??1)===v&&v!==1?`${track.color}12`:'transparent',
                                    border:`1px solid ${(track.playSpeed??1)===v&&v!==1?track.color+'44':'var(--border)'}`,
                                    color:(track.playSpeed??1)===v&&v!==1?track.color:T.offwhite,
                                  }}>{l}</button>
                              ))}
                            </div>
                          </div>

                          {/* Reverse + Restart inline */}
                          <div style={{display:'flex',gap:8,marginBottom:8}}>
                            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                              <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Reverse</span>
                              <button onClick={()=>A.current.reverse(track.id)} disabled={!hasBuf}
                                style={{padding:'4px 12px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:track.isReversed?700:400,letterSpacing:0,
                                  background:track.isReversed?'rgba(162,155,254,0.12)':'transparent',
                                  border:`1px solid ${track.isReversed?T.purple+'44':'var(--border)'}`,
                                  color:track.isReversed?T.purple:T.white,
                                }}>{track.isReversed?'On':'Off'}</button>
                            </div>
                            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                              <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Restart Loop</span>
                              <button onClick={()=>A.current.restart(track.id)} disabled={!isPlay}
                                style={{padding:'4px 12px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:400,letterSpacing:0,
                                  background:'transparent',
                                  border:`1px solid ${isPlay?'var(--border)':'var(--border3)'}`,
                                  color:isPlay?T.white:T.dim,
                                }}>⟳ Now</button>
                            </div>
                          </div>

                          <div style={{borderTop:'1px solid var(--border2)',margin:'12px 0'}}/>

                          {/* WHEN STOPPING section */}
                          <div className='drawer-section'>WHEN STOPPING</div>
                          <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
                            {[
                              {v:'immediate',l:'Immediately'},
                              {v:'loop-end',l:'At Loop End'},
                              {v:'bar-end',l:'At Bar End'},
                              {v:'phrase-end',l:'At Phrase End'},
                              {v:'fade',l:'Fade Out'},
                            ].map(({v,l})=>(
                              <button key={v} onClick={()=>upd(track.id,{syncStopMode:v,syncStop:v!=='immediate'})}
                                style={{padding:'5px 10px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:(track.syncStopMode??'loop-end')===v?700:400,letterSpacing:0,
                                  background:(track.syncStopMode??'loop-end')===v?`${track.color}12`:'transparent',
                                  border:`1px solid ${(track.syncStopMode??'loop-end')===v?track.color+'44':'var(--border)'}`,
                                  color:(track.syncStopMode??'loop-end')===v?track.color:T.offwhite,
                                }}>{l}</button>
                            ))}
                          </div>

                          <div style={{borderTop:'1px solid var(--border2)',margin:'12px 0'}}/>

                          {/* GROUPING section */}
                          <div className='drawer-section'>GROUPING &amp; SYNC</div>

                          {/* Mute Group */}
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                            <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Mute Group</span>
                            <div style={{display:'flex',gap:4}}>
                              {[{v:null,l:'None'},{v:'A',l:'A'},{v:'B',l:'B'},{v:'C',l:'C'},{v:'D',l:'D'}].map(({v,l})=>(
                                <button key={l} onClick={()=>upd(track.id,{muteGroup:v})}
                                  style={{padding:'4px 8px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:track.muteGroup===v&&v?700:400,letterSpacing:0,
                                    background:track.muteGroup===v&&v?`${track.color}12`:'transparent',
                                    border:`1px solid ${track.muteGroup===v&&v?track.color+'44':'var(--border)'}`,
                                    color:track.muteGroup===v&&v?track.color:T.offwhite,
                                  }}>{l}</button>
                              ))}
                            </div>
                          </div>

                          {/* Sync Start + Sync Stop */}
                          <div style={{display:'flex',gap:8}}>
                            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                              <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Sync Start</span>
                              <button onClick={()=>upd(track.id,t=>({syncStart:!t.syncStart}))}
                                style={{padding:'4px 12px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:track.syncStart?700:400,letterSpacing:0,
                                  background:track.syncStart?'rgba(46,213,115,0.12)':'transparent',
                                  border:`1px solid ${track.syncStart?'rgba(46,213,115,0.45)':'var(--border)'}`,
                                  color:track.syncStart?T.green:T.white,
                                }}>{track.syncStart?'On':'Off'}</button>
                            </div>
                            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                              <span style={{fontSize:11,color:T.offwhite,fontWeight:400}}>Punch-In</span>
                              <button onClick={()=>A.current.punchIn&&A.current.punchIn(track.id)} disabled={!hasBuf||!hasAudio}
                                style={{padding:'4px 12px',borderRadius:4,fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:track.punchInEnabled?700:400,letterSpacing:0,
                                  background:track.punchInEnabled?'rgba(255,77,77,0.12)':'transparent',
                                  border:`1px solid ${track.punchInEnabled?'rgba(255,77,77,0.4)':'var(--border)'}`,
                                  color:track.punchInEnabled?T.red:T.white,
                                }}>{track.punchInEnabled?'● ARMED':'✎ Punch'}</button>
                            {track.punchInEnabled&&(
                              <div style={{marginTop:6,padding:'8px 10px',background:'rgba(255,77,77,0.05)',border:'1px solid rgba(255,77,77,0.2)',borderRadius:6}}>
                                <div style={{fontSize:10,color:T.red,fontFamily:"'DM Mono',monospace",marginBottom:6,fontWeight:700}}>
                                  Region: {Math.round((track.punchInStart??0.25)*100)}% → {Math.round((track.punchInEnd??0.75)*100)}%
                                </div>
                                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                                  <span style={{fontSize:10,color:T.muted,fontFamily:"'DM Mono',monospace",width:32}}>Start</span>
                                  <input type="range" min={0} max={0.9} step={0.05}
                                    value={track.punchInStart??0.25}
                                    onChange={e=>upd(track.id,{punchInStart:Math.min(parseFloat(e.target.value),(track.punchInEnd??0.75)-0.1)})}
                                    style={{flex:1,accentColor:T.red}}/>
                                </div>
                                <div style={{display:'flex',alignItems:'center',gap:6}}>
                                  <span style={{fontSize:10,color:T.muted,fontFamily:"'DM Mono',monospace",width:32}}>End</span>
                                  <input type="range" min={0.1} max={1} step={0.05}
                                    value={track.punchInEnd??0.75}
                                    onChange={e=>upd(track.id,{punchInEnd:Math.max(parseFloat(e.target.value),(track.punchInStart??0.25)+0.1)})}
                                    style={{flex:1,accentColor:T.red}}/>
                                </div>
                              </div>
                            )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Keyboard compact track strip (KB VIEW) ── */}
            {layout==='keyboard'&&(
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:7,marginBottom:12}}>
                {tracks.map(track=>{
                  const isRec=track.state==='recording',isPlay=track.state==='playing';
                  const prog=progresses[track.id]||0;
                  const pendingAction=pending[track.id];
                  return(
                    <div key={track.id} style={{background:'var(--card)',border:`1px solid ${track.color}22`,borderTop:`2px solid ${track.color}`,borderRadius:8,padding:'8px 10px',display:'flex',alignItems:'center',gap:8}}>
                      <div style={{position:'relative',width:34,height:34,flexShrink:0}}>
                        <svg width={34} height={34} style={{transform:'rotate(-90deg)'}}>
                          <circle cx={17} cy={17} r={13} fill="none" stroke="#0e0e1e" strokeWidth={3}/>
                          {isPlay&&<circle cx={17} cy={17} r={13} fill="none" stroke={track.color} strokeWidth={3} strokeDasharray={`${prog*82} 82`} strokeLinecap="round"/>}
                        </svg>
                        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:isRec?T.red:isPlay?track.color:'#1e1e2e'}}>
                          {isRec?'●':isPlay?'▶':'○'}
                        </div>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,color:isPlay?track.color:isRec?T.red:T.soft,letterSpacing:1,marginBottom:2,fontWeight:700}}>{track.name}</div>
                        <div style={{fontSize:10,color:T.muted}}>{track.state.toUpperCase()}{track.duration>0?` · ${track.duration}s`:''}</div>
                      </div>
                      <div style={{display:'flex',gap:3}}>
                        {[
                          {a:'smartRecord',l:isRec?'■':'●',ac:T.red,on:isRec},
                          {a:'playStop',l:pendingAction==='start'?'…':isPlay?'■':'▶',ac:pendingAction==='start'?T.teal:track.color,on:isPlay||pendingAction==='start',dis:track.state==='empty'||isRec},
                          {a:'mute',l:'⊙',ac:'#ffd32a',on:track.isMuted,dis:track.state==='empty'},
                        ].map(({a,l,ac,on,dis})=>(
                          <button key={a} disabled={dis||!hasAudio} onClick={()=>A.current[a](track.id)}
                            style={{width:24,height:24,background:on?`${ac}18`:'transparent',border:`1px solid ${on?ac:'var(--border)'}`,borderRadius:4,color:on?ac:T.faint,fontSize:10,padding:0}}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Master Bar ── */}
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8,flexWrap:'wrap'}}>
              <span style={{fontSize:10,color:T.muted,letterSpacing:3,marginRight:4,fontWeight:700}}>MASTER</span>
              {[
                {a:'playAll',l:'▶▶ PLAY ALL',c:T.green},
                {a:'stopAll',l:'■■ STOP ALL',c:T.red},
                {a:'clearAll',l:'✕✕ CLEAR ALL',c:T.faint},
              ].map(({a,l,c})=>{
                const existingEntry=Object.entries(bindings).find(([,v])=>v.type==='global'&&(v.tap===a||v.doubleTap===a||v.hold===a));
                const bKey=existingEntry?.[0];
                const bVal=existingEntry?.[1];
                const gesture=bVal?.tap===a?'TAP':bVal?.doubleTap===a?'DBL':bVal?.hold===a?'HOLD':null;
                return(
                  <div key={a} style={{display:'flex',flexDirection:'column',gap:3,alignItems:'center'}}>
                    <button onClick={()=>A.current[a]()} style={{background:'transparent',border:`1px solid ${c}44`,color:c,borderRadius:5,padding:'6px 12px',fontSize:10,letterSpacing:2}}>{l}</button>
                    <div style={{display:'flex',gap:3,alignItems:'center'}}>
                      <button onClick={()=>setKeyFlowModal({...KFM_BLANK,key:bKey||null,step:'gesture',type:'global',globalAction:a,simpleMode:true})}
                        style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:3,minWidth:20,height:16,padding:'0 5px',
                          background:bKey?'rgba(162,155,254,0.1)':'transparent',
                          border:`1px solid ${bKey?'rgba(162,155,254,0.4)':'var(--border)'}`,
                          borderRadius:2,cursor:'pointer',color:bKey?T.purple:'var(--text40)',
                          fontFamily:'DM Mono,monospace',fontSize:8,flexShrink:0}}>
                        <span style={{fontSize:9}}>⌨</span>
                        {bKey?<><span style={{fontWeight:700}}>{bKey.toUpperCase()}</span><span style={{opacity:0.6}}>·{gesture}</span></>:'+'}
                      </button>
                      <MidiChip
                        binding={{type:'global',tap:a,doubleTap:'none',hold:'none',__learnId:`master_${a}`}}
                        matcher={v=>v.type==='global'&&(v.tap===a||v.doubleTap===a||v.hold===a)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            KEYS TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab==='keys'&&(
          <div style={{animation:'fadeUp 0.2s ease',display:'flex',flexDirection:'column',gap:20}}>

            {/* Keyboard Map */}
            {sec('Keyboard Map')}
            <div style={{background:darkMode?'var(--card3)':'#e8e8e8',border:`1px solid ${T.border}`,borderRadius:12,padding:'16px',overflowX:'auto',marginBottom:4}}>
              <div style={{display:'flex',flexDirection:'column',gap:4,minWidth:640}}>
                {[
                  ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
                  ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
                  ['CapsLock','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
                  ['ShiftLeft','z','x','c','v','b','n','m',',','.','/','ShiftRight'],
                  ['Space'],
                ].map((row,ri)=>{
                  const KEY_LABEL={Backspace:'⌫',Tab:'TAB',CapsLock:'CAPS',Enter:'↵',ShiftLeft:'SHIFT',ShiftRight:'SHIFT','\\':'\\','`':'`',Space:'SPACE'};
                  const KEY_FLEX={Backspace:1.8,Tab:1.4,CapsLock:1.7,Enter:2.0,ShiftLeft:2.2,ShiftRight:2.2,Space:6};
                  return(
                    <div key={ri} style={{display:'flex',gap:3,paddingLeft:ri===1?8:ri===2?14:ri===3?20:0}}>
                      {row.map(k=>{
                        const lk=k.length===1?k.toLowerCase():k==='Space'?'Space':k;
                        const b=bindings[lk];
                        const fxb=fxBindings[lk]?.type==='fxParam'?fxBindings[lk]:null;
                        const isTrack=b?.type==='track';
                        const isGlobal=b?.type==='global';
                        const isMacro=b?.type==='macro';
                        const isFX=!!fxb;
                        const track=isTrack?tracks.find(t=>t.id===b.trackId):null;
                        const color=isTrack?track?.color:isGlobal?T.purple:isMacro?'#ffd32a':isFX?T.teal:null;
                        // Gesture slot states
                        const tapMapped=b?.tap&&b.tap!=='none';
                        const dblMapped=b?.doubleTap&&b.doubleTap!=='none';
                        const holdMapped=b?.hold&&b.hold!=='none';
                        const anyMapped=tapMapped||dblMapped||holdMapped||isFX;
                        return(
                          <div key={k}
                            onClick={()=>setKeyFlowModal({...KFM_BLANK,key:lk,step:'gesture'})}
                            style={{
                              flex:KEY_FLEX[k]||1,minWidth:k==='Space'?120:36,
                              height:anyMapped?72:46,
                              background:color?`${color}12`:'var(--inset)',
                              border:`1px solid ${color?color+'44':'var(--border2)'}`,
                              borderBottom:`${anyMapped?3:1}px solid ${color?color+'66':'#141428'}`,
                              borderRadius:5,padding:'4px 4px 3px',cursor:'pointer',
                              position:'relative',overflow:'hidden',
                              display:'flex',flexDirection:'column',justifyContent:'space-between',
                              transition:'border-color .15s,background .15s',
                            }}>
                            <div style={{fontSize:k.length>1?7:10,color:anyMapped?T.white:T.faint,fontWeight:700,lineHeight:1}}>{KEY_LABEL[k]||k.toUpperCase()}</div>
                            {anyMapped&&(
                              <div style={{display:'flex',gap:2,marginTop:3}}>
                                {[
                                  {mapped:tapMapped,label:'T',color:'#2ed573',action:b?.tap},
                                  {mapped:dblMapped,label:'D',color:'#ff9f43',action:b?.doubleTap},
                                  {mapped:holdMapped,label:'H',color:'#ff4d4d',action:b?.hold},
                                ].map(({mapped,label,color:gc,action})=>{
                                  const ACT_SHORT={smartRecord:'REC',playStop:'▶■',overdub:'OVR',overdubUndoOrErase:'UNDO',mute:'MUTE',solo:'SOLO',clear:'CLR',restart:'RST',reverse:'REV',toggleEQ:'EQ',toggleComp:'CMP',toggleReverb:'VERB',toggleDelay:'DLY',playAll:'▶▶',stopAll:'■■',clearAll:'✕✕',tapTempo:'TAP',exportMix:'EXP',none:'—'};
                                  return(
                                    <div key={label} style={{
                                      borderRadius:2,fontSize:6,fontWeight:700,
                                      display:'flex',flexDirection:'column',alignItems:'center',
                                      background:mapped?`${gc}20`:'transparent',
                                      border:`1px solid ${mapped?gc+'66':'var(--border)'}`,
                                      color:mapped?gc:'var(--text20)',
                                      animation:!mapped&&anyMapped?'pulse 2s infinite':'none',
                                      padding:'1px 3px',minWidth:14,
                                    }}>
                                      <span>{label}</span>
                                      {mapped&&<span style={{fontSize:5,opacity:0.8,letterSpacing:0}}>{ACT_SHORT[action]||action?.slice(0,3).toUpperCase()||'?'}</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {anyMapped&&(
                              <div style={{fontSize:7,color:color||T.white,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',lineHeight:1.2}}>
                                {isTrack?track?.name:isGlobal?'GLOBAL':isMacro?`⚡${(()=>{const macro=macros.find(m=>m.id===b?.macroId);return macro?.name||'MACRO';})()}`:isFX?'FX':''}
                              </div>
                            )}
                            {!anyMapped&&<div style={{fontSize:6,color:'var(--border2)',textAlign:'center',marginTop:'auto'}}>+</div>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div style={{display:'flex',gap:16,marginTop:12,flexWrap:'wrap'}}>
                {[
                  [COLORS[0],'Track Key — loop control'],
                  [T.purple,'Global Key — master action (tap/dbl/hold)'],
                  ['#ffd32a','Macro Key — multi-track command'],
                  [T.teal,'FX Key — effects parameter'],
                ].map(([c,l])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:6,fontSize:10,color:T.muted}}>
                    <div style={{width:10,height:10,borderRadius:2,background:c+'44',border:`1px solid ${c}66`}}/>
                    {l}
                  </div>
                ))}
                <div style={{fontSize:9,color:T.faint,letterSpacing:1,marginTop:2,width:'100%'}}>Click any key to assign or edit its binding</div>
              </div>
            </div>

            {/* Track Gesture Bindings */}
            {sec('Track Gesture Bindings')}
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {tracks.map(track=>{
                const tb=getTrackBinding(track.id);
                const bk=tb?.[0];
                const g=tb?.[1]||{};
                const ACT={smartRecord:'SMART REC',record:'RECORD',playStop:'PLAY/STOP',overdub:'OVERDUB',mute:'MUTE',clear:'CLEAR',toggleEQ:'EQ',toggleComp:'COMP',toggleReverb:'REVERB',toggleDelay:'DELAY',none:'—'};
                return(
                  <div key={track.id} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'var(--card)',border:`1px solid var(--border2)`,borderLeft:`3px solid ${track.color}`,borderRadius:8}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:track.color,boxShadow:`0 0 6px ${track.color}`,flexShrink:0}}/>
                    <span style={{fontSize:12,color:T.offwhite,fontWeight:700,minWidth:60}}>{track.name}</span>
                    <div style={{flex:1,display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                      {bk?(
                        <>
                          <div style={{background:`${track.color}18`,border:`1px solid ${track.color}44`,borderRadius:5,padding:'3px 8px',fontSize:12,color:track.color,fontWeight:700,minWidth:28,textAlign:'center'}}>{bk.toUpperCase()}</div>
                          {[['↑ TAP',g.tap],['↑↑ DBL',g.doubleTap],['⊙ HOLD',g.hold]].map(([lbl,ac])=>(
                            <div key={lbl} style={{display:'flex',alignItems:'center',gap:4}}>
                              <span style={{fontSize:9,color:T.muted}}>{lbl}</span>
                              <span style={{fontSize:10,color:T.soft,background:'var(--border3)',border:'1px solid var(--border2)',borderRadius:3,padding:'2px 6px'}}>{ACT[ac]||ac||'—'}</span>
                            </div>
                          ))}
                        </>
                      ):(
                        <span style={{fontSize:10,color:T.faint,letterSpacing:1}}>No key assigned</span>
                      )}
                    </div>
                    <button onClick={()=>setGestureModal({trackId:track.id,awaitingKey:false})}
                      style={{background:'transparent',border:`1px solid var(--border)`,color:T.soft,borderRadius:5,padding:'5px 12px',fontSize:10,letterSpacing:1}}>
                      {bk?'EDIT':'ASSIGN KEY'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Global Keys */}
            {sec('Global Keys')}
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {[
                {a:'tapTempo',l:'TAP TEMPO',desc:'Set BPM by feel'},
                {a:'playAll',l:'PLAY ALL',desc:'Start all recorded tracks'},
                {a:'stopAll',l:'STOP ALL',desc:'Stop all playing tracks'},
                {a:'clearAll',l:'CLEAR ALL',desc:'Erase all tracks'},
                {a:'exportMix',l:'EXPORT MIX',desc:'Render full mix to WAV'},
                {a:'masterFadeOut',l:'MASTER FADE OUT',desc:'Fade out all tracks'},
                {a:'masterFadeIn',l:'MASTER FADE IN',desc:'Fade in all tracks'},
                {a:'bpmDouble',l:'BPM × 2',desc:'Double the current BPM'},
                {a:'bpmHalf',l:'BPM ÷ 2',desc:'Halve the current BPM'},
              ].map(({a,l,desc})=>{
                const existingEntry=Object.entries(bindings).find(([,v])=>v.type==='global'&&(v.tap===a||v.doubleTap===a||v.hold===a));
                const bKey=existingEntry?.[0];
                const bVal=existingEntry?.[1];
                const tapMapped=bVal?.tap===a;
                const dblMapped=bVal?.doubleTap===a;
                const holdMapped=bVal?.hold===a;
                const gesture=tapMapped?'TAP':dblMapped?'DBL':holdMapped?'HOLD':null;
                return(
                  <div key={a} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'var(--card)',border:'1px solid var(--border2)',borderRadius:8}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,color:T.offwhite,fontWeight:700,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:10,color:T.muted}}>{desc}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <div style={{fontSize:12,color:bKey?T.purple:'#222240',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${bKey?'rgba(162,155,254,0.4)':'var(--border2)'}`,borderRadius:5,padding:'3px 8px',minWidth:28,textAlign:'center',fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                        {bKey?<>{bKey.toUpperCase()}<span style={{fontSize:8,opacity:0.6,marginLeft:3}}>·{gesture}</span></>:'—'}
                      </div>
                      {[['T',tapMapped,'#2ed573'],['D',dblMapped,'#ff9f43'],['H',holdMapped,'#ff4d4d']].map(([lbl,mapped,gc])=>(
                        <div key={lbl} style={{width:16,height:16,borderRadius:3,fontSize:7,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',background:mapped?`${gc}20`:'transparent',border:`1px solid ${mapped?gc+'66':'var(--border)'}`,color:mapped?gc:'var(--text20)',animation:bKey&&!mapped?'pulse 2s infinite':'none'}}>{lbl}</div>
                      ))}
                      <button onClick={()=>setKeyFlowModal({...KFM_BLANK,key:bKey||null,step:'gesture',type:'global',globalAction:a,simpleMode:true})}
                        style={{background:bKey?'rgba(162,155,254,0.08)':'transparent',border:`1px solid ${bKey?'rgba(162,155,254,0.3)':'var(--border)'}`,color:bKey?T.purple:T.muted,borderRadius:5,padding:'4px 10px',fontSize:10,flexShrink:0}}>
                        ⌨ {bKey?'EDIT':'ASSIGN'}
                      </button>
                      <MidiChip
                        binding={{type:'global',tap:a,doubleTap:'none',hold:'none',__learnId:`global_${a}`}}
                        matcher={v=>v.type==='global'&&(v.tap===a||v.doubleTap===a||v.hold===a)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Global Settings — moved to MASTER tab */}
            <div style={{padding:'10px 14px',background:'rgba(162,155,254,0.06)',border:'1px solid rgba(162,155,254,0.2)',borderRadius:8}}>
              <span style={{fontSize:11,color:T.purple}}>Global track settings (sync, count-in, play mode, etc.) have moved to the </span>
              <button onClick={()=>setActiveTab('master')} style={{background:'transparent',border:'none',color:T.purple,fontSize:11,fontWeight:700,padding:0,cursor:'pointer',textDecoration:'underline'}}>SETTINGS tab →</button>
            </div>

            {/* Macros */}
            {sec('Macros')}
            {(()=>{
              const MACRO_COMMANDS=[
                {v:'groupPlay',l:'▶ Group Play'},{v:'groupStop',l:'■ Group Stop'},
                {v:'groupToggleMute',l:'⊙ Group Toggle Mute'},{v:'groupMute',l:'⊙ Group Mute'},
                {v:'groupUnmute',l:'⊘ Group Unmute'},{v:'groupClear',l:'✕ Group Clear'},
                {v:'groupToggleReverb',l:'~ Group Toggle Reverb'},{v:'groupToggleDelay',l:'⏺ Group Toggle Delay'},
                {v:'groupToggleEQ',l:'EQ Group Toggle EQ'},{v:'groupToggleComp',l:'⊓ Group Toggle Comp'},
                {v:'groupToggleReverse',l:'⟵ Group Toggle Reverse'},{v:'groupSetPlayMode',l:'∞ Group Set Play Mode'},
                {v:'groupSetSpeed',l:'SPD Group Set Speed'},{v:'groupRestartLoops',l:'⟳ Group Restart'},
                {v:'groupFadeOut',l:'↘ Group Fade Out'},{v:'groupFadeIn',l:'↗ Group Fade In'},
                {v:'soloTrack',l:'◎ Solo Track'},
                {v:'fullDrop',l:'⬛ Full Drop'},{v:'fullBring',l:'⬛ Full Bring'},{v:'unsoloAll',l:'⊙ Unsolo All'},
                {v:'stopAllMute',l:'■⊙ Stop+Mute All'},{v:'playFromTop',l:'⟳ Play From Top'},
                {v:'bpmDouble',l:'×2 BPM Double'},{v:'bpmHalf',l:'÷2 BPM Half'},{v:'bpmSet',l:'= BPM Set'},
                {v:'masterFadeOut',l:'↘ Master Fade Out'},{v:'masterFadeIn',l:'↗ Master Fade In'},
                {v:'toggleReverbAll',l:'~ Toggle Reverb All'},{v:'toggleDelayAll',l:'⏺ Toggle Delay All'},
              ];
              const describeCmd=(macro)=>{
                if(!macro)return'';
                const{command,params}=macro;
                if(['groupPlay','groupStop','groupMute','groupUnmute','groupClear'].includes(command)){
                  return`Tracks: ${(params.trackIds||[]).map(i=>`L${i+1}`).join(', ')||'none'}`;
                }
                if(command==='soloTrack')return`Solo: Loop ${(params.trackId||0)+1}`;
                if(command==='bpmSet')return`BPM → ${params.value||120}`;
                if(command==='masterFadeOut')return`${params.duration||4}s fade`;
                if(command==='masterFadeIn')return`${params.duration||2}s fade`;
                return '';
              };
              return(
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <div style={{display:'flex',justifyContent:'flex-end'}}>
                    <button onClick={()=>setMacroModal({isNew:true,macro:{id:`m${Date.now()}`,name:'New Macro',command:'groupStop',params:{trackIds:[0,1,2,3]}}})}
                      style={{background:'rgba(255,211,42,0.08)',border:'1px solid rgba(255,211,42,0.3)',color:'#ffd32a',borderRadius:6,padding:'7px 14px',fontSize:11,letterSpacing:2}}>+ NEW MACRO</button>
                  </div>
                  {macros.length===0&&(
                    <div style={{textAlign:'center',padding:'24px',color:T.faint,fontSize:11,letterSpacing:1,border:'1px dashed #1e1e30',borderRadius:8}}>
                      No macros yet — click + NEW MACRO to build your first command
                    </div>
                  )}
                  {macros.map(m=>{
                    const boundKey=Object.entries(bindings).find(([,v])=>v.type==='macro'&&v.macroId===m.id)?.[0];
                    const cmdLabel=MACRO_COMMANDS.find(c=>c.v===m.command)?.l||m.command;
                    return(
                      <div key={m.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'var(--card)',border:'1px solid var(--border2)',borderLeft:'3px solid rgba(255,211,42,0.4)',borderRadius:8}}>
                        {/* Key badge — click to open modal where key binding is built in */}
                        <div onClick={()=>setMacroModal({isNew:false,macro:{...m,params:{...m.params}}})}
                          style={{minWidth:32,padding:'4px 8px',background:boundKey?'rgba(255,211,42,0.1)':'transparent',border:`1px solid ${boundKey?'rgba(255,211,42,0.4)':'var(--border)'}`,borderRadius:4,color:boundKey?'#ffd32a':T.muted,fontSize:boundKey?12:10,fontWeight:700,textAlign:'center',cursor:'pointer'}}>
                          {boundKey?boundKey.toUpperCase():'KB'}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,color:T.offwhite,fontWeight:700,marginBottom:2}}>{m.name}</div>
                          <div style={{fontSize:10,color:T.muted}}>{cmdLabel}{describeCmd(m)?` · ${describeCmd(m)}`:''}</div>
                        </div>
                        <button onClick={()=>setMacroModal({isNew:false,macro:{...m,params:{...m.params}}})}
                          style={{background:'transparent',border:`1px solid ${T.border}`,color:T.muted,borderRadius:4,padding:'4px 10px',fontSize:10}}>EDIT</button>
                        <button type="button" onClick={()=>setConflictModal({msg:`Delete macro "${m.name}"? This cannot be undone.`,onConfirm:()=>{setMacros(p=>p.filter(x=>x.id!==m.id));setBindings(p=>{const n={...p};Object.keys(n).forEach(k=>{if(n[k]?.macroId===m.id)delete n[k];});return n;});}})}
                          style={{background:'transparent',border:'none',color:T.faint,fontSize:14,padding:'0 4px'}}>✕</button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Presets */}
            {sec('Binding Presets')}
            <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:8,padding:14}}>
              <div style={{display:'flex',gap:8,marginBottom:10}}>
                <input value={presetName} onChange={e=>setPresetName(e.target.value)} placeholder="Preset name…"
                  style={{flex:1,background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:5,color:T.offwhite,padding:'7px 12px',fontSize:11,letterSpacing:1,outline:'none'}}/>
                <button onClick={()=>{if(!presetName.trim())return;setPresets(p=>{const ei=p.findIndex(x=>x.name===presetName.trim());const np={name:presetName.trim(),bindings};if(ei>=0){const a=[...p];a[ei]=np;return a;}return[...p,np];});setPresetName('');}}
                  style={{background:'rgba(46,213,115,0.08)',border:'1px solid rgba(46,213,115,0.3)',color:T.green,borderRadius:5,padding:'7px 14px',fontSize:11,letterSpacing:2}}>SAVE</button>
              </div>
              {presets.length===0
                ?<div style={{color:T.faint,fontSize:10,textAlign:'center',padding:'8px 0',letterSpacing:1}}>No presets saved</div>
                :<div style={{display:'flex',flexDirection:'column',gap:5}}>
                  {presets.map(p=>(
                    <div key={p.name} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:6}}>
                      <span style={{color:T.soft,fontSize:11,flex:1,letterSpacing:1}}>{p.name}</span>
                      <span style={{color:T.faint,fontSize:9}}>{Object.keys(p.bindings).length} keys</span>
                      <button onClick={()=>setBindings(p.bindings)} style={{background:'rgba(30,144,255,0.08)',border:'1px solid rgba(30,144,255,0.3)',color:'#1e90ff',borderRadius:4,padding:'4px 10px',fontSize:10,letterSpacing:1}}>LOAD</button>
                      <button type="button" onClick={()=>setConflictModal({msg:`Delete preset "${p.name}"?`,onConfirm:()=>setPresets(pr=>pr.filter(x=>x.name!==p.name))})} style={{background:'transparent',border:'none',color:T.faint,fontSize:13,padding:'0 2px'}}>✕</button>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            FX TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab==='trackfx'&&(
          <div style={{animation:'fadeUp 0.2s ease',display:'flex',flexDirection:'column',gap:20}}>
            <div style={{padding:'8px 14px',background:'rgba(30,144,255,0.06)',border:'1px solid rgba(30,144,255,0.2)',borderRadius:8}}>
              <span style={{fontSize:11,color:T.blue}}>Input Trim &amp; Master EQ → </span>
              <button onClick={()=>setActiveTab('master')} style={{background:'transparent',border:'none',color:T.blue,fontSize:11,fontWeight:700,padding:0,cursor:'pointer',textDecoration:'underline'}}>MASTER tab</button>
            </div>

            {sec('Per-Track FX')}
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {tracks.map(track=>{
                const tfx=trackFX.find(f=>f.id===track.id);
                const isOpen=!!fxOpen[track.id];
                if(!tfx)return null;
                // Helper: render a small KB assignment box under a control
                const FxKB=({param,label,isKnob=true,min,max,step,defaultValue})=>{
                  const k=getFxKey('track',track.id,param);
                  const fb=k?fxBindings[k]:null;
                  const slots=fb?[fb.tap,fb.doubleTap,fb.hold].filter(s=>s&&s!=='none'):[];
                  return(
                    <button onClick={e=>{e.stopPropagation();setFxKbModal({target:'track',trackId:track.id,param,label,isKnob,min,max,step,defaultValue,awaitingKey:!k,step2:false,assignedKey:k||null});}}
                      style={{display:'flex',alignItems:'center',gap:3,padding:'2px 5px',background:k?`${track.color}14`:'transparent',border:`1px solid ${k?track.color+'44':'var(--border)'}`,borderRadius:3,cursor:'pointer',fontSize:7,color:k?track.color:T.dim,fontFamily:'DM Mono,monospace',letterSpacing:0,marginTop:2,maxWidth:'100%',minWidth:0,flexShrink:0}}>
                      {k?<><span style={{fontWeight:700}}>{k.toUpperCase()}</span>{slots.length>0&&<span style={{opacity:0.6}}>{slots.map(s=>s.slice(0,3).toUpperCase()).join('·')}</span>}</>:<span>⌨ KB</span>}
                    </button>
                  );
                };
                return(
                  <div key={track.id} style={{background:'var(--card)',border:`1px solid var(--border2)`,borderLeft:`3px solid ${track.color}`,borderRadius:10,overflow:'hidden'}}>
                    <div onClick={()=>setFxOpen(p=>({...p,[track.id]:!p[track.id]}))}
                      style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',cursor:'pointer',userSelect:'none'}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:track.color,boxShadow:`0 0 6px ${track.color}`}}/>
                      <span style={{fontSize:13,color:T.offwhite,fontWeight:700,flex:1}}>{track.name}</span>
                      <span style={{fontSize:10,color:T.muted,letterSpacing:1}}>VOL {Math.round(tfx.volume*100)}%</span>
                      {tfx.eqEnabled&&<span style={{fontSize:9,color:T.green,background:'rgba(57,255,20,0.08)',border:'1px solid rgba(57,255,20,0.2)',borderRadius:3,padding:'2px 5px'}}>EQ</span>}
                      {tfx.compEnabled&&<span style={{fontSize:9,color:T.amber,background:'rgba(255,159,67,0.08)',border:'1px solid rgba(255,159,67,0.2)',borderRadius:3,padding:'2px 5px'}}>COMP</span>}
                      {tfx.reverbSend>0&&<span style={{fontSize:9,color:T.purple,background:'rgba(162,155,254,0.08)',border:'1px solid rgba(162,155,254,0.2)',borderRadius:3,padding:'2px 5px'}}>VERB</span>}
                      {tfx.delaySend>0&&<span style={{fontSize:9,color:T.teal,background:'rgba(0,206,201,0.08)',border:'1px solid rgba(0,206,201,0.2)',borderRadius:3,padding:'2px 5px'}}>DELAY</span>}
                      <span style={{fontSize:12,color:T.muted}}>{isOpen?'▲':'▼'}</span>
                    </div>
                    {isOpen&&(
                      <div style={{padding:'0 14px 14px',borderTop:'1px solid var(--border3)',paddingTop:12,animation:'fadeUp .15s ease'}}>
                        <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-start'}}>
                          {/* VOLUME */}
                          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                            <div style={{fontSize:10,color:T.muted,letterSpacing:2}}>VOLUME</div>
                            <Knob value={tfx.volume} min={0} max={1.5} onChange={v=>updFX(track.id,'volume',v)} label="VOL" color={track.color} size={44} decimals={2} defaultValue={0.8}/>
                            <FxKB param="volume" label="Volume" min={0} max={1.5} step={0.05} defaultValue={0.8}/>
                          </div>
                          {/* OVR DECAY */}
                          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                            <div style={{fontSize:10,color:T.muted,letterSpacing:2}}>OVR DECAY</div>
                            <Knob value={track.overdubDecay??1.0} min={0} max={1} onChange={v=>upd(track.id,{overdubDecay:v})} label="DECAY" color={T.pink} size={44} decimals={2} defaultValue={1.0}/>
                            <FxKB param="overdubDecay" label="OVR Decay" min={0} max={1} step={0.05} defaultValue={1.0}/>
                            <div style={{fontSize:7,color:T.faint,letterSpacing:1,textAlign:'center'}}>0=replace 1=stack</div>
                          </div>
                          {/* EQ */}
                          <div style={{background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${tfx.eqEnabled?track.color+'33':'var(--border2)'}`,borderRadius:8,padding:'10px 12px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                              <span style={{fontSize:10,color:tfx.eqEnabled?track.color:T.muted,fontWeight:700,letterSpacing:2}}>EQ</span>
                              <button onClick={()=>updFX(track.id,'eqEnabled',!tfx.eqEnabled)}
                                style={{background:tfx.eqEnabled?`${track.color}18`:'transparent',border:`1px solid ${tfx.eqEnabled?track.color+'44':'var(--border)'}`,color:tfx.eqEnabled?track.color:T.faint,borderRadius:3,padding:'2px 6px',fontSize:9}}>
                                {tfx.eqEnabled?'ON':'OFF'}
                              </button>
                              <FxKB param="eqEnabled" label="EQ Toggle" isKnob={false} defaultValue={false}/>
                            </div>
                            <div style={{display:'flex',gap:8}}>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                <Knob value={tfx.eqLow} min={-15} max={15} onChange={v=>updFX(track.id,'eqLow',v)} label="LO" color={track.color} size={36} decimals={0} unit="dB" defaultValue={0}/>
                                <FxKB param="eqLow" label="EQ Low" min={-15} max={15} step={1} defaultValue={0}/>
                              </div>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                <Knob value={tfx.eqMid} min={-15} max={15} onChange={v=>updFX(track.id,'eqMid',v)} label="MI" color={track.color} size={36} decimals={0} unit="dB" defaultValue={0}/>
                                <FxKB param="eqMid" label="EQ Mid" min={-15} max={15} step={1} defaultValue={0}/>
                              </div>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                <Knob value={tfx.eqHigh} min={-15} max={15} onChange={v=>updFX(track.id,'eqHigh',v)} label="HI" color={track.color} size={36} decimals={0} unit="dB" defaultValue={0}/>
                                <FxKB param="eqHigh" label="EQ High" min={-15} max={15} step={1} defaultValue={0}/>
                              </div>
                            </div>
                          </div>
                          {/* COMP */}
                          <div style={{background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${tfx.compEnabled?'rgba(255,159,67,0.3)':'var(--border2)'}`,borderRadius:8,padding:'10px 12px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                              <span style={{fontSize:10,color:tfx.compEnabled?T.amber:T.muted,fontWeight:700,letterSpacing:2}}>COMP</span>
                              <button onClick={()=>updFX(track.id,'compEnabled',!tfx.compEnabled)}
                                style={{background:tfx.compEnabled?'rgba(255,159,67,0.1)':'transparent',border:`1px solid ${tfx.compEnabled?'rgba(255,159,67,0.4)':'var(--border)'}`,color:tfx.compEnabled?T.amber:T.faint,borderRadius:3,padding:'2px 6px',fontSize:9}}>
                                {tfx.compEnabled?'ON':'OFF'}
                              </button>
                              <FxKB param="compEnabled" label="Comp Toggle" isKnob={false} defaultValue={false}/>
                            </div>
                            <div style={{display:'flex',gap:8}}>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                <Knob value={tfx.compThreshold} min={-60} max={0} onChange={v=>updFX(track.id,'compThreshold',v)} label="THR" color={T.amber} size={36} decimals={0} unit="dB" defaultValue={-18}/>
                                <FxKB param="compThreshold" label="Comp Thresh" min={-60} max={0} step={2} defaultValue={-18}/>
                              </div>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                <Knob value={tfx.compRatio} min={1} max={20} onChange={v=>updFX(track.id,'compRatio',v)} label="RAT" color={T.amber} size={36} decimals={1} defaultValue={4}/>
                                <FxKB param="compRatio" label="Comp Ratio" min={1} max={20} step={1} defaultValue={4}/>
                              </div>
                            </div>
                          </div>
                          {/* SENDS */}
                          <div style={{background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8,padding:'10px 12px'}}>
                            <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:8,fontWeight:700}}>SENDS</div>
                            <div style={{display:'flex',gap:8}}>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                <Knob value={tfx.reverbSend} min={0} max={1} onChange={v=>updFX(track.id,'reverbSend',v)} label="VERB" color={T.purple} size={36} decimals={2} defaultValue={0}/>
                                <FxKB param="reverbSend" label="Reverb Send" min={0} max={1} step={0.05} defaultValue={0}/>
                              </div>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                <Knob value={tfx.delaySend} min={0} max={1} onChange={v=>updFX(track.id,'delaySend',v)} label="DLY" color={T.teal} size={36} decimals={2} defaultValue={0}/>
                                <FxKB param="delaySend" label="Delay Send" min={0} max={1} step={0.05} defaultValue={0}/>
                              </div>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                <Knob value={tfx.delayTime} min={0.05} max={1} onChange={v=>updFX(track.id,'delayTime',v)} label="TIME" color={T.teal} size={36} decimals={2} unit="s" defaultValue={0.375}/>
                                <FxKB param="delayTime" label="Delay Time" min={0.05} max={1} step={0.025} defaultValue={0.375}/>
                              </div>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                <Knob value={tfx.delayFeedback} min={0} max={0.9} onChange={v=>updFX(track.id,'delayFeedback',v)} label="FBCK" color={T.teal} size={36} decimals={2} defaultValue={0.3}/>
                                <FxKB param="delayFeedback" label="Delay Feedback" min={0} max={0.9} step={0.05} defaultValue={0.3}/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            ROUTING TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab==='master'&&(
          <div style={{animation:'fadeUp 0.2s ease',display:'flex',flexDirection:'column',gap:20}}>
            {sec('Master Volume & Monitor')}
            <div style={{background:'var(--card)',border:`1px solid ${T.border}`,borderRadius:10,padding:'16px',display:'flex',gap:20,flexWrap:'wrap',alignItems:'center'}}>
              <div style={{display:'flex',flexDirection:'column',gap:4,minWidth:160}}>
                <div style={{fontSize:10,color:T.muted,letterSpacing:2,fontFamily:"'DM Mono',monospace",fontWeight:700}}>MASTER INPUT VOL</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <input type="range" min={0} max={2} step={0.05} value={masterInputVol} onChange={e=>setMasterInputVol(parseFloat(e.target.value))} style={{flex:1,accentColor:T.blue}}/>
                  <span style={{fontSize:12,color:T.blue,minWidth:36,textAlign:'right',fontFamily:"'DM Mono',monospace",fontWeight:700}}>{Math.round(masterInputVol*100)}%</span>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:4,minWidth:160}}>
                <div style={{fontSize:10,color:T.muted,letterSpacing:2,fontFamily:"'DM Mono',monospace",fontWeight:700}}>MASTER PLAYBACK VOL</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <Knob value={masterVol} min={0} max={1.5} onChange={setMasterVol} label="VOL" color={T.green} size={40} decimals={2} defaultValue={0.8}/>
                  <span style={{fontSize:12,color:T.green,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{Math.round(masterVol*100)}%</span>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <div style={{fontSize:10,color:T.muted,letterSpacing:2,fontFamily:"'DM Mono',monospace",fontWeight:700}}>MONITOR</div>
                <button onClick={()=>setMonitorEnabled(v=>!v)} style={{padding:'8px 16px',borderRadius:6,fontSize:12,fontWeight:700,background:monitorEnabled?`${T.teal}14`:'transparent',border:`1px solid ${monitorEnabled?T.teal:T.border}`,color:monitorEnabled?T.teal:T.muted}}>
                  {monitorEnabled?'◉ MON ON':'◯ MON OFF'}
                </button>
                <div style={{fontSize:9,color:T.muted,maxWidth:140,lineHeight:1.5}}>Hear mic through speakers in real time</div>
              </div>
            </div>

            {sec('Input Trim & EQ')}
            <div style={{background:'var(--card)',border:`1px solid ${T.border}`,borderRadius:10,padding:16}}>
              {(()=>{
                const IFxKB=({param,label,isKnob=true,min,max,step,defaultValue})=>{
                  const k=getFxKey('input',null,param);
                  return(
                    <button onClick={e=>{e.stopPropagation();setFxKbModal({target:'input',trackId:null,param,label,isKnob,min,max,step,defaultValue,awaitingKey:!k,step2:false,assignedKey:k||null});}}
                      style={{display:'flex',alignItems:'center',gap:3,padding:'2px 5px',background:k?'rgba(30,144,255,0.1)':'transparent',border:`1px solid ${k?'rgba(30,144,255,0.4)':T.border}`,borderRadius:3,cursor:'pointer',fontSize:7,color:k?T.blue:T.faint,fontFamily:'DM Mono,monospace',marginTop:2,flexShrink:0}}>
                      {k?<span style={{fontWeight:700}}>{k.toUpperCase()}</span>:<span>⌨ KB</span>}
                    </button>
                  );
                };
                return(
                  <div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'flex-start'}}>
                    {/* INPUT TRIM */}
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                      <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:2}}>INPUT TRIM</div>
                      <Knob value={inputFX.gain} min={0} max={2} onChange={v=>setInputFX(p=>({...p,gain:v}))} label="GAIN" color={T.blue} size={52} decimals={2} defaultValue={1}/>
                      <IFxKB param="gain" label="Input Gain" min={0} max={2} step={0.05} defaultValue={1}/>
                    </div>
                    {/* INPUT COMPRESSOR */}
                    <div style={{background:darkMode?'var(--card2)':'#f0f0f0',border:`1px solid ${inputFX.compEnabled?'rgba(255,159,67,0.3)':T.border}`,borderRadius:8,padding:'12px 14px',flex:1,minWidth:200}}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                        <span style={{fontSize:11,color:inputFX.compEnabled?T.amber:T.muted,fontWeight:700,letterSpacing:2}}>COMPRESSOR</span>
                        <button onClick={()=>setInputFX(p=>({...p,compEnabled:!p.compEnabled}))}
                          style={{background:inputFX.compEnabled?'rgba(255,159,67,0.1)':'transparent',border:`1px solid ${inputFX.compEnabled?'rgba(255,159,67,0.4)':T.border}`,color:inputFX.compEnabled?T.amber:T.muted,borderRadius:4,padding:'3px 8px',fontSize:10}}>
                          {inputFX.compEnabled?'ON':'OFF'}
                        </button>
                        <IFxKB param="compEnabled" label="Input Comp Toggle" isKnob={false} defaultValue={false}/>
                      </div>
                      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                        {[['compThreshold','THRESH',T.amber,-60,0,2,-24,'dB',0],['compRatio','RATIO',T.amber,1,20,1,4,':1',1],['compAttack','ATK',T.amber,0.001,0.5,0.01,0.003,'s',3],['compRelease','REL',T.amber,0.01,2,0.05,0.25,'s',2]].map(([param,label,col,mn,mx,step,def,unit,dec])=>(
                          <div key={param} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                            <Knob value={inputFX[param]} min={mn} max={mx} onChange={v=>setInputFX(p=>({...p,[param]:v}))} label={label} color={col} size={44} decimals={dec} unit={unit} defaultValue={def}/>
                            <IFxKB param={param} label={`In Comp ${label}`} min={mn} max={mx} step={step} defaultValue={def}/>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* INPUT EQ */}
                    <div style={{background:darkMode?'var(--card2)':'#f0f0f0',border:`1px solid ${inputFX.eqEnabled?'rgba(46,213,115,0.3)':T.border}`,borderRadius:8,padding:'12px 14px',flex:1,minWidth:200}}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                        <span style={{fontSize:11,color:inputFX.eqEnabled?T.green:T.muted,fontWeight:700,letterSpacing:2}}>3-BAND EQ</span>
                        <button onClick={()=>setInputFX(p=>({...p,eqEnabled:!p.eqEnabled}))}
                          style={{background:inputFX.eqEnabled?'rgba(46,213,115,0.1)':'transparent',border:`1px solid ${inputFX.eqEnabled?'rgba(46,213,115,0.4)':T.border}`,color:inputFX.eqEnabled?T.green:T.muted,borderRadius:4,padding:'3px 8px',fontSize:10}}>
                          {inputFX.eqEnabled?'ON':'OFF'}
                        </button>
                        <IFxKB param="eqEnabled" label="Input EQ Toggle" isKnob={false} defaultValue={false}/>
                      </div>
                      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                        {[['eqLow','LOW',-15,15,1,0],['eqMid','MID',-15,15,1,0],['eqHigh','HIGH',-15,15,1,0],['eqMidFreq','MID Hz',200,5000,50,1000]].map(([param,label,mn,mx,step,def])=>(
                          <div key={param} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                            <Knob value={inputFX[param]} min={mn} max={mx} onChange={v=>setInputFX(p=>({...p,[param]:v}))} label={label} color={T.green} size={44} decimals={param==='eqMidFreq'?0:1} unit={param==='eqMidFreq'?'Hz':'dB'} defaultValue={def}/>
                            <IFxKB param={param} label={`In EQ ${label}`} min={mn} max={mx} step={step} defaultValue={def}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {sec('Metronome')}
            <div style={{background:'var(--card)',border:`1px solid ${T.border}`,borderRadius:10,padding:'16px'}}>
              <div style={{display:'flex',gap:8,marginBottom:10}}>
                {[['off','OFF','var(--text20)'],['countinOnly','COUNT-IN ONLY',T.amber],['always','ALWAYS ON',T.green]].map(([v,l,c])=>(
                  <button key={v} onClick={()=>setMetronomeMode(v)}
                    style={{flex:1,padding:'9px',borderRadius:6,fontSize:11,fontWeight:700,background:metronomeMode===v?`${c}14`:'transparent',border:`1px solid ${metronomeMode===v?c:T.border}`,color:metronomeMode===v?c:T.muted}}>
                    {l}
                  </button>
                ))}
              </div>
              <div style={{fontSize:11,color:T.muted,lineHeight:1.6}}>
                {metronomeMode==='off'&&'Metronome is off. Enable for click track during recording.'}
                {metronomeMode==='countinOnly'&&'Click plays only during count-in bars before recording starts.'}
                {metronomeMode==='always'&&'Click plays continuously at current BPM. Stops when you disable it.'}
              </div>
            </div>

            {sec('Global Track Settings')}
            <div style={{background:'var(--card)',border:`1px solid ${T.border}`,borderRadius:10,padding:'16px',display:'flex',flexDirection:'column',gap:14}}>
              <div style={{fontSize:10,color:T.muted,lineHeight:1.6,marginBottom:4}}>
                These apply to all tracks as defaults. Changing a setting on an individual track overrides the global setting for that track only.
              </div>
              <div>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:8,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>SYNC DEFAULTS</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  <button onClick={()=>setQuantize(v=>!v)} style={{background:quantize?'rgba(255,211,42,0.08)':'transparent',border:`1px solid ${quantize?'rgba(255,211,42,0.4)':T.border}`,color:quantize?'#ffd32a':T.muted,fontWeight:700,borderRadius:5,padding:'6px 12px',fontSize:11}}>Quantize: {quantize?'ON':'OFF'}</button>
                  <button onClick={()=>setAutoSync(v=>!v)} style={{background:autoSync?'rgba(57,255,20,0.08)':'transparent',border:`1px solid ${autoSync?'rgba(57,255,20,0.4)':T.border}`,color:autoSync?T.green:T.muted,fontWeight:700,borderRadius:5,padding:'6px 12px',fontSize:11}}>Auto-Sync: {autoSync?'ON':'OFF'}</button>
                  <button onClick={()=>{const ns=!globalSync;setGlobalSync(ns);setTracks(p=>p.map(t=>({...t,syncStart:ns,syncStop:ns})));}} style={{background:globalSync?'rgba(0,206,201,0.08)':'transparent',border:`1px solid ${globalSync?'rgba(0,206,201,0.4)':T.border}`,color:globalSync?T.teal:T.muted,fontWeight:700,borderRadius:5,padding:'6px 12px',fontSize:11}}>Grid Sync: {globalSync?'ON':'OFF'}</button>
                </div>
              </div>
              <div>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:4,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>AFTER RECORD STOPS</div>
                <div style={{fontSize:9,color:T.faint,marginBottom:6,letterSpacing:1}}>applies to all tracks</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {[{v:'play',l:'▶ Play Loop',c:T.green},{v:'overdub',l:'⊕ Immediate Overdub',c:T.pink}].map(({v,l,c})=>(
                    <button key={v} onClick={()=>setTracks(p=>p.map(t=>({...t,stopRecMode:v})))}
                      style={{padding:'6px 12px',borderRadius:5,fontSize:11,fontWeight:700,
                        background:tracks.every(t=>t.stopRecMode===v)?`${c}14`:'transparent',
                        border:`1px solid ${tracks.every(t=>t.stopRecMode===v)?c:T.border}`,
                        color:tracks.every(t=>t.stopRecMode===v)?c:T.muted}}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:4,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>DEFAULT COUNT-IN</div>
                <div style={{fontSize:9,color:T.faint,marginBottom:6,letterSpacing:1}}>applies to all tracks</div>
                <div style={{display:'flex',gap:6}}>
                  {[{v:0,l:'Off'},{v:1,l:'1 Bar'},{v:2,l:'2 Bars'}].map(({v,l})=>(
                    <button key={v} onClick={()=>setTracks(p=>p.map(t=>({...t,countIn:v})))}
                      style={{padding:'6px 12px',borderRadius:5,fontSize:11,fontWeight:700,
                        background:tracks.every(t=>t.countIn===v)?'rgba(30,144,255,0.12)':'transparent',
                        border:`1px solid ${tracks.every(t=>t.countIn===v)?T.blue:T.border}`,
                        color:tracks.every(t=>t.countIn===v)?T.blue:T.muted}}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:4,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>DEFAULT PLAY MODE</div>
                <div style={{fontSize:9,color:T.faint,marginBottom:6,letterSpacing:1}}>applies to all tracks</div>
                <div style={{display:'flex',gap:6}}>
                  {[{v:'loop',l:'∞ Loop'},{v:'oneshot',l:'1× One-Shot'},{v:'pingpong',l:'↔ Ping-Pong'}].map(({v,l})=>(
                    <button key={v} onClick={()=>setTracks(p=>p.map(t=>({...t,playMode:v})))}
                      style={{padding:'6px 12px',borderRadius:5,fontSize:11,fontWeight:700,
                        background:tracks.every(t=>t.playMode===v)?'rgba(162,155,254,0.1)':'transparent',
                        border:`1px solid ${tracks.every(t=>t.playMode===v)?T.purple:T.border}`,
                        color:tracks.every(t=>t.playMode===v)?T.purple:T.muted}}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:4,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>DEFAULT AUTO-REC BARS</div>
                <div style={{fontSize:9,color:T.faint,marginBottom:6,letterSpacing:1}}>applies to all tracks</div>
                <div style={{display:'flex',gap:6}}>
                  {[{v:0,l:'Off'},{v:1,l:'1'},{v:2,l:'2'},{v:4,l:'4'},{v:8,l:'8'}].map(({v,l})=>(
                    <button key={v} onClick={()=>setTracks(p=>p.map(t=>({...t,autoRecBars:v})))}
                      style={{padding:'6px 12px',borderRadius:5,fontSize:11,fontWeight:700,
                        background:tracks.every(t=>t.autoRecBars===v)?'rgba(57,255,20,0.1)':'transparent',
                        border:`1px solid ${tracks.every(t=>t.autoRecBars===v)?T.green:T.border}`,
                        color:tracks.every(t=>t.autoRecBars===v)?T.green:T.muted}}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:4,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>DEFAULT MUTE FADE</div>
                <div style={{fontSize:9,color:T.faint,marginBottom:6,letterSpacing:1}}>applies to all tracks</div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <input type="range" min={0} max={2} step={0.1}
                    value={tracks[0]?.muteFadeDur??0}
                    onChange={e=>setTracks(p=>p.map(t=>({...t,muteFadeDur:parseFloat(e.target.value)})))}
                    style={{flex:1,accentColor:T.amber}}/>
                  <span style={{fontSize:12,color:T.amber,minWidth:40,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                    {tracks[0]?.muteFadeDur>0?`${(tracks[0].muteFadeDur).toFixed(1)}s`:'Instant'}
                  </span>
                </div>
              </div>
            </div>

            {sec('Audio Routing')}
            <div style={{background:'var(--card)',border:`1px solid ${T.border}`,borderRadius:10,padding:16,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <div style={{fontSize:11,color:T.soft,letterSpacing:2,marginBottom:10,fontWeight:700}}>INPUT DEVICE</div>
                <select value={selectedInput} onChange={e=>changeInput(e.target.value)} disabled={!hasAudio}>
                  <option value="default">Default Input</option>
                  {devices.inputs.map(d=><option key={d.deviceId} value={d.deviceId}>{d.label||`Input ${d.deviceId.slice(0,8)}`}</option>)}
                </select>
                <div style={{fontSize:10,color:T.muted,marginTop:8}}>Microphone or audio interface</div>
              </div>
              <div>
                <div style={{fontSize:11,color:T.soft,letterSpacing:2,marginBottom:10,fontWeight:700}}>OUTPUT DEVICE</div>
                <select value={selectedOutput} onChange={e=>changeOutput(e.target.value)} disabled={!hasAudio}>
                  <option value="default">Default Output</option>
                  {devices.outputs.map(d=><option key={d.deviceId} value={d.deviceId}>{d.label||`Output ${d.deviceId.slice(0,8)}`}</option>)}
                </select>
                <div style={{fontSize:10,color:T.muted,marginTop:8}}>Chrome/Edge only</div>
              </div>
            </div>

            {sec('MIDI Output')}
            <div style={{background:'var(--card)',border:`1px solid ${T.border}`,borderRadius:10,padding:20}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <button onClick={()=>{
                  if(!midiEnabled){
                    navigator.requestMIDIAccess?.().then(access=>{
                      setMidiAccess(access);
                      const outputs=[...access.outputs.values()];
                      setMidiOutputs(outputs);
                      setMidiEnabled(true);
                    }).catch(()=>setConflictModal({msg:'MIDI access was denied. Please allow MIDI access in your browser settings and try again.',onConfirm:()=>{}}));
                  } else { setMidiEnabled(false); }
                }} style={{background:midiEnabled?'rgba(57,255,20,0.1)':'transparent',border:`1px solid ${midiEnabled?T.green:T.border}`,color:midiEnabled?T.green:T.muted,borderRadius:5,padding:'7px 16px',fontSize:11,letterSpacing:2,fontWeight:700}}>
                  {midiEnabled?'MIDI OUT ON':'ENABLE MIDI OUT'}
                </button>
                {midiEnabled&&<span style={{fontSize:11,color:T.green,letterSpacing:2}}>● CONNECTED</span>}
              </div>
              {midiEnabled&&(
                <>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>OUTPUT PORT</div>
                    <select value={midiOutputId} onChange={e=>{setMidiOutputId(e.target.value);midiOutputR.current=midiOutputs.find(o=>o.id===e.target.value)||null;}}>
                      <option value="">Select MIDI output…</option>
                      {midiOutputs.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>MIDI CHANNEL</div>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      {Array.from({length:16},(_,i)=>i+1).map(ch=>(
                        <button key={ch} onClick={()=>setMidiChannel(ch)} style={{width:32,height:28,background:midiChannel===ch?'rgba(57,255,20,0.1)':'transparent',border:`1px solid ${midiChannel===ch?T.green:T.border}`,borderRadius:4,color:midiChannel===ch?T.green:T.muted,fontSize:10,fontWeight:700}}>{ch}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {!midiEnabled&&<div style={{fontSize:11,color:T.muted,lineHeight:1.8,marginTop:8}}>
                Send note/CC messages to external hardware or DAWs when gestures fire. Requires Chrome (Web MIDI API).
              </div>}
            </div>

            {sec('MIDI Input')}
            <div style={{background:'var(--card)',border:`1px solid ${T.border}`,borderRadius:10,padding:20}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <button onClick={()=>setMidiInputEnabled(v=>!v)}
                  style={{background:midiInputEnabled?'rgba(57,255,20,0.1)':'transparent',border:`1px solid ${midiInputEnabled?T.green:T.border}`,color:midiInputEnabled?T.green:T.muted,borderRadius:5,padding:'7px 16px',fontSize:11,letterSpacing:2,fontWeight:700}}>
                  {midiInputEnabled?'🎹 MIDI IN ON':'🎹 ENABLE MIDI IN'}
                </button>
                {midiInputEnabled&&midiInputs.length>0&&<span style={{fontSize:11,color:T.green,letterSpacing:2}}>● {midiInputs.length} DEVICE{midiInputs.length>1?'S':''}</span>}
                {midiInputEnabled&&midiInputs.length===0&&<span style={{fontSize:11,color:T.amber,letterSpacing:2}}>⚠ NO DEVICES</span>}
              </div>
              {midiInputEnabled&&midiInputs.length>0&&(
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:8,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>CONNECTED CONTROLLERS</div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {midiInputs.map(inp=>{
                      const enabled=midiInputDevicesOn[inp.id]!==false; // default = enabled
                      return(
                        <div key={inp.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:'var(--card2)',border:`1px solid ${enabled?T.green+'33':T.border}`,borderRadius:6}}>
                          <button onClick={()=>setMidiInputDevicesOn(p=>({...p,[inp.id]:!enabled}))}
                            style={{padding:'4px 10px',borderRadius:4,fontSize:9,fontWeight:700,letterSpacing:1,minWidth:46,
                              background:enabled?'rgba(57,255,20,0.12)':'transparent',
                              border:`1px solid ${enabled?T.green:T.border}`,
                              color:enabled?T.green:T.muted,cursor:'pointer'}}>
                            {enabled?'● ON':'○ OFF'}
                          </button>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:12,color:darkMode?'#fff':'#111',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{inp.name}</div>
                            <div style={{fontSize:9,color:T.muted,fontFamily:"'DM Mono',monospace"}}>{inp.manufacturer||'unknown manufacturer'}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{fontSize:10,color:T.muted,marginTop:8,lineHeight:1.5}}>
                    Toggle each controller on or off. Disabled devices are ignored — useful when multiple devices are plugged in but only one should drive Spool.
                  </div>
                </div>
              )}
              {midiInputEnabled&&Object.keys(midiBindings).length>0&&(
                <div style={{marginTop:14}}>
                  <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>CURRENT MIDI BINDINGS</div>
                  <div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:200,overflowY:'auto'}}>
                    {Object.entries(midiBindings).map(([midiKey,b])=>{
                      const desc=b.type==='track'?`Track ${b.trackId+1} · ${b.tap||'?'}`:b.type==='global'?`Global: ${b.tap||'?'}`:b.type==='fxParam'?`FX: ${b.param}`:`Macro`;
                      return(
                        <div key={midiKey} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 8px',background:'var(--card2)',border:`1px solid ${T.border}`,borderRadius:4}}>
                          <span style={{fontSize:10,color:T.teal,fontFamily:"'DM Mono',monospace",fontWeight:700,minWidth:90}}>🎹 {midiKey}</span>
                          <span style={{fontSize:11,color:T.soft,flex:1}}>{desc}</span>
                          <button onClick={()=>setMidiBindings(p=>{const n={...p};delete n[midiKey];return n;})}
                            style={{fontSize:9,padding:'2px 6px',borderRadius:3,background:'transparent',border:`1px solid ${T.border}`,color:T.muted,cursor:'pointer'}}>✕</button>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={()=>setConflictModal({msg:'Clear ALL MIDI bindings? This cannot be undone.',onConfirm:()=>setMidiBindings({})})}
                    style={{marginTop:8,fontSize:9,padding:'4px 10px',borderRadius:4,background:'rgba(255,77,77,0.08)',border:'1px solid rgba(255,77,77,0.3)',color:T.red,cursor:'pointer',letterSpacing:1,fontWeight:700}}>
                    ✕ CLEAR ALL
                  </button>
                </div>
              )}
              {!midiInputEnabled&&<div style={{fontSize:11,color:T.muted,lineHeight:1.8,marginTop:8}}>
                Receive note and CC events from a MIDI controller, pedal, or keyboard. Click the 🎹 button next to any function in Spool to learn a MIDI control.
              </div>}
            </div>

            {sec('Display')}
            <div style={{background:'var(--card)',border:`1px solid ${T.border}`,borderRadius:10,padding:16,display:'flex',alignItems:'center',gap:16}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,color:darkMode?'#fff':'#111',fontWeight:600,marginBottom:4}}>Dark / Light Mode</div>
                <div style={{fontSize:11,color:T.muted}}>Switch between dark (black) and light (white) UI theme</div>
              </div>
              <button onClick={()=>setDarkMode(v=>!v)} style={{padding:'8px 20px',borderRadius:6,fontSize:13,fontWeight:700,background:darkMode?'rgba(57,255,20,0.1)':'rgba(0,0,0,0.1)',border:`1px solid ${darkMode?T.green:'rgba(0,0,0,0.2)'}`,color:darkMode?T.green:'#333'}}>
                {darkMode?'🌙 DARK MODE':'☀ LIGHT MODE'}
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            MIDI TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab==='tablet'&&(
          <div style={{animation:'fadeUp 0.2s ease',display:'flex',flexDirection:'column',gap:20,maxWidth:640}}>
            {sec('Touch / Tablet Mode')}
            <div style={{background:'var(--card)',border:`1px solid ${T.border}`,borderRadius:10,padding:20}}>
              <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
                <div style={{fontSize:28}}>👆</div>
                <div>
                  <div style={{fontSize:14,color:darkMode?'#fff':'#111',fontWeight:700,marginBottom:4}}>Tablet & Touchscreen Mode</div>
                  <div style={{fontSize:11,color:T.muted}}>Spool works fully on iPad and any touchscreen. Large tap targets replace keyboard bindings.</div>
                </div>
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
                {[['▦ GRID','Grid layout — card view'],['⌨ KEYS','Keyboard map view'],['⚡ PERFORM','Performance view'],['👆 TOUCH','Touch-optimized view']].map(([l,d])=>(
                  <div key={l} style={{background:darkMode?'var(--card2)':'#f5f5f5',border:`1px solid ${T.border}`,borderRadius:6,padding:'8px 12px',minWidth:120}}>
                    <div style={{fontSize:12,color:T.green,fontWeight:700,marginBottom:3}}>{l}</div>
                    <div style={{fontSize:10,color:T.muted}}>{d}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,color:T.muted,lineHeight:1.8}}>
                <strong style={{color:darkMode?'#fff':'#111'}}>To use on iPad:</strong> Open Spool directly in Chrome → tap ◉ INITIALIZE AUDIO → allow microphone → switch to 👆 TOUCH layout. Auto-detects touchscreen on first load.
              </div>
              <div style={{marginTop:12,padding:'10px 14px',background:'rgba(0,206,201,0.06)',border:'1px solid rgba(0,206,201,0.2)',borderRadius:6,fontSize:11,color:T.teal,lineHeight:1.6}}>
                💡 In Touch Mode, the same audio engine runs underneath — all FX, sync, overdub, and export features work identically.
              </div>
            </div>

            <div style={{padding:'10px 14px',background:'rgba(162,155,254,0.06)',border:'1px solid rgba(162,155,254,0.2)',borderRadius:8}}>
              <span style={{fontSize:11,color:T.purple}}>MIDI Input and Output controls have moved to the </span>
              <button onClick={()=>setActiveTab('master')} style={{background:'transparent',border:'none',color:T.purple,fontSize:11,fontWeight:700,padding:0,cursor:'pointer',textDecoration:'underline'}}>SETTINGS tab →</button>
            </div>
          </div>
        )}

      </div>{/* /tab content */}

      {/* ━━━ UNIVERSAL KEY BINDING MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {universalKeyModal&&(()=>{
        const m=universalKeyModal;
        const setM=setUniversalKeyModal;
        const up=(patch)=>setM(p=>({...p,...patch}));

        // ── ACTIONS ──
        const TRACK_ACTS=[
          {v:'─────',l:'── RECORDING ──',disabled:true},
          {v:'smartRecord',l:'SMART REC — full state machine (recommended)'},
          {v:'record',l:'RECORD'},
          {v:'overdub',l:'OVERDUB'},
          {v:'punchIn',l:'PUNCH IN'},
          {v:'─────',l:'── PLAYBACK ──',disabled:true},
          {v:'playStop',l:'PLAY / STOP'},
          {v:'restart',l:'RESTART'},
          {v:'─────',l:'── LOOP ──',disabled:true},
          {v:'reverse',l:'REVERSE'},
          {v:'togglePlayMode',l:'CYCLE PLAY MODE'},
          {v:'cycleSpeed',l:'CYCLE SPEED'},
          {v:'─────',l:'── MUTE / SOLO ──',disabled:true},
          {v:'mute',l:'MUTE'},
          {v:'solo',l:'SOLO'},
          {v:'─────',l:'── FX ──',disabled:true},
          {v:'toggleEQ',l:'TOGGLE EQ'},
          {v:'toggleComp',l:'TOGGLE COMP'},
          {v:'toggleReverb',l:'TOGGLE REVERB'},
          {v:'toggleDelay',l:'TOGGLE DELAY'},
          {v:'─────',l:'── OTHER ──',disabled:true},
          {v:'overdubUndoOrErase',l:'UNDO OVERDUB / ERASE (recommended for HOLD)'},
          {v:'clear',l:'CLEAR LOOP'},
          {v:'none',l:'— DO NOTHING —'},
        ];
        const GLOBAL_ACTS=[
          {v:'none',l:'— DO NOTHING —'},
          {v:'tapTempo',l:'TAP TEMPO'},
          {v:'playAll',l:'PLAY ALL'},
          {v:'stopAll',l:'STOP ALL'},
          {v:'clearAll',l:'CLEAR ALL'},
          {v:'exportMix',l:'EXPORT MIX'},
          {v:'quantizeToggle',l:'QUANTIZE TOGGLE'},
          {v:'syncAllToggle',l:'SYNC ALL TOGGLE'},
          {v:'bpmDouble',l:'BPM × 2'},
          {v:'bpmHalf',l:'BPM ÷ 2'},
          {v:'masterFadeOut',l:'MASTER FADE OUT'},
          {v:'masterFadeIn',l:'MASTER FADE IN'},
        ];
        const FX_KNOB_ACTS=[
          {v:'none',l:'— DO NOTHING —'},
          {v:'increase',l:'INCREASE (step up)'},
          {v:'decrease',l:'DECREASE (step down)'},
          {v:'reset',l:'RESET to default'},
        ];
        const FX_TOGGLE_ACTS=[
          {v:'none',l:'— DO NOTHING —'},
          {v:'toggle',l:'TOGGLE on/off'},
          {v:'reset',l:'RESET to default'},
        ];

        const sBg='var(--inset)',sSt={background:sBg,color:T.soft,border:`1px solid ${T.border}`,borderRadius:4,padding:'5px 8px',fontSize:10,letterSpacing:1,width:'100%',cursor:'pointer',outline:'none'};

        // ── FX PARAM METADATA ──
        const fxParamList=m.fxTarget==='input'?FX_PARAMS_INPUT:FX_PARAMS_TRACK;
        const fxParamInfo=fxParamList.find(p=>p.param===m.fxParam);

        // ── SAVE ──
        const save=()=>{
          if(!m.key)return;
          // Remove all old bindings for this key
          setBindings(p=>{const n={...p};delete n[m.key];return n;});
          setFxBindings(p=>{const n={...p};delete n[m.key];return n;});

          if(m.bindType==='track'&&m.selectedTrackId!==null&&m.selectedTrackId!==undefined){
            setBindings(p=>{
              const n={...p};
              // Remove old key for same track
              Object.keys(n).forEach(k=>{if(k!==m.key&&n[k]?.type==='track'&&n[k]?.trackId===m.selectedTrackId)delete n[k];});
              n[m.key]={type:'track',trackId:m.selectedTrackId,tap:m.tapAction||'smartRecord',doubleTap:m.doubleTapAction||'playStop',hold:m.holdAction||'overdubUndoOrErase'};
              return n;
            });
            upd(m.selectedTrackId,{stopRecMode:m.stopRecMode||'play'});
          } else if(m.bindType==='global'){
            setBindings(p=>({...p,[m.key]:{type:'global',tap:m.globalTap||'none',doubleTap:m.globalDoubleTap||'none',hold:m.globalHold||'none'}}));
          } else if(m.bindType==='macro'&&m.macroId){
            setBindings(p=>({...p,[m.key]:{type:'macro',macroId:m.macroId}}));
          } else if(m.bindType==='fx'&&m.fxParam&&fxParamInfo){
            setFxBindings(p=>({...p,[m.key]:{
              type:'fxParam',target:m.fxTarget,trackId:m.fxTrackId,
              param:m.fxParam,label:fxParamInfo.label,
              isKnob:fxParamInfo.isKnob,min:fxParamInfo.min,max:fxParamInfo.max,
              step:fxParamInfo.step,defaultValue:fxParamInfo.defaultValue,
              tap:m.fxTap,doubleTap:m.fxDoubleTap,hold:m.fxHold,
            }}));
          }
          setM(null);
        };

        const TYPE_BTNS=[
          {v:'track',l:'TRACK',c:COLORS[m.selectedTrackId??0]||T.green,icon:'◉'},
          {v:'global',l:'GLOBAL',c:T.purple,icon:'⚡'},
          {v:'fx',l:'FX',c:T.teal,icon:'⚙'},
          {v:'macro',l:'MACRO',c:'#ffd32a',icon:'⚡'},
        ];
        const activeColor=m.bindType==='track'?(COLORS[m.selectedTrackId??0]||T.green):m.bindType==='global'?T.purple:m.bindType==='fx'?T.teal:m.bindType==='macro'?'#ffd32a':'var(--text40)';

        const GestSel=({label,desc,color,val,acts,onChange})=>(
          <div style={{marginBottom:8,padding:'8px 10px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${color}18`,borderRadius:7,borderLeft:`2px solid ${color}44`}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
              <span style={{fontSize:9,color,letterSpacing:3,fontWeight:700}}>{label}</span>
              <span style={{fontSize:9,color:T.dim}}>{desc}</span>
            </div>
            <select value={val} onChange={e=>onChange(e.target.value)} style={sSt}>
              {acts.map(a=><option key={a.v} value={a.v} disabled={a.disabled||false} style={{background:sBg,color:a.disabled?(darkMode?'#303050':'#aaa'):T.white}}>{a.l}</option>)}
            </select>
          </div>
        );

        return(
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1100,backdropFilter:'blur(12px)'}}>
            <div style={{background:'var(--card)',border:`2px solid ${activeColor}44`,borderRadius:14,padding:'22px 24px',width:460,maxWidth:'96vw',maxHeight:'90vh',overflowY:'auto',animation:'fadeUp 0.15s ease'}}>

              {/* Header */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div>
                  <div style={{fontSize:9,color:T.faint,letterSpacing:5,marginBottom:3,fontWeight:700}}>KEYBOARD MAP</div>
                  <div style={{fontSize:15,color:T.soft,letterSpacing:2,fontWeight:700}}>BIND KEY</div>
                </div>
                <button onClick={()=>setM(null)} style={{background:'transparent',border:'none',color:T.faint,fontSize:20,padding:0,cursor:'pointer'}}>✕</button>
              </div>

              {/* Key picker */}
              <div style={{marginBottom:14,padding:'10px 12px',background:'var(--inset)',border:`1px solid ${T.border}`,borderRadius:8}}>
                <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginBottom:8,fontWeight:700}}>KEY</div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{fontSize:22,color:m.key?activeColor:'#333',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${m.key?activeColor+'44':'#222'}`,borderRadius:6,padding:'6px 14px',minWidth:44,textAlign:'center',fontWeight:700,letterSpacing:2}}>
                    {m.awaitingKey?<span style={{color:T.amber,animation:'pulse .5s infinite'}}>…</span>:m.key?m.key.toUpperCase():'—'}
                  </div>
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:4}}>
                    <button onClick={()=>up({awaitingKey:true})} style={{background:'rgba(30,144,255,0.08)',border:'1px solid rgba(30,144,255,0.3)',color:'#1e90ff',borderRadius:4,padding:'5px 12px',fontSize:9,letterSpacing:2,width:'100%'}}>
                      {m.awaitingKey?'PRESS ANY KEY…':'CHANGE KEY'}
                    </button>
                    {m.awaitingKey&&<div style={{fontSize:8,color:'var(--text40)',letterSpacing:2,textAlign:'center'}}>ESC to cancel</div>}
                    {m.key&&<button onClick={()=>{setBindings(p=>{const n={...p};delete n[m.key];return n;});setFxBindings(p=>{const n={...p};delete n[m.key];return n;});setM(null);}} style={{background:'transparent',border:`1px solid ${T.border}`,color:'rgba(255,77,77,0.5)',borderRadius:4,padding:'3px 8px',fontSize:8,letterSpacing:2,width:'100%'}}>REMOVE BINDING</button>}
                  </div>
                </div>
              </div>

              {/* Type selector */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginBottom:8,fontWeight:700}}>BINDING TYPE</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
                  {TYPE_BTNS.map(({v,l,c,icon})=>(
                    <button key={v} onClick={()=>up({bindType:v})}
                      style={{padding:'8px 4px',background:m.bindType===v?`${c}14`:'transparent',border:`1px solid ${m.bindType===v?c+'55':'var(--border)'}`,borderRadius:6,color:m.bindType===v?c:'var(--text40)',fontSize:9,letterSpacing:1,fontWeight:700,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                      <span style={{fontSize:12}}>{icon}</span>{l}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── TRACK CONFIG ── */}
              {m.bindType==='track'&&(
                <div>
                  <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginBottom:8,fontWeight:700}}>SELECT TRACK</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5,marginBottom:12}}>
                    {tracks.map(t=>(
                      <button key={t.id} onClick={()=>up({selectedTrackId:t.id})}
                        style={{padding:'7px 4px',background:m.selectedTrackId===t.id?`${t.color}18`:'transparent',border:`1px solid ${m.selectedTrackId===t.id?t.color+'55':'var(--border)'}`,borderRadius:5,color:m.selectedTrackId===t.id?t.color:T.dim,fontSize:9,letterSpacing:1,fontWeight:700}}>
                        {t.name.replace('LOOP ','L')}
                      </button>
                    ))}
                  </div>
                  <GestSel label="TAP" desc="single press" color="#2ed573" val={m.tapAction||'smartRecord'} acts={TRACK_ACTS} onChange={v=>up({tapAction:v})}/>
                  <GestSel label="DOUBLE TAP" desc="280ms window" color="#ff9f43" val={m.doubleTapAction||'playStop'} acts={TRACK_ACTS} onChange={v=>up({doubleTapAction:v})}/>
                  <GestSel label="HOLD" desc="500ms+" color="#ff4d4d" val={m.holdAction||'overdubUndoOrErase'} acts={TRACK_ACTS} onChange={v=>up({holdAction:v})}/>
                  <div style={{padding:'8px 10px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:7,marginTop:4}}>
                    <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginBottom:6,fontWeight:700}}>AFTER STOP REC →</div>
                    <div style={{display:'flex',gap:6}}>
                      {[['play','▶ PLAY LOOP'],['overdub','⊕ OVERDUB']].map(([v,l])=>(
                        <button key={v} onClick={()=>up({stopRecMode:v})}
                          style={{flex:1,padding:'5px',background:(m.stopRecMode||'play')===v?'rgba(46,213,115,0.1)':'transparent',border:`1px solid ${(m.stopRecMode||'play')===v?'rgba(46,213,115,0.4)':'var(--border)'}`,borderRadius:4,color:(m.stopRecMode||'play')===v?T.green:'var(--text40)',fontSize:9,letterSpacing:1}}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── GLOBAL CONFIG ── */}
              {m.bindType==='global'&&(
                <div>
                  <GestSel label="TAP" desc="single press" color="#2ed573" val={m.globalTap||'none'} acts={GLOBAL_ACTS} onChange={v=>up({globalTap:v})}/>
                  <GestSel label="DOUBLE TAP" desc="280ms window" color="#ff9f43" val={m.globalDoubleTap||'none'} acts={GLOBAL_ACTS} onChange={v=>up({globalDoubleTap:v})}/>
                  <GestSel label="HOLD" desc="500ms+" color="#ff4d4d" val={m.globalHold||'none'} acts={GLOBAL_ACTS} onChange={v=>up({globalHold:v})}/>
                  <div style={{fontSize:9,color:'var(--text40)',letterSpacing:1,marginTop:6,lineHeight:1.6}}>
                    Example: TAP=Play All · DBL=Stop All · HOLD=Clear All — all on one key
                  </div>
                </div>
              )}

              {/* ── FX CONFIG ── */}
              {m.bindType==='fx'&&(
                <div>
                  <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginBottom:8,fontWeight:700}}>FX SOURCE</div>
                  <div style={{display:'flex',gap:5,marginBottom:10}}>
                    {[['input','INPUT CHAIN'],['track','TRACK']].map(([v,l])=>(
                      <button key={v} onClick={()=>up({fxTarget:v,fxParam:null,fxTrackId:null})}
                        style={{flex:1,padding:'6px',background:m.fxTarget===v?'rgba(0,206,201,0.1)':'transparent',border:`1px solid ${m.fxTarget===v?'rgba(0,206,201,0.4)':'var(--border)'}`,borderRadius:5,color:m.fxTarget===v?T.teal:'var(--text40)',fontSize:9,letterSpacing:1,fontWeight:700}}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {m.fxTarget==='track'&&(
                    <>
                      <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginBottom:6,fontWeight:700}}>TRACK</div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4,marginBottom:10}}>
                        {tracks.map(t=>(
                          <button key={t.id} onClick={()=>up({fxTrackId:t.id,fxParam:null})}
                            style={{padding:'6px 2px',background:m.fxTrackId===t.id?`${t.color}18`:'transparent',border:`1px solid ${m.fxTrackId===t.id?t.color+'55':'var(--border)'}`,borderRadius:4,color:m.fxTrackId===t.id?t.color:T.dim,fontSize:9,letterSpacing:0,fontWeight:700}}>
                            {t.name.replace('LOOP ','L')}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginBottom:6,fontWeight:700}}>PARAMETER</div>
                  <select value={m.fxParam||''} onChange={e=>up({fxParam:e.target.value,fxTap:fxParamList.find(p=>p.param===e.target.value)?.isKnob?'increase':'toggle',fxDoubleTap:fxParamList.find(p=>p.param===e.target.value)?.isKnob?'decrease':'reset',fxHold:fxParamList.find(p=>p.param===e.target.value)?.isKnob?'reset':'none'})} style={{...sSt,marginBottom:10}}>
                    <option value="">Select parameter…</option>
                    {fxParamList.map(p=><option key={p.param} value={p.param} style={{background:sBg}}>{p.label}{p.isKnob?' (knob)':' (toggle)'}</option>)}
                  </select>
                  {fxParamInfo&&(
                    <>
                      {fxParamInfo.isKnob&&<div style={{fontSize:8,color:'rgba(0,206,201,0.6)',letterSpacing:1,marginBottom:8,padding:'5px 8px',background:'rgba(0,206,201,0.05)',borderRadius:4,border:'1px solid rgba(0,206,201,0.1)'}}>
                        💡 While <strong style={{color:T.soft}}>holding</strong> this key, use <strong style={{color:T.soft}}>↑ / ↓</strong> arrows to scrub the value live
                      </div>}
                      <GestSel label="TAP" desc="single press" color="#2ed573" val={m.fxTap||'increase'} acts={fxParamInfo.isKnob?FX_KNOB_ACTS:FX_TOGGLE_ACTS} onChange={v=>up({fxTap:v})}/>
                      <GestSel label="DOUBLE TAP" desc="280ms window" color="#ff9f43" val={m.fxDoubleTap||'decrease'} acts={fxParamInfo.isKnob?FX_KNOB_ACTS:FX_TOGGLE_ACTS} onChange={v=>up({fxDoubleTap:v})}/>
                      <GestSel label="HOLD" desc="500ms+ (scrub)" color="#ff4d4d" val={m.fxHold||'reset'} acts={fxParamInfo.isKnob?FX_KNOB_ACTS:FX_TOGGLE_ACTS} onChange={v=>up({fxHold:v})}/>
                    </>
                  )}
                </div>
              )}

              {/* ── MACRO CONFIG ── */}
              {m.bindType==='macro'&&(
                <div>
                  <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginBottom:8,fontWeight:700}}>SELECT MACRO</div>
                  {macros.length===0?(
                    <div style={{textAlign:'center',padding:'16px',color:'var(--text40)',fontSize:10,border:'1px dashed #1e1e30',borderRadius:6}}>
                      No macros yet — create one in the KEYS tab first
                    </div>
                  ):(
                    <div style={{display:'flex',flexDirection:'column',gap:5}}>
                      {macros.map(mc=>(
                        <button key={mc.id} onClick={()=>up({macroId:mc.id})}
                          style={{padding:'9px 12px',background:m.macroId===mc.id?'rgba(255,211,42,0.1)':'transparent',border:`1px solid ${m.macroId===mc.id?'rgba(255,211,42,0.4)':'var(--border)'}`,borderRadius:6,color:m.macroId===mc.id?'#ffd32a':'var(--text40)',fontSize:10,textAlign:'left',letterSpacing:1,fontWeight:m.macroId===mc.id?700:400}}>
                          ⚡ {mc.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{fontSize:9,color:'var(--text40)',letterSpacing:1,marginTop:8}}>Macro fires on key tap</div>
                </div>
              )}

              {/* Save / Cancel */}
              <div style={{display:'flex',gap:8,marginTop:16}}>
                <button onClick={()=>setM(null)} style={{flex:1,padding:'9px',background:'transparent',border:`1px solid ${T.border}`,borderRadius:6,color:T.faint,fontSize:9,letterSpacing:2}}>CANCEL</button>
                <button onClick={save}
                  disabled={!m.key||!m.bindType||(m.bindType==='track'&&(m.selectedTrackId===null||m.selectedTrackId===undefined))||(m.bindType==='macro'&&!m.macroId)||(m.bindType==='fx'&&(!m.fxParam||(m.fxTarget==='track'&&(m.fxTrackId===null||m.fxTrackId===undefined))))}
                  style={{flex:2,padding:'9px',background:m.bindType&&m.key?`${activeColor}14`:'transparent',border:`1px solid ${m.bindType&&m.key?activeColor+'44':'var(--border)'}`,borderRadius:6,color:m.bindType&&m.key?activeColor:'var(--text20)',fontSize:10,letterSpacing:2,fontWeight:700}}>
                  SAVE BINDING
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ━━━ GESTURE EDITOR MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {gestureModal&&gestureModal.trackId!==null&&gestureModal.trackId!==undefined&&(()=>{
        const {trackId,awaitingKey}=gestureModal;
        const track=tracks.find(t=>t.id===trackId);
        const trackBind=getTrackBinding(trackId);
        const boundKey=trackBind?.[0];
        const gestures=trackBind?.[1]||{};
        const tap=gestures.tap||'smartRecord';
        const doubleTap=gestures.doubleTap||'playStop';
        const hold=gestures.hold||'clear';
        const ACTS=[
          {v:'─────────',l:'── RECORDING ──',disabled:true},
          {v:'smartRecord',l:'SMART REC — context-aware: empty=rec, recording=stop, playing=overdub'},
          {v:'record',l:'RECORD — start/stop raw recording'},
          {v:'overdub',l:'OVERDUB — layer audio on top of loop'},
          {v:'punchIn',l:'PUNCH IN — replace defined region of loop'},
          {v:'─────────',l:'── PLAYBACK ──',disabled:true},
          {v:'playStop',l:'PLAY / STOP — toggle playback'},
          {v:'restart',l:'RESTART — jump back to loop start mid-play'},
          {v:'─────────',l:'── LOOP SETTINGS ──',disabled:true},
          {v:'reverse',l:'REVERSE — toggle reverse playback'},
          {v:'togglePlayMode',l:'PLAY MODE — cycle: Loop → One-shot → Ping-pong'},
          {v:'cycleSpeed',l:'SPEED — cycle: 1× → 2× → 4× → ½× → ¼×'},
          {v:'cycleStopMode',l:'STOP MODE — cycle: Immediate → Loop → Bar → Phrase → Fade'},
          {v:'─────────',l:'── MUTE / SOLO ──',disabled:true},
          {v:'mute',l:'MUTE — toggle mute (respects mute fade)'},
          {v:'solo',l:'SOLO — solo this track, mute all others (toggle)'},
          {v:'─────────',l:'── RECORD OPTIONS ──',disabled:true},
          {v:'cycleCountIn',l:'COUNT-IN — cycle: Off → 1 bar → 2 bars'},
          {v:'cycleAutoRec',l:'AUTO-REC — cycle: Off → 1 → 2 → 4 → 8 bars'},
          {v:'toggleThreshold',l:'THRESHOLD REC — toggle auto-start on audio input'},
          {v:'─────────',l:'── FX TOGGLES ──',disabled:true},
          {v:'toggleEQ',l:'FX: TOGGLE EQ on/off'},
          {v:'toggleComp',l:'FX: TOGGLE COMPRESSOR on/off'},
          {v:'toggleReverb',l:'FX: TOGGLE REVERB SEND on/off'},
          {v:'toggleDelay',l:'FX: TOGGLE DELAY SEND on/off'},
          {v:'─────────',l:'── OTHER ──',disabled:true},
          {v:'overdubUndoOrErase',l:'UNDO OVERDUB / ERASE — undo overdub while playing, erase when stopped'},
          {v:'clear',l:'CLEAR — erase loop completely'},
          {v:'none',l:'— DO NOTHING —'},
        ];
        const updGesture=(slot,val)=>{
          if(!boundKey)return;
          setBindings(p=>({...p,[boundKey]:{...p[boundKey],[slot]:val}}));
        };
        const sel=(slot,val)=>(
          <select value={val} onChange={e=>{if(e.target.value==='─────────')return;updGesture(slot,e.target.value)}}
            style={{background:darkMode?'var(--inset)':'#f5f5f5',color:T.soft,border:`1px solid var(--border)`,borderRadius:4,padding:'5px 8px',fontSize:10,letterSpacing:1,width:'100%',cursor:'pointer'}}>
            {ACTS.map(a=><option key={a.v} value={a.v} disabled={a.disabled} style={{color:a.disabled?(darkMode?'#303050':'#aaa'):T.soft,background:darkMode?'var(--inset)':'#f5f5f5'}}>{a.l}</option>)}
          </select>
        );
        return(
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,backdropFilter:'blur(10px)'}}>
            <div style={{background:'var(--card)',border:`2px solid ${track?.color||'#444'}44`,borderRadius:14,padding:'24px 28px',minWidth:340,maxWidth:420,animation:'fadeUp 0.15s ease'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div>
                  <div style={{fontSize:10,color:track?.color||'#aaa',letterSpacing:4,marginBottom:4,fontWeight:700}}>GESTURE BINDING</div>
                  <div style={{fontSize:16,color:T.offwhite,letterSpacing:2,fontWeight:700}}>{track?.name}</div>
                </div>
                <button onClick={()=>setGestureModal(null)} style={{background:'transparent',border:'none',color:T.muted,fontSize:20,padding:0,lineHeight:1}}>✕</button>
              </div>
              <div style={{marginBottom:14,padding:'10px 12px',background:'var(--inset)',border:`1px solid ${T.border}`,borderRadius:8}}>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:8,fontWeight:700}}>BOUND KEY</div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{fontSize:24,color:boundKey?track?.color:'#222240',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${boundKey?track?.color+'44':'var(--border3)'}`,borderRadius:6,padding:'6px 14px',minWidth:44,textAlign:'center',letterSpacing:2}}>
                    {awaitingKey?<span style={{color:T.amber,animation:'pulse .5s infinite'}}>…</span>:boundKey?boundKey.toUpperCase():'—'}
                  </div>
                  <div style={{flex:1}}>
                    <button onClick={()=>setGestureModal(p=>({...p,awaitingKey:true}))}
                      style={{background:'rgba(30,144,255,0.08)',border:'1px solid rgba(30,144,255,0.35)',color:'#1e90ff',borderRadius:5,padding:'6px 14px',fontSize:10,letterSpacing:2,width:'100%'}}>
                      {awaitingKey?'PRESS ANY KEY…':'CHANGE KEY'}
                    </button>
                    {awaitingKey&&<div style={{fontSize:9,color:T.faint,letterSpacing:2,marginTop:4,textAlign:'center'}}>ESC to cancel</div>}
                    {boundKey&&<button onClick={()=>{setBindings(p=>{const n={...p};delete n[boundKey];return n;});}}
                      style={{background:'transparent',border:`1px solid ${T.border}`,color:T.muted,borderRadius:4,padding:'3px 8px',fontSize:9,letterSpacing:2,width:'100%',marginTop:4}}>REMOVE BINDING</button>}
                  </div>
                </div>
              </div>
              {[
                {slot:'tap',label:'TAP',desc:'Single press',color:'#2ed573',val:tap},
                {slot:'doubleTap',label:'DOUBLE TAP',desc:'Two presses within 280ms',color:'#ff9f43',val:doubleTap},
                {slot:'hold',label:'HOLD',desc:'Press and hold 500ms+',color:'#ff4d4d',val:hold},
              ].map(({slot,label,desc,color,val})=>(
                <div key={slot} style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${color}18`,borderRadius:8,borderLeft:`2px solid ${color}44`}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                    <span style={{fontSize:10,color,letterSpacing:3,fontWeight:700}}>{label}</span>
                    <span style={{fontSize:10,color:T.muted,letterSpacing:1}}>{desc}</span>
                  </div>
                  {boundKey?sel(slot,val):<div style={{fontSize:10,color:T.faint,letterSpacing:2}}>Assign a key first</div>}
                </div>
              ))}
              <div style={{marginTop:2,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:8,fontWeight:700}}>WHEN STOPPING RECORD →</div>
                <div style={{display:'flex',gap:6}}>
                  {['play','overdub'].map(m=>(
                    <button key={m} onClick={()=>upd(trackId,{stopRecMode:m})}
                      style={{flex:1,padding:'6px',
                        background:track?.stopRecMode===m?m==='overdub'?'rgba(253,121,168,0.1)':'rgba(46,213,115,0.1)':'transparent',
                        border:`1px solid ${track?.stopRecMode===m?m==='overdub'?`${T.pink}44`:'rgba(46,213,115,0.4)':'var(--border3)'}`,
                        borderRadius:4,
                        color:track?.stopRecMode===m?m==='overdub'?T.pink:T.green:T.faint,
                        fontSize:10,letterSpacing:2}}>
                      {m==='play'?'▶ PLAY LOOP':'⊕ OVERDUB'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ━━━ MACRO EDITOR MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {macroModal&&(()=>{
        const{macro,isNew}=macroModal;
        const TRACK_CMDS=['groupPlay','groupStop','groupMute','groupUnmute','groupClear','groupToggleMute',
          'groupToggleReverb','groupToggleDelay','groupToggleEQ','groupToggleComp',
          'groupToggleReverse','groupSetPlayMode','groupSetSpeed','groupRestartLoops',
          'groupFadeOut','groupFadeIn'];
        const SOLO_CMDS=['soloTrack'];
        const needsTracks=TRACK_CMDS.includes(macro.command);
        const needsSoloTrack=SOLO_CMDS.includes(macro.command);
        const needsBpmVal=macro.command==='bpmSet';
        const needsDuration=['masterFadeOut','masterFadeIn','groupFadeOut','groupFadeIn'].includes(macro.command);
        const needsPlayMode=macro.command==='groupSetPlayMode';
        const needsSpeed=macro.command==='groupSetSpeed';
        const setField=(key,val)=>setMacroModal(p=>({...p,macro:{...p.macro,[key]:val}}));
        const setParam=(key,val)=>setMacroModal(p=>({...p,macro:{...p.macro,params:{...p.macro.params,[key]:val}}}));
        const toggleTrack=(id)=>{const cur=macro.params.trackIds||[];setParam('trackIds',cur.includes(id)?cur.filter(x=>x!==id):[...cur,id].sort((a,b)=>a-b));};
        const save=()=>{if(!macro.name.trim())return;setMacros(p=>isNew?[...p,macro]:p.map(m=>m.id===macro.id?macro:m));setMacroModal(null);};
        const ALL_CMDS=[
          // TRACK GROUPS — select specific tracks
          {v:'groupPlay',l:'▶ Group Play',g:'TRACK GROUPS'},
          {v:'groupStop',l:'■ Group Stop',g:'TRACK GROUPS'},
          {v:'groupToggleMute',l:'⊙ Group Toggle Mute',g:'TRACK GROUPS'},
          {v:'groupMute',l:'⊙ Group Mute (force on)',g:'TRACK GROUPS'},
          {v:'groupUnmute',l:'⊘ Group Unmute (force off)',g:'TRACK GROUPS'},
          {v:'groupClear',l:'✕ Group Clear',g:'TRACK GROUPS'},
          {v:'groupToggleReverb',l:'~ Group Toggle Reverb',g:'TRACK GROUPS'},
          {v:'groupToggleDelay',l:'⏺ Group Toggle Delay',g:'TRACK GROUPS'},
          {v:'groupToggleEQ',l:'EQ Group Toggle EQ',g:'TRACK GROUPS'},
          {v:'groupToggleComp',l:'⊓ Group Toggle Compressor',g:'TRACK GROUPS'},
          {v:'groupToggleReverse',l:'⟵ Group Toggle Reverse',g:'TRACK GROUPS'},
          {v:'groupSetPlayMode',l:'∞ Group Set Play Mode',g:'TRACK GROUPS'},
          {v:'groupSetSpeed',l:'SPD Group Set Speed',g:'TRACK GROUPS'},
          {v:'groupRestartLoops',l:'⟳ Group Restart Loops',g:'TRACK GROUPS'},
          {v:'soloTrack',l:'◎ Solo Track',g:'TRACK GROUPS'},
          // MASTER — all tracks
          {v:'fullDrop',l:'⬛ Full Drop (mute all, loops keep running)',g:'MASTER'},
          {v:'fullBring',l:'⬛ Full Bring (unmute all)',g:'MASTER'},
          {v:'unsoloAll',l:'⊙ Unsolo All',g:'MASTER'},
          {v:'stopAllMute',l:'■⊙ Stop + Mute All',g:'MASTER'},
          {v:'playFromTop',l:'⟳ Play From Top (reset clock)',g:'MASTER'},
          {v:'toggleReverbAll',l:'~ Toggle Reverb All',g:'MASTER'},
          {v:'toggleDelayAll',l:'⏺ Toggle Delay All',g:'MASTER'},
          // TEMPO
          {v:'bpmDouble',l:'×2 BPM Double',g:'TEMPO'},
          {v:'bpmHalf',l:'÷2 BPM Half',g:'TEMPO'},
          {v:'bpmSet',l:'= BPM Set (specific value)',g:'TEMPO'},
          // FADE
          {v:'masterFadeOut',l:'↘ Master Fade Out (all tracks)',g:'FADE'},
          {v:'masterFadeIn',l:'↗ Master Fade In (all tracks)',g:'FADE'},
          {v:'groupFadeOut',l:'↘ Group Fade Out (selected tracks)',g:'FADE'},
          {v:'groupFadeIn',l:'↗ Group Fade In (selected tracks)',g:'FADE'},
        ];
        const groups=[...new Set(ALL_CMDS.map(c=>c.g))];
        const iB={background:darkMode?'var(--inset)':'#f5f5f5',color:T.offwhite,border:`1px solid ${T.border}`,borderRadius:5,padding:'6px 10px',fontSize:11,letterSpacing:1,outline:'none',fontFamily:'inherit',fontWeight:700};
        return(
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(12px)'}}>
            <div style={{background:'var(--card)',border:'2px solid rgba(255,211,42,0.25)',borderRadius:14,padding:'24px 28px',minWidth:360,maxWidth:440,animation:'fadeUp 0.15s ease',maxHeight:'90vh',overflowY:'auto'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                <div>
                  <div style={{fontSize:10,color:'#ffd32a',letterSpacing:5,marginBottom:4,fontWeight:700}}>⚡ {isNew?'NEW MACRO':'EDIT MACRO'}</div>
                  <div style={{fontSize:14,color:T.offwhite,letterSpacing:2,fontWeight:700}}>COMMAND BUILDER</div>
                </div>
                <button onClick={()=>setMacroModal(null)} style={{background:'transparent',border:'none',color:T.muted,fontSize:20,padding:0}}>✕</button>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:6,fontWeight:700}}>MACRO NAME</div>
                <input value={macro.name} onChange={e=>setField('name',e.target.value)} style={{...iB,width:'100%',boxSizing:'border-box'}} placeholder="e.g. Drop Bass, Chorus In…"/>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:6,fontWeight:700}}>COMMAND</div>
                <select value={macro.command} onChange={e=>setField('command',e.target.value)} style={{...iB,width:'100%',boxSizing:'border-box'}}>
                  {groups.map(g=>(
                    <optgroup key={g} label={`── ${g} ──`} style={{color:T.faint,background:darkMode?'var(--inset)':'#f5f5f5'}}>
                      {ALL_CMDS.filter(c=>c.g===g).map(c=>(
                        <option key={c.v} value={c.v} style={{color:T.offwhite,background:darkMode?'var(--inset)':'#f5f5f5'}}>{c.l}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              {needsTracks&&(
                <div style={{marginBottom:12,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                  <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:8,fontWeight:700}}>SELECT TRACKS</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
                    {tracks.map(t=>{
                      const sel=(macro.params.trackIds||[]).includes(t.id);
                      return(
                        <button key={t.id} onClick={()=>toggleTrack(t.id)}
                          style={{padding:'6px',background:sel?`${t.color}18`:'transparent',border:`1px solid ${sel?t.color+'55':'var(--border2)'}`,borderRadius:4,color:sel?t.color:T.faint,fontSize:10,letterSpacing:1}}>
                          {t.name.replace('LOOP ','L')}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{fontSize:10,color:T.faint,marginTop:6,display:'flex',gap:8}}>
                    <button onClick={()=>setParam('trackIds',tracks.map(t=>t.id))} style={{background:'transparent',border:'none',color:T.muted,fontSize:10,cursor:'pointer',padding:0}}>SELECT ALL</button>
                    <span style={{color:T.faint}}>·</span>
                    <button onClick={()=>setParam('trackIds',[])} style={{background:'transparent',border:'none',color:T.muted,fontSize:10,cursor:'pointer',padding:0}}>CLEAR ALL</button>
                  </div>
                </div>
              )}
              {needsSoloTrack&&(
                <div style={{marginBottom:12,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                  <div style={{fontSize:10,color:T.soft,letterSpacing:3,marginBottom:8,fontWeight:700}}>SOLO TRACK</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
                    {tracks.map(t=>{
                      const sel=macro.params.trackId===t.id;
                      return(
                        <button key={t.id} onClick={()=>setParam('trackId',t.id)}
                          style={{padding:'6px',background:sel?`${t.color}18`:'transparent',border:`1px solid ${sel?t.color+'55':'var(--border2)'}`,borderRadius:4,color:sel?t.color:T.faint,fontSize:10}}>
                          {t.name.replace('LOOP ','L')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {needsBpmVal&&(
                <div style={{marginBottom:12,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                  <div style={{fontSize:10,color:T.amber,letterSpacing:3,marginBottom:6,fontWeight:700}}>TARGET BPM</div>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <input type="range" min={20} max={300} value={macro.params.value||120} onChange={e=>setParam('value',Number(e.target.value))} style={{flex:1,accentColor:T.amber}}/>
                    <span style={{fontSize:20,color:T.amber,minWidth:44,textAlign:'right',fontWeight:900}}>{macro.params.value||120}</span>
                  </div>
                </div>
              )}
              {needsDuration&&(
                <div style={{marginBottom:12,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                  <div style={{fontSize:10,color:T.purple,letterSpacing:3,marginBottom:6,fontWeight:700}}>DURATION (seconds)</div>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <input type="range" min={0.2} max={16} step={0.1} value={macro.params.duration||4} onChange={e=>setParam('duration',parseFloat(e.target.value))} style={{flex:1,accentColor:T.purple}}/>
                    <span style={{fontSize:20,color:T.purple,minWidth:48,textAlign:'right',fontWeight:900}}>{(macro.params.duration||4).toFixed(1)}s</span>
                  </div>
                </div>
              )}
              {needsPlayMode&&(
                <div style={{marginBottom:12,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                  <div style={{fontSize:10,color:'#ffd32a',letterSpacing:3,marginBottom:8,fontWeight:700}}>PLAY MODE</div>
                  <div style={{display:'flex',gap:6}}>
                    {[['loop','∞ Loop'],['oneshot','1× One-shot'],['pingpong','↔ Ping-pong']].map(([v,l])=>(
                      <button key={v} onClick={()=>setParam('playMode',v)}
                        style={{flex:1,padding:'7px',background:(macro.params.playMode||'loop')===v?'rgba(255,211,42,0.12)':'transparent',
                          border:`1px solid ${(macro.params.playMode||'loop')===v?'rgba(255,211,42,0.5)':'var(--border)'}`,
                          borderRadius:5,color:(macro.params.playMode||'loop')===v?'#ffd32a':T.muted,fontSize:10}}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {needsSpeed&&(
                <div style={{marginBottom:12,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                  <div style={{fontSize:10,color:T.amber,letterSpacing:3,marginBottom:8,fontWeight:700}}>PLAYBACK SPEED</div>
                  <div style={{display:'flex',gap:6}}>
                    {[[0.25,'¼×'],[0.5,'½×'],[1,'1×'],[2,'2×'],[4,'4×']].map(([v,l])=>(
                      <button key={v} onClick={()=>setParam('speed',v)}
                        style={{flex:1,padding:'7px',background:(macro.params.speed||1)===v?'rgba(255,159,67,0.12)':'transparent',
                          border:`1px solid ${(macro.params.speed||1)===v?'rgba(255,159,67,0.5)':'var(--border)'}`,
                          borderRadius:5,color:(macro.params.speed||1)===v?T.amber:T.muted,fontSize:11,fontWeight:700}}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* ── KEY BINDING (integrated into macro setup) ── */}
              {(()=>{
                const existingMacroKey=Object.entries(bindings).find(([,v])=>v.type==='macro'&&v.macroId===macro.id)?.[0];
                const isAssigningThisMacro=assigning?.type==='macro'&&assigning?.macroId===macro.id;
                return(
                  <div style={{marginBottom:12,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:'1px solid rgba(255,211,42,0.2)',borderRadius:8,borderLeft:'2px solid rgba(255,211,42,0.4)'}}>
                    <div style={{fontSize:10,color:'#ffd32a',letterSpacing:3,marginBottom:8,fontWeight:700}}>KEY BINDING</div>
                    <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                      {existingMacroKey?(
                        <>
                          <div style={{fontSize:18,color:'#ffd32a',background:'#0c0c0a',border:'1px solid rgba(255,211,42,0.3)',borderRadius:5,padding:'4px 12px',fontWeight:700,letterSpacing:2}}>{existingMacroKey.toUpperCase()}</div>
                          <button onClick={()=>setAssigning({type:'macro',macroId:macro.id})} style={{background:'transparent',border:'1px solid rgba(255,211,42,0.3)',color:isAssigningThisMacro?T.amber:'#ffd32a',borderRadius:4,padding:'4px 10px',fontSize:10,letterSpacing:1,animation:isAssigningThisMacro?'pulse .6s infinite':'none'}}>
                            {isAssigningThisMacro?'PRESS ANY KEY…':'CHANGE KEY'}
                          </button>
                          <button onClick={()=>{setBindings(p=>{const n={...p};delete n[existingMacroKey];return n;});}} style={{background:'transparent',border:`1px solid ${T.border}`,color:T.muted,borderRadius:4,padding:'4px 8px',fontSize:10}}>REMOVE</button>
                        </>
                      ):(
                        <button onClick={()=>setAssigning({type:'macro',macroId:macro.id})} style={{background:isAssigningThisMacro?'rgba(255,159,67,0.08)':'rgba(255,211,42,0.06)',border:`1px solid ${isAssigningThisMacro?'rgba(255,159,67,0.4)':'rgba(255,211,42,0.25)'}`,color:isAssigningThisMacro?T.amber:'rgba(255,211,42,0.7)',borderRadius:4,padding:'6px 14px',fontSize:10,letterSpacing:2,animation:isAssigningThisMacro?'pulse .6s infinite':'none'}}>
                          {isAssigningThisMacro?'PRESS ANY KEY…':'+ ASSIGN KEY'}
                        </button>
                      )}
                      {!isAssigningThisMacro&&<div style={{fontSize:9,color:T.faint,letterSpacing:1}}>Fires on key tap · ESC to cancel</div>}
                    </div>
                  </div>
                );
              })()}
              <div style={{display:'flex',gap:8,marginTop:6}}>
                <button onClick={()=>setMacroModal(null)} style={{flex:1,padding:'9px',background:'transparent',border:`1px solid ${T.border}`,borderRadius:6,color:T.muted,fontSize:10,letterSpacing:2}}>CANCEL</button>
                <button onClick={save} style={{flex:2,padding:'9px',background:'rgba(255,211,42,0.08)',border:'1px solid rgba(255,211,42,0.4)',borderRadius:6,color:'#ffd32a',fontSize:10,letterSpacing:2,fontWeight:700}}>
                  {isNew?'CREATE MACRO':'SAVE CHANGES'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ━━━ FX KEY BINDING MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {fxKbModal&&(()=>{
        const{target,trackId,param,label,isKnob,awaitingKey,step2,assignedKey}=fxKbModal;
        const currentKey=getFxKey(target,trackId,param);
        const dispKey=step2?assignedKey:currentKey;
        const binding=dispKey?fxBindings[dispKey]:null;
        const trackObj=tracks.find(t=>t.id===trackId);
        const col=target==='track'?(trackObj?.color||T.teal):'#1e90ff';
        const direction=binding?.direction||'up';
        const holdSpeed=binding?.holdSpeed||'medium';
        const holdMin=binding?.holdMin??fxKbModal.min??0;
        const holdMax=binding?.holdMax??fxKbModal.max??1;
        const tap=binding?.tap||'toggle';
        const doubleTap=binding?.doubleTap||'none';
        const updFx=(k,v)=>{if(!dispKey)return;setFxBindings(p=>({...p,[dispKey]:{...p[dispKey],[k]:v}}));};
        const TOGGLE_ACTS=[{v:'none',l:'— DO NOTHING —'},{v:'toggle',l:'TOGGLE — flip on/off'},{v:'reset',l:'RESET to default'}];
        return(
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,backdropFilter:'blur(10px)'}}>
            <div style={{background:'var(--card)',border:`2px solid ${col}44`,borderRadius:14,padding:'24px 28px',minWidth:340,maxWidth:440,animation:'fadeUp 0.15s ease',maxHeight:'90vh',overflowY:'auto'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div>
                  <div style={{fontSize:10,color:col,letterSpacing:4,marginBottom:4,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>FX KEY BINDING</div>
                  <div style={{fontSize:16,color:T.soft,fontWeight:700}}>{label}</div>
                  {target==='track'&&trackObj&&<div style={{fontSize:11,color:trackObj.color,marginTop:2}}>{trackObj.name}</div>}
                </div>
                <button onClick={()=>setFxKbModal(null)} style={{background:'transparent',border:'none',color:T.muted,fontSize:20,padding:0,lineHeight:1}}>✕</button>
              </div>
              {/* Key */}
              <div style={{marginBottom:14,padding:'10px 12px',background:'var(--inset)',border:`1px solid ${T.border}`,borderRadius:8}}>
                <div style={{fontSize:10,color:T.muted,letterSpacing:3,marginBottom:8,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>BOUND KEY</div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{fontSize:24,color:dispKey?col:'#222240',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${dispKey?col+'44':'var(--border3)'}`,borderRadius:6,padding:'6px 14px',minWidth:44,textAlign:'center',fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                    {awaitingKey?<span style={{color:T.amber,animation:'pulse .5s infinite'}}>…</span>:dispKey?dispKey.toUpperCase():'—'}
                  </div>
                  <div style={{flex:1}}>
                    <button onClick={()=>setFxKbModal(p=>({...p,awaitingKey:true,step2:false}))}
                      style={{background:`${col}12`,border:`1px solid ${col}35`,color:col,borderRadius:5,padding:'6px 14px',fontSize:11,width:'100%'}}>
                      {awaitingKey?'PRESS ANY KEY…':'CHANGE KEY'}
                    </button>
                    {awaitingKey&&<div style={{fontSize:9,color:T.muted,letterSpacing:2,marginTop:4,textAlign:'center',fontFamily:"'DM Mono',monospace"}}>ESC to cancel</div>}
                    {dispKey&&<button onClick={()=>{setFxBindings(p=>{const n={...p};delete n[dispKey];return n;});setFxKbModal(null);}}
                      style={{background:'transparent',border:`1px solid ${T.border}`,color:T.muted,borderRadius:4,padding:'3px 8px',fontSize:10,width:'100%',marginTop:4}}>REMOVE BINDING</button>}
                  </div>
                </div>
              </div>
              {isKnob?(
                <>
                  <div style={{marginBottom:10,padding:'8px 12px',background:'rgba(57,255,20,0.04)',border:'1px solid rgba(57,255,20,0.12)',borderRadius:6,fontSize:12,color:T.muted,lineHeight:1.6}}>
                    💡 <strong style={{color:T.soft}}>Hold</strong> key → knob ramps continuously. Release → stops. Assign two keys for both directions.
                  </div>
                  <div style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:3,marginBottom:8,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>DIRECTION</div>
                    <div style={{display:'flex',gap:8}}>
                      {[['up','↑ UP — increase'],['down','↓ DOWN — decrease']].map(([v,l])=>(
                        <button key={v} onClick={()=>updFx('direction',v)}
                          style={{flex:1,padding:'10px 8px',borderRadius:6,fontSize:12,fontWeight:700,
                            background:direction===v?`${col}18`:'transparent',
                            border:`1px solid ${direction===v?col+'55':'var(--border)'}`,
                            color:direction===v?col:T.muted}}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:3,marginBottom:8,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>SPEED</div>
                    <div style={{display:'flex',gap:6}}>
                      {[['slow','SLOW'],['medium','MEDIUM'],['fast','FAST']].map(([v,l])=>(
                        <button key={v} onClick={()=>updFx('holdSpeed',v)}
                          style={{flex:1,padding:'9px',borderRadius:6,fontSize:12,fontWeight:700,
                            background:holdSpeed===v?`${col}18`:'transparent',
                            border:`1px solid ${holdSpeed===v?col+'55':'var(--border)'}`,
                            color:holdSpeed===v?col:T.muted}}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:3,marginBottom:10,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>RANGE</div>
                    {[['MIN',holdMin,v=>updFx('holdMin',v)],['MAX',holdMax,v=>updFx('holdMax',v)]].map(([lbl,val,onChange])=>(
                      <div key={lbl} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                        <span style={{fontSize:11,color:T.muted,minWidth:32,fontFamily:"'DM Mono',monospace"}}>{lbl}</span>
                        <input type="range" min={fxKbModal.min??0} max={fxKbModal.max??1} step={fxKbModal.step??0.01}
                          value={val} onChange={e=>onChange(parseFloat(e.target.value))} style={{flex:1,accentColor:col}}/>
                        <span style={{fontSize:12,color:col,minWidth:40,textAlign:'right',fontFamily:"'DM Mono',monospace",fontWeight:700}}>{(+val).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ):(
                <>
                  {[['tap','TAP','Single press','#2ed573',tap],['doubleTap','DOUBLE TAP','Two presses within 280ms','#ff9f43',doubleTap]].map(([slot,lbl,desc,gc,val])=>(
                    <div key={slot} style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${gc}18`,borderRadius:8,borderLeft:`2px solid ${gc}44`}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <span style={{fontSize:10,color:gc,letterSpacing:3,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{lbl}</span>
                        <span style={{fontSize:11,color:T.muted}}>{desc}</span>
                      </div>
                      {dispKey?(
                        <select value={val} onChange={e=>updFx(slot,e.target.value)}
                          style={{background:darkMode?'var(--inset)':'#f5f5f5',color:T.soft,border:`1px solid ${T.border}`,borderRadius:4,padding:'5px 8px',fontSize:12,width:'100%'}}>
                          {TOGGLE_ACTS.map(a=><option key={a.v} value={a.v} style={{background:darkMode?'var(--inset)':'#f5f5f5'}}>{a.l}</option>)}
                        </select>
                      ):<div style={{fontSize:11,color:T.muted}}>Assign a key first</div>}
                    </div>
                  ))}
                </>
              )}
              <button onClick={()=>setFxKbModal(null)} style={{width:'100%',padding:'10px',background:'transparent',border:`1px solid ${T.border}`,borderRadius:6,color:T.muted,fontSize:12,marginTop:4}}>DONE</button>
            </div>
          </div>
        );
      })()}

      {/* ━━━ CONFLICT MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {conflictModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1100,backdropFilter:'blur(12px)'}}>
          <div style={{background:'var(--card)',border:'2px solid rgba(255,159,67,0.4)',borderRadius:12,padding:'24px 28px',maxWidth:360,animation:'fadeUp 0.15s ease'}}>
            <div style={{fontSize:11,color:T.amber,letterSpacing:3,marginBottom:8,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>⚠ ALREADY MAPPED</div>
            <div style={{fontSize:14,color:T.soft,marginBottom:16,lineHeight:1.5}}>{conflictModal.msg}</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setConflictModal(null)}
                style={{flex:1,padding:'9px',background:'transparent',border:`1px solid ${T.border}`,borderRadius:6,color:T.muted,fontSize:12}}>CANCEL</button>
              <button onClick={()=>{conflictModal.onConfirm();setConflictModal(null);}}
                style={{flex:2,padding:'9px',background:'rgba(255,159,67,0.1)',border:'1px solid rgba(255,159,67,0.4)',borderRadius:6,color:T.amber,fontSize:12,fontWeight:700}}>CLEAR PREVIOUS & SAVE</button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ KEY FLOW MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {keyFlowModal&&(()=>{
        const m=keyFlowModal;
        const upd=(u)=>setKeyFlowModal(p=>({...p,...u}));
        const back=()=>{
          if(m.step==='details')upd({step:'type',type:null});
          else if(m.step==='type')upd({step:'gesture',gesture:null});
          else setKeyFlowModal(null);
        };

        const GESTURE_COL={tap:'#2ed573',doubleTap:'#ff9f43',hold:'#ff4d4d'};
        const gc=m.gesture?GESTURE_COL[m.gesture]:'#39ff14';

        const TRACK_ACTS=[
          {v:'smartRecord',l:'Smart Record (recommended)'},
          {v:'playStop',l:'Play / Stop'},
          {v:'overdub',l:'Overdub'},
          {v:'overdubUndoOrErase',l:'Undo Overdub / Erase (recommended for HOLD)'},
          {v:'mute',l:'Mute'},
          {v:'solo',l:'Solo'},
          {v:'clear',l:'Clear Loop'},
          {v:'restart',l:'Restart'},
          {v:'reverse',l:'Toggle Reverse'},
          {v:'volumeUp',l:'Volume Up (HOLD — ramp up)'},
          {v:'volumeDown',l:'Volume Down (HOLD — ramp down)'},
          {v:'toggleEQ',l:'Toggle EQ'},
          {v:'toggleComp',l:'Toggle Compressor'},
          {v:'toggleReverb',l:'Toggle Reverb'},
          {v:'toggleDelay',l:'Toggle Delay'},
          {v:'none',l:'— Do Nothing —'},
        ];
        const GLOBAL_ACTS=[
          {v:'playAll',l:'Play All'},
          {v:'stopAll',l:'Stop All'},
          {v:'clearAll',l:'Clear All'},
          {v:'tapTempo',l:'Tap Tempo'},
          {v:'metronomeToggle',l:'Metronome On/Off'},
          {v:'exportMix',l:'Export Mix'},
          {v:'bpmDouble',l:'BPM × 2'},
          {v:'bpmHalf',l:'BPM ÷ 2'},
          {v:'masterFadeOut',l:'Master Fade Out'},
          {v:'masterFadeIn',l:'Master Fade In'},
          {v:'none',l:'— Do Nothing —'},
        ];
        const FX_P_INPUT=[
          {param:'gain',label:'Input Gain',isKnob:true,min:0,max:2,step:0.05,defaultValue:1},
          {param:'compEnabled',label:'Compressor On/Off',isKnob:false,defaultValue:false},
          {param:'compThreshold',label:'Comp Threshold',isKnob:true,min:-60,max:0,step:2,defaultValue:-24},
          {param:'compRatio',label:'Comp Ratio',isKnob:true,min:1,max:20,step:1,defaultValue:4},
          {param:'eqEnabled',label:'EQ On/Off',isKnob:false,defaultValue:false},
          {param:'eqLow',label:'EQ Low',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
          {param:'eqMid',label:'EQ Mid',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
          {param:'eqHigh',label:'EQ High',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
        ];
        const FX_P_TRACK=[
          {param:'volume',label:'Volume',isKnob:true,min:0,max:1.5,step:0.05,defaultValue:0.8},
          {param:'reverbSend',label:'Reverb Send',isKnob:true,min:0,max:1,step:0.05,defaultValue:0},
          {param:'delaySend',label:'Delay Send',isKnob:true,min:0,max:1,step:0.05,defaultValue:0},
          {param:'eqEnabled',label:'EQ On/Off',isKnob:false,defaultValue:false},
          {param:'eqLow',label:'EQ Low',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
          {param:'eqMid',label:'EQ Mid',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
          {param:'eqHigh',label:'EQ High',isKnob:true,min:-15,max:15,step:1,defaultValue:0},
          {param:'compEnabled',label:'Comp On/Off',isKnob:false,defaultValue:false},
          {param:'compThreshold',label:'Comp Threshold',isKnob:true,min:-60,max:0,step:2,defaultValue:-18},
          {param:'compRatio',label:'Comp Ratio',isKnob:true,min:1,max:20,step:1,defaultValue:4},
          {param:'delayTime',label:'Delay Time',isKnob:true,min:0.05,max:1,step:0.025,defaultValue:0.375},
          {param:'delayFeedback',label:'Delay Feedback',isKnob:true,min:0,max:0.9,step:0.05,defaultValue:0.3},
        ];
        const fxPList=m.fxTarget==='input'?FX_P_INPUT:FX_P_TRACK;
        const selFxP=fxPList.find(p=>p.param===m.fxParam);

        const ALL_MACRO_CMDS=[
          {v:'groupPlay',l:'▶ Group Play',g:'TRACK GROUPS'},{v:'groupStop',l:'■ Group Stop',g:'TRACK GROUPS'},
          {v:'groupToggleMute',l:'⊙ Toggle Mute',g:'TRACK GROUPS'},{v:'groupMute',l:'⊙ Mute',g:'TRACK GROUPS'},
          {v:'groupUnmute',l:'⊘ Unmute',g:'TRACK GROUPS'},{v:'groupClear',l:'✕ Clear',g:'TRACK GROUPS'},
          {v:'groupToggleReverb',l:'~ Toggle Reverb',g:'TRACK GROUPS'},{v:'groupToggleDelay',l:'⏺ Toggle Delay',g:'TRACK GROUPS'},
          {v:'groupToggleEQ',l:'EQ Toggle EQ',g:'TRACK GROUPS'},{v:'groupToggleComp',l:'⊓ Toggle Comp',g:'TRACK GROUPS'},
          {v:'groupRestartLoops',l:'⟳ Restart Loops',g:'TRACK GROUPS'},{v:'soloTrack',l:'◎ Solo Track',g:'TRACK GROUPS'},
          {v:'fullDrop',l:'⬛ Full Drop (mute all)',g:'MASTER'},{v:'fullBring',l:'⬛ Full Bring (unmute all)',g:'MASTER'},
          {v:'stopAllMute',l:'■⊙ Stop + Mute All',g:'MASTER'},{v:'playFromTop',l:'⟳ Play From Top',g:'MASTER'},
          {v:'bpmDouble',l:'×2 BPM Double',g:'TEMPO'},{v:'bpmHalf',l:'÷2 BPM Half',g:'TEMPO'},{v:'bpmSet',l:'= BPM Set',g:'TEMPO'},
          {v:'masterFadeOut',l:'↘ Master Fade Out',g:'FADE'},{v:'masterFadeIn',l:'↗ Master Fade In',g:'FADE'},
          {v:'groupFadeOut',l:'↘ Group Fade Out',g:'FADE'},{v:'groupFadeIn',l:'↗ Group Fade In',g:'FADE'},
        ];
        const macroNeedsTracks=['groupPlay','groupStop','groupMute','groupUnmute','groupClear','groupToggleMute','groupToggleReverb','groupToggleDelay','groupToggleEQ','groupToggleComp','groupRestartLoops','groupFadeOut','groupFadeIn'].includes(m.macroCommand);
        const macroNeedsSolo=m.macroCommand==='soloTrack';
        const macroNeedsBpm=m.macroCommand==='bpmSet';
        const macroNeedsDur=['masterFadeOut','masterFadeIn','groupFadeOut','groupFadeIn'].includes(m.macroCommand);
        const toggleMT=(id)=>{const cur=m.macroParams.trackIds||[];upd({macroParams:{...m.macroParams,trackIds:cur.includes(id)?cur.filter(x=>x!==id):[...cur,id].sort((a,b)=>a-b)}});};

        const iB={background:darkMode?'var(--inset)':'#f5f5f5',color:T.soft,border:`1px solid ${T.border}`,borderRadius:5,padding:'7px 10px',fontSize:12,outline:'none',fontFamily:'inherit',width:'100%',boxSizing:'border-box'};

        const doSave=()=>{
          if(!m.key||!m.gesture||!m.type)return;
          const doIt=()=>{
            if(m.type==='track'){
              if(m.trackId===null)return;
              // Clear any FX binding on this key first — two engines must never share a key
              setFxBindings(p=>{const n={...p};delete n[m.key];return n;});
              setBindings(p=>{
                const n={...p};
                // Default new track bindings to the standard 3-gesture layout
                // (matches PERFORM tab behavior). User's picked gesture overrides its slot.
                const defaults={type:'track',trackId:m.trackId,
                  tap:'smartRecord',doubleTap:'playStop',hold:'overdubUndoOrErase'};
                const ex=n[m.key]||defaults;
                const update={...ex,type:'track',trackId:m.trackId,[m.gesture]:m.trackAction};
                // For volumeUp/Down, save speed/range params alongside the binding
                if(m.trackAction==='volumeUp'||m.trackAction==='volumeDown'){
                  update[`${m.gesture}Params`]={
                    speed:m.macroParams?.speed||'medium',
                    volMin:m.macroParams?.volMin??0,
                    volMax:m.macroParams?.volMax??1.2,
                  };
                }
                n[m.key]=update;
                return n;
              });
            } else if(m.type==='global'){
              // Clear any FX binding on this key first
              setFxBindings(p=>{const n={...p};delete n[m.key];return n;});
              setBindings(p=>{
                const ex=p[m.key]||{type:'global',tap:'none',doubleTap:'none',hold:'none'};
                return{...p,[m.key]:{...ex,type:'global',[m.gesture]:m.globalAction}};
              });
            } else if(m.type==='fx'&&m.fxParam&&selFxP){
              const tId=m.fxTarget==='track'?m.fxTrackId:null;
              // Clear any regular binding on this key first
              setBindings(p=>{const n={...p};delete n[m.key];return n;});
              setFxBindings(p=>{
                const n={...p};
                Object.keys(n).forEach(k=>{if(n[k]?.target===m.fxTarget&&(m.fxTarget==='input'||n[k]?.trackId===tId)&&n[k]?.param===m.fxParam)delete n[k];});
                n[m.key]={type:'fxParam',target:m.fxTarget,trackId:tId,param:m.fxParam,label:selFxP.label,
                  isKnob:selFxP.isKnob,min:selFxP.min,max:selFxP.max,step:selFxP.step,defaultValue:selFxP.defaultValue,
                  direction:m.fxDirection,holdSpeed:m.fxSpeed,holdMin:m.fxHoldMin,holdMax:m.fxHoldMax,
                  tap:selFxP.isKnob?'none':'toggle',doubleTap:'none',hold:'none'};
                return n;
              });
            } else if(m.type==='macro'){
              if(!m.macroName.trim())return;
              // Clear any FX binding on this key first
              setFxBindings(p=>{const n={...p};delete n[m.key];return n;});
              const nm={id:`m${Date.now()}`,name:m.macroName,command:m.macroCommand,params:m.macroParams};
              setMacros(p=>[...p,nm]);
              setBindings(p=>{
                const ex=p[m.key]||{type:'macro',tap:'none',doubleTap:'none',hold:'none'};
                return{...p,[m.key]:{...ex,type:'macro',[m.gesture]:nm.id}};
              });
            }
            setKeyFlowModal(null);
          };

          // Conflict check
          const existingBinding=bindings[m.key];
          const existingGesture=existingBinding?.[m.gesture];
          const existingFx=fxBindings[m.key];
          if((existingGesture&&existingGesture!=='none')||existingFx){
            const what=existingFx?`FX: ${existingFx.label}`:existingGesture;
            setConflictModal({
              msg:`"${m.key.toUpperCase()}" ${m.gesture.toUpperCase()} is already mapped to "${what}". Clear it?`,
              onConfirm:doIt
            });
          } else {
            doIt();
          }
        };

        return(
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(12px)'}}>
            <div style={{background:'var(--card)',border:`2px solid ${gc}28`,borderRadius:14,padding:'22px 26px',width:'100%',maxWidth:460,maxHeight:'90vh',overflowY:'auto',animation:'fadeUp 0.15s ease'}}>

              {/* Header */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  {m.step!=='gesture'&&<button onClick={back} style={{background:'transparent',border:`1px solid ${T.border}`,color:T.muted,borderRadius:4,padding:'3px 8px',fontSize:11}}>← Back</button>}
                  <div>
                    <div style={{fontSize:9,color:T.muted,letterSpacing:3,fontFamily:"'DM Mono',monospace",fontWeight:700}}>KEY MAPPING</div>
                    <div style={{fontSize:14,color:T.soft,fontWeight:700}}>
                      {m.step==='gesture'&&'Select gesture'}
                      {m.step==='type'&&`${m.gesture?.toUpperCase()} → Select type`}
                      {m.step==='details'&&`${m.gesture?.toUpperCase()} → ${m.type?.toUpperCase()}`}
                    </div>
                  </div>
                </div>
                <button onClick={()=>setKeyFlowModal(null)} style={{background:'transparent',border:'none',color:T.muted,fontSize:20,padding:0,lineHeight:1}}>✕</button>
              </div>

              {/* Key display */}
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                <div style={{fontSize:22,color:m.key?gc:'#222240',background:darkMode?'var(--card3)':'#e8e8e8',border:`1px solid ${m.key?gc+'44':'var(--border3)'}`,borderRadius:6,padding:'5px 14px',minWidth:44,textAlign:'center',fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                  {m.awaitingKey?<span style={{color:T.amber,animation:'pulse .5s infinite'}}>…</span>:m.key?m.key.toUpperCase():'—'}
                </div>
                <div style={{flex:1}}>
                  <button onClick={()=>upd({awaitingKey:true})} style={{background:`${gc}12`,border:`1px solid ${gc}33`,color:gc,borderRadius:5,padding:'6px 12px',fontSize:12,width:'100%'}}>
                    {m.awaitingKey?'PRESS ANY KEY…':'CHANGE KEY'}
                  </button>
                  {m.awaitingKey&&<div style={{fontSize:9,color:T.muted,letterSpacing:2,marginTop:3,textAlign:'center',fontFamily:"'DM Mono',monospace"}}>ESC to cancel</div>}
                </div>
              </div>

              {/* STEP: GESTURE */}
              {m.step==='gesture'&&(
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {/* Show current assignments for this key IMMEDIATELY */}
                  {m.key&&(()=>{
                    const b=bindings[m.key];
                    const fxb=fxBindings[m.key];
                    if(!b&&!fxb)return(
                      <div style={{fontSize:11,color:T.muted,padding:'6px 10px',background:darkMode?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.04)',border:`1px solid ${T.border}`,borderRadius:6,marginBottom:2}}>
                        <strong style={{color:T.faint}}>{m.key.toUpperCase()}</strong> — no mappings yet
                      </div>
                    );
                    const ACT={smartRecord:'Smart Record',playStop:'Play/Stop',overdub:'Overdub',overdubUndoOrErase:'Undo/Erase',mute:'Mute',solo:'Solo',clear:'Clear',restart:'Restart',reverse:'Reverse',toggleEQ:'EQ On/Off',toggleComp:'Comp On/Off',toggleReverb:'Reverb',toggleDelay:'Delay',playAll:'Play All',stopAll:'Stop All',clearAll:'Clear All',tapTempo:'Tap Tempo',exportMix:'Export',masterFadeOut:'Fade Out',masterFadeIn:'Fade In',bpmDouble:'BPM ×2',bpmHalf:'BPM ÷2',volumeUp:'Volume Up',volumeDown:'Volume Down',metronomeToggle:'Metronome',none:'—'};
                    // Clear a specific gesture slot (tap/doubleTap/hold) for a key
                    const clearGesture=(e,slot)=>{
                      if(e){e.preventDefault();e.stopPropagation();}
                      setBindings(p=>{
                        if(!p[m.key])return p;
                        const updated={...p[m.key],[slot]:'none'};
                        delete updated[`${slot}Params`];
                        if(updated.tap==='none'&&updated.doubleTap==='none'&&updated.hold==='none'){
                          const n={...p};delete n[m.key];return n;
                        }
                        return{...p,[m.key]:updated};
                      });
                    };
                    const clearKey=(e)=>{
                      if(e){e.preventDefault();e.stopPropagation();}
                      const keyName=m.key.toUpperCase();
                      const doClear=()=>{
                        setBindings(p=>{const n={...p};delete n[m.key];return n;});
                        setFxBindings(p=>{const n={...p};delete n[m.key];return n;});
                        setKeyFlowModal(null);
                      };
                      setConflictModal({
                        msg:`Clear ALL gestures on "${keyName}"? This removes every binding (tap, double-tap, hold, FX) on this key.`,
                        onConfirm:doClear,
                      });
                    };
                    const clearFx=(e)=>{
                      if(e){e.preventDefault();e.stopPropagation();}
                      setFxBindings(p=>{const n={...p};delete n[m.key];return n;});
                    };
                    return(
                      <div style={{padding:'8px 10px',background:darkMode?'var(--border3)':'rgba(0,0,0,0.04)',border:`1px solid ${T.border}`,borderRadius:6,marginBottom:2}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                          <div style={{fontSize:9,color:T.muted,letterSpacing:2,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                            {m.key.toUpperCase()} — CURRENTLY MAPPED
                          </div>
                          <button type="button" onClick={clearKey}
                            style={{fontSize:8,letterSpacing:1,fontWeight:700,padding:'3px 7px',borderRadius:3,
                              background:'rgba(255,77,77,0.08)',border:'1px solid rgba(255,77,77,0.3)',color:T.red,cursor:'pointer'}}>
                            ✕ CLEAR KEY
                          </button>
                        </div>
                        {b&&[['tap','TAP','#2ed573'],['doubleTap','DBL','#ff9f43'],['hold','HOLD','#ff4d4d']].map(([slot,lbl,gc])=>{
                          const action=b[slot];
                          if(!action||action==='none')return null;
                          const trackName=b.trackId!==undefined?` (Loop ${b.trackId+1})`:'';
                          return(
                            <div key={slot} style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                              <span style={{fontSize:8,color:gc,fontWeight:700,minWidth:32,fontFamily:"'DM Mono',monospace"}}>{lbl}</span>
                              <span style={{fontSize:12,color:darkMode?'#fff':'#111',fontWeight:500,flex:1}}>{ACT[action]||action}{trackName}</span>
                              <button type="button" onClick={(e)=>clearGesture(e,slot)} title={`Clear ${lbl} binding`}
                                style={{fontSize:9,padding:'2px 6px',borderRadius:3,background:'transparent',border:`1px solid ${T.border}`,color:T.muted,cursor:'pointer',lineHeight:1}}>
                                ✕
                              </button>
                            </div>
                          );
                        })}
                        {fxb&&(
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={{fontSize:8,color:T.teal,fontWeight:700,minWidth:32,fontFamily:"'DM Mono',monospace"}}>HOLD</span>
                            <span style={{fontSize:12,color:darkMode?'#fff':'#111',fontWeight:500,flex:1}}>{fxb.label} {fxb.direction==='up'?'↑':'↓'}</span>
                            <button type="button" onClick={clearFx} title="Clear FX binding"
                              style={{fontSize:9,padding:'2px 6px',borderRadius:3,background:'transparent',border:`1px solid ${T.border}`,color:T.muted,cursor:'pointer',lineHeight:1}}>
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {m.simpleMode&&(
                    <div style={{fontSize:11,color:T.muted,padding:'6px 10px',background:'rgba(162,155,254,0.06)',border:'1px solid rgba(162,155,254,0.15)',borderRadius:6}}>
                      Binding: <strong style={{color:darkMode?'#fff':'#111'}}>{m.globalAction?.replace(/([A-Z])/g,' $1').trim().toUpperCase()}</strong> — pick gesture
                    </div>
                  )}
                  {[
                    {v:'tap',l:'TAP',desc:'Single keypress',color:'#2ed573'},
                    {v:'doubleTap',l:'DOUBLE TAP',desc:'Two presses within 280ms',color:'#ff9f43'},
                    {v:'hold',l:'HOLD',desc:'Press and hold 500ms+',color:'#ff4d4d'},
                  ].map(({v,l,desc,color})=>(
                    <button key={v} onClick={()=>{
                      if(m.simpleMode){
                        if(!m.key)return upd({gesture:v});
                        const doIt=()=>{
                          setBindings(p=>{
                            const ex=p[m.key]||{type:'global',tap:'none',doubleTap:'none',hold:'none'};
                            return{...p,[m.key]:{...ex,type:'global',[v]:m.globalAction}};
                          });
                          setKeyFlowModal(null);
                        };
                        const existingGesture=bindings[m.key]?.[v];
                        if(existingGesture&&existingGesture!=='none'&&existingGesture!==m.globalAction){
                          setConflictModal({msg:`"${m.key.toUpperCase()}" ${l} is already mapped to "${existingGesture}". Replace it?`,onConfirm:doIt});
                        } else { doIt(); }
                      } else {
                        upd({gesture:v,step:'type'});
                      }
                    }}
                      style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:8,
                        background:`${color}08`,border:`1px solid ${color}28`,color:darkMode?'#fff':'#111',textAlign:'left'}}>
                      <div style={{width:10,height:10,borderRadius:'50%',background:color,boxShadow:`0 0 6px ${color}`,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color}}>{l}</div>
                        <div style={{fontSize:11,color:T.muted,marginTop:2}}>{desc}</div>
                      </div>
                      <span style={{color:T.muted,fontSize:14}}>{m.simpleMode?'✓':'→'}</span>
                    </button>
                  ))}
                  {m.simpleMode&&!m.key&&(
                    <div style={{fontSize:11,color:T.amber,textAlign:'center',marginTop:4}}>⚠ Set a key first above</div>
                  )}
                </div>
              )}

              {/* STEP: TYPE */}
              {m.step==='type'&&(
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {[
                    {v:'track',l:'Track Loop',desc:'Record, play, overdub a loop',color:COLORS[0]},
                    {v:'global',l:'Global',desc:'Play All, Stop All, Tap Tempo…',color:T.purple},
                    {v:'fx',l:'FX Parameter',desc:'Control a knob or toggle',color:T.teal},
                    {v:'macro',l:'Macro',desc:'Build a multi-track command',color:'#ffd32a'},
                  ].map(({v,l,desc,color})=>(
                    <button key={v} onClick={()=>upd({type:v,step:'details'})}
                      style={{padding:'14px 12px',borderRadius:8,background:`${color}08`,border:`1px solid ${color}28`,color:T.soft,textAlign:'left'}}>
                      <div style={{fontSize:13,fontWeight:700,color,marginBottom:4}}>{l}</div>
                      <div style={{fontSize:11,color:T.muted,lineHeight:1.4}}>{desc}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP: DETAILS — TRACK */}
              {m.step==='details'&&m.type==='track'&&(
                <div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>SELECT TRACK</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
                      {tracks.map(t=>(
                        <button key={t.id} onClick={()=>upd({trackId:t.id})}
                          style={{padding:'8px 4px',borderRadius:6,fontSize:11,fontWeight:700,
                            background:m.trackId===t.id?`${t.color}18`:'transparent',
                            border:`1px solid ${m.trackId===t.id?t.color+'55':'var(--border2)'}`,
                            color:m.trackId===t.id?t.color:T.muted}}>
                          L{t.id+1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>ACTION</div>
                    <select value={m.trackAction} onChange={e=>upd({trackAction:e.target.value})} style={iB}>
                      {TRACK_ACTS.map(a=><option key={a.v} value={a.v} style={{background:darkMode?'var(--inset)':'#f5f5f5'}}>{a.l}</option>)}
                    </select>
                  </div>
                  {/* Volume up/down config — same as FX knob */}
                  {(m.trackAction==='volumeUp'||m.trackAction==='volumeDown')&&(
                    <div style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                      <div style={{fontSize:10,color:T.amber,letterSpacing:2,marginBottom:8,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                        HOLD CONFIG — {m.trackAction==='volumeUp'?'↑ VOLUME UP':'↓ VOLUME DOWN'}
                      </div>
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:5}}>Speed</div>
                        <div style={{display:'flex',gap:5}}>
                          {[['slow','SLOW'],['medium','MEDIUM'],['fast','FAST']].map(([v,l])=>(
                            <button key={v} onClick={()=>upd({macroParams:{...m.macroParams,speed:v}})}
                              style={{flex:1,padding:'7px',borderRadius:5,fontSize:10,fontWeight:700,
                                background:(m.macroParams?.speed||'medium')===v?'rgba(255,159,67,0.12)':'transparent',
                                border:`1px solid ${(m.macroParams?.speed||'medium')===v?'rgba(255,159,67,0.5)':'var(--border)'}`,
                                color:(m.macroParams?.speed||'medium')===v?T.amber:T.muted}}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:T.muted,marginBottom:5}}>Range</div>
                        {[['MIN',m.macroParams?.volMin??0,v=>upd({macroParams:{...m.macroParams,volMin:v}})],['MAX',m.macroParams?.volMax??1.5,v=>upd({macroParams:{...m.macroParams,volMax:v}})]].map(([lbl,val,onChange])=>(
                          <div key={lbl} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                            <span style={{fontSize:9,color:T.muted,minWidth:28}}>{lbl}</span>
                            <input type="range" min={0} max={1.5} step={0.05} value={val} onChange={e=>onChange(parseFloat(e.target.value))} style={{flex:1,accentColor:T.amber}}/>
                            <span style={{fontSize:10,color:T.amber,minWidth:32,textAlign:'right',fontFamily:"'DM Mono',monospace",fontWeight:700}}>{Math.round(val/1.5*100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={doSave} disabled={m.trackId===null||!m.key}
                    style={{width:'100%',padding:'11px',borderRadius:7,background:m.trackId!==null&&m.key?'rgba(57,255,20,0.1)':'transparent',
                      border:`1px solid ${m.trackId!==null&&m.key?'rgba(57,255,20,0.4)':'var(--border)'}`,
                      color:m.trackId!==null&&m.key?T.green:T.muted,fontSize:13,fontWeight:700,cursor:m.trackId!==null&&m.key?'pointer':'not-allowed'}}>
                    {!m.key?'⚠ SET A KEY FIRST':m.trackId===null?'⚠ SELECT A TRACK FIRST':'SAVE BINDING'}
                  </button>
                </div>
              )}

              {/* STEP: DETAILS — GLOBAL */}
              {m.step==='details'&&m.type==='global'&&(
                <div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>ACTION</div>
                    <select value={m.globalAction} onChange={e=>upd({globalAction:e.target.value})} style={iB}>
                      {GLOBAL_ACTS.map(a=><option key={a.v} value={a.v} style={{background:darkMode?'var(--inset)':'#f5f5f5'}}>{a.l}</option>)}
                    </select>
                  </div>
                  <button onClick={doSave} disabled={!m.key}
                    style={{width:'100%',padding:'11px',borderRadius:7,background:m.key?'rgba(162,155,254,0.1)':'transparent',
                      border:`1px solid ${m.key?'rgba(162,155,254,0.4)':'var(--border)'}`,color:m.key?T.purple:T.muted,fontSize:13,fontWeight:700,cursor:m.key?'pointer':'not-allowed'}}>
                    {!m.key?'⚠ SET A KEY FIRST':'SAVE BINDING'}
                  </button>
                </div>
              )}

              {/* STEP: DETAILS — FX */}
              {m.step==='details'&&m.type==='fx'&&(
                <div>
                  {/* Source */}
                  <div style={{marginBottom:8}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>SOURCE</div>
                    <div style={{display:'flex',gap:6}}>
                      {[['input','Input Chain'],['track','Loop Track']].map(([v,l])=>(
                        <button key={v} onClick={()=>upd({fxTarget:v,fxParam:null,fxTrackId:null})}
                          style={{flex:1,padding:'9px',borderRadius:6,fontSize:12,fontWeight:700,
                            background:m.fxTarget===v?`${T.teal}14`:'transparent',
                            border:`1px solid ${m.fxTarget===v?T.teal+'44':'var(--border)'}`,
                            color:m.fxTarget===v?T.teal:T.muted}}>{l}</button>
                      ))}
                    </div>
                  </div>
                  {/* Track picker if track */}
                  {m.fxTarget==='track'&&(
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>TRACK</div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
                        {tracks.map(t=>(
                          <button key={t.id} onClick={()=>upd({fxTrackId:t.id,fxParam:null})}
                            style={{padding:'7px 4px',borderRadius:5,fontSize:11,fontWeight:700,
                              background:m.fxTrackId===t.id?`${t.color}18`:'transparent',
                              border:`1px solid ${m.fxTrackId===t.id?t.color+'55':'var(--border2)'}`,
                              color:m.fxTrackId===t.id?t.color:T.muted}}>L{t.id+1}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Parameter list */}
                  {(m.fxTarget==='input'||(m.fxTarget==='track'&&m.fxTrackId!==null))&&(
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>PARAMETER</div>
                      <div style={{display:'flex',flexDirection:'column',gap:3,maxHeight:180,overflowY:'auto'}}>
                        {fxPList.map(p=>(
                          <button key={p.param} onClick={()=>upd({fxParam:p.param,fxIsKnob:p.isKnob,fxLabel:p.label,fxMin:p.min??0,fxMax:p.max??1,fxStep:p.step??0.01,fxDefault:p.defaultValue??0,fxHoldMin:p.min??0,fxHoldMax:p.max??1})}
                            style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:5,textAlign:'left',
                              background:m.fxParam===p.param?`${T.teal}10`:'transparent',
                              border:`1px solid ${m.fxParam===p.param?T.teal+'44':'var(--border2)'}`,
                              color:m.fxParam===p.param?T.teal:T.w70}}>
                            <span style={{fontSize:12,flex:1}}>{p.label}</span>
                            <span style={{fontSize:9,color:T.muted,fontFamily:"'DM Mono',monospace"}}>{p.isKnob?'KNOB':'TOGGLE'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Knob config */}
                  {m.fxParam&&m.fxIsKnob&&(
                    <>
                      <div style={{marginBottom:6,padding:'7px 10px',background:'rgba(57,255,20,0.04)',border:'1px solid rgba(57,255,20,0.12)',borderRadius:6,fontSize:11,color:T.muted}}>
                        💡 <strong style={{color:T.soft}}>Hold</strong> = ramp continuously. Two keys for bidirectional.
                      </div>
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>DIRECTION</div>
                        <div style={{display:'flex',gap:6}}>
                          {[['up','↑ UP'],['down','↓ DOWN']].map(([v,l])=>(
                            <button key={v} onClick={()=>upd({fxDirection:v})}
                              style={{flex:1,padding:'8px',borderRadius:5,fontSize:12,fontWeight:700,
                                background:m.fxDirection===v?`${T.teal}14`:'transparent',
                                border:`1px solid ${m.fxDirection===v?T.teal+'44':'var(--border)'}`,
                                color:m.fxDirection===v?T.teal:T.muted}}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>SPEED</div>
                        <div style={{display:'flex',gap:5}}>
                          {[['slow','SLOW'],['medium','MED'],['fast','FAST']].map(([v,l])=>(
                            <button key={v} onClick={()=>upd({fxSpeed:v})}
                              style={{flex:1,padding:'8px',borderRadius:5,fontSize:11,fontWeight:700,
                                background:m.fxSpeed===v?`${T.teal}14`:'transparent',
                                border:`1px solid ${m.fxSpeed===v?T.teal+'44':'var(--border)'}`,
                                color:m.fxSpeed===v?T.teal:T.muted}}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                        <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:8,fontFamily:"'DM Mono',monospace",fontWeight:700}}>RANGE</div>
                        {[['MIN',m.fxHoldMin,v=>upd({fxHoldMin:v})],['MAX',m.fxHoldMax,v=>upd({fxHoldMax:v})]].map(([lbl,val,onChange])=>(
                          <div key={lbl} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                            <span style={{fontSize:10,color:T.muted,minWidth:28,fontFamily:"'DM Mono',monospace"}}>{lbl}</span>
                            <input type="range" min={m.fxMin} max={m.fxMax} step={m.fxStep}
                              value={val} onChange={e=>onChange(parseFloat(e.target.value))} style={{flex:1,accentColor:T.teal}}/>
                            <span style={{fontSize:11,color:T.teal,minWidth:36,textAlign:'right',fontFamily:"'DM Mono',monospace",fontWeight:700}}>{(+val).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {m.fxParam&&!m.fxIsKnob&&(
                    <div style={{marginBottom:10,padding:'8px 10px',background:'rgba(0,206,201,0.04)',border:'1px solid rgba(0,206,201,0.15)',borderRadius:6,fontSize:11,color:T.muted}}>
                      On/off toggle. The <strong style={{color:T.soft}}>{m.gesture}</strong> gesture will flip it.
                    </div>
                  )}
                  <button onClick={doSave} disabled={!m.key||!m.fxParam||(m.fxTarget==='track'&&m.fxTrackId===null)}
                    style={{width:'100%',padding:'11px',borderRadius:7,
                      background:m.key&&m.fxParam?`${T.teal}10`:'transparent',
                      border:`1px solid ${m.key&&m.fxParam?T.teal+'44':'var(--border)'}`,
                      color:m.key&&m.fxParam?T.teal:T.muted,fontSize:13,fontWeight:700,cursor:m.key&&m.fxParam&&!(m.fxTarget==='track'&&m.fxTrackId===null)?'pointer':'not-allowed'}}>
                    {!m.key?'⚠ SET A KEY FIRST':m.fxTarget==='track'&&m.fxTrackId===null?'⚠ SELECT A TRACK FIRST':!m.fxParam?'⚠ SELECT A PARAMETER FIRST':'SAVE BINDING'}
                  </button>
                </div>
              )}

              {/* STEP: DETAILS — MACRO (Group Command) */}
              {m.step==='details'&&m.type==='macro'&&(
                <div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                      MACRO NAME <span style={{color:T.red}}>*</span> <span style={{color:T.amber,letterSpacing:1,fontWeight:400}}>required</span>
                    </div>
                    <input value={m.macroName} onChange={e=>upd({macroName:e.target.value})} placeholder="e.g. Drop Bass, Verse Out…"
                      style={{...iB,border:`1px solid ${m.macroName.trim()?T.border:'rgba(255,77,77,0.5)'}`}}/>
                    {!m.macroName.trim()&&(
                      <div style={{fontSize:10,color:T.red,marginTop:4,letterSpacing:1}}>
                        Give your macro a name so you can find it later.
                      </div>
                    )}
                  </div>

                  {/* Step 1: Track selection */}
                  <div style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:8,fontFamily:"'DM Mono',monospace",fontWeight:700}}>1 — WHICH TRACKS</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5,marginBottom:6}}>
                      {tracks.map(t=>{const sel=(m.macroParams.trackIds||[]).includes(t.id);return(
                        <button key={t.id} onClick={()=>toggleMT(t.id)}
                          style={{padding:'8px 4px',borderRadius:5,fontSize:11,fontWeight:700,
                            background:sel?`${t.color}18`:'transparent',
                            border:`1px solid ${sel?t.color+'55':'var(--border2)'}`,
                            color:sel?t.color:T.muted}}>L{t.id+1}</button>
                      );})}
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={()=>upd({macroParams:{...m.macroParams,trackIds:tracks.map(t=>t.id)}})} style={{background:'transparent',border:'none',color:T.muted,fontSize:10,cursor:'pointer',padding:0}}>SELECT ALL</button>
                      <span style={{color:T.faint}}>·</span>
                      <button onClick={()=>upd({macroParams:{...m.macroParams,trackIds:[]}})} style={{background:'transparent',border:'none',color:T.muted,fontSize:10,cursor:'pointer',padding:0}}>CLEAR</button>
                    </div>
                  </div>

                  {/* Step 2: Command */}
                  <div style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:8,fontFamily:"'DM Mono',monospace",fontWeight:700}}>2 — COMMAND</div>
                    <div style={{display:'flex',flexDirection:'column',gap:4}}>
                      {[
                        {v:'groupPlay',l:'▶ Play',desc:'Start selected tracks'},
                        {v:'groupStop',l:'■ Stop',desc:'Stop selected tracks'},
                        {v:'groupClear',l:'✕ Clear',desc:'Erase selected tracks'},
                        {v:'groupFadeIn',l:'↗ Fade In',desc:'Fade in selected tracks'},
                        {v:'groupFadeOut',l:'↘ Fade Out',desc:'Fade out selected tracks'},
                        {v:'bpmDouble',l:'×2 BPM Double',desc:'Double the BPM'},
                        {v:'bpmHalf',l:'÷2 BPM Half',desc:'Halve the BPM'},
                        {v:'groupToggleReverb',l:'~ Reverb On/Off',desc:'Toggle reverb on selected tracks'},
                        {v:'groupToggleDelay',l:'⏺ Delay On/Off',desc:'Toggle delay on selected tracks'},
                        {v:'groupToggleComp',l:'⊓ Compressor On/Off',desc:'Toggle compressor on selected tracks'},
                        {v:'groupToggleEQ',l:'EQ On/Off',desc:'Toggle EQ on selected tracks'},
                        {v:'groupCutoff',l:'⬥ Cutoff (HOLD key)',desc:'Hold key to sweep filter cutoff'},
                        {v:'fullDrop',l:'⬛ Full Drop',desc:'Mute all tracks instantly'},
                        {v:'fullBring',l:'▣ Full Bring',desc:'Unmute all tracks'},
                        {v:'playFromTop',l:'⟳ Play From Top',desc:'Reset clock, restart all loops'},
                      ].map(({v,l,desc})=>(
                        <button key={v} onClick={()=>upd({macroCommand:v})}
                          style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:6,textAlign:'left',
                            background:m.macroCommand===v?'rgba(255,211,42,0.1)':'transparent',
                            border:`1px solid ${m.macroCommand===v?'rgba(255,211,42,0.4)':'var(--border2)'}`,
                            color:m.macroCommand===v?'#ffd32a':'var(--text70)'}}>
                          <span style={{fontSize:12,fontWeight:700,minWidth:100}}>{l}</span>
                          <span style={{fontSize:10,color:'var(--text40)'}}>{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cutoff config — HOLD + direction + speed + range */}
                  {m.macroCommand==='groupCutoff'&&(
                    <div style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:'1px solid rgba(162,155,254,0.2)',borderRadius:8}}>
                      <div style={{fontSize:10,color:T.purple,letterSpacing:2,marginBottom:8,fontFamily:"'DM Mono',monospace",fontWeight:700}}>CUTOFF CONFIG (HOLD only)</div>
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:5}}>Direction</div>
                        <div style={{display:'flex',gap:6}}>
                          {[['up','↑ UP'],['down','↓ DOWN']].map(([v,l])=>(
                            <button key={v} onClick={()=>upd({macroParams:{...m.macroParams,direction:v}})}
                              style={{flex:1,padding:'7px',borderRadius:5,fontSize:11,fontWeight:700,background:(m.macroParams.direction||'up')===v?'rgba(162,155,254,0.12)':'transparent',border:`1px solid ${(m.macroParams.direction||'up')===v?'rgba(162,155,254,0.4)':'var(--border)'}`,color:(m.macroParams.direction||'up')===v?T.purple:T.muted}}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:5}}>Speed</div>
                        <div style={{display:'flex',gap:5}}>
                          {[['slow','SLOW'],['medium','MEDIUM'],['fast','FAST']].map(([v,l])=>(
                            <button key={v} onClick={()=>upd({macroParams:{...m.macroParams,speed:v}})}
                              style={{flex:1,padding:'7px',borderRadius:5,fontSize:10,fontWeight:700,background:(m.macroParams.speed||'medium')===v?'rgba(162,155,254,0.12)':'transparent',border:`1px solid ${(m.macroParams.speed||'medium')===v?'rgba(162,155,254,0.4)':'var(--border)'}`,color:(m.macroParams.speed||'medium')===v?T.purple:T.muted}}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:T.muted,marginBottom:5}}>Range (20Hz – 20kHz)</div>
                        {[['MIN',m.macroParams.cutoffMin??200,v=>upd({macroParams:{...m.macroParams,cutoffMin:v}})],['MAX',m.macroParams.cutoffMax??8000,v=>upd({macroParams:{...m.macroParams,cutoffMax:v}})]].map(([lbl,val,onChange])=>(
                          <div key={lbl} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                            <span style={{fontSize:9,color:T.muted,minWidth:28}}>{lbl}</span>
                            <input type="range" min={20} max={20000} step={10} value={val} onChange={e=>onChange(Number(e.target.value))} style={{flex:1,accentColor:T.purple}}/>
                            <span style={{fontSize:10,color:T.purple,minWidth:44,textAlign:'right',fontFamily:"'DM Mono',monospace",fontWeight:700}}>{val<1000?`${val}Hz`:`${(val/1000).toFixed(1)}k`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fade duration */}
                  {['groupFadeIn','groupFadeOut'].includes(m.macroCommand)&&(
                    <div style={{marginBottom:10,padding:'10px 12px',background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:8}}>
                      <div style={{fontSize:10,color:T.purple,letterSpacing:2,marginBottom:6,fontFamily:"'DM Mono',monospace",fontWeight:700}}>FADE DURATION</div>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <input type="range" min={0.2} max={16} step={0.1} value={m.macroParams.duration||4}
                          onChange={e=>upd({macroParams:{...m.macroParams,duration:parseFloat(e.target.value)}})} style={{flex:1,accentColor:T.purple}}/>
                        <span style={{fontSize:18,color:T.purple,minWidth:44,textAlign:'right',fontWeight:900,fontFamily:"'DM Mono',monospace"}}>{(m.macroParams.duration||4).toFixed(1)}s</span>
                      </div>
                    </div>
                  )}

                  <button onClick={doSave} disabled={!m.key||!m.macroName.trim()}
                    style={{width:'100%',padding:'11px',borderRadius:7,
                      background:m.key&&m.macroName.trim()?'rgba(255,211,42,0.1)':'transparent',
                      border:`1px solid ${m.key&&m.macroName.trim()?'rgba(255,211,42,0.4)':'var(--border)'}`,
                      color:m.key&&m.macroName.trim()?'#ffd32a':T.muted,fontSize:13,fontWeight:700,cursor:m.key&&m.macroName.trim()?'pointer':'not-allowed'}}>
                    {!m.key?'⚠ SET A KEY FIRST':!m.macroName.trim()?'⚠ NAME YOUR MACRO FIRST':'CREATE + SAVE BINDING'}
                  </button>
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* ━━━ FLOATING SUPPORT CHAT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Chat popup */}
      {chatPopupOpen&&(
        <div style={{position:'fixed',bottom:80,right:20,width:360,height:520,background:'var(--card)',border:`1px solid var(--border)`,borderRadius:16,boxShadow:'0 24px 64px rgba(0,0,0,0.8)',zIndex:2000,display:'flex',flexDirection:'column',overflow:'hidden',animation:'chatSlide 0.25s ease'}}>
          {/* Chat header */}
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'var(--card)',borderBottom:'1px solid var(--border2)',flexShrink:0}}>
            <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(145deg,#4dff1c,#26bb0d)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:'#000',boxShadow:'0 0 10px rgba(57,255,20,0.4)'}}>LG</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:T.offwhite,fontWeight:700,letterSpacing:1}}>Spool Support</div>
              <div style={{fontSize:9,color:T.green,letterSpacing:2}}>AI ASSISTANT · ONLINE</div>
            </div>
            <button onClick={()=>setChatPopupOpen(false)} style={{background:'transparent',border:'none',color:T.muted,fontSize:18,padding:0,lineHeight:1}}>✕</button>
          </div>
          {/* Quick chips */}
          <div style={{display:'flex',gap:5,flexWrap:'wrap',padding:'8px 10px',borderBottom:'1px solid #0e0e1e',flexShrink:0}}>
            {['How do I record?','Bind a key?','How do macros work?','Loops out of sync?'].map(q=>(
              <button key={q} onClick={()=>sendChat(q)} disabled={chatBusy}
                style={{background:darkMode?'var(--card2)':'#ececec',border:`1px solid ${T.border}`,borderRadius:14,padding:'4px 10px',fontSize:10,color:T.muted,cursor:'pointer',fontFamily:"'DM Mono',monospace",letterSpacing:0,transition:'all .15s'}}
                onMouseEnter={e=>{e.target.style.borderColor='rgba(57,255,20,0.3)';e.target.style.color=T.white;}}
                onMouseLeave={e=>{e.target.style.borderColor='var(--border2)';e.target.style.color=T.muted;}}>
                {q}
              </button>
            ))}
          </div>
          {/* Messages */}
          <div style={{flex:1,overflowY:'auto',padding:'10px 12px',display:'flex',flexDirection:'column',gap:8}}>
            {chatMsgs.length===0&&(
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,opacity:0.35}}>
                <div style={{fontSize:28}}>⌨️</div>
                <div style={{fontSize:10,color:T.faint,letterSpacing:2,textAlign:'center'}}>Ask anything about<br/>Spool</div>
              </div>
            )}
            {chatMsgs.map((m,i)=>(
              <div key={i} style={{display:'flex',gap:7,flexDirection:m.role==='user'?'row-reverse':'row',animation:'fadeUp 0.2s ease'}}>
                <div style={{width:22,height:22,borderRadius:5,flexShrink:0,marginTop:2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,
                  background:m.role==='ai'?'linear-gradient(145deg,#4dff1c,#26bb0d)':'var(--border2)',
                  color:m.role==='ai'?'#000':'var(--text40)',
                  boxShadow:m.role==='ai'?'0 0 8px rgba(57,255,20,0.35)':'none'}}>
                  {m.role==='ai'?'LG':'▸'}
                </div>
                <div style={{
                  maxWidth:'80%',padding:'9px 12px',
                  borderRadius:m.role==='ai'?'3px 10px 10px 10px':'10px 3px 10px 10px',
                  background:m.role==='ai'?'var(--border3)':'rgba(57,255,20,0.08)',
                  border:m.role==='ai'?'1px solid var(--border2)':'1px solid rgba(57,255,20,0.18)',
                  fontSize:11,lineHeight:1.7,
                  color:m.role==='ai'?'rgba(255,255,255,0.88)':T.white,
                  textAlign:m.role==='user'?'right':'left',
                  fontFamily:"'DM Mono',monospace",
                  wordBreak:'break-word',
                }}
                  dangerouslySetInnerHTML={{__html:m.role==='ai'
                    ?m.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                      .replace(/\*\*(.+?)\*\*/g,`<strong style="color:${T.green}">$1</strong>`)
                      .replace(/`(.+?)`/g,`<code style="background:rgba(57,255,20,0.1);border:1px solid rgba(57,255,20,0.2);border-radius:3px;padding:1px 4px;font-size:10px;color:${T.green}">$1</code>`)
                      .replace(/\n/g,'<br/>')
                    :m.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  }}
                />
              </div>
            ))}
            {chatBusy&&(
              <div style={{display:'flex',gap:7,animation:'fadeUp 0.2s ease'}}>
                <div style={{width:22,height:22,borderRadius:5,background:'linear-gradient(145deg,#4dff1c,#26bb0d)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:'#000',boxShadow:'0 0 8px rgba(57,255,20,0.35)'}}>LG</div>
                <div style={{padding:'10px 14px',background:'var(--border3)',border:'1px solid var(--border2)',borderRadius:'3px 10px 10px 10px',display:'flex',gap:4,alignItems:'center'}}>
                  {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:'50%',background:'rgba(57,255,20,0.5)',animation:`typingDot 1.2s ${i*0.2}s ease-in-out infinite`}}/>)}
                </div>
              </div>
            )}
            <div ref={chatEndR}/>
          </div>
          {/* Input */}
          <div style={{display:'flex',borderTop:'1px solid #0e0e1e',flexShrink:0}}>
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();sendChat();}}}
              placeholder="Ask about any feature…" disabled={chatBusy}
              style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'11px 14px',fontSize:11,color:T.offwhite,fontFamily:"'DM Mono',monospace",letterSpacing:0.5}}
            />
            <button onClick={()=>sendChat()} disabled={chatBusy||!chatInput.trim()}
              style={{background:chatInput.trim()&&!chatBusy?T.green:'transparent',border:'none',padding:'0 14px',cursor:'pointer',transition:'background .2s',borderLeft:'1px solid #0e0e1e'}}>
              <svg viewBox="0 0 24 24" width="14" height="14" style={{fill:chatInput.trim()&&!chatBusy?'#000':'var(--border)',display:'block'}}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ━━━ SYNC FEEDBACK TOAST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {syncFeedback&&(
        <div style={{
          position:'fixed',bottom:80,left:'50%',transform:'translateX(-50%)',
          background:'var(--card)',border:`1px solid ${syncFeedback.type==='tempo'?T.green:syncFeedback.type==='snap'?T.teal:'#ff9f43'}44`,
          borderRadius:10,padding:'10px 18px',zIndex:1999,
          animation:'fadeUp 0.25s ease',
          display:'flex',alignItems:'center',gap:10,
          boxShadow:'0 8px 32px rgba(0,0,0,0.6)',
          minWidth:200,
        }}>
          <div style={{
            width:8,height:8,borderRadius:'50%',flexShrink:0,
            background:syncFeedback.type==='tempo'?T.green:syncFeedback.type==='snap'?T.teal:'#ff9f43',
            boxShadow:`0 0 8px ${syncFeedback.type==='tempo'?T.green:syncFeedback.type==='snap'?T.teal:'#ff9f43'}`,
          }}/>
          <div>
            {syncFeedback.type==='tempo'&&(
              <>
                <div style={{fontSize:11,color:T.green,fontWeight:700,letterSpacing:1}}>
                  TEMPO DETECTED — {syncFeedback.bpm} BPM
                </div>
                <div style={{fontSize:10,color:T.muted,marginTop:2}}>
                  {syncFeedback.bars} {syncFeedback.bars===1?'bar':'bars'} · {syncFeedback.dur}s · master grid set
                </div>
              </>
            )}
            {syncFeedback.type==='snap'&&(
              <>
                <div style={{fontSize:11,color:T.teal,fontWeight:700,letterSpacing:1}}>
                  LOOP SNAPPED — {syncFeedback.ratio} of master
                </div>
                <div style={{fontSize:10,color:T.muted,marginTop:2}}>
                  {syncFeedback.dur}s → aligned to {syncFeedback.master}s grid
                </div>
              </>
            )}
            {syncFeedback.type==='raw'&&(
              <>
                <div style={{fontSize:11,color:'#ff9f43',fontWeight:700,letterSpacing:1}}>
                  MASTER LOOP SET
                </div>
                <div style={{fontSize:10,color:T.muted,marginTop:2}}>
                  {syncFeedback.dur}s · subsequent loops will snap to this
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chat launch button */}
      <button onClick={()=>setChatPopupOpen(p=>!p)}
        title="Spool Support"
        style={{
          position:'fixed',bottom:20,right:20,
          width:50,height:50,borderRadius:'50%',
          background:chatPopupOpen?'var(--border2)':`linear-gradient(145deg,${T.green},#26bb0d)`,
          border:chatPopupOpen?`1px solid ${T.green}44`:'none',
          boxShadow:chatPopupOpen?`0 0 20px rgba(57,255,20,0.2)`:`0 0 24px rgba(57,255,20,0.5), 0 4px 20px rgba(0,0,0,0.6)`,
          cursor:'pointer',zIndex:2001,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:20,color:chatPopupOpen?T.green:'#000',
          transition:'all .2s',
        }}>
        {chatPopupOpen?'✕':'⌨'}
      </button>

    </div>
  );
}

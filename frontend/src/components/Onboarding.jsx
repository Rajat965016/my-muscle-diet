import React, { useState } from 'react';
import { DEFAULT_PROTEIN_TARGET, STORAGE_KEYS } from '../constants';

const STEP_COUNT = 3;

function Pill({ label, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 select-none min-h-[42px] text-center ${
        isSelected
          ? 'bg-[#084c8d] text-white border-[#084c8d] shadow-md shadow-[#084c8d]/25 font-bold scale-[1.01]'
          : 'bg-[#f1f5f9] text-[#334e68] border-[#d8e2ec] hover:border-[#9db6ce] hover:text-[#0a2240] hover:bg-[#e8eff5]'
      }`}
    >
      {label}
    </button>
  );
}

function PillGroup({ label, options, selectedValue, onSelect, error, direction = "row" }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#1e3a58] mb-2 uppercase tracking-wider">{label}</label>
      <div className={`flex ${direction === 'col' ? 'flex-col space-y-2' : 'flex-wrap gap-2.5'}`}>
        {options.map(opt => (
          <Pill key={opt} label={opt} isSelected={selectedValue === opt} onClick={() => onSelect(opt)} />
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 font-semibold pl-1">{error}</p>}
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, min, max, error }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#1e3a58] mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full bg-[#f8fafc] border rounded-full px-5 py-3 text-[#0a2240] text-sm font-medium placeholder-[#94a3b8] focus:outline-none focus:bg-white focus:ring-2 transition-all min-h-[46px] shadow-sm ${
          error 
            ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20' 
            : 'border-[#d0dbe7] hover:border-[#9cb4cd] focus:border-[#084c8d] focus:ring-[#084c8d]/20'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1.5 font-semibold pl-1">{error}</p>}
    </div>
  );
}

// Background Cloud Silhouettes matching reference image style
function BackgroundClouds() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 700" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cloud-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#146fae" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0b5894" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="cloud-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2889c8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#146fae" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="cloud-grad-3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3ca2df" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0d5992" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Top Left Cloud cluster */}
      <g fill="url(#cloud-grad-1)">
        <ellipse cx="140" cy="50" rx="90" ry="40" />
        <ellipse cx="200" cy="70" rx="60" ry="35" />
        <ellipse cx="90" cy="65" rx="50" ry="30" />
      </g>

      {/* Mid Left Cloud cluster */}
      <g fill="url(#cloud-grad-2)">
        <ellipse cx="40" cy="300" rx="70" ry="38" />
        <ellipse cx="90" cy="320" rx="50" ry="30" />
        <ellipse cx="20" cy="330" rx="50" ry="25" />
      </g>

      {/* Top Right Cloud cluster near wave */}
      <g fill="url(#cloud-grad-2)">
        <ellipse cx="450" cy="160" rx="75" ry="36" />
        <ellipse cx="500" cy="180" rx="60" ry="30" />
      </g>

      {/* Large Bottom Cloud formation */}
      <g fill="url(#cloud-grad-1)">
        <ellipse cx="240" cy="670" rx="140" ry="65" />
        <ellipse cx="360" cy="680" rx="110" ry="55" />
        <ellipse cx="120" cy="690" rx="100" ry="50" />
        <ellipse cx="480" cy="690" rx="90" ry="45" />
      </g>

      {/* Ambient soft cloud puffs */}
      <ellipse cx="380" cy="460" rx="55" ry="24" fill="url(#cloud-grad-3)" />
      <ellipse cx="160" cy="500" rx="45" ry="20" fill="url(#cloud-grad-3)" />
    </svg>
  );
}

// Decorative Dotted Flight-Path Lines with looping arcs matching reference image
function FlightPaths() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 700" preserveAspectRatio="none">
      {/* Top flight loop */}
      <path
        d="M 520,60 C 460,20 380,10 320,60 C 260,110 270,190 330,210 C 390,230 460,180 440,110 C 420,50 350,70 300,100 C 200,160 140,240 80,320"
        fill="none"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth="2.2"
        strokeDasharray="6 8"
        strokeLinecap="round"
      />
      {/* Bottom flight loop */}
      <path
        d="M 40,540 C 120,580 200,640 260,620 C 320,600 340,520 280,490 C 220,460 170,520 190,580 C 220,680 380,720 540,650"
        fill="none"
        stroke="rgba(255, 255, 255, 0.7)"
        strokeWidth="2.2"
        strokeDasharray="6 8"
        strokeLinecap="round"
      />
      {/* Middle trailing arc */}
      <path
        d="M 0,380 C 140,370 240,410 350,390 C 440,370 500,320 580,340"
        fill="none"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="2"
        strokeDasharray="5 7"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Hero Illustration for Step 1 ("Your Stats") - Vector Nutrition Plate & Cutlery
function HeroNutritionPlate() {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 xl:w-88 xl:h-88 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full filter drop-shadow-[0_24px_35px_rgba(2,20,45,0.45)] transition-transform duration-500 hover:scale-105"
      >
        <defs>
          <radialGradient id="plate-rim-grad" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#f1f5f9" />
            <stop offset="90%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>
          <radialGradient id="plate-basin-grad" cx="42%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="95%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>
          <linearGradient id="silver-metal-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="35%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="salmon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <radialGradient id="avocado-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#bef264" />
            <stop offset="85%" stopColor="#65a30d" />
            <stop offset="100%" stopColor="#365314" />
          </radialGradient>
          <radialGradient id="broccoli-grad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="60%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>
        </defs>

        {/* Ambient shadow ellipse */}
        <ellipse cx="200" cy="215" rx="155" ry="145" fill="rgba(2, 22, 48, 0.4)" filter="blur(16px)" />

        {/* Fork (Left) */}
        <g transform="translate(10, 0)">
          <path d="M 45,95 C 45,75 55,75 55,95 L 55,160 C 55,185 45,200 45,240 L 45,330 C 45,340 35,340 35,330 L 35,240 C 35,200 25,185 25,160 L 25,95 C 25,75 35,75 35,95" fill="rgba(2,22,48,0.25)" transform="translate(4, 10)" />
          <path d="M 45,90 L 45,150 C 45,175 40,185 40,220 L 40,320 C 40,326 36,330 32,330 C 28,330 24,326 24,320 L 24,220 C 24,185 19,175 19,150 L 19,90 C 19,86 23,86 23,90 L 23,135 C 23,140 27,140 27,135 L 27,90 C 27,86 31,86 31,90 L 31,135 C 31,140 35,140 35,135 L 35,90 C 35,86 39,86 39,90 L 39,135 C 39,140 45,140 45,135 Z" fill="url(#silver-metal-1)" />
          <line x1="32" y1="180" x2="32" y2="310" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* Knife (Right) */}
        <g transform="translate(-10, 0)">
          <path d="M 360,75 C 375,100 375,170 370,210 L 370,330 C 370,338 360,338 360,330 L 360,210 C 360,180 355,140 355,75 Z" fill="rgba(2,22,48,0.25)" transform="translate(4, 10)" />
          <path d="M 358,70 C 373,95 373,165 368,205 L 368,320 C 368,326 362,330 356,330 C 350,330 344,326 344,320 L 344,205 C 344,175 350,135 350,70 C 350,66 358,66 358,70 Z" fill="url(#silver-metal-1)" />
          <path d="M 358,70 C 373,95 373,165 368,205" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        </g>

        {/* Outer Porcelain Plate Rim */}
        <circle cx="200" cy="200" r="142" fill="url(#plate-rim-grad)" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="139" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
        <circle cx="200" cy="200" r="105" fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.35" />

        {/* Plate Deep Basin */}
        <circle cx="200" cy="200" r="102" fill="url(#plate-basin-grad)" />
        <circle cx="200" cy="198" r="101" fill="none" stroke="#64748b" strokeWidth="2" opacity="0.15" />

        {/* Salmon / Steak Fillet */}
        <g transform="translate(130, 140)">
          <path d="M 0,25 C 0,5 30,0 55,10 C 80,20 95,50 90,75 C 85,95 45,105 20,95 C 5,85 0,50 0,25 Z" fill="rgba(15,23,42,0.35)" transform="translate(3, 5)" />
          <path d="M 0,20 C 0,3 30,-2 55,8 C 80,18 95,48 90,73 C 85,93 45,103 20,93 C 5,83 0,48 0,20 Z" fill="url(#salmon-grad)" stroke="#9a3412" strokeWidth="1" />
          <path d="M 12,28 C 30,32 50,38 72,48" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M 14,48 C 32,54 52,60 74,70" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M 18,68 C 34,72 50,78 68,84" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
          <line x1="20" y1="15" x2="65" y2="45" stroke="#451a03" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <line x1="25" y1="35" x2="75" y2="68" stroke="#451a03" strokeWidth="3.2" strokeLinecap="round" opacity="0.75" />
          <line x1="30" y1="58" x2="70" y2="86" stroke="#451a03" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <circle cx="45" cy="38" r="1.8" fill="#15803d" />
          <circle cx="58" cy="52" r="1.5" fill="#15803d" />
          <circle cx="36" cy="62" r="1.8" fill="#15803d" />
          <circle cx="50" cy="72" r="1.6" fill="#15803d" />
        </g>

        {/* Sliced Avocado Fan */}
        <g transform="translate(205, 130)">
          <path d="M 5,20 C 15,5 35,5 45,20 C 55,40 50,65 35,75 C 20,85 5,75 5,50 Z" fill="url(#avocado-grad)" stroke="#22543d" strokeWidth="1.2" transform="rotate(-15 25 45)" />
          <path d="M 15,30 C 25,15 45,15 55,30 C 65,50 60,75 45,85 C 30,95 15,85 15,60 Z" fill="url(#avocado-grad)" stroke="#22543d" strokeWidth="1.2" transform="rotate(5 35 55)" />
          <path d="M 25,40 C 35,25 55,25 65,40 C 75,60 70,85 55,95 C 40,105 25,95 25,70 Z" fill="url(#avocado-grad)" stroke="#22543d" strokeWidth="1.2" transform="rotate(25 45 65)" />
          <circle cx="38" cy="65" r="10" fill="#713f12" opacity="0.85" />
          <circle cx="38" cy="65" r="9" fill="#92400e" />
        </g>

        {/* Steamed Broccoli Florets */}
        <g transform="translate(180, 115)">
          <circle cx="0" cy="10" r="14" fill="url(#broccoli-grad)" />
          <circle cx="15" cy="0" r="15" fill="url(#broccoli-grad)" />
          <circle cx="30" cy="12" r="14" fill="url(#broccoli-grad)" />
          <circle cx="15" cy="14" r="13" fill="#15803d" />
          <circle cx="12" cy="2" r="3" fill="#86efac" opacity="0.6" />
          <circle cx="22" cy="4" r="3.5" fill="#86efac" opacity="0.6" />
          <circle cx="0" cy="8" r="3" fill="#86efac" opacity="0.6" />
        </g>

        {/* Lemon Wedge */}
        <g transform="translate(185, 230)">
          <path d="M 0,0 C 15,-15 40,-15 55,0 C 35,18 20,18 0,0 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
          <path d="M 5,0 C 18,-10 38,-10 50,0 C 32,12 22,12 5,0 Z" fill="#fef08a" />
          <path d="M 8,-1 L 24,6 M 20,-5 L 28,6 M 34,-5 L 32,6 M 44,-2 L 35,6" stroke="#eab308" strokeWidth="1" />
        </g>

        {/* Floating Badges */}
        <g transform="translate(250, 60)">
          <rect x="0" y="0" width="130" height="36" rx="18" fill="#084c8d" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 6px 12px rgba(2,20,45,0.35))" />
          <circle cx="18" cy="18" r="8" fill="#ffffff" />
          <text x="18" y="21" fill="#084c8d" fontSize="9" fontWeight="900" textAnchor="middle">★</text>
          <text x="36" y="22" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="sans-serif">130g PROTEIN</text>
        </g>

        <g transform="translate(25, 295)">
          <rect x="0" y="0" width="125" height="34" rx="17" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" filter="drop-shadow(0 6px 12px rgba(2,20,45,0.25))" />
          <circle cx="17" cy="17" r="7" fill="#ea580c" />
          <text x="17" y="20.5" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">⚡</text>
          <text x="34" y="21" fill="#0a2240" fontSize="11" fontWeight="800" fontFamily="sans-serif">2,400 KCAL</text>
        </g>
      </svg>
    </div>
  );
}

// Hero Illustration for Step 2 ("Your Goals") - Hex Dumbbell & Protein Shaker
function HeroGoalsDumbbell() {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 xl:w-88 xl:h-88 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full filter drop-shadow-[0_24px_35px_rgba(2,20,45,0.45)] transition-transform duration-500 hover:scale-105"
      >
        <defs>
          <linearGradient id="chrome-handle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="30%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#94a3b8" />
            <stop offset="85%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="hex-plate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="85%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="shaker-body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f8fafc" />
            <stop offset="80%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="navy-cap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="60%" stopColor="#084c8d" />
            <stop offset="100%" stopColor="#032b50" />
          </linearGradient>
        </defs>

        {/* Ambient Target Rings */}
        <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="8 8" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth="2.5" />
        <circle cx="200" cy="200" r="80" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="6 6" />

        {/* Crosshair marks */}
        <line x1="200" y1="20" x2="200" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
        <line x1="200" y1="350" x2="200" y2="380" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="200" x2="50" y2="200" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
        <line x1="350" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />

        {/* Drop shadow */}
        <ellipse cx="200" cy="290" rx="140" ry="40" fill="rgba(2, 22, 48, 0.45)" filter="blur(16px)" />

        {/* Shaker Bottle (Behind Dumbbell) */}
        <g transform="translate(130, 80) rotate(-18 50 120)">
          <path d="M 25,60 L 30,210 C 30,225 45,235 65,235 C 85,235 100,225 100,210 L 105,60 Z" fill="url(#shaker-body)" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M 31,120 L 30,205 C 30,218 45,228 65,228 C 85,228 99,218 99,205 L 98,120 Z" fill="#084c8d" opacity="0.12" />
          <line x1="33" y1="130" x2="48" y2="130" stroke="#64748b" strokeWidth="1.5" />
          <line x1="33" y1="150" x2="44" y2="150" stroke="#64748b" strokeWidth="1.2" />
          <line x1="33" y1="170" x2="48" y2="170" stroke="#64748b" strokeWidth="1.5" />
          <line x1="33" y1="190" x2="44" y2="190" stroke="#64748b" strokeWidth="1.2" />
          <circle cx="65" cy="180" r="18" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3" />
          <rect x="20" y="50" width="90" height="15" rx="5" fill="url(#navy-cap-grad)" stroke="#ffffff" strokeWidth="1" />
          <path d="M 25,50 C 25,25 45,15 65,15 C 85,15 105,25 105,50 Z" fill="url(#navy-cap-grad)" />
          <rect x="52" y="5" width="26" height="20" rx="6" fill="#38bdf8" />
          <circle cx="85" cy="22" r="9" fill="none" stroke="#ffffff" strokeWidth="3" />
        </g>

        {/* Hex Dumbbell (Centered) */}
        <g transform="translate(60, 160) rotate(22 140 30)">
          <polygon points="10,0 45,-20 75,0 75,55 45,75 10,55" fill="url(#hex-plate-grad)" stroke="#ffffff" strokeWidth="2.5" />
          <polygon points="18,5 45,-10 67,5 67,50 45,65 18,50" fill="#334155" opacity="0.9" />
          <text x="43" y="32" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">25</text>
          <text x="43" y="44" fill="#94a3b8" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">KG</text>

          <rect x="75" y="16" width="130" height="24" rx="4" fill="url(#chrome-handle)" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="100" y1="16" x2="100" y2="40" stroke="#475569" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="120" y1="16" x2="120" y2="40" stroke="#475569" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="140" y1="16" x2="140" y2="40" stroke="#475569" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="160" y1="16" x2="160" y2="40" stroke="#475569" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="180" y1="16" x2="180" y2="40" stroke="#475569" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="80" y1="21" x2="200" y2="21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

          <polygon points="205,0 240,-20 270,0 270,55 240,75 205,55" fill="url(#hex-plate-grad)" stroke="#ffffff" strokeWidth="2.5" />
          <polygon points="213,5 240,-10 262,5 262,50 240,65 213,50" fill="#334155" opacity="0.9" />
          <text x="238" y="32" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">25</text>
          <text x="238" y="44" fill="#94a3b8" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">KG</text>
        </g>

        {/* Floating Badges */}
        <g transform="translate(250, 75)">
          <rect x="0" y="0" width="135" height="36" rx="18" fill="#084c8d" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 6px 12px rgba(2,20,45,0.35))" />
          <circle cx="18" cy="18" r="8" fill="#38bdf8" />
          <text x="18" y="21.5" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle">🎯</text>
          <text x="36" y="22" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="sans-serif">TARGET: PEAK</text>
        </g>

        <g transform="translate(25, 290)">
          <rect x="0" y="0" width="130" height="34" rx="17" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" filter="drop-shadow(0 6px 12px rgba(2,20,45,0.25))" />
          <circle cx="17" cy="17" r="7" fill="#16a34a" />
          <text x="17" y="20.5" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">✓</text>
          <text x="34" y="21" fill="#0a2240" fontSize="11" fontWeight="800" fontFamily="sans-serif">FAT LOSS / BULK</text>
        </g>
      </svg>
    </div>
  );
}

// Hero Illustration for Step 3 ("Your Lifestyle") - Smart Chronometer & Lifestyle Timing
function HeroLifestyleClock() {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 xl:w-88 xl:h-88 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full filter drop-shadow-[0_24px_35px_rgba(2,20,45,0.45)] transition-transform duration-500 hover:scale-105"
      >
        <defs>
          <radialGradient id="dial-grad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="95%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>
        </defs>

        {/* Ambient glow */}
        <ellipse cx="200" cy="225" rx="145" ry="135" fill="rgba(2, 22, 48, 0.4)" filter="blur(16px)" />

        {/* Watch Bezel */}
        <circle cx="200" cy="200" r="135" fill="#084c8d" stroke="#ffffff" strokeWidth="3" />
        <circle cx="200" cy="200" r="126" fill="url(#dial-grad)" stroke="#94a3b8" strokeWidth="1" />

        {/* Day/AM Sun Quadrant */}
        <path d="M 200,200 L 200,78 A 122 122 0 0 1 322,200 Z" fill="#fef3c7" opacity="0.45" />
        <circle cx="255" cy="140" r="14" fill="#f59e0b" />
        <line x1="255" y1="120" x2="255" y2="114" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="255" y1="160" x2="255" y2="166" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="235" y1="140" x2="229" y2="140" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="275" y1="140" x2="281" y2="140" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <text x="255" y="172" fill="#b45309" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">AM WORKOUT</text>

        {/* Night/PM Moon Quadrant */}
        <path d="M 200,200 L 200,322 A 122 122 0 0 1 78,200 Z" fill="#e0f2fe" opacity="0.5" />
        <path d="M 140,245 A 12 12 0 0 0 152,260 A 15 15 0 1 1 140,245 Z" fill="#0284c7" />
        <text x="145" y="280" fill="#0369a1" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">PM RECOVERY</text>

        {/* Hour markers */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
          <line
            key={deg}
            x1="200"
            y1="85"
            x2="200"
            y2={deg % 90 === 0 ? "96" : "91"}
            stroke={deg % 90 === 0 ? "#0a2240" : "#64748b"}
            strokeWidth={deg % 90 === 0 ? "3" : "1.5"}
            strokeLinecap="round"
            transform={`rotate(${deg} 200 200)`}
          />
        ))}

        {/* Clock Hands */}
        <line x1="200" y1="200" x2="135" y2="165" stroke="#0a2240" strokeWidth="5" strokeLinecap="round" />
        <line x1="200" y1="200" x2="245" y2="120" stroke="#084c8d" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="200" y1="215" x2="200" y2="92" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="200" cy="200" r="7" fill="#0a2240" stroke="#ffffff" strokeWidth="2" />
        <circle cx="200" cy="200" r="3" fill="#ea580c" />

        {/* Floating Badges */}
        <g transform="translate(245, 60)">
          <rect x="0" y="0" width="135" height="36" rx="18" fill="#084c8d" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 6px 12px rgba(2,20,45,0.35))" />
          <circle cx="18" cy="18" r="8" fill="#ffffff" />
          <text x="18" y="21.5" fill="#084c8d" fontSize="9" fontWeight="900" textAnchor="middle">📍</text>
          <text x="36" y="22" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="sans-serif">CITY INGREDIENTS</text>
        </g>

        <g transform="translate(25, 295)">
          <rect x="0" y="0" width="130" height="34" rx="17" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" filter="drop-shadow(0 6px 12px rgba(2,20,45,0.25))" />
          <circle cx="17" cy="17" r="7" fill="#f59e0b" />
          <text x="17" y="21" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle">₹</text>
          <text x="34" y="21" fill="#0a2240" fontSize="11" fontWeight="800" fontFamily="sans-serif">SMART BUDGET</text>
        </g>
      </svg>
    </div>
  );
}

export default function Onboarding({ 
  onSubmit, 
  onRestorePreviousPlan, 
  onNavigateToLogin,
  hasBackupPlan = false, 
  initialError = null, 
  onClearError 
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.LAST_PROFILE) || localStorage.getItem(STORAGE_KEYS.USER);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          email: parsed.email || "",
          password: "",
          confirm_password: "",
          name: parsed.name || "",
          age: parsed.age || "",
          weight: parsed.weight || "",
          height: parsed.height || "",
          gender: parsed.gender || "",
          goal: parsed.goal || "",
          activity_level: parsed.activity_level || "",
          diet_type: parsed.diet_type || "",
          allergies: parsed.allergies || "",
          city: parsed.city || "",
          budget: parsed.budget || "",
          gym_timing: parsed.gym_timing || "",
          protein_target: parsed.protein_target || DEFAULT_PROTEIN_TARGET
        };
      }
    } catch (e) {
      console.error("Error reading last profile backup in Onboarding:", e);
    }
    return {
      email: "", 
      password: "",
      confirm_password: "",
      name: "", 
      age: "", 
      weight: "", 
      height: "", 
      gender: "",
      goal: "", 
      activity_level: "", 
      diet_type: "", 
      allergies: "",
      city: "", 
      budget: "", 
      gym_timing: "", 
      protein_target: DEFAULT_PROTEIN_TARGET
    };
  });

  const [isPreFilled] = useState(() => {
    try {
      return !!(localStorage.getItem(STORAGE_KEYS.LAST_PROFILE) || localStorage.getItem(STORAGE_KEYS.USER));
    } catch {
      return false;
    }
  });

  const canRestore = hasBackupPlan || (() => {
    try {
      return !!localStorage.getItem(STORAGE_KEYS.BACKUP_PLAN);
    } catch {
      return false;
    }
  })();

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (stepToValidate) => {
    const newErrors = {};
    if (stepToValidate === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password || formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }

      if (!formData.name || formData.name.length < 2 || !/^[a-zA-Z\s]+$/.test(formData.name)) {
        newErrors.name = "Please enter a valid name (letters only)";
      }
      
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 10 || ageNum > 80) newErrors.age = "Please enter an age between 10-80";
      
      const weightNum = parseFloat(formData.weight);
      if (isNaN(weightNum) || weightNum < 30 || weightNum > 200) newErrors.weight = "Please enter a weight between 30-200 kg";
      
      const heightNum = parseFloat(formData.height);
      if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) newErrors.height = "Please enter a height between 100-250 cm";
      
      if (!formData.gender) newErrors.gender = "Please select a gender";
    } 
    else if (stepToValidate === 2) {
      if (!['Bulk Up', 'Lose Fat', 'Maintain'].includes(formData.goal)) newErrors.goal = "Please select a primary goal";
      if (!formData.activity_level) newErrors.activity_level = "Please select an activity level";
      if (!formData.diet_type) newErrors.diet_type = "Please select a diet type";
    } 
    else if (stepToValidate === 3) {
      if (!formData.city || formData.city.length < 2) newErrors.city = "Please enter a valid city name";
      if (!formData.budget) newErrors.budget = "Please select a budget";
      if (!formData.gym_timing) newErrors.gym_timing = "Please select a gym timing";
      
      const proteinNum = parseInt(formData.protein_target, 10);
      if (isNaN(proteinNum) || proteinNum < 80 || proteinNum > 300) newErrors.protein_target = "Please enter a protein target between 80-300g";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      setIsSubmitting(true);
      await onSubmit(formData);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#085494] via-[#054d87] to-[#022849] font-sans text-slate-800 flex flex-col lg:flex-row overflow-x-hidden selection:bg-[#084c8d] selection:text-white">
      
      {/* DESKTOP ORGANIC WAVE DIVIDER (Shifted left to ensure generous 80-200px buffer from all form content) */}
      <svg 
        className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="desktop-wave-shadow" x="-20%" y="-10%" width="140%" height="120%">
            <feDropShadow dx="-10" dy="0" stdDeviation="16" flood-color="#021c38" flood-opacity="0.22" />
          </filter>
        </defs>
        <path 
          d="M 520,0 
             C 450,130 400,240 410,360 
             C 425,480 500,590 530,730 
             C 545,810 535,900 520,900 
             L 1440,900 
             L 1440,0 
             Z" 
          fill="#ffffff" 
          filter="url(#desktop-wave-shadow)" 
        />
      </svg>

      {/* LEFT SECTION (Blue Section - Illustration, Flight Paths & Clouds) */}
      <div className="lg:w-[38%] xl:w-[36%] relative z-20 flex flex-col justify-between p-6 sm:p-8 xl:p-12 shrink-0 overflow-hidden min-h-[340px] lg:min-h-screen">
        
        {/* Ambient Background Clouds & Flight Paths */}
        <BackgroundClouds />
        <FlightPaths />

        {/* Top-Left: Logo + MuscleDiet Wordmark (Replacing "LOGO COMPANY") */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 0 1 10 10" />
              <circle cx="12" cy="12" r="3" fill="#38bdf8" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-[0.16em] text-white uppercase leading-none">
              MUSCLEDIET
            </h1>
            <p className="text-[10px] font-bold tracking-[0.22em] text-[#7bbde8] uppercase mt-1">
              Precision Nutrition Engine
            </p>
          </div>
        </div>

        {/* Center: Vector Hero Illustration in the Exact Art Style of the Reference Plane */}
        <div className="relative z-10 my-6 sm:my-auto flex items-center justify-center">
          {currentStep === 1 && <HeroNutritionPlate />}
          {currentStep === 2 && <HeroGoalsDumbbell />}
          {currentStep === 3 && <HeroLifestyleClock />}
        </div>

        {/* Bottom Tagline / Caption */}
        <div className="relative z-10 hidden lg:block text-left text-white/80">
          <p className="text-xs font-bold tracking-wider uppercase text-[#88c5ef]">
            Smart Diet Intelligence
          </p>
          <p className="text-[11px] text-white/60 font-medium mt-0.5">
            Personalized macro targets tailored to your city, weather, budget & gym schedule.
          </p>
        </div>

        {/* MOBILE WAVE DIVIDER (Horizontal wave dividing blue top & white bottom on mobile) */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 sm:h-12">
            <defs>
              <filter id="mobile-wave-shadow" x="0" y="-20%" width="100%" height="140%">
                <feDropShadow dx="0" dy="-3" stdDeviation="5" flood-color="#021c38" flood-opacity="0.22" />
              </filter>
            </defs>
            <path 
              d="M 0,50 C 200,95 450,15 700,70 C 900,105 1050,45 1200,55 L 1200,120 L 0,120 Z" 
              fill="#ffffff" 
              filter="url(#mobile-wave-shadow)" 
            />
          </svg>
        </div>

      </div>

      {/* RIGHT SECTION (White Section - Step Nav, Form Content, Action Button & Dots) */}
      <div className="lg:w-[62%] xl:w-[64%] lg:ml-auto relative z-20 flex-1 flex flex-col justify-between p-6 sm:p-10 lg:py-12 lg:pr-12 lg:pl-16 xl:py-14 xl:pr-16 xl:pl-20 bg-white lg:bg-transparent min-h-screen">
        
        {/* Top bar with Login link, Restore Previous Plan & Minimal Step Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {canRestore && onRestorePreviousPlan && (
              <button
                type="button"
                onClick={onRestorePreviousPlan}
                className="inline-flex items-center gap-1.5 self-start px-3.5 py-1.5 rounded-full text-xs font-bold text-[#084c8d] bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all shadow-sm active:scale-95"
                title="Restore your previously backed-up weekly plan"
              >
                <span className="text-sm">↩</span>
                <span>Restore Previous Plan</span>
              </button>
            )}
            {onNavigateToLogin && (
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[#084c8d] hover:bg-slate-100 transition-colors"
              >
                <span>Existing User?</span>
                <span className="underline font-black">Log In &rarr;</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-5 sm:gap-7 text-xs font-bold tracking-widest uppercase select-none self-end sm:self-auto">
            {[
              { num: "01", label: "Stats", step: 1 },
              { num: "02", label: "Goals", step: 2 },
              { num: "03", label: "Lifestyle", step: 3 }
            ].map((item) => {
              const isActive = currentStep === item.step;
              const isCompleted = currentStep > item.step;
              return (
                <div
                  key={item.step}
                  onClick={() => isCompleted && setCurrentStep(item.step)}
                  className={`flex items-center gap-1.5 pb-1 transition-all ${
                    isCompleted ? 'cursor-pointer hover:opacity-80' : ''
                  } ${
                    isActive 
                      ? 'text-[#084c8d] border-b-2 border-[#084c8d] font-black' 
                      : isCompleted
                        ? 'text-[#2563eb] font-bold'
                        : 'text-[#94a3b8]'
                  }`}
                >
                  <span>{item.num} {item.label}</span>
                  {isCompleted && <span className="text-[#084c8d] text-[10px]">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Error Banner (e.g., corrupted storage or failed plan generation) */}
        {initialError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="text-lg shrink-0">⚠️</span>
              <p className="leading-snug">{initialError}</p>
            </div>
            {onClearError && (
              <button
                type="button"
                onClick={onClearError}
                className="text-amber-800 hover:text-amber-950 font-bold text-xs uppercase px-2.5 py-1 rounded-lg hover:bg-amber-100/80 transition-colors shrink-0"
              >
                Dismiss
              </button>
            )}
          </div>
        )}

        {/* Saved Stats Info Pill */}
        {isPreFilled && currentStep === 1 && (
          <div className="mb-6 py-2 px-3.5 rounded-2xl bg-[#f0f6fc] border border-[#d0e2f4] text-[#084c8d] text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#084c8d] text-white flex items-center justify-center text-[10px]">✓</span>
              <span className="font-semibold text-[#1e3a58]">Pre-filled with your saved profile stats. Review or update anytime.</span>
            </div>
          </div>
        )}

        {/* Middle: Step Heading, Subtext, and Form Fields */}
        <div className="max-w-xl w-full mx-auto lg:mx-0 my-auto">
          
          {/* Header styled like "TIME TO TRAVEL" from reference */}
          <div className="mb-6 sm:mb-8 text-left">
            <span className="block text-xs sm:text-sm font-extrabold tracking-[0.22em] text-[#084c8d] uppercase mb-1.5">
              {currentStep === 1 && "STEP 01 • PERSONAL PROFILE"}
              {currentStep === 2 && "STEP 02 • FITNESS TARGETS"}
              {currentStep === 3 && "STEP 03 • DAILY ROUTINE"}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0a2240] uppercase">
              {currentStep === 1 && "YOUR STATS"}
              {currentStep === 2 && "YOUR GOALS"}
              {currentStep === 3 && "YOUR LIFESTYLE"}
            </h2>
            
            <p className="text-sm sm:text-base text-[#52667d] font-normal mt-2 leading-relaxed">
              {currentStep === 1 && "Tell us your body metrics to calculate exact calories and protein."}
              {currentStep === 2 && "Help our AI nutritionist understand your dietary and workout targets."}
              {currentStep === 3 && "Fine-tune your local city, budget, and gym timing for best results."}
            </p>
          </div>

          {/* Error Banner */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>Please complete all required fields correctly to continue.</span>
            </div>
          )}

          {/* Form Fields: Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-4.5">
              <InputField 
                label="Email Address" 
                type="email" 
                value={formData.email} 
                onChange={(e) => updateForm('email', e.target.value)} 
                placeholder="Enter your email" 
                error={errors.email} 
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField 
                  label="Create Password" 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => updateForm('password', e.target.value)} 
                  placeholder="Min. 8 characters" 
                  error={errors.password} 
                />
                
                <InputField 
                  label="Confirm Password" 
                  type="password" 
                  value={formData.confirm_password} 
                  onChange={(e) => updateForm('confirm_password', e.target.value)} 
                  placeholder="Repeat password" 
                  error={errors.confirm_password} 
                />
              </div>
              
              <InputField 
                label="Full Name" 
                value={formData.name} 
                onChange={(e) => updateForm('name', e.target.value)} 
                placeholder="Enter your name" 
                error={errors.name} 
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField 
                  label="Age" 
                  type="number" 
                  value={formData.age} 
                  onChange={(e) => updateForm('age', e.target.value)} 
                  placeholder="e.g. 24" 
                  min="10"
                  max="80"
                  error={errors.age} 
                />
                <InputField 
                  label="Current Weight (kg)" 
                  type="number" 
                  value={formData.weight} 
                  onChange={(e) => updateForm('weight', e.target.value)} 
                  placeholder="e.g. 70" 
                  min="30"
                  max="200"
                  error={errors.weight} 
                />
              </div>
              
              <InputField 
                label="Height (cm)" 
                type="number" 
                value={formData.height} 
                onChange={(e) => updateForm('height', e.target.value)} 
                placeholder="e.g. 175" 
                min="100"
                max="250"
                error={errors.height} 
              />
              
              <PillGroup 
                label="Gender" 
                options={['Male', 'Female']} 
                selectedValue={formData.gender} 
                onSelect={(val) => updateForm('gender', val)} 
                error={errors.gender} 
              />
            </div>
          )}

          {/* Form Fields: Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-4.5 sm:space-y-5">
              <PillGroup 
                label="Primary Fitness Goal" 
                options={['Bulk Up', 'Lose Fat', 'Maintain']} 
                selectedValue={formData.goal} 
                onSelect={(val) => updateForm('goal', val)} 
                error={errors.goal} 
              />

              <PillGroup 
                label="Activity Level" 
                options={['Light (1-2x/week)', 'Moderate (3-4x/week)', 'Intense (5-6x/week)']} 
                selectedValue={formData.activity_level} 
                onSelect={(val) => updateForm('activity_level', val)} 
                error={errors.activity_level} 
                direction="col"
              />

              <PillGroup 
                label="Diet Preference" 
                options={['Pure Veg', 'Veg + Eggs', 'Non-Veg']} 
                selectedValue={formData.diet_type} 
                onSelect={(val) => updateForm('diet_type', val)} 
                error={errors.diet_type} 
              />

              <InputField 
                label="Food Allergies or Dislikes (Optional)" 
                value={formData.allergies} 
                onChange={(e) => updateForm('allergies', e.target.value)} 
                placeholder="e.g. peanuts, dairy, gluten" 
              />
            </div>
          )}

          {/* Form Fields: Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-4.5 sm:space-y-5">
              <InputField 
                label="City (For local ingredients & weather)" 
                value={formData.city} 
                onChange={(e) => updateForm('city', e.target.value)} 
                placeholder="e.g. Delhi, Mumbai, Bengaluru" 
                error={errors.city} 
              />
              
              <PillGroup 
                label="Daily Food Budget" 
                options={['Low (₹150/day)', 'Medium (₹300/day)', 'High (₹500+/day)']} 
                selectedValue={formData.budget} 
                onSelect={(val) => updateForm('budget', val)} 
                error={errors.budget} 
                direction="col"
              />

              <PillGroup 
                label="Gym / Workout Timing" 
                options={['Morning', 'Evening']} 
                selectedValue={formData.gym_timing} 
                onSelect={(val) => updateForm('gym_timing', val)} 
                error={errors.gym_timing} 
              />

              <InputField 
                label="Target Daily Protein (grams)" 
                type="number" 
                value={formData.protein_target} 
                onChange={(e) => updateForm('protein_target', e.target.value)} 
                placeholder={`e.g. ${DEFAULT_PROTEIN_TARGET}`}
                min="80"
                max="300"
                error={errors.protein_target} 
              />
            </div>
          )}

          {/* Action Buttons styled like the "LEARN MORE" pill button */}
          <div className="mt-8 pt-6 border-t border-[#edf2f7]">
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button 
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3.5 rounded-full text-[#334e68] hover:text-[#0a2240] bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#d0dbe7] text-xs sm:text-sm font-bold tracking-wide transition-all min-h-[48px]"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button 
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3.5 px-8 rounded-full text-white font-bold text-sm sm:text-base tracking-wide bg-[#084c8d] hover:bg-[#063b6f] active:scale-[0.99] shadow-lg shadow-[#084c8d]/25 transition-all min-h-[48px] flex items-center justify-center gap-2"
                >
                  <span>Next Step</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-8 rounded-full text-white font-bold text-sm sm:text-base tracking-wide bg-[#084c8d] hover:bg-[#063b6f] active:scale-[0.99] shadow-lg shadow-[#084c8d]/25 transition-all min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Generate My Diet Plan</span>
                  )}
                </button>
              )}
            </div>

            {/* Pagination Dots Matching Reference Image (Underneath the button) */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === currentStep 
                      ? 'w-6 bg-[#084c8d]' 
                      : 'w-2 bg-[#cbd5e1]'
                  }`}
                />
              ))}
            </div>

            {currentStep === 1 && onNavigateToLogin && (
              <p className="mt-3.5 text-center text-xs text-[#52667d]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-[#084c8d] font-bold hover:underline"
                >
                  Log In to your plan &rarr;
                </button>
              </p>
            )}

            {/* Bottom Footer Info */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8094aa] gap-2 text-center sm:text-left">
              <span>© 2026 MuscleDiet AI • Precision Nutrition</span>
              <span>
                Need help? <a href="mailto:support@musclediet.ai" className="text-[#084c8d] font-semibold hover:underline">support@musclediet.ai</a>
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

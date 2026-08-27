import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SimulationProps {
  angle: number;
  speed1: number;
  speed2: number;
}

const ReflectionSimulation: React.FC<{ angle: number }> = ({ angle }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>(null);

  const animate = () => {
    timeRef.current += 0.08;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = timeRef.current;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const barrierY = centerY;

    // Draw Barrier
    ctx.beginPath();
    ctx.moveTo(0, barrierY);
    ctx.lineTo(width, barrierY);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 4;
    ctx.stroke();

    const rad = (angle * Math.PI) / 180;
    const wavelength = 25;
    const waveSpeed = 3.2;

    // Normal Line
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Incident Ray
    const incidentStartX = centerX - Math.tan(rad) * centerY;
    const incidentStartY = 0;
    ctx.beginPath();
    ctx.moveTo(incidentStartX, incidentStartY);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Incident Arrow
    const midX = (incidentStartX + centerX) / 2;
    const midY = (incidentStartY + centerY) / 2;
    const arrowLen = 10;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(midX - arrowLen * Math.sin(rad + Math.PI / 6), midY - arrowLen * Math.cos(rad + Math.PI / 6));
    ctx.moveTo(midX, midY);
    ctx.lineTo(midX - arrowLen * Math.sin(rad - Math.PI / 6), midY - arrowLen * Math.cos(rad - Math.PI / 6));
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    // Reflected Ray
    const reflectedEndX = centerX + Math.tan(rad) * centerY;
    const reflectedEndY = 0;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(reflectedEndX, reflectedEndY);
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();

    // Reflected Arrow
    const rMidX = (centerX + reflectedEndX) / 2;
    const rMidY = (centerY + reflectedEndY) / 2;
    ctx.beginPath();
    ctx.moveTo(rMidX, rMidY);
    ctx.lineTo(rMidX - arrowLen * Math.sin(rad + Math.PI / 6), rMidY + arrowLen * Math.cos(rad + Math.PI / 6));
    ctx.moveTo(rMidX, rMidY);
    ctx.lineTo(rMidX - arrowLen * Math.sin(rad - Math.PI / 6), rMidY + arrowLen * Math.cos(rad - Math.PI / 6));
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();

    // Incident Waves
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 2;
    for (let i = -15; i < 25; i++) {
      const offset = (wavelength - (time * waveSpeed) % wavelength) + i * wavelength;
      if (offset < 0) continue;
      
      const distToCenter = offset;
      const x = centerX - distToCenter * Math.sin(rad);
      const y = centerY - distToCenter * Math.cos(rad);

      if (y < centerY && y > 0) {
        ctx.beginPath();
        const dx = Math.cos(rad) * 120;
        const dy = -Math.sin(rad) * 120;
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
      }
    }

    // Reflected Waves
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    for (let i = -15; i < 25; i++) {
      const offset = (time * waveSpeed) % wavelength + i * wavelength;
      if (offset < 0) continue;

      const distToCenter = offset;
      const x = centerX + distToCenter * Math.sin(rad);
      const y = centerY - distToCenter * Math.cos(rad);

      if (y < centerY && y > 0) {
        ctx.beginPath();
        const dx = Math.cos(rad) * 120;
        const dy = Math.sin(rad) * 120;
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
      }
    }

    // Angles
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`i = ${angle}°`, centerX - 45, centerY - 50);
    ctx.fillText(`r = ${angle}°`, centerX + 15, centerY - 50);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [angle]);


  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={400} 
      className="w-full h-full bg-white rounded-lg shadow-inner border border-gray-200"
    />
  );
};

const RefractionSimulation: React.FC<{ angle: number; v1: number; v2: number }> = ({ angle, v1, v2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>(null);

  const animate = () => {
    timeRef.current += 0.08;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = timeRef.current;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const interfaceY = centerY;

    // Draw Media
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, interfaceY);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, interfaceY, width, height - interfaceY);

    // Interface
    ctx.beginPath();
    ctx.moveTo(0, interfaceY);
    ctx.lineTo(width, interfaceY);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.stroke();

    const radI = (angle * Math.PI) / 180;
    const sinR = (v2 / v1) * Math.sin(radI);
    const radR = Math.asin(Math.min(Math.max(sinR, -1), 1));
    const angleR = (radR * 180) / Math.PI;

    // Physics-based wave properties
    // f = v / lambda. To keep f constant, lambda must be proportional to v.
    const baseScale = 15;
    const wavelength1 = v1 * baseScale;
    const wavelength2 = v2 * baseScale;
    const waveSpeed1 = v1 * 10; // Pixels per unit of time
    const waveSpeed2 = v2 * 10;

    // Normal
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.strokeStyle = '#9ca3af';
    ctx.stroke();
    ctx.setLineDash([]);

    // Rays
    ctx.lineWidth = 2;
    // Incident
    const incidentStartX = centerX - Math.tan(radI) * centerY;
    const incidentStartY = 0;
    ctx.beginPath();
    ctx.moveTo(incidentStartX, incidentStartY);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    // Incident Arrow
    const midX = (incidentStartX + centerX) / 2;
    const midY = (incidentStartY + centerY) / 2;
    const arrowLen = 10;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(midX - arrowLen * Math.sin(radI + Math.PI / 6), midY - arrowLen * Math.cos(radI + Math.PI / 6));
    ctx.moveTo(midX, midY);
    ctx.lineTo(midX - arrowLen * Math.sin(radI - Math.PI / 6), midY - arrowLen * Math.cos(radI - Math.PI / 6));
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    // Refracted
    const refractedEndX = centerX + Math.tan(radR) * centerY;
    const refractedEndY = height;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(refractedEndX, refractedEndY);
    ctx.strokeStyle = '#10b981';
    ctx.stroke();

    // Refracted Arrow
    const rMidX = (centerX + refractedEndX) / 2;
    const rMidY = (centerY + refractedEndY) / 2;
    ctx.beginPath();
    ctx.moveTo(rMidX, rMidY);
    ctx.lineTo(rMidX - arrowLen * Math.sin(radR + Math.PI / 6), rMidY - arrowLen * Math.cos(radR + Math.PI / 6));
    ctx.moveTo(rMidX, rMidY);
    ctx.lineTo(rMidX - arrowLen * Math.sin(radR - Math.PI / 6), rMidY - arrowLen * Math.cos(radR - Math.PI / 6));
    ctx.strokeStyle = '#10b981';
    ctx.stroke();

    // Waves Incident
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    for (let i = -20; i < 30; i++) {
      const offset = (wavelength1 - (time * waveSpeed1) % wavelength1) + i * wavelength1;
      const x = centerX - offset * Math.sin(radI);
      const y = centerY - offset * Math.cos(radI);
      if (y < interfaceY && y > 0) {
        ctx.beginPath();
        const dx = Math.cos(radI) * 250;
        const dy = -Math.sin(radI) * 250;
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
      }
    }

    // Waves Refracted
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    for (let i = -20; i < 30; i++) {
      const offset = (time * waveSpeed2) % wavelength2 + i * wavelength2;
      const x = centerX + offset * Math.sin(radR);
      const y = centerY + offset * Math.cos(radR);
      if (y > interfaceY && y < height) {
        ctx.beginPath();
        const dx = Math.cos(radR) * 250;
        const dy = -Math.sin(radR) * 250;
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
      }
    }

    // Labels
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`v1 = ${v1.toFixed(1)} m/s`, 15, 25);
    ctx.fillText(`v2 = ${v2.toFixed(1)} m/s`, 15, height - 15);
    ctx.fillText(`θi = ${angle}°`, centerX - 50, centerY - 25);
    ctx.fillText(`θr = ${angleR.toFixed(1)}°`, centerX + 15, centerY + 35);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [angle, v1, v2]);


  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={400} 
      className="w-full h-full bg-white rounded-lg shadow-inner border border-gray-200"
    />
  );
};

const DiffractionSimulation: React.FC<{ wavelength: number; slitSize: number }> = ({ wavelength, slitSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>(null);

  const animate = () => {
    timeRef.current += 0.05;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = timeRef.current;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const slitX = width / 4;
    const centerY = height / 2;

    // Draw Media Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Draw Barrier
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(slitX - 5, 0, 10, centerY - slitSize / 2);
    ctx.fillRect(slitX - 5, centerY + slitSize / 2, 10, height - (centerY + slitSize / 2));

    // Plane waves from left
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
    ctx.lineWidth = 2;
    for (let x = (time * 25) % wavelength; x < slitX; x += wavelength) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Diffracted waves (Huygens Principle)
    // We simulate the wave spreading. Spreading angle theta approx lambda / d
    const numSources = Math.max(5, Math.floor(slitSize / 5));
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 1.5;
    
    for (let i = 0; i < numSources; i++) {
      const sy = centerY - slitSize / 2 + (i / (numSources - 1)) * slitSize;
      for (let r = (time * 25) % wavelength; r < width - slitX; r += wavelength) {
        if (r <= 0) continue;
        ctx.beginPath();
        // Limit the arc based on diffraction theory (approximate)
        // Smaller slit = wider angle
        const maxAngle = Math.min(Math.PI / 2, (wavelength / slitSize) * 2);
        ctx.arc(slitX, sy, r, -maxAngle, maxAngle);
        ctx.stroke();
      }
    }

    // Intensity Pattern on the far right
    const patternX = width - 40;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(patternX, 0, 40, height);
    
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    for (let y = 0; y < height; y++) {
      const angle = Math.atan2(y - centerY, width - slitX);
      // Single slit diffraction intensity formula: I = I0 * (sin(beta)/beta)^2 where beta = pi*d*sin(theta)/lambda
      const beta = (Math.PI * slitSize * Math.sin(angle)) / wavelength;
      const intensity = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
      const px = patternX + 5 + intensity * 30;
      if (y === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [wavelength, slitSize]);

  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="w-full h-full bg-white rounded-lg shadow-inner border border-gray-200"
      />
      <div className="absolute top-2 right-12 text-[10px] font-bold text-gray-500 bg-white/80 px-1 rounded">PADRÃO DE INTENSIDADE</div>
    </div>
  );
};

const ResonanceSimulation: React.FC<{ sourceFreq: number; naturalFreq: number }> = ({ sourceFreq, naturalFreq }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>(null);

  const animate = () => {
    timeRef.current += 0.1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = timeRef.current;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw Speaker (Source)
    const speakerX = 80;
    const speakerY = centerY;
    
    // Speaker Body
    const grad = ctx.createLinearGradient(speakerX - 40, speakerY, speakerX + 40, speakerY);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(speakerX - 40, speakerY - 50, 40, 100, 8);
    ctx.fill();
    
    // Speaker Cone
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(speakerX, speakerY - 40);
    ctx.lineTo(speakerX + 30, speakerY - 60);
    ctx.lineTo(speakerX + 30, speakerY + 60);
    ctx.lineTo(speakerX, speakerY + 40);
    ctx.fill();
    
    // Speaker Vibration
    const speakerVib = Math.sin(time * sourceFreq) * 3;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(speakerX + 15 + speakerVib, speakerY, 20, -Math.PI/3, Math.PI/3);
    ctx.stroke();

    // Draw Sound Waves
    const waveSpacing = 400 / sourceFreq;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    for (let r = (time * 60) % waveSpacing; r < 400; r += waveSpacing) {
      ctx.beginPath();
      ctx.arc(speakerX + 20, speakerY, r, -Math.PI / 5, Math.PI / 5);
      ctx.globalAlpha = Math.max(0, 1 - r / 400);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Physics: Resonance Amplitude
    // Lorentzian-like curve: A = 1 / sqrt((w0^2 - w^2)^2 + (gamma*w)^2)
    const gamma = 0.8; // Damping factor
    const w = sourceFreq;
    const w0 = naturalFreq;
    const diff = Math.abs(sourceFreq - naturalFreq);
    const amplitude = 60 / Math.sqrt(Math.pow(w0 * w0 - w * w, 2) + Math.pow(gamma * w, 2));
    const vibration = Math.sin(time * sourceFreq) * Math.min(amplitude, 45);

    // Draw Tuning Fork (Receiver)
    const receiverX = width - 180;
    const forkColor = diff < 0.3 ? '#ef4444' : '#475569';
    
    ctx.strokeStyle = forkColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    
    // Base
    ctx.beginPath();
    ctx.moveTo(receiverX, centerY + 100);
    ctx.lineTo(receiverX, centerY + 50);
    ctx.stroke();
    
    // Prongs
    ctx.beginPath();
    ctx.moveTo(receiverX - 25 + vibration, centerY - 60);
    ctx.quadraticCurveTo(receiverX - 25, centerY + 50, receiverX, centerY + 50);
    ctx.quadraticCurveTo(receiverX + 25, centerY + 50, receiverX + 25 - vibration, centerY - 60);
    ctx.stroke();

    // Resonance Curve Graph
    const graphX = width - 150;
    const graphY = 80;
    const graphW = 120;
    const graphH = 60;
    
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(graphX, graphY - graphH, graphW, graphH);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(graphX, graphY - graphH, graphW, graphH);
    
    // Draw Curve
    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8';
    for (let f = 1; f <= 10; f += 0.1) {
      const amp = 30 / Math.sqrt(Math.pow(w0 * w0 - f * f, 2) + Math.pow(gamma * f, 2));
      const px = graphX + ((f - 1) / 9) * graphW;
      const py = graphY - Math.min(amp, graphH);
      if (f === 1) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    
    // Current Frequency Marker
    const markerX = graphX + ((sourceFreq - 1) / 9) * graphW;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(markerX, graphY - Math.min(30 / Math.sqrt(Math.pow(w0 * w0 - w * w, 2) + Math.pow(gamma * w, 2)), graphH), 4, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText("Curva de Resposta", graphX, graphY + 15);
    
    if (diff < 0.3) {
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText("RESSONÂNCIA!", centerX - 70, 40);
      ctx.restore();
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [sourceFreq, naturalFreq]);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={400} 
      className="w-full h-full bg-white rounded-lg shadow-inner border border-gray-200"
    />
  );
};

// String Pulse Interference Simulation (1D Transverse Wave Superposition)
const StringInterferenceSimulation: React.FC<{
  amp1: number;
  amp2: number;
  pulseWidth: number;
  speed: number;
  showComponents: boolean;
  showParticles: boolean;
  isPlaying: boolean;
  progress: number;
  onProgressChange: (p: number) => void;
}> = ({
  amp1,
  amp2,
  pulseWidth,
  speed,
  showComponents,
  showParticles,
  isPlaying,
  progress,
  onProgressChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const progressRef = useRef(progress);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlayingRef.current) {
        let newP = progressRef.current + delta * 0.35 * speedRef.current;
        if (newP > 1) {
          newP = 0; // Loop seamlessly
        }
        progressRef.current = newP;
        onProgressChange(newP);
      }

      const p = progressRef.current;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const y0 = height / 2; // Equilibrium baseline
      const clampLeftX = 35;
      const clampRightX = width - 35;
      const startX1 = 80;
      const endX1 = width - 80;
      const startX2 = width - 80;
      const endX2 = 80;

      // Pulse Centers at progress p
      const center1 = startX1 + (endX1 - startX1) * p;
      const center2 = startX2 + (endX2 - startX2) * p;

      // Background subtle grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 40; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, height - 20);
        ctx.stroke();
      }
      for (let y = 40; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
      }

      // Draw Baseline (Equilibrium line)
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(clampLeftX, y0);
      ctx.lineTo(clampRightX, y0);
      ctx.stroke();
      ctx.setLineDash([]);

      // Baseline label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText("Posição de Equilíbrio (y = 0)", clampLeftX + 10, y0 - 8);

      // Function to calculate individual pulse displacements
      // Inverted screen Y: upward displacement is negative in canvas Y
      const getPulse1 = (x: number) => {
        const d = Math.abs(x - center1);
        if (d >= pulseWidth) return 0;
        return -amp1 * 0.5 * (1 + Math.cos((Math.PI * d) / pulseWidth));
      };

      const getPulse2 = (x: number) => {
        const d = Math.abs(x - center2);
        if (d >= pulseWidth) return 0;
        return -amp2 * 0.5 * (1 + Math.cos((Math.PI * d) / pulseWidth));
      };

      // Draw Individual Component Curves (Ghost / Dashed Lines)
      if (showComponents) {
        // Pulse 1 (Blue dashed)
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.65)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(clampLeftX, y0);
        for (let x = clampLeftX; x <= clampRightX; x += 2) {
          ctx.lineTo(x, y0 + getPulse1(x));
        }
        ctx.stroke();

        // Pulse 2 (Emerald/Rose dashed depending on phase)
        ctx.strokeStyle = amp2 >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(244, 63, 94, 0.7)';
        ctx.beginPath();
        ctx.moveTo(clampLeftX, y0);
        for (let x = clampLeftX; x <= clampRightX; x += 2) {
          ctx.lineTo(x, y0 + getPulse2(x));
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Pulse labels & velocity vectors
        if (center1 >= clampLeftX + 20 && center1 <= clampRightX - 20) {
          const y1Peak = y0 - amp1;
          ctx.fillStyle = '#2563eb';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(`Pulso 1 → (v)`, center1 - 32, y1Peak + (amp1 >= 0 ? -12 : 22));
          
          // Arrow for Pulse 1
          ctx.strokeStyle = '#2563eb';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(center1 - 15, y1Peak + (amp1 >= 0 ? -6 : 14));
          ctx.lineTo(center1 + 15, y1Peak + (amp1 >= 0 ? -6 : 14));
          ctx.lineTo(center1 + 10, y1Peak + (amp1 >= 0 ? -10 : 10));
          ctx.stroke();
        }

        if (center2 >= clampLeftX + 20 && center2 <= clampRightX - 20) {
          const y2Peak = y0 - amp2;
          ctx.fillStyle = amp2 >= 0 ? '#059669' : '#e11d48';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(`(v) ← Pulso 2`, center2 - 32, y2Peak + (amp2 >= 0 ? -12 : 22));

          // Arrow for Pulse 2
          ctx.strokeStyle = amp2 >= 0 ? '#059669' : '#e11d48';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(center2 + 15, y2Peak + (amp2 >= 0 ? -6 : 14));
          ctx.lineTo(center2 - 15, y2Peak + (amp2 >= 0 ? -6 : 14));
          ctx.lineTo(center2 - 10, y2Peak + (amp2 >= 0 ? -10 : 10));
          ctx.stroke();
        }
      }

      // Draw Main Resultant String (Superposition: y = y1 + y2)
      ctx.save();
      ctx.shadowColor = 'rgba(79, 70, 229, 0.35)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(clampLeftX, y0);
      for (let x = clampLeftX; x <= clampRightX; x += 1.5) {
        const yTotal = y0 + getPulse1(x) + getPulse2(x);
        ctx.lineTo(x, yTotal);
      }
      ctx.stroke();
      ctx.restore();

      // Highlight particles (beads on string) to show vertical transverse motion
      if (showParticles) {
        const numParticles = 21;
        for (let i = 0; i < numParticles; i++) {
          const px = clampLeftX + (i / (numParticles - 1)) * (clampRightX - clampLeftX);
          const py = y0 + getPulse1(px) + getPulse2(px);

          // Motion track (vertical dashed line indicating transverse displacement)
          if (Math.abs(py - y0) > 3) {
            ctx.setLineDash([2, 3]);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(px, y0);
            ctx.lineTo(px, py);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Bead
          ctx.fillStyle = '#6366f1';
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Central Superposition Peak Indicator (at x = 300)
      const midX = width / 2;
      const centerDist = Math.abs(center1 - center2);
      if (centerDist < 40) {
        const midY = y0 + getPulse1(midX) + getPulse2(midX);
        const totalA = -(getPulse1(midX) + getPulse2(midX));
        
        ctx.fillStyle = Math.abs(totalA) > 10 ? '#4f46e5' : '#059669';
        ctx.beginPath();
        ctx.arc(midX, midY, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Amplitude callout
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        const calloutY = midY < y0 ? midY - 35 : midY + 15;
        ctx.roundRect(midX - 70, calloutY, 140, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        if (Math.abs(totalA) < 4) {
          ctx.fillText("Anulação Total: y = 0", midX, calloutY + 16);
        } else {
          ctx.fillText(`Superposição: y = ${Math.round(totalA)} px`, midX, calloutY + 16);
        }
        ctx.textAlign = 'left';
      }

      // Draw Clamp Posts (Supports at both ends)
      const drawClamp = (cx: number) => {
        // Vertical metal stand
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx - 8, y0 - 100, 16, 200);
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 10, y0 - 105, 20, 10);
        ctx.fillRect(cx - 10, y0 + 95, 20, 10);

        // Fixed Ring / Knot
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(cx, y0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      };
      drawClamp(clampLeftX);
      drawClamp(clampRightX);

      // Live Phase Status Badge
      let phaseText = "1. Aproximação dos Pulsos";
      let phaseColor = "#3b82f6";
      let phaseBg = "rgba(239, 246, 255, 0.95)";
      
      if (p >= 0.38 && p <= 0.62) {
        if (amp1 * amp2 > 0) {
          phaseText = "2. Superposição: INTERFERÊNCIA CONSTRUTIVA (Reforço)";
          phaseColor = "#4f46e5";
          phaseBg = "rgba(238, 242, 255, 0.95)";
        } else if (amp1 * amp2 < 0 && Math.abs(amp1) === Math.abs(amp2)) {
          phaseText = "2. Superposição: INTERFERÊNCIA DESTRUTIVA TOTAL (Anulação)";
          phaseColor = "#e11d48";
          phaseBg = "rgba(255, 241, 242, 0.95)";
        } else {
          phaseText = "2. Superposição: INTERFERÊNCIA DESTRUTIVA PARCIAL";
          phaseColor = "#d97706";
          phaseBg = "rgba(255, 251, 235, 0.95)";
        }
      } else if (p > 0.62) {
        phaseText = "3. Separação: Cada pulso segue inalterado!";
        phaseColor = "#059669";
        phaseBg = "rgba(236, 253, 245, 0.95)";
      }

      // Render Stage Badge at top center
      ctx.fillStyle = phaseBg;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const badgeW = 340;
      ctx.roundRect((width - badgeW) / 2, 12, badgeW, 26, 13);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = phaseColor;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(phaseText, width / 2, 29);
      ctx.textAlign = 'left';

      // Legend bottom box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.roundRect(14, height - 42, width - 28, 30, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#4f46e5';
      ctx.fillText("━ Corda Resultante (y = y₁ + y₂)", 25, height - 23);
      if (showComponents) {
        ctx.fillStyle = '#2563eb';
        ctx.fillText("--- Pulso 1", 215, height - 23);
        ctx.fillStyle = amp2 >= 0 ? '#059669' : '#e11d48';
        ctx.fillText("--- Pulso 2", 305, height - 23);
      }
      ctx.fillStyle = '#64748b';
      ctx.fillText("• Princípio da Superposição de Ondas em Corda", width - 250, height - 23);

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [amp1, amp2, pulseWidth, showComponents, showParticles, onProgressChange]);

  return (
    <div className="relative w-full h-full bg-white rounded-lg p-2 overflow-hidden border border-gray-200 shadow-inner">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-full bg-slate-50 rounded"
      />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="px-2 py-0.5 bg-white/90 backdrop-blur border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wider shadow-sm">
          Corda 1D
        </span>
        <span className="px-2 py-0.5 bg-indigo-600 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
          Transversal
        </span>
      </div>
    </div>
  );
};

const InterferenceSimulation: React.FC<{ distance: number; phase: 'in' | 'out'; active1: boolean; active2: boolean }> = ({ distance, phase, active1, active2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const requestRef = useRef<number>(null);

  const animate = () => {
    if (active1 || active2) {
      timeRef.current += 0.12;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = timeRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    const res = 5; // Resolution for performance
    const wavelength = 45;
    const k = (2 * Math.PI) / wavelength;
    const omega = 1.0;
    const phaseShift = phase === 'in' ? 0 : Math.PI;

    const s1x = width / 2 - distance / 2;
    const s1y = height / 2;
    const s2x = width / 2 + distance / 2;
    const s2y = height / 2;

    // Background pattern
    const isInterference = active1 && active2;
    
    for (let x = 0; x < width; x += res) {
      for (let y = 0; y < height; y += res) {
        const d1 = Math.sqrt((x - s1x)**2 + (y - s1y)**2);
        const d2 = Math.sqrt((x - s2x)**2 + (y - s2y)**2);
        
        const amp1 = active1 ? Math.sin(k * d1 - omega * time) : 0;
        const amp2 = active2 ? Math.sin(k * d2 - omega * time + phaseShift) : 0;
        
        const totalAmp = (amp1 + amp2);
        
        // Color mapping: 
        // If interference, show nodal lines (gray)
        // If single source, show smooth gradient
        if (!active1 && !active2) {
          ctx.fillStyle = '#f8fafc';
        } else if (isInterference && Math.abs(totalAmp) < 0.2) {
          ctx.fillStyle = '#f8fafc'; // Nodal region (destructive interference)
        } else if (totalAmp > 0) {
          const intensity = Math.floor(Math.min(totalAmp, 2) * 127);
          ctx.fillStyle = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
        } else {
          const intensity = Math.floor(Math.abs(Math.max(totalAmp, -2)) * 127);
          ctx.fillStyle = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
        }
        ctx.fillRect(x, y, res, res);
      }
    }

    // Draw Sources
    const drawSource = (sx: number, sy: number, active: boolean) => {
      const pulse = active ? Math.sin(time * omega) * 5 : 0;
      ctx.fillStyle = active ? '#1e293b' : '#94a3b8';
      ctx.beginPath();
      ctx.arc(sx, sy, 8 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    drawSource(s1x, s1y, active1);
    drawSource(s2x, s2y, active2);

    // Legend & Info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.roundRect(10, 10, 220, isInterference ? 85 : 60, 8);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(isInterference ? "LEGENDA DE INTERFERÊNCIA" : "PROPAGAÇÃO SIMPLES", 20, 30);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#ef4444'; ctx.fillText(isInterference ? "■ Reforço Positivo (Crista + Crista)" : "■ Crista da Onda", 20, 45);
    ctx.fillStyle = '#3b82f6'; ctx.fillText(isInterference ? "■ Reforço Negativo (Vale + Vale)" : "■ Vale da Onda", 20, 58);
    if (isInterference) {
      ctx.fillStyle = '#94a3b8'; ctx.fillText("■ Anulação (Interferência Destrutiva)", 20, 71);
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [distance, phase, active1, active2]);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={400} 
      className="w-full h-full bg-white rounded-lg shadow-inner border border-gray-200"
    />
  );
};

const PolarizationSimulation: React.FC<{ filterAngle: number; activePlanes: number }> = ({ filterAngle, activePlanes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  
  // Refs for props to avoid re-creating the effect
  const filterAngleRef = useRef(filterAngle);
  const activePlanesRef = useRef(activePlanes);

  useEffect(() => {
    filterAngleRef.current = filterAngle;
    activePlanesRef.current = activePlanes;
  }, [filterAngle, activePlanes]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 400;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 8, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Central Axis
    const axisGeom = new THREE.CylinderGeometry(0.04, 0.04, 20, 8);
    axisGeom.rotateZ(Math.PI / 2);
    const axisMat = new THREE.MeshPhongMaterial({ color: 0x475569 });
    const axis = new THREE.Mesh(axisGeom, axisMat);
    scene.add(axis);

    // Filter
    const filterGroup = new THREE.Group();
    const filterGeom = new THREE.BoxGeometry(0.3, 6, 6);
    const filterMat = new THREE.MeshPhongMaterial({ 
      color: 0x64748b, 
      transparent: true, 
      opacity: 0.6,
      side: THREE.DoubleSide 
    });
    const filterBody = new THREE.Mesh(filterGeom, filterMat);
    filterGroup.add(filterBody);

    // Filter Slots
    const slotGeom = new THREE.BoxGeometry(0.35, 5.5, 0.08);
    const slotMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    for (let i = -2.5; i <= 2.5; i += 0.5) {
      const slot = new THREE.Mesh(slotGeom, slotMat);
      slot.position.z = i;
      filterGroup.add(slot);
    }
    filterGroup.position.x = 2;
    scene.add(filterGroup);

    // Waves Pool
    const MAX_PLANES = 8;
    const unpolarizedWaves: THREE.Line[] = [];
    const colors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0xec4899, 0x06b6d4, 0x8b5cf6, 0x14b8a6];
    
    for (let i = 0; i < MAX_PLANES; i++) {
      const geom = new THREE.BufferGeometry();
      const mat = new THREE.LineBasicMaterial({ 
        color: colors[i % colors.length], 
        transparent: true, 
        opacity: 0.8,
        linewidth: 3
      });
      const line = new THREE.Line(geom, mat);
      scene.add(line);
      unpolarizedWaves.push(line);
    }

    // Polarized Wave
    const polarizedGeom = new THREE.BufferGeometry();
    const polarizedMat = new THREE.LineBasicMaterial({ 
      color: 0xffffff,
      linewidth: 4
    });
    const polarizedWave = new THREE.Line(polarizedGeom, polarizedMat);
    scene.add(polarizedWave);

    const animate = () => {
      timeRef.current += 0.04;
      const t = timeRef.current;
      const currentPlanes = activePlanesRef.current;
      const currentFilterAngle = filterAngleRef.current;

      // Update Filter
      const fRad = (currentFilterAngle * Math.PI) / 180;
      filterGroup.rotation.x = fRad;

      // Update Waves
      for (let i = 0; i < MAX_PLANES; i++) {
        if (i < currentPlanes) {
          unpolarizedWaves[i].visible = true;
          const planeAngle = (i * Math.PI) / currentPlanes;
          const points = [];
          
          // Component of the wave that passes through the filter (Malus Law for amplitude)
          const projection = Math.cos(planeAngle - fRad);
          
          for (let x = -8; x <= 8; x += 0.2) {
            const waveValue = Math.sin(x * 2 - t * 6) * 1.8;
            if (x <= 2) {
              // Before filter: wave vibrates in its original plane
              points.push(new THREE.Vector3(x, waveValue * Math.cos(planeAngle), waveValue * Math.sin(planeAngle)));
            } else {
              // After filter: only the component parallel to the filter axis passes
              // The vibration direction is now aligned with the filter
              points.push(new THREE.Vector3(x, waveValue * projection * Math.cos(fRad), waveValue * projection * Math.sin(fRad)));
            }
          }
          unpolarizedWaves[i].geometry.setFromPoints(points);
          
          // Adjust opacity after filter to emphasize "blocking"
          // Note: LineBasicMaterial doesn't support vertex colors easily here, 
          // but we can at least show the amplitude reduction.
        } else {
          unpolarizedWaves[i].visible = false;
        }
      }

      // The separate polarized wave is now integrated into the unpolarized waves' paths
      polarizedWave.visible = false;

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) continue;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      // Dispose resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-slate-900 rounded-lg shadow-inner border border-slate-700 overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-slate-500 text-xs font-mono opacity-20">3D VIEWPORT</div>
      </div>
    </div>
  );
};

const SurfaceWaveSimulation: React.FC<{ h1: number; h2: number; trigger: number }> = ({ h1, h2, trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  
  const pointsCount = 600; // 1:1 with standard width for max smoothness
  const heightsRef = useRef(new Float32Array(pointsCount).fill(0));
  const velocitiesRef = useRef(new Float32Array(pointsCount).fill(0));
  const lastTriggerRef = useRef(trigger);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const h = heightsRef.current;
    const v = velocitiesRef.current;
    
    // Wave physics parameters
    const subSteps = 4; // Multi-step for stability and smoothness
    const dt = 1.0 / subSteps;
    const damping = 0; // Purely persistent waves as requested
    const waveTension = 0.05;

    // Trigger a high-quality wave packet
    if (trigger !== lastTriggerRef.current) {
      const packetLength = 60; 
      const amplitude = 85; 
      const frequency = 2.5; 
      
      for (let i = 0; i < packetLength * 2; i++) {
        if (i < pointsCount) {
          const x = (i - packetLength) / (packetLength * 0.5);
          const envelope = Math.exp(-x * x * 2.0); // Tighter envelope for better rounding
          h[i] -= amplitude * Math.sin(x * Math.PI * frequency) * envelope;
        }
      }
      lastTriggerRef.current = trigger;
    }

    // Physics update: Discrete Wave Equation with sub-stepping
    const g = 0.6; 
    
    for (let step = 0; step < subSteps; step++) {
      // Temporary array or compute in-place carefully
      // To avoid extra allocations, we do it in two passes
      for (let i = 0; i < pointsCount; i++) {
          const xPos = (i / pointsCount) * width;
          const currentDepth = xPos < width / 2 ? h1 : h2;
          const localCSq = g * (currentDepth / 12); 
          
          const prev = i > 0 ? h[i-1] : h[i]; 
          let next;
          if (i < pointsCount - 1) {
            next = h[i+1];
          } else {
            next = h[i] * 0.75; // Absorptive edge
          }
          
          const accel = localCSq * (prev + next - 2 * h[i]) * waveTension;
          v[i] += accel * dt;
          
          // Energy Preservation in main area
          // Gradual absorption zone ONLY at the very end
          const absorptionStart = 0.88;
          if (i > pointsCount * absorptionStart) {
            const factor = (i - pointsCount * absorptionStart) / (pointsCount * (1 - absorptionStart));
            v[i] *= (1 - factor * 0.15);
            h[i] *= (1 - factor * 0.1);
          }
      }
      
      for (let i = 0; i < pointsCount; i++) {
          h[i] += v[i] * dt;
      }
    }

    // Drawing Layout
    const centerY = height / 2;
    const tankPadding = 20;
    const tankWidth = width - 2 * tankPadding;

    // Background Grid
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1;
    for (let gx = tankPadding; gx <= width - tankPadding; gx += 50) {
        ctx.beginPath(); ctx.moveTo(gx, tankPadding); ctx.lineTo(gx, height - tankPadding); ctx.stroke();
    }
    for (let gy = tankPadding; gy <= height - tankPadding; gy += 50) {
        ctx.beginPath(); ctx.moveTo(tankPadding, gy); ctx.lineTo(width - tankPadding, gy); ctx.stroke();
    }

    // Tank Bed
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(tankPadding, centerY + h1);
    ctx.lineTo(tankPadding + tankWidth / 2, centerY + h1);
    ctx.lineTo(tankPadding + tankWidth / 2, centerY + h2);
    ctx.lineTo(tankPadding + tankWidth, centerY + h2);
    ctx.lineTo(tankPadding + tankWidth, height - tankPadding);
    ctx.lineTo(tankPadding, height - tankPadding);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(tankPadding, centerY + h1);
    ctx.lineTo(tankPadding + tankWidth / 2, centerY + h1);
    ctx.lineTo(tankPadding + tankWidth / 2, centerY + h2);
    ctx.lineTo(tankPadding + tankWidth, centerY + h2);
    ctx.stroke();

    // Water
    const waterGrad = ctx.createLinearGradient(0, centerY - 150, 0, height);
    waterGrad.addColorStop(0, '#3b82f6');
    waterGrad.addColorStop(0.6, '#1d4ed8');
    waterGrad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = waterGrad;
    ctx.globalAlpha = 0.75;
    
    ctx.beginPath();
    ctx.moveTo(tankPadding, centerY + h[0]);
    for (let i = 1; i < pointsCount; i++) {
      const x = tankPadding + (i / (pointsCount - 1)) * tankWidth;
      ctx.lineTo(x, centerY + h[i]);
    }
    ctx.lineTo(tankPadding + tankWidth, height - tankPadding);
    ctx.lineTo(tankPadding, height - tankPadding);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Surface Highlight - Bold and Rounded
    ctx.beginPath();
    ctx.moveTo(tankPadding, centerY + h[0]);
    for (let i = 1; i < pointsCount; i++) {
      const x = tankPadding + (i / (pointsCount - 1)) * tankWidth;
      ctx.lineTo(x, centerY + h[i]);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Buoys
    [0.2, 0.4, 0.6, 0.8].forEach(pos => {
        const index = Math.floor(pos * (pointsCount - 1));
        const bx = tankPadding + pos * tankWidth;
        const by = centerY + h[index];
        
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
        
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
        ctx.beginPath(); ctx.moveTo(bx, centerY - 80); ctx.lineTo(bx, centerY + 80); ctx.stroke();
        ctx.setLineDash([]);
    });

    // Annotations
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px sans-serif';
    const v1_phys = Math.sqrt(9.8 * h1 / 10).toFixed(1);
    const v2_phys = Math.sqrt(9.8 * h2 / 10).toFixed(1);
    ctx.fillText(`MEIO PROFUNDO: v ≈ ${v1_phys} m/s`, tankPadding + 10, centerY - 120);
    ctx.fillText(`MEIO RASO: v ≈ ${v2_phys} m/s`, tankPadding + tankWidth / 2 + 10, centerY - 120);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [h1, h2, trigger]);

  return (
    <div className="relative w-full h-full bg-white rounded-lg p-2 overflow-hidden">
        <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="w-full h-full bg-slate-50 rounded shadow-inner"
        />
        <div className="absolute top-4 left-4 flex gap-4">
            <div className="px-2 py-1 bg-white/80 backdrop-blur border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                Vista Lateral
            </div>
            <div className="px-2 py-1 bg-red-500 border border-red-400 rounded text-[10px] font-bold text-white uppercase tracking-widest shadow-sm animate-pulse">
                Onda Transversal
            </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/90 backdrop-blur border border-slate-200 rounded-full text-[11px] font-medium text-slate-600 shadow-lg">
            Partículas oscilam na vertical, energia viaja na horizontal
        </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'reflexao' | 'refracao' | 'difracao' | 'polarizacao' | 'ressonancia' | 'interferencia' | 'tanque'>('reflexao');
  
  // Controls
  const [angle, setAngle] = useState(30);
  const [v1, setV1] = useState(3.0);
  const [v2, setV2] = useState(2.0);
  const [wavelength, setWavelength] = useState(30);
  const [slitSize, setSlitSize] = useState(40);
  const [filterAngle, setFilterAngle] = useState(0);
  const [activePlanes, setActivePlanes] = useState(4);
  
  // Resonance controls
  const [sourceFreq, setSourceFreq] = useState(5.0);
  const [naturalFreq, setNaturalFreq] = useState(5.0);

  // Interference (2D) controls
  const [interfMode, setInterfMode] = useState<'corda' | '2d'>('corda');
  const [interfDistance, setInterfDistance] = useState(80);
  const [interfPhase, setInterfPhase] = useState<'in' | 'out'>('in');
  const [interfActive1, setInterfActive1] = useState(true);
  const [interfActive2, setInterfActive2] = useState(true);

  // String Interference (1D) controls
  const [stringAmp1, setStringAmp1] = useState(60);
  const [stringAmp2, setStringAmp2] = useState(60);
  const [stringPulseWidth, setStringPulseWidth] = useState(80);
  const [stringSpeed, setStringSpeed] = useState(1.2);
  const [stringShowComponents, setStringShowComponents] = useState(true);
  const [stringShowParticles, setStringShowParticles] = useState(true);
  const [stringIsPlaying, setStringIsPlaying] = useState(true);
  const [stringProgress, setStringProgress] = useState(0);

  // Surface Wave controls
  const [h1, setH1] = useState(60);
  const [h2, setH2] = useState(30);
  const [waveTrigger, setWaveTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-900 mb-2">Fenômenos ondulatórios - Prof. Grossi</h1>
        </header>

        <nav className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'reflexao', label: 'Reflexão' },
            { id: 'refracao', label: 'Refração' },
            { id: 'difracao', label: 'Difração' },
            { id: 'interferencia', label: 'Interferência' },
            { id: 'polarizacao', label: 'Polarização' },
            { id: 'ressonancia', label: 'Ressonância' },
            { id: 'tanque', label: 'Ondas na superfície' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-2 rounded-full font-medium transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg scale-105" 
                  : "bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Simulation Viewport */}
          <div className="lg:col-span-2 aspect-video relative">
            {activeTab === 'reflexao' && <ReflectionSimulation angle={angle} />}
            {activeTab === 'refracao' && <RefractionSimulation angle={angle} v1={v1} v2={v2} />}
            {activeTab === 'difracao' && <DiffractionSimulation wavelength={wavelength} slitSize={slitSize} />}
            {activeTab === 'polarizacao' && <PolarizationSimulation filterAngle={filterAngle} activePlanes={activePlanes} />}
            {activeTab === 'ressonancia' && <ResonanceSimulation sourceFreq={sourceFreq} naturalFreq={naturalFreq} />}
            {activeTab === 'interferencia' && (
              interfMode === 'corda' ? (
                <StringInterferenceSimulation
                  amp1={stringAmp1}
                  amp2={stringAmp2}
                  pulseWidth={stringPulseWidth}
                  speed={stringSpeed}
                  showComponents={stringShowComponents}
                  showParticles={stringShowParticles}
                  isPlaying={stringIsPlaying}
                  progress={stringProgress}
                  onProgressChange={setStringProgress}
                />
              ) : (
                <InterferenceSimulation distance={interfDistance} phase={interfPhase} active1={interfActive1} active2={interfActive2} />
              )
            )}
            {activeTab === 'tanque' && <SurfaceWaveSimulation h1={h1} h2={h2} trigger={waveTrigger} />}
          </div>

          {/* Controls Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-indigo-900 border-b pb-2">Controles</h2>
            
            {activeTab === 'reflexao' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Ângulo de Incidência: {angle}°</span>
                  <input 
                    type="range" min="0" max="80" value={angle} 
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <div className="p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
                  <p><strong>Lei da Reflexão:</strong> O ângulo de incidência (θi) é sempre igual ao ângulo de reflexão (θr).</p>
                </div>
              </div>
            )}

            {activeTab === 'refracao' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Ângulo de Incidência: {angle}°</span>
                  <input 
                    type="range" min="0" max="80" value={angle} 
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Velocidade Meio 1 (v1): {v1.toFixed(1)} m/s</span>
                  <input 
                    type="range" min="1" max="5" step="0.1" value={v1} 
                    onChange={(e) => setV1(parseFloat(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Velocidade Meio 2 (v2): {v2.toFixed(1)} m/s</span>
                  <input 
                    type="range" min="1" max="5" step="0.1" value={v2} 
                    onChange={(e) => setV2(parseFloat(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <div className="p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
                  <p><strong>Lei de Snell:</strong> sen(θ₁)/v₁ = sen(θ₂)/v₂</p>
                  <p className="mt-2">A mudança na velocidade da onda ao trocar de meio causa o desvio.</p>
                </div>
              </div>
            )}

            {activeTab === 'difracao' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Comprimento de Onda (λ): {wavelength}px</span>
                  <input 
                    type="range" min="10" max="60" value={wavelength} 
                    onChange={(e) => setWavelength(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Tamanho da Fenda (d): {slitSize}px</span>
                  <input 
                    type="range" min="5" max="100" value={slitSize} 
                    onChange={(e) => setSlitSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <div className="p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
                  <p><strong>Difração:</strong> Capacidade da onda de contornar obstáculos. É mais intensa quando λ ≈ d.</p>
                </div>
              </div>
            )}

            {activeTab === 'polarizacao' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Ângulo do Filtro: {filterAngle}°</span>
                  <input 
                    type="range" min="0" max="180" value={filterAngle} 
                    onChange={(e) => setFilterAngle(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Planos de Vibração: {activePlanes}</span>
                  <input 
                    type="range" min="1" max="8" value={activePlanes} 
                    onChange={(e) => setActivePlanes(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <div className="p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
                  <p><strong>Polarização:</strong> Seleção de uma única direção de vibração para ondas transversais.</p>
                </div>
              </div>
            )}

            {activeTab === 'ressonancia' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Frequência da Fonte: {sourceFreq.toFixed(1)} Hz</span>
                  <input 
                    type="range" min="1" max="10" step="0.1" value={sourceFreq} 
                    onChange={(e) => setSourceFreq(parseFloat(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Frequência Natural: {naturalFreq.toFixed(1)} Hz</span>
                  <input 
                    type="range" min="1" max="10" step="0.1" value={naturalFreq} 
                    onChange={(e) => setNaturalFreq(parseFloat(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>
                <div className="p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
                  <p><strong>Ressonância:</strong> Ocorre quando a frequência da fonte coincide com a frequência natural do sistema, maximizando a amplitude.</p>
                </div>
              </div>
            )}

            {activeTab === 'interferencia' && (
              <div className="space-y-4">
                {/* Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Tipo de Exemplo:
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      onClick={() => setInterfMode('corda')}
                      className={cn(
                        "py-2 px-3 text-xs font-bold rounded-lg transition-all",
                        interfMode === 'corda'
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      Ondas em Corda (1D)
                    </button>
                    <button
                      onClick={() => setInterfMode('2d')}
                      className={cn(
                        "py-2 px-3 text-xs font-bold rounded-lg transition-all",
                        interfMode === '2d'
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      Superfície 2D (Fontes)
                    </button>
                  </div>
                </div>

                {interfMode === 'corda' ? (
                  <div className="space-y-4">
                    {/* Presets */}
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Padrões Didáticos:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setStringAmp1(60);
                            setStringAmp2(60);
                          }}
                          className={cn(
                            "py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left",
                            stringAmp1 > 0 && stringAmp2 > 0 && stringAmp1 === stringAmp2
                              ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <div className="text-[11px] font-bold text-indigo-600">↑ ↑ Construtiva</div>
                          <div className="text-[10px] text-gray-500">Mesma fase (+A, +A)</div>
                        </button>
                        <button
                          onClick={() => {
                            setStringAmp1(60);
                            setStringAmp2(-60);
                          }}
                          className={cn(
                            "py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left",
                            stringAmp1 > 0 && stringAmp2 < 0 && Math.abs(stringAmp1) === Math.abs(stringAmp2)
                              ? "bg-rose-50 border-rose-300 text-rose-700 font-bold"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <div className="text-[11px] font-bold text-rose-600">↑ ↓ Destrutiva Total</div>
                          <div className="text-[10px] text-gray-500">Oposição (+A, -A)</div>
                        </button>
                        <button
                          onClick={() => {
                            setStringAmp1(60);
                            setStringAmp2(-30);
                          }}
                          className={cn(
                            "py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left",
                            stringAmp1 > 0 && stringAmp2 < 0 && Math.abs(stringAmp1) !== Math.abs(stringAmp2)
                              ? "bg-amber-50 border-amber-300 text-amber-700 font-bold"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <div className="text-[11px] font-bold text-amber-600">↑ ↓ Destrutiva Parcial</div>
                          <div className="text-[10px] text-gray-500">Amplitudes diferentes</div>
                        </button>
                        <button
                          onClick={() => {
                            setStringAmp1(-50);
                            setStringAmp2(-50);
                          }}
                          className={cn(
                            "py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left",
                            stringAmp1 < 0 && stringAmp2 < 0
                              ? "bg-blue-50 border-blue-300 text-blue-700 font-bold"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <div className="text-[11px] font-bold text-blue-600">↓↓ Vales Construtivos</div>
                          <div className="text-[10px] text-gray-500">Superposição negativa</div>
                        </button>
                      </div>
                    </div>

                    {/* Playback Controls Bar */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => setStringIsPlaying(!stringIsPlaying)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm transition-all"
                        >
                          {stringIsPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {stringIsPlaying ? "Pausar" : "Animar"}
                        </button>
                        <button
                          onClick={() => {
                            setStringProgress(0);
                            setStringIsPlaying(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-xs shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reiniciar
                        </button>
                        <button
                          onClick={() => {
                            setStringProgress(0.5);
                            setStringIsPlaying(false);
                          }}
                          className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs"
                          title="Ir para o instante exato do encontro no centro"
                        >
                          Momento do Encontro
                        </button>
                      </div>

                      {/* Timeline Scrubber */}
                      <div>
                        <div className="flex justify-between text-[11px] text-gray-600 font-medium">
                          <span>Posição / Tempo:</span>
                          <span className="font-bold text-indigo-600">{Math.round(stringProgress * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.005"
                          value={stringProgress}
                          onChange={(e) => {
                            setStringProgress(parseFloat(e.target.value));
                            setStringIsPlaying(false);
                          }}
                          className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer mt-1"
                        />
                      </div>
                    </div>

                    {/* Amplitude Sliders */}
                    <div className="space-y-3 pt-1">
                      <label className="block">
                        <div className="flex justify-between text-xs font-medium text-gray-700">
                          <span>Amplitude Pulso 1 (Esquerda →):</span>
                          <span className="font-bold text-blue-600">{stringAmp1 > 0 ? `+${stringAmp1}px (Crista)` : stringAmp1 < 0 ? `${stringAmp1}px (Vale)` : '0px'}</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          step="5"
                          value={stringAmp1}
                          onChange={(e) => setStringAmp1(parseInt(e.target.value))}
                          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer mt-1"
                        />
                      </label>

                      <label className="block">
                        <div className="flex justify-between text-xs font-medium text-gray-700">
                          <span>Amplitude Pulso 2 (← Direita):</span>
                          <span className={cn("font-bold", stringAmp2 >= 0 ? "text-emerald-600" : "text-rose-600")}>
                            {stringAmp2 > 0 ? `+${stringAmp2}px (Crista)` : stringAmp2 < 0 ? `${stringAmp2}px (Vale)` : '0px'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          step="5"
                          value={stringAmp2}
                          onChange={(e) => setStringAmp2(parseInt(e.target.value))}
                          className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer mt-1"
                        />
                      </label>

                      <label className="block">
                        <div className="flex justify-between text-xs font-medium text-gray-700">
                          <span>Largura do Pulso (w):</span>
                          <span className="font-semibold text-gray-800">{stringPulseWidth}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="130"
                          step="5"
                          value={stringPulseWidth}
                          onChange={(e) => setStringPulseWidth(parseInt(e.target.value))}
                          className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-1"
                        />
                      </label>

                      <label className="block">
                        <div className="flex justify-between text-xs font-medium text-gray-700">
                          <span>Velocidade de Propagação:</span>
                          <span className="font-semibold text-gray-800">{stringSpeed.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.4"
                          max="2.5"
                          step="0.1"
                          value={stringSpeed}
                          onChange={(e) => setStringSpeed(parseFloat(e.target.value))}
                          className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-1"
                        />
                      </label>
                    </div>

                    {/* View Options */}
                    <div className="flex flex-col gap-2 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={stringShowComponents}
                          onChange={(e) => setStringShowComponents(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        />
                        <span>Mostrar componentes individuais (pontilhados y₁ e y₂)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={stringShowParticles}
                          onChange={(e) => setStringShowParticles(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        />
                        <span>Mostrar pontos da corda (oscilação transversal vertical)</span>
                      </label>
                    </div>

                    {/* Didactic Box */}
                    <div className="p-4 bg-indigo-50 rounded-lg text-xs text-indigo-900 space-y-1.5 border border-indigo-100">
                      <p><strong>Princípio da Superposição:</strong></p>
                      <p className="font-mono bg-white p-1.5 rounded border border-indigo-200 text-center font-bold">
                        y_resultante(x, t) = y₁(x, t) + y₂(x, t)
                      </p>
                      <p className="leading-relaxed">
                        • <strong>Invariância Pós-Cruzamento:</strong> Após a superposição, cada pulso prossegue sua trajetória exatamente com a mesma amplitude, largura e sentido que tinha antes do encontro.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setInterfActive1(!interfActive1)}
                        className={cn(
                          "py-3 rounded-xl font-bold text-xs transition-all shadow-sm border",
                          interfActive1 
                            ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                        )}
                      >
                        {interfActive1 ? "Desligar Fonte 1" : "Ligar Fonte 1"}
                      </button>
                      <button 
                        onClick={() => setInterfActive2(!interfActive2)}
                        className={cn(
                          "py-3 rounded-xl font-bold text-xs transition-all shadow-sm border",
                          interfActive2 
                            ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                        )}
                      >
                        {interfActive2 ? "Desligar Fonte 2" : "Ligar Fonte 2"}
                      </button>
                    </div>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Distância entre Fontes: {interfDistance}px</span>
                      <input 
                        type="range" min="20" max="200" value={interfDistance} 
                        onChange={(e) => setInterfDistance(parseInt(e.target.value))}
                        className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                      />
                    </label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setInterfPhase('in')}
                        className={cn("flex-1 py-2 text-xs rounded-lg font-bold border", interfPhase === 'in' ? "bg-indigo-600 text-white" : "bg-white text-gray-600")}
                      >
                        Em Fase
                      </button>
                      <button 
                        onClick={() => setInterfPhase('out')}
                        className={cn("flex-1 py-2 text-xs rounded-lg font-bold border", interfPhase === 'out' ? "bg-indigo-600 text-white" : "bg-white text-gray-600")}
                      >
                        Oposição
                      </button>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
                      <p><strong>Interferência 2D:</strong> Superposição de ondas circulares na superfície gerando linhas nodais (destrutivas) e ventrais (construtivas).</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tanque' && (
              <div className="space-y-4">
                <button 
                  onClick={() => setWaveTrigger(prev => prev + 1)}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">Gerar Onda</span>
                </button>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Profundidade Região 1 (h1): {h1}px</span>
                  <input 
                    type="range" min="10" max="100" value={h1} 
                    onChange={(e) => setH1(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Profundidade Região 2 (h2): {h2}px</span>
                  <input 
                    type="range" min="10" max="100" value={h2} 
                    onChange={(e) => setH2(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </label>

                <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800 space-y-2 border border-blue-100">
                  <p><strong>Física do Meio:</strong> Em águas pouco profundas, a velocidade da onda ($v$) é proporcional à raiz quadrada da profundidade ($h$):</p>
                  <p className="font-mono text-center bg-white py-1 rounded border border-blue-200">v = √g·h</p>
                  <p className="text-xs italic opacity-75">Nota: Observe que a onda muda de velocidade ao cruzar a fronteira entre as regiões.</p>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>© 2026 Ondas Interativas - Ferramenta Educacional</p>
        </footer>
      </div>
    </div>
  );
}

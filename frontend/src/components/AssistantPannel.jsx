import React, { useState, useEffect } from 'react';

const AssistantPanel = () => {
  const [isActive, setIsActive] = useState(false);
  const [rings, setRings] = useState([
    { scale: 1, opacity: 0.6 },
    { scale: 1.3, opacity: 0.4 },
    { scale: 1.6, opacity: 0.2 }
  ]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setRings(prev => 
          prev.map((ring, i) => ({
            scale: 1 + (Math.random() * 0.8 + 0.5) * (i + 1) * 0.3,
            opacity: Math.random() * 0.4 + 0.2
          }))
        );
      }, 150);
      return () => clearInterval(interval);
    } else {
      setRings([
        { scale: 1, opacity: 0.6 },
        { scale: 1.3, opacity: 0.4 },
        { scale: 1.6, opacity: 0.2 }
      ]);
    }
  }, [isActive]);

  return (
    <div className="flex items-center justify-center min-h-40 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/30 rounded-lg p-5 transition-all duration-500 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 animate-fadeIn'">
      <div className="relative w-80">
        {/* Main Panel */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Animated Border Gradient */}
          <div className="absolute inset-0 p-[1.5px] rounded-2xl">
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
                animation: 'spin 4s linear infinite'
              }}
            />
          </div>

          {/* Inner Content */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 m-[1.5px]">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
            
            {/* Content Container */}
            <div className="relative flex flex-col items-center justify-center space-y-6">
              {/* Circular Aura Animation */}
              <div 
                className="relative w-24 h-24 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setIsActive(!isActive)}
              >
                {/* Animated Rings */}
                {rings.map((ring, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full transition-all duration-150 ease-out"
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle, transparent 60%, rgba(6, 182, 212, 0.3) 60%, rgba(139, 92, 246, 0.3) 80%, rgba(236, 72, 153, 0.3) 100%)',
                      transform: `scale(${isActive ? ring.scale : 1 + i * 0.3})`,
                      opacity: isActive ? ring.opacity : 0.3 - i * 0.1,
                      filter: 'blur(8px)'
                    }}
                  />
                ))}

                {/* Center Orb */}
                <div 
                  className="relative z-10 w-16 h-16 rounded-full transition-all duration-300"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #06b6d4, #8b5cf6, #ec4899)',
                    boxShadow: isActive 
                      ? '0 0 40px rgba(6, 182, 212, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)' 
                      : '0 0 20px rgba(6, 182, 212, 0.4)',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                </div>

                {/* Outer pulse ring */}
                {isActive && (
                  <div 
                    className="absolute w-full h-full rounded-full border-2 animate-ping"
                    style={{
                      borderColor: 'rgba(6, 182, 212, 0.3)',
                      animationDuration: '2s'
                    }}
                  />
                )}
              </div>

              {/* Status Text */}
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {isActive ? 'Listening...' : 'Voice Assistant'}
                </h3>
                <p className="text-slate-400 text-xs">
                  {isActive ? 'Speak now' : 'Click to activate'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AssistantPanel;
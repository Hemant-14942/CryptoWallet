"use client";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

// Enhanced coin configuration with more coins for better density on larger screens
const coins = [
  { src: "/btc.png", className: "top-[8%] left-[3%] md:top-[10%] md:left-[5%]", name: "Bitcoin" },
  { src: "/etherium.png", className: "top-[15%] right-[5%] md:top-[20%] md:right-[10%]", name: "Ethereum" },
  { src: "/litecoin.png", className: "top-[45%] left-[8%] md:top-[50%] md:left-[15%]", name: "Litecoin" },
  { src: "/ripple.png", className: "top-[60%] right-[12%] md:top-[65%] md:right-[20%]", name: "Ripple" },
  { src: "/solana.png", className: "bottom-[20%] left-[5%] md:bottom-[15%] md:left-[8%]", name: "Solana" },
  { src: "/solana1.png", className: "bottom-[30%] right-[8%] md:bottom-[25%] md:right-[12%]", name: "Solana" },
  // Additional coins for richer animation
  { src: "/btc.png", className: "top-[35%] left-[2%] md:top-[40%] md:left-[3%]", name: "Bitcoin", scale: 0.7 },
  { src: "/etherium.png", className: "bottom-[45%] right-[3%] md:bottom-[40%] md:right-[5%]", name: "Ethereum", scale: 0.8 },
  // More coins for desktop screens
  { src: "/litecoin.png", className: "hidden md:block top-[25%] left-[25%]", name: "Litecoin", scale: 0.6 },
  { src: "/ripple.png", className: "hidden md:block top-[75%] right-[35%]", name: "Ripple", scale: 0.65 },
  { src: "/btc.png", className: "hidden md:block bottom-[50%] left-[30%]", name: "Bitcoin", scale: 0.55 },
  { src: "/solana.png", className: "hidden md:block top-[30%] right-[30%]", name: "Solana", scale: 0.7 },
  { src: "/etherium.png", className: "hidden md:block bottom-[60%] right-[40%]", name: "Ethereum", scale: 0.6 },
  { src: "/solana1.png", className: "hidden md:block top-[55%] left-[35%]", name: "Solana", scale: 0.65 },
  { src: "/litecoin.png", className: "hidden lg:block top-[12%] right-[25%]", name: "Litecoin", scale: 0.5 },
  { src: "/ripple.png", className: "hidden lg:block bottom-[35%] left-[20%]", name: "Ripple", scale: 0.55 },
  { src: "/btc.png", className: "hidden lg:block top-[70%] left-[40%]", name: "Bitcoin", scale: 0.6 },
  { src: "/etherium.png", className: "hidden lg:block bottom-[20%] right-[25%]", name: "Ethereum", scale: 0.5 },
];

// Enhanced particle background with better performance
function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -80 - Math.random() * 40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function FloatingCoin({ coin, delay = 0 }) {
  const isMobile = window.innerWidth < 768;
  const baseSize = coin.scale ? (isMobile ? 40 * coin.scale : 70 * coin.scale) : (isMobile ? 50 : 70);
  
  // Enhanced movement patterns with more natural floating
  const createAdvancedMovement = () => {
    const amplitude = isMobile ? 15 : 25;
    return {
      x: [
        0, 
        amplitude * (0.8 + Math.random() * 0.4), 
        -amplitude * (0.6 + Math.random() * 0.4), 
        amplitude * (0.3 + Math.random() * 0.4), 
        0
      ],
      y: [
        0, 
        -amplitude * (1.2 + Math.random() * 0.5), 
        amplitude * (0.8 + Math.random() * 0.4), 
        -amplitude * (0.5 + Math.random() * 0.3), 
        0
      ],
      rotate: [
        0, 
        10 + Math.random() * 15, 
        -(8 + Math.random() * 12), 
        6 + Math.random() * 8, 
        0
      ],
      scale: [
        1, 
        1.05 + Math.random() * 0.15, 
        0.95 + Math.random() * 0.1, 
        1.02 + Math.random() * 0.08, 
        1
      ],
    };
  };

  const movement = createAdvancedMovement();

  return (
    <motion.div
      className={`absolute ${coin.className} filter drop-shadow-lg cursor-pointer z-10`}
      initial={{
        x: "calc(50vw - 25px)",
        y: "calc(50vh - 25px)",
        opacity: 0,
        scale: 0,
        rotate: -360,
      }}
      animate={{
        x: 0,
        y: 0,
        opacity: 0.85,
        scale: 1,
        rotate: 0,
      }}
      transition={{
        duration: 1.5 + Math.random() * 1.2,
        delay: delay,
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
        damping: 12,
      }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          ...movement,
        }}
        transition={{
          x: {
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: delay + 2,
            ease: "easeInOut",
            repeatType: "reverse",
          },
          y: {
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            delay: delay + 1.5,
            ease: "easeInOut",
            repeatType: "reverse",
          },
          rotate: {
            duration: 12 + Math.random() * 6,
            repeat: Infinity,
            delay: delay + 1,
            ease: "easeInOut",
            repeatType: "reverse",
          },
          scale: {
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: delay + 0.5,
            ease: "easeInOut",
            repeatType: "reverse",
          },
        }}
        whileHover={{
          scale: 1.3,
          rotate: 180,
          transition: { duration: 0.4, ease: "easeOut" },
        }}
        whileTap={{
          scale: 0.9,
          rotate: -90,
          transition: { duration: 0.2 },
        }}
      >
        {/* Enhanced coin with better mobile sizing */}
        <motion.img
          src={coin.src}
          alt={coin.name}
          className="object-contain relative z-10 rounded-full"
          style={{
            width: `${baseSize}px`,
            height: `${baseSize}px`,
            filter: "drop-shadow(0 4px 12px rgba(255,215,0,0.3))"
          }}
          animate={{
            filter: [
              "drop-shadow(0 4px 12px rgba(255,215,0,0.3))",
              "drop-shadow(0 6px 16px rgba(255,215,0,0.5))",
              "drop-shadow(0 4px 12px rgba(255,215,0,0.3))"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pulsing border effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-yellow-400/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
            borderColor: [
              "rgba(255,215,0,0.3)",
              "rgba(255,215,0,0.6)",
              "rgba(255,215,0,0.3)"
            ]
          }}
          transition={{
            duration: 2.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: delay + 0.5,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Subtle glowing effect - much more minimal */}
      <motion.div
        className="absolute inset-0 rounded-full blur-sm opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3 + Math.random() * 1,
          repeat: Infinity,
          delay: delay + 1,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

// Mobile-optimized animated grid
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 opacity-5">
      <motion.div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: window.innerWidth < 768 ? '30px 30px' : '50px 50px'
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

export default function Home() {
  const { wallet } = useWallet();
  const navigate = useNavigate();

  const handleStartClick = () => {
    if (wallet) {
      navigate("/walletdashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-center overflow-hidden">
      {/* Enhanced background elements */}
      <AnimatedGrid />
      <ParticleBackground />
      
      {/* Enhanced floating coins with better staggered animation */}
      {coins.map((coin, i) => (
        <FloatingCoin
          key={`${coin.src}-${i}`}
          coin={coin}
          delay={i * 0.15 + Math.random() * 0.4}
        />
      ))}

      {/* Main content with mobile-optimized animations */}
      <motion.div
        className="relative z-20 px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Mobile-responsive headline */}
        <motion.h1 
          className="text-4xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 relative"
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.8,
            ease: "easeOut"
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 20px rgba(255,215,0,0.5)",
                "0 0 40px rgba(255,215,0,0.8)",
                "0 0 20px rgba(255,215,0,0.5)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            VaultX
          </motion.span>
          
          {/* Animated underline */}
          <motion.div
            className="absolute -bottom-2 md:-bottom-4 left-1/2 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
            initial={{ width: 0, x: "-50%" }}
            animate={{ width: "100%", x: "-50%" }}
            transition={{ duration: 1, delay: 2 }}
          />
        </motion.h1>

        <motion.p 
          className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl max-w-2xl text-gray-300 leading-relaxed mx-auto px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Experience the future of cryptocurrency management with 
          <motion.span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 font-semibold"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {" "}enterprise-grade security{" "}
          </motion.span>
          and intuitive design.
        </motion.p>

        <motion.div
          className="mt-12 md:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.button
            onClick={handleStartClick}
            className="group relative px-8 md:px-12 py-3 md:py-4 rounded-full text-lg md:text-xl font-bold overflow-hidden
                     bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 
                     text-black shadow-2xl shadow-yellow-500/30
                     transform-gpu transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(255,215,0,0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 10px 30px rgba(255,215,0,0.3)",
                "0 15px 40px rgba(255,215,0,0.5)",
                "0 10px 30px rgba(255,215,0,0.3)"
              ]
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Animated background shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              initial={{ x: "-200%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 2,
                repeatDelay: 3
              }}
            />
            
            <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">
              Get Started
            </span>
            
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-400/20 scale-0 group-hover:scale-110"
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Mobile-optimized ambient effects - much more subtle */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 rounded-full bg-gradient-to-r from-yellow-400/5 to-amber-300/5 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 20, 0],
          y: [0, -15, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 md:w-48 h-24 md:h-48 rounded-full bg-gradient-to-l from-amber-400/5 to-yellow-300/5 blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -20, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
}
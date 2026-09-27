import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export const BurgerIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Plate/Shadow */}
    <ellipse cx="50" cy="85" rx="38" ry="7" fill="#E2E8F0" />
    {/* Bottom Bun */}
    <rect x="22" y="70" width="56" height="12" rx="6" fill="#D97706" />
    <rect x="22" y="70" width="56" height="8" rx="4" fill="#F59E0B" />
    {/* Sauce & Greens */}
    <path d="M18 68 C 24 64, 30 72, 36 67 C 42 63, 48 71, 54 67 C 60 63, 66 71, 72 67 C 78 64, 82 69, 82 69" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
    {/* Patty */}
    <rect x="18" y="58" width="64" height="10" rx="5" fill="#78350F" />
    <circle cx="28" cy="63" r="1.5" fill="#92400E" />
    <circle cx="48" cy="63" r="1.5" fill="#92400E" />
    <circle cx="68" cy="63" r="1.5" fill="#92400E" />
    {/* Melted Cheese Slice */}
    <path d="M22 58 L78 58 L72 65 L60 62 L48 66 L38 62 L26 66 Z" fill="#FBBF24" />
    {/* Tomato Slices */}
    <rect x="24" y="50" width="24" height="7" rx="3.5" fill="#DC2626" />
    <rect x="52" y="50" width="24" height="7" rx="3.5" fill="#DC2626" />
    {/* Lettuce */}
    <path d="M16 52 C 22 47, 30 54, 38 49 C 46 45, 54 53, 62 48 C 70 45, 78 52, 84 50" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" />
    {/* Top Bun */}
    <path d="M20 48 C 20 28, 32 18, 50 18 C 68 18, 80 28, 80 48 Z" fill="#F59E0B" />
    {/* Sesame Seeds */}
    <ellipse cx="36" cy="30" rx="2" ry="1.2" transform="rotate(-15 36 30)" fill="#FEF3C7" />
    <ellipse cx="48" cy="26" rx="2" ry="1.2" fill="#FEF3C7" />
    <ellipse cx="62" cy="32" rx="2" ry="1.2" transform="rotate(20 62 32)" fill="#FEF3C7" />
    <ellipse cx="42" cy="38" rx="2" ry="1.2" transform="rotate(10 42 38)" fill="#FEF3C7" />
    <ellipse cx="56" cy="38" rx="2" ry="1.2" transform="rotate(-10 56 38)" fill="#FEF3C7" />
  </svg>
);

export const FriesIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="88" rx="34" ry="6" fill="#E2E8F0" />
    {/* Fries Sticks */}
    <rect x="30" y="22" width="6" height="42" rx="3" transform="rotate(-12 30 22)" fill="#F59E0B" />
    <rect x="42" y="16" width="6" height="46" rx="3" transform="rotate(-3 42 16)" fill="#FBBF24" />
    <rect x="52" y="15" width="6" height="48" rx="3" transform="rotate(5 52 15)" fill="#F59E0B" />
    <rect x="62" y="20" width="6" height="44" rx="3" transform="rotate(14 62 20)" fill="#FBBF24" />
    <rect x="36" y="24" width="5.5" height="38" rx="2.5" transform="rotate(-6 36 24)" fill="#FCD34D" />
    <rect x="58" y="22" width="5.5" height="40" rx="2.5" transform="rotate(8 58 22)" fill="#FCD34D" />
    <rect x="46" y="20" width="6" height="42" rx="3" fill="#F59E0B" />
    {/* Red/Orange Paper Pocket */}
    <path d="M26 48 L32 84 L68 84 L74 48 C 65 52, 55 45, 50 48 C 45 45, 35 52, 26 48 Z" fill="#EA580C" />
    <path d="M28 49 L33 82 L67 82 L72 49 C 64 53, 55 46, 50 49 C 45 46, 36 53, 28 49 Z" fill="#F97316" />
    {/* SYS Cafe Mini Emblem on box */}
    <circle cx="50" cy="66" r="8" fill="#FFFFFF" />
    <text x="50" y="69" fontSize="6" fontWeight="bold" fill="#EA580C" textAnchor="middle" fontFamily="sans-serif">SYS</text>
  </svg>
);

export const MomosIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="85" rx="38" ry="7" fill="#E2E8F0" />
    {/* Bamboo Steamer base */}
    <ellipse cx="50" cy="74" rx="38" ry="14" fill="#B45309" />
    <ellipse cx="50" cy="72" rx="36" ry="12" fill="#D97706" />
    <ellipse cx="50" cy="70" rx="34" ry="11" fill="#FDE68A" />
    {/* Momo 1 (Left) */}
    <path d="M24 64 C 20 54, 30 44, 36 48 C 40 50, 42 58, 38 66 C 34 68, 28 68, 24 64 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
    <path d="M30 48 Q 33 55 35 62" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M34 49 Q 36 56 37 62" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    {/* Momo 2 (Center Back) */}
    <path d="M42 54 C 40 44, 50 38, 56 42 C 62 44, 63 54, 58 60 C 52 62, 46 60, 42 54 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
    <path d="M48 41 Q 50 49 51 56" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    {/* Momo 3 (Right) */}
    <path d="M58 64 C 54 56, 62 46, 70 48 C 76 50, 78 60, 72 67 C 68 69, 62 68, 58 64 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
    <path d="M64 48 Q 66 56 67 63" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    {/* Red Chutney Bowl */}
    <ellipse cx="50" cy="67" rx="9" ry="5.5" fill="#DC2626" />
    <ellipse cx="50" cy="66" rx="8" ry="4.5" fill="#EF4444" />
    <circle cx="48" cy="65" r="1" fill="#FEF08A" />
    {/* Steam curls */}
    <path d="M36 38 C 34 32, 38 28, 35 22" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M50 34 C 48 28, 52 24, 49 18" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M64 36 C 62 30, 66 26, 63 20" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
  </svg>
);

export const KhandoliIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="85" rx="38" ry="7" fill="#E2E8F0" />
    {/* Plate */}
    <ellipse cx="50" cy="70" rx="36" ry="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
    <ellipse cx="50" cy="69" rx="32" ry="11" fill="#F8FAFC" />
    {/* Crispy golden khandoli rolls / layered bites */}
    <rect x="25" y="54" width="22" height="12" rx="4" transform="rotate(-8 25 54)" fill="#D97706" />
    <rect x="26" y="53" width="20" height="10" rx="3" transform="rotate(-8 26 53)" fill="#F59E0B" />
    <rect x="42" y="50" width="22" height="12" rx="4" fill="#D97706" />
    <rect x="43" y="49" width="20" height="10" rx="3" fill="#FBBF24" />
    <rect x="58" y="55" width="22" height="12" rx="4" transform="rotate(10 58 55)" fill="#D97706" />
    <rect x="59" y="54" width="20" height="10" rx="3" transform="rotate(10 59 54)" fill="#F59E0B" />
    {/* Mayo / Cheese Drizzle */}
    <path d="M24 57 Q 35 62 48 55 Q 60 58 76 56" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M28 62 Q 42 54 54 62 Q 68 54 74 61" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Herbs/Masala Sprinkle */}
    <circle cx="34" cy="56" r="1" fill="#16A34A" />
    <circle cx="48" cy="52" r="1" fill="#DC2626" />
    <circle cx="56" cy="56" r="1" fill="#16A34A" />
    <circle cx="68" cy="58" r="1" fill="#DC2626" />
    <circle cx="42" cy="58" r="0.8" fill="#DC2626" />
  </svg>
);

export const NuggetsIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="85" rx="38" ry="7" fill="#E2E8F0" />
    <ellipse cx="50" cy="72" rx="36" ry="12" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="2" />
    {/* Crispy Golden Nuggets */}
    <rect x="22" y="52" width="18" height="14" rx="6" transform="rotate(-15 22 52)" fill="#B45309" />
    <rect x="23" y="51" width="16" height="13" rx="5" transform="rotate(-15 23 51)" fill="#D97706" />
    <rect x="38" y="48" width="19" height="15" rx="6" transform="rotate(6 38 48)" fill="#B45309" />
    <rect x="39" y="47" width="17" height="14" rx="5" transform="rotate(6 39 47)" fill="#F59E0B" />
    <rect x="58" y="50" width="19" height="14" rx="6" transform="rotate(-8 58 50)" fill="#B45309" />
    <rect x="59" y="49" width="17" height="13" rx="5" transform="rotate(-8 59 49)" fill="#D97706" />
    {/* Mini dip bowl */}
    <ellipse cx="50" cy="68" rx="8" ry="4" fill="#DC2626" />
    <circle cx="50" cy="67" r="1" fill="#FEF08A" />
    {/* Crispy texture specks */}
    <circle cx="28" cy="55" r="0.8" fill="#FDE68A" />
    <circle cx="45" cy="52" r="0.8" fill="#FEF3C7" />
    <circle cx="65" cy="54" r="0.8" fill="#FDE68A" />
  </svg>
);

export const MaggieIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="86" rx="36" ry="6" fill="#E2E8F0" />
    {/* Bowl base */}
    <path d="M22 48 C 22 76, 32 82, 50 82 C 68 82, 78 76, 78 48 Z" fill="#EA580C" />
    <path d="M24 49 C 24 74, 33 80, 50 80 C 67 80, 76 74, 76 49 Z" fill="#F97316" />
    <ellipse cx="50" cy="48" rx="28" ry="9" fill="#FDE047" stroke="#EA580C" strokeWidth="2" />
    {/* Curled Maggie Noodles */}
    <path d="M30 46 Q 36 38 42 45 Q 48 52 54 44 Q 60 36 68 46" stroke="#CA8A04" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M28 50 Q 38 42 46 51 Q 54 58 64 48 Q 70 42 72 50" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M34 44 Q 44 36 50 44 Q 58 50 64 42" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Veggies in Maggie (Peas & Carrots) */}
    <circle cx="36" cy="48" r="2.5" fill="#16A34A" />
    <circle cx="62" cy="46" r="2.5" fill="#16A34A" />
    <rect x="46" y="44" width="4" height="4" rx="1" fill="#EA580C" />
    <rect x="54" y="49" width="4" height="3" rx="1" fill="#EA580C" />
    {/* Fork with lifting noodles */}
    <path d="M68 20 L58 42" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    <path d="M56 39 Q 58 35 60 41" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
    {/* Steam */}
    <path d="M38 34 C 36 26, 42 22, 38 16" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M50 30 C 48 22, 54 18, 50 12" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const PastaIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="85" rx="38" ry="7" fill="#E2E8F0" />
    {/* Wide shallow pasta bowl */}
    <ellipse cx="50" cy="68" rx="38" ry="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
    <ellipse cx="50" cy="67" rx="26" ry="9" fill="#DC2626" />
    {/* Penne tubes */}
    <rect x="36" y="58" width="12" height="6" rx="2" transform="rotate(-18 36 58)" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
    <rect x="48" y="56" width="14" height="6" rx="2" transform="rotate(12 48 56)" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
    <rect x="40" y="64" width="13" height="6" rx="2" transform="rotate(8 40 64)" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
    <rect x="56" y="62" width="12" height="6" rx="2" transform="rotate(-15 56 62)" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
    {/* Alfredo/Red sauce drip & Basil leaves */}
    <path d="M48 50 C 45 46, 52 44, 54 48 C 56 52, 51 54, 48 50 Z" fill="#16A34A" />
    <path d="M53 50 C 56 46, 62 48, 59 52 Z" fill="#22C55E" />
    <circle cx="44" cy="62" r="1.5" fill="#FFFFFF" />
    <circle cx="58" cy="60" r="1.2" fill="#FFFFFF" />
  </svg>
);

export const MocktailIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="88" rx="28" ry="5" fill="#E2E8F0" />
    {/* Glass */}
    <path d="M34 24 L38 80 C 38 84, 62 84, 62 80 L66 24 Z" fill="#E0F2FE" opacity="0.6" stroke="#38BDF8" strokeWidth="2" />
    {/* Colorful Liquid Layer */}
    <path d="M36 40 L38 80 C 38 82, 62 82, 62 80 L64 40 Z" fill="#0284C7" />
    <path d="M35 34 L36 44 L64 44 L65 34 Z" fill="#38BDF8" />
    {/* Ice Cubes */}
    <rect x="42" y="44" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.7" stroke="#BAE6FD" />
    <rect x="46" y="58" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.7" stroke="#BAE6FD" />
    {/* Lemon Slice on Rim */}
    <circle cx="34" cy="24" r="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    <circle cx="34" cy="24" r="8" fill="#FEF08A" />
    <path d="M34 16 L34 32 M26 24 L42 24" stroke="#F59E0B" strokeWidth="1" />
    {/* Mint Leaf */}
    <path d="M60 20 C 64 12, 74 16, 70 24 C 66 24, 62 22, 60 20 Z" fill="#22C55E" />
    {/* Straw */}
    <path d="M54 80 L54 12 L44 8" stroke="#F97316" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Bubbles */}
    <circle cx="42" cy="72" r="1.5" fill="#FFFFFF" opacity="0.8" />
    <circle cx="56" cy="68" r="1.2" fill="#FFFFFF" opacity="0.8" />
    <circle cx="48" cy="52" r="1.5" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

export const CoffeeIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="48" cy="86" rx="34" ry="6" fill="#E2E8F0" />
    {/* Saucer */}
    <ellipse cx="48" cy="78" rx="32" ry="7" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
    <ellipse cx="48" cy="77" rx="26" ry="5" fill="#E2E8F0" />
    {/* Cup Handle */}
    <path d="M64 42 C 76 42, 78 64, 64 66" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Ceramic Cup */}
    <path d="M28 36 L32 72 C 32 76, 64 76, 64 72 L68 36 Z" fill="#F97316" />
    <path d="M29 37 L33 70 C 33 74, 63 74, 63 70 L67 37 Z" fill="#FB923C" />
    <ellipse cx="48" cy="36" rx="20" ry="7" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
    {/* Dark Coffee Crema */}
    <ellipse cx="48" cy="36" rx="18" ry="5.5" fill="#78350F" />
    {/* Latte Art Heart */}
    <path d="M48 37 C 46 34, 42 34, 42 37 C 42 39, 48 42, 48 42 C 48 42, 54 39, 54 37 C 54 34, 50 34, 48 37 Z" fill="#FEF3C7" />
    {/* Warm Steam Lines */}
    <path d="M40 26 C 38 20, 44 16, 40 10" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M52 24 C 50 18, 56 14, 52 8" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const MilkshakeIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="88" rx="26" ry="5" fill="#E2E8F0" />
    {/* Mason Jar Glass */}
    <rect x="32" y="36" width="36" height="48" rx="8" fill="#F1F5F9" opacity="0.6" stroke="#94A3B8" strokeWidth="2" />
    {/* Jar Handle */}
    <path d="M68 44 C 78 44, 78 68, 68 68" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Shake Liquid (Rich chocolate/oreo/berry) */}
    <rect x="34" y="44" width="32" height="38" rx="6" fill="#78350F" />
    {/* Whipped Cream Top */}
    <path d="M34 38 C 30 32, 42 22, 50 24 C 58 20, 70 30, 66 38 Z" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.5" />
    <circle cx="50" cy="22" r="5" fill="#DC2626" />
    {/* Wafer / Straw Stick */}
    <rect x="56" y="8" width="5" height="36" rx="2" transform="rotate(18 56 8)" fill="#D97706" />
    <path d="M42 38 L42 10 L48 6" stroke="#F97316" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Choco drips on glass */}
    <path d="M40 44 L40 52 M52 44 L52 56 M60 44 L60 50" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const PizzaIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="86" rx="38" ry="6" fill="#E2E8F0" />
    {/* Pizza Crust Edge */}
    <path d="M22 28 C 42 14, 66 16, 82 32 L50 82 Z" fill="#D97706" />
    {/* Sauce & Cheese Base */}
    <path d="M26 32 C 43 20, 64 22, 78 35 L50 77 Z" fill="#FBBF24" stroke="#DC2626" strokeWidth="2" />
    {/* Melted Cheese drip */}
    <path d="M48 77 L50 84 L52 77" fill="#FBBF24" />
    {/* Pepperoni / Tomato slices */}
    <circle cx="48" cy="38" r="5.5" fill="#DC2626" />
    <circle cx="36" cy="46" r="4.5" fill="#DC2626" />
    <circle cx="62" cy="44" r="5" fill="#DC2626" />
    <circle cx="50" cy="58" r="4.5" fill="#DC2626" />
    {/* Capsicum / Green olives */}
    <path d="M40 32 C 43 30, 45 35, 42 37" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M58 52 C 61 50, 63 55, 60 57" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="46" cy="48" r="1.5" fill="#1F2937" />
    <circle cx="56" cy="36" r="1.5" fill="#1F2937" />
    {/* Herbs */}
    <circle cx="42" cy="54" r="0.8" fill="#15803D" />
    <circle cx="52" cy="46" r="0.8" fill="#15803D" />
    <circle cx="62" cy="58" r="0.8" fill="#15803D" />
  </svg>
);

export const SandwichIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="85" rx="38" ry="6" fill="#E2E8F0" />
    {/* Bottom Bread Triangle */}
    <path d="M20 74 L80 74 L50 36 Z" fill="#D97706" />
    <path d="M22 72 L78 72 L50 38 Z" fill="#FDE68A" />
    {/* Fillings: Cucumber, Tomato, Cheese */}
    <rect x="26" y="66" width="48" height="5" rx="2" fill="#22C55E" />
    <rect x="28" y="61" width="44" height="5" rx="2" fill="#DC2626" />
    <rect x="30" y="56" width="40" height="5" rx="2" fill="#FBBF24" />
    {/* Top Grilled Bread */}
    <path d="M30 56 L70 56 L50 30 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
    {/* Grill Marks */}
    <line x1="38" y1="52" x2="48" y2="40" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="46" y1="54" x2="56" y2="42" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="54" y1="53" x2="62" y2="45" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const TeaIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="86" rx="34" ry="6" fill="#E2E8F0" />
    {/* Indian Clay Kulhad / Tea Glass */}
    <path d="M34 34 L38 80 C 38 82, 62 82, 62 80 L66 34 Z" fill="#B45309" />
    <path d="M35 35 L39 78 C 39 80, 61 80, 61 78 L65 35 Z" fill="#D97706" />
    <ellipse cx="50" cy="34" rx="16" ry="5" fill="#78350F" stroke="#B45309" strokeWidth="2" />
    <ellipse cx="50" cy="34" rx="14" ry="4" fill="#D97706" />
    {/* Cutting Tea Glass Ribs */}
    <line x1="44" y1="42" x2="45" y2="72" stroke="#B45309" strokeWidth="1.5" />
    <line x1="50" y1="42" x2="50" y2="72" stroke="#B45309" strokeWidth="1.5" />
    <line x1="56" y1="42" x2="55" y2="72" stroke="#B45309" strokeWidth="1.5" />
    {/* Steam */}
    <path d="M44 26 C 42 20, 48 16, 44 10" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M54 24 C 52 18, 58 14, 54 8" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const ColdDrinkIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="88" rx="24" ry="5" fill="#E2E8F0" />
    {/* Can Body */}
    <rect x="36" y="26" width="28" height="56" rx="6" fill="#DC2626" />
    <ellipse cx="50" cy="26" rx="14" ry="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
    <ellipse cx="50" cy="82" rx="14" ry="4" fill="#991B1B" />
    {/* Pull Tab */}
    <ellipse cx="50" cy="26" rx="4" ry="2" fill="#94A3B8" />
    {/* Can Graphic */}
    <path d="M36 44 Q 50 56 64 44" stroke="#FFFFFF" strokeWidth="3" fill="none" />
    <path d="M36 52 Q 50 64 64 52" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
    <circle cx="50" cy="42" r="1.5" fill="#FEF08A" />
  </svg>
);

export const MineralWaterIllustration: React.FC<IllustrationProps> = ({ className = "w-full h-full", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="50" cy="88" rx="22" ry="5" fill="#E2E8F0" />
    {/* Bottle Cap */}
    <rect x="44" y="16" width="12" height="6" rx="2" fill="#0284C7" />
    {/* Bottle Neck & Body */}
    <path d="M46 22 L46 30 L38 38 L38 82 C 38 85, 62 85, 62 82 L62 38 L54 30 L54 22 Z" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    {/* Label */}
    <rect x="38" y="50" width="24" height="18" fill="#0284C7" />
    <path d="M40 58 Q 50 52 60 58" stroke="#FFFFFF" strokeWidth="2" fill="none" />
  </svg>
);

export type FoodIllustrationType =
  | 'burger'
  | 'fries'
  | 'momos'
  | 'khandoli'
  | 'nuggets'
  | 'maggie'
  | 'pasta'
  | 'mocktail'
  | 'coffee'
  | 'tea'
  | 'colddrink'
  | 'water'
  | 'milkshake'
  | 'pizza'
  | 'sandwich';

// Helper to render illustration by key or type
export const FoodIllustration: React.FC<{
  name?: string;
  type?: string;
  className?: string;
  size?: number;
}> = ({ name, type, className, size }) => {
  const key = (type || name || 'burger').toLowerCase();
  switch (key) {
    case 'burger':
      return <BurgerIllustration className={className} size={size} />;
    case 'fries':
      return <FriesIllustration className={className} size={size} />;
    case 'momos':
      return <MomosIllustration className={className} size={size} />;
    case 'khandoli':
      return <KhandoliIllustration className={className} size={size} />;
    case 'nuggets':
      return <NuggetsIllustration className={className} size={size} />;
    case 'maggie':
      return <MaggieIllustration className={className} size={size} />;
    case 'pasta':
      return <PastaIllustration className={className} size={size} />;
    case 'mocktails':
    case 'mocktail':
      return <MocktailIllustration className={className} size={size} />;
    case 'hot beverages':
    case 'coffee':
      return <CoffeeIllustration className={className} size={size} />;
    case 'tea':
      return <TeaIllustration className={className} size={size} />;
    case 'cold beverages':
    case 'colddrink':
      return <ColdDrinkIllustration className={className} size={size} />;
    case 'water':
      return <MineralWaterIllustration className={className} size={size} />;
    case 'milk shakes':
    case 'milkshake':
      return <MilkshakeIllustration className={className} size={size} />;
    case 'pizza':
      return <PizzaIllustration className={className} size={size} />;
    case 'sandwich':
      return <SandwichIllustration className={className} size={size} />;
    default:
      return <BurgerIllustration className={className} size={size} />;
  }
};

// Clean Empty State Illustrations
export const EmptyCartIllustration: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className}>
    <ellipse cx="60" cy="104" rx="44" ry="8" fill="#F1F5F9" />
    {/* Empty tray/plate */}
    <ellipse cx="60" cy="74" rx="40" ry="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
    <ellipse cx="60" cy="73" rx="32" ry="11" fill="#F8FAFC" />
    {/* Cloche dome lifted slightly */}
    <path d="M34 56 C 34 36, 46 26, 60 26 C 74 26, 86 36, 86 56 Z" fill="#F97316" opacity="0.15" stroke="#EA580C" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="60" cy="22" r="4" fill="#EA580C" />
  </svg>
);

export const EmptyRecordsIllustration: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className}>
    <ellipse cx="60" cy="106" rx="42" ry="7" fill="#F1F5F9" />
    <rect x="36" y="28" width="48" height="64" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
    {/* Clip */}
    <rect x="48" y="22" width="24" height="10" rx="3" fill="#F97316" />
    <line x1="46" y1="46" x2="74" y2="46" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
    <line x1="46" y1="56" x2="70" y2="56" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
    <line x1="46" y1="66" x2="62" y2="66" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="78" r="3" fill="#FBBF24" />
  </svg>
);

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/recipes', label: '레시피', icon: '📖' },
  { href: '/categories', label: '카테고리', icon: '🏷️' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl">🧁</span>
            <span className="text-lg font-['Jua'] text-[#E67E22] group-hover:text-[#D35400] transition-colors">
              레시피 비율 계산기
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl font-["Jua"] text-sm transition-all duration-200',
                  pathname === item.href
                    ? 'bg-[#FFEEE8] text-[#E67E22]'
                    : 'text-[#666666] hover:bg-[#F5F6FA] hover:text-[#333333]'
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <Link
              href="/recipes/new"
              className="ml-2 flex items-center gap-2 px-5 py-2 bg-[#E8F5EE] text-[#27AE60] rounded-xl font-['Jua'] text-sm hover:bg-[#C5E8D4] transition-all duration-200"
            >
              <span className="text-base">✨</span>
              새 레시피
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl hover:bg-[#F5F6FA] transition-colors"
            aria-label="메뉴 열기"
          >
            <span className={cn(
              "w-5 h-0.5 bg-[#666666] rounded-full transition-all duration-200",
              isMenuOpen && "rotate-45 translate-y-2"
            )} />
            <span className={cn(
              "w-5 h-0.5 bg-[#666666] rounded-full transition-all duration-200",
              isMenuOpen && "opacity-0"
            )} />
            <span className={cn(
              "w-5 h-0.5 bg-[#666666] rounded-full transition-all duration-200",
              isMenuOpen && "-rotate-45 -translate-y-2"
            )} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-out",
          isMenuOpen ? "max-h-80 pb-4" : "max-h-0"
        )}>
          <div className="flex flex-col gap-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-["Jua"] transition-all duration-200',
                  pathname === item.href
                    ? 'bg-[#FFEEE8] text-[#E67E22]'
                    : 'text-[#666666] hover:bg-[#F5F6FA]'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <Link
              href="/recipes/new"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#E8F5EE] text-[#27AE60] rounded-xl font-['Jua']"
            >
              <span className="text-lg">✨</span>
              새 레시피 만들기
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

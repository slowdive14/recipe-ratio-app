'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import LoginModal from '@/components/auth/LoginModal';

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/recipes', label: '레시피', icon: '📖' },
  { href: '/categories', label: '카테고리', icon: '🏷️' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user, loading, initializeUser, signOut } = useUserStore();

  useEffect(() => {
    const unsubscribe = initializeUser();
    return () => unsubscribe();
  }, [initializeUser]);

  return (
    <>
      <nav className="bg-white sticky top-0 z-40 shadow-sm">
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

              {/* Auth Button (Desktop) */}
              {!loading && (
                user ? (
                  <div className="ml-2 relative group">
                    <button className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded-lg transition-colors">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'Unknown'} className="w-8 h-8 rounded-full border border-gray-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">👤</div>
                      )}
                    </button>
                    {/* User Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50 transform origin-top-right">
                      <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-50 mb-1">
                        {user.displayName || '사용자'} 님
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-['Jua']"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="ml-2 px-4 py-2 bg-[#F5F6FA] text-[#666666] rounded-xl font-['Jua'] text-sm hover:bg-[#E5E7EB] transition-all"
                  >
                    로그인
                  </button>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile User Avatar (User logged in) */}
              {!loading && user && (
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs">👤</div>
                  )}
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex flex-col gap-1.5 p-2 rounded-xl hover:bg-[#F5F6FA] transition-colors"
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
          </div>

          {/* Mobile Navigation */}
          <div className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            isMenuOpen ? "max-h-[500px] pb-4" : "max-h-0"
          )}>
            <div className="flex flex-col gap-2 pt-2">
              {/* Mobile Login/Logout Section inside menu */}
              {!loading && (
                <div className="mb-2 p-3 bg-gray-50 rounded-xl">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-['Jua'] text-gray-600">
                        {user.displayName || '사용자'} 님 안녕하세요!
                      </span>
                      <button
                        onClick={() => { signOut(); setIsMenuOpen(false); }}
                        className="text-xs text-red-500 font-bold px-2 py-1 bg-white rounded border border-red-100"
                      >
                        로그아웃
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }}
                      className="w-full py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-['Jua']"
                    >
                      로그인하기
                    </button>
                  )}
                </div>
              )}

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

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}

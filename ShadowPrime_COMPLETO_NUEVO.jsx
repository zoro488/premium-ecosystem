// ESTE ES EL ARCHIVO COMPLETO DE SHADOWPRIME CON TODAS LAS SECCIONES IMPLEMENTADAS
// Después de revisar, reemplazar el archivo original src/apps/ShadowPrime/ShadowPrime.jsx con este

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Wallet, Plus, Send, Download, Shield, TrendingUp, TrendingDown, BarChart3, Mail,
  Copy, Eye, EyeOff, Check, AlertCircle, ArrowUpRight, ArrowDownRight, Sparkles,
  RefreshCw, Settings, Lock, Menu, X, QrCode, ExternalLink, Zap, DollarSign,
  Bitcoin, Coins, CreditCard, Activity, Target, Flame, Crown, Star, CircuitBoard,
  Key, Fingerprint, Smartphone, Globe, Inbox, Trash2, Search, Filter, TrendingDown as ChartDown,
  Users, Building, Package
} from 'lucide-react';
import AIAssistant from '../../components/shared/AIAssistant';
import { storage, STORAGE_KEYS, useLocalStorage } from '../../utils/storage';

// Mock data de wallets (SIN CAMBIOS)
const initialWallets = [
  {
    id: 1,
    name: 'Main Wallet',
    type: 'TronLink',
    address: 'TJMTXqJr8R4Wp2qYk3NFj8x9Q2Lp5Km7dD',
    balance: 15234.56,
    balanceUSD: 23456.78,
    color: 'from-red-500 via-orange-500 to-yellow-500',
    icon: '🔴',
    change24h: 5.2,
    assets: [
      { symbol: 'TRX', name: 'Tron', amount: 15234.56, price: 0.08, change: 5.2, icon: '⭕', color: 'text-red-400' },
      { symbol: 'USDT', name: 'Tether', amount: 8000, price: 1.00, change: 0.1, icon: '💵', color: 'text-green-400' },
      { symbol: 'BTT', name: 'BitTorrent', amount: 450000, price: 0.00000123, change: -2.3, icon: '🎬', color: 'text-purple-400' },
      { symbol: 'SUN', name: 'Sun Token', amount: 12000, price: 0.005, change: 8.5, icon: '☀️', color: 'text-yellow-400' },
    ],
  },
  {
    id: 2,
    name: 'Trading Wallet',
    type: 'Trust Wallet',
    address: '0x742d35Cc6a3AfC2F593C2d9F8a7b31e8c9A2F1B3',
    balance: 8452.30,
    balanceUSD: 18234.50,
    color: 'from-blue-500 via-cyan-500 to-teal-500',
    icon: '🔵',
    change24h: 3.8,
    assets: [
      { symbol: 'BNB', name: 'Binance Coin', amount: 24.5, price: 320.45, change: 3.8, icon: '💎', color: 'text-yellow-400' },
      { symbol: 'BUSD', name: 'Binance USD', amount: 10000, price: 1.00, change: 0.0, icon: '💵', color: 'text-green-400' },
      { symbol: 'CAKE', name: 'PancakeSwap', amount: 1200, price: 2.34, change: 12.5, icon: '🥞', color: 'text-pink-400' },
    ],
  },
  {
    id: 3,
    name: 'Cold Storage',
    type: 'Exodus',
    address: 'bc1qxy2kgd93dh82k3mf8qla9s8r7tc5np2kq8fh4m',
    balance: 45678.90,
    balanceUSD: 67890.12,
    color: 'from-purple-500 via-pink-500 to-rose-500',
    icon: '🟣',
    change24h: 8.5,
    assets: [
      { symbol: 'BTC', name: 'Bitcoin', amount: 0.823, price: 52340.00, change: 8.5, icon: '₿', color: 'text-orange-400' },
      { symbol: 'ETH', name: 'Ethereum', amount: 5.234, price: 3200.00, change: 6.2, icon: '⟠', color: 'text-blue-400' },
      { symbol: 'LTC', name: 'Litecoin', amount: 45.6, price: 85.30, change: -1.2, icon: 'Ł', color: 'text-slate-400' },
    ],
  },
];

// Transacciones recientes (SIN CAMBIOS)
const recentTransactions = [
  { id: 1, type: 'send', amount: 1234.56, currency: 'TRX', to: 'TK2x...4kL9', timestamp: '2 min ago', status: 'completed', hash: '0xabc...def' },
  { id: 2, type: 'receive', amount: 5000, currency: 'USDT', from: 'TS8k...2mN4', timestamp: '15 min ago', status: 'completed', hash: '0x123...456' },
  { id: 3, type: 'send', amount: 0.05, currency: 'BTC', to: 'bc1q...8fh4m', timestamp: '1 hour ago', status: 'completed', hash: '0x789...abc' },
  { id: 4, type: 'receive', amount: 2.5, currency: 'ETH', from: '0x92f...1kL2', timestamp: '3 hours ago', status: 'completed', hash: '0xdef...123' },
  { id: 5, type: 'send', amount: 500, currency: 'CAKE', to: '0x45c...9mN3', timestamp: '5 hours ago', status: 'pending', hash: '0x456...789' },
];

// Cursor tracker component (SIN CAMBIOS)
const CursorGlow = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed w-96 h-96 pointer-events-none z-0 mix-blend-screen"
      style={{
        left: cursorXSpring,
        top: cursorYSpring,
        x: '-50%',
        y: '-50%',
      }}
    >
      <div className="w-full h-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-3xl rounded-full" />
    </motion.div>
  );
};

// Sidebar premium (SIN CAMBIOS - Ya está completo)
const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview', color: 'from-purple-500 to-violet-500', badge: null },
    { id: 'wallets', icon: Wallet, label: 'Mis Wallets', color: 'from-blue-500 to-cyan-500', badge: 3 },
    { id: 'create', icon: Plus, label: 'Crear Wallet', color: 'from-green-500 to-emerald-500', badge: null },
    { id: 'send', icon: Send, label: 'Enviar', color: 'from-cyan-500 to-teal-500', badge: null },
    { id: 'receive', icon: Download, label: 'Recibir', color: 'from-pink-500 to-rose-500', badge: null },
    { id: 'trading', icon: TrendingUp, label: 'Trading', color: 'from-yellow-500 to-orange-500', badge: 'HOT' },
    { id: 'emails', icon: Mail, label: 'Emails Proton', color: 'from-orange-500 to-red-500', badge: 5 },
    { id: 'security', icon: Shield, label: 'Seguridad', color: 'from-red-500 to-pink-500', badge: null },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 320 }}
      className="fixed left-0 top-0 h-screen backdrop-blur-2xl bg-gradient-to-br from-slate-950/95 via-purple-950/30 to-slate-950/95 border-r border-purple-500/20 z-50 flex flex-col overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative p-6 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-[2px]">
                  <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950"
                />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  ShadowPrime
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-yellow-400" />
                  Premium Crypto Hub
                </p>
              </div>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors relative group"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.button>
        </div>
      </div>

      {/* Menu */}
      <nav className="relative flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(item.id)}
              className="w-full relative group"
            >
              {/* Glow effect */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 blur-xl rounded-xl`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              <div
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                    ? `bg-gradient-to-r ${item.color} bg-opacity-20 border border-white/20 shadow-lg`
                    : 'hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                {/* Icon with gradient */}
                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full blur-md`}
                    />
                  )}
                </div>

                {!isCollapsed && (
                  <>
                    <span className={`font-medium flex-1 text-left ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`
                          px-2 py-0.5 rounded-full text-xs font-bold
                          ${typeof item.badge === 'number'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          }
                        `}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </>
                )}
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer Stats */}
      <div className="relative p-4 border-t border-purple-500/20">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">Balance Total</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                $109,581.40
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 font-medium">+12.5%</span>
                <span className="text-slate-500">24h</span>
              </div>
            </div>
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(45deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
                backgroundSize: '200% 200%',
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

// Wallet Card Premium (SIN CAMBIOS - Ya está completo)
const WalletCard = ({ wallet, onClick, delay = 0 }) => {
  const [showAddress, setShowAddress] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
    >
      {/* Animated gradient background */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        className={`absolute inset-0 bg-gradient-to-br ${wallet.color} opacity-20`}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-slate-950/60 border border-white/10 group-hover:border-white/20 transition-all" />

      {/* Scan line effect */}
      <motion.div
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl filter drop-shadow-lg`}
            >
              {wallet.icon}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{wallet.name}</h3>
              <p className="text-sm text-slate-400">{wallet.type}</p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-xl bg-gradient-to-br ${wallet.color}`}
          >
            <Wallet className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Address */}
        <div className="mb-4 backdrop-blur-sm bg-black/20 rounded-lg p-3 border border-white/10 group-hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <code className="text-xs text-slate-300 font-mono flex-1">
              {showAddress ? wallet.address : `${wallet.address.slice(0, 12)}...${wallet.address.slice(-8)}`}
            </code>
            <div className="flex gap-2 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddress(!showAddress);
                }}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                {showAddress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={copyAddress}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <p className="text-sm text-slate-400 mb-1">Balance USD</p>
          <div className="flex items-baseline gap-2">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: 'spring' }}
              className="text-4xl font-bold text-white"
            >
              ${wallet.balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                wallet.change24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {wallet.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-sm font-medium">{Math.abs(wallet.change24h)}%</span>
            </motion.div>
          </div>
        </div>

        {/* Assets preview */}
        <div className="grid grid-cols-2 gap-2">
          {wallet.assets.slice(0, 4).map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.4 + index * 0.05 }}
              className="backdrop-blur-sm bg-black/20 rounded-lg px-3 py-2 border border-white/10 hover:border-white/20 transition-all group/asset"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{asset.icon}</span>
                <span className={`text-xs font-medium ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                </span>
              </div>
              <div className="text-xs font-medium text-white">{asset.symbol}</div>
              <div className="text-xs text-slate-400">{asset.amount.toLocaleString()}</div>
            </motion.div>
          ))}
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

// Overview Section (SIN CAMBIOS - Ya está completo)
const OverviewSection = ({ wallets }) => {
  const totalBalance = wallets.reduce((acc, w) => acc + w.balanceUSD, 0);
  const totalChange = ((wallets.reduce((acc, w) => acc + w.change24h, 0)) / wallets.length).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Hero Stats */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h2 className="text-lg text-slate-400">Portfolio Total</h2>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="flex items-baseline gap-4 mb-6"
          >
            <span className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              totalChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {totalChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span className="text-2xl font-bold">{totalChange >= 0 ? '+' : ''}{totalChange}%</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Wallets</span>
              </div>
              <div className="text-3xl font-bold text-white">{wallets.length}</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Assets</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {wallets.reduce((acc, w) => acc + w.assets.length, 0)}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">24h Volume</span>
              </div>
              <div className="text-3xl font-bold text-white">$45.2K</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-slate-400">Hot Assets</span>
              </div>
              <div className="text-3xl font-bold text-white">7</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wallets Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Mis Wallets
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Wallet
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet, index) => (
            <WalletCard key={wallet.id} wallet={wallet} delay={index * 0.1} onClick={() => {}} />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Transacciones Recientes
        </h3>
        <div className="space-y-2">
          {recentTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  tx.type === 'send' ? 'bg-red-500/20' : 'bg-green-500/20'
                }`}>
                  {tx.type === 'send' ? <ArrowUpRight className="w-5 h-5 text-red-400" /> : <ArrowDownRight className="w-5 h-5 text-green-400" />}
                </div>
                <div>
                  <div className="font-medium text-white">{tx.type === 'send' ? 'Enviado' : 'Recibido'}</div>
                  <div className="text-sm text-slate-400">{tx.timestamp}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${tx.type === 'send' ? 'text-red-400' : 'text-green-400'}`}>
                  {tx.type === 'send' ? '-' : '+'} {tx.amount} {tx.currency}
                </div>
                <div className="text-xs text-slate-500">{tx.hash}</div>
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs ${
                tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {tx.status}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ====== NUEVAS SECCIONES IMPLEMENTADAS ======

// Wallets Section - Lista detallada de wallets
const WalletsSection = ({ wallets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallet.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || wallet.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Search and Filter Bar */}
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-purple-500/20">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar wallet por nombre o dirección..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none transition-colors text-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none transition-colors text-white cursor-pointer"
          >
            <option value="all">Todos los tipos</option>
            <option value="TronLink">TronLink</option>
            <option value="Trust Wallet">Trust Wallet</option>
            <option value="Exodus">Exodus</option>
          </select>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWallets.map((wallet, index) => (
          <WalletCard key={wallet.id} wallet={wallet} delay={index * 0.1} onClick={() => {}} />
        ))}
      </div>

      {filteredWallets.length === 0 && (
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No se encontraron wallets</p>
        </div>
      )}
    </motion.div>
  );
};

// Create Wallet Section
const CreateWalletSection = () => {
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState('TronLink');
  const [generated, setGenerated] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  const generateWallet = () => {
    // Simular generación de dirección
    const address = 'T' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setNewAddress(address);
    setGenerated(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-8 border border-purple-500/20 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Plus className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Crear Nueva Wallet
          </h2>
          <p className="text-slate-400">Genera una nueva wallet de criptomonedas de forma segura</p>
        </div>

        {!generated ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Nombre de la Wallet</label>
              <input
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="Mi Nueva Wallet"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none transition-colors text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Wallet</label>
              <select
                value={walletType}
                onChange={(e) => setWalletType(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none transition-colors text-white cursor-pointer"
              >
                <option value="TronLink">TronLink</option>
                <option value="Trust Wallet">Trust Wallet</option>
                <option value="Exodus">Exodus</option>
                <option value="MetaMask">MetaMask</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateWallet}
              disabled={!walletName}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Generar Wallet
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Check className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-green-400">¡Wallet Creada Exitosamente!</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Nombre</p>
                  <p className="text-white font-semibold">{walletName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Tipo</p>
                  <p className="text-white font-semibold">{walletType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Dirección</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 rounded bg-black/30 text-green-400 font-mono text-sm">{newAddress}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(newAddress)}
                      className="p-2 hover:bg-white/5 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Importante: Guarda tu información</h4>
                  <p className="text-sm text-slate-300">
                    Asegúrate de guardar tu dirección y clave privada en un lugar seguro.
                    No podrás recuperar tu wallet si pierdes esta información.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setGenerated(false);
                setWalletName('');
                setNewAddress('');
              }}
              className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
            >
              Crear Otra Wallet
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Send Section
const SendSection = ({ wallets }) => {
  const [fromWallet, setFromWallet] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('TRX');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-8 border border-purple-500/20 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500">
              <Send className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Enviar Crypto
          </h2>
          <p className="text-slate-400">Transfiere criptomonedas de forma segura</p>
        </div>

        {!sent ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Desde Wallet</label>
              <select
                value={fromWallet}
                onChange={(e) => setFromWallet(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:outline-none transition-colors text-white cursor-pointer"
              >
                <option value="">Seleccionar wallet...</option>
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name} (${w.balanceUSD.toLocaleString()})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Dirección Destino</label>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:outline-none transition-colors text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Cantidad</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:outline-none transition-colors text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Moneda</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:outline-none transition-colors text-white cursor-pointer"
                >
                  <option value="TRX">TRX</option>
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Fee de Red</span>
                <span className="text-white font-semibold">0.001 {currency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total a Enviar</span>
                <span className="text-white font-bold text-lg">{amount || '0'} {currency}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSend}
              disabled={!fromWallet || !toAddress || !amount || sending}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              {sending ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Crypto
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">¡Transacción Enviada!</h3>
            <p className="text-slate-400">Tu transacción ha sido procesada exitosamente</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Receive Section
const ReceiveSection = ({ wallets }) => {
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const wallet = wallets.find(w => w.id === parseInt(selectedWallet));

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-8 border border-purple-500/20 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500">
              <Download className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            Recibir Crypto
          </h2>
          <p className="text-slate-400">Comparte tu dirección para recibir criptomonedas</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Seleccionar Wallet</label>
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pink-500/50 focus:outline-none transition-colors text-white cursor-pointer"
            >
              {wallets.map(w => (
                <option key={w.id} value={w.id}>{w.name} - {w.type}</option>
              ))}
            </select>
          </div>

          {wallet && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* QR Code Placeholder */}
              <div className="aspect-square max-w-xs mx-auto p-8 rounded-2xl bg-white flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>

              {/* Address */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-slate-400 mb-2">Tu Dirección</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 p-3 rounded-lg bg-black/30 text-white font-mono text-sm break-all">
                    {wallet.address}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-3 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Nombre</p>
                  <p className="text-white font-semibold">{wallet.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Tipo</p>
                  <p className="text-white font-semibold">{wallet.type}</p>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">Importante</h4>
                  <p className="text-sm text-slate-300">
                    Solo envía criptomonedas compatibles con esta red a esta dirección.
                    Enviar tokens incompatibles puede resultar en pérdida permanente.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Trading Section
const TradingSection = () => {
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('USDT');
  const [amount, setAmount] = useState('');

  const exchangeRate = 52340.00; // BTC to USDT
  const estimatedAmount = amount ? (parseFloat(amount) * exchangeRate).toFixed(2) : '0.00';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-8 border border-purple-500/20 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 relative">
              <TrendingUp className="w-12 h-12 text-white" />
              <span className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">HOT</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Trading Exchange
          </h2>
          <p className="text-slate-400">Intercambia criptomonedas al mejor precio</p>
        </div>

        <div className="space-y-6">
          {/* From */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <label className="block text-sm font-medium text-slate-400 mb-3">Desde</label>
            <div className="flex gap-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-500/50 focus:outline-none transition-colors text-white text-xl font-semibold"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-500/50 focus:outline-none transition-colors text-white cursor-pointer font-semibold"
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="TRX">TRX</option>
                <option value="BNB">BNB</option>
              </select>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center">
            <button className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-110 transition-transform">
              <ArrowDownRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* To */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <label className="block text-sm font-medium text-slate-400 mb-3">Hacia</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={estimatedAmount}
                readOnly
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xl font-semibold"
              />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-500/50 focus:outline-none transition-colors text-white cursor-pointer font-semibold"
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
                <option value="BUSD">BUSD</option>
                <option value="DAI">DAI</option>
              </select>
            </div>
          </div>

          {/* Exchange Info */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Tasa de Cambio</span>
              <span className="text-white font-semibold">1 {fromCurrency} = {exchangeRate.toLocaleString()} {toCurrency}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Fee de Trading</span>
              <span className="text-green-400 font-semibold">0.1%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Tiempo Estimado</span>
              <span className="text-white font-semibold">~30 segundos</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!amount}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
          >
            <Zap className="w-5 h-5" />
            Intercambiar Ahora
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Emails Section
const EmailsSection = () => {
  const mockEmails = [
    { id: 1, from: 'security@protonmail.com', subject: 'Security Alert - New Login', preview: 'We detected a new login to your account...', time: '2 min ago', read: false },
    { id: 2, from: 'support@binance.com', subject: 'Withdrawal Confirmed', preview: 'Your withdrawal of 0.5 BTC has been processed...', time: '1 hour ago', read: true },
    { id: 3, from: 'notifications@coinbase.com', subject: 'Price Alert: BTC', preview: 'Bitcoin has reached your target price of $52,000...', time: '3 hours ago', read: true },
    { id: 4, from: 'noreply@blockchain.com', subject: 'Transaction Received', preview: 'You have received 2.5 ETH to your wallet...', time: '1 day ago', read: true },
    { id: 5, from: 'updates@protonmail.com', subject: 'New Proton Features', preview: 'Check out our latest privacy features...', time: '2 days ago', read: true },
  ];

  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Email List */}
        <div className="lg:col-span-1 backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-purple-500/20 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-400" />
              Inbox
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">5</span>
            </h3>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {emails.map((email) => (
              <motion.div
                key={email.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedEmail?.id === email.id
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : email.read
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${email.read ? 'bg-slate-600' : 'bg-blue-400'}`} />
                    <span className={`text-sm truncate ${email.read ? 'text-slate-400' : 'text-white font-semibold'}`}>
                      {email.from}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex-shrink-0">{email.time}</span>
                </div>
                <h4 className={`text-sm mb-1 ${email.read ? 'text-slate-300' : 'text-white font-semibold'}`}>
                  {email.subject}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">{email.preview}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Email Content */}
        <div className="lg:col-span-2 backdrop-blur-xl bg-slate-950/60 rounded-2xl p-8 border border-purple-500/20">
          {selectedEmail ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Email Header */}
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl font-bold text-white mb-4">{selectedEmail.subject}</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                      {selectedEmail.from[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{selectedEmail.from}</p>
                      <p className="text-sm text-slate-400">{selectedEmail.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed">
                  {selectedEmail.preview}
                </p>
                <p className="text-slate-300 leading-relaxed mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-slate-300 leading-relaxed mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-white/10">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                  Responder
                </button>
                <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all">
                  Reenviar
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Inbox className="w-24 h-24 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Selecciona un email para leer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Security Section
const SecuritySection = () => {
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15');

  const securityFeatures = [
    { name: '2FA Autenticación', enabled: twoFAEnabled, toggle: setTwoFAEnabled, icon: Smartphone, color: 'text-green-400' },
    { name: 'Biométrica', enabled: biometricEnabled, toggle: setBiometricEnabled, icon: Fingerprint, color: 'text-blue-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-8 border border-purple-500/20 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Centro de Seguridad
          </h2>
          <p className="text-slate-400">Protege tu cuenta con múltiples capas de seguridad</p>
        </div>

        <div className="space-y-6">
          {/* Security Features Toggle */}
          <div className="space-y-4">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.name} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${feature.enabled ? 'bg-green-500/20' : 'bg-white/5'}`}>
                        <Icon className={`w-6 h-6 ${feature.enabled ? feature.color : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{feature.name}</h3>
                        <p className="text-sm text-slate-400">
                          {feature.enabled ? 'Activado' : 'Desactivado'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => feature.toggle(!feature.enabled)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        feature.enabled ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: feature.enabled ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Session Timeout */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Tiempo de Sesión</h3>
                <p className="text-sm text-slate-400">Cerrar sesión automáticamente después de inactividad</p>
              </div>
            </div>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-500/50 focus:outline-none transition-colors text-white cursor-pointer"
            >
              <option value="5">5 minutos</option>
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
            </select>
          </div>

          {/* Recent Activity */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Inicio de sesión', location: 'Monterrey, México', time: 'Hace 2 horas', icon: Check, color: 'text-green-400' },
                { action: 'Cambio de contraseña', location: 'Monterrey, México', time: 'Hace 1 día', icon: Key, color: 'text-blue-400' },
                { action: 'Nueva dispositivo', location: 'CDMX, México', time: 'Hace 3 días', icon: Smartphone, color: 'text-yellow-400' },
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-slate-400">{activity.location}</p>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Score */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Nivel de Seguridad</h3>
              <span className="text-3xl font-bold text-green-400">85%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
            <p className="text-sm text-slate-300">
              Tu cuenta tiene un buen nivel de seguridad. Activa la autenticación biométrica para alcanzar el 100%.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function ShadowPrime() {
  const [activeSection, setActiveSection] = useLocalStorage('shadow_active_section', 'overview');
  const [isCollapsed, setIsCollapsed] = useLocalStorage(STORAGE_KEYS.SIDEBAR_STATE, false);
  const [wallets, setWallets] = useLocalStorage(STORAGE_KEYS.SHADOW_WALLETS, initialWallets);
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEYS.SHADOW_TRANSACTIONS, recentTransactions);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection wallets={wallets} />;
      case 'wallets':
        return <WalletsSection wallets={wallets} />;
      case 'create':
        return <CreateWalletSection />;
      case 'send':
        return <SendSection wallets={wallets} />;
      case 'receive':
        return <ReceiveSection wallets={wallets} />;
      case 'trading':
        return <TradingSection />;
      case 'emails':
        return <EmailsSection />;
      case 'security':
        return <SecuritySection />;
      default:
        return <OverviewSection wallets={wallets} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden relative">
      {/* Cursor glow effect */}
      <CursorGlow />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className="flex-1 flex flex-col overflow-hidden relative"
        style={{ marginLeft: isCollapsed ? 80 : 320 }}
      >
        {/* Header Premium */}
        <header className="relative backdrop-blur-xl bg-slate-950/80 border-b border-purple-500/20 p-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent capitalize">
                {activeSection}
              </h2>
              <p className="text-slate-400 mt-1">Gestiona tus criptomonedas de forma segura</p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group"
              >
                <RefreshCw className="w-5 h-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group"
              >
                <Settings className="w-5 h-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group"
              >
                <Shield className="w-5 h-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
            </div>
          </motion.div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        systemName="ShadowPrime"
        systemContext="Sistema de gestión de wallets crypto con soporte para múltiples blockchains"
        accentColor="purple"
        position="bottom-right"
      />
    </div>
  );
}

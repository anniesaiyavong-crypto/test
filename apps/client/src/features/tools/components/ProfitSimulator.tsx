"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Package } from "lucide-react";
import { PRODUCTION_COSTS, PLATFORM_FEE_PERCENT } from "@/features/tools/constants/mockup-templates";
import type { ProfitBreakdown } from "@/types";

interface ProfitSimulatorProps {
  category: string;
  initialSalePrice?: number;
  initialCreatorFeePercent?: number;
  onChange?: (salePrice: number, creatorFeePercent: number) => void;
}

function calculateBreakdown(
  salePrice: number,
  category: string,
  creatorFeePercent: number
): ProfitBreakdown {
  const productionCost = PRODUCTION_COSTS[category] ?? 8;
  const platformFeeActual = (salePrice * PLATFORM_FEE_PERCENT) / 100;
  const creatorEarnings = (salePrice * creatorFeePercent) / 100;
  const platformEarnings = platformFeeActual;

  return {
    salePrice,
    productionCost,
    platformFeePercent: PLATFORM_FEE_PERCENT,
    creatorFeePercent,
    creatorEarnings,
    platformEarnings,
    productionCostActual: productionCost,
  };
}

interface BarSegmentProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function BarSegment({ label, value, total, color }: BarSegmentProps) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-24 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-2 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-bold text-gray-700 w-12 text-right shrink-0">
        ${value.toFixed(2)}
      </span>
    </div>
  );
}

export function ProfitSimulator({
  category,
  initialSalePrice = 24.99,
  initialCreatorFeePercent = 15,
  onChange,
}: ProfitSimulatorProps) {
  const t = useTranslations("Tools");
  const [salePrice, setSalePrice] = useState(initialSalePrice);
  const [creatorFee, setCreatorFee] = useState(initialCreatorFeePercent);

  const breakdown = calculateBreakdown(salePrice, category, creatorFee);

  const handlePriceChange = useCallback(
    (val: number) => {
      setSalePrice(val);
      onChange?.(val, creatorFee);
    },
    [creatorFee, onChange]
  );

  const handleFeeChange = useCallback(
    (val: number) => {
      setCreatorFee(val);
      onChange?.(salePrice, val);
    },
    [salePrice, onChange]
  );

  const netToSeller = salePrice - breakdown.productionCostActual - breakdown.platformEarnings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Sliders */}
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('salePrice')}
            </label>
            <span className="font-black text-gray-900 text-lg">${salePrice.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={5}
            max={200}
            step={0.5}
            value={salePrice}
            onChange={(e) => handlePriceChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$5</span>
            <span>$200</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('creatorFee')}
            </label>
            <span className="font-black text-gray-900 text-lg">{creatorFee}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={creatorFee}
            onChange={(e) => handleFeeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* Visual Breakdown Bars */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          {t('revenueBreakdown')}
        </p>
        <BarSegment
          label={t('yourEarnings')}
          value={breakdown.creatorEarnings}
          total={salePrice}
          color="#262626"
        />
        <BarSegment
          label={t('platformFee')}
          value={breakdown.platformEarnings}
          total={salePrice}
          color="#9ca3af"
        />
        <BarSegment
          label={t('production')}
          value={breakdown.productionCostActual}
          total={salePrice}
          color="#e5e7eb"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-black text-white rounded-xl p-3 text-center">
          <DollarSign size={16} className="mx-auto mb-1 opacity-70" />
          <p className="font-black text-lg">${breakdown.creatorEarnings.toFixed(2)}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider opacity-60 mt-0.5">{t('youEarn')}</p>
        </div>
        <div className="bg-gray-100 rounded-xl p-3 text-center">
          <Package size={16} className="mx-auto mb-1 text-gray-400" />
          <p className="font-black text-lg text-gray-700">${breakdown.productionCostActual.toFixed(2)}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mt-0.5">{t('production')}</p>
        </div>
        <div className="bg-gray-100 rounded-xl p-3 text-center">
          <TrendingUp size={16} className="mx-auto mb-1 text-gray-400" />
          <p className="font-black text-lg text-gray-700">${Math.max(0, netToSeller).toFixed(2)}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mt-0.5">{t('netSale')}</p>
        </div>
      </div>

      {/* Warning */}
      {breakdown.creatorEarnings < 1 && (
        <p className="text-xs text-red-500 text-center font-medium">
          {t('lowEarningsWarning')}
        </p>
      )}
    </motion.div>
  );
}

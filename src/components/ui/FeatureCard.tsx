'use client';

import React from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { features } from '@/constants/Features';
import { ArrowRight } from 'lucide-react';

type FeatureVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'highlight'
  | 'bordered';

interface FeatureCardProps {
  variant: FeatureVariant;
  name: string;
  description: string;
  cta: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  background?: string;
  accentColor?: string;
  height?: string;
  className?: string;
}

const CardBase: React.FC<{
  children: React.ReactNode;
  className?: string;
  height?: string;
}> = ({ children, className = '', height = 'h-full' }) => (
  <div
    className={`relative overflow-hidden rounded-2xl ${height} ${className}`}
  >
    {children}
  </div>
);

const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`p-6 flex flex-col h-full ${className}`}>{children}</div>
);

const PrimaryCard: React.FC<FeatureCardProps> = ({
  name,
  description,
  cta,
  href,
  Icon,
  background,
  accentColor = 'from-blue-600 to-indigo-700',
  height = 'h-[320px]',
}) => (
  <CardBase className={`bg-gradient-to-br ${accentColor}`} height={height}>
    {background && (
      <div className="absolute inset-0 opacity-20">
        <Image src={background} alt="" width={1920} height={1080}
         className="object-cover" />
      </div>
    )}
    <CardContent className="z-10 relative">
      <div className="bg-white/20 p-3 rounded-xl w-fit mb-4">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
      <p className="text-white/80 mb-6 flex-grow">{description}</p>
      <Link href={href} className="mt-auto">
        <span className="bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-red-100 transition-colors inline-block">
          {cta}
        </span>
      </Link>
    </CardContent>
  </CardBase>
);

const SecondaryCard: React.FC<FeatureCardProps> = ({
  name,
  description,
  cta,
  href,
  Icon,
  height = 'h-[280px]',
}) => (
  <CardBase
    className="border border-yellow-500/30 bg-black/50 backdrop-blur-sm"
    height={height}
  >
    <CardContent>
      <div className="flex justify-between items-start py-10">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-2 rounded-lg">
          <Icon className="h-5 w-5 text-black" />
        </div>
      </div>
      <p className="text-white/70 text-sm mb-4">{description}</p>
      <Link
        href={href}
        className="text-yellow-400 flex items-center text-sm font-medium hover:text-yellow-300 transition-colors mt-auto"
      >
        {cta}
        <ArrowRight className="h-4 w-4 ml-1" />
      </Link>
    </CardContent>
  </CardBase>
);

const TertiaryCard: React.FC<FeatureCardProps> = ({
  name,
  description,
  cta,
  href,
  Icon,
  background,
  accentColor = 'from-purple-600 to-pink-600',
  height = 'h-[260px]',
}) => (
  <CardBase className={`bg-gradient-to-br ${accentColor}`} height={height}>
    {background && (
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
        <Image
          src={background}
          alt=""
          width={128}
          height={128}
          className="object-contain"
        />
      </div>
    )}
    <CardContent>
      <Icon className="h-8 w-8 text-white mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-white/80 text-sm mb-4">{description}</p>
      <Link href={href} className="mt-auto">
        <span className="bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm hover:bg-black/40 transition-colors inline-block">
          {cta}
        </span>
      </Link>
    </CardContent>
  </CardBase>
);

const HighlightCard: React.FC<FeatureCardProps> = ({
  name,
  description,
  cta,
  href,
  Icon,
  background,
  height = 'h-[240px]',
}) => (
  <CardBase
    className="border-2 border-dashed border-rose-500/50 bg-gray-900"
    height={height}
  >
    {background && (
      <div className="absolute -right-6 -bottom-6 w-24 h-24 opacity-30">
        <Image
          src={background}
          alt=""
          width={96}
          height={96}
          className="object-contain"
        />
      </div>
    )}
    <CardContent>
      <div className="flex items-center mb-4">
        <div className="bg-rose-500/20 p-2 rounded-lg mr-3">
          <Icon className="h-5 w-5 text-rose-400" />
        </div>
        <h3 className="text-lg font-bold text-white">{name}</h3>
      </div>
      <p className="text-gray-300 text-sm mb-4">{description}</p>
      <Link href={href} className="mt-auto">
        <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm hover:opacity-90 transition-opacity inline-block">
          {cta}
        </span>
      </Link>
    </CardContent>
  </CardBase>
);

const BorderedCard: React.FC<FeatureCardProps> = ({
  name,
  description,
  cta,
  href,
  Icon,
  height = 'h-[300px]',
}) => (
  <CardBase
    className="bg-gray-900/70 backdrop-blur-sm border border-cyan-500/30"
    height={height}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
    <CardContent>
      <Icon className="h-6 w-6 text-cyan-400 mb-4" />
      <h3 className="text-xl font-bold text-white mb-3">{name}</h3>
      <p className="text-gray-300 mb-6">{description}</p>
      <div className="mt-auto">
        <Link href={href}>
          <span className="inline-block border border-cyan-500/50 text-cyan-400 px-5 py-2 rounded-lg hover:bg-cyan-500/10 transition-colors text-sm font-medium">
            {cta}
          </span>
        </Link>
      </div>
    </CardContent>
  </CardBase>
);

const FeatureCard: React.FC<{
  feature: Omit<FeatureCardProps, 'variant'> & { variant: string };
  index: number;
}> = ({ feature, index }) => {
  const variant = feature.variant as FeatureVariant;

  const CardComponent =
    {
      primary: PrimaryCard,
      secondary: SecondaryCard,
      tertiary: TertiaryCard,
      highlight: HighlightCard,
      bordered: BorderedCard,
    }[variant] || PrimaryCard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={feature.className}
    >
      <CardComponent {...(feature as unknown as FeatureCardProps)} />
    </motion.div>
  );
};

export default function FeatureGrid() {
  return (
    <section className="container mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Discover What Zynvo Offers
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our powerful features designed to streamline your workflow
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {features.map((feature, index) => (
          <FeatureCard key={feature.name} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}

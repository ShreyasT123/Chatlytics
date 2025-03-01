"use client"
import React, { ReactNode } from 'react';
import { ArrowRight, Cpu, Zap, Shield, Cloud, Terminal, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import  GeminiChat from '@/components/ChatAssistant';
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="container mx-auto px-4 py-20 relative"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            variants={fadeInUp}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg mb-4"
          >
            <Zap className="text-white w-8 h-8" />
          </motion.div>
          <motion.div variants={fadeInUp} className="text-5xl font-bold text-gray-100 max-w-3xl leading-tight">
            <TypeAnimation
              sequence={[
                'Accelerate Your AI Development with Tachyon',
                1000
              ]}
              wrapper="span"
              speed={50}
              repeat={0}
            />
          </motion.div>
          <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-2xl">
            The next-generation AI platform that empowers developers to build, deploy, and scale AI solutions at the speed of light.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4 mt-8">
            <Button className="bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-8 py-6 rounded-full text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-100 hover:bg-gray-800 px-8 py-6 rounded-full text-lg">
              View Demo
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Cpu />}
              title="Advanced AI Processing"
              description="Leverage state-of-the-art AI models with unprecedented processing speed and efficiency."
            />
            <FeatureCard
              icon={<Cloud />}
              title="Scalable Infrastructure"
              description="Built on a robust cloud infrastructure that scales automatically with your needs."
            />
            <FeatureCard
              icon={<Shield />}
              title="Enterprise Security"
              description="Bank-grade security with end-to-end encryption and compliance with industry standards."
            />
            <FeatureCard
              icon={<Terminal />}
              title="Developer-First"
              description="Comprehensive APIs and SDKs designed for developers, by developers."
            />
            <FeatureCard
              icon={<Sparkles />}
              title="AI Model Hub"
              description="Access a vast library of pre-trained models and customize them for your needs."
            />
            <FeatureCard
              icon={<Zap />}
              title="Real-Time Processing"
              description="Process and analyze data in real-time with ultra-low latency."
            />
            <GeminiChat/>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-20 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number={99.9} label="Uptime" suffix="%" />
            <StatCard number={50} label="Latency" prefix="<" suffix="ms" />
            <StatCard number={1000000} label="API Calls/Day" suffix="+" />
            <StatCard number={500} label="Enterprise Clients" suffix="+" />
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-20">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="rounded-3xl bg-gradient-to-br from-violet-600/20 to-purple-700/20 backdrop-blur-lg p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-600/10 transform rotate-12 scale-150" />
            <h2 className="text-3xl font-bold text-gray-100 mb-6 relative">
              Ready to Supercharge Your AI Development?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto relative">
              Join thousands of developers who are already building the future with Tachyon.
            </p>
            <Button className="bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-8 py-6 rounded-full text-lg relative">
              Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
}


const AnimatedSection = ({ children }: { children: ReactNode }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
    >
      <Card className="bg-gray-900/50 backdrop-blur-lg border-gray-800 p-6 h-full">
        <CardContent className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <div className="text-white w-6 h-6">
              {icon}
            </div>
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface StatCardProps {
  number: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

const StatCard = ({ number, label, prefix = "", suffix = "" }: StatCardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      className="text-center"
    >
      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-600 mb-2">
        {inView ? (
          <span>
            {prefix}
            <CountUp
              end={number}
              duration={2.5}
              separator=","
            />
            {suffix}
          </span>
        ) : `${prefix}0${suffix}`}
      </div>
      <div className="text-gray-300">{label}</div>
    </motion.div>
  );
};
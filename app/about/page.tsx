'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Users, Target, Zap, Heart, Shield, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: Users,
    title: 'Community First',
    description: 'Building a platform where users help each other save money through smart subscription sharing.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Shield,
    title: 'Security & Trust',
    description: 'Bank-level encryption and transparent practices ensure your data and payments are always protected.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Leveraging AI and cutting-edge tech to optimize slot allocation and personalize recommendations.',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'Making premium streaming affordable for everyone, regardless of budget or location.',
    color: 'from-red-500 to-rose-500'
  }
];

const team = [
  {
    name: 'Alex Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former Netflix engineer passionate about democratizing streaming access.',
    image: '/team/alex.jpg'
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO & Co-Founder',
    bio: 'AI/ML expert focused on building intelligent slot optimization systems.',
    image: '/team/sarah.jpg'
  },
  {
    name: 'Marcus Williams',
    role: 'Head of Product',
    bio: 'Product designer with 10+ years creating user-centric experiences.',
    image: '/team/marcus.jpg'
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Growth',
    bio: 'Growth strategist helping millions discover smarter ways to stream.',
    image: '/team/priya.jpg'
  }
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '$2M+', label: 'Saved Collectively' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.8/5', label: 'User Rating' }
];

const timeline = [
  { year: '2023', event: 'Founded as a college project', description: 'Started in a dorm room with a simple idea' },
  { year: '2024', event: 'Launched Beta', description: 'Onboarded first 1,000 users' },
  { year: '2024', event: 'AI Integration', description: 'Introduced smart slot optimization' },
  { year: '2025', event: 'Series A Funding', description: 'Raised $5M to scale globally' }
];

export default function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <NavBar />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            About <span className="text-primary neon">SplitShare</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto">
            Revolutionizing how the world shares and saves on streaming subscriptions through AI-powered technology and community collaboration.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="relative px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="relative h-96 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-32 h-32 mx-auto text-white/80 mb-4" />
                  <p className="text-2xl font-bold">Our Team</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Our <span className="text-primary">Story</span></h2>
            <p className="text-lg text-muted mb-4">
              At <span className="font-semibold text-white">SplitShare</span>, we believe streaming should be affordable and shared seamlessly. What started as a college project is now growing into a platform where people can split subscriptions securely and enjoy content without the heavy cost.
            </p>
            <p className="text-lg text-muted mb-4">
              Our mission is to make digital subscriptions accessible, simple, and enjoyable — powered by technology and driven by community.
            </p>
            <p className="text-lg text-muted">
              We've helped thousands of users save money while enjoying their favorite content, and we're just getting started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-6 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassCard className="text-center p-8 hover:border-primary/50 transition-all">
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="relative px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Our <span className="text-primary">Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard className="h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted">{value.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="relative px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Our <span className="text-primary">Journey</span>
          </h2>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-lg">
                      {item.year}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">{item.event}</h3>
                    <p className="text-muted">{item.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="relative px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Meet the <span className="text-primary">Team</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <GlassCard className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <Users className="w-16 h-16 text-white/60" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary text-sm mb-3">{member.role}</p>
                  <p className="text-muted text-sm">{member.bio}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard className="text-center p-12 border-primary/30 shadow-glow">
            <Target className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="text-4xl font-bold mb-4">
              Join Our <span className="text-primary">Mission</span>
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              Be part of the movement to make streaming accessible for everyone. Together, we're building a smarter way to share and save.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 rounded-full bg-primary text-white font-bold shadow-glow hover:scale-105 transition-transform">
                Get Started
              </button>
              <button className="px-8 py-4 rounded-full bg-secondary text-white font-bold shadow-glowGreen hover:scale-105 transition-transform">
                Contact Us
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </main>
  );
}

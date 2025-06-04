"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  TrendingUp,
  Calculator,
  Star,
  ChevronDown,
  Target,
  Shield,
  Smartphone,
  BarChart3,
  PieChart,
  CreditCard,
  Bell,
  Users,
  Zap,
  ArrowRight,
  Play,
  Brain,
  Globe,
  Calendar,
  FileText,
  Banknote,
  Award,
  Lock,
  Sparkles,
  Rocket,
  CheckCircle,
  DollarSign,
  Eye,
  Lightbulb,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])

  const targetStats = [50000, 2000000, 99.9, 4.9]
  const statLabels = ["Active Users", "Money Saved", "Uptime", "User Rating"]

  useEffect(() => {
    setIsVisible(true)

    // Animate stats
    const animateStats = () => {
      targetStats.forEach((target, index) => {
        let current = 0
        const increment = target / 100
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          setAnimatedStats((prev) => {
            const newStats = [...prev]
            newStats[index] = current
            return newStats
          })
        }, 20)
      })
    }

    const statsTimer = setTimeout(animateStats, 500)

    // Feature rotation
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 8)
    }, 4000)

    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up")
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = document.querySelectorAll(".scroll-animate")
    sections.forEach((section) => observer.observe(section))

    return () => {
      clearInterval(interval)
      clearTimeout(statsTimer)
      observer.disconnect()
    }
  }, [])

  const features = [
    {
      icon: Brain,
      title: "AI Financial Advisor",
      desc: "Smart recommendations powered by machine learning",
    },
    {
      icon: Wallet,
      title: "Smart Expense Tracking",
      desc: "Automatic categorization and insights",
    },
    {
      icon: TrendingUp,
      title: "Investment Analytics",
      desc: "Portfolio tracking and performance analysis",
    },
    {
      icon: Calculator,
      title: "Advanced Budgeting",
      desc: "Dynamic budget allocation and monitoring",
    },
    { icon: Target, title: "Goal Achievement", desc: "Set and track financial milestones" },
    { icon: Globe, title: "Multi-Currency", desc: "Support for 150+ currencies worldwide" },
    { icon: Bell, title: "Smart Notifications", desc: "Proactive alerts and reminders" },
    {
      icon: Shield,
      title: "Bank-Level Security",
      desc: "Military-grade encryption and protection",
    },
  ]

  const advancedFeatures = [
    {
      icon: Brain,
      title: "AI Financial Advisor",
      desc: "Get personalized financial advice powered by machine learning algorithms",
    },
    {
      icon: Wallet,
      title: "Smart Expense Tracking",
      desc: "Automatic transaction categorization with receipt scanning",
    },
    {
      icon: TrendingUp,
      title: "Investment Portfolio",
      desc: "Track stocks, crypto, and other investments in real-time",
    },
    { icon: Calculator, title: "Advanced Budgeting", desc: "Dynamic budget allocation with predictive analytics" },
    { icon: Target, title: "Goal Management", desc: "Set and achieve financial milestones with smart recommendations" },
    { icon: BarChart3, title: "Financial Reports", desc: "Comprehensive analytics with exportable reports" },
    { icon: Bell, title: "Smart Notifications", desc: "Proactive alerts for bills, budgets, and opportunities" },
    { icon: Smartphone, title: "Mobile Apps", desc: "Full-featured iOS and Android apps with offline support" },
    { icon: PieChart, title: "Spending Analysis", desc: "Visual breakdowns with trend analysis and predictions" },
    { icon: CreditCard, title: "Bill Management", desc: "Automated bill tracking with payment scheduling" },
    { icon: Users, title: "Family Sharing", desc: "Collaborative budgeting with role-based permissions" },
    { icon: Zap, title: "Real-time Sync", desc: "Instant updates across all devices with cloud backup" },
    { icon: Globe, title: "Multi-Currency", desc: "Support for 150+ currencies with live exchange rates" },
    { icon: Calendar, title: "Financial Calendar", desc: "Track important dates, bills, and financial events" },
    { icon: FileText, title: "Tax Planning", desc: "Automated tax preparation with deduction optimization" },
    { icon: Banknote, title: "Debt Management", desc: "Strategic debt payoff plans with interest calculations" },
    { icon: Award, title: "Credit Score Monitoring", desc: "Track your credit score with improvement recommendations" },
    { icon: Lock, title: "Privacy Protection", desc: "Zero-knowledge architecture with end-to-end encryption" },
  ]

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "$2M+", label: "Money Saved", icon: DollarSign },
    { value: "99.9%", label: "Uptime", icon: Zap },
    { value: "4.9★", label: "User Rating", icon: Star },
  ]

  const formatStatValue = (value: number, index: number) => {
    if (index === 0) return `${Math.floor(value / 1000)}K+`
    if (index === 1) return `$${Math.floor(value / 1000000)}M+`
    if (index === 2) return `${value.toFixed(1)}%`
    if (index === 3) return `${value.toFixed(1)}★`
    return value.toString()
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-yellow-500/20 bg-black/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 group">
              <div className="text-2xl font-bold text-yellow-400 transition-transform duration-300 group-hover:scale-105">
                MONEY MAGNET 💵
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Reviews", "Pricing", "FAQ"].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white hover:text-yellow-400 transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300"
                >
                  Dashboard
                </Button>
              </Link>
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 transition-all duration-300">
                Get Started
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 scroll-animate">
        <div className="container mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
              <Rocket className="mr-2 h-4 w-4" />
              New: AI-Powered Financial Insights
            </Badge>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Money Magnet
            </h1>

            <div className="text-3xl md:text-4xl text-white mb-4">
              Helps You <span className="text-yellow-400 font-semibold">Achieve Financial Freedom</span>
            </div>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your financial future with AI-powered insights, smart budgeting tools, and real-time expense
              tracking. Join thousands who've already taken control of their money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-black hover:bg-yellow-500 transition-all duration-300 text-lg px-8 py-4"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 text-lg px-8 py-4"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center transition-transform duration-300 hover:scale-105">
                    <div className="mb-2 flex justify-center">
                      <Icon className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">
                      {formatStatValue(animatedStats[index], index)}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-16 text-yellow-400">
            <p className="text-sm mb-2 flex items-center justify-center">
              <Sparkles className="mr-2 h-4 w-4" />
              Discover the magic below
              <Sparkles className="ml-2 h-4 w-4" />
            </p>
            <ChevronDown className="mx-auto h-6 w-6" />
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section className="py-20 px-4 bg-gray-900/20 scroll-animate">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-yellow-400">Powerful Features</h2>
            <p className="text-xl text-gray-300">Everything you need to master your finances</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-6 rounded-xl transition-all duration-500 cursor-pointer ${
                        currentFeature === index
                          ? "bg-yellow-400/10 border-l-4 border-yellow-400 transform scale-105"
                          : "hover:bg-gray-800/50"
                      }`}
                      onClick={() => setCurrentFeature(index)}
                    >
                      <div
                        className={`p-3 rounded-full ${currentFeature === index ? "bg-yellow-400/20" : "bg-gray-800"} transition-all duration-300`}
                      >
                        <Icon className="h-6 w-6 text-yellow-400 transition-all duration-300" />
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-medium text-white transition-colors">{feature.title}</span>
                        <p className="text-sm text-gray-400 mt-1">{feature.desc}</p>
                      </div>
                      {currentFeature === index && <CheckCircle className="h-5 w-5 text-yellow-400" />}
                    </div>
                  )
                })}
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 border border-yellow-500/20 shadow-2xl backdrop-blur-sm">
                  <div className="h-80 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center transform transition-all duration-500">
                      {React.createElement(features[currentFeature].icon, {
                        className: `h-32 w-32 text-yellow-400 mb-6 mx-auto`,
                      })}
                      <h3 className="text-2xl font-bold text-white mb-4">{features[currentFeature].title}</h3>
                      <p className="text-gray-400 leading-relaxed">{features[currentFeature].desc}</p>
                      <div className="mt-6">
                        <Button className="bg-yellow-400 text-black hover:bg-yellow-500 transition-all duration-300">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview Feature
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section id="features" className="py-20 px-4 scroll-animate">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-yellow-400">Complete Financial Suite</h2>
          <p className="text-xl text-gray-300 text-center mb-16">18 powerful tools to transform your financial life</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-gray-900/80 to-black/80 border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 group backdrop-blur-sm"
                >
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    <div className="mb-4 flex justify-center relative z-10">
                      <div className="p-4 bg-yellow-400/20 rounded-full group-hover:scale-110 transition-all duration-300">
                        <Icon className="h-8 w-8 text-yellow-400 transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors relative z-10">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>

                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-900/20 scroll-animate">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-yellow-400">Choose Your Plan</h2>
            <p className="text-xl text-gray-300">Start free, upgrade when you're ready</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "forever",
                features: [
                  "Basic expense tracking",
                  "Simple budgeting",
                  "Mobile app access",
                  "Email support",
                  "Up to 3 goals",
                  "Basic reports",
                ],
                popular: false,
                color: "from-gray-800 to-gray-900",
                accent: "text-gray-400",
              },
              {
                name: "Pro",
                price: "$9.99",
                period: "/month",
                features: [
                  "Advanced analytics",
                  "Investment tracking",
                  "Unlimited goals",
                  "Priority support",
                  "Family sharing (5 members)",
                  "Custom categories",
                  "Bill reminders",
                  "Credit score monitoring",
                ],
                popular: true,
                color: "from-yellow-600 to-yellow-700",
                accent: "text-yellow-400",
              },
              {
                name: "Premium",
                price: "$19.99",
                period: "/month",
                features: [
                  "Everything in Pro",
                  "AI financial advisor",
                  "Tax optimization",
                  "Business features",
                  "API access",
                  "White-label options",
                  "Dedicated support",
                  "Advanced security",
                ],
                popular: false,
                color: "from-gray-800 to-gray-900",
                accent: "text-gray-400",
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-gradient-to-br ${plan.color} border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 group`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-400 text-black px-4 py-1">
                      <Star className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8 text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4 text-white">{plan.name}</h3>
                    <div className="mb-6">
                      <span className={`text-5xl font-bold ${plan.accent}`}>{plan.price}</span>
                      <span className="text-gray-400 text-lg">{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-gray-300 flex items-center justify-start">
                          <CheckCircle className="w-4 h-4 text-yellow-400 mr-3 flex-shrink-0" />
                          <span className="text-left">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full transition-all duration-300 ${
                        plan.popular
                          ? "bg-yellow-400 text-black hover:bg-yellow-500"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                    >
                      {plan.price === "Free" ? "Get Started" : "Start Free Trial"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section id="testimonials" className="py-20 px-4 scroll-animate">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-yellow-400">Loved by Thousands</h2>
            <p className="text-xl text-gray-300">Real stories from real users who transformed their finances</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                location: "Belgrade",
                text: "Money Magnet's AI advisor helped me optimize my business expenses and increase profits by 40%. The insights are incredible!",
                rating: 5,
                savings: "$12,400",
                avatar: "SJ",
              },
              {
                name: "Ron Rizzly",
                role: "Software Engineer",
                location: "London",
                text: "This is the best money tracker ever! The investment tracking feature helped me rebalance my portfolio and save thousands.",
                rating: 5,
                savings: "$8,200",
                avatar: "RR",
              },
              {
                name: "Maria Garcia",
                role: "Teacher",
                location: "Madrid",
                text: "Finally, a budgeting app that actually works! The goal tracking feature motivated me to save for my dream vacation.",
                rating: 5,
                savings: "$5,800",
                avatar: "MG",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-900/80 to-black/80 border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 group backdrop-blur-sm"
              >
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <p className="text-lg mb-6 text-gray-300 leading-relaxed italic">"{testimonial.text}"</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-yellow-400">{testimonial.name}</p>
                          <p className="text-gray-400 text-sm">{testimonial.role}</p>
                          <p className="text-gray-500 text-xs">{testimonial.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold text-xl">{testimonial.savings}</p>
                        <p className="text-gray-400 text-xs">saved this year</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 bg-yellow-400/10 scroll-animate">
        <div className="container mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6 text-yellow-400">Ready to Transform Your Finances?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join over 50,000 users who've already taken control of their financial future with Money Magnet. Start your
            journey to financial freedom today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-yellow-400 text-black hover:bg-yellow-500 text-xl px-12 py-6 transition-all duration-300"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-xl px-12 py-6 transition-all duration-300"
            >
              <Calendar className="mr-2 h-6 w-6" />
              Schedule Demo
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-yellow-400" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-yellow-400" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-yellow-400" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-gray-900/20 scroll-animate">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-5xl font-bold text-center mb-4 text-yellow-400">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-300 text-center mb-16">Everything you need to know about Money Magnet</p>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "What is Money Magnet and how does it work?",
                answer:
                  "Money Magnet is a comprehensive AI-powered financial management platform that helps you track expenses, manage budgets, analyze investments, and achieve your financial goals. Our advanced algorithms provide personalized insights and recommendations to optimize your financial health.",
              },
              {
                question: "How do I start using Money Magnet?",
                answer:
                  "Getting started is simple! Click 'Start Free Trial' to create your account. You'll be guided through a quick 3-step setup process to securely connect your accounts and customize your financial dashboard. No credit card required for the free tier.",
              },
              {
                question: "Is my financial data secure and private?",
                answer:
                  "Absolutely. We use military-grade 256-bit encryption, multi-factor authentication, and comply with SOC 2 Type II standards. Your data is stored with zero-knowledge architecture, meaning even we can't access your sensitive information. We never share or sell your data.",
              },
              {
                question: "Can I use Money Magnet on my mobile device?",
                answer:
                  "Yes! We have full-featured mobile apps for both iOS and Android that sync seamlessly with the web platform. You can track expenses, check budgets, receive notifications, and access all features on the go with offline support.",
              },
              {
                question: "What makes Money Magnet different from other financial apps?",
                answer:
                  "Our AI-powered insights, comprehensive feature set including investment tracking, multi-currency support, family sharing, and advanced analytics make us a complete financial solution. Plus, our predictive algorithms help you make smarter financial decisions.",
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time with no cancellation fees or penalties. Your data remains accessible, and you can always reactivate your account later. We also offer a 30-day money-back guarantee.",
              },
              {
                question: "Do you support multiple currencies?",
                answer:
                  "Yes! Money Magnet supports over 150 currencies with real-time exchange rates. Perfect for international users, travelers, or anyone dealing with multiple currencies in their financial life.",
              },
              {
                question: "How does the AI financial advisor work?",
                answer:
                  "Our AI analyzes your spending patterns, income trends, and financial goals to provide personalized recommendations. It can suggest budget optimizations, investment opportunities, debt payoff strategies, and help you achieve your financial goals faster.",
              },
            ].map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-yellow-500/20 bg-gray-800/50 rounded-lg px-6 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left text-white hover:text-yellow-400 transition-colors py-6 text-lg font-medium">
                  <div className="flex items-center">
                    <Lightbulb className="mr-3 h-5 w-5 text-yellow-400" />
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-6 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 px-4 border-t border-yellow-500/20 bg-black scroll-animate">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="text-3xl font-bold text-yellow-400 mb-4 flex items-center">MONEY MAGNET 💵</div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your comprehensive financial tool for effortless budget management, expense tracking, and financial
                empowerment. Transform your financial future with AI-powered insights.
              </p>
              <div className="flex space-x-4">
                {["f", "t", "in", "ig"].map((social, index) => (
                  <div
                    key={social}
                    className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center hover:bg-yellow-400/30 transition-all duration-300 cursor-pointer hover:scale-110"
                  >
                    <span className="text-yellow-400 text-sm font-bold">{social}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Mobile App", "API", "Integrations", "Security"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press", "Partners", "Contact"],
              },
              {
                title: "Support",
                links: ["Help Center", "Privacy Policy", "Terms of Service", "Status", "Community", "Feedback"],
              },
            ].map((section, index) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold mb-4 text-lg">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-yellow-500/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Money Magnet. All rights reserved. Made with care for your financial success.
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-yellow-400" />
                  SOC 2 Certified
                </div>
                <div className="flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-yellow-400" />
                  256-bit Encryption
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-yellow-400" />
                  99.9% Uptime
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer background decoration */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"></div>
      </footer>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Plus,
  BarChart3,
  Bell,
  Home,
  CreditCard,
  ShoppingCart,
  Car,
  Utensils,
  Gamepad2,
  Coffee,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw,
  PieChart,
  Zap,
  Shield,
  CheckCircle,
  AlertTriangle,
  Download,
  Search,
  Edit,
  Share,
  BookOpen,
  Heart,
  Sun,
  Moon,
  Plane,
  Laptop,
  Trash2,
  Save,
} from "lucide-react"
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
} from "recharts"
import Link from "next/link"

interface Transaction {
  id: string
  amount: number
  category: string
  description: string
  date: string
  type: "income" | "expense"
  merchant?: string
  location?: string
  tags?: string[]
  recurring?: boolean
}

interface Budget {
  id: string
  category: string
  allocated: number
  spent: number
  icon: any
  color: string
  trend: number
  lastMonth: number
}

interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  color: string
  category: string
  priority: "high" | "medium" | "low"
  description?: string
}

interface Investment {
  id: string
  symbol: string
  name: string
  shares: number
  currentPrice: number
  purchasePrice: number
  change: number
  changePercent: number
}

interface Bill {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
  status: "paid" | "pending" | "overdue"
  recurring: boolean
}

interface UserData {
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  investments: Investment[]
  bills: Bill[]
  settings: {
    darkMode: boolean
    notifications: boolean
    currency: string
  }
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData>({
    transactions: [],
    budgets: [],
    goals: [],
    investments: [],
    bills: [],
    settings: {
      darkMode: true,
      notifications: true,
      currency: "USD",
    },
  })

  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    category: "",
    description: "",
    type: "expense" as "income" | "expense",
    merchant: "",
    tags: "",
  })

  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    deadline: "",
    category: "",
    priority: "medium" as "high" | "medium" | "low",
    description: "",
  })

  const [newBudget, setNewBudget] = useState({
    category: "",
    allocated: "",
  })

  const [newInvestment, setNewInvestment] = useState({
    symbol: "",
    name: "",
    shares: "",
    purchasePrice: "",
  })

  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "",
    recurring: false,
  })

  const [goalContribution, setGoalContribution] = useState({
    goalId: "",
    amount: "",
  })

  const [filters, setFilters] = useState({
    dateRange: "30",
    category: "all",
    type: "all",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  const { toast } = useToast()

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("moneyMagnetData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setUserData(parsedData)
      } catch (error) {
        console.error("Error loading saved data:", error)
        initializeDefaultData()
      }
    } else {
      initializeDefaultData()
    }
    setIsLoading(false)
  }, [])

  // Save data to localStorage whenever userData changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("moneyMagnetData", JSON.stringify(userData))
    }
  }, [userData, isLoading])

  const initializeDefaultData = () => {
    const defaultData: UserData = {
      transactions: [
        {
          id: "1",
          amount: 3500,
          category: "Salary",
          description: "Monthly Salary",
          date: new Date().toISOString().split("T")[0],
          type: "income",
          merchant: "TechCorp Inc.",
          location: "Direct Deposit",
          tags: ["work", "salary"],
          recurring: true,
        },
      ],
      budgets: [
        {
          id: "1",
          category: "Housing",
          allocated: 1500,
          spent: 0,
          icon: Home,
          color: "#facc15",
          trend: 0,
          lastMonth: 0,
        },
        {
          id: "2",
          category: "Food",
          allocated: 600,
          spent: 0,
          icon: Utensils,
          color: "#facc15",
          trend: 0,
          lastMonth: 0,
        },
      ],
      goals: [
        {
          id: "1",
          name: "Emergency Fund",
          target: 15000,
          current: 0,
          deadline: "2024-12-31",
          color: "#facc15",
          category: "Savings",
          priority: "high",
          description: "6 months of expenses for financial security",
        },
      ],
      investments: [],
      bills: [],
      settings: {
        darkMode: true,
        notifications: true,
        currency: "USD",
      },
    }
    setUserData(defaultData)
  }

  // Calculate budget spent amounts based on transactions
  const calculateBudgetSpent = () => {
    const updatedBudgets = userData.budgets.map((budget) => {
      const spent = userData.transactions
        .filter((t) => t.type === "expense" && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0)
      return { ...budget, spent }
    })

    setUserData((prev) => ({ ...prev, budgets: updatedBudgets }))
  }

  useEffect(() => {
    calculateBudgetSpent()
  }, [userData.transactions])

  const categoryIcons: { [key: string]: any } = {
    Salary: DollarSign,
    Rent: Home,
    Housing: Home,
    Groceries: ShoppingCart,
    Food: Utensils,
    Transportation: Car,
    Entertainment: Gamepad2,
    Shopping: ShoppingCart,
    Bills: CreditCard,
    Coffee: Coffee,
    Utilities: Zap,
    Insurance: Shield,
    Investment: TrendingUp,
    Savings: Wallet,
    Travel: Plane,
    Health: Heart,
    Education: BookOpen,
    Technology: Laptop,
  }

  // Transaction functions
  const addTransaction = () => {
    if (newTransaction.amount && newTransaction.category && newTransaction.description) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: Number.parseFloat(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
        date: new Date().toISOString().split("T")[0],
        type: newTransaction.type,
        merchant: newTransaction.merchant,
        tags: newTransaction.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        recurring: false,
      }

      setUserData((prev) => ({
        ...prev,
        transactions: [transaction, ...prev.transactions],
      }))

      setNewTransaction({ amount: "", category: "", description: "", type: "expense", merchant: "", tags: "" })
      toast({
        title: "Transaction Added",
        description: `${transaction.type === "income" ? "Income" : "Expense"} of $${transaction.amount} added successfully.`,
      })
    }
  }

  const updateTransaction = (updatedTransaction: Transaction) => {
    setUserData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)),
    }))
    setEditingTransaction(null)
    toast({
      title: "Transaction Updated",
      description: "Transaction has been updated successfully.",
    })
  }

  const deleteTransaction = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }))
    toast({
      title: "Transaction Deleted",
      description: "Transaction has been deleted successfully.",
    })
  }

  // Budget functions
  const addBudget = () => {
    if (newBudget.category && newBudget.allocated) {
      const budget: Budget = {
        id: Date.now().toString(),
        category: newBudget.category,
        allocated: Number.parseFloat(newBudget.allocated),
        spent: 0,
        icon: categoryIcons[newBudget.category] || ShoppingCart,
        color: "#facc15",
        trend: 0,
        lastMonth: 0,
      }

      setUserData((prev) => ({
        ...prev,
        budgets: [...prev.budgets, budget],
      }))

      setNewBudget({ category: "", allocated: "" })
      toast({
        title: "Budget Created",
        description: `Budget for ${budget.category} created successfully.`,
      })
    }
  }

  const updateBudget = (updatedBudget: Budget) => {
    setUserData((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) => (b.id === updatedBudget.id ? updatedBudget : b)),
    }))
    setEditingBudget(null)
    toast({
      title: "Budget Updated",
      description: "Budget has been updated successfully.",
    })
  }

  const deleteBudget = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((b) => b.id !== id),
    }))
    toast({
      title: "Budget Deleted",
      description: "Budget has been deleted successfully.",
    })
  }

  // Goal functions
  const addGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        target: Number.parseFloat(newGoal.target),
        current: 0,
        deadline: newGoal.deadline,
        color: "#facc15",
        category: newGoal.category,
        priority: newGoal.priority,
        description: newGoal.description,
      }

      setUserData((prev) => ({
        ...prev,
        goals: [...prev.goals, goal],
      }))

      setNewGoal({ name: "", target: "", deadline: "", category: "", priority: "medium", description: "" })
      toast({
        title: "Goal Created",
        description: `Goal "${goal.name}" created successfully.`,
      })
    }
  }

  const contributeToGoal = () => {
    if (goalContribution.goalId && goalContribution.amount) {
      const amount = Number.parseFloat(goalContribution.amount)
      setUserData((prev) => ({
        ...prev,
        goals: prev.goals.map((g) =>
          g.id === goalContribution.goalId ? { ...g, current: Math.min(g.current + amount, g.target) } : g,
        ),
      }))

      // Add transaction for goal contribution
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: amount,
        category: "Savings",
        description: `Contribution to ${userData.goals.find((g) => g.id === goalContribution.goalId)?.name}`,
        date: new Date().toISOString().split("T")[0],
        type: "expense",
        tags: ["goal", "savings"],
        recurring: false,
      }

      setUserData((prev) => ({
        ...prev,
        transactions: [transaction, ...prev.transactions],
      }))

      setGoalContribution({ goalId: "", amount: "" })
      toast({
        title: "Contribution Added",
        description: `$${amount} contributed to your goal successfully.`,
      })
    }
  }

  const deleteGoal = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }))
    toast({
      title: "Goal Deleted",
      description: "Goal has been deleted successfully.",
    })
  }

  // Investment functions
  const addInvestment = () => {
    if (newInvestment.symbol && newInvestment.name && newInvestment.shares && newInvestment.purchasePrice) {
      const investment: Investment = {
        id: Date.now().toString(),
        symbol: newInvestment.symbol.toUpperCase(),
        name: newInvestment.name,
        shares: Number.parseFloat(newInvestment.shares),
        currentPrice: Number.parseFloat(newInvestment.purchasePrice), // In real app, fetch from API
        purchasePrice: Number.parseFloat(newInvestment.purchasePrice),
        change: 0,
        changePercent: 0,
      }

      setUserData((prev) => ({
        ...prev,
        investments: [...prev.investments, investment],
      }))

      setNewInvestment({ symbol: "", name: "", shares: "", purchasePrice: "" })
      toast({
        title: "Investment Added",
        description: `${investment.symbol} added to your portfolio.`,
      })
    }
  }

  const deleteInvestment = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      investments: prev.investments.filter((i) => i.id !== id),
    }))
    toast({
      title: "Investment Removed",
      description: "Investment has been removed from your portfolio.",
    })
  }

  // Bill functions
  const addBill = () => {
    if (newBill.name && newBill.amount && newBill.dueDate && newBill.category) {
      const bill: Bill = {
        id: Date.now().toString(),
        name: newBill.name,
        amount: Number.parseFloat(newBill.amount),
        dueDate: newBill.dueDate,
        category: newBill.category,
        status: "pending",
        recurring: newBill.recurring,
      }

      setUserData((prev) => ({
        ...prev,
        bills: [...prev.bills, bill],
      }))

      setNewBill({ name: "", amount: "", dueDate: "", category: "", recurring: false })
      toast({
        title: "Bill Added",
        description: `Bill "${bill.name}" added successfully.`,
      })
    }
  }

  const payBill = (id: string) => {
    const bill = userData.bills.find((b) => b.id === id)
    if (bill) {
      // Mark bill as paid
      setUserData((prev) => ({
        ...prev,
        bills: prev.bills.map((b) => (b.id === id ? { ...b, status: "paid" as const } : b)),
      }))

      // Add transaction for bill payment
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: bill.amount,
        category: bill.category,
        description: `Payment for ${bill.name}`,
        date: new Date().toISOString().split("T")[0],
        type: "expense",
        merchant: bill.name,
        tags: ["bill", "payment"],
        recurring: false,
      }

      setUserData((prev) => ({
        ...prev,
        transactions: [transaction, ...prev.transactions],
      }))

      toast({
        title: "Bill Paid",
        description: `${bill.name} has been marked as paid.`,
      })
    }
  }

  const deleteBill = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      bills: prev.bills.filter((b) => b.id !== id),
    }))
    toast({
      title: "Bill Deleted",
      description: "Bill has been deleted successfully.",
    })
  }

  // Export data function
  const exportData = () => {
    const dataStr = JSON.stringify(userData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `money-magnet-data-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Data Exported",
      description: "Your financial data has been exported successfully.",
    })
  }

  // Calculate totals
  const totalIncome = userData.transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = userData.transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netWorth = totalIncome - totalExpenses
  const totalBudget = userData.budgets.reduce((sum, b) => sum + b.allocated, 0)
  const totalSpent = userData.budgets.reduce((sum, b) => sum + b.spent, 0)
  const portfolioValue = userData.investments.reduce((sum, inv) => sum + inv.shares * inv.currentPrice, 0)

  // Chart data
  const pieData = userData.budgets.map((budget) => ({
    name: budget.category,
    value: budget.spent,
    color: budget.color,
  }))

  const barData = userData.budgets.map((budget) => ({
    category: budget.category,
    allocated: budget.allocated,
    spent: budget.spent,
  }))

  // Filter transactions
  const filteredTransactions = userData.transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filters.category === "all" || transaction.category === filters.category
    const matchesType = filters.type === "all" || transaction.type === filters.type
    return matchesSearch && matchesCategory && matchesType
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Loading Dashboard</h2>
          <p className="text-gray-400">Preparing your financial insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-yellow-500/20 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-2xl font-bold text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                MONEY MAGNET 💵
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-yellow-400" />
                <Switch
                  checked={userData.settings.darkMode}
                  onCheckedChange={(checked) =>
                    setUserData((prev) => ({ ...prev, settings: { ...prev.settings, darkMode: checked } }))
                  }
                />
                <Moon className="h-4 w-4 text-yellow-400" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-400 hover:bg-yellow-400/10 relative"
                onClick={() =>
                  setUserData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, notifications: !prev.settings.notifications },
                  }))
                }
              >
                <Bell className="h-5 w-5" />
                {userData.settings.notifications && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-400 hover:bg-yellow-400/10"
                onClick={exportData}
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">Financial Dashboard</h1>
              <p className="text-gray-400">Welcome back! Here's your financial overview for today.</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                <TrendingUp className="mr-1 h-3 w-3" />
                Net Worth: ${netWorth.toLocaleString()}
              </Badge>
              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                <Target className="mr-1 h-3 w-3" />
                {userData.goals.length} Goals Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium flex items-center">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    Total Income
                  </p>
                  <p className="text-3xl font-bold text-white">${totalIncome.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-yellow-500/20 rounded-full">
                  <ArrowUpRight className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/30 to-gray-800/30 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium flex items-center">
                    <TrendingDown className="mr-1 h-4 w-4" />
                    Total Expenses
                  </p>
                  <p className="text-3xl font-bold text-white">${totalExpenses.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-yellow-500/20 rounded-full">
                  <ArrowDownRight className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium flex items-center">
                    <Wallet className="mr-1 h-4 w-4" />
                    Net Worth
                  </p>
                  <p className="text-3xl font-bold text-white">${netWorth.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-yellow-500/20 rounded-full">
                  <Wallet className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium flex items-center">
                    <Target className="mr-1 h-4 w-4" />
                    Budget Used
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                  </p>
                </div>
                <div className="p-4 bg-yellow-500/20 rounded-full">
                  <Target className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
              <Progress value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} className="mt-4 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: Plus, label: "Add Transaction", action: "transaction" },
              { icon: Target, label: "New Goal", action: "goal" },
              { icon: BarChart3, label: "New Budget", action: "budget" },
              { icon: TrendingUp, label: "Add Investment", action: "investment" },
              { icon: CreditCard, label: "Add Bill", action: "bill" },
              { icon: Download, label: "Export Data", action: "export" },
            ].map((action, index) => (
              <Dialog key={action.label}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/30 h-20 flex-col space-y-2 transition-all duration-300 hover:scale-105"
                    onClick={action.action === "export" ? exportData : undefined}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                </DialogTrigger>
                {action.action !== "export" && (
                  <DialogContent className="bg-gray-900 border-yellow-500/20 max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-yellow-400">
                        {action.action === "transaction" && "Add New Transaction"}
                        {action.action === "goal" && "Create New Goal"}
                        {action.action === "budget" && "Create New Budget"}
                        {action.action === "investment" && "Add Investment"}
                        {action.action === "bill" && "Add New Bill"}
                      </DialogTitle>
                    </DialogHeader>

                    {/* Transaction Form */}
                    {action.action === "transaction" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="type" className="text-white">
                              Type
                            </Label>
                            <Select
                              value={newTransaction.type}
                              onValueChange={(value: "income" | "expense") =>
                                setNewTransaction({ ...newTransaction, type: value })
                              }
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="amount" className="text-white">
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="0.00"
                              value={newTransaction.amount}
                              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="category" className="text-white">
                            Category
                          </Label>
                          <Input
                            id="category"
                            placeholder="e.g., Groceries, Salary"
                            value={newTransaction.category}
                            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-white">
                            Description
                          </Label>
                          <Input
                            id="description"
                            placeholder="Transaction description"
                            value={newTransaction.description}
                            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="merchant" className="text-white">
                            Merchant (Optional)
                          </Label>
                          <Input
                            id="merchant"
                            placeholder="Store or company name"
                            value={newTransaction.merchant}
                            onChange={(e) => setNewTransaction({ ...newTransaction, merchant: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <Button
                          onClick={addTransaction}
                          className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                        >
                          Add Transaction
                        </Button>
                      </div>
                    )}

                    {/* Goal Form */}
                    {action.action === "goal" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="goalName" className="text-white">
                            Goal Name
                          </Label>
                          <Input
                            id="goalName"
                            placeholder="e.g., Emergency Fund"
                            value={newGoal.name}
                            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="target" className="text-white">
                              Target Amount
                            </Label>
                            <Input
                              id="target"
                              type="number"
                              placeholder="10000"
                              value={newGoal.target}
                              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="deadline" className="text-white">
                              Target Date
                            </Label>
                            <Input
                              id="deadline"
                              type="date"
                              value={newGoal.deadline}
                              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="goalCategory" className="text-white">
                            Category
                          </Label>
                          <Input
                            id="goalCategory"
                            placeholder="e.g., Savings, Travel"
                            value={newGoal.category}
                            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="goalDescription" className="text-white">
                            Description (Optional)
                          </Label>
                          <Textarea
                            id="goalDescription"
                            placeholder="Describe your goal..."
                            value={newGoal.description}
                            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <Button onClick={addGoal} className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                          Create Goal
                        </Button>
                      </div>
                    )}

                    {/* Budget Form */}
                    {action.action === "budget" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="budgetCategory" className="text-white">
                            Category
                          </Label>
                          <Input
                            id="budgetCategory"
                            placeholder="e.g., Dining Out"
                            value={newBudget.category}
                            onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="budgetAmount" className="text-white">
                            Monthly Budget
                          </Label>
                          <Input
                            id="budgetAmount"
                            type="number"
                            placeholder="500"
                            value={newBudget.allocated}
                            onChange={(e) => setNewBudget({ ...newBudget, allocated: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <Button onClick={addBudget} className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                          Create Budget
                        </Button>
                      </div>
                    )}

                    {/* Investment Form */}
                    {action.action === "investment" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="symbol" className="text-white">
                            Symbol
                          </Label>
                          <Input
                            id="symbol"
                            placeholder="e.g., AAPL"
                            value={newInvestment.symbol}
                            onChange={(e) => setNewInvestment({ ...newInvestment, symbol: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="investmentName" className="text-white">
                            Company Name
                          </Label>
                          <Input
                            id="investmentName"
                            placeholder="e.g., Apple Inc."
                            value={newInvestment.name}
                            onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="shares" className="text-white">
                              Shares
                            </Label>
                            <Input
                              id="shares"
                              type="number"
                              placeholder="10"
                              value={newInvestment.shares}
                              onChange={(e) => setNewInvestment({ ...newInvestment, shares: e.target.value })}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="purchasePrice" className="text-white">
                              Purchase Price
                            </Label>
                            <Input
                              id="purchasePrice"
                              type="number"
                              placeholder="150.00"
                              value={newInvestment.purchasePrice}
                              onChange={(e) => setNewInvestment({ ...newInvestment, purchasePrice: e.target.value })}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                        <Button onClick={addInvestment} className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                          Add Investment
                        </Button>
                      </div>
                    )}

                    {/* Bill Form */}
                    {action.action === "bill" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="billName" className="text-white">
                            Bill Name
                          </Label>
                          <Input
                            id="billName"
                            placeholder="e.g., Electricity"
                            value={newBill.name}
                            onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billAmount" className="text-white">
                              Amount
                            </Label>
                            <Input
                              id="billAmount"
                              type="number"
                              placeholder="120.00"
                              value={newBill.amount}
                              onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billDueDate" className="text-white">
                              Due Date
                            </Label>
                            <Input
                              id="billDueDate"
                              type="date"
                              value={newBill.dueDate}
                              onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="billCategory" className="text-white">
                            Category
                          </Label>
                          <Input
                            id="billCategory"
                            placeholder="e.g., Utilities"
                            value={newBill.category}
                            onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="recurring"
                            checked={newBill.recurring}
                            onCheckedChange={(checked) => setNewBill({ ...newBill, recurring: checked })}
                          />
                          <Label htmlFor="recurring" className="text-white">
                            Recurring Bill
                          </Label>
                        </div>
                        <Button onClick={addBill} className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                          Add Bill
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                )}
              </Dialog>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-900/50 border-yellow-500/20 backdrop-blur-sm">
            {["Overview", "Transactions", "Budgets", "Goals", "Investments", "Bills"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition-all duration-300"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Spending Breakdown */}
              <Card className="bg-gray-900/50 border-yellow-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Spending Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pieData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any) => [`$${value}`, "Amount"]}
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No spending data available</p>
                        <p className="text-sm">Add some transactions to see your breakdown</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-gray-900/50 border-yellow-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Recent Transactions
                    </div>
                    <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-yellow-400/10">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.transactions.slice(0, 5).map((transaction, index) => {
                      const Icon = categoryIcons[transaction.category] || DollarSign
                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-full ${transaction.type === "income" ? "bg-yellow-500/20" : "bg-gray-500/20"}`}
                            >
                              <Icon
                                className={`h-4 w-4 ${transaction.type === "income" ? "text-yellow-400" : "text-gray-400"}`}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-white">{transaction.description}</p>
                              <p className="text-sm text-gray-400">
                                {transaction.merchant} • {transaction.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-bold ${transaction.type === "income" ? "text-yellow-400" : "text-white"}`}
                            >
                              {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {userData.transactions.length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No transactions yet</p>
                        <p className="text-sm">Add your first transaction to get started</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold text-yellow-400">Transaction History</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white w-64"
                  />
                </div>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Categories</SelectItem>
                    {Array.from(new Set(userData.transactions.map((t) => t.category))).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-gray-900/50 border-yellow-500/20 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredTransactions.map((transaction, index) => {
                    const Icon = categoryIcons[transaction.category] || DollarSign
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50 transition-colors group"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-3 rounded-full ${transaction.type === "income" ? "bg-yellow-500/20" : "bg-gray-500/20"}`}
                          >
                            <Icon
                              className={`h-5 w-5 ${transaction.type === "income" ? "text-yellow-400" : "text-gray-400"}`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white">{transaction.description}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>{transaction.category}</span>
                              {transaction.merchant && (
                                <>
                                  <span>•</span>
                                  <span>{transaction.merchant}</span>
                                </>
                              )}
                              <span>•</span>
                              <span>{transaction.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex items-center space-x-4">
                          <div>
                            <div
                              className={`font-bold text-lg ${transaction.type === "income" ? "text-yellow-400" : "text-white"}`}
                            >
                              {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {transaction.type}
                            </Badge>
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTransaction(transaction)}
                              className="text-yellow-400 hover:bg-yellow-400/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTransaction(transaction.id)}
                              className="text-red-400 hover:bg-red-400/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {filteredTransactions.length === 0 && (
                    <div className="text-center text-gray-400 py-16">
                      <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-400">Budget Management</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.budgets.map((budget, index) => {
                const Icon = budget.icon
                const percentage = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0
                const isOverBudget = percentage > 100

                return (
                  <Card
                    key={budget.id}
                    className="bg-gray-900/50 border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 group backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 rounded-full bg-yellow-400/20">
                            <Icon className="h-6 w-6 text-yellow-400" />
                          </div>
                          <h3 className="font-semibold text-white">{budget.category}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={isOverBudget ? "destructive" : "secondary"}>{Math.round(percentage)}%</Badge>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingBudget(budget)}
                              className="text-yellow-400 hover:bg-yellow-400/10"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBudget(budget.id)}
                              className="text-red-400 hover:bg-red-400/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Spent</span>
                          <span className="text-white font-medium">${budget.spent}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Budget</span>
                          <span className="text-white font-medium">${budget.allocated}</span>
                        </div>

                        <Progress value={Math.min(percentage, 100)} className="h-3" />

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Remaining</span>
                          <span className={`font-medium ${isOverBudget ? "text-red-400" : "text-yellow-400"}`}>
                            ${isOverBudget ? 0 : budget.allocated - budget.spent}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {userData.budgets.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-16">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No budgets created yet</p>
                  <p className="text-sm">Create your first budget to start tracking spending</p>
                </div>
              )}
            </div>

            {/* Budget Chart */}
            {userData.budgets.length > 0 && (
              <Card className="bg-gray-900/50 border-yellow-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Budget Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="category" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="allocated" fill="#facc15" name="Budget" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="spent" fill="#6b7280" name="Spent" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-400">Financial Goals</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.goals.map((goal, index) => {
                const percentage = goal.target > 0 ? (goal.current / goal.target) * 100 : 0
                const remaining = goal.target - goal.current
                const daysLeft = Math.ceil(
                  (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )

                return (
                  <Card
                    key={goal.id}
                    className="bg-gray-900/50 border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 group backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{goal.name}</h3>
                          <p className="text-sm text-gray-400">{goal.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              goal.priority === "high"
                                ? "destructive"
                                : goal.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {goal.priority}
                          </Badge>
                          <Badge className="bg-yellow-400/20 text-yellow-400">{Math.round(percentage)}%</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGoal(goal.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {goal.description && <p className="text-sm text-gray-400 mb-4">{goal.description}</p>}

                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Current</span>
                          <span className="text-white font-medium">${goal.current.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Target</span>
                          <span className="text-white font-medium">${goal.target.toLocaleString()}</span>
                        </div>

                        <div className="relative">
                          <Progress value={percentage} className="h-4" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{Math.round(percentage)}%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400 block">Remaining</span>
                            <span className="text-yellow-400 font-medium">${remaining.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Days Left</span>
                            <span
                              className={`font-medium ${daysLeft < 30 ? "text-red-400" : daysLeft < 90 ? "text-yellow-400" : "text-green-400"}`}
                            >
                              {daysLeft > 0 ? daysLeft : "Overdue"}
                            </span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-400 block mb-1">Deadline</span>
                          <span className="text-white">{new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 transition-transform"
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Add Money
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-yellow-500/20 max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-yellow-400">Contribute to Goal</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-white">Amount to Contribute</Label>
                                <Input
                                  type="number"
                                  placeholder="100.00"
                                  value={goalContribution.goalId === goal.id ? goalContribution.amount : ""}
                                  onChange={(e) => setGoalContribution({ goalId: goal.id, amount: e.target.value })}
                                  className="bg-gray-800 border-gray-700 text-white"
                                />
                              </div>
                              <Button
                                onClick={contributeToGoal}
                                className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                              >
                                Contribute
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {userData.goals.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-16">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No goals created yet</p>
                  <p className="text-sm">Create your first financial goal to start saving</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-400">Investment Portfolio</h2>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white">${portfolioValue.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.investments.map((investment, index) => (
                <Card
                  key={investment.id}
                  className="bg-gray-900/50 border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 group backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{investment.symbol}</h3>
                        <p className="text-sm text-gray-400">{investment.name}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteInvestment(investment.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Shares</span>
                        <span className="text-white font-medium">{investment.shares}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current Price</span>
                        <span className="text-white font-medium">${investment.currentPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Value</span>
                        <span className="text-yellow-400 font-medium">
                          ${(investment.shares * investment.currentPrice).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Purchase Price</span>
                        <span className="text-white font-medium">${investment.purchasePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Gain/Loss</span>
                        <span
                          className={`font-medium ${
                            investment.currentPrice >= investment.purchasePrice ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          ${((investment.currentPrice - investment.purchasePrice) * investment.shares).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {userData.investments.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-16">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No investments added yet</p>
                  <p className="text-sm">Add your first investment to start tracking your portfolio</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-400">Bill Management</h2>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 mb-6">
              {[
                {
                  label: "Total Monthly Bills",
                  value: userData.bills.reduce((sum, bill) => sum + bill.amount, 0),
                  icon: CreditCard,
                },
                {
                  label: "Paid This Month",
                  value: userData.bills
                    .filter((bill) => bill.status === "paid")
                    .reduce((sum, bill) => sum + bill.amount, 0),
                  icon: CheckCircle,
                },
                {
                  label: "Pending",
                  value: userData.bills
                    .filter((bill) => bill.status === "pending")
                    .reduce((sum, bill) => sum + bill.amount, 0),
                  icon: Clock,
                },
                {
                  label: "Overdue",
                  value: userData.bills
                    .filter((bill) => bill.status === "overdue")
                    .reduce((sum, bill) => sum + bill.amount, 0),
                  icon: AlertTriangle,
                },
              ].map((stat, index) => (
                <Card key={stat.label} className="bg-gray-900/50 border-yellow-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-yellow-400">${stat.value}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gray-900/50 border-yellow-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-yellow-400">Upcoming Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.bills.map((bill, index) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors group"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-full ${
                            bill.status === "paid"
                              ? "bg-green-500/20"
                              : bill.status === "overdue"
                                ? "bg-red-500/20"
                                : "bg-yellow-500/20"
                          }`}
                        >
                          <CreditCard
                            className={`h-5 w-5 ${
                              bill.status === "paid"
                                ? "text-green-400"
                                : bill.status === "overdue"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{bill.name}</p>
                          <p className="text-sm text-gray-400">Due {bill.dueDate}</p>
                          <p className="text-xs text-gray-500">{bill.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-white">${bill.amount}</p>
                          <Badge
                            variant={
                              bill.status === "paid"
                                ? "default"
                                : bill.status === "overdue"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {bill.status}
                          </Badge>
                          {bill.recurring && (
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <RefreshCw className="mr-1 h-2 w-2" />
                              Recurring
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {bill.status !== "paid" && (
                            <Button
                              size="sm"
                              onClick={() => payBill(bill.id)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Pay Now
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBill(bill.id)}
                            className="text-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {userData.bills.length === 0 && (
                    <div className="text-center text-gray-400 py-16">
                      <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No bills added yet</p>
                      <p className="text-sm">Add your first bill to start tracking payments</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Transaction Dialog */}
        {editingTransaction && (
          <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
            <DialogContent className="bg-gray-900 border-yellow-500/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-yellow-400">Edit Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Type</Label>
                    <Select
                      value={editingTransaction.type}
                      onValueChange={(value: "income" | "expense") =>
                        setEditingTransaction({ ...editingTransaction, type: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Amount</Label>
                    <Input
                      type="number"
                      value={editingTransaction.amount}
                      onChange={(e) =>
                        setEditingTransaction({ ...editingTransaction, amount: Number.parseFloat(e.target.value) })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white">Category</Label>
                  <Input
                    value={editingTransaction.category}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Input
                    value={editingTransaction.description}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Merchant</Label>
                  <Input
                    value={editingTransaction.merchant || ""}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, merchant: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => updateTransaction(editingTransaction)}
                    className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingTransaction(null)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Budget Dialog */}
        {editingBudget && (
          <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
            <DialogContent className="bg-gray-900 border-yellow-500/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-yellow-400">Edit Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Category</Label>
                  <Input
                    value={editingBudget.category}
                    onChange={(e) => setEditingBudget({ ...editingBudget, category: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Monthly Budget</Label>
                  <Input
                    type="number"
                    value={editingBudget.allocated}
                    onChange={(e) =>
                      setEditingBudget({ ...editingBudget, allocated: Number.parseFloat(e.target.value) })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => updateBudget(editingBudget)}
                    className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingBudget(null)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

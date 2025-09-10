import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { AnalyticsTracker } from "../AnalyticsTracker";
import { 
  Calculator, 
  TrendingUp, 
  Banknote, 
  Home, 
  PieChart,
  FileText,
  Info,
  Download,
  Share
} from "lucide-react";

export function CalculatorPage() {
  // Mortgage Calculator State
  const [mortgageData, setMortgageData] = useState({
    propertyPrice: 2000000,
    deposit: 400000,
    interestRate: 10.5,
    loanTerm: 20
  });

  // Affordability Calculator State
  const [affordabilityData, setAffordabilityData] = useState({
    monthlyIncome: 35000,
    monthlyExpenses: 15000,
    existingDebt: 5000,
    interestRate: 10.5,
    loanTerm: 20
  });

  // Bond Calculator State
  const [bondData, setBondData] = useState({
    loanAmount: 1600000,
    interestRate: 10.5,
    loanTerm: 20,
    extraPayment: 0
  });

  // Calculate monthly mortgage payment
  const calculateMortgagePayment = () => {
    const loanAmount = mortgageData.propertyPrice - mortgageData.deposit;
    const monthlyRate = mortgageData.interestRate / 100 / 12;
    const numberOfPayments = mortgageData.loanTerm * 12;
    
    if (monthlyRate === 0) return loanAmount / numberOfPayments;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  // Calculate affordability
  const calculateAffordability = () => {
    const availableIncome = affordabilityData.monthlyIncome - affordabilityData.monthlyExpenses - affordabilityData.existingDebt;
    const maxMonthlyPayment = availableIncome * 0.3; // 30% of available income
    
    const monthlyRate = affordabilityData.interestRate / 100 / 12;
    const numberOfPayments = affordabilityData.loanTerm * 12;
    
    if (monthlyRate === 0) return maxMonthlyPayment * numberOfPayments;
    
    const maxLoanAmount = maxMonthlyPayment * 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    
    return {
      maxLoanAmount,
      maxMonthlyPayment,
      availableIncome
    };
  };

  // Calculate bond details
  const calculateBondDetails = () => {
    const monthlyRate = bondData.interestRate / 100 / 12;
    const numberOfPayments = bondData.loanTerm * 12;
    
    const baseMonthlyPayment = bondData.loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalWithExtra = baseMonthlyPayment + bondData.extraPayment;
    const totalInterest = (baseMonthlyPayment * numberOfPayments) - bondData.loanAmount;
    
    return {
      baseMonthlyPayment,
      totalWithExtra,
      totalInterest,
      totalPayment: baseMonthlyPayment * numberOfPayments
    };
  };

  const mortgagePayment = calculateMortgagePayment();
  const affordability = calculateAffordability();
  const bondDetails = calculateBondDetails();

  return (
    <div>
      <AnalyticsTracker page="calculator" title="Property Finance Calculators - Rainbow Properties" />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Property Finance Calculators</h1>
            <p className="text-xl opacity-90 mb-8">
              Use our comprehensive calculators to plan your property purchase, understand mortgage payments, 
              and determine your buying power in the South African market.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Calculator className="w-5 h-5 mr-2" />
                Start Calculating
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                <FileText className="w-5 h-5 mr-2" />
                Download Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="mortgage" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="mortgage" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Mortgage Calculator
              </TabsTrigger>
              <TabsTrigger value="affordability" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Affordability Calculator
              </TabsTrigger>
              <TabsTrigger value="bond" className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Bond Calculator
              </TabsTrigger>
            </TabsList>

            {/* Mortgage Calculator */}
            <TabsContent value="mortgage">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-blue-600" />
                      Mortgage Payment Calculator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Property Price</label>
                      <Input
                        type="number"
                        value={mortgageData.propertyPrice}
                        onChange={(e) => setMortgageData({...mortgageData, propertyPrice: Number(e.target.value)})}
                        placeholder="R 2,000,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Deposit Amount</label>
                      <Input
                        type="number"
                        value={mortgageData.deposit}
                        onChange={(e) => setMortgageData({...mortgageData, deposit: Number(e.target.value)})}
                        placeholder="R 400,000"
                      />
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">
                          {((mortgageData.deposit / mortgageData.propertyPrice) * 100).toFixed(1)}% of property price
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                      <div className="space-y-2">
                        <Slider
                          value={[mortgageData.interestRate]}
                          onValueChange={(value) => setMortgageData({...mortgageData, interestRate: value[0]})}
                          max={20}
                          min={5}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>5%</span>
                          <span className="font-medium">{mortgageData.interestRate.toFixed(1)}%</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Loan Term (Years)</label>
                      <Select 
                        value={mortgageData.loanTerm.toString()} 
                        onValueChange={(value) => setMortgageData({...mortgageData, loanTerm: Number(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 years</SelectItem>
                          <SelectItem value="15">15 years</SelectItem>
                          <SelectItem value="20">20 years</SelectItem>
                          <SelectItem value="25">25 years</SelectItem>
                          <SelectItem value="30">30 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Payment Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        R {mortgagePayment.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                      </div>
                      <p className="text-gray-600">Monthly Payment</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600">
                          R {(mortgageData.propertyPrice - mortgageData.deposit).toLocaleString('en-ZA')}
                        </div>
                        <p className="text-sm text-gray-600">Loan Amount</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-lg font-semibold text-orange-600">
                          R {(mortgagePayment * mortgageData.loanTerm * 12 - (mortgageData.propertyPrice - mortgageData.deposit)).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-sm text-gray-600">Total Interest</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Principal & Interest:</span>
                        <span className="font-medium">R {mortgagePayment.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Property Insurance (est.):</span>
                        <span className="font-medium">R {Math.round(mortgageData.propertyPrice * 0.001).toLocaleString('en-ZA')}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total Monthly Cost:</span>
                        <span className="font-bold text-lg">
                          R {(mortgagePayment + mortgageData.propertyPrice * 0.001).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share className="w-4 h-4 mr-2" />
                        Share Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Affordability Calculator */}
            <TabsContent value="affordability">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      How Much Can You Afford?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Monthly Gross Income</label>
                      <Input
                        type="number"
                        value={affordabilityData.monthlyIncome}
                        onChange={(e) => setAffordabilityData({...affordabilityData, monthlyIncome: Number(e.target.value)})}
                        placeholder="R 35,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Monthly Expenses</label>
                      <Input
                        type="number"
                        value={affordabilityData.monthlyExpenses}
                        onChange={(e) => setAffordabilityData({...affordabilityData, monthlyExpenses: Number(e.target.value)})}
                        placeholder="R 15,000"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Include utilities, food, transport, insurance, etc.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Existing Debt Payments</label>
                      <Input
                        type="number"
                        value={affordabilityData.existingDebt}
                        onChange={(e) => setAffordabilityData({...affordabilityData, existingDebt: Number(e.target.value)})}
                        placeholder="R 5,000"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Car loans, credit cards, personal loans, etc.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Expected Interest Rate (%)</label>
                      <div className="space-y-2">
                        <Slider
                          value={[affordabilityData.interestRate]}
                          onValueChange={(value) => setAffordabilityData({...affordabilityData, interestRate: value[0]})}
                          max={20}
                          min={5}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>5%</span>
                          <span className="font-medium">{affordabilityData.interestRate.toFixed(1)}%</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Loan Term (Years)</label>
                      <Select 
                        value={affordabilityData.loanTerm.toString()} 
                        onValueChange={(value) => setAffordabilityData({...affordabilityData, loanTerm: Number(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 years</SelectItem>
                          <SelectItem value="15">15 years</SelectItem>
                          <SelectItem value="20">20 years</SelectItem>
                          <SelectItem value="25">25 years</SelectItem>
                          <SelectItem value="30">30 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Buying Power</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        R {affordability.maxLoanAmount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                      </div>
                      <p className="text-gray-600">Maximum Loan Amount</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600 mb-1">
                          R {affordability.availableIncome.toLocaleString('en-ZA')}
                        </div>
                        <p className="text-sm text-gray-600">Available Monthly Income</p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600 mb-1">
                          R {affordability.maxMonthlyPayment.toLocaleString('en-ZA')}
                        </div>
                        <p className="text-sm text-gray-600">Maximum Monthly Payment (30% rule)</p>
                      </div>
                    </div>

                    <div className="space-y-3 border-t pt-4">
                      <h4 className="font-semibold mb-2">Property Price Ranges</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">With 10% deposit:</span>
                          <Badge variant="secondary">
                            R {(affordability.maxLoanAmount / 0.9).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">With 20% deposit:</span>
                          <Badge variant="secondary">
                            R {(affordability.maxLoanAmount / 0.8).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">With 30% deposit:</span>
                          <Badge variant="secondary">
                            R {(affordability.maxLoanAmount / 0.7).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">Pre-qualification recommended</p>
                          <p>Get pre-qualified with a bank to confirm your actual borrowing capacity.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bond Calculator */}
            <TabsContent value="bond">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-600" />
                      Bond Payment Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Loan Amount</label>
                      <Input
                        type="number"
                        value={bondData.loanAmount}
                        onChange={(e) => setBondData({...bondData, loanAmount: Number(e.target.value)})}
                        placeholder="R 1,600,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                      <div className="space-y-2">
                        <Slider
                          value={[bondData.interestRate]}
                          onValueChange={(value) => setBondData({...bondData, interestRate: value[0]})}
                          max={20}
                          min={5}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>5%</span>
                          <span className="font-medium">{bondData.interestRate.toFixed(1)}%</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Loan Term (Years)</label>
                      <Select 
                        value={bondData.loanTerm.toString()} 
                        onValueChange={(value) => setBondData({...bondData, loanTerm: Number(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 years</SelectItem>
                          <SelectItem value="15">15 years</SelectItem>
                          <SelectItem value="20">20 years</SelectItem>
                          <SelectItem value="25">25 years</SelectItem>
                          <SelectItem value="30">30 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Extra Monthly Payment (Optional)</label>
                      <Input
                        type="number"
                        value={bondData.extraPayment}
                        onChange={(e) => setBondData({...bondData, extraPayment: Number(e.target.value)})}
                        placeholder="R 0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Additional payment towards principal
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        R {bondDetails.baseMonthlyPayment.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                      </div>
                      <p className="text-gray-600">Base Monthly Payment</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-lg font-semibold text-purple-600">
                          R {bondDetails.totalInterest.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-sm text-gray-600">Total Interest</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600">
                          R {bondDetails.totalPayment.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-sm text-gray-600">Total Paid</p>
                      </div>
                    </div>

                    {bondData.extraPayment > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">With Extra Payments</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Monthly Payment:</span>
                            <span className="font-medium">R {bondDetails.totalWithExtra.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Interest Saved (approx.):</span>
                            <span className="font-medium text-green-600">R {(bondData.extraPayment * 50).toLocaleString('en-ZA')}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Additional Costs to Consider</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Transfer Fees:</span>
                          <span>~R 15,000 - R 25,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bond Registration:</span>
                          <span>~R 10,000 - R 15,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Initiation Fee:</span>
                          <span>~R 6,000 - R 8,000</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Helpful tools and information to support your property finance decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">First-Time Buyer Guide</h3>
                <p className="text-gray-600 mb-4">
                  Complete guide for first-time property buyers in South Africa.
                </p>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Market Trends Report</h3>
                <p className="text-gray-600 mb-4">
                  Latest property market trends and interest rate forecasts.
                </p>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  View Report
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Banknote className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Bond Application Tips</h3>
                <p className="text-gray-600 mb-4">
                  Expert tips to improve your chances of bond approval.
                </p>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Read Tips
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply for Pre-Approval?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get pre-approved for your home loan and start your property search with confidence. 
            Our finance specialists are here to help.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <FileText className="w-5 h-5 mr-2" />
              Apply for Pre-Approval
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Speak to Finance Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Send,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Client, Expense, FinancialMetrics, Invoice, AIInsight } from '../types';
import {
  generateAutomatedAIInsights,
  answerFreelanceFinancialQuery,
} from '../utils/calculations';

interface AIInsightsViewProps {
  metrics: FinancialMetrics;
  invoices: Invoice[];
  expenses: Expense[];
  clients: Client[];
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  metrics,
  invoices,
  expenses,
  clients,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: `Hello! I'm your AI Freelance Financial Analyst. I've audited your current financial metrics: Net Profit is $${metrics.netProfit.toLocaleString()} with a ${metrics.profitMarginPercent}% operating margin. Ask me anything about rate adjustments, tax reserves, cash flow, or spend optimization.`,
      time: 'Just now',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  const insights = generateAutomatedAIInsights(metrics, invoices, expenses, clients);

  const quickPrompts = [
    'How can I improve my profit margin?',
    'Should I raise my freelance rates?',
    'How much should I set aside for taxes?',
    'What is my biggest financial risk right now?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuestion;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiResponse = answerFreelanceFinancialQuery(
      query,
      metrics,
      invoices,
      expenses,
      clients
    );

    const botMsg = {
      sender: 'ai' as const,
      text: aiResponse,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    setInputQuestion('');
  };

  const handleRefreshAudit = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* AI Analyst Header Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
              <Sparkles className="h-6 w-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  AI Financial Analyst & Advisory
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                  Live Model
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Dynamic automated financial intelligence synthesized from your live ledgers
              </p>
            </div>
          </div>

          <button
            id="re-run-ai-audit-btn"
            onClick={handleRefreshAudit}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Analyzing Data...' : 'Re-Run Financial Audit'}</span>
          </button>
        </div>

        {/* Live Metrics Pill Bar */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-slate-800/80 pt-4 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Operating Margin</div>
            <div className="font-bold text-emerald-400 text-sm">{metrics.profitMarginPercent}%</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Net Earnings</div>
            <div className="font-bold text-white text-sm">${metrics.netProfit.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Quarterly Tax Due</div>
            <div className="font-bold text-blue-400 text-sm">${metrics.taxReserveAmount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Overdue Receivables</div>
            <div className={`font-bold text-sm ${metrics.overdueRevenue > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              ${metrics.overdueRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Automated Text Insights Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            Automated Strategic Insights
          </h4>
          <span className="text-xs text-slate-500">
            {insights.length} dynamic observations
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {insights.map((insight) => {
            const isWarning = insight.type === 'warning';
            const isOpportunity = insight.type === 'opportunity';
            const isMetric = insight.type === 'metric';

            return (
              <div
                key={insight.id}
                className={`rounded-xl border p-5 transition flex flex-col justify-between ${
                  isWarning
                    ? 'border-rose-200 bg-rose-50/40'
                    : isOpportunity
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-slate-200 bg-white'
                } shadow-xs hover:border-slate-300`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isWarning
                            ? 'bg-rose-100 text-rose-700'
                            : isOpportunity
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {isWarning ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : isOpportunity ? (
                          <Lightbulb className="h-4 w-4" />
                        ) : (
                          <TrendingUp className="h-4 w-4" />
                        )}
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{insight.title}</h5>
                    </div>

                    {insight.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isWarning
                            ? 'bg-rose-100 text-rose-800'
                            : isOpportunity
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {insight.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-700">
                    {insight.content}
                  </p>
                </div>

                {insight.actionableStep && (
                  <div className="mt-4 rounded-lg bg-white/80 p-3 text-xs border border-slate-200/80">
                    <div className="flex items-start gap-1.5 text-slate-800">
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">
                          Recommended Action:
                        </span>{' '}
                        <span className="text-slate-600">{insight.actionableStep}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive AI Financial Consultation Console */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-emerald-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Ask Financial Analyst
              </h4>
              <p className="text-xs text-slate-500">
                Interactive real-time consultation grounded in your actual revenues & costs
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Active Context Loaded
          </span>
        </div>

        {/* Quick Suggested Prompts */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 ${
                    msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white text-xs font-bold mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            placeholder="Ask anything about your profit, taxes, pricing, or client retention..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

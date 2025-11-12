"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EXECUTION_TABS, ExecutionTab, DOC_TYPES, DOCUMENT_TYPES, TOAST_MESSAGES, THRESHOLDS } from "../constants"
import { Package, Box, FileText, CheckSquare, DollarSign, Activity, Download, AlertTriangle } from "lucide-react"
import { formatMoney } from "../utils/format"
import { getExecutionData } from "../actions/getExecutionData"
import { generateDocument } from "../actions/generateDocument"
import { listDocuments } from "../actions/listDocuments"
import { upsertCostAction } from "../actions/upsertCost"
import { resolveException } from "../actions/resolveException"
import type { SupabaseQuote, SupabaseBooking, SupabaseDocument, SupabaseTask, SupabaseCost, SupabaseAuditLog, SupabaseException, DocumentType } from "../types"

interface ExecutionConsoleProps {
  shipmentId?: string
  onClose?: () => void
}

export function ExecutionConsole({ shipmentId, onClose }: ExecutionConsoleProps) {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<ExecutionTab>(EXECUTION_TABS.CONTAINERIZATION)
  const [quotes, setQuotes] = useState<SupabaseQuote[]>([])
  const [booking, setBooking] = useState<SupabaseBooking | null>(null)
  const [documents, setDocuments] = useState<SupabaseDocument[]>([])
  const [tasks, setTasks] = useState<SupabaseTask[]>([])
  const [costs, setCosts] = useState<SupabaseCost[]>([])
  const [exceptions, setExceptions] = useState<SupabaseException[]>([])
  const [auditLogs, setAuditLogs] = useState<SupabaseAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  
  // Docs tab state
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(DOCUMENT_TYPES.ASN)
  const [isGenerating, setIsGenerating] = useState<Record<DocumentType, boolean>>({
    [DOCUMENT_TYPES.ASN]: false,
    [DOCUMENT_TYPES.CI]: false,
    [DOCUMENT_TYPES.PL]: false,
  })
  const [documentsWithUrls, setDocumentsWithUrls] = useState<Array<SupabaseDocument & { downloadUrl?: string | null }>>([])
  
  // Costs tab state
  const [costTotals, setCostTotals] = useState({ planned: 0, actual: 0, variance: 0 })
  const [varianceException, setVarianceException] = useState<SupabaseException | null>(null)
  const [editingCosts, setEditingCosts] = useState<Record<string, { planned?: number; actual?: number }>>({})
  const [savingCosts, setSavingCosts] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadData = async () => {
      if (!shipmentId) {
        setLoading(false)
        return
      }

      try {
        const data = await getExecutionData(shipmentId)
        setQuotes(data.quotes)
        setBooking(data.booking)
        setDocuments(data.documents)
        setTasks(data.tasks)
        setCosts(data.costs)
        setExceptions(data.exceptions || [])
        setAuditLogs(data.auditLogs)
        
        // Load documents with URLs
        if (user?.id) {
          try {
            const docsResult = await listDocuments({ shipmentId, ownerUserId: user.id })
            setDocumentsWithUrls(docsResult.documents)
          } catch (error) {
            console.error('[ExecutionConsole] Failed to load documents with URLs:', error)
            setDocumentsWithUrls(data.documents.map(d => ({ ...d, downloadUrl: null })))
          }
        }
        
        // Calculate cost totals
        const planned = data.costs.reduce((sum, c) => sum + (Number(c.planned_amount) || 0), 0)
        const actual = data.costs.reduce((sum, c) => sum + (Number(c.actual_amount) || 0), 0)
        const variance = planned > 0 ? ((actual - planned) / planned) * 100 : 0
        setCostTotals({ planned, actual, variance })
        
        // Find variance exception
        const varianceExc = (data.exceptions || []).find(e => e.exception_type === 'cost_variance' && !e.resolved_at)
        setVarianceException(varianceExc || null)
      } catch (error) {
        console.error('[ExecutionConsole] Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [shipmentId, user?.id])
  
  const handleGenerateDocument = async () => {
    if (!shipmentId || !user?.id) {
      toast.error("Please sign in to generate documents")
      return
    }
    
    setIsGenerating(prev => ({ ...prev, [selectedDocType]: true }))
    const toastId = toast.loading(`Generating ${selectedDocType}...`)
    
    try {
      const result = await generateDocument({
        shipmentId,
        documentType: selectedDocType,
        ownerUserId: user.id,
      })
      
      toast.success(`${selectedDocType} generated v${result.version}`, { id: toastId })
      
      // Refresh documents
      const docsResult = await listDocuments({ shipmentId, ownerUserId: user.id })
      setDocumentsWithUrls(docsResult.documents)
      setDocuments(docsResult.documents)
      
      // Refresh execution data
      const data = await getExecutionData(shipmentId)
      setDocuments(data.documents)
    } catch (error) {
      console.error('[ExecutionConsole] Failed to generate document:', error)
      toast.error(
        error instanceof Error ? error.message : TOAST_MESSAGES.DOCUMENT_ERROR,
        { id: toastId }
      )
    } finally {
      setIsGenerating(prev => ({ ...prev, [selectedDocType]: false }))
    }
  }
  
  const handleSaveCost = async (costId: string) => {
    if (!shipmentId || !user?.id) {
      toast.error("Please sign in to save costs")
      return
    }
    
    const editData = editingCosts[costId]
    if (!editData) return
    
    const cost = costs.find(c => c.id === costId)
    if (!cost) return
    
    setSavingCosts(prev => ({ ...prev, [costId]: true }))
    const toastId = toast.loading("Saving cost...")
    
    try {
      const result = await upsertCostAction({
        shipmentId,
        cost: {
          id: costId,
          costType: cost.cost_type || 'unknown',
          plannedAmount: editData.planned !== undefined ? editData.planned : cost.planned_amount ? Number(cost.planned_amount) : undefined,
          actualAmount: editData.actual !== undefined ? editData.actual : cost.actual_amount ? Number(cost.actual_amount) : undefined,
          currency: cost.currency || 'USD',
        },
        ownerUserId: user.id,
      })
      
      toast.success(TOAST_MESSAGES.COST_RECORDED, { id: toastId })
      
      // Update cost totals
      setCostTotals({
        planned: result.plannedTotal,
        actual: result.actualTotal,
        variance: result.variancePct,
      })
      
      // Update variance exception
      if (result.exceptionRaised && result.exception) {
        setVarianceException(result.exception)
        if (result.exceptionRaised) {
          toast.warning(TOAST_MESSAGES.VARIANCE_FLAGGED)
        }
      } else {
        setVarianceException(null)
      }
      
      // Refresh costs
      const data = await getExecutionData(shipmentId)
      setCosts(data.costs)
      setEditingCosts(prev => {
        const next = { ...prev }
        delete next[costId]
        return next
      })
      
      // Refresh KPIs
      window.dispatchEvent(new Event('shipping-kpis-refresh'))
    } catch (error) {
      console.error('[ExecutionConsole] Failed to save cost:', error)
      toast.error(
        error instanceof Error ? error.message : TOAST_MESSAGES.COST_ERROR,
        { id: toastId }
      )
    } finally {
      setSavingCosts(prev => ({ ...prev, [costId]: false }))
    }
  }
  
  const handleResolveException = async (exceptionId: string) => {
    if (!user?.id) {
      toast.error("Please sign in to resolve exceptions")
      return
    }
    
    try {
      await resolveException({ exceptionId, ownerUserId: user.id })
      toast.success("Exception resolved")
      
      // Refresh exceptions
      const data = await getExecutionData(shipmentId)
      setExceptions(data.exceptions || [])
      setVarianceException(null)
    } catch (error) {
      console.error('[ExecutionConsole] Failed to resolve exception:', error)
      toast.error(error instanceof Error ? error.message : "Failed to resolve exception")
    }
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Execution Console</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ExecutionTab)}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value={EXECUTION_TABS.CONTAINERIZATION}>
              <Package className="w-4 h-4 mr-1" />
              Containers
            </TabsTrigger>
            <TabsTrigger value={EXECUTION_TABS.ALLOCATION}>
              <Box className="w-4 h-4 mr-1" />
              Allocation
            </TabsTrigger>
            <TabsTrigger value={EXECUTION_TABS.BOOKINGS_RFQ}>
              RFQ
            </TabsTrigger>
            <TabsTrigger value={EXECUTION_TABS.DOCS}>
              <FileText className="w-4 h-4 mr-1" />
              Docs
            </TabsTrigger>
            <TabsTrigger value={EXECUTION_TABS.TASKS}>
              <CheckSquare className="w-4 h-4 mr-1" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value={EXECUTION_TABS.COSTS}>
              <DollarSign className="w-4 h-4 mr-1" />
              Costs
            </TabsTrigger>
            <TabsTrigger value={EXECUTION_TABS.ACTIVITY}>
              <Activity className="w-4 h-4 mr-1" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value={EXECUTION_TABS.CONTAINERIZATION} className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Container utilization view (MVP - read-only)</p>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-white text-sm">No containers assigned yet</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value={EXECUTION_TABS.ALLOCATION} className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Inventory allocation and reservation</p>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-white text-sm">No allocations yet</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value={EXECUTION_TABS.BOOKINGS_RFQ} className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">RFQs and quotes</p>
                <Button size="sm">Create RFQ</Button>
              </div>
              {loading ? (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-white text-sm">Loading...</p>
                </div>
              ) : quotes.length === 0 && !booking ? (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-white text-sm">No RFQs yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">Quote {quote.id.slice(0, 8)}</span>
                        <Badge variant={quote.status === 'accepted' ? 'default' : 'secondary'}>
                          {quote.status}
                        </Badge>
                      </div>
                      {quote.quoted_amount != null && (
                        <p className="text-gray-400 text-xs mt-1">
                          {formatMoney(Number(quote.quoted_amount), quote.currency ?? 'USD')}
                        </p>
                      )}
                    </div>
                  ))}
                  {booking && (
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">Booking {booking.id.slice(0, 8)}</span>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value={EXECUTION_TABS.DOCS} className="mt-4">
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <div className="flex gap-1 bg-gray-800 rounded-md p-1">
                  {DOC_TYPES.map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant={selectedDocType === type ? "default" : "ghost"}
                      onClick={() => setSelectedDocType(type)}
                      className="text-xs"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
                <Button
                  size="sm"
                  onClick={handleGenerateDocument}
                  disabled={isGenerating[selectedDocType] || !shipmentId}
                >
                  {isGenerating[selectedDocType] ? "Generating..." : "Generate"}
                </Button>
              </div>
              {loading ? (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-white text-sm">Loading...</p>
                </div>
              ) : documentsWithUrls.length === 0 ? (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-white text-sm">No documents generated yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2 text-gray-400">Type</th>
                        <th className="text-left p-2 text-gray-400">Version</th>
                        <th className="text-left p-2 text-gray-400">Created At</th>
                        <th className="text-left p-2 text-gray-400">Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentsWithUrls.map((doc) => (
                        <tr key={doc.id} className="border-b border-gray-800">
                          <td className="p-2 text-white">{doc.document_type}</td>
                          <td className="p-2 text-white">v{doc.version}</td>
                          <td className="p-2 text-gray-400">
                            {doc.generated_at ? new Date(doc.generated_at).toLocaleDateString() : '-'}
                          </td>
                          <td className="p-2">
                            {doc.downloadUrl ? (
                              <a
                                href={doc.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </a>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value={EXECUTION_TABS.TASKS} className="mt-4">
            <div className="space-y-4">
              <Button size="sm">Add Task</Button>
              {loading ? (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-white text-sm">Loading...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-white text-sm">No tasks yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">{task.title || 'Untitled Task'}</span>
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value={EXECUTION_TABS.COSTS} className="mt-4">
            <div className="space-y-4">
              {/* Totals Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gray-800">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-400">Planned Total</p>
                    <p className="text-2xl font-bold text-white">{formatMoney(costTotals.planned)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-400">Actual Total</p>
                    <p className="text-2xl font-bold text-white">{formatMoney(costTotals.actual)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-400">Variance</p>
                    <Badge
                      variant={Math.abs(costTotals.variance) >= THRESHOLDS.COST_VARIANCE_PERCENT ? "destructive" : "secondary"}
                      className="text-lg"
                    >
                      {costTotals.variance >= 0 ? '+' : ''}{costTotals.variance.toFixed(1)}%
                    </Badge>
                  </CardContent>
                </Card>
              </div>
              
              {/* Variance Banner */}
              {varianceException && (
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    Variance: {costTotals.variance >= 0 ? '+' : ''}{costTotals.variance.toFixed(1)}% (planned {costTotals.planned.toFixed(2)} → actual {costTotals.actual.toFixed(2)})
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2"
                      onClick={() => {
                        toast.info("Create Task feature coming soon")
                      }}
                    >
                      Create Task
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Costs Table */}
              {loading ? (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-white text-sm">Loading...</p>
                </div>
              ) : costs.length === 0 ? (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-white text-sm">No costs recorded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2 text-gray-400">Type</th>
                        <th className="text-left p-2 text-gray-400">Planned</th>
                        <th className="text-left p-2 text-gray-400">Actual</th>
                        <th className="text-left p-2 text-gray-400">Updated</th>
                        <th className="text-left p-2 text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costs.map((cost) => {
                        const editData = editingCosts[cost.id] || {}
                        const plannedValue = editData.planned !== undefined ? editData.planned : (cost.planned_amount ? Number(cost.planned_amount) : 0)
                        const actualValue = editData.actual !== undefined ? editData.actual : (cost.actual_amount ? Number(cost.actual_amount) : 0)
                        const hasChanges = editData.planned !== undefined || editData.actual !== undefined
                        
                        return (
                          <tr key={cost.id} className="border-b border-gray-800">
                            <td className="p-2 text-white">{cost.cost_type || 'Unknown'}</td>
                            <td className="p-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={plannedValue}
                                onChange={(e) => {
                                  const val = e.target.value ? parseFloat(e.target.value) : undefined
                                  setEditingCosts(prev => ({
                                    ...prev,
                                    [cost.id]: { ...prev[cost.id], planned: val }
                                  }))
                                }}
                                className="w-24 h-8 text-xs bg-gray-900"
                                placeholder="0"
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={actualValue}
                                onChange={(e) => {
                                  const val = e.target.value ? parseFloat(e.target.value) : undefined
                                  setEditingCosts(prev => ({
                                    ...prev,
                                    [cost.id]: { ...prev[cost.id], actual: val }
                                  }))
                                }}
                                className="w-24 h-8 text-xs bg-gray-900"
                                placeholder="0"
                              />
                            </td>
                            <td className="p-2 text-gray-400 text-xs">
                              {cost.updated_at ? new Date(cost.updated_at).toLocaleDateString() : '-'}
                            </td>
                            <td className="p-2">
                              {hasChanges && (
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveCost(cost.id)}
                                  disabled={savingCosts[cost.id]}
                                  className="text-xs"
                                >
                                  {savingCosts[cost.id] ? "Saving..." : "Save"}
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value={EXECUTION_TABS.ACTIVITY} className="mt-4">
            <div className="space-y-4">
              {/* Exceptions Section */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Active Exceptions</p>
                {loading ? (
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-white text-sm">Loading...</p>
                  </div>
                ) : exceptions.length === 0 ? (
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-white text-sm">No active exceptions</p>
                  </div>
                ) : (
                  <div className="space-y-2 mb-4">
                    {exceptions.map((exc) => (
                      <div key={exc.id} className="p-3 bg-gray-800 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm">{exc.exception_type}</span>
                            <Badge variant={exc.severity === 'high' ? 'destructive' : exc.severity === 'medium' ? 'default' : 'secondary'}>
                              {exc.severity}
                            </Badge>
                          </div>
                          {exc.message && (
                            <p className="text-gray-400 text-xs mt-1">{exc.message}</p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            Detected: {new Date(exc.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveException(exc.id)}
                        >
                          Resolve
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Audit Log Section */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Audit log timeline</p>
                {loading ? (
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-white text-sm">Loading...</p>
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-white text-sm">No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">{log.action}</span>
                          <span className="text-gray-400 text-xs">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          {log.entity_type} {log.entity_id.slice(0, 8)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


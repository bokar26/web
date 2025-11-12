"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { createBrowserClient } from "@/lib/supabase/client"
import type {
  Shipment,
  SupabaseDocument,
  SupabaseCost,
  SupabaseQuote,
  SupabaseBooking,
  SupabaseTask,
  SupabaseAuditLog,
} from "../types"

export function useShipmentCore(shipmentId?: string) {
  const { user } = useUser()
  const [data, setData] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!shipmentId || !user?.id) {
      setLoading(false)
      setData(null)
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    supabase
      .from('shipments')
      .select('*')
      .eq('id', shipmentId)
      .eq('owner_user_id', user.id)
      .single()
      .then(({ data: shipment, error: err }) => {
        if (err) {
          setError(err)
          setData(null)
        } else {
          setData(shipment as Shipment)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setData(null)
        setLoading(false)
      })
  }, [shipmentId, user?.id])

  return { data, loading, error }
}

export function useShipmentDocs(shipmentId?: string) {
  const { user } = useUser()
  const [data, setData] = useState<SupabaseDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!shipmentId || !user?.id) {
      setLoading(false)
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    supabase
      .from('documents')
      .select('*')
      .eq('shipment_id', shipmentId)
      .eq('owner_user_id', user.id)
      .order('document_type', { ascending: true })
      .order('version', { ascending: false })
      .then(({ data: docs, error: err }) => {
        if (err) {
          setError(err)
          setData([])
        } else {
          setData((docs || []) as SupabaseDocument[])
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setData([])
        setLoading(false)
      })
  }, [shipmentId, user?.id])

  return { data, loading, error }
}

export function useShipmentCosts(shipmentId?: string) {
  const { user } = useUser()
  const [data, setData] = useState<SupabaseCost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!shipmentId || !user?.id) {
      setLoading(false)
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    supabase
      .from('costs')
      .select('*')
      .eq('shipment_id', shipmentId)
      .eq('owner_user_id', user.id)
      .then(({ data: costs, error: err }) => {
        if (err) {
          setError(err)
          setData([])
        } else {
          const costList = (costs || []) as SupabaseCost[]
          setData(costList)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setData([])
        setLoading(false)
      })
  }, [shipmentId, user?.id])

  // Calculate totals
  const planned = data.reduce((sum, c) => sum + (Number(c.planned_amount) || 0), 0)
  const actual = data.reduce((sum, c) => sum + (Number(c.actual_amount) || 0), 0)
  const variance = planned > 0 ? ((actual - planned) / planned) * 100 : 0

  return {
    data,
    totals: { planned, actual, variance },
    loading,
    error,
  }
}

export function useShipmentRFQs(shipmentId?: string) {
  const { user } = useUser()
  const [data, setData] = useState<SupabaseQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!shipmentId || !user?.id) {
      setLoading(false)
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    supabase
      .from('quotes')
      .select('*')
      .eq('shipment_id', shipmentId)
      .eq('owner_user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data: quotes, error: err }) => {
        if (err) {
          setError(err)
          setData([])
        } else {
          setData((quotes || []) as SupabaseQuote[])
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setData([])
        setLoading(false)
      })
  }, [shipmentId, user?.id])

  return { data, loading, error }
}

export function useShipmentBooking(shipmentId?: string) {
  const { user } = useUser()
  const [data, setData] = useState<SupabaseBooking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!shipmentId || !user?.id) {
      setLoading(false)
      setData(null)
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    supabase
      .from('bookings')
      .select('*')
      .eq('shipment_id', shipmentId)
      .eq('owner_user_id', user.id)
      .maybeSingle()
      .then(({ data: booking, error: err }) => {
        if (err) {
          setError(err)
          setData(null)
        } else {
          setData(booking as SupabaseBooking | null)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setData(null)
        setLoading(false)
      })
  }, [shipmentId, user?.id])

  return { data, loading, error }
}

export function useShipmentTasks(shipmentId?: string) {
  const { user } = useUser()
  const [data, setData] = useState<SupabaseTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!shipmentId || !user?.id) {
      setLoading(false)
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    supabase
      .from('tasks')
      .select('*')
      .eq('linked_id', shipmentId)
      .eq('linked_type', 'shipment')
      .eq('owner_user_id', user.id)
      .neq('status', 'completed')
      .order('due_date', { ascending: true })
      .then(({ data: tasks, error: err }) => {
        if (err) {
          setError(err)
          setData([])
        } else {
          setData((tasks || []) as SupabaseTask[])
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setData([])
        setLoading(false)
      })
  }, [shipmentId, user?.id])

  return { data, loading, error }
}

export function useShipmentActivity(shipmentId?: string) {
  const { user } = useUser()
  const [data, setData] = useState<SupabaseAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!shipmentId || !user?.id) {
      setLoading(false)
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_id', shipmentId)
      .eq('entity_type', 'shipment')
      .eq('owner_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data: logs, error: err }) => {
        if (err) {
          setError(err)
          setData([])
        } else {
          setData((logs || []) as SupabaseAuditLog[])
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setData([])
        setLoading(false)
      })
  }, [shipmentId, user?.id])

  return { data, loading, error }
}


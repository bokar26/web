// Analytics utility for tracking search events
import { SearchEvent, SearchEventProperties } from '@/types/search'

interface AnalyticsEvent {
  event: SearchEvent
  properties: SearchEventProperties
  timestamp: number
}

class Analytics {
  private events: AnalyticsEvent[] = []

  track(event: SearchEvent, properties: SearchEventProperties) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    }

    this.events.push(analyticsEvent)

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', {
        event,
        properties,
        timestamp: new Date(analyticsEvent.timestamp).toISOString(),
      })
    }

    // In production, you would send to your analytics service
    // Example: PostHog, Mixpanel, Google Analytics, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example PostHog integration:
      // if (typeof window !== 'undefined' && window.posthog) {
      //   window.posthog.capture(event, properties)
      // }
      
      // Example Mixpanel integration:
      // if (typeof window !== 'undefined' && window.mixpanel) {
      //   window.mixpanel.track(event, properties)
      // }
    }
  }

  // Get recent events for debugging
  getRecentEvents(limit = 10): AnalyticsEvent[] {
    return this.events.slice(-limit)
  }

  // Clear all events (useful for testing)
  clear() {
    this.events = []
  }

  // Get events by type
  getEventsByType(eventType: SearchEvent): AnalyticsEvent[] {
    return this.events.filter(event => event.event === eventType)
  }

  // Get events by entity type
  getEventsByEntityType(entityType: string): AnalyticsEvent[] {
    return this.events.filter(event => event.properties.entityType === entityType)
  }
}

// Create singleton instance
const analytics = new Analytics()

// Export convenience functions
export const track = (event: SearchEvent, properties: SearchEventProperties) => {
  analytics.track(event, properties)
}

export const trackSearchView = (entityType: SearchEventProperties['entityType']) => {
  track('search_view', { entityType })
}

export const trackSearchQuery = (
  entityType: SearchEventProperties['entityType'],
  query: string,
  resultCount: number
) => {
  track('search_query', { 
    entityType, 
    resultCount 
  })
}

export const trackFilterApply = (
  entityType: SearchEventProperties['entityType'],
  filters: SearchEventProperties['filters']
) => {
  track('filter_apply', { entityType, filters })
}

export const trackFilterClear = (entityType: SearchEventProperties['entityType']) => {
  track('filter_clear', { entityType })
}

export const trackSortChange = (
  entityType: SearchEventProperties['entityType'],
  sortBy: string
) => {
  track('sort_change', { entityType, sortBy })
}

export const trackViewToggle = (
  entityType: SearchEventProperties['entityType'],
  viewMode: SearchEventProperties['viewMode']
) => {
  track('view_toggle', { entityType, viewMode })
}

export const trackEntityOpen = (
  entityType: SearchEventProperties['entityType'],
  entityId: string
) => {
  track('entity_open', { entityType, entityId })
}

export const trackCompareClick = (
  entityType: SearchEventProperties['entityType'],
  selectedCount: number
) => {
  track('compare_click', { entityType, resultCount: selectedCount })
}

export const trackExportClick = (entityType: SearchEventProperties['entityType']) => {
  track('export_click', { entityType })
}

export const trackSavedViewSave = (
  entityType: SearchEventProperties['entityType'],
  filters: SearchEventProperties['filters']
) => {
  track('saved_view_save', { entityType, filters })
}

export const trackSavedViewLoad = (
  entityType: SearchEventProperties['entityType'],
  filters: SearchEventProperties['filters']
) => {
  track('saved_view_load', { entityType, filters })
}

// Export the analytics instance for advanced usage
export { analytics }

// Export types for TypeScript
export type { AnalyticsEvent }

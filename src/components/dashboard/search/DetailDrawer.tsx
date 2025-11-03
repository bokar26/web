"use client"

import { useState } from "react"
import { X, ExternalLink, Mail, Globe, MapPin, Calendar, Users, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Supplier, Factory, Warehouse, FreightForwarder, Carrier } from "@/types/search"

interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  entity: Supplier | Factory | Warehouse | FreightForwarder | Carrier | null
  entityType: 'supplier' | 'factory' | 'warehouse' | 'forwarder' | 'carrier'
}

export function DetailDrawer({ isOpen, onClose, entity, entityType }: DetailDrawerProps) {
  if (!entity) return null

  const getEntityIcon = () => {
    switch (entityType) {
      case 'supplier':
        return <Package className="h-5 w-5" />
      case 'factory':
        return <Users className="h-5 w-5" />
      case 'warehouse':
        return <Package className="h-5 w-5" />
      case 'forwarder':
        return <Truck className="h-5 w-5" />
      case 'carrier':
        return <Truck className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getEntityTitle = () => {
    switch (entityType) {
      case 'supplier':
        return 'Supplier Details'
      case 'factory':
        return 'Factory Details'
      case 'warehouse':
        return 'Warehouse Details'
      case 'forwarder':
        return 'Freight Forwarder Details'
      case 'carrier':
        return 'Carrier Details'
      default:
        return 'Entity Details'
    }
  }

  const renderSupplierDetails = (supplier: Supplier) => (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">On-Time Delivery</p>
            <p className="text-lg font-semibold text-green-600">{supplier.onTimePercent}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Defect Rate</p>
            <p className="text-lg font-semibold text-red-600">{(supplier.defectRate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Lead Time</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{supplier.avgLeadTimeDays} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Risk Index</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{supplier.riskIndex}/5</p>
          </div>
        </div>
      </Card>

      {/* Business Details */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Business Details</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-600 dark:text-white" />
            <span className="text-sm text-gray-900 dark:text-white">{supplier.country}, {supplier.region}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-600 dark:text-white" />
            <span className="text-sm text-gray-900 dark:text-white">MOQ: {supplier.moq.toLocaleString()} units</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600 dark:text-white" />
            <span className="text-sm text-gray-900 dark:text-white">Last Order: {supplier.lastOrderDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-600 dark:text-white" />
            <span className="text-sm text-gray-900 dark:text-white">Total Orders: {supplier.totalOrders}</span>
          </div>
        </div>
      </Card>

      {/* Certifications */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Certifications</h3>
        <div className="flex flex-wrap gap-2">
          {supplier.certifications.map((cert, index) => (
            <Badge key={index} variant="secondary">{cert}</Badge>
          ))}
        </div>
      </Card>

      {/* Specialties */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {supplier.specialties.map((specialty, index) => (
            <Badge key={index} variant="outline">{specialty}</Badge>
          ))}
        </div>
      </Card>

      {/* Contact */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Contact Information</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-600 dark:text-white" />
            <span className="text-sm text-gray-900 dark:text-white">{supplier.contactEmail}</span>
          </div>
          {supplier.website && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-600 dark:text-white" />
              <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                {supplier.website}
                <ExternalLink className="inline h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  )

  const renderFactoryDetails = (factory: Factory) => (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{factory.capacity.toLocaleString()} units/month</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Utilization</p>
            <p className="text-lg font-semibold text-blue-600">{factory.utilization}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Compliance Score</p>
            <p className="text-lg font-semibold text-green-600">{factory.complianceScore}/100</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Employees</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{factory.employeeCount}</p>
          </div>
        </div>
      </Card>

      {/* Capabilities */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Capabilities</h3>
        <div className="flex flex-wrap gap-2">
          {factory.capabilities.map((capability, index) => (
            <Badge key={index} variant="secondary">{capability}</Badge>
          ))}
        </div>
      </Card>

      {/* Additional details similar to supplier */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Business Details</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-600 dark:text-white" />
            <span className="text-sm text-gray-900 dark:text-white">{factory.country}, {factory.region}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600 dark:text-white" />
            <span className="text-sm text-gray-900 dark:text-white">Established: {factory.establishedYear}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-600 dark:text-white" />
            <span className="text-sm text-gray-900 dark:text-white">MOQ: {factory.moq.toLocaleString()} units</span>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderWarehouseDetails = (warehouse: Warehouse) => (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{warehouse.capacity.toLocaleString()} sq ft</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Utilization</p>
            <p className="text-lg font-semibold text-blue-600">{warehouse.utilization}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pick Rate</p>
            <p className="text-lg font-semibold text-green-600">{warehouse.slaPickRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pack Rate</p>
            <p className="text-lg font-semibold text-green-600">{warehouse.slaPackRate}%</p>
          </div>
        </div>
      </Card>

      {/* Services */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Services</h3>
        <div className="flex flex-wrap gap-2">
          {warehouse.services.map((service, index) => (
            <Badge key={index} variant="secondary">{service}</Badge>
          ))}
        </div>
      </Card>

      {/* Volume */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Volume</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Inbound</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{warehouse.inboundVolume.toLocaleString()} units/month</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Outbound</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{warehouse.outboundVolume.toLocaleString()} units/month</p>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderForwarderDetails = (forwarder: FreightForwarder) => (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Service Rating</p>
            <p className="text-lg font-semibold text-green-600">{forwarder.serviceRating}/5</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Quote Responsiveness</p>
            <p className="text-lg font-semibold text-blue-600">{forwarder.quoteResponsiveness}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Transit Variance</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{forwarder.avgTransitVariance} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Shipments</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{forwarder.totalShipments.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Lanes */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Lanes Served</h3>
        <div className="space-y-2">
          {forwarder.lanes.map((lane, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-gray-600 dark:text-white" />
              <span className="text-sm text-gray-900 dark:text-white">{lane}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Modes */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Transport Modes</h3>
        <div className="flex flex-wrap gap-2">
          {forwarder.modes.map((mode, index) => (
            <Badge key={index} variant="outline">{mode}</Badge>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderCarrierDetails = (carrier: Carrier) => (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">On-Time %</p>
            <p className="text-lg font-semibold text-green-600">{carrier.onTimePercent}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Claims Rate</p>
            <p className="text-lg font-semibold text-red-600">{(carrier.claimsRate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cost per Mile</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">${carrier.costPerMile}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fleet Size</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{carrier.fleetSize}</p>
          </div>
        </div>
      </Card>

      {/* Service Level */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Service Level</h3>
        <Badge variant="secondary" className="text-sm">{carrier.serviceLevel}</Badge>
      </Card>

      {/* Lanes */}
      <Card className="dashboard-card p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Lanes</h3>
        <div className="space-y-2">
          {carrier.lanes.map((lane, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-gray-600 dark:text-white" />
              <span className="text-sm text-gray-900 dark:text-white">{lane}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderEntityDetails = () => {
    switch (entityType) {
      case 'supplier':
        return renderSupplierDetails(entity as Supplier)
      case 'factory':
        return renderFactoryDetails(entity as Factory)
      case 'warehouse':
        return renderWarehouseDetails(entity as Warehouse)
      case 'forwarder':
        return renderForwarderDetails(entity as FreightForwarder)
      case 'carrier':
        return renderCarrierDetails(entity as Carrier)
      default:
        return null
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getEntityIcon()}
              <SheetTitle className="text-xl">{getEntityTitle()}</SheetTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Entity Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{entity.name}</h2>
            <p className="text-gray-600 dark:text-white mt-1">{entity.country}, {entity.region}</p>
            {entity.website && (
              <div className="mt-2">
                <a
                  href={entity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {entity.website}
                  <ExternalLink className="inline h-3 w-3 ml-1" />
                </a>
              </div>
            )}
          </div>

          {/* Entity-specific details */}
          {renderEntityDetails()}
        </div>
      </SheetContent>
    </Sheet>
  )
}

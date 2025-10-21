import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, DollarSign, Users, Save, Eye } from "lucide-react"

interface SupplierCardProps {
  supplier: {
    id: number
    name: string
    country: string
    city: string
    certifications: string[]
    moq: number
    leadTime: number
    pricePerUnit: number
    rating: number
    productTypes: string[]
    materials: string[]
    incoterm: string
    paymentTerms: string[]
    supplierType: string
  }
  onSave?: (id: number) => void
  onViewDetails?: (id: number) => void
}

export function SupplierCard({ supplier, onSave, onViewDetails }: SupplierCardProps) {
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-emerald-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {supplier.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {supplier.city}, {supplier.country}
            </div>
          </div>
          <div className="flex items-center">
            {renderStars(supplier.rating)}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              {supplier.rating}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Certifications */}
        <div className="flex flex-wrap gap-1">
          {supplier.certifications.map((cert) => (
            <Badge 
              key={cert} 
              variant="secondary" 
              className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
            >
              {cert}
            </Badge>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
              <Users className="h-4 w-4" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {supplier.moq.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">MOQ</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
              <Clock className="h-4 w-4" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {supplier.leadTime}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Days</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              ${supplier.pricePerUnit}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Per Unit</div>
          </div>
        </div>

        {/* Product Types */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Product Types</div>
          <div className="flex flex-wrap gap-1">
            {supplier.productTypes.slice(0, 2).map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
            {supplier.productTypes.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{supplier.productTypes.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900"
            onClick={() => onSave?.(supplier.id)}
          >
            <Save className="h-4 w-4 mr-1" />
            Save Vendor
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(supplier.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Icon } from "leaflet"
import { useEffect, useState } from "react"
import { Marker, Popup, useMap } from "react-leaflet"


export default function Geolocalizacao() {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const map = useMap()

  // Custom icon for user location
  const userIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  useEffect(() => {
    // Get user's current location
    map.locate({ setView: true, maxZoom: 16 })

    // Event handler for when location is found
    function onLocationFound(e: { latlng: { lat: number; lng: number } }) {
      setPosition([e.latlng.lat, e.latlng.lng])
    }

    // Event handler for location error
    function onLocationError(e: { message: any }) {
      console.error("Error finding location:", e.message)
    }

    // Add event listeners
    map.on("locationfound", onLocationFound)
    map.on("locationerror", onLocationError)

    // Cleanup function to remove event listeners
    return () => {
      map.off("locationfound", onLocationFound)
      map.off("locationerror", onLocationError)
    }
  }, [map])

  // Only render marker if position is available
  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="p-1">
          <h3 className="font-medium">Sua localização</h3>
        </div>
      </Popup>
    </Marker>
  )
}

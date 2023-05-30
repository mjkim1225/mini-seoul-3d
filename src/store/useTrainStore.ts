import create from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import * as Cesium from 'cesium'
interface useTrainStoreInterface {
    entity: Cesium.Entity | null,
    setEntity: (entity: Cesium.Entity) => void,
    removeEntity: () => void,
}

const useTrainStore = create<useTrainStoreInterface>((set) => ({
    entity: null,
    setEntity: (entity) => {
        set((state) => ({
            entity
        }))
    },
    removeEntity: () => {
        set((state) => ({
            entity: null
        }))
    },
}))

export default useTrainStore

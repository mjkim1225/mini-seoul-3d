import create from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import * as Cesium from 'cesium'
interface useCameraStoreInterface {
    cameraEntity: Cesium.Entity | null,
    setCameraEntity: (entity: Cesium.Entity) => void,
    removeCameraEntity: () => void,
    flag: boolean,
    setFlag: (flag: boolean) => void,
    removeFlag: () => void,
    bearing: number | null,
    setBearing: (bearing: number) => void,
    removeBearing: () => void
}

const useTrainStore = create<useCameraStoreInterface>((set) => ({
    cameraEntity: null,
    setCameraEntity: (cameraEntity) => {
        set((state) => ({
            cameraEntity
        }))
    },
    removeCameraEntity: () => {
        set((state) => ({
            cameraEntity: null
        }))
    },
    flag: false,
    setFlag: (flag) => {
        set((state) => ({
            flag
        }))
    },
    removeFlag: () => {
        set((state) => ({
            flag: false
        }))
    },
    bearing: null,
    setBearing: (bearing) => {
        set((state) => ({
            bearing
        }))
    },
    removeBearing: () => {
        set((state) => ({
            bearing: null
        }))
    }
}))

export default useTrainStore

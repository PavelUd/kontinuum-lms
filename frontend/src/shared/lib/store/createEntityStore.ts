import {create} from "zustand";
import {BaseState, EntityWithId, StoreConfig} from "@/shared/lib/store/types";

export function createEntityStore<T extends EntityWithId, TStatus>(
    config: StoreConfig<T, TStatus>
) {
    return create<BaseState<T, TStatus>>((set, get) => ({
        items: [],
        isLoading: false,
        error: null,

        setItems: (items) => set({ items }),


        add: async (item) => {
            set({ isLoading: true, error: null })

            const temp = config.getTempItem(item)

            set((state) => ({
                items: [temp, ...state.items],
            }))

            try {
                const created = await config.create(item)
/*
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === temp.id ? created : i
                    ),
                    isLoading: false,
                }))
                */
            } catch (e: any) {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== temp.id),
                    error: e.message,
                    isLoading: false,
                }))
            }
        },

        remove: async (id) => {
            const prev = get().items

            set((state) => ({
                items: state.items.filter((i) => i.id !== id),
            }))

            try {
                await config.remove(id)
            } catch (e: any) {
                set({
                    items: prev,
                    error: e.message,
                })
            }
        },

        updateStatus: async (id, status) => {
            const prev = get().items

            set((state) => ({
                items: state.items.map((i) =>
                    i.id === id ? { ...i, status } : i
                ),
            }))

            try {
                await config.updateStatus(id, status)
            } catch {
                set({
                    items: prev,
                    error: "Не удалось обновить статус",
                })
            }
        },

        clear: () => set({ items: [] }),
    }))
}
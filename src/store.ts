import { reactive } from 'vue'

interface Store {
  age: number,
  conditionSince?: number,
  skill: number,
  permutation: number,
  accuracies: Object,
  selectedLandmark?: number,
  selectedFrequency?: number,
  selectedLength?: number
}

const getInitState = (): Store => {
  return {
    age: 0,
    skill: 0,
    permutation: 0,
    accuracies: {}
  }
}

export const store: Store = reactive(getInitState())

export const resetStore = (): void => {
  const initState = getInitState();
  for (const key in store) {
    if (initState.hasOwnProperty(key)) {
      (store as any)[key] = initState[key as keyof Store];
    } else {
      delete (store as any)[key]
    }
  }
}
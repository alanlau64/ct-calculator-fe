import { reactive } from 'vue'

interface Store {
  age?: number,
  conditionSince?: number,
  skill: number,
  permutation: number,
  startTPN: number,
  selectedLandmark?: number,
  selectedTimesPerWeek?: number,
  selectedAmount?: number
}

export const store: Store = reactive({
  skill: 0,
  permutation: 0,
  startTPN: 0,
})
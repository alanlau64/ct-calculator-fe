<script setup lang="ts">
  import { store } from "../store"
  import { ref, onBeforeMount, computed } from 'vue'
  import type { Ref } from 'vue'
  import CurrencyTaskComponent from '../components/taskComponents/CurrencyTaskComponent.vue'
  import ClockMathTaskComponent from '../components/taskComponents/ClockMathTaskComponent.vue'
  import MathWordProblemTaskComponent from '../components/taskComponents/MathWordProblemTaskComponent.vue'
  import MapTaskComponent from '../components/taskComponents/MapTaskComponent.vue'
  import SymbolMatchingTaskComponent from '../components/taskComponents/SymbolMatchingTaskComponent.vue'
  import AlternatingSymbolMatchingTaskComponent from '../components/taskComponents/AlternatingSymbolMatchingTaskComponent.vue'
  import AlternatingWordOrderingTaskComponent from "../components/taskComponents/AlternatingWordOrderingTaskComponent.vue"
  import WordOrderingTaskComponent from "../components/taskComponents/WordOrderingTaskComponent.vue"
  import SequencingTaskComponent from "../components/taskComponents/SequencingTaskComponent.vue"
  import SpokenWordComprehensionTaskComponent from "../components/taskComponents/SpokenWordComprehensionTaskComponent.vue"
  import ShortStoryTaskComponent from "../components/taskComponents/ShortStoryTaskComponent.vue"
  // import AuditoryCommandTaskComponent from "../components/taskComponents/AuditoryCommandTaskComponent.vue"
  import ClockTaskComponent from "../components/taskComponents/ClockTaskComponent.vue"
  import MentalRotationTaskComponent from "../components/taskComponents/MentalRotationTaskComponent.vue"
  import WrittenWordComprehensionTaskComponent from "../components/taskComponents/WrittenWordComprehensionTaskComponent.vue"
  import ActiveSentenceCompletionTaskComponent from "../components/taskComponents/ActiveSentenceCompletionTaskComponent.vue"
  import ShortReadingTaskComponent from "../components/taskComponents/ShortReadingTaskComponent.vue"
  import WordSpellingTaskComponent from "../components/taskComponents/WordSpellingTaskComponent.vue"
  import PictureSpellingTaskComponent from "../components/taskComponents/PictureSpellingTaskComponent.vue"

  const emit = defineEmits(['next-screen'])

  interface Task {
    [key: string]: any;
    task_type_id: number;
  }

  interface TaskComponentMap {
    [key: number]: any
  }

  interface AccuracyType {
    [key: number]: {[key: number]: number[]}
  }

  const base_url = ref('')
  const tasks: Ref<Task[]> = ref([])
  const status = ref("start")
  const error = ref('')
  const completed = ref(false)

  const fetchData = async () => {
    status.value = "loading";
    try {
      const response = await fetch('https://ts0100n96d.execute-api.us-east-2.amazonaws.com/rss?permutation_id=' + store.permutation);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(response);
      
      base_url.value = data.baseUrl;
      tasks.value = data.tasks;
      store.domain = data.domain;
      store.assessmentId = data.assessmentId;
    } catch (err) {
      error.value = String(err);
      status.value = 'error'
    } finally {
      status.value = "ready"
    }
  }

  onBeforeMount(() => {
    fetchData();
  })

  const taskComponentMap: TaskComponentMap = {
    43: CurrencyTaskComponent,
    133: ClockMathTaskComponent,
    15: MathWordProblemTaskComponent,
    132: MapTaskComponent,
    27: SymbolMatchingTaskComponent,
    215: AlternatingSymbolMatchingTaskComponent,
    148: AlternatingWordOrderingTaskComponent,
    206: WordOrderingTaskComponent,
    237: SequencingTaskComponent,
    238: SpokenWordComprehensionTaskComponent,
    165: ShortStoryTaskComponent,
    // 212: AuditoryCommandTaskComponent,
    130: ClockTaskComponent,
    136: MentalRotationTaskComponent,
    256: WrittenWordComprehensionTaskComponent,
    208: ActiveSentenceCompletionTaskComponent,
    108: ShortReadingTaskComponent,
    231: WordSpellingTaskComponent,
    242: PictureSpellingTaskComponent
  };

  const curTaskTypeIdx = ref(0);
  const curTaskIdx = ref(0);
  const taskCnt = ref(0);

  const curTaskType = computed(() => tasks.value[curTaskTypeIdx.value] as Task)
  const curTask = computed(() => tasks.value[curTaskTypeIdx.value].tasks[curTaskIdx.value])
  const curTaskKey = computed(() => `${tasks.value[curTaskTypeIdx.value].task_type_id}-${curTaskIdx.value}`)

  const curTaskComponent = computed(() => {
    const curTaskTypeId = curTaskType.value.task_type_id;
    return taskComponentMap[curTaskTypeId];
  })

  const accuracies: Ref<AccuracyType> = ref({})
  const finishTask = (taskTypeId: number, taskLevel: number, accuracy: number | number[]) => {
    if (!accuracies.value[taskTypeId]) {
      accuracies.value[taskTypeId] = {};
    }
    if (!accuracies.value[taskTypeId][taskLevel]) {
      accuracies.value[taskTypeId][taskLevel] = []
    }

    if (typeof accuracy === "number") {
      accuracies.value[taskTypeId][taskLevel].push(accuracy);
      taskCnt.value++;
    }
    else {
      accuracies.value[taskTypeId][taskLevel].push(...accuracy);
      taskCnt.value += accuracy.length;
    }

    if (taskCnt.value === curTaskType.value.count) {
      if (curTaskTypeIdx.value === tasks.value.length - 1) {
        completed.value = true;
        store.accuracies = accuracies.value;
        emit("next-screen");
      }
      else {
        curTaskIdx.value = 0;
        taskCnt.value = 0;
        curTaskTypeIdx.value++;
      }
    }
    else
      curTaskIdx.value++;
  }
  
</script>

<template>
  <div v-if="status === 'loading'">Loading</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else-if="tasks && !completed">
    <component 
      :is="curTaskComponent"
      :key="curTaskKey"
      :task="curTask" 
      :task-type="curTaskType.task_type_id"
      :task-level="curTaskType.level"
      :base-url="base_url" 
      @finish="finishTask" 
    />
  </div>
</template>

<style scoped>
  .nextPage {
      padding-top: 20px;
      display: block;
      text-align: center;
    }
</style>
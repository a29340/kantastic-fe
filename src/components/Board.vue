<template>
  <div class="pa-5 fill-height">
    <v-row class="fill-height">
      <v-col cols="3" v-for="stage in stages" >
        <v-card
          class="py-1 fill-height drop-zone elevation-1"
          :color="stage.highlighted ? 'drop-highlight' : 'surface-variant'"
          rounded="md"
          target="_blank"
          :title="stage.name"
          variant="tonal"
          @drop="onDrop($event, stage)"
          @dragover="onDragenter($event, stage)"
          @dragleave="onDragleave($event, stage)"
          @dragenter="onDragenter($event, stage)">
          <div v-for="task in tasksForStage(stage.id)">
            <v-card
              :id="'task-' + task.id"
              class="pa-1 ma-3"
              :variant="task.dragging ? 'outlined' : 'tonal'"

              :text="task.name"
              rounded="lg"
              target="_blank"
              subtitle="Task"
              draggable="true"
              hover
              @dragstart="startDrag($event, task)"></v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue';
import {Stage, Task} from './Board';
import {VCard} from "vuetify/components";
import {Api, StageDTO, TaskDTO} from "../api/Api";

const api = new Api();
const tasks: Ref<Task[]> = ref([]);
const stages: Ref<Stage[]> =  ref([])


api.stages.getStages({boardId: 0}).then(stagesResponse => {
  stagesResponse.json().then((data: StageDTO[]) => {
    stages.value = data.map(s => new Stage(s.id, s.name, s.boardId))
  })
})

api.tasks.getTasks({boardId: 0}).then(tasksResponse => {
  tasksResponse.json().then((data: TaskDTO[]) => {
    tasks.value = data.map(t => new Task(t.id, t.name, t.description, t.stageId, t.boardId))
  })
})

function getPreviewElement(task: Task) {
  const preview = document.getElementById('task-' + task.id).cloneNode(true) as HTMLElement;
  preview.id = 'drag-preview'
  preview.classList.add('border-md', 'border-dashed')
  preview.classList.remove('v-card--variant-tonal')
  preview.style.position = 'absolute'
  preview.style.top = '-999999px'
  console.log(preview)
  document.body.append(preview);
  return preview;
}

const startDrag = (evt: DragEvent, task: Task) => {
  evt.dataTransfer.dropEffect = 'move'
  // const preview = getPreviewElement(task);
  // evt.dataTransfer.setDragImage(preview, 0, 0)
  evt.dataTransfer.setData('taskId', String(task.id))
  task.dragging = true
}
const onDrop = (evt: DragEvent, stage: Stage) => {
  const taskId = Number(evt.dataTransfer.getData('taskId'))
  const task = tasks.value.find(task => task.id === taskId)
  task.stageId = stage.id
  task.dragging = false
  stage.highlighted = false


  api.task.postTask({
    id: task.id,
    name: task.name,
    description: task.description,
    stageId: task.stageId,
    boardId: task.boardId
  })
  // document.getElementById('drag-preview').remove()
}

const onDragenter = (evt: DragEvent, stage: Stage) => {
  evt.preventDefault()
  stage.highlighted = true
}

const onDragleave = (evt: DragEvent, stage: Stage) => {
  evt.preventDefault()
  stage.highlighted = false
}

const tasksForStage = (stageId: number) => {
  return tasks.value.filter(task => task.stageId === stageId)
}
</script>
<style scoped>

</style>

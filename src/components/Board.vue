<template>
  <div class="pa-5 fill-height">
    <v-row class="fill-height">
      <v-col cols="3" v-for="stage in board.stages" >
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
import {ref} from 'vue';
import {Stage, Board, Task} from './Board.ts';
import {VCard} from "vuetify/components";

const tasks = ref([
  new Task('Bat wing soup', 0, 0),
  new Task('Spicy Octopus',1, 0),
  new Task('Anything from Taco Bell',2, 0),
  new Task('Pippo', 3, 1),
  new Task('Pluto', 4, 2),
  new Task('Hamburger',5, 3),
  new Task('Pizza',6, 3),
  new Task('Spaghetti',7, 3),
  new Task('Tacos',8, 3),
  new Task('Teriyaki Chicken', 9, 3)
])


const inprogress = new Stage('In progress', 0);
const review = new Stage('Review', 1)
const done = new Stage('Done', 2)
const todo = new Stage( 'To do', 3);
const board = ref(new Board('My Board', [todo, inprogress, review, done], 0))

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
  const preview = getPreviewElement(task);
  evt.dataTransfer.setDragImage(preview, 0, 0)
  evt.dataTransfer.setData('taskId', String(task.id))
  task.dragging = true
}
const onDrop = (evt: DragEvent, stage: Stage) => {
  const taskId = Number(evt.dataTransfer.getData('taskId'))
  const task = tasks.value.find(task => task.id === taskId)
  task.stageId = stage.id
  task.dragging = false
  stage.highlighted = false
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

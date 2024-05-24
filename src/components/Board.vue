<template>
  <div class="pa-5">
    <v-row class="fill-height">
      <v-col cols="3" v-for="stage in board.stages">
        <v-card
          class="py-1 fill-height"
          color="surface-variant"
          rounded="md"
          target="_blank"
          v-bind:title="stage.name"
          variant="tonal">
          <draggable :list="stage.tasks" itemKey="name" group="board" :animation="500">
            <template #item="{element, index}">
              <v-card
                class="pa-1 ma-3"
                color="surface-variant"
                rounded="lg"
                target="_blank"
                subtitle="Task"
                :text="element.name"
                variant="tonal"></v-card>
            </template>
          </draggable>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Stage, Board, Task} from './Board.ts';
import draggable from 'vuedraggable';

const inprogress = new Stage('In progress',[
  new Task('Bat wing soup', 0),
  new Task('Spicy Octopus',1),
  new Task('Anything from Taco Bell',2)
]);

const review = new Stage('Review', [
  new Task('Pippo', 0)
])

const done = new Stage('Done',[
  new Task('Pluto', 0),
])
let todo = new Stage( 'To do', [
  new Task('Hamburger',0),
  new Task('Pizza',1),
  new Task('Spaghetti',2),
  new Task('Tacos',3),
  new Task('Teriyaki Chicken', 4)
]);
const board = ref(new Board('My Board', [todo, inprogress, review, done]))
</script>

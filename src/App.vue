<template>
  <div id="app">
    <Top />
    <Index />
    <Player/>
    <MiniPlayer/>
    <Playlist />
  </div>
</template>

<script>
import Top from '@/components/Top.vue';
import Index from '@/components/Index.vue';
import Player from '@/components/Player.vue';
import MiniPlayer from '@/components/MiniPlayer.vue';
import Playlist from "@/components/Playlist"


export default {
  name: 'app',
  components: {
    Top,
    Index,
    Player,
    MiniPlayer,
    Playlist
  }
};
</script>

<style >

</style>

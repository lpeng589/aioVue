
<template>

  <div class="container">
    <div class="image-set">
      <a data-magnify="gallery" data-caption="Rémi Bizouard triple champion du monde by malainxx24" href="https://farm5.staticflickr.com/4267/34162425794_1430f38362_z.jpg">
        <img src="https://farm5.staticflickr.com/4267/34162425794_1430f38362_s.jpg" alt="">
      </a>
    </div>
  </div>

</template>
<style lang="scss" rel="stylesheet/scss">
 @import "../../assets/css/jquery.magnify.css";
</style>


<script type="text/babel">
  export default {
    data() {
      return {
        list: [],
        allLoaded: true,
        bottomStatus: '',
        wrapperHeight: 0
      };
    },
    methods: {
    
    },
    created() {

    },
    mounted() {
    }
  };
</script>

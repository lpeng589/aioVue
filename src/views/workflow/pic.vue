<template>
    <!-- 过渡动画 -->
    <transition name="fade">
        <div class="img-view" :style="imgview" @click="bigImg">
            <!-- 遮罩层 -->
            <div class="img-layer"></div>
            <div class="img">
                <img ref="pic" :src="imgSrc" :style="{ 'margin-top': imgMargenTop+'px', 'margin-left': imgMargenLeft+'px'}">
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    props: ['imgSrc'],
    data(){
        return {
            screenWidth: document.body.clientWidth,
            screenHeight: document.body.clientHeight,
            imgWidth: 0,
            imgHeight: 0,
            imgview: {
                position: 'absolute',
                top: '162px',
                left: '-162px',
                width: '736px',
                height: '414px',
                transform: 'rotate(90deg)',
                'z-index': '99'
            }
        }
    },
    computed: {
        imgMargenTop() {
           return (this.screenWidth - this.imgHeight)/2
        },
        imgMargenLeft() {
            return (this.screenHeight - this.imgWidth)/2
        }
    },
    methods: {
        bigImg() {
            // 发送事件
            this.$emit('clickit')
        }
    },
    mounted(){
        this.imgWidth = this.$refs.pic.width
        this.imgHeight = this.$refs.pic.height
        console.log(this.imgMargenTop)
        console.log(this.imgMargenLeft)
       // console.log(this.$refs.pic.style.height)
    }
}
</script>
<style lang="scss" scoped>
/*动画*/
.fade-enter-active,
.fade-leave-active {
    transition: all .2s linear;
    transform: translate3D(0, 0, 0);
}

.fade-enter,
.fade-leave-active {
    transform: translate3D(100%, 0, 0);
}


/* bigimg */

.img-view {

}

/*遮罩层样式*/
.img-view .img-layer {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    overflow: hidden;
}

/*不限制图片大小，实现居中*/
.img-view .img img {
    max-width: 80%;
    max-height: 95%;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1000;

}
</style>




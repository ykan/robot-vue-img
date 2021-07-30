import { createApp, defineComponent } from 'vue'

import { Img } from '@robot-img/vue-img'

const App = defineComponent({
  components: {
    'robot-img': Img,
  },
  setup() {
    return () => (
      <robot-img width="150" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
    )
  },
})
createApp(App).mount(document.getElementById('20-default')!)

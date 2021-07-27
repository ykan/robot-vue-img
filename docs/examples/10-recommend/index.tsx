import { createApp, defineComponent } from 'vue'

const App = defineComponent({
  render() {
    return <div>Test</div>
  },
})
async function main() {
  createApp(App).mount(document.getElementById('10-recommend')!)
}

main()

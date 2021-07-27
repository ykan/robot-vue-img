/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs-extra')
const path = require('path')

async function main() {
  const workspace = process.cwd()
  const pkgPath = path.join(workspace, 'packages')
  await fs.copy(
    path.join(pkgPath, './vue-img/src/types.ts'),
    path.join(pkgPath, './vue-img/dist/vue-img.d.ts')
  )
  console.log('dts done.')
}

main()

#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { syncEngines } from './sync-cubby-engines.mjs'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname)
const SUB = path.join(ROOT, 'third_party/cubbyslicer')
const OUT = path.join(ROOT, 'internal/web/slicer')

function run(cmd, args, cwd) {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  execFileSync(cmd, args, { cwd, stdio: 'inherit', env: process.env })
}

if (!await fs.access(SUB).then(() => true).catch(() => false)) {
  throw new Error('CubbySlicer submodule is missing. Run: git submodule update --init third_party/cubbyslicer')
}

if (process.env.CUBBY_SKIP_ENGINE_SYNC !== '1') await syncEngines()
run('npm', ['ci'], SUB)
run('npm', ['run', 'build'], SUB)

await fs.mkdir(OUT, { recursive: true })
for (const entry of await fs.readdir(OUT)) {
  if (entry !== '.gitkeep') await fs.rm(path.join(OUT, entry), { recursive: true, force: true })
}
await fs.cp(path.join(SUB, 'dist'), OUT, { recursive: true })
if (!await fs.access(path.join(OUT, 'index.html')).then(() => true).catch(() => false)) {
  throw new Error('CubbySlicer build did not produce index.html')
}
console.log(`CubbySlicer staged at ${OUT}`)

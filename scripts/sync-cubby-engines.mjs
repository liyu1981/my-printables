#!/usr/bin/env node
/**
 * Stage the CubbySlicer WASM engines and profiles from its public deployment.
 *
 * The CubbySlicer submodule contains the frontend source, but the OrcaSlicer /
 * preFlight / Full Spectrum WASM artifacts are not checked into that repo.
 * This script mirrors the artifacts served by the live CubbySlicer deployment
 * into third_party/cubbyslicer/public/wasm so the frontend can be built
 * offline. Upstream source and license are in the cubbyslicer submodule and
 * the related engine repositories.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname)
const DEST = path.join(ROOT, 'third_party/cubbyslicer/public/wasm')
const BASE = (process.env.CUBBY_ENGINE_BASE || 'https://cubbycad.com/slicer/wasm').replace(/\/$/, '')
const ENGINES = ['orca', 'preflight', 'fullspectrum']
const CONCURRENCY = 8

async function fetchBytes(url) {
  let last
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'follow' })
      if (!res.ok) {
        if (res.status === 404) return null
        throw new Error(`HTTP ${res.status}`)
      }
      return Buffer.from(await res.arrayBuffer())
    } catch (err) {
      last = err
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)))
    }
  }
  throw new Error(`${url}: ${last?.message || 'download failed'}`)
}

async function download(url, file, optional = false) {
  const data = await fetchBytes(url)
  if (data === null) {
    if (optional) return false
    throw new Error(`missing ${url}`)
  }
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, data)
  return true
}

function encodePath(p) {
  return p.split('/').map((part) => encodeURIComponent(part)).join('/')
}

async function mapLimit(items, limit, fn) {
  let next = 0
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++]
      await fn(item)
    }
  }))
}

async function syncVendorTree(engine) {
  const base = `${BASE}/${engine}/profiles`
  const dir = path.join(DEST, engine, 'profiles')
  const indexPath = path.join(dir, '_index.json')
  if (!await download(`${base}/_index.json`, indexPath)) throw new Error(`No profile index at ${base}/_index.json`)
  const index = JSON.parse(await fs.readFile(indexPath, 'utf8'))
  const vendors = Array.isArray(index) ? index : Array.isArray(index.vendors) ? index.vendors : []
  if (!vendors.length) throw new Error(`No vendors in ${indexPath}`)
  await mapLimit(vendors, CONCURRENCY, async (vendor) => {
    const vendorSafe = encodePath(vendor)
    const vendorFile = path.join(dir, `${vendor}.json`)
    const vendorRaw = await fetchBytes(`${base}/${vendorSafe}.json`)
    if (!vendorRaw) {
      console.warn(`warning: ${engine} vendor ${vendor} missing`)
      return
    }
    await fs.writeFile(vendorFile, vendorRaw)
    const bundleURL = `${base}/_bundles/${vendorSafe}.json`
    const bundleFile = path.join(dir, '_bundles', `${vendor}.json`)
    if (await download(bundleURL, bundleFile, true)) return
    const v = JSON.parse(vendorRaw.toString('utf8'))
    const entries = []
    for (const key of ['machine_model_list', 'machine_list', 'process_list', 'filament_list']) {
      for (const e of (Array.isArray(v[key]) ? v[key] : [])) {
        if (e && typeof e.sub_path === 'string') entries.push(e.sub_path)
      }
    }
    await mapLimit(entries, CONCURRENCY, async (sub) => {
      const safe = encodePath(sub)
      await download(`${base}/${safe}`, path.join(dir, safe), true)
    })
  })
  console.log(`${engine}: ${vendors.length} profile vendors staged`)
}

async function syncPreflightProfiles() {
  const base = `${BASE}/preflight/profiles`
  const dir = path.join(DEST, 'preflight', 'profiles')
  const indexPath = path.join(dir, '_index.json')
  if (!await download(`${base}/_index.json`, indexPath)) throw new Error(`No preflight profile index at ${base}/_index.json`)
  const index = JSON.parse(await fs.readFile(indexPath, 'utf8'))
  const bundles = Array.isArray(index) ? index : Array.isArray(index.bundles) ? index.bundles : []
  for (const bundle of bundles) {
    if (!/\.json$/i.test(bundle)) continue
    await download(`${base}/${encodePath(bundle)}`, path.join(dir, bundle))
  }
  await download(`${base}/orca_system_profiles.json`, path.join(dir, 'orca_system_profiles.json'), true)
}

export async function syncEngines() {
  await fs.mkdir(DEST, { recursive: true })
  for (const engine of ENGINES) {
    const dir = path.join(DEST, engine)
    await fs.mkdir(dir, { recursive: true })
    for (const name of ['slicer.mjs', 'slicer.wasm', 'schema.json', 'version.json']) {
      await download(`${BASE}/${engine}/${name}`, path.join(dir, name))
    }
    await download(`${BASE}/${engine}/slicer.data`, path.join(dir, 'slicer.data'), true)
    console.log(`${engine}: engine staged`)
    if (engine === 'preflight') await syncPreflightProfiles()
    else await syncVendorTree(engine)
  }
  console.log(`CubbySlicer engines staged in ${DEST}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await syncEngines()
}

/// <reference lib="webworker" />
import occtimportjs from 'occt-import-js'
import wasmUrl from 'occt-import-js/dist/occt-import-js.wasm?url'

interface Request { id: number; buffer: ArrayBuffer }
interface OcctMesh {
  name?: string
  attributes: { position: { array: ArrayLike<number> } }
  index: { array: ArrayLike<number> }
}
interface OcctResult { success: boolean; meshes: OcctMesh[] }
interface Occt { ReadStepFile(content: Uint8Array, params: Record<string, unknown> | null): OcctResult }

const ctx = self as unknown as {
  onmessage: ((ev: MessageEvent<Request>) => void) | null
  postMessage(msg: unknown, transfer?: Transferable[]): void
}

let occt: Promise<Occt> | null = null

ctx.onmessage = async (ev) => {
  const { id, buffer } = ev.data
  try {
    occt ??= (occtimportjs as (o: unknown) => Promise<Occt>)({ locateFile: () => wasmUrl })
    const result = (await occt).ReadStepFile(new Uint8Array(buffer), {
      linearUnit: 'millimeter',
      linearDeflectionType: 'absolute_value',
      linearDeflection: 0.01,
      angularDeflection: 0.5,
    })
    const meshes = result.success ? result.meshes.map((m) => ({
      name: m.name,
      positions: Float32Array.from(m.attributes.position.array),
      indices: Uint32Array.from(m.index.array),
    })) : []
    const transfer: Transferable[] = []
    for (const m of meshes) transfer.push(m.positions.buffer, m.indices.buffer)
    ctx.postMessage({ id, ok: true, meshes }, transfer)
  } catch (err) {
    ctx.postMessage({ id, ok: false, message: err instanceof Error ? err.message : 'STEP import failed.' })
  }
}

#!/usr/bin/env node
/**
 * Build the proof_of_human circuit: compile with circom, then (optional) run snarkjs setup.
 * Requires: circom in PATH. For full build: ptau file at ptau/pot12_final.ptau or similar.
 */

import { execSync, spawnSync } from 'child_process'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const circuitsOut = join(root, 'circuits', 'out')

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: root, ...opts })
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed with ${r.status}`)
}

// 1. Ensure circuits/out exists
if (!existsSync(circuitsOut)) mkdirSync(circuitsOut, { recursive: true })

// 2. Compile circuit with circom
console.log('Compiling circuit with circom...')
try {
  run('circom', [
    'circuits/proof_of_human.circom',
    '--r1cs', '--wasm', '--sym',
    '-o', 'circuits/out'
  ])
} catch (e) {
  console.error('Circom not found or failed. Install from https://docs.circom.io/getting-started/installation/')
  process.exit(1)
}

// 3. Optional: snarkjs groth16 setup if ptau exists
const ptauPaths = [
  join(root, 'ptau', 'pot12_final.ptau'),
  join(root, 'ptau', 'pot14_final.ptau'),
  join(root, 'pot12_final.ptau')
]
const ptau = ptauPaths.find(p => existsSync(p))
const r1cs = join(circuitsOut, 'proof_of_human.r1cs')
const zkey = join(circuitsOut, 'proof_of_human.zkey')

if (ptau && existsSync(r1cs)) {
  console.log('Running snarkjs groth16 setup...')
  try {
    run('npx', ['snarkjs', 'groth16', 'setup', r1cs, ptau, zkey])
    run('npx', ['snarkjs', 'zkey', 'export', 'verificationkey', zkey, join(circuitsOut, 'verification_key.json')])
  } catch (e) {
    console.warn('snarkjs setup failed (install with: npm i -D snarkjs). Backend will need manual setup.')
  }
} else {
  console.log('No ptau file found. For full build, add a .ptau file and re-run. See circuits/README.md')
}

console.log('Circuit build done. Output in circuits/out/')

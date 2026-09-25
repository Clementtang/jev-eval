// Small, dependency-free statistics helpers for stats.mjs.

export const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
export const sd = (xs) => {
  const m = mean(xs);
  return xs.length > 1 ? Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)) : null;
};
export const quantile = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))))];

// Seeded PRNG (mulberry32) so every bootstrap in the report is reproducible.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cluster bootstrap: resample whole units (concepts), keeping each unit's repeats together,
// which is the unit of generalization (arXiv 2501.04234). `statistic` gets the resampled units.
export function bootstrap(units, statistic, { iterations = 10_000, seed = 1 } = {}) {
  const random = rng(seed);
  const estimate = statistic(units);
  const draws = [];
  for (let i = 0; i < iterations; i++) {
    const sample = Array.from({ length: units.length }, () => units[Math.floor(random() * units.length)]);
    const value = statistic(sample);
    if (value != null && Number.isFinite(value)) draws.push(value);
  }
  draws.sort((a, b) => a - b);
  // Two-sided bootstrap p-value for "statistic differs from 0"; only meaningful for difference statistics.
  const below = draws.filter((d) => d <= 0).length / draws.length;
  const above = draws.filter((d) => d >= 0).length / draws.length;
  return { estimate, low: quantile(draws, 0.025), high: quantile(draws, 0.975), p: Math.min(1, 2 * Math.min(below, above)) };
}

// Exact two-sided sign-flip (paired permutation) test on per-unit differences. With few units the
// cluster bootstrap p-value is optimistic, so this is the primary test: under H0 each difference is
// equally likely to carry either sign, and all 2^n sign patterns are enumerated.
const MAX_EXACT_UNITS = 20;
export function signFlipTest(diffs) {
  const d = diffs.filter((x) => x != null && Number.isFinite(x));
  if (!d.length) return { p: null, n: 0 };
  if (d.length > MAX_EXACT_UNITS) throw new Error(`sign-flip test is exact only up to ${MAX_EXACT_UNITS} units, got ${d.length}`);
  const observed = Math.abs(d.reduce((a, b) => a + b, 0));
  const patterns = 2 ** d.length;
  let extreme = 0;
  for (let mask = 0; mask < patterns; mask++) {
    let sum = 0;
    for (let i = 0; i < d.length; i++) sum += mask & (1 << i) ? -d[i] : d[i];
    // Small tolerance so ties caused by floating point count as "as extreme".
    if (Math.abs(sum) >= observed - 1e-12) extreme++;
  }
  return { p: extreme / patterns, n: d.length };
}

// Holm-Bonferroni step-down adjustment; returns adjusted p-values in the input order.
export function holm(pValues) {
  const order = pValues.map((p, i) => [p, i]).sort((a, b) => a[0] - b[0]);
  const adjusted = new Array(pValues.length);
  let running = 0;
  order.forEach(([p, i], rank) => {
    running = Math.max(running, Math.min(1, (pValues.length - rank) * p));
    adjusted[i] = running;
  });
  return adjusted;
}

// Ordinary least squares residual sum of squares via normal equations. A tiny ridge keeps
// rank-deficient dummy codings solvable without changing the fit meaningfully.
const RIDGE = 1e-9;
export function residualSS(X, y) {
  const k = X[0].length;
  const A = Array.from({ length: k }, (_, i) => Array.from({ length: k + 1 }, (_, j) => {
    if (j === k) return X.reduce((s, row, r) => s + row[i] * y[r], 0);
    return X.reduce((s, row) => s + row[i] * row[j], 0) + (i === j ? RIDGE : 0);
  }));
  for (let col = 0; col < k; col++) {
    let pivot = col;
    for (let r = col + 1; r < k; r++) if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    [A[col], A[pivot]] = [A[pivot], A[col]];
    for (let r = 0; r < k; r++) {
      if (r === col || A[col][col] === 0) continue;
      const f = A[r][col] / A[col][col];
      for (let c = col; c <= k; c++) A[r][c] -= f * A[col][c];
    }
  }
  const beta = A.map((row, i) => (row[i] === 0 ? 0 : row[k] / row[i]));
  return y.reduce((s, yi, r) => s + (yi - X[r].reduce((a, x, j) => a + x * beta[j], 0)) ** 2, 0);
}

// Builds a dummy-coded design matrix. `terms` are field names or [fieldA, fieldB] interactions.
export function design(rows, terms) {
  const levels = (f) => [...new Set(rows.map((r) => r[f]))].sort();
  const columns = [() => 1];
  for (const term of terms) {
    if (Array.isArray(term)) {
      const [a, b] = term;
      for (const la of levels(a).slice(1)) for (const lb of levels(b).slice(1)) columns.push((r) => (r[a] === la && r[b] === lb ? 1 : 0));
    } else {
      for (const level of levels(term).slice(1)) columns.push((r) => (r[term] === level ? 1 : 0));
    }
  }
  return rows.map((r) => columns.map((c) => c(r)));
}

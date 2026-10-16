/**
 * Raseen Platform E2E Automated Test Runner
 * Command: node tests/e2e/runner.js
 * Executes full opaque-box test suite across Tiers 1-4.
 * Returns Exit Code 0 on 100% pass, non-zero on failure.
 */

const suites = [
  require('./tier1_zatca.test.js'),
  require('./tier1_hero_tabs.test.js'),
  require('./tier1_currency.test.js'),
  require('./tier1_leads.test.js'),
  require('./tier1_a4_print.test.js'),
  require('./tier1_freemium_bim.test.js'),
  require('./tier1_editorial_blog.test.js'),
  require('./tier2_boundary.test.js'),
  require('./tier3_combinations.test.js'),
  require('./tier4_scenarios.test.js'),
];

async function main() {
  console.log('\x1b[1m\x1b[35m======================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[35m       منصة رَصين — RASEEN PLATFORM E2E VERIFICATION SUITE           \x1b[0m');
  console.log('\x1b[1m\x1b[35m======================================================================\x1b[0m');
  console.log(`\x1b[90mTimestamp: ${new Date().toISOString()} | Target: Node.js ${process.version}\x1b[0m\n`);

  const globalStart = Date.now();
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  const allErrors = [];

  for (const suite of suites) {
    const result = await suite.run();
    totalTests += result.total;
    totalPassed += result.passed;
    totalFailed += result.failed;
    if (result.errors && result.errors.length > 0) {
      allErrors.push(...result.errors.map(e => ({ suite: result.name, ...e })));
    }
  }

  const globalDuration = Date.now() - globalStart;

  console.log('\n\x1b[1m\x1b[35m======================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[35m                     E2E SUITE EXECUTION SUMMARY                      \x1b[0m');
  console.log('\x1b[1m\x1b[35m======================================================================\x1b[0m');
  console.log(`  \x1b[1mTotal Suites Executed:\x1b[0m  ${suites.length}`);
  console.log(`  \x1b[1mTotal Tests Executed:\x1b[0m   ${totalTests}`);
  console.log(`  \x1b[1mPassed:\x1b[0m                 \x1b[32m${totalPassed}\x1b[0m`);
  console.log(`  \x1b[1mFailed:\x1b[0m                 ${totalFailed > 0 ? `\x1b[31m${totalFailed}\x1b[0m` : `\x1b[32m0\x1b[0m`}`);
  console.log(`  \x1b[1mDuration:\x1b[0m               ${globalDuration}ms\n`);

  if (totalFailed > 0) {
    console.log('\x1b[1m\x1b[31m❌ FAILURES DETECTED:\x1b[0m');
    for (const err of allErrors) {
      console.log(`\x1b[31m  [${err.suite}] ${err.test}\x1b[0m`);
      console.log(`    ${err.error}`);
    }
    console.log('\n\x1b[31mProcess exiting with code 1\x1b[0m');
    process.exit(1);
  } else {
    console.log('\x1b[1m\x1b[32m✨ 100% VICTORY: ALL E2E TIERS PASSED WITH EXIT CODE 0 ✨\x1b[0m\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('\x1b[31mFatal unhandled error in E2E runner:\x1b[0m', err);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * Requirements Structuring & Validation CLI
 *
 * LLM-assisted tool implementing the framework from:
 * Li & Zheng (2025) "Enhancing Requirements via Structured Formalization
 * and Process-State Consistency Validation"
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const {
  sanitizeTerminalValue,
  buildSafeOutputPath,
  buildContainedChildPath,
  safeWriteJSON,
  safeWriteText,
  sanitizeErrorPayload,
} = require('./security');

const RequirementsParser = require('./parser');
const RequirementsStructurer = require('./structurer');
const UCSTransformer = require('./ucs-transformer');
const TestGenerator = require('./test-generator');
const ConsistencyChecker = require('./consistency-checker');
const FeedbackLoop = require('./feedback-loop');
const ReportGenerator = require('./report-generator');
const AmbiguityDetector = require('./ambiguity-detector');
const GherkinGenerator = require('./gherkin-generator');

function terminalLog(message) {
  const safeMessage = sanitizeTerminalValue(message);
  process.stdout.write(`${safeMessage}\n`);
}

function terminalError(message) {
  const safeMessage = sanitizeTerminalValue(message);
  process.stderr.write(`${safeMessage}\n`);
}

function spinnerFail(spinner, message) {
  const safeMessage = sanitizeTerminalValue(message);
  spinner.stop();
  process.stderr.write(`${safeMessage}\n`);
}

// CLI Header
terminalLog(
  chalk.blue.bold(`
┌─────────────────────────────────────────────────────────────┐
│       Requirements Structuring & Validation CLI             │
│    LLM-Assisted Use Case Specification Framework            │
└─────────────────────────────────────────────────────────────┘
`)
);

program
  .name('pm-requirements')
  .description(
    'Structure natural language requirements, generate test cases, and validate consistency'
  )
  .version('1.0.0');

// ─── init ────────────────────────────────────────────────────────────────────
program
  .command('init')
  .description('Copy the blank requirements input template to the current directory')
  .action(async () => {
    const templateSrc = path.resolve(__dirname, '..', 'templates', 'requirements-input.md');
    const templateDest = path.resolve(process.cwd(), 'requirements-input.md');

    if (await fs.pathExists(templateDest)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'requirements-input.md already exists. Overwrite?',
          default: false,
        },
      ]);
      if (!overwrite) {
        terminalLog(chalk.yellow('Skipped.'));
        return;
      }
    }

    await fs.copy(templateSrc, templateDest);
    terminalLog(chalk.green('✓ Created requirements-input.md'));
    terminalLog(chalk.dim('  Fill in the template, then run: pm-requirements structure requirements-input.md'));
  });

// ─── detect ──────────────────────────────────────────────────────────────────
program
  .command('detect <input-file>')
  .description('Phase 0: Scan requirements for ambiguities before structuring')
  .option('-o, --output <file>', 'Save findings to Markdown report', null)
  .action(async (inputFile, opts) => {
    const spinner = ora('Scanning for ambiguities (Phase 0)...').start();
    try {
      const rawContent = await fs.readFile(path.resolve(inputFile), 'utf-8');
      const detector = new AmbiguityDetector();
      const result = await detector.detect(rawContent);
      spinner.succeed('Ambiguity scan complete');

      terminalLog(detector.formatFindings(result));

      if (opts.output) {
        const markdown = detector.formatMarkdown(result);
        const outputPath = buildSafeOutputPath(opts.output);
        await safeWriteText(outputPath, markdown);
        terminalLog(chalk.green(`✓ Report saved to ${outputPath}`));
      }

      const jsonPath = opts.output
        ? opts.output.replace(/\.md$/, '.json')
        : inputFile.replace(/\.md$/, '-ambiguity.json');
      const safeJsonPath = buildSafeOutputPath(jsonPath);
      await safeWriteJSON(safeJsonPath, result, { spaces: 2 });
      terminalLog(chalk.dim(`  → ${safeJsonPath}`));
    } catch (err) {
      spinnerFail(spinner, err && err.message ? err.message : String(err));
      process.exit(1);
    }
  });

// ─── structure ───────────────────────────────────────────────────────────────
program
  .command('structure <input-file>')
  .description('Phase 1: Convert natural language requirements to formal structure (Eq. 1)')
  .option('-o, --output <file>', 'Output file path', null)
  .action(async (inputFile, opts) => {
    const spinner = ora('Parsing requirements...').start();
    try {
      const parser = new RequirementsParser();
      const parsed = await parser.parse(inputFile);
      spinner.text = 'Structuring requirements via LLM (Phase 1)...';

      const structurer = new RequirementsStructurer();
      const structured = await structurer.structure(parsed);
      spinner.succeed('Requirements structured');

      const outputPath = opts.output || inputFile.replace(/\.md$/, '-structured.json');
      const safeOutputPath = buildSafeOutputPath(outputPath);
      await safeWriteJSON(safeOutputPath, structured, { spaces: 2 });
      terminalLog(chalk.green(`✓ Formal structure saved to ${safeOutputPath}`));
      terminalLog(chalk.dim(`  Business objects identified: ${(structured.businessObjects || []).join(', ')}`));
    } catch (err) {
      spinnerFail(spinner, err && err.message ? err.message : String(err));
      process.exit(1);
    }
  });

// ─── transform ───────────────────────────────────────────────────────────────
program
  .command('transform <structured-file>')
  .description('Phase 2: Convert formal structure to UCS template')
  .option('-o, --output <file>', 'Output file path', null)
  .option('--deterministic', 'Use deterministic transform (no LLM)', false)
  .action(async (structuredFile, opts) => {
    const spinner = ora('Loading structured requirements...').start();
    try {
      const formalStructure = await fs.readJSON(path.resolve(structuredFile));
      const transformer = new UCSTransformer();

      let ucs;
      if (opts.deterministic) {
        spinner.text = 'Transforming to UCS template (deterministic)...';
        ucs = transformer.transformDeterministic(formalStructure);
      } else {
        spinner.text = 'Transforming to UCS template via LLM (Phase 2)...';
        ucs = await transformer.transform(formalStructure);
      }
      spinner.succeed('UCS template generated');

      const outputPath = opts.output || structuredFile.replace(/-structured\.json$/, '-ucs.json');
      const safeOutputPath = buildSafeOutputPath(outputPath);
      await safeWriteJSON(safeOutputPath, ucs.toJSON ? ucs.toJSON() : ucs, { spaces: 2 });
      terminalLog(chalk.green(`✓ UCS template saved to ${safeOutputPath}`));
    } catch (err) {
      spinnerFail(spinner, err && err.message ? err.message : String(err));
      process.exit(1);
    }
  });

// ─── generate-tests ──────────────────────────────────────────────────────────
program
  .command('generate-tests <ucs-file>')
  .description('Algorithm 1: Generate test cases from UCS flows')
  .option('-o, --output <file>', 'Output file path', null)
  .action(async (ucsFile, opts) => {
    const spinner = ora('Loading UCS template...').start();
    try {
      const ucsData = await fs.readJSON(path.resolve(ucsFile));
      const generator = new TestGenerator();
      const testCases = generator.generate(ucsData);
      spinner.succeed(`Generated ${testCases.length} test case(s)`);

      const outputPath = opts.output || ucsFile.replace(/-ucs\.json$/, '-tests.json');
      const safeOutputPath = buildSafeOutputPath(outputPath);
      await safeWriteJSON(safeOutputPath, testCases, { spaces: 2 });
      terminalLog(chalk.green(`✓ Test cases saved to ${safeOutputPath}`));
      terminalLog(generator.formatSummary(testCases));
    } catch (err) {
      spinnerFail(spinner, err && err.message ? err.message : String(err));
      process.exit(1);
    }
  });

// ─── validate ────────────────────────────────────────────────────────────────
program
  .command('validate <ucs-file>')
  .description('Algorithms 2 & 3: Validate UCS consistency against diagrams')
  .option('--activity <file>', 'Business process model JSON (activity diagram)')
  .option('--state <files...>', 'State model JSON file(s)')
  .action(async (ucsFile, opts) => {
    try {
      const ucsData = await fs.readJSON(path.resolve(ucsFile));
      const checker = new ConsistencyChecker();

      const options = {};

      if (opts.activity) {
        options.bpm = await fs.readJSON(path.resolve(opts.activity));
      }

      if (opts.state) {
        options.stateModels = [];
        for (const stateFile of opts.state) {
          options.stateModels.push(await fs.readJSON(path.resolve(stateFile)));
        }
      }

      if (!opts.activity && !opts.state) {
        terminalLog(chalk.yellow('No diagram files provided. Use --activity and/or --state.'));
        return;
      }

      const results = checker.validateAll(ucsData, options);
      terminalLog(sanitizeTerminalValue(checker.formatReport(results)));

      if (results.totalViolations === 0) {
        terminalLog(chalk.green('\n✓ All consistency checks passed'));
      } else {
        terminalLog(chalk.red(`\n✗ ${results.totalViolations} violation(s) found — review and correct the UCS`));
      }
    } catch (err) {
      terminalError(chalk.red(`Error: ${sanitizeErrorPayload(err && err.message ? err.message : String(err))}`));
      process.exit(1);
    }
  });

// ─── review ──────────────────────────────────────────────────────────────────
program
  .command('review <ucs-file> <test-cases-file>')
  .description('Feedback loop: LLM-assisted gap analysis and requirement refinement')
  .option('-o, --output <file>', 'Output file for refined UCS', null)
  .action(async (ucsFile, testCasesFile, opts) => {
    try {
      const ucsData = await fs.readJSON(path.resolve(ucsFile));
      const testCases = await fs.readJSON(path.resolve(testCasesFile));

      const feedbackLoop = new FeedbackLoop();
      const result = await feedbackLoop.run(ucsData, testCases);

      const { passResults } = result;
      terminalLog(chalk.cyan('\n📊 Feedback Loop Summary:'));
      terminalLog(`  Gaps found: ${passResults.gaps}`);
      terminalLog(`  Additional test suggestions: ${passResults.additionalTests}`);
      terminalLog(`  Implicit requirements: ${passResults.implicitReqs}`);
      terminalLog(`  Suggestions accepted: ${passResults.accepted}`);

      if (passResults.accepted > 0) {
        const outputPath = opts.output || ucsFile.replace(/\.json$/, '-refined.json');
        const safeOutputPath = buildSafeOutputPath(outputPath, { rootDir: process.cwd(), allowAbsolute: true });
        await safeWriteJSON(safeOutputPath, result.updatedUCS, { spaces: 2 });
        terminalLog(chalk.green(`\n✓ Refined UCS saved to ${safeOutputPath}`));
      }
    } catch (err) {
      terminalError(chalk.red(`Error: ${sanitizeErrorPayload(err && err.message ? err.message : String(err))}`));
      process.exit(1);
    }
  });

// ─── generate-gherkin ────────────────────────────────────────────────────────
program
  .command('generate-gherkin <test-cases-file>')
  .description('Generate Gherkin .feature file from test cases')
  .requiredOption('--ucs <file>', 'UCS JSON file (needed for feature metadata)')
  .option('-o, --output <file>', 'Output .feature file path', null)
  .action(async (testCasesFile, opts) => {
    const spinner = ora('Generating Gherkin feature file...').start();
    try {
      const testCases = await fs.readJSON(path.resolve(testCasesFile));
      const ucs = await fs.readJSON(path.resolve(opts.ucs));

      const gherkin = new GherkinGenerator();
      const outputPath = opts.output || testCasesFile.replace(/-tests\.json$/, '.feature');
      const safeOutputPath = buildSafeOutputPath(outputPath);
      await gherkin.generateFile(testCases, ucs, safeOutputPath);
      spinner.succeed('Gherkin feature file generated');
      terminalLog(chalk.green(`✓ Feature file saved to ${safeOutputPath}`));
    } catch (err) {
      spinnerFail(spinner, err && err.message ? err.message : String(err));
      process.exit(1);
    }
  });

// ─── pipeline ────────────────────────────────────────────────────────────────
program
  .command('pipeline <input-file>')
  .description('Full 5-phase pipeline per Li & Zheng (2025)')
  .option('--activity <file>', 'Business process model JSON')
  .option('--state <files...>', 'State model JSON file(s)')
  .option('-o, --output-dir <dir>', 'Output directory', './output')
  .action(async (inputFile, opts) => {
    const outputDir = buildSafeOutputPath(opts.outputDir);
    await fs.ensureDir(outputDir);

    const baseName = path.basename(inputFile, path.extname(inputFile));

    try {
      // ═══ Phase 0: Ambiguity Detection ═══════════════════════════════════════
      terminalLog(chalk.blue.bold('\n═══ Phase 0: Ambiguity Detection ═══'));
      const rawContent = await fs.readFile(path.resolve(inputFile), 'utf-8');
      const detector = new AmbiguityDetector();
      const spinnerA = ora('Scanning for ambiguities...').start();
      const ambiguityResult = await detector.detect(rawContent);
      spinnerA.succeed('Ambiguity scan complete');

      terminalLog(detector.formatFindings(ambiguityResult));

      // Save ambiguity report
      const ambiguityJsonPath = path.join(outputDir, `${baseName}-ambiguity.json`);
      await safeWriteJSON(ambiguityJsonPath, ambiguityResult, { spaces: 2, rootDir: outputDir });
      const ambiguityMdPath = path.join(outputDir, `${baseName}-ambiguity-report.md`);
      await safeWriteText(ambiguityMdPath, detector.formatMarkdown(ambiguityResult), 'utf8', { rootDir: outputDir });
      terminalLog(chalk.dim(`  → ${ambiguityJsonPath}`));
      terminalLog(chalk.dim(`  → ${ambiguityMdPath}`));

      // Gate: block pipeline if NOT READY
      if (ambiguityResult.summary.readinessScore === 'not_ready') {
        terminalLog(chalk.red.bold('\n  Pipeline halted — requirements are not ready.'));
        terminalLog(chalk.red('  Resolve blockers with stakeholders and re-run.'));
        return;
      }

      if (ambiguityResult.summary.readinessScore === 'needs_clarification') {
        const { proceedAnyway } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceedAnyway',
            message: 'Warnings found. Proceed to structuring anyway?',
            default: true,
          },
        ]);
        if (!proceedAnyway) return;
      }

      // ═══ Phase 1: Requirement Structuring ══════════════════════════════════
      terminalLog(chalk.blue.bold('\n═══ Phase 1: Requirement Structuring ═══'));
      const parser = new RequirementsParser();
      const parsed = await parser.parse(inputFile);

      const spinner1 = ora('Structuring via LLM...').start();
      const structurer = new RequirementsStructurer();
      const structured = await structurer.structure(parsed);
      spinner1.succeed('Phase 1 complete');

      const structuredPath = path.join(outputDir, `${baseName}-structured.json`);
      await safeWriteJSON(structuredPath, structured, { spaces: 2, rootDir: outputDir });
      terminalLog(chalk.dim(`  → ${structuredPath}`));

      const { proceed: proceed1 } = await inquirer.prompt([
        { type: 'confirm', name: 'proceed', message: 'Review complete. Proceed to Phase 2?', default: true },
      ]);
      if (!proceed1) return;

      // ═══ Phase 2: UCS Template + Test Case Generation ═════════════════════
      terminalLog(chalk.blue.bold('\n═══ Phase 2: UCS Template + Test Cases ═══'));
      const spinner2 = ora('Generating UCS template...').start();
      const transformer = new UCSTransformer();
      const ucs = await transformer.transform(structured);
      spinner2.succeed('UCS template generated');

      const ucsPath = path.join(outputDir, `${baseName}-ucs.json`);
      await safeWriteJSON(ucsPath, ucs.toJSON ? ucs.toJSON() : ucs, { spaces: 2, rootDir: outputDir });

      const generator = new TestGenerator();
      const testCases = generator.generate(ucs);
      const testsPath = path.join(outputDir, `${baseName}-tests.json`);
      await safeWriteJSON(testsPath, testCases, { spaces: 2, rootDir: outputDir });

      terminalLog(chalk.dim(`  → ${ucsPath}`));
      terminalLog(chalk.dim(`  → ${testsPath} (${testCases.length} test cases)`));
      terminalLog(generator.formatSummary(testCases));

      // Generate Gherkin .feature file
      const gherkin = new GherkinGenerator();
      const ucsJSON2 = ucs.toJSON ? ucs.toJSON() : ucs;
      const featurePath = path.join(outputDir, `${baseName}.feature`);
      const safeFeaturePath = buildContainedChildPath(outputDir, path.basename(featurePath));
      await gherkin.generateFile(testCases, ucsJSON2, safeFeaturePath);
      terminalLog(chalk.dim(`  → ${safeFeaturePath} (Gherkin/BDD)`));

      const { proceed: proceed2 } = await inquirer.prompt([
        { type: 'confirm', name: 'proceed', message: 'Review complete. Proceed to Phase 3?', default: true },
      ]);
      if (!proceed2) return;

      // ═══ Phase 3: Test Case Review + Iterative Refinement ═════════════════
      terminalLog(chalk.blue.bold('\n═══ Phase 3: Feedback Loop ═══'));
      const feedbackLoop = new FeedbackLoop();
      const ucsJSON = ucs.toJSON ? ucs.toJSON() : ucs;
      const feedbackResult = await feedbackLoop.run(ucsJSON, testCases);

      let currentUCS = feedbackResult.updatedUCS;
      if (feedbackResult.suggestions.length > 0) {
        const refinedPath = path.join(outputDir, `${baseName}-ucs-refined.json`);
        await safeWriteJSON(refinedPath, currentUCS, { spaces: 2, rootDir: outputDir });
        terminalLog(chalk.dim(`  → ${refinedPath}`));
      }

      // ═══ Phase 4: Consistency Validation — Activity Diagram ════════════════
      if (opts.activity) {
        terminalLog(chalk.blue.bold('\n═══ Phase 4: Activity Diagram Consistency ═══'));
        const bpm = await fs.readJSON(path.resolve(opts.activity));
        const checker = new ConsistencyChecker();
        const processResult = checker.validateWithProcess(currentUCS, bpm);

        if (processResult.violations.length === 0) {
          terminalLog(chalk.green('  ✓ Rules 1 & 2: No violations'));
        } else {
          for (const v of processResult.violations) {
            terminalLog(chalk.red(`  ✗ Rule ${v.rule}: ${v.message}`));
          }
        }
      } else {
        terminalLog(chalk.dim('\n═══ Phase 4: Skipped (no --activity provided) ═══'));
      }

      // ═══ Phase 5: Consistency Validation — State Machine ══════════════════
      if (opts.state) {
        terminalLog(chalk.blue.bold('\n═══ Phase 5: State Machine Consistency ═══'));
        const checker = new ConsistencyChecker();
        for (const stateFile of opts.state) {
          const sm = await fs.readJSON(path.resolve(stateFile));
          const stateResult = checker.validateWithState(currentUCS, sm);

          terminalLog(chalk.cyan(`  ${sm.businessObjectName}:`));
          if (stateResult.violations.length === 0) {
            terminalLog(chalk.green('    ✓ Rule 3: No violations'));
          } else {
            for (const v of stateResult.violations) {
              terminalLog(chalk.red(`    ✗ ${v.message}`));
            }
          }
        }
      } else {
        terminalLog(chalk.dim('\n═══ Phase 5: Skipped (no --state provided) ═══'));
      }

      // ═══ Generate Human-Readable Reports ══════════════════════════════════
      terminalLog(chalk.blue.bold('\n═══ Generating Reports ═══'));

      const checker = new ConsistencyChecker();
      const validationResults = { totalViolations: 0 };

      if (opts.activity) {
        const bpm = await fs.readJSON(path.resolve(opts.activity));
        validationResults.processResult = checker.validateWithProcess(currentUCS, bpm);
        validationResults.totalViolations += validationResults.processResult.violations.length;
      }
      if (opts.state) {
        validationResults.stateResults = [];
        for (const stateFile of opts.state) {
          const sm = await fs.readJSON(path.resolve(stateFile));
          const sr = checker.validateWithState(currentUCS, sm);
          sr.businessObjectName = sm.businessObjectName;
          validationResults.stateResults.push(sr);
          validationResults.totalViolations += sr.violations.length;
        }
      }

      const reportGen = new ReportGenerator();
      const reportFiles = await reportGen.generateAll({
        ucs: ucsJSON,
        testCases,
        validationResults: (opts.activity || opts.state) ? validationResults : null,
        refinedUcs: currentUCS !== ucsJSON ? currentUCS : null,
        outputDir,
        baseName,
      });

      for (const f of reportFiles) {
        terminalLog(chalk.dim(`  → ${f}`));
      }

      terminalLog(chalk.green.bold('\n✓ Pipeline complete'));
      terminalLog(chalk.dim(`  All artifacts saved to ${outputDir}/`));
      terminalLog(chalk.cyan('\n  Human-readable reports (Markdown):'));
      for (const f of reportFiles) {
        terminalLog(chalk.cyan(`    • ${path.basename(f)}`));
      }
      terminalLog(chalk.cyan('\n  BDD/Gherkin:'));
      terminalLog(chalk.cyan(`    • ${baseName}.feature`));
    } catch (err) {
      terminalError(chalk.red(`Pipeline error: ${sanitizeErrorPayload(err && err.message ? err.message : String(err))}`));
      process.exit(1);
    }
  });

if (require.main === module) {
  program.parse();
}

module.exports = {
  sanitizeTerminalValue,
  validateStructuredResponse: require('./security').validateStructuredResponse,
  buildSafeOutputPath,
  buildContainedChildPath,
  sanitizeErrorPayload,
  safeWriteText: require('./security').safeWriteText,
  safeWriteJSON: require('./security').safeWriteJSON,
};

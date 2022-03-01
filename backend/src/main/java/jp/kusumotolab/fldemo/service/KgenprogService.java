package jp.kusumotolab.fldemo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import jp.kusumotolab.fldemo.common.FlKind;
import jp.kusumotolab.fldemo.common.Project;
import jp.kusumotolab.fldemo.data.FlResult;
import jp.kusumotolab.fldemo.data.SrcAndTests;
import jp.kusumotolab.fldemo.data.TestResultWithCoverage;
import jp.kusumotolab.kgenprog.Configuration;
import jp.kusumotolab.kgenprog.Configuration.Builder;
import jp.kusumotolab.kgenprog.Strategies;
import jp.kusumotolab.kgenprog.ga.codegeneration.DefaultSourceCodeGeneration;
import jp.kusumotolab.kgenprog.ga.selection.DefaultVariantSelection;
import jp.kusumotolab.kgenprog.ga.validation.DefaultCodeValidation;
import jp.kusumotolab.kgenprog.ga.variant.Variant;
import jp.kusumotolab.kgenprog.ga.variant.VariantStore;
import jp.kusumotolab.kgenprog.project.jdt.JDTASTConstruction;
import jp.kusumotolab.kgenprog.project.test.LocalTestExecutor;
import jp.kusumotolab.kgenprog.project.test.TestResults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class KgenprogService {

  private static final Logger logger = LoggerFactory.getLogger(KgenprogService.class);
  private Project project;

  public Map<String, FlResult> execFl(final SrcAndTests st) {
    initProject(st);
    final Variant initialVariant = createInitialVariant();

    final Map<String, FlResult> ret = new HashMap<>();
    for (final var e : FlKind.values()) {
      ret.put(e.name(),
          new FlResult(
              e.execFl(initialVariant.getGeneratedSourceCode(), initialVariant.getTestResults())));
    }
    return ret;
  }

  public List<TestResultWithCoverage> execTests(final SrcAndTests st) {
    initProject(st);
    final Variant initialVariant = createInitialVariant();
    final TestResults testResults = initialVariant.getTestResults();

    return testResults.getExecutedTestFQNs().stream().map(testResults::getTestResult)
        .map(e -> TestResultWithCoverage.valueOf(e, project.src())).toList();
  }

  private void initProject(final SrcAndTests st) {
    project = Project.build(st);
    logger.info("Built project " + project);
  }

  private Variant createInitialVariant() {
    final Configuration config = new Builder(project.projectDir(), project.srcPath(),
        project.testPath()).build();
    final Strategies strategies = new Strategies(config.getFaultLocalization()
        .initialize(), new JDTASTConstruction(), new DefaultSourceCodeGeneration(),
        new DefaultCodeValidation(), new LocalTestExecutor(config),
        new DefaultVariantSelection(config.getHeadcount(), new Random(config.getRandomSeed())));
    final VariantStore vs = new VariantStore(config, strategies);
    final Variant initialVariant = vs.getInitialVariant();

    logger.info(
        project.projectDir() + " test results\n" + initialVariant.getTestResults().toString());

    if (!initialVariant.isBuildSucceeded()) {
      logger.warn(project.projectDir().toString() + "built failed");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Build failed");
    }

    return initialVariant;
  }
}

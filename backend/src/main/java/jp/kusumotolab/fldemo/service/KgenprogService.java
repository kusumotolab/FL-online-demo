package jp.kusumotolab.fldemo.service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
import jp.kusumotolab.fldemo.common.FlKind;
import jp.kusumotolab.fldemo.data.fl.FlResult;
import jp.kusumotolab.fldemo.data.project.Project;
import jp.kusumotolab.fldemo.data.SrcDTO;
import jp.kusumotolab.fldemo.data.test.TestResultWithCoverage;
import jp.kusumotolab.kgenprog.Configuration;
import jp.kusumotolab.kgenprog.Configuration.Builder;
import jp.kusumotolab.kgenprog.Strategies;
import jp.kusumotolab.kgenprog.ga.codegeneration.DefaultSourceCodeGeneration;
import jp.kusumotolab.kgenprog.ga.selection.DefaultVariantSelection;
import jp.kusumotolab.kgenprog.ga.validation.DefaultCodeValidation;
import jp.kusumotolab.kgenprog.ga.variant.Variant;
import jp.kusumotolab.kgenprog.ga.variant.VariantStore;
import jp.kusumotolab.kgenprog.project.jdt.JDTASTConstruction;
import jp.kusumotolab.kgenprog.project.test.EmptyTestResults;
import jp.kusumotolab.kgenprog.project.test.LocalTestExecutor;
import jp.kusumotolab.kgenprog.project.test.TestResults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
public class KgenprogService {

  private Project project;

  public List<FlResult> execFl(final SrcDTO dto) {
    initProject(dto);
    final Variant initialVariant = createInitialVariant();

    return Arrays.stream(FlKind.values())
        .map(fl -> new FlResult(fl, fl.execFl(initialVariant)))
        .toList();
  }

  public List<TestResultWithCoverage> execTests(final SrcDTO dto) {
    initProject(dto);
    final Variant initialVariant = createInitialVariant();
    final TestResults testResults = initialVariant.getTestResults();

    return testResults.getExecutedTestFQNs().stream()
        .map(testResults::getTestResult)
        .map(
            e ->
                TestResultWithCoverage.valueOf(
                    e, project.src().getSrc(), project.test().getTestMethods()))
        .sorted(Comparator.comparing(TestResultWithCoverage::testOrder))
        .toList();
  }

  private void initProject(final SrcDTO dto) {
    project = Project.build(dto);
    log.info("Built project " + project);
  }

  private Variant createInitialVariant() {
    final Configuration config =
        new Builder(project.projectDir(), project.srcPath(), project.testPath()).build();
    final Strategies strategies =
        new Strategies(
            config.getFaultLocalization().initialize(),
            new JDTASTConstruction(),
            new DefaultSourceCodeGeneration(),
            new DefaultCodeValidation(),
            new LocalTestExecutor(config),
            new DefaultVariantSelection(config.getHeadcount(), new Random(config.getRandomSeed())));
    final VariantStore vs = new VariantStore(config, strategies);
    final Variant initialVariant = vs.getInitialVariant();

    log.info(project.projectDir() + " test results\n" + initialVariant.getTestResults().toString());

    if (!initialVariant.isBuildSucceeded()) {
      String errMsg = "built failed";
      if (initialVariant.getTestResults() instanceof EmptyTestResults emptyTestResults) {
        errMsg += ": " + emptyTestResults.getCause();
      }
      log.warn(project.projectDir().toString() + errMsg);
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errMsg);
    }

    return initialVariant;
  }
}

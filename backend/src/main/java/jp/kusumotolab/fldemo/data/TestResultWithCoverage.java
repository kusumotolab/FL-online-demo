package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
import jp.kusumotolab.fldemo.common.SourceUtil;
import jp.kusumotolab.kgenprog.project.FullyQualifiedName;
import jp.kusumotolab.kgenprog.project.test.TestResult;
import lombok.Data;

@Data
public class TestResultWithCoverage {

  @JsonProperty("testMethod")
  private final String testMethod;

  @JsonProperty("coverages")
  private final List<Coverage> coverages;

  @JsonProperty("executedTestFQN")
  private final String executedTestFQN;

  @JsonProperty("failed")
  private final boolean failed;

  @JsonProperty("failedReason")
  private final String failedReason;

  public static TestResultWithCoverage valueOf(final TestResult testResult, final String src) {
    final String executedTestFQN = testResult.executedTestFQN.value;
    final String testMethod = SourceUtil.inferMethodNameFromFQN(executedTestFQN);
    final boolean failed = testResult.failed;
    final String failedReason = testResult.getFailedReason();

    final List<Coverage> coverages =
        testResult.getExecutedTargetFQNs().stream()
            .map(testResult::getCoverages)
            .map(e -> makeCoverages(e, src))
            .flatMap(List::stream)
            .toList();

    return new TestResultWithCoverage(testMethod, coverages, executedTestFQN, failed, failedReason);
  }

  public static List<Coverage> makeCoverages(
      final jp.kusumotolab.kgenprog.project.test.Coverage coverage, final String src) {
    final List<Coverage> ret = new ArrayList<>();
    for (int i = 0; i < coverage.getStatusesSize(); i++) {
      final String status = coverage.getStatus(i).name();
      final int lineNumber = i + inferLineNumber(coverage.getExecutedTargetFQN(), src);
      ret.add(new Coverage(lineNumber, status));
    }
    return ret;
  }

  private static int inferLineNumber(final FullyQualifiedName fqn, final String src) {
    return 0; // todo
  }
}

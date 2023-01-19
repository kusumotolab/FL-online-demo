package jp.kusumotolab.fldemo.data.test;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
import jp.kusumotolab.kgenprog.project.FullyQualifiedName;
import jp.kusumotolab.kgenprog.project.test.TestResult;

public record TestResultWithCoverage(
    @JsonProperty("testMethod") String testMethod,
    @JsonProperty("testOrder") int testOrder,
    @JsonProperty("coverages") List<Coverage> coverages,
    @JsonProperty("executedTestFQN") String executedTestFQN,
    @JsonProperty("failed") boolean failed,
    @JsonProperty("failedReason") String failedReason) {

  public static TestResultWithCoverage valueOf(
      final TestResult testResult, final String src, final List<String> testOrderList) {
    final String executedTestFQN = testResult.executedTestFQN.value;
    final String testMethod = inferMethodNameFromFQN(executedTestFQN);
    final int testOrder = testOrderList.indexOf(testMethod);
    final boolean failed = testResult.failed;
    final String failedReason = testResult.getFailedReason();

    final List<Coverage> coverages =
        testResult.getExecutedTargetFQNs().stream()
            .map(testResult::getCoverages)
            .map(e -> makeCoverages(e, src))
            .flatMap(List::stream)
            .toList();

    return new TestResultWithCoverage(
        testMethod, testOrder, coverages, executedTestFQN, failed, failedReason);
  }

  private static List<Coverage> makeCoverages(
      final jp.kusumotolab.kgenprog.project.test.Coverage coverage, final String src) {
    final List<Coverage> ret = new ArrayList<>();
    for (int i = 0; i < coverage.getStatusesSize(); i++) {
      final String status = coverage.getStatus(i).name();
      final int lineNumber = i + inferLineNumber(coverage.getExecutedTargetFQN(), src);
      ret.add(new Coverage(lineNumber, status));
    }
    return ret;
  }

  private static String inferMethodNameFromFQN(final String FQN) {
    final int lastIndexOf = FQN.lastIndexOf('.');
    if (lastIndexOf == -1) {
      return "";
    }
    return FQN.substring(lastIndexOf + 1);
  }

  private static int inferLineNumber(final FullyQualifiedName fqn, final String src) {
    return 0; // todo
  }
}

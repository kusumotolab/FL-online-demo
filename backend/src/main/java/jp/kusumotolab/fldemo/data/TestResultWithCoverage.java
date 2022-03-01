package jp.kusumotolab.fldemo.data;

import java.util.ArrayList;
import java.util.List;
import jp.kusumotolab.kgenprog.project.FullyQualifiedName;
import jp.kusumotolab.kgenprog.project.test.TestResult;
import lombok.Data;

@Data
public class TestResultWithCoverage {

  private final String testMethod;
  private final List<Coverage> coverages;
  private final String executedTestFQN;
  private final boolean failed;
  private final String failedReason;

  public static TestResultWithCoverage valueOf(final TestResult testResult, final String src) {
    final String executedTestFQN = testResult.executedTestFQN.value;
    final String testMethod = inferMethodNameFromFQN(executedTestFQN);
    final boolean failed = testResult.failed;
    final String failedReason = testResult.getFailedReason();

    final List<Coverage> coverages = testResult.getExecutedTargetFQNs().stream()
        .map(testResult::getCoverages).map(e -> makeCoverages(e, src)).flatMap(List::stream)
        .toList();

    return new TestResultWithCoverage(testMethod, coverages, executedTestFQN, failed, failedReason);
  }

  private static String inferMethodNameFromFQN(final String FQN) {
    final int lastIndexOf = FQN.lastIndexOf('.');
    if (lastIndexOf == -1) {
      return "";
    }
    return FQN.substring(lastIndexOf + 1);
  }

  public static List<Coverage> makeCoverages(jp.kusumotolab.kgenprog.project.test.Coverage coverage,
      final String src) {
    final List<Coverage> ret = new ArrayList<>();
    for (int i = 0; i < coverage.getStatusesSize(); i++) {
      final String status = coverage.getStatus(i).name();
      final int lineNumber = i + inferLineNumber(coverage.getExecutedTargetFQN(), src);
      ret.add(new Coverage(lineNumber, status));
    }
    return ret;
  }

  private static int inferLineNumber(final FullyQualifiedName fqn, final String src) {
    return 0;//todo
  }

}

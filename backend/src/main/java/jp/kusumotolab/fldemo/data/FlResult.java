package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jp.kusumotolab.kgenprog.fl.Suspiciousness;

public class FlResult {

  @JsonProperty("suspiciousnesses")
  private final Map<Integer, Double> suspiciousnesses;

  public FlResult(List<Suspiciousness> ss) {
    suspiciousnesses =
        ss.stream()
            .collect(
                Collectors.toMap(
                    e -> e.getLocation().inferLineNumbers().start,
                    Suspiciousness::getValue)); // todo 情報落ち
  }

  public Map<Integer, Double> getSuspiciousnesses() {
    return suspiciousnesses;
  }
}
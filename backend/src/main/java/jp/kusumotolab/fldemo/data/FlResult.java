package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import jp.kusumotolab.fldemo.common.FlKind;

public record FlResult(
    @JsonProperty("technique") String technique,
    @JsonProperty("suspiciousnesses") List<Suspiciousness> suspiciousnesses) {
  public FlResult(final FlKind tech, final List<jp.kusumotolab.kgenprog.fl.Suspiciousness> ss) {
    this(tech.name(), ss.stream().map(susp -> new Suspiciousness(susp, tech)).toList());
  }
}

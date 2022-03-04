package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Data;

@Data
public class FlResult {

  @JsonProperty("technique")
  private final String technique;

  @JsonProperty("suspiciousnesses")
  private final List<Suspiciousness> suspiciousnesses;

  public FlResult(final String tech, final List<jp.kusumotolab.kgenprog.fl.Suspiciousness> ss) {
    this.technique = tech;
    suspiciousnesses =
        ss.stream()
            .map(
                e ->
                    new Suspiciousness(
                        e.getLocation().inferLineNumbers().start, e.getValue())) // todo 情報落ち
            .toList();
  }
}

package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import jp.kusumotolab.fldemo.common.FlKind;
import lombok.Data;

@Data
public class FlResult {

  @JsonProperty("technique")
  private final String technique;

  @JsonProperty("suspiciousnesses")
  private final List<Suspiciousness> suspiciousnesses;

  public FlResult(final FlKind tech, final List<jp.kusumotolab.kgenprog.fl.Suspiciousness> ss) {
    this.technique = tech.name();
    this.suspiciousnesses =
        ss.stream()
            .map(
                e ->
                    new Suspiciousness(
                        e.getLocation().inferLineNumbers().start, // todo 情報落ち
                        e.getValue(),
                        tech.normalize(e.getValue())))
            .toList();
  }
}

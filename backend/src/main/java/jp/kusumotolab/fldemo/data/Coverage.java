package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Coverage {

  @JsonProperty("lineNumber")
  private final int lineNumber;

  @JsonProperty("status")
  private final String status;
}

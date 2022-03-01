package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.NotBlank;

public record SrcAndTests(@NotBlank @JsonProperty("src") String src, @NotBlank  @JsonProperty("test") String test) {

}

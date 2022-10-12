package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Coverage")
public record Coverage(
    @Schema(required = true, description = "line number", example = "1") @JsonProperty("lineNumber")
        int lineNumber,
    @Schema(
            required = true,
            description = "status of coverage. The value is EMPTY, COVERED, or NOT_COVERED.",
            example = "COVERED")
        @JsonProperty("status")
        String status) {}

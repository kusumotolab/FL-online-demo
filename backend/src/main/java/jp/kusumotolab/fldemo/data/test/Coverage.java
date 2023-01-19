package jp.kusumotolab.fldemo.data.test;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(description = "Coverage")
public record Coverage(
    @Schema(requiredMode = RequiredMode.REQUIRED, description = "line number", example = "1")
        @JsonProperty("lineNumber")
        int lineNumber,
    @Schema(
            requiredMode = RequiredMode.REQUIRED,
            description = "status of coverage. The value is EMPTY, COVERED, or NOT_COVERED.",
            example = "COVERED")
        @JsonProperty("status")
        String status) {}

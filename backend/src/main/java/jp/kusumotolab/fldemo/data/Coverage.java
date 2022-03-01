package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Coverage(@JsonProperty("lineNumber") int lineNumber,
                       @JsonProperty("status") String status) {

}

package jp.kusumotolab.fldemo.data;

import javax.validation.constraints.NotBlank;

public record SrcAndTests(@NotBlank String src, @NotBlank String test) {

}

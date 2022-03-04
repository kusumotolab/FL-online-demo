package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotBlank;

@Schema(description = "source and tests to exec")
public record SrcAndTests(
    @Schema(required = true, description = "source code to exec", example = "package example;\n\npublic class CloseToZero {\n\n  /* Increase or reduce the given value to be close to zero. */\n  public static int run(int n) {\n    if (n == 0) {\n      n++; // a bug here. zero should be zero\n    } else if (n > 0) {\n      n--;\n    } else {\n      n++;\n    }\n    return n;\n  }\n\n}")
    @NotBlank
    @JsonProperty("src")
    String src,

    @Schema(required = true, description = "test code to exec", example = "package example;\n\nimport static org.junit.Assert.assertEquals;\nimport org.junit.Test;\n\npublic class CloseToZeroTest {\n  @Test\n  public void test01() {\n    assertEquals(4, CloseToZero.run(5));\n  }\n\n  @Test\n  public void test02() {\n    assertEquals(0, CloseToZero.run(0));\n  }\n\n  @Test\n  public void test03() {\n    assertEquals(-4, CloseToZero.run(-5));\n  }\n\n}")
    @NotBlank
    @JsonProperty("test")
    String test) {

}

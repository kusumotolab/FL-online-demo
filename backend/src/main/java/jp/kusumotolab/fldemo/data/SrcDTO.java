package jp.kusumotolab.fldemo.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Objects;
import javax.validation.constraints.NotBlank;

@Schema(description = "source and tests to exec")
public record SrcDTO(
    @Schema(
            required = true,
            description = "source code to exec",
            example =
                "package example;\n\npublic class CloseToZero {\n\n  /* Increase or reduce the given value to be close to zero. */\n  public static int run(int n) {\n    if (n == 0) {\n      n++; // a bug here. zero should be zero\n    } else if (n > 0) {\n      n--;\n    } else {\n      n++;\n    }\n    return n;\n  }\n\n}")
        @NotBlank
        @JsonProperty("src")
        String src,
    @Schema(
            required = true,
            description = "test code to exec",
            example =
                "package example;\n\nimport static org.junit.Assert.assertEquals;\nimport org.junit.Test;\n\npublic class CloseToZeroTest {\n  @Test\n  public void test01() {\n    assertEquals(4, CloseToZero.run(5));\n  }\n\n  @Test\n  public void test02() {\n    assertEquals(0, CloseToZero.run(0));\n  }\n\n  @Test\n  public void test03() {\n    assertEquals(-4, CloseToZero.run(-5));\n  }\n\n}")
        @NotBlank
        @JsonProperty("test")
        String test) {

  public static class Builder {
    private String src;
    private String test;

    public Builder srcFromPath(String srcPath) throws IOException {
      this.src = Files.readString(Paths.get(srcPath));
      return this;
    }

    public Builder testFromPath(String testPath) throws IOException {
      this.test = Files.readString(Paths.get(testPath));
      return this;
    }

    public SrcDTO build() {
      Objects.requireNonNull(this.src);
      Objects.requireNonNull(this.test);

      return new SrcDTO(src, test);
    }
  }
}

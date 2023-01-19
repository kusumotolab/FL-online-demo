package jp.kusumotolab.fldemo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import jp.kusumotolab.fldemo.data.SrcDTO;

public class TestUtil {

  public static SrcDTO buildFromFiles(final String srcPath, final String testPath)
      throws IOException {
    final var src = Files.readString(Paths.get(srcPath));
    final var test = Files.readString(Paths.get(testPath));

    return new SrcDTO(src, test);
  }
}

package jp.kusumotolab.fldemo.common;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import jp.kusumotolab.fldemo.data.SrcAndTests;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Log
public record Project(String src, String srcFQN, String srcClassName, String srcPackageName,
                      String test, String testFQN, String testClassName, String testPackageName,
                      Path projectDir, Path srcPath, Path testPath) {

  public static Project build(final SrcAndTests st) {
    final String src = st.src();
    final String srcPackageName = SourceUtil.inferPackageName(src);
    final String srcClassName = SourceUtil.inferClassName(src);
    final String srcFQN = SourceUtil.inferFQN(src);
    final String test = st.test();
    final String testPackageName = SourceUtil.inferPackageName(test);
    final String testClassName = SourceUtil.inferClassName(test);
    final String testFQN = SourceUtil.inferFQN(test);

    Path projectDir;
    Path srcPath;
    Path testPath;

    try {
      projectDir = Files.createTempDirectory("fldemo_");

      final Path srcDir = projectDir.resolve(srcPackageName);
      Files.createDirectories(srcDir);

      srcPath = projectDir.resolve(srcFQN);
      Files.writeString(srcPath, src);

      testPath = projectDir.resolve(testFQN);
      Files.writeString(testPath, test);
    } catch (IOException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return new Project(src, srcFQN, srcClassName, srcPackageName, test, testFQN, testClassName,
        testPackageName, projectDir, srcPath, testPath);
  }

}

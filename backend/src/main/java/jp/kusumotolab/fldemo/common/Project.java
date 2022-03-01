package jp.kusumotolab.fldemo.common;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jp.kusumotolab.fldemo.data.SrcAndTests;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public record Project(String src, String srcFQN, String srcClassName, String srcPackageName,
                      String test, String testFQN, String testClassName, String testPackageName,
                      Path projectDir, Path srcPath, Path testPath) {

  static final Logger logger = LoggerFactory.getLogger(Project.class);

  public static Project build(final SrcAndTests st) {
    final String src = st.src();
    final String srcPackageName = inferPackageName(src);
    final String srcClassName = inferClassName(src);
    final String srcFQN = inferFQN(src);
    final String test = st.test();
    final String testPackageName = inferPackageName(test);
    final String testClassName = inferClassName(test);
    final String testFQN = inferFQN(test);

    Path projectDir = null;
    Path srcPath = null;
    Path testPath = null;

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

  public static String inferFQN(final String src) {
    return inferPackageName(src).replace('.', File.separatorChar) + File.separatorChar
        + inferClassName(src) + ".java";
  }

  public static String inferClassName(final String src) {
    final String s = extractByRegex(src, ".*class\\s+([^{\\s]+)\\s*\\{");
    return verifyOrThrow(s, "Can not infer class name");
  }

  public static String inferPackageName(final String src) {
    final String s = extractByRegex(src, "^\\s*package\\s+(.+);");
    return verifyOrThrow(s, "Can not infer package name");
  }

  public static String extractByRegex(final String target, final String regex) {
    final Pattern p = Pattern.compile(regex);
    final Matcher m = p.matcher(target);
    return m.find() ? m.group(1) : "";
  }

  private static String verifyOrThrow(final String s, final String reason) {
    if (s.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, reason);
    }

    return s;
  }
}

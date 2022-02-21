package jp.kusumotolab.fldemo.common;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jp.kusumotolab.fldemo.model.SrcAndTests;

public record Project(String src, String srcFQN, String srcClassName, String srcPackageName,
                      String test, String testFQN, String testClassName, String testPackageName,
                      Path projectDir, Path srcPath, Path testPath) {

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
      e.printStackTrace();
    }

    return new Project(src, srcFQN, srcClassName, srcPackageName, test, testFQN, testClassName,
        testPackageName, projectDir, srcPath, testPath);
  }

  public static String inferFQN(final String src) {
    return inferPackageName(src).replace('.', File.separatorChar) + File.separatorChar
        + inferClassName(src) + ".java";
  }

  public static String inferClassName(final String src) {
    return extractByRegex(src, ".*class\\s+([^{\\s]+)\\s*\\{");
  }

  public static String inferPackageName(final String src) {
    return extractByRegex(src, "^\\s*package\\s+(.+);");
  }

  public static String extractByRegex(final String target, final String regex) {
    final Pattern p = Pattern.compile(regex);
    final Matcher m = p.matcher(target);
    return m.find() ? m.group(1) : "";
  }
}

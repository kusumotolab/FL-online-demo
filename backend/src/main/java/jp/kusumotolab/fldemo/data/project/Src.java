package jp.kusumotolab.fldemo.data.project;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Getter
public class Src {

  private final String src;
  private final String fqn;
  private final String className;
  private final String packageName;

  public Src(final String src) {
    this(src, inferFQN(src), inferClassName(src), inferPackageName(src));
  }

  private static String inferFQN(final String src) {
    return inferPackageName(src).replace('.', File.separatorChar)
        + File.separatorChar
        + inferClassName(src)
        + ".java";
  }

  private static String inferClassName(final String src) {
    final String s = extractByRegex(src, ".*class\\s+([^{\\s]+)\\s*\\{");
    return verifyOrThrow(s, "Can not infer class name");
  }

  private static String inferPackageName(final String src) {
    final String s = extractByRegex(src, "^\\s*package\\s+(.+);");
    return verifyOrThrow(s, "Can not infer package name");
  }

  private static String extractByRegex(final String target, final String regex) {
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

  public Path createSrcFile(final Path parentPath) throws IOException {
    final Path srcPath = parentPath.resolve(this.getFqn());
    Files.createDirectories(srcPath.getParent());
    Files.writeString(srcPath, this.getSrc());
    return srcPath;
  }
}

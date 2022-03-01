package jp.kusumotolab.fldemo.common;

import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class SourceUtil {

  public static String inferFQN(final String src) {
    return inferPackageName(src).replace('.', File.separatorChar)
        + File.separatorChar
        + inferClassName(src)
        + ".java";
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

  public static String inferMethodNameFromFQN(final String FQN) {
    final int lastIndexOf = FQN.lastIndexOf('.');
    if (lastIndexOf == -1) {
      return "";
    }
    return FQN.substring(lastIndexOf + 1);
  }

  private static String verifyOrThrow(final String s, final String reason) {
    if (s.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, reason);
    }
    return s;
  }
}

package jp.kusumotolab.fldemo.data.project;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Getter
public class Test extends Src {
  final List<String> testMethods;

  public Test(String src) {
    super(src);
    testMethods = inferAndValidateTestMethods(src);
  }

  private static List<String> inferAndValidateTestMethods(String test) {
    final List<String> testMethods = inferTestMethodNames(test);
    if (testMethods.size() == 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to find test Methods");
    }
    return testMethods;
  }

  private static List<String> inferTestMethodNames(final String test) {
    final Pattern p = Pattern.compile("@Test\\s*(public )?void (\\S+)\\(\\)");
    final Matcher m = p.matcher(test);
    if (!m.find()) return Collections.emptyList();
    final List<String> testMethodName = new ArrayList<>();
    do {
      testMethodName.add(m.group(2));
    } while (m.find());
    return testMethodName;
  }
}

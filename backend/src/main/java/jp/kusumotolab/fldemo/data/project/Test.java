package jp.kusumotolab.fldemo.data.project;

import java.util.List;
import jp.kusumotolab.fldemo.common.SourceUtil;
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
    final List<String> testMethods = SourceUtil.inferTestMethodNames(test);
    if (testMethods.size() == 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to find test Methods");
    }
    return testMethods;
  }
}
